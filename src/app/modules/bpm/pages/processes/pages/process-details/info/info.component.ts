import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { AppStore } from "src/app/stores/app.store";
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ProcessStore } from "../../../../../../../stores/bpm/process/processes.store";
import { ProcessService } from "../../../../../../../core/services/bpm/process/process.service";
import { BpmFileService } from "../../../../../../../core/services/bpm/bpm-file/bpm-file.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ActivityService } from "src/app/core/services/bpm/process/activity/activity.service";
import { ActivityStore } from "../../../../../../../stores/bpm/process/activity.store";
import { DesignationService } from "../../../../../../../core/services/masters/human-capital/designation/designation.service";
import { DesignationMasterStore } from "../../../../../../../stores/masters/human-capital/designation-master.store";
import { UsersService } from "../../../../../../../core/services/human-capital/user/users.service";
import { UsersStore } from "../../../../../../../stores/human-capital/users/users.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import * as htmlToImage from 'html-to-image';
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { DocumentFileService } from "src/app/core/services/knowledge-hub/documents/document-file.service";
declare var $: any;

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"],
})
export class InfoComponent implements OnInit {
  @ViewChild("popup") popup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild("activityDetailsModal") activityDetailsModal: ElementRef;
  @ViewChild("activityModal") activityModal: ElementRef;
  @ViewChild("deletePopup") deletePopup: ElementRef;
  @ViewChild('controlShow') controlShow: ElementRef;
  @ViewChild('activityShow') activityShow: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ProcessStore = ProcessStore;
  ActivityStore = ActivityStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  DesignationMasterStore = DesignationMasterStore;
  UsersStore = UsersStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  hover = false;
  selectedItem = null;
  openAll=false;
  downloadMessage: string = 'downloading';
  emptyMessage = "";

