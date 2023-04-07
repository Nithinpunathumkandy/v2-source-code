import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditFindingCategoriesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.service';
import { AuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-check-list/audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditFindingCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-categories-store';
import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-checklist-add-answer',
  templateUrl: './checklist-add-answer.component.html',
  styleUrls: ['./checklist-add-answer.component.scss']
})

export class ChecklistAddAnswerComponent implements OnInit {
@Input('source') addAnswerPopupSource : any;
@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
@ViewChild('formModal', { static: true }) formModal: ElementRef;


fileUploadPopupStore = fileUploadPopupStore;
OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
AuditCheckListStore = AuditCheckListStore;
MsAuditFindingCategoryMasterStore=MsAuditFindingCategoryMasterStore;
AppStore = AppStore
form: FormGroup;
popupObject = {
  type: '',
  title: '',
  id: null,
  subtitle: ''
};
msAuditFindingCategoryObject = {
  component: 'Master',
  type: null,
  values: null
}
formErrors: any;
  fileUploadPopupSubscriptionEvent: any;
  non_confirmity: number;
  is_close: boolean = false;
  popupControlEventSubscription: any;
  msAuditFindingCategorySubscriptionEvent:any;
  UsersStore = UsersStore;

  strengths  = []
  weakness  = []
  strength : any = '';
  weakneses : any = '';
  is_strength_exist: boolean = false;
  is_weak_exist: boolean = false;

constructor(private  _eventEmitterService : EventEmitterService,
  private _fileUploadPopupService: FileUploadPopupService,
  private _imageService: ImageServiceService,
  private _renderer2: Renderer2,
  private _utilityService: UtilityService,
  private _documentFileService: DocumentFileService,
  private _formBuilder: FormBuilder,
  private _cdr: ChangeDetectorRef,
  private _helperService: HelperServiceService,
  private _auditService : AuditCheckListService,
  private _usersService: UsersService,
  private _msAuditFindingCategoriesService: MsAuditFindingCategoriesService,

  ) { }

ngOnInit(): void {
  console.log(this.addAnswerPopupSource)
  this.form = this._formBuilder.group({
    evidence : '',
    comment :  [''],
    documents : [],
    ms_audit_finding_category_id:[null],
    title:['']
    //responsible_user_id : [null,[Validators.required]]
  })

  this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
    this.enableScrollbar();
    this.closeFileUploadModal();
  })

  this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.modalControl(item);
  })

  this.msAuditFindingCategorySubscriptionEvent = this._eventEmitterService.msAuditFindingCategory.subscribe(res=>{
    this.closeFindingCategoryModal();
  })


this.setInitialData()
}

getTypeComponet()
{
  if(this.addAnswerPopupSource.value?.ms_audit_finding)
  {
    return true;
  }
}

setInitialData(){
  if(this.addAnswerPopupSource.value){
   // console.log(this.addAnswerPopupSource.value?.ms_audit_finding?.ms_audit_finding_category?.language[0]?.pivot?.ms_audit_finding_category_id)
    this.form.patchValue({
      evidence : this.addAnswerPopupSource.value.evidence ? this.addAnswerPopupSource.value.evidence : '',
      comment : this.addAnswerPopupSource.value.comment ? this.addAnswerPopupSource.value.comment : '',
      title:this.addAnswerPopupSource.value?.ms_audit_finding?.title ? this.addAnswerPopupSource.value?.ms_audit_finding?.title : '',
      ms_audit_finding_category_id:this.addAnswerPopupSource.value?.ms_audit_finding?.ms_audit_finding_category?.language[0]?.pivot?.ms_audit_finding_category_id
      //responsible_user_id : this.addAnswerPopupSource.value.responsible_user ? this.addAnswerPopupSource.value.responsible_user : null,

    })
    this.non_confirmity = this.addAnswerPopupSource.value.is_conformance;
    var checkListDocumentDetails = this.addAnswerPopupSource.value.documents ? this.addAnswerPopupSource.value.documents : [];
      if(checkListDocumentDetails.length > 0){
        this.setDocuments(checkListDocumentDetails)
      }
      this.weakness =  this.setMultipledata(this.addAnswerPopupSource.value.ms_audit_checklist_weaknesses)
      this.strengths =  this.setMultipledata(this.addAnswerPopupSource.value.ms_audit_checklist_strengths)
      this.searchFindingCategory({term : this.addAnswerPopupSource.value?.ms_audit_finding?.ms_audit_finding_category?.language[0]?.pivot?.ms_audit_finding_category_id},true)
  }
  if(this.non_confirmity==0)
  {
    this.form.controls["ms_audit_finding_category_id"].setValidators([Validators.required]);
    this.form.controls["title"].setValidators([Validators.required]);
    this.form.controls["comment"].setValidators([Validators.required]);
  }
  else
  {
    this.form.controls["ms_audit_finding_category_id"].clearValidators();
    this.form.controls["title"].clearValidators();
    this.form.controls["comment"].clearValidators();
  }
  this.form.get("ms_audit_finding_category_id").updateValueAndValidity();
  this.form.get("title").updateValueAndValidity();
  this.form.controls["comment"].updateValueAndValidity();

}

