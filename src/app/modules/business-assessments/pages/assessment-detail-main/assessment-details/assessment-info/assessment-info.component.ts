import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AssessmentsService } from 'src/app/core/services/business-assessments/assessments.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessAssessmentService } from 'src/app/core/services/business-assessments/business-assessment-service/business-assessment.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
declare var $: any;

@Component({
  selector: 'app-assessment-info',
  templateUrl: './assessment-info.component.html',
  styleUrls: ['./assessment-info.component.scss']
})
export class AssessmentInfoComponent implements OnInit {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef;
  

  sideCollapsed: boolean = false;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors: any;
  AssessmentsStore = AssessmentsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  BAActionPlanStore=BAActionPlanStore;
  documentVersion = null;
  AppStore = AppStore;
  frameworkOptions = [];
  FrameworksStore = FrameworksStore;
  currentAssessment = null;
  currentChecklist = null;
  selectedFramework = null;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  submitClicked = false;
  selectedChecklist = null;
  fileUploadProgress = 0;
  clauseNumber = null;
  checklistId=null;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  emptyAssessment ="checklist_no_data";
  openActionPlanPopup:boolean=false;

  // Document Index
  documentIndex=null;
  checklistIndex=null;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    file_name: "",
    file_type: "",
    size: null
  };

  deleteObject = {
    id: null,
    type: '',
    position: null,
    subtitle:''
  };

  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  assessmentObject = {
    component: 'BusinessAssessment',
    values: null,
    type: null
  };

  actionPlanData={
    values:null,
    type:'checklist-edit',
    component:'checklist-parent'
  }

  comment = '';
  hover = false;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  assessmentSubscriptionEvent: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  fileUploadPopupSubscriptionEvent: any = null;
  actionPlanFormSubscription:any;
  submitError = null;
  constructor(private _renderer2: Renderer2,
    private _humanCpitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _assessmentsService: AssessmentsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _businessAssessmentService: BusinessAssessmentService,
    private _documentFileService: DocumentFileService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private route: ActivatedRoute,
    private _eventEmitterService: EventEmitterService,
    private _msTypeOrganizationService: MstypesService,
    private _fileUploadPopupService:FileUploadPopupService) { }

  ngOnInit(): void {
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.AssessmentsStore.setAssessmentId(id);
      this.setDetails();
         
    });
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [

        { activityName: null, submenuItem: { type: 'close', path: '/business-assessments/assessments' } },
        // { activityName: 'DELETE_BUSINESS_ASSESSMENT', submenuItem: { type: 'delete' } },
        // {activityName: 'UPDATE_BUSINESS_ASSESSMENT', submenuItem: {type: 'edit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      // NoDataItemStore.setNoDataItems({ title: "checklist_no_data" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "delete":
            this.deleteAssessment(AssessmentsStore.assessmentId);
            break;
          // case "edit_modal":
          //   this.editDetails(AssessmentsStore.assessmentId);
          //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'new_modal' },
    //   { type: 'template' },
    //   { type: 'export_to_excel' },

    // ]);

    // window.addEventListener('scroll', this.scrollEvent, true)
    // SubMenuItemStore.setNoUserTab(true);

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
   

    this.form = this._formBuilder.group({
      business_assessment_id: [null],
      document_version_content_id: [null, [Validators.required]],
      checklist_id: [null, [Validators.required]],
      business_assessment_framework_option_id: [null],
      comment: [''],
      external_comment:[''],
      actions:[''],
      documents: [[]]
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.confirmPopup(item);
    })

    this.assessmentSubscriptionEvent = this._eventEmitterService.assessmentControl.subscribe(res => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.actionPlanFormSubscription=this._eventEmitterService.businessAssessmentActionPlanForm.subscribe(res=>{

      this.closeActionPlanForm()
      this.setActionPlanData()
    })

  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }

    else if ($(this.filePreviewModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
    }
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }

  editDetails(id) {
    this._assessmentsService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.assessmentObject.values = {
        id: res.id,
        title: res.title,
        description: res.description,
        business_assessment_framework: res.business_assessment_framework,
        organizations: res.organizations,
        divisions: res.divisions,
        departments: res.departments,
        sections: res.sections,
        sub_sections: res.sub_sections,
        ms_type_organizations: this.processData(res.ms_type_organizations),
        document_version: res.document_version.id,
      }
      this.assessmentObject.type = 'Edit';

      AssessmentsStore.activeFile = res.document_version;
      AssessmentsStore.activeFile['document_version_id'] = res.document_version.id
      this.getData();

    })
  }
  getData() {
    this._msTypeOrganizationService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        $(this.formModal.nativeElement).modal('show');
      }, 300);
    })
  }
  closeFormModal() {
    this.form.reset();
    AssessmentsStore.activeFile = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.assessmentObject.type = null;
  }
  processData(data) {
    let msType = [];
    for (let i of data) {
      msType.push(i.id);
    }
    return msType;
  }

  setDetails() {
    this._assessmentsService.getItem(AssessmentsStore.assessmentId).subscribe(res => {
      this.getChecklist(res.document_contents[0]?.id, res.document_contents[0]?.document_version_content_id, 0, res.document_contents[0]?.document_version_content.clause_number);
      // this.currentAssessment = res.document_contents[0].id;
      // this.getVersion(res);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 10) {

        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {

        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }

  }

  collapseSide() {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '99999');
      this.sideCollapsed = true;
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

      this.sideCollapsed = false;
    }
  }

  downloadDocument(doc_id, title, id, version) {

  }

  viewDocument(type, documents, checklist?) {
    switch (type) {
      case "checklist-document":
        this._businessAssessmentService
          .getFilePreview(type, checklist.id, documents.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documents, checklist);
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
          .getFilePreview(type, documents.document_id, documents.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documents, checklist);
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

  deleteAssessment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';

    $(this.deletePopup.nativeElement).modal('show');
  }

  confirmSubmit(){
    this.deleteObject.id = AssessmentsStore.assessmentId;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'Are you sure you want to publish this assessment?'


    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.type = '';

  }

  /**
* Delete the assessment
* @param id -assessment id
*/
  confirmPopup(status) {

    if (status && this.deleteObject.id) {
      if(this.deleteObject.type=='Confirm'){
        this.publishAssessment();
      }
      else{
        this._assessmentsService.delete(this.deleteObject.id).subscribe(resp => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/business-assessments/assessments');
          this.clearDeleteObject();
  
        });
      }
     
     
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }



  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(type, filePreview, document, checklist) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    if (type == 'checklist-document') {
      this.previewObject.component = 'checklist-document';
      this.previewObject.componentId = checklist.id;
      this.previewObject.file_details = document;
      this.previewObject.file_name = document.name;
      this.previewObject.file_type = document.ext;
      this.previewObject.preview_url = previewItem;
      this.previewObject.size = document.size;
      this.previewObject.uploaded_user = checklist.updated_by.length > 0 ? checklist.updated_by : checklist.created_by;
      this.previewObject.created_at = checklist.created_at;
    }
    else {
      if(document){
        this.previewObject.component = type;
        this.previewObject.componentId = document.id;
        this.previewObject.file_details = document;
        this.previewObject.file_name = document.title;
        this.previewObject.file_type = document.ext;
        this.previewObject.preview_url = previewItem;
        this.previewObject.size = document.size;
        this.previewObject.uploaded_user = document?.updated_by?.length > 0 ? document?.updated_by : document?.created_by;
        this.previewObject.created_at = document.created_at;
      }
     
    }

    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.component = "";
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.file_name = "";
    this.previewObject.file_type = "";
    this.previewObject.size = null;
  }


  downloadFile(checklist, document) {
    this._businessAssessmentService.downloadFile('checklist-document', checklist.id, document.id, document.name, document);

  }

  downloadFileView() {
        this._documentFileService.downloadFile('document-version',AssessmentsStore.individualAssessmentDetails.document_version.document_id, AssessmentsStore.individualAssessmentDetails.document_version.id,null, AssessmentsStore.individualAssessmentDetails.document_version.title, AssessmentsStore.individualAssessmentDetails.document_version);

  }

  

  setDocuments(documents,id?) {

    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element?.kh_document?.versions?.forEach(innerElement => {

          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true,
              verificationId:id
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              verificationId:id,
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._businessAssessmentService.getThumbnailPreview('checklist-document', element.token)
          var lDetails = {
            created_at: element.created_at,
            created_by: element.created_by,
            updated_at: element.updated_at,
            updated_by: element.updated_by,
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            verificationId:id,
            business_assessment_document_content_checklist_id: element.business_assessment_document_content_checklist_id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
    for(let i of fileUploadPopupStore.getKHFiles){
      khDocuments.push(i)
    }
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

  }


  // document upload
  openFileUploadModal(id) {
    fileUploadPopupStore.verificationId=id
    setTimeout(() => {

      fileUploadPopupStore.openPopup = true;
     
     
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
   
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  


  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageUrl(token, type?) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token);
    }
    else
      return this._humanCpitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getPopupDetails(user) {
    $('.modal-backdrop').remove();
    this.userDetailObject.first_name = user.first_name;
    this.userDetailObject.last_name = user.last_name;
    this.userDetailObject.designation = user.designation;
    this.userDetailObject.image_token = user.image.token;
    this.userDetailObject.email = user.email;
    this.userDetailObject.mobile = user.mobile;
    this.userDetailObject.id = user.id;
    this.userDetailObject.department = user.department ? user.department : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
  }


  // getVersion(versionData){
  //   for(let i of versionData.document.versions){
  //     if(i.version==versionData.version){
  //       this.documentVersion = i;
  //     }
  //   }
  // }
  gotoUser(id) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }
  setFramework(framework, docIndex, checklistIndex) {
    AssessmentsStore.individualAssessmentDetails.document_contents[docIndex]['checklist'][checklistIndex].business_assessment_framework_option = framework;
    this.selectedFramework = framework.id;
  }


  getChecklist(docId, id, num, clause_number) {

    this.documentIndex=num

    this._assessmentsService.getChecklist(AssessmentsStore.assessmentId, id).subscribe(res => {
      if (AssessmentsStore.individualAssessmentDetails?.document_contents?.length > 0) {
        AssessmentsStore.individualAssessmentDetails.document_contents[num]['checklist'] = res?.checklist;
        AssessmentsStore.individualAssessmentDetails.document_contents[num]['child'] = res?.children;
      }


      if (docId == this.currentAssessment)
        this.currentAssessment = null;
      else {
        this.currentAssessment = docId;
        AssessmentsStore.currentAssessment = docId;
      }

      this._utilityService.detectChanges(this._cdr);
    
    })
    this._utilityService.detectChanges(this._cdr);

  }


  /**
 * Returns whether file extension is of imgage, pdf, document or etc..
 * @param ext File extension
 * @param extType Type - image,pdf,doc etc..
 */
  checkExtension(extType, ext?) {
    // if(this.documentVersion!=null){
    var res = this._imageService.checkFileExtensions(ext ? ext : this.AssessmentsStore.individualAssessmentDetails.document_version.ext, extType);
    return res;
    // }

  }

  /**
 * removing document file from the selected list
 * @param token -image token
 */
  // removeDocument(token) {
  //   AssessmentsStore.unsetChecklistImageDetails('support-file', token);
  //   this.checkForFileUploadsScrollbar();
  //   this._utilityService.detectChanges(this._cdr);
  // }

  removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  onFileChange(event, type: string, clause_number, id) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          AssessmentsStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }


                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  AssessmentsStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type, clause_number, id);

                }, (error) => {
                  AssessmentsStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            AssessmentsStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }

  }

  /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }



  createImageFromBlob(image: Blob, imageDetails, type, clause_number, id) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._assessmentsService.setImageDetails(imageDetails, logo_url, type, clause_number, id);
      else
        this._assessmentsService.setSelectedImageDetails(logo_url, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkForFileUploadsScrollbar() {
    if (AssessmentsStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }


  viewMore(type) {
    if (type == 'more')
      AssessmentsStore.view_more = true;
    else
      AssessmentsStore.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }


  setChecklistIndex(index, checklist) {
    this.checklistIndex=index
    setTimeout(() => {
      this.currentChecklist = checklist.checklist ? checklist.checklist.id + '_' + this.currentAssessment : null;
    }, 100);
    // if(checklist?.documents?.length>0)
    console.log(fileUploadPopupStore.displayFiles);
    let pos=fileUploadPopupStore.displayFiles.findIndex(e=>e.verificationId==checklist.id);
    if(pos==-1)
    this.setDocuments(checklist?.documents,checklist.id)
    // this.getDocArray(checklist, clause_number, id, true);
  }

  clickEvent = (event: any): void => {
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }

  mouseHover(event) {


    // this.hover = true;
    // if (this.popup) {
    //   this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
    // }

  }

  mouseOut(event) {

    // this.hover = false;
    // if (this.popup) {
    //   this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    // }

  }


  documentFn(id){
    let returnData=[]
    fileUploadPopupStore.displayFiles.forEach(element => {
      if(element.verificationId==id){
        returnData.push(element)
      }
    });
    return returnData
  }

  documentUpdateFn(id,docs){
    let updateData=[]
    docs.forEach(element => {
      if(element.verificationId==id){        
        updateData.push(element)          
        }
    });    
    return updateData
  }
  /**
   * 
   * @param close -decision variable to close the form modal
   * @param params - will take renew or null
   * renew - will renew the document
   * null- will save or update the document
   */
  saveChecklist(checklist, docIndex, checklistIndex, doc) {

    this.selectedFramework = AssessmentsStore.individualAssessmentDetails.document_contents[docIndex]['checklist'][checklistIndex].business_assessment_framework_option?.id;
    this.formErrors = null;
    AppStore.enableLoading();
    // for(let i of fileUploadPopupStore.displayFiles){
      let updateArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getUpdateArray)
      let khFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getKHFiles)
      let systemFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getSystemFile)

   
    this.form.patchValue({
      business_assessment_id: checklist.business_assessment?.id ? checklist.business_assessment.id : null,
      document_version_content_id: doc.document_version_content?.id ? doc.document_version_content?.id : null,
      checklist_id: checklist.checklist?.id ? checklist.checklist?.id : null,
      business_assessment_framework_option_id: this.selectedFramework,
      comment: checklist.comment,
      external_comment: checklist.external_comment,
      actions: checklist.actions,
      documents:  this._helperService.compareEditDataWithSelectedData(updateArray,khFilesArray,systemFilesArray)
    })
    this._assessmentsService.updateChecklist(this.form.value, checklist.id).subscribe((res: any) => {
      // : this._helperService.sortFileuploadData(this.documentFn(checklist.checklist.id), 'save') 

      // this.getDocArray(checklist,doc.document_version_content.clause_number,checklist.checklist.id);
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        // this._assessmentsService.getItem(AssessmentsStore.assessmentId).subscribe(res=>{
        //   this._utilityService.detectChanges(this._cdr);
        // });
          this._assessmentsService.getChecklist(AssessmentsStore.assessmentId, doc.document_version_content?.id).subscribe(response => {
            if (AssessmentsStore.individualAssessmentDetails.document_contents.length > 0) {
            AssessmentsStore.individualAssessmentDetails.document_contents[docIndex]['checklist'] = response?.checklist;
            AssessmentsStore.individualAssessmentDetails.document_contents[docIndex]['child'] = response?.children;
            }
            this._utilityService.detectChanges(this._cdr);
            setTimeout(() => {
              AssessmentsStore.clearChecklistDocuments();
              // this.getDocArray(response[0]?.checklist[checklistIndex], doc.document_version_content.clause_number, response[0]?.checklist[checklistIndex].checklist.id);

            }, 200);
            this._utilityService.detectChanges(this._cdr);
          })
        
       
          
        // 
      }, 700);
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }

  publishAssessment(){
    this.submitClicked = true;
    AppStore.enableLoading();
    this.submitError=null
    this._assessmentsService.publishAssessment(AssessmentsStore.assessmentId).subscribe(res=>{
      AppStore.disableLoading();
      this.submitClicked = false;
      this.currentAssessment = null;
      this._utilityService.detectChanges(this._cdr);

    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // console.log(err);
        this.submitError = err.error.message;
        this.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    });
  }

  cancelChecklist() {
    this.form.reset();
    this.form.markAsPristine();
  }

   //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }


  // Action Plan Form Code Starts Here

  openActionPlanForm(){
    this.openActionPlanPopup=true
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.actionPlanModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closeActionPlanForm(){
    this.openActionPlanPopup=false;
    $(this.actionPlanModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();

  }

  setActionPlanData() {
    // Setting action plan data from modal , and mapping to required format to send to API and for displaying data.
    // Handling add and edit separately to compare avoid duplicatio when editing.

    if (BAActionPlanStore.formType == 'add') {
      let actionsArray = [
        ...AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions'],
        ...BAActionPlanStore._displayData
      ]
      actionsArray.map(item => {
        item.responsible_user_ids = [item.responsible_users.id],
          item.start_date = this._helperService.processDate(item.start_date, 'join'),
          item.target_date = this._helperService.processDate(item.target_date, 'join');
        item.accordionActive = false;
      })

      AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions'] = actionsArray

      // Showing success message if there is any data in displaydata array.

      if (BAActionPlanStore._displayData.length > 0)
        this._utilityService.showSuccessMessage('success', 'actionplan_added');
    }

    // In edit case filtering out the data and showing only required action plans.
    else {

      let actionsArray = [
        ...this.filteredArray(),
        ...BAActionPlanStore._displayData
      ]

      actionsArray.map(item => {
        item.responsible_user_ids = [item.responsible_users.id],
          item.start_date = this._helperService.processDate(item.start_date, 'join'),
          item.target_date = this._helperService.processDate(item.target_date, 'join');
        item.accordionActive = false;
      })
      AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions'] = actionsArray

      // Showing success message if there is any data in displaydata array.
      if (BAActionPlanStore._displayData.length > 0)
        this._utilityService.showSuccessMessage('success', 'actionplan_updated');
    }

    // Unsetting all data after handling all operations.

    this.clearActionPlanData()
  }

  // Comparing responseArray and displayData array and removing the already edited data from responseArray to avoid duplication.
  filteredArray(){

    let responseArray=AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions']
  
   return  responseArray.filter(elementX=>!BAActionPlanStore._displayData.some(elementY=>elementX.id==elementY.id))
    
    
  }

  clearActionPlanData(){
    BAActionPlanStore.unSetDisplayData();
    this.actionPlanData.values=null;
  }


  setActiveAction(actionIndex){

    // Checking with 'accordionActive' property to handle accordion arrows icon.

    let actionData=AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions'][actionIndex]
    if(actionData.accordionActive==true)
    actionData.accordionActive=false
    else
    actionData.accordionActive=true


  }

  editActionPlan(actionPlanData){
    // setting type as checklist-edit as we use the same form for submenu edit aswell.

    if(actionPlanData.id)
    this.actionPlanData.type='checklist-edit'
    
    this.actionPlanData.values={
        id:actionPlanData.id,
        title:actionPlanData.title,
        start_date:this._helperService.processDate(actionPlanData.start_date,'split'),
        target_date:this._helperService.processDate(actionPlanData.target_date,'split'),
        responsible_user_id:actionPlanData.responsible_users,
        is_edit:actionPlanData?.is_edit?actionPlanData?.is_edit:false,
        description:actionPlanData.description
    }
   

    this.openActionPlanForm()
  }



getCreatedByPopupDetails(users, created?: string) {
  let userDetial: any = {};
  userDetial['first_name'] = users?.first_name;
  userDetial['last_name'] = users?.last_name;
  userDetial['designation'] = users?.designation;
  userDetial['image_token'] = users?.image?.token;
  userDetial['email'] = users?.email;
  userDetial['mobile'] = users?.mobile;
  userDetial['id'] = users?.id;
  userDetial['department'] = users?.department;
  userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
  userDetial['created_at'] = created ? created : null;
  return userDetial;

}


  deleteActionPlan(actionPlanIndex){

    // Checking by index of action plan to be deleted.
    let actionData=AssessmentsStore.individualAssessmentDetails.document_contents[this.documentIndex]['checklist'][this.checklistIndex]['actions']

    // Checking if selected action plan index has 'is_new' object then removing by the position 
    // If not mapping 'is_deleted' property to send to API.

    if(actionData[actionPlanIndex].hasOwnProperty('is_new')){
      actionData.splice(actionPlanIndex,1)
    }else{
      actionData[actionPlanIndex]['is_deleted']=true;
    }
    this._utilityService.showSuccessMessage('success','actionplan_deleted');
  }

  // Action Plan Form Code Ends here

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    AssessmentsStore.clearChecklistDocuments();
    AssessmentsStore.unsetIndiviudalAssessmentDetails();
    AssessmentsStore.unsetCheckList();
    this.deleteEventSubscription.unsubscribe();
    this.assessmentSubscriptionEvent.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    AssessmentsStore.individual_assessment_loaded = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
    this.actionPlanFormSubscription.unsubscribe();
    AppStore.loading=false;
    NoDataItemStore.unsetNoDataItems();
  }
}
