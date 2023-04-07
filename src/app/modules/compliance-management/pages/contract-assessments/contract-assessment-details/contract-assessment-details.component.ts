import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef,Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from '@angular/router';
import { ContractAssessmentService } from 'src/app/core/services/compliance-management/contract-assessment/contract-assessment.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplainceContractStore } from 'src/app/stores/compliance-management/complaince-checklist/contract-assessment-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
@Component({
  selector: 'app-contract-assessment-details',
  templateUrl: './contract-assessment-details.component.html',
  styleUrls: ['./contract-assessment-details.component.scss']
})
export class ContractAssessmentDetailsComponent implements OnInit {
  @ViewChild('scrollArea', { static: false }) scrollArea: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  SubMenuItemStore=SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  NoDataItemStore=NoDataItemStore;
  AppStore=AppStore;
  ComplainceContractStore=ComplainceContractStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  currentChecklist=null;
  fileUploadPopupStore=fileUploadPopupStore;
  formErrors:any;
  frameworkOption=[];
  assessmentDetails:any;
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
  submitClicked = false;
  submitError:any;
  fileUploadPopupSubscriptionEvent:any;
  deleteEventSubscription:any;
  previewSubscriptionEvent:any;
  constructor(
    private _contractAssessmentService:ContractAssessmentService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _fileUploadPopupService:FileUploadPopupService,
    private _eventEmitterService: EventEmitterService) { 
    
    }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [

        { activityName: null, submenuItem: { type: 'close', path: '/compliance-management/contract-assessments' } },
        { activityName: '', submenuItem: { type: 'delete' } },
        // {activityName: 'UPDATE_BUSINESS_ASSESSMENT', submenuItem: {type: 'edit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);
      // NoDataItemStore.setNoDataItems({ title: "checklist_no_data" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "delete":
            this.deleteAssessment(ComplainceContractStore.contractId);
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
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"SLA&Contracts",
        path:`/compliance-management/contract-assessments`
      });
    }
    let id: number;
    this.route.params.subscribe(params => {

			id = params.id;
			ComplainceContractStore.setContractId(id);
      this.setDetails();
		});
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.confirmPopup(item);
    })
    this.previewSubscriptionEvent = this._eventEmitterService.slaDocumentPreviewModal.subscribe(res => {
      this.closePreviewModal();
    })
    this.getFrameworkOption();
  }
  
  ngAfterViewInit() {
    $(this.scrollArea.nativeElement).mCustomScrollbar();
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  setDetails() {    
    this._contractAssessmentService.getItem(ComplainceContractStore.contractId).subscribe(res => {
      this.assessmentDetails=res;
      if(res?.sla_and_contract_assessment_checklists?.length && !this.currentChecklist)
      {
        this.setChecklistIndex(0,res.sla_and_contract_assessment_checklists[0])
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getUsrDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  setChecklistIndex(index,checklist)
  {
    if(this.currentChecklist==checklist.id)
    {
      this.currentChecklist=null;
    }
    else
    {
      this.currentChecklist=checklist.id
      let pos=fileUploadPopupStore.displayFiles.findIndex(e=>e.verificationId==checklist.id);
      if(pos==-1)
      this.setDocuments(checklist?.documents,checklist.id)
      
     
    }
    //this.currentChecklist=checklist.id;
    
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
          var purl = this._contractAssessmentService.getThumbnailPreview('checklist-document', element.token)
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

  
  viewDocument(type, documents, checklist?) {
    switch (type) {
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
  closePreviewModal() {
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

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  createImageUrl(token, type?) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token);
    }
    else
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  removeDocument(doc,index,i) {
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
    this.assessmentDetails?.sla_and_contract_assessment_checklists[index].documents.splice(i,1);
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(extType, ext?) {
    // if(this.documentVersion!=null){
    var res = this._imageService.checkFileExtensions(ext ? ext :ComplainceContractStore.contractDetails.document_version.ext, extType);
    return res;
    // }

    
  }
  downloadFileView() {
    this._documentFileService.downloadFile('document-version',ComplainceContractStore.contractDetails.document_version.document_id, ComplainceContractStore.contractDetails.document_version.id,null, ComplainceContractStore.contractDetails.document_version.title, ComplainceContractStore.contractDetails.document_version);

}
  getFrameworkOption()
  {
    this._contractAssessmentService.getFrameworkOptions().subscribe(res => {
      this.frameworkOption=res?.data
      this._utilityService.detectChanges(this._cdr);
    })
  }
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
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
  selectedFramework(index,data)
  {
    this.assessmentDetails.sla_and_contract_assessment_checklists[index].sla_and_contract_assessment_framework_option=data;
  }
  getScorePercentage(completedCount,totalChecklistCount)
  {
    return (completedCount/totalChecklistCount)*100;
  }
  saveChecklist(checklist,index)
  {
    this.formErrors = null;
    AppStore.enableLoading();
    let updateArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getUpdateArray)
    let khFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getKHFiles)
    let systemFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getSystemFile)
    const payload={
      sla_and_contract_assessment_id:ComplainceContractStore?.contractId,
      checklist_id:checklist.checklist_id,
      comment:checklist?.comment,
      sla_and_contract_assessment_framework_option_id: this.assessmentDetails.sla_and_contract_assessment_checklists[index].sla_and_contract_assessment_framework_option.id,
      documents: this._helperService.compareEditDataWithSelectedData(updateArray,khFilesArray,systemFilesArray)
    }
    this._contractAssessmentService.updateChecklist(payload, checklist.id).subscribe((res: any) => {
      this.setDetails();
      this._utilityService.detectChanges(this._cdr);
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
    })
  }
  deleteAssessment(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    $(this.deletePopup.nativeElement).modal('show');
  }

  confirmSubmit(){
    this.deleteObject.id = ComplainceContractStore.contractId;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'Are you sure you want to publish this assessment?'
    $(this.deletePopup.nativeElement).modal('show');
  }

  
  confirmPopup(status) {

    if (status && this.deleteObject.id) {
      if(this.deleteObject.type=='Confirm'){
        this.publishAssessment();
      }
      else{
        if(status)
        {
          this._contractAssessmentService.delete(this.deleteObject.id).subscribe(resp => {
            this._utilityService.detectChanges(this._cdr);
            this._router.navigateByUrl('/compliance-management/contract-assessments');
            this.clearDeleteObject();
    
          });
        }
        
      }
     
     
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  publishAssessment(){
    this.submitClicked = true;
    AppStore.enableLoading();
    this.submitError=null
    this._contractAssessmentService.publishAssessment(ComplainceContractStore.contractId).subscribe(res=>{
      AppStore.disableLoading();
      this.submitClicked = false;
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

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.type = '';

  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    ComplainceContractStore.unsetSelectedItemDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.previewSubscriptionEvent.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

}
