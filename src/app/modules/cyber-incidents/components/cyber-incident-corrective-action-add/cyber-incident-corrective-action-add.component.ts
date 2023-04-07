import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CyberIncidentCorrectiveActionService } from 'src/app/core/services/cyber-incident/cyber-incident-corrective-action/cyber-incident-corrective-action.service';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CyberIncidentCorrectiveActionStore } from 'src/app/stores/cyber-incident/cyber-incident-corrective-action-store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-cyber-incident-corrective-action-add',
  templateUrl: './cyber-incident-corrective-action-add.component.html',
  styleUrls: ['./cyber-incident-corrective-action-add.component.scss']
})
export class CyberIncidentCorrectiveActionAddComponent implements OnInit {
  @Input('source') Source: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  correctiveActionForm: FormGroup;
  formErrors: any;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadsArray = []; // for multiple file uploads
  AppStore = AppStore;
  CyberIncidentCorrectiveActionStore = CyberIncidentCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore;
  CyberIncidentStore = CyberIncidentStore;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _cyberIncidentCorrectiveActionService: CyberIncidentCorrectiveActionService,
    private _cyberIncidentService: CyberIncidentService,
    private _userService: UsersService
  ) { }

  ngOnInit(): void {
    this.correctiveActionForm = this._formBuilder.group({
      id: [""],
      title: ['', [Validators.required]],
      description: [''],
      estimated_cost: [''],
      cyber_incident_id: [null, [Validators.required]],
      responsible_user_ids: [[], [Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      documents: []
    })

    if (this.Source.type == 'Edit') {
      this.setFormValues();
    }

    if (this.Source.component == 'CICorrectiveAction' && (this.Source.type == 'Add' || this.Source.type == 'Edit')) {
      console.log(CyberIncidentStore?.incidentId);
      this.correctiveActionForm.patchValue({
        cyber_incident_id: CyberIncidentStore?.incidentId,
      })
      this.searchCI({term: CyberIncidentStore?.incidentId})
    } else if (this.Source.component == 'CorrectiveAction' && this.Source.type == 'Add') {
      this.correctiveActionForm.patchValue({
        cyber_incident_id: null,
      })
    }
  
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.getResponsibleUsers();
  }

  setFormValues() {
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);
    if (this.Source.hasOwnProperty('values') && this.Source.values) {
      this.correctiveActionForm.patchValue({
        id: this.Source.values.id,
        title: this.Source.values.title,
        description: this.Source.values.description,
        start_date: this.Source.values.start_date,
        target_date: this.Source.values.target_date,
        estimated_cost: this.Source.values.estimated_cost,
        cyber_incident_id: this.Source.values.cyber_incident_id,
        responsible_user_ids: this.Source.values.responsible_user_ids ? this.getById(this.Source.values.responsible_user_ids) : [],
        documents: ''
      })
      this.searchCI({term: this.Source.values.cyber_incident_id})
    }
  }

  getById(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
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

  // serach Findings
  searchCI(e, patchValue?) {
    this._cyberIncidentService.getAllItems(false, '&q=' + e.term).subscribe(res => {
      if (patchValue) {
        res.data.forEach(element => {
          if (element.id == e.term) {
            this.correctiveActionForm.patchValue({
              cyber_incident_id: element,
            })
            // this.getFindingDetails();
          }
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCI() {
    this._cyberIncidentService.getAllItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  getCIDetails() {
    if (this.correctiveActionForm.value?.cyber_incident_id?.id) {
      this._cyberIncidentService.getItem(this.correctiveActionForm.value.cyber_incident_id.id).subscribe(res => {
        this.correctiveActionForm.patchValue({
          cyber_incident_id:res
        })
        this.getResponsibleUsers();
        // if(this.CaSource.type == 'Add')
        // {
        //   this.getRca();
        // }
        this._utilityService.detectChanges(this._cdr);
      })
    }
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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // formating date
  formatStartDate() {
    if (this.correctiveActionForm.value.start_date) {
      let tempstartdate = this.correctiveActionForm.value.start_date;
      this.correctiveActionForm.value.start_date = this._helperService.processDate(tempstartdate, 'join');
      return this.correctiveActionForm.value.start_date;
    }
  }

  formatTargetDate() {
    if (this.correctiveActionForm.value.target_date) {
      let tempTargetdate = this.correctiveActionForm.value.target_date;

      this.correctiveActionForm.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
      return this.correctiveActionForm.value.target_date;
    }
  }

  // getting Responsible user
  getResponsibleUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
}

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

}

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  // cancel modal
  cancel() {
    this.resetForm();
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  // for resetting the form
  resetForm() {
    this.correctiveActionForm.reset();
    this.correctiveActionForm.pristine;
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();

  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  processSaveData() {
    let saveData = this.correctiveActionForm.value;
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    saveData['start_date'] = this._helperService.processDate(this.correctiveActionForm.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.correctiveActionForm.value.target_date, 'join');
    return saveData;
  }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    this.correctiveActionForm.patchValue({
      documents: CyberIncidentCorrectiveActionStore.docDetails,
      start_date:  this.formatStartDate(),
      target_date: this.formatTargetDate(),
    })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    if (this.correctiveActionForm.value.id) {
      save = this._cyberIncidentCorrectiveActionService.UpdateItem(this.correctiveActionForm.value.id, this.processSaveData());
    } else {
      save = this._cyberIncidentCorrectiveActionService.saveItem(this.processSaveData());
    }
    save.subscribe((res: any) => {
      CyberIncidentCorrectiveActionStore.new_ca_id = res.id;
      if(this.Source?.type=='Add' && !close)
      {
        this.resetForm();
        CyberIncidentCorrectiveActionStore.clearDocumentDetails();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
      if(close && (this.Source?.type=='Edit' || this.Source?.type=='Add'))
      {
       
        this.resetForm();
        CyberIncidentCorrectiveActionStore.clearDocumentDetails();
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    });
  }

  // for closing the modal
  closeFormModal() {
    //this.resetForm();
    this.clearFIleUploadPopupData();
    CyberIncidentCorrectiveActionStore.clearDocumentDetails();
    AppStore.disableLoading();
    this._eventEmitterService.dismissCyberIncidentCAModal();
    //this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }
   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  ngOnDestroy() {
    if(this.fileUploadPopupSubscriptionEvent) {
      this.fileUploadPopupSubscriptionEvent.unsubscribe();
    }
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

}
