import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditFindingCaStatusesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-ca-statuses/ms-audit-finding-ca-statuses.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { MSAuditFindingCAStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-ca-statuses-store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditFollowUpStore } from 'src/app/stores/ms-audit-management/follow-up/audit-follow-up.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-add-follow-up',
  templateUrl: './add-follow-up.component.html',
  styleUrls: ['./add-follow-up.component.scss']
})
export class AddFollowUpComponent implements OnInit {

 @Input('source') followUpSource : any
 @ViewChild ('actionPlan') actionPlan: ElementRef;
 @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
 @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  form: FormGroup;
  followUpActionObject = {
    type : '',
    value : null,
    index : null
  }
  fileUploadPopupStore = fileUploadPopupStore;
  emptyTier = 'No data found'
  formErrors: any;
  AuditFollowUpStore = AuditFollowUpStore;
  MSAuditFindingCAStatusesMasterStore = MSAuditFindingCAStatusesMasterStore
  actionPlanEventSubscription: any;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  selectedIndex: any = null;
  fileUploadPopupSubscriptionEvent: any;
  caStatus: any = [];

  constructor(private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private  _followUpService : FollowUpService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _fileUploadPopupService: FileUploadPopupService,
    private _msAuditFindingCaStatusesService: MsAuditFindingCaStatusesService,) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      effectiveness: [null,[Validators.required]],
      // percentage: ['',[Validators.required]],
      ms_audit_finding_corrective_action_status_id : [null,[Validators.required]],
      targetDate : null
     
    });
    this.actionPlanEventSubscription = this._eventEmitterService.msAuditFollowUpActionPlan.subscribe(res=>{
      this.closeFormModal();
      this.selectedIndex = null
    });
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    });
    if(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails){
      this.form.patchValue({
        targetDate : this._helperService.processDate(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.agreed_date,'split')
      })
    }
    this.getCorrectiveActionStatus()
    this.setData()
  }

  setData(){
   
    if(this.followUpSource.values){
      let obj = {
        ms_audit_finding_corrective_action_status_language_title : this.followUpSource.values.ms_audit_finding_corrective_action_status ? this.followUpSource.values.ms_audit_finding_corrective_action_status?.language[0]?.pivot?.title : null,
        id : this.followUpSource.values.ms_audit_finding_corrective_action_status ? this.followUpSource.values.ms_audit_finding_corrective_action_status?.id : null,
        type : this.followUpSource.values.ms_audit_finding_corrective_action_status ? this.followUpSource.values.ms_audit_finding_corrective_action_status?.type : null,
      }
      this.form.patchValue({
        effectiveness :this.followUpSource.values.effectiveness ? this.followUpSource.values.effectiveness : '',
        percentage : this.followUpSource.values.percentage ? this.followUpSource.values.percentage : '',
        ms_audit_finding_corrective_action_status_id : obj?.id ?  obj : null,
      })
      var followUpDocumetsDetails = this.followUpSource?.values?.documents ? this.followUpSource?.values.documents : [];
      if(followUpDocumetsDetails.length > 0){
        this.setDocuments(followUpDocumetsDetails)
      }
  
    }
}