setMultipledata(mulData){
  let returnData = []
  let obj = null
if(mulData.length > 0){
 for(let data of mulData){
   obj = {
     title : data.title ? data.title : '',
     id: data.id ? data.id : null
   }
   returnData.push(obj)
 }
}
return returnData
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
        var purl = this._auditService.getThumbnailPreview('audit-check-list', element.token)
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
  // this.checkForFileUploadsScrollbar();
  this._utilityService.detectChanges(this._cdr);
}

addNewFindingCategories()
    {
  this.msAuditFindingCategoryObject.type = 'Add';
  this.msAuditFindingCategoryObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openFormFindingCategoriesModal();
}
openFormFindingCategoriesModal()
{
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
  $(this.formModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}

closeFindingCategoryModal(){
  $(this.formModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
  $('.modal-backdrop').remove();
  this.msAuditFindingCategoryObject.type = null;
  if(MsAuditFindingCategoryMasterStore.lastInsertedId)
  {
    this.searchFindingCategory({term : MsAuditFindingCategoryMasterStore.lastInsertedId},true)
  }
  

}

searchFindingCategory(e,patchValue:boolean = false) {
  this._msAuditFindingCategoriesService.getItems(false,'&q=' + e.term).subscribe(res => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ ms_audit_finding_category_id: i.id });
          break;
        }
      }
    }

    this._utilityService.detectChanges(this._cdr);
  })
}

