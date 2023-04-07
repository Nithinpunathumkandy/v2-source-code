import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditFollowUpStore } from 'src/app/stores/ms-audit-management/follow-up/audit-follow-up.store';
import { HttpErrorResponse } from '@angular/common/http';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
declare var $: any;


@Component({
  selector: 'app-follow-up-action-plan',
  templateUrl: './follow-up-action-plan.component.html',
  styleUrls: ['./follow-up-action-plan.component.scss']
})
export class FollowUpActionPlanComponent implements OnInit {
@Input('source') actionPlanSource;
@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
UsersStore = UsersStore;
AppStore = AppStore
AuditFollowUpStore =AuditFollowUpStore
OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
fileUploadPopupStore = fileUploadPopupStore
emptyTier = 'No data found'

form: FormGroup;
formErrors = null
  fileUploadPopupSubscriptionEvent: any;
  constructor(private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private  _followUpService : FollowUpService,
    private _fileUploadPopupService: FileUploadPopupService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: [null,[Validators.required]],
      start_date: ['',[Validators.required]],
      end_date: ['',[Validators.required]],
      responsible_user_ids: [null,[Validators.required]],
      documents: []
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    });

    if(this.actionPlanSource.type =='Edit'){
      this.editData()
    }
  }

  editData(){
    if(this.actionPlanSource.value){
      this.form.patchValue({
        id: this.actionPlanSource.value.id ? this.actionPlanSource.value.id : null,
        title: this.actionPlanSource.value.title ? this.actionPlanSource.value.title : null,
        start_date: this.actionPlanSource.value.start_date ? this._helperService.processDate(this.actionPlanSource.value.start_date,'split') : null,
        end_date: this.actionPlanSource.value.end_date ? this._helperService.processDate(this.actionPlanSource.value.end_date,'split') : null,
        responsible_user_ids: this.actionPlanSource.value.responsible_user_ids ? this._helperService.getArrayProcessed(this.actionPlanSource.value.responsible_user_ids,false) : [],
      })
      var actionPlanDocumetsDetails = this.actionPlanSource.value.documents ? this.actionPlanSource.value.documents : [];
      if(actionPlanDocumetsDetails.length > 0){
        this.setDocuments(actionPlanDocumetsDetails)
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

  getUsers() {
    this._usersService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
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

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
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

createImageUrl(type, token) {
  if (type == 'document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
  // else
    // return this._eventClosureService.getThumbnailPreview(type, token);

}

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


processDataForSave(){
  let saveData = {
    id : this.form.value.id ? this.form.value.id : null,
    title: this.form.value.title ? this.form.value.title : '',
    start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date,'join') : '',
    end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date,'join') : '',
    responsible_user_ids: this.form.value.responsible_user_ids ? this.form.value.responsible_user_ids : [],
    documents: []
  }
  if (this.actionPlanSource.type == 'Edit') {
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
  } else{
    saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    
  }
  return saveData
}


save(close: boolean = false) {
  let save;
  AppStore.enableLoading();

  if (this.actionPlanSource.type == 'Edit') {
    save = AuditFollowUpStore.setActionPlans(this.processDataForSave(),this.actionPlanSource.index);

  } else {
    // delete this.form.value.id
    save = AuditFollowUpStore.setActionPlans(this.processDataForSave(),null);
  }

  // save.subscribe((res: any) => {
    if(!AuditFollowUpStore.is_alreadyExist){
      if (this.actionPlanSource.type != 'Edit') {
        this.resetForm();
      }
      this.resetForm()
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel();
  
    }else {
      AppStore.disableLoading();
    }
 
}
clearCommonFilePopupDocuments() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearUpdateFiles();
}
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  this.clearCommonFilePopupDocuments();
  AppStore.disableLoading();
}

 //getting button name by language
 getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}
  cancel(){
    this.resetForm()
    this._eventEmitterService.dismissAuditFollowUpActionPlanModal()
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }
}