setDocuments(documents){
  let khDocuments = [];

  documents.forEach(element => {

    if(element.document_id){
      element.kh_document.versions.forEach(innerElement => {

        if(innerElement.is_latest){
          khDocuments.push({
            ...innerElement,
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
        var purl = ''
        this._followUpService.getThumbnailPreview('audit-follow-up', element.token)
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



  addActionPlan() {
    // if(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.id){
      this.followUpActionObject.type = 'Add';
      // AuditNonConfirmityStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    // }  
  }

  openFormModal() {
    setTimeout(() => {
      $(this.actionPlan.nativeElement).modal('show');
      this._renderer2.setStyle(this.actionPlan.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.actionPlan.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.actionPlan.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    // this.getD  etails(AuditNonConfirmityStore.msAuditNonConfirmityId);
    this.followUpActionObject.type = null;
    $(this.actionPlan.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlan.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlan.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlan.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }


  selectIndexChange(index){
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // user image preview
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
      // return this._eventClosureService.getThumbnailPreview(type, token);
  
  }
  
 

  setResposibleUserIds(){
    let actionData = []
    if(AuditFollowUpStore.actionPlans.length > 0){
      actionData = AuditFollowUpStore.actionPlans
      for(let data of actionData){
          data.responsible_user_ids =  this._helperService.getArrayProcessed(data.responsible_user_ids,'id')
      }
    }
    return actionData
  }
   //getting button name by language
 getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}

  processDataForSave(){{
    let saveData = {
      effectiveness: this.form.value.effectiveness ? this.form.value.effectiveness : '',
      ms_audit_finding_corrective_action_status_id : this.form.value.ms_audit_finding_corrective_action_status_id ? this.form.value.ms_audit_finding_corrective_action_status_id.id : null,
      // percentage: this.form.value.percentage ? this.form.value.percentage : '',
      // action_plans : this.setResposibleUserIds()
      documents : []
    }
    if (this.followUpSource.type == 'Edit') {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
    } else{
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');  
    }
    return saveData
  }}
  save(close: boolean = false) {
    let save;
    AppStore.enableLoading();
  
    if (this.followUpSource.type == 'Edit') {
      save = this._followUpService.saveItem(this.processDataForSave(),this.followUpSource.values.id);
    } else {
      // delete this.form.value.id
      save = this._followUpService.saveItem(this.processDataForSave(),this.followUpSource.values.id);
    }
  
    save.subscribe((res: any) => {
      if (this.followUpSource.type != 'Edit') {
        this.resetForm();
      }
      this.resetForm();
  
      // this.clearCommonFilePopupDocuments()
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
  
    });
  
  }

  edit(action,index){
     // if(AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.id){
      this.followUpActionObject.type = 'Edit';
      this.followUpActionObject.index = index
      this.followUpActionObject.value = action
      // AuditNonConfirmityStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    // } 
  }

  getCorrectiveActionStatus(){
    this._msAuditFindingCaStatusesService.getItems(false,null,true).subscribe((res) => {
   
        this.caStatus = []
        for(let [index,value] of MSAuditFindingCAStatusesMasterStore.allItems.entries()){
          if(value.type == 'continuous' || value.type == 'open' || value.type == 'resolved'){
            this.caStatus.push(value);
          }
    }
      
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  isUser() {
    // if(ProjectMonitoringStore?.individualLoaded){
      // for (let i of AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users) {
        if (AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users.length >0) {
          var pos = AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users.findIndex(e => e.id == AuthStore.user.id)
            if (pos != -1){
              return true;
            }
            else{
              return false
            }
        }else{
          return false
        }
      // }
    }

  // * File Upload/Attach Modal

  userRoleChecck(){
    let pos =  AuthStore.user?.roles.findIndex(e=>e.type == 'qm-team')
        return pos != -1 ? true : false 
  }

  changeStatus(){
    if(this.form.value.ms_audit_finding_corrective_action_status_id?.type == "resolved" && fileUploadPopupStore.displayFiles?.length == 0 )
    return true
    else false
  }

openFileUploadModal(id) {
  setTimeout(() => {
    fileUploadPopupStore.openPopup = true;
    fileUploadPopupStore.verificationId=id
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
    this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
    setTimeout(() => {
      this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
      // this._renderer2.setStyle(this.nonConformitySourceModal.nativeElement, 'z-index', '99999');
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }, 250);
}
closeFileUploadModal() {

  // this.clearFIleUploadPopupData()
  setTimeout(() => {
    fileUploadPopupStore.openPopup = false;
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
    this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();
    setTimeout(() => {
      this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
      this._utilityService.detectChanges(this._cdr)
    }, 200);
  }, 100);
}

enableScrollbar() {
  if (fileUploadPopupStore.displayFiles.length >= 3) {
    $(this.uploadArea.nativeElement).mCustomScrollbar();
  }
  else {
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }
}

// createImageUrl(type, token) {
//   if (type == 'document-version')
//     return this._documentFileService.getThumbnailPreview(type, token);
//   // else
//     // return this._eventClosureService.getThumbnailPreview(type, token);

// }

checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}


removeDocument(doc) {
  if(doc.hasOwnProperty('is_kh_document')){
    if(!doc['is_kh_document']){
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    else{
      fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
    }
  }
  else{
    fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
  }
  this._utilityService.detectChanges(this._cdr);
}

// file attch end here...

  delete(action){
   AuditFollowUpStore.deleteActionPlan(action)
    
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }
    // for resetting the form
 resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  this.clearCommonFilePopupDocuments();
  AuditFollowUpStore._actionPlans = []
  AppStore.disableLoading();
}
  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissAuditFollowUpModal()
  }

  ngOnDestroy(){
    this.actionPlanEventSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }
}