getFindingCategory() {
  let params=''
  this._msAuditFindingCategoriesService.getItems(false,params,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}


// * File Upload/Attach Modal

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
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
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

createImageUrl(type, token) {
  if (type == 'document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
  // else
    // return this._eventClosureService.getThumbnailPreview(type, token);

}

checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

 //getting button name by language
 getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}

processDataForSave(){
  let saveData = {
    evidence : this.form.value.evidence ? this.form.value.evidence  : '',
    comment : this.form.value.comment ? this.form.value.comment : '',
    is_conformance : this.non_confirmity,
    documents : [],
    ms_audit_finding_category_id:this.form.value.ms_audit_finding_category_id ? this.form.value.ms_audit_finding_category_id : null,
    title:this.form.value.title ? this.form.value.title : null,
    strengths : this.strengths ? this.strengths : [],
    weaknesses : this.weakness ? this.weakness : [],
    //responsible_user_id : this.form.value.responsible_user_id ? this.form.value.responsible_user_id.id : null,
  }
  if (this.addAnswerPopupSource.type = 'Edit') {
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
  } else{
    saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    
  }
  return saveData
}

changeAnswer(type:string){
  if(type == 'available'){
    this.non_confirmity = 1;
    this.form.controls["ms_audit_finding_category_id"].clearValidators();
    this.form.controls["title"].clearValidators();
    this.form.controls["comment"].clearValidators();
  } 
  else {
    this.form.controls["ms_audit_finding_category_id"].setValidators([Validators.required]);
    this.form.controls["title"].setValidators([Validators.required]);
    this.form.controls["comment"].setValidators([Validators.required]);
    this.non_confirmity = 0 ;
  }
  this.form.get("ms_audit_finding_category_id").updateValueAndValidity();
  this.form.get("title").updateValueAndValidity();
  this.form.get("comment").updateValueAndValidity();

}

getUsers() {
  this._usersService.getAllItems().subscribe((res) => {
    this._utilityService.detectChanges(this._cdr);
  });
}

createImagePreview(type, token) {
  return this._imageService.getThumbnailPreview(type, token)
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}

searchUers(e) {   
  this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

getDefaultImage(type){
  return this._imageService.getDefaultImageUrl(type);
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

addStrength(){
  if(this.strength){ 
    let data = {
      title : this.strength
    }
    if(this.strengths.length > 0){
      let pos = this.strengths.findIndex(e => e.title == this.strength )
      if(pos != -1){
        this.is_strength_exist = true
      }else{
        this.strengths.push(data)
        this.strength = ''
        this.is_strength_exist = false
      }
    }else {
      this.strengths.push(data)
      this.is_strength_exist = false;
      this.strength = ''

    }
  }
}

deleteStrength(strength){
  if(this.strengths.length > 0){
    let pos = this.strengths.findIndex(e => e.title == strength.title)
    if(pos != -1){
      this.strengths.splice(pos,1)
    }
  }
}
addWeakness(){
  if(this.weakneses){
    let data = {
      title : this.weakneses
    } 
    if(this.weakness.length > 0){
      let pos = this.weakness.findIndex(e => e.title == this.weakneses )
      if(pos != -1){
        this.is_weak_exist = true
      }else{
        this.weakness.push(data)
        this.weakneses = ''
        this.is_weak_exist = false
      }
    }else {
      this.weakness.push(data)
      this.is_weak_exist = false
      this.weakneses = ''

    }
  }
}

deleteWeakness(weakness){
  if(this.weakness.length > 0){
    let pos = this.weakness.findIndex(e => e.title == weakness.title)
    if(pos != -1){
      this.weakness.splice(pos,1)
    }
  }
}

save(close: boolean = false) {
  let save;
  AppStore.enableLoading();
//console.log(this.addAnswerPopupSource.type)
  if (this.addAnswerPopupSource.type == 'Edit') {
    //  save = this._auditService.updateCheckList(this.processDataForSave(),this.addAnswerPopupSource.values.id);
  } else {
    // delete this.form.value.id
    save = this._auditService.addAnswer(this.processDataForSave(),this.addAnswerPopupSource.value.id,AuditCheckListStore.is_view_answer);
  }

  save.subscribe((res: any) => {
    if (this.addAnswerPopupSource.type != 'Edit') {
      this.resetForm();
    }
    this.resetForm();
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    this.clearPopupObject()
    this.clearCommonFilePopupDocuments()
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
  AppStore.disableLoading();
  this.strengths = [];
  this.weakness = [];
}

addAnswer(close: boolean = false){
  if(AuditCheckListStore.is_view_answer == 1){
     this.save(close)
  }else{
    this.confirmSave(close)
  }
}

confirmSave(close: boolean = false){
  this.is_close = close
  event.stopPropagation();
        this.popupObject.type = 'submit';
        this.popupObject.id = null;
        this.popupObject.title = 'are_you_sure';
        this.non_confirmity ? this.popupObject.subtitle = 'add-answer-conformance-confirm-msg' : this.popupObject.subtitle = 'add-answer-non-conformance-confirm-msg';
        // this.popupObject.subtitle = 'add-answer-confirm-msg';
        this._utilityService.detectChanges(this._cdr);
        $(this.confirmationPopUp.nativeElement).modal('show');
    
}

      // modal control event
      modalControl(status: boolean) {
        switch (status) {
          case true : this.save(this.is_close)
            break;
          default : this.closeConfirmationPopup();
            break;  
        }
    
      }
    
      clearPopupObject() {
          this.popupObject.id = null;
        }
    closeConfirmationPopup(){
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    this.clearPopupObject()
    }

cancel(){
  this.resetForm()
  this._eventEmitterService.dismissAuditAddAnswerModal()
}
ngOnDestroy(){
  this.fileUploadPopupSubscriptionEvent.unsubscribe();
  this.popupControlEventSubscription.unsubscribe()
  this.clearCommonFilePopupDocuments()
}
}
