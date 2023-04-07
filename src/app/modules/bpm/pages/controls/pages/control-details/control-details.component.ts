import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { ControlStore } from "../../../../../../stores/bpm/controls/controls.store";
import { IReactionDisposer, autorun } from "mobx";
import { ControlsService } from "../../../../../../core/services/bpm/controls/controls.service";
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { DocumentFileService } from "src/app/core/services/knowledge-hub/documents/document-file.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { fileUploadPopupStore } from "src/app/stores/file-upload-popup/fileUploadPopup.store";
import { FileUploadPopupService } from "src/app/core/services/fileUploadPopup/file-upload-popup.service";
import { DomSanitizer } from "@angular/platform-browser";
import { BpmFileService } from "src/app/core/services/bpm/bpm-file/bpm-file.service";
import { ControlArciService } from "src/app/core/services/bpm/controls/control-arci.service";

declare var $: any;
@Component({
  selector: "app-control-details",
  templateUrl: "./control-details.component.html",
  styleUrls: ["./control-details.component.scss"],
})
export class ControlDetailsComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('arciModal', { static: true }) arciModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ControlStore = ControlStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };


    
  arciMatrixObject = {
    component: 'Master',
    type: null,
    values: null
  }

  deleteObject = {
    title: '',
    id: null,
    subtitle:'',
    type:"Delete"
  };

  constructor(
    private _controLService: ControlsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _processService:ProcessService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _bpmFileService: BpmFileService,
    private _sanitizer: DomSanitizer,
    private _arciService: ControlArciService,
  ) { }

  controlObject = {
    component: 'Master',
    values: null,
    type:null
  }

  controlSubscriptionEvent: any = null;
  ModalStyleSubscriptionEvent:any
  controlEfficiencyMeasuresSubscriptionEvent: any = null;
  deleteEventSubscription:any;
  arciMatrixSubscriptionEvent:any;
  ngOnInit(): void {
    AppStore.showDiscussion = false;
    let id: number;
    this.route.params.subscribe(params => {
      // (+) converts string 'id' to a number
      id = +params['id'];
      ControlStore.controlId=id
      this.getControlDetails(id);

    });
   
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'UPDATE_CONTROL', submenuItem: { type: 'edit_modal' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.edit()
              this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.controlSubscriptionEvent = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    })

    // / SubScribing to Set the Style of Modal Once Closed in Child Component.

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    })

    this.controlEfficiencyMeasuresSubscriptionEvent = this._eventEmitterService.controlEfficienyMeasures.subscribe(res => {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteARCI(item);
    })

    this.arciMatrixSubscriptionEvent = this._eventEmitterService.arciMatrixModal.subscribe(res=>{
      this.closeARCIForm();
    })
  


    SubMenuItemStore.setNoUserTab(true);
    // SubMenuItemStore.setSubMenuItems([
    //   { type: "edit_modal" },
    //   { type: "close", path: "../" },
    // ]);

    // this.pageChange(1);

    // this.getControlDetails()
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  createPreviewUrl(token) {
    return this._processService.getThumbnailPreview(token);
  }



  // Fix For Modal Issue

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    this.controlObject.type = null;
    this.controlObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  pageChange(newPage: number = null) {
    if (newPage) ControlStore.setCurrentPage(newPage);
    this._controLService
      .getAllItems()
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  getControlDetails(id) {

    this._controLService.getItemById(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = typeof(user.designation) == 'string' ? user.designation : user.designation?.title ? user.designation?.title : '';
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = ControlStore.controlDetails.created_at;
      return userDetailObject;
    }
  }

  edit() {
    let id: number;
    this.route.params.subscribe(params => {
      // (+) converts string 'id' to a number
      id = +params['id'];

    });

    this._controLService.getItemById(id).subscribe(res => {
      this.setDocuments(res.control_documents)
      var controlDetails = res
      this.controlObject.values = {
        id: controlDetails.id,
        reference_code:controlDetails.reference_code?controlDetails.reference_code:'',
        description:controlDetails.description?controlDetails.description:'',
        title: controlDetails.title?controlDetails.title:'',
        control_type_id: controlDetails.control_type?controlDetails.control_type.id:'',
        control_category_id: controlDetails.control_category?controlDetails.control_category.id:'',
        control_sub_category_id: controlDetails.control_sub_category?controlDetails.control_sub_category.id:'',
        control_objectives:controlDetails.control_objectives?controlDetails.control_objectives:'',
        control_efficiency_measure: controlDetails.control_efficiency_measure ? controlDetails.control_efficiency_measure.id : null,
        control_efficiency_remarks: controlDetails.control_control_efficiency_remarks ? controlDetails.control_control_efficiency_remarks : '',
        control_mode_id:controlDetails.control_mode?.id?controlDetails.control_mode.id:null,
      }
    
      this.controlObject.type = 'Edit';
     this.openFormModal();
      this._utilityService.detectChanges(this._cdr);
    
    })
  }
  
  setDocuments(documents){

    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._documentFileService.getThumbnailPreview('control-document', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  // File Preview,Download Starts Here
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "control-document":
        this._documentFileService.downloadFile(
          type,
          document.control_id,
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
    }
  }

  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "control-document":
        this._bpmFileService
          .getFilePreview(type, documents.control_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
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
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type
    // switch (type) {
    //   case "document-version":
    //     this.previewObject.component = type;
    //     break;
    //   case "document-file":
    //     this.previewObject.component = type;
    //     break;
    //   default:
    //     break;
    // }

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      

      this.previewObject.uploaded_user =
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
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


  getARCI() {

    this._arciService.getItemById(ControlStore.controlId).subscribe(res => {
        this.arciMatrixObject.values = {
          control_id: res.control_id,
          title:res.title,
          accountable_user: res.accountable_user ?  res.accountable_user : [],
          consulted_user: res.consulted_user ?  res.consulted_user : [],
          informed_user: res.informed_user ?  res.informed_user : [],
          responsible_user:res.responsible_user?res.responsible_user:[]        
        }
        this.arciMatrixObject.type = 'Edit';
        this.openARCIForm();
        this._utilityService.detectChanges(this._cdr);
     
    })

  }

  openARCIForm() {
    setTimeout(() => {
      $(this.arciModal.nativeElement).modal('show');
    }, 100);
  }
  closeARCIForm() {
    this.getControlDetails(ControlStore.controlId)
    $(this.arciModal.nativeElement).modal('hide');
    this.arciMatrixObject.type = null;
  }

  // Delte New Modal

  delete() {

   this.deleteObject.id = ControlStore.controlId;
   this.deleteObject.type = 'are_you_sure';
   this.deleteObject.title='Delete ARCI?';
   this.deleteObject.subtitle='remove_control_arci_list_subtitle';
  
   $(this.deletePopup.nativeElement).modal('show');

 }

   /**
  * Delete Control
  * @param id -Control id
  */
 deleteARCI(status) {

   if (status && this.deleteObject.id) {
         this._arciService.delete(this.deleteObject.id).subscribe(resp => {
           this.getControlDetails(ControlStore.controlId)
       setTimeout(() => {
         this._utilityService.detectChanges(this._cdr);
       }, 500);
       this.clearDeleteObject();
     });
   }
   else {
     this.clearDeleteObject();
   }
   setTimeout(() => {
     $(this.deletePopup.nativeElement).modal('hide');
   }, 250);
   
 }

 clearDeleteObject() {
   this.deleteObject.id = null;
   this.deleteObject.title='';
   this.deleteObject.subtitle='';

 }


  // File Preview,Download Ends Here
  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    ControlStore.unsetControlDetails()
    SubMenuItemStore.makeEmpty();
    this.controlEfficiencyMeasuresSubscriptionEvent.unsubscribe();
    this.controlSubscriptionEvent.unsubscribe();
    this.ModalStyleSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.arciMatrixSubscriptionEvent.unsubscribe();
  }

}


