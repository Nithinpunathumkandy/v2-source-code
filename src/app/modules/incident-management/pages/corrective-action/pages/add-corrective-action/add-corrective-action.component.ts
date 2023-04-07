import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { Router } from '@angular/router';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
declare var $: any;
@Component({
  selector: 'app-add-corrective-action',
  templateUrl: './add-corrective-action.component.html',
  styleUrls: ['./add-corrective-action.component.scss']
})
export class AddCorrectiveActionComponent implements OnInit {
  @Input('source') IncidentCorrectiveActionObjectSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;

  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
  UsersStore = UsersStore;
  AppStore = AppStore;
  IncidentStore = IncidentStore;
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  form: FormGroup;
  formErrors: any;
  startDate:any = new Date();
  targetDate:any = new Date();
  res_id;
  fileUploadPopupSubscriptionEvent:any;
  showIncidentDetails: boolean = false;
  constructor(private _formBuilder:FormBuilder,
              private _helperService: HelperServiceService,
              private _incidentCorrectiveActionService: IncidentCorrectiveActionService,
              private _utilityService:UtilityService,
              private _renderer2: Renderer2,
              private _documentFileService: DocumentFileService,
              private _cdr: ChangeDetectorRef,
              private _eventEmitterService:EventEmitterService,
              private _userService: UsersService,
              private _incidentService : IncidentService,
              private _imageService: ImageServiceService,
              private _router:Router) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      incident_id: [null, [Validators.required]],
      watcher_ids:[null],
      responsible_user_id: [null, [Validators.required]],
      budget: ['',[Validators.required, Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      title: ['', [Validators.required]],
      start_date: ['',[Validators.required]],
      target_date: ['',[Validators.required]],
      description: [''],
      documents: ''

    });

    // Checking if Source has Values and Setting Form Value

    // if (this.IncidentCorrectiveActionObjectSource && this.IncidentCorrectiveActionObjectSource.hasOwnProperty('values') && this.IncidentCorrectiveActionObjectSource.values) {
    //   this.setFormValues();
    // }

    if (this.IncidentCorrectiveActionObjectSource.type=='Edit') {
      this.setFormValues(); 
    }

    if (this._router.url.indexOf('corrective-actions-list') != -1) {
      IncidentCorrectiveActionStore.setSubMenuHide(true);
        this.form.patchValue({
          incident_id: IncidentStore.selectedId? IncidentStore.selectedId : ''
        })
        this.changeIncidentItem()
        this._utilityService.detectChanges(this._cdr);

    }

     this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.getResponsibleUsers();

  }
  ngDoCheck(){
    if (this.IncidentCorrectiveActionObjectSource && this.IncidentCorrectiveActionObjectSource.hasOwnProperty('values') && this.IncidentCorrectiveActionObjectSource.values && !this.form.value.id)
      this.setFormValues();
  }
  setFormValues(){
    this.searchIncident({term:this.IncidentCorrectiveActionObjectSource.values.incident_id});
    this.form.patchValue({
      id: this.IncidentCorrectiveActionObjectSource.values.id,
      title: this.IncidentCorrectiveActionObjectSource.values.title? this.IncidentCorrectiveActionObjectSource.values.title : '',
      budget: this.IncidentCorrectiveActionObjectSource.values.budget? this.IncidentCorrectiveActionObjectSource.values.budget : '',
      incident_id: this.IncidentCorrectiveActionObjectSource.values.incident_id? this.IncidentCorrectiveActionObjectSource.values.incident_id : null,
      start_date: this.IncidentCorrectiveActionObjectSource.values.start_date? this.IncidentCorrectiveActionObjectSource.values.start_date : null,
      target_date: this.IncidentCorrectiveActionObjectSource.values.target_date? this.IncidentCorrectiveActionObjectSource.values.target_date : null,
      description: this.IncidentCorrectiveActionObjectSource.values.description? this.IncidentCorrectiveActionObjectSource.values.description : '',
      responsible_user_id: this.IncidentCorrectiveActionObjectSource.values?.responsible_user_id ?  this.IncidentCorrectiveActionObjectSource.values?.responsible_user_id  : null,
      watcher_ids: this.IncidentCorrectiveActionObjectSource.values.watcher_ids ? this._helperService.getArrayProcessed(this.IncidentCorrectiveActionObjectSource.values.watcher_ids,null) : null,
      documents:''
    })
  }
 // for resetting the form
 resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();


}