  fileUploadsArray: any = []; // Display Mutitle File Loaders
  // Preview
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  deleteObject = {
    title: "",
    id: null,
    subtitle: "",
    type:"Delete"
  };

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }

  activityId: number=null;
  
  dummyArray: any=[];
  processActivityArray:any=[];
  responsibleUserObject = [];
  accountableUserObject = [];

  responsibleActiveIndex = null;
  accountableActiveIndex = null;
  consultedActiveIndex = null;
  informedActiveIndex = null;

  deleteEventSubscription: any;
  activityDetailsEventSubscription: any;

  activityForm: FormGroup;
  desigId: string;
  formErrors: any;
  previous_activity_id: number;
  previous_output: string;
  responsible_users: any = [];
  accountable_user: number;
  saveData: any;

  indexPos:number=0;
  arrayClass=[
    'edit-option',
    'edit-option down-arrow-light-right',
    'edit-option top-arrow-dark-right main-arrow-left-first',
    'edit-option main-arrow-left-middle',
    'edit-option down-arrow-dark-left main-arrow-left-last',
    'edit-option top-arrow-dark-left' ,
    'edit-option'
  ];

  constructor(
    private _prcoessService: ProcessService,
    private _bpmFileService: BpmFileService,
    private _imageService: ImageServiceService,
    private _route: Router,
    private _renderer2: Renderer2,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _activityService: ActivityService,
    private _designationService: DesignationService,
    private _userSerivce: UsersService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private route: ActivatedRoute,
    private _documentFileService: DocumentFileService,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title:"common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText: 'add_new_activity'});
    this.reactionDisposer = autorun(() => {

      AppStore.showDiscussion = false;

      var subMenuItems = [
        { activityName: 'UPDATE_PROCESS', submenuItem: { type: 'edit_modal' } },
        // { activityName: null, submenuItem: { type: 'export_to_excel' } },
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_ACTIVITY')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.edit();
              this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
            case "export_to_excel":
              this.exportProcessDetails();
              break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openActivityForm();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    // this.getUserDetails()

    SubMenuItemStore.setNoUserTab(true);
    // SubMenuItemStore.setSubMenuItems([
    //   { type: "edit_modal" },
    //   { type: "close", path: "../" },
    // ]);

    this.getDesignations();
    //this.getActivites();
    // this.getAccountableUsers();
    this.getResponsibleUsers();

    this.activityForm = this._formBuilder.group({
      id: null,
      designation_id: ["", Validators.required],
      previous_process_activity_id: [""],
      accountable_user_id: [""],
      responsible_user_ids: [""],
      activity_input: [""],
      activity_output: [""],
      title: ["", [Validators.required, Validators.maxLength(500)]],
      description: [""],
      process_activity_documents: [""],
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.deleteActivity(item);
      }
    );
    this.activityDetailsEventSubscription = this._eventEmitterService.activityDetailsmodalDismiss.subscribe(res => {
      this.closeActivityDetailsModal()
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {

      window.addEventListener('click',this.clickEvent,false)
      
    }, 1000);

    this.getActivity(1);
    
  }

  getActivity(newpage: number) {
    this.processActivityArray = [];
    if (newpage) ActivityStore.setCurrentPage(newpage);
    this._activityService.getAllItems().subscribe((res) => {
      setTimeout(() => {
        this.dummyArray=ActivityStore.activitiesList;
        this.processActivityArrayLoop();
        this.getLastOutPut(res);
        if (ActivityStore.loaded && ActivityStore.activitiesList.length > 0) {
          this.getActivityDetails(ActivityStore.activitiesList[0].id, 0,);
        }
        this._utilityService.detectChanges(this._cdr);
      }, 100);
    });
  }

  processActivityArrayLoop(){
   for (let index = 0; index < this.dummyArray.length; index++) {
    const element = this.dummyArray[index];
    if(index!=0){
      this.processActivityArray.push({
        ...element,
        class:this.getClass(index)
      })
    }
    else{
      this.processActivityArray.push({
        ...element,
        class:'edit-option'
      })
    }
   }
  }

  getClass(num) {
    if(num!=0){
    let value=this.arrayClass[this.indexPos];
    this.indexPos++;
      if(this.indexPos==6){
        this.indexPos=0;
      }
      return value;
    }
    else return 'edit-option'
  }

  lastDataClass(str){
    if(str=='edit-option down-arrow-light-right'){
      return '';
    }else if(str=='edit-option down-arrow-dark-left main-arrow-left-last'){
      return 'edit-option main-arrow-left-last';
    }else{
      return str;
    }
  }

  setLabelColor(data) {
 
    let className = 'indication-text indication-text-lg '
    if (data.control_efficiency_measure) {
      switch (data.control_efficiency_measure.label) {
        case 'light-green-dot':
          className=className+' '+'color-light-green'
          break;
        case 'green-dot':
          className = className + ' ' + 'color-green'
          break;
        case 'orange-dot':
          className = className + ' ' + 'color-orange'
          break;
        case 'red-dot':
          className = className + ' ' + 'color-red'
          break; 
        default:
          break;
      }
    }
    else {
      className = className
    }
  

    return className
  }

  edit() {
    this._prcoessService
      .getItemById(ProcessStore.process_id)
      .subscribe((res) => {
        this._router.navigateByUrl("/bpm/process/edit-process");
        this._utilityService.detectChanges(this._cdr);
      });
  }

  delete(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.title = "Delete Activity?";
    this.deleteObject.subtitle = "common_delete_subtitle";

    $(this.deletePopup.nativeElement).modal("show");
  }

  /**
   * Delete Control
   * @param id -Control id
   */
  deleteActivity(status) {
    if (status) {
      if (this.deleteObject.id != null) {
        this._activityService
          .delete(ProcessStore.process_id, this.deleteObject.id)
          .subscribe((resp) => {
            // this.getActivites();
            this.getActivity(null);
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.clearDeleteObject();
          });
      }
    } else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal("hide");
    }, 250);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    // this.deleteObject.title = "";
    // this.deleteObject.subtitle = "";
  }

  // getAccountableUsers() {
  //   let param = '';
  //   param = this.activityForm.value.designation_id ? '?designation_ids='+this.activityForm.value.designation_id : '';
  //   // if (this.activityForm.value.designation_id) {
     
  //   //   param = '?designation_ids='+this.activityForm.value.designation_id
  //     this._userSerivce.getAllItems(param).subscribe((res) => {
  //       this._utilityService.detectChanges(this._cdr);
  //     });
  //   // } else
  //   if(!this.activityForm.value.designation_id){
  //     UsersStore.setAllUsers([])
  //   }
    
  // }

  getAccountableUsers() {
 
    if (this.activityForm.value.designation_id) {
      let param = '';
      param = this.activityForm.value.designation_id ? '?designation_ids='+this.activityForm.value.designation_id : '';
      this._userSerivce.getAllItems(param).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else
    UsersStore.setAllUsers([])
  }

  searchUsers(e) {
    this._userSerivce.searchUsers("?q=" + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchListclickValueClear(event) {
    return event.searchTerm='';
  }

  

  searchAccountableUsers(e) {
    
    let param = '';
    param = this.activityForm.value.designation_id ? '&designation_ids='+this.activityForm.value.designation_id : '';

    this._userSerivce.searchUsers("?q=" + e.term + param).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // Function to Dynamicallly Set Class to Accordion List

  setControlAccordion(index: number) {
    this.ProcessStore.setControlAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  getActivityDetails(id: number, index: number, initial: boolean = false) {
    this.accountableUserObject = [];
    this.responsibleUserObject = [];
    ActivityStore.unsetActivityDetails();

    for (let i = 0; i < ActivityStore.activitiesList.length; i++) {
      if (
        (ActivityStore.activitiesList[i].is_accordion_active == false &&
          i == index) ||
        initial
      ) {
        this._activityService.getItemById(id).subscribe((res) => {
          let responsibleUser = res.responsible_user;

          responsibleUser.forEach((element) => {
            this.responsibleUserObject.push({
              designation: element.designation,
              email: element.email,
              first_name: element.first_name,
              last_name: element.last_name,
              image: {
                token: element.image.token,
              },
            });
          });

          // Changing the Reference So as to detect in child component(ngOnChanges)
          const tempResponsibleArray = [...this.responsibleUserObject];
          this.responsibleUserObject = [];
          this.responsibleUserObject = tempResponsibleArray;

          if (res.accountable_user) {
            let accountableUser = res.accountable_user;

            this.accountableUserObject.push({
              designation: accountableUser.designation,
              email: accountableUser.email,
              first_name: accountableUser.first_name,
              last_name: accountableUser.last_name,
              image: {
                token: accountableUser.image.token,
              },
            });

            // Changing the Reference So as to detect in child component(ngOnChanges)
            const tempAccountable = [...this.accountableUserObject];
            this.accountableUserObject = [];
            this.accountableUserObject = tempAccountable;
          }

          this._utilityService.detectChanges(this._cdr);
        });
        break;
      }
    }
    this.ActivityStore.setActivityAccordion(index);
    this._utilityService.detectChanges(this._cdr);
  }

  eventChange(designation_id) {
    this.activityForm.controls["accountable_user_id"].reset()
    this.desigId = `?designation_ids=${designation_id}`;
    this.getResponsibleUsers();
    this.getAccountableUsers();
  }

  getResponsibleUsers() {
    this._userSerivce.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getActivites() {
    this._activityService.getAllItems().subscribe((res) => {
      this.getLastOutPut(res);
      this._utilityService.detectChanges(this._cdr);
    }); 
  }

  getLastOutPut(res)
  {
    if (res["data"].length > 0) {
      let [previousItem] = res["data"].slice(-1);
      this.previous_activity_id = previousItem.id;
      this.previous_output = previousItem.activity_output;
    } else {
      this.previous_activity_id = null;
      this.previous_output = null;
    }
  
  }

  getDesignations() {
    this._designationService.getItems().subscribe();
  }

  searchDesignations(event){
    if(event){
      this._designationService.getItems(false,'q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  // Returns default image url
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  /**
   * View Catalogue
   * @param process Process Details
   * @param ProcessDocument Document Details
   */
  viewProcessDocument(type, product, ProcessDocument) {
    switch (type) {
      case "document":
        this._bpmFileService
          .getFilePreview("process-document", product.id, ProcessDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.openPreviewModal(type, resp, ProcessDocument, product);
            this.previewObject.component = "process-document";
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "flow":
        this._bpmFileService
          .getFilePreview("flow-document", product.id, ProcessDocument.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.previewObject.component = "flow-document";
            this.openPreviewModal(type, resp, ProcessDocument, product);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "activity":
        this._bpmFileService
          .getFilePreview(
            "process-activities",
            product.process_id,
            product.id,
            ProcessDocument.id
          )
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              ProcessDocument.name
            );
            this.previewObject.component = "process-activities";
            this.openPreviewModal(type, resp, ProcessDocument, product);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "document":
        this._bpmFileService
          .getFilePreview('process-document', documents.id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.previewObject.component = "process-document";
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

        case "document-version":
          this._documentFileService
            .getFilePreview(type, documents.document_id, documentFile.id)
            .subscribe((res) => {
              var resp: any = this._utilityService.getDownLoadLink(
                res,
                documents.title
              );
              this.previewObject.component = "document-version";
              this.openPreviewModal(type, resp, documentFile, documents);
            }),
            (error) => {
              if (error.status == 403) {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Permission Denied"
                );
              } else {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Unable to generate Preview"
                );
              }
            };
          break;

          case "flow":
         this._bpmFileService
          .getFilePreview("flow-document", documents.id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.name
            );
            this.previewObject.component = "flow-document";
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
               "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "activity":
         this._bpmFileService
          .getFilePreview(
            "process-activities",
            documents.process_id,
            documents.id,
            documentFile.id
          )
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.name
            );
            this.previewObject.component = "process-activities";
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
             );
            }
          };
        break;

    }
  }

  // File Preview,Download Starts Here
  downloadDocumentFile(type, document, docs?) {
    console.log(type,document,docs)
    event.stopPropagation();
    switch (type) {
      case "document":
        this._bpmFileService.downloadFile(
          "process-document",
          document.audit_plan_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
        case "activity":
        this._bpmFileService.downloadFile(
          "process-activities",
          document.process_id,
          document.id,
          document.id,
          document.name,
          document
        );
        break;
    }
  }

  /**
   * Download Process Documents
   * @param processId Process Id
   * @param ProcessDocument Process Document Details
   */

  downloadProcessDocument(type, process, ProcessDocument) {
    event.stopPropagation();
    switch (type) {
      case "document":
        this._bpmFileService.downloadFile(
          "process-document",
          process.id,
          ProcessDocument.id,
          null,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
      case "flow":
        this._bpmFileService.downloadFile(
          "flow-document",
          process.id,
          ProcessDocument.id,
          null,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
      case "activity":
        this._bpmFileService.downloadFile(
          "process-activities",
          process.process_id,
          process.id,
          ProcessDocument.id,
          ProcessDocument.name,
          ProcessDocument
        );
        break;
    }
  }

  // To Download All Documents
  downloadAllProcessessDocument(type, processId?, activityId?) {
    switch (type) {
      case "document":
        this._bpmFileService.downloadFile(
          "process-document-all",
          processId,
          null,
          "all-process-files"
        );
        break;
      case "flow":
        this._bpmFileService.downloadFile(
          "flow-document-all",
          processId,
          null,
          "flow-document-all"
        );
        break;
      case "activity":
        this._bpmFileService.downloadFile(
          "process-activities-all",
          processId,
          activityId,
          "process-activities-all"
        );
    }
  }

  
  exportProcessDetails() {
    this.openAll = true
    this.openAllTab();
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {


      let element: HTMLElement;
      element = document.getElementById("info");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
        .then(function (dataUrl) {
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            pthis.downloadPdf(base64data);
          }
        });
    }, 1000);
  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.openAll = false;
      this.openAllTab();
      
      this.closeLoaderPopUp();
    })
  }


  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  createPreviewUrl(token) {
    return this._prcoessService.getThumbnailPreview(token);
  }
  /**
   * Sets details of brochure in preview object and opens preview
   * @param filePreview download url of the file
   * @param ProcessDocument details of the Document
   * @param Process details the the corresponding process
   */
  openPreviewModal(type, filePreview, ProcessDocument, Process) {
    switch (type) {
      case "flow":
        this.previewObject.component = "flow-document";
        break;
      case "document":
        this.previewObject.component = "process-document";
        break;
      case "activity":
        this.previewObject.component = "process-activities";
        break;
      default:
        break;
    }

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = ProcessDocument;
      if (type == "activity") {
        this.previewObject.componentId = Process.process_id;
      } else {
        this.previewObject.componentId = Process.id;
      }

      this.previewObject.uploaded_user =
        Process.updated_by?.length > 0 ? Process.updated_by : Process.created_by;
      this.previewObject.created_at = Process.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }
  *// Closes from preview
    closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  openActivityDetailsModal(id) {
    this.activityId = id;
    setTimeout(() => {
      $(this.activityDetailsModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  closeActivityDetailsModal() {
    $(this.activityDetailsModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.activityDetailsModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this.activityId  = null;
    this._utilityService.detectChanges(this._cdr);
  }

  gotoUserDetails(userDetails) {
    this._route.navigateByUrl("/human-capital/users/" + userDetails.id);
  }

  
  clickEvent = (event: any): void => {
    this.accountableActiveIndex = null;
    this.responsibleActiveIndex = null;
    this.consultedActiveIndex = null;
    this.informedActiveIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr)
  }

  mouseHover(event, index, type) {
    switch (type) {
      case "accountable":
        if (
          this.accountableActiveIndex >= 0 &&
          this.accountableActiveIndex == index
        ) {
          this.accountableActiveIndex = null;
          this.hover = false;
        } else {
          this.accountableActiveIndex = index;
          this.hover = true;
          if (this.popup) {
            this._renderer2.setStyle(
              this.popup.nativeElement,
              "display",
              "block"
            );
          }
        }
        this.responsibleActiveIndex = null;
        this.consultedActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case "responsible":
        if (
          this.responsibleActiveIndex >= 0 &&
          this.consultedActiveIndex == index
        ) {
          this.responsibleActiveIndex = null;
          this.hover = false;
        } else {
          this.responsibleActiveIndex = index;
          this.hover = true;
          if (this.popup) {
            this._renderer2.setStyle(
              this.popup.nativeElement,
              "display",
              "block"
            );
          }
        }
        this.accountableActiveIndex = null;
        this.consultedActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case "consulted":
        if (
          this.consultedActiveIndex >= 0 &&
          this.consultedActiveIndex == index
        ) {
          this.consultedActiveIndex = null;
          this.hover = false;
        } else {
          this.consultedActiveIndex = index;
          this.hover = true;
          if (this.popup) {
            this._renderer2.setStyle(
              this.popup.nativeElement,
              "display",
              "block"
            );
          }
        }
        this.responsibleActiveIndex = null;
        this.accountableActiveIndex = null;
        this.informedActiveIndex = null;
        break;
      case "informed":
        if (
          this.informedActiveIndex >= 0 &&
          this.informedActiveIndex == index
        ) {
          this.informedActiveIndex = null;
          this.hover = false;
        } else {
          this.informedActiveIndex = index;
          this.hover = true;
          if (this.popup) {
            this._renderer2.setStyle(
              this.popup.nativeElement,
              "display",
              "block"
            );
          }
        }
        this.responsibleActiveIndex = null;
        this.consultedActiveIndex = null;
        this.accountableActiveIndex = null;
        break;
    }
  }

  mouseOut(event) {
    this.responsibleActiveIndex = null;
    this.consultedActiveIndex = null;
    this.informedActiveIndex = null;
    this.hover = false;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    }

  }


  // // Returns image url according to type and token
  // createImageUrl(type, token) {
  //   return this._bpmFileService.getThumbnailPreview(type, token);
  // }

// Returns image url according to type and token
createImageUrl(type, token) {
  if(type=='document-version')
  return this._documentFileService.getThumbnailPreview(type, token);
  else
  return this._bpmFileService.getThumbnailPreview(type, token);

}

  // Activity Form
  openActivityForm() {
    ActivityStore.Editflag = false;
    this.formErrors = null;
    this.activityForm.reset();
    this.activityForm.markAsPristine();
    this.activityForm.patchValue({
      activity_input: this.previous_output ? this.previous_output : "",
    });
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.activityModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(
        selectedFiles,
        type
      ); // Assign Files to Multiple File Uploads Array
      Array.prototype.forEach.call(temporaryFiles, (elem) => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append("file", file);
          var typeParams = type == "logo" ? "?type=logo" : "?type=support-file";
          this._imageService
            .uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
            .subscribe(
              (res: HttpEvent<any>) => {
                let uploadEvent: any = res;
                switch (uploadEvent.type) {
                  case HttpEventType.UploadProgress:
                    // Compute and show the % done;
                    if (uploadEvent.loaded) {
                      let upProgress = Math.round(
                        (100 * uploadEvent.loaded) / uploadEvent.total
                      );
                      this.assignFileUploadProgress(upProgress, file);
                    }
                    this._utilityService.detectChanges(this._cdr);
                    break;
                  case HttpEventType.Response:
                    //return event;
                    let temp: any = uploadEvent["body"];
                    temp["is_new"] = true;
                    this.assignFileUploadProgress(null, file, true);
                    this._imageService
                      .getPreviewUrl(temp.thumbnail_url)
                      .subscribe(
                        (prew) => {
                          //Generate preview url using thumbnail url returns blob
                          this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                        },
                        (error) => {
                          this.assignFileUploadProgress(null, file, true);
                          this._utilityService.detectChanges(this._cdr);
                        }
                      );
                }
              },
              (error) => {
                this._utilityService.showErrorMessage(
                  "Failed",
                  "Sorry file upload failed"
                );
                this.assignFileUploadProgress(null, file, true);
                this._utilityService.detectChanges(this._cdr);
              }
            );
        } else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  /**
   *
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(
      files,
      type,
      this.fileUploadsArray
    );
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  /**
   *
   * @param progress File Upload Progress
   * @param file Selected File
   * @param success Boolean value whether file upload success
   */
  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(
      progress,
      file,
      success,
      temporaryFileUploadsArray
    );
  }

  createImageFromBlob(image: Blob, fileDetails, type) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        var logo_url = reader.result;
        fileDetails["preview"] = logo_url;
        if (fileDetails != null) {
          this._activityService.setFileDetails(fileDetails, logo_url, type);
        }
        this._utilityService.detectChanges(this._cdr);
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  /**
   * Deletes a Document
   * @param token Token of Document
   */
  removeBrochure(token) {
    ActivityStore.unsetFileDetails("support-file", token);
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Form Modal to Add/Edit Subsidiary
  cancel() {
    this.closeFormModal();
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  editActivity(id) {
    this.responsible_users = [],
    this.accountable_user=null;
    this.previous_output = null;
    ActivityStore.Editflag = true;
    this.activityForm.reset();
    this.activityForm.markAsPristine();
    this.ActivityStore.clearActivityDocuements();

    this._activityService.getItemById(id).subscribe((res) => {
      setTimeout(() => {
        let activityDetails = res;
        activityDetails.documents.forEach((element) => {
          if (element && element.token) {
            var purl = this._bpmFileService.getThumbnailPreview(
              "process-activities",
              element.token
            );
            var lDetails = {
              name: element.title,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
            };
          }
          this._activityService.setFileDetails(lDetails, purl, "support-file");
        });

        this.activityForm.patchValue({
          id: activityDetails.id,
          designation_id: activityDetails.designation.id
            ? activityDetails.designation.id
            : null,
          previous_process_activity_id: activityDetails.previous_process_activity
            ? activityDetails.previous_process_activity.id
            : null,
          accountable_user_id: activityDetails.accountable_user
            ? activityDetails.accountable_user
            : [],
          responsible_user_ids: activityDetails.responsible_user
            ? this.responsibleUsers(activityDetails.responsible_user)
            : [],
          activity_input: activityDetails.activity_input
            ? activityDetails.activity_input
            : null,
          activity_output: activityDetails.activity_output
            ? activityDetails.activity_output
            : null,
          title: activityDetails.title ? activityDetails.title : null,
          description: activityDetails.description
            ? activityDetails.description
            : null,
        });

        this.getAccountableUsers();

        this.openFormModal();
      }, 300);

      this._utilityService.detectChanges(this._cdr);
    });
  }

  responsibleUsers(userList) {
    let reporting_to = [];
    for (let i of userList) {
      reporting_to.push(i);
    }
    return reporting_to;
  }

  save(close: boolean = false) {
    if (this.activityForm.value) {
      let save;
      AppStore.enableLoading();

      this.activityForm.patchValue({
        process_activity_documents: ActivityStore.getActivityDocuments,
      });

      if (this.activityForm.value.responsible_user_ids) {
        for (let i of this.activityForm.value.responsible_user_ids) {
          this.responsible_users.push(i.id);
        }
      }

      // if (this.activityForm.value.accountable_user_id) {
      //   this.accountable_user = this.activityForm.value.accountable_user_id;
      // }

      if (this.activityForm.value.accountable_user_id) {
        let accountable_user = this.activityForm.value.accountable_user_id;
        this.activityForm.value.accountable_user_id = accountable_user.id;
      }

      if (this.activityForm.value.id) {
        this.sortData(this.activityForm.value, "update");
        save = this._activityService.updateItem(
          ProcessStore.process_id,
          this.saveData.id,
          this.saveData
        );
      } else {
        this.sortData(this.activityForm.value, "save");
        save = this._activityService.saveItem(
          ProcessStore.process_id,
          this.saveData
        );
      }
      save.subscribe(
        (res: any) => {
          this.resetFormDetails();
          // this.getActivites();
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage(
              "Error!",
              "Something went wrong. Please try again."
            );
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  sortData(data, type) {
    if (type == "save") {
      delete data.id;
      this.saveData = {
        ...data,
        responsible_user_ids: this.responsible_users,
        previous_process_activity_id: this.previous_activity_id,
        // accountable_user_id: this.accountable_user,
      };
    } else {
      this.saveData = {
        ...data,
        responsible_user_ids: this.responsible_users,
        // accountable_user_id: this.accountable_user,
      };
    }
  }

  resetFormDetails() {
    this.ActivityStore.clearActivityDocuements();
    this._activityService.setFileDetails(null, "", "logo");
    this.activityForm.reset();
    this.activityForm.pristine;
    this.formErrors = null;
    this.fileUploadsArray = [];
    this.responsible_users = [];
    this.accountable_user = null;
    this.previous_activity_id = null;
  }

  closeFormModal() {
    $(this.activityModal.nativeElement).modal("hide");
    this.resetFormDetails();
    this.getActivity(null)
    AppStore.disableLoading();
    this._utilityService.scrollToTop();
  }

  
  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

 

  getPopupDetails(user, is_created_by: boolean = false) {
  
      let userDetailObject: any = {};
      if(user){
        userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
        userDetailObject['last_name'] = user.last_name;
        userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : user.designation?user.designation: null;
        userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
        userDetailObject['email'] = user.email ? user.email: null;
        userDetailObject['mobile'] = user.mobile ? user.mobile: null;
        userDetailObject['id'] = user.id;
        userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
        userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
        if(is_created_by) userDetailObject['created_at'] = ProcessStore.processDetails.created_at;
        return userDetailObject;
      }
    // }
    // this.userDetailObject.id = details?.id;
    // this.userDetailObject.first_name = details?.first_name;
    // this.userDetailObject.last_name = details?.last_name;
    // this.userDetailObject.designation = details?.designation;
    // this.userDetailObject.image_token = details?.image?.token;
    // this.userDetailObject.email = details?.email;
    // this.userDetailObject.mobile = details?.mobile;
    // this.userDetailObject.department = details?.department ? details?.department : null;
    // this.userDetailObject.status_id = details?.status_id ? details?.status?.id : 1;

    // return this.userDetailObject;
  }

  assignUserValues(user,type){
   
    var responsibleInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }
    var accountableInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }
  
    if(type=='accountable'){
      accountableInfoObject.first_name = user?.first_name;
      accountableInfoObject.last_name = user?.last_name;
      accountableInfoObject.designation = user?.designation;
      accountableInfoObject.image_token = user?.image?.token;
      accountableInfoObject.email = user?.email;
      accountableInfoObject.mobile = user?.mobile;
      accountableInfoObject.id = user?.id;
      accountableInfoObject.status_id = user?.status_id
      accountableInfoObject.department = null;
       return accountableInfoObject;
    }
    else{
      responsibleInfoObject.first_name = user?.first_name;
      responsibleInfoObject.last_name = user?.last_name;
      responsibleInfoObject.designation = user?.designation;
      responsibleInfoObject.image_token = user?.image?.token;
      responsibleInfoObject.email = user?.email;
      responsibleInfoObject.mobile = user?.mobile;
      responsibleInfoObject.id = user?.id;
      responsibleInfoObject.status_id = user?.status_id
      responsibleInfoObject.department = null;
       return responsibleInfoObject;
    }

  }

  
  openAllTab() {

    if(this.openAll == true){
      if(this.controlShow)
      this._renderer2.addClass(this.controlShow?.nativeElement, 'show');
      this._renderer2.addClass(this.activityShow?.nativeElement, 'show');
    }
    else{
      if(this.controlShow)
      this._renderer2.removeClass(this.controlShow?.nativeElement, 'show');
      this._renderer2.removeClass(this.activityShow?.nativeElement, 'show');
    }

}

 ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.deleteEventSubscription.unsubscribe();
    this.activityDetailsEventSubscription.unsubscribe();
  }

}