changeIncidentItem(){
  let id
  if(this._router.url.indexOf('corrective-actions-list') != -1) {
    id = IncidentStore.selectedId
  }else{
   id = this.form.value.incident_id
  }
  this.incidentDetails(id);
}
incidentDetails(id){
  if(id){ 
  this._incidentService.getItem(id).subscribe(res=>{
    this.showIncidentDetails = true
    this._utilityService.detectChanges(this._cdr);
})
  }


}

// for closing the modal
closeFormModal() {
  this.resetForm();
  
  // if(this.res_id!=null){
  //   this._router.navigateByUrl("/incident-management/incident-corrective-actions/" + this.res_id);
  // }
  AppStore.disableLoading();
  this._eventEmitterService.dismissAddIncidentCorrectiveAction();
  this.fileUploadPopupSubscriptionEvent.unsubscribe();
}

     // processing datas for save

     changeDate(){
      this.form.patchValue({
       target_date : this.form.value.start_date
       
      })
      this._utilityService.detectChanges(this._cdr);
    }

    openFileUploadModal() {
      setTimeout(() => {
        fileUploadPopupStore.openPopup = true;
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

    createImageUrl(type, token) {
      return this._documentFileService.getThumbnailPreview(type, token);    
    }
  

    enableScrollbar() {
      if (fileUploadPopupStore.displayFiles.length >= 3) {
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else {
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }

     // extension check function
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
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

processDataForSave() {
  let saveData = {
    id: this.form.value.id ? this.form.value.id : '',
    incident_id: this.form.value.incident_id ? this.form.value.incident_id : null,
    responsible_user_id: this.form.value.responsible_user_id ? this.form.value.responsible_user_id?.id : null,
    watcher_ids:this.form.value.watcher_ids ? this._helperService.getArrayProcessed(this.form.value.watcher_ids,'id') : null,
    title: this.form.value.title ? this.form.value.title : '',
    budget: this.form.value.budget ? this.form.value.budget : null,
    description: this.form.value.description ? this.form.value.description : '',
    start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
    target_date: this.form.value.target_date ? this._helperService.processDate(this.form.value.target_date, 'join') : '',
    documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
  }
  // saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);

  return saveData;
}

// getting Responsible user
getResponsibleUsers() {
  this._userService.getAllItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

// search users
searchUsers(e) {
  this._userService.searchUsers('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
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

// search Incident
searchIncident(e) {
  this._incidentService.searchIncident('&q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

createImagePreview(type,token){
  return this._imageService.getThumbnailPreview(type,token)
}
// Returns default image url
getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

getIncidents() {
  this._incidentService.getItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })

}


// function for add & update
save(close: boolean = false) {
  this.formErrors = null;

  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._incidentCorrectiveActionService.updateItem(this.form.value.id, this.processDataForSave(), IncidentStore.selectedId ? true : false);
    } else {
      // delete this.form.value.id
      save = this._incidentCorrectiveActionService.saveCorrectiveAction(this.processDataForSave(),IncidentStore.selectedId ? true : false);
    }

    save.subscribe((res: any) => {
      this.res_id = res.id;// assign id to variable;
      if (!this.form.value.id) {
        this.resetForm();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if(!IncidentStore.selectedId)
          this._router.navigateByUrl('/incident-management/incident-corrective-actions/'+res.id)

      }, 500);
     
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      } else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }
}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}
}
