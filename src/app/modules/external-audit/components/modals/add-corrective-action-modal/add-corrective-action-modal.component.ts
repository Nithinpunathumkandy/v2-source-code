import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { CorrectiveActionService } from 'src/app/core/services/external-audit/corrective-action/corrective-action.service';
import { FindingMasterStore } from 'src/app/stores/external-audit/findings/findings-store';
import { Router } from '@angular/router';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { FindingsService } from 'src/app/core/services/external-audit/findings/findings.service';
import { ExternalAuditCorrectiveActionStore } from 'src/app/stores/external-audit/corrective-actions/corrective-actions-store';
import { ExternalAuditCorrectiveActionsService } from 'src/app/core/services/external-audit/corrective-actions/external-audit-corrective-actions.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
declare var $: any;
@Component({
  selector: 'app-add-corrective-action-modal',
  templateUrl: './add-corrective-action-modal.component.html',
  styleUrls: ['./add-corrective-action-modal.component.scss']
})
export class AddCorrectiveActionModalComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('source') CaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  correctiveActionForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ExternalAuditCorrectiveActionStore = ExternalAuditCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  FindingMasterStore = FindingMasterStore;
  UsersStore = UsersStore;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadsArray = []; // for multiple file uploads


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _findingsService: FindingsService,
    private _correctiveActionService: CorrectiveActionService,
    private _eventEmitterService: EventEmitterService,
    private _externalAuditCorrectiveActionService: ExternalAuditCorrectiveActionsService) { }

  ngOnInit(): void {
    this.correctiveActionForm = this._formBuilder.group({
      id: [""],
      title: ['', [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      description: [''],
      finding_id: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      documents: []
    })
    if (this.CaSource.type == 'Edit') {
      this.setFormValues();
    }
    if (this.CaSource.component == 'FindingCorrectiveAction' && (this.CaSource.type == 'Add' || this.CaSource.type == 'Edit')) {
      // this.setFindingId();
      if(this.FindingMasterStore?.individualExternalAuditFindingItemId?.id)
      {
       
        this.searchFindings({ term: this.FindingMasterStore?.individualExternalAuditFindingItemId?.id }, true);
      }
    } else if (this.CaSource.component == 'CorrectiveAction' && this.CaSource.type == 'Add') {
      this.correctiveActionForm.patchValue({
        finding_id: null,
      })
    }
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.getResponsibleUsers();
  }

  assignValues() {
    this.correctiveActionForm.patchValue({
      finding_id: FindingMasterStore.auditFindingId
    })
  }

  ngDoCheck() {
    if (this.CaSource && this.CaSource.hasOwnProperty('values') && this.CaSource.values && !this.correctiveActionForm.value.id)
      this.setFormValues();
  }

  setDepartment(finding_id) {
    UsersStore.unsetUserList();
  }

  getFindingDetails() {
    if (this.correctiveActionForm.value?.finding_id) {
      this._findingsService.getItem(this.correctiveActionForm.value.finding_id.id).subscribe(res => {
        this.getResponsibleUsers();
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  // serach Findings
  searchFindings(e, patchValue?) {
    this._findingsService.getItems(false, '&q=' + e.term).subscribe(res => {
      if (patchValue) {
        res.data.forEach(element => {
          if (element.id == e.term) {
            this.correctiveActionForm.patchValue({
              finding_id: element,
            })
            this.getFindingDetails();
          }
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindings() {
    this._findingsService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  setFormValues() {
    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);
    if (this.CaSource.hasOwnProperty('values') && this.CaSource.values) {
      this.correctiveActionForm.patchValue({
        id: this.CaSource.values.id,
        title: this.CaSource.values.title,
        description: this.CaSource.values.description,
        responsible_user_id: this.CaSource.values.responsible_user.id,
        finding_id: this.CaSource.values.findings,
        start_date: this.CaSource.values.start_date,
        target_date: this.CaSource.values.target_date,
        documents: ''
      })
      if (this.CaSource.component == 'CorrectiveAction') {
        this.getFindingDetails();
        this.searchFindings({ term: this.CaSource.values.findings.id }, true)
      }
      if (this.CaSource.values.responsible_user) this.searchUsers({ term: this.CaSource.values.responsible_user.id });
    }
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

  // getting Responsible user
  getResponsibleUsers() {
    if (this.correctiveActionForm.value.finding_id) {
      // console.log(JSON.parse(JSON.stringify(this.correctiveActionForm.value)))
      // let params = '?department_ids=' + this.correctiveActionForm.value.finding_id.departments[0].id
      var params
      if (this.correctiveActionForm.value.finding_id.hasOwnProperty('finding_department_ids'))
        params = this.correctiveActionForm.value.finding_id?.finding_department_ids ? '?department_ids=' + this.correctiveActionForm.value.finding_id?.finding_department_ids : ''
      else if (this.correctiveActionForm.value.finding_id.hasOwnProperty('departments'))
        params = this.correctiveActionForm.value?.finding_id?.departments.length > 0 ? `?department_ids=${this.getEditValue(this.correctiveActionForm.value?.finding_id?.departments)}` : ''
      console.log(params);
      this._userService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // serach users
  searchUsers(e) {
    if (this.correctiveActionForm.value.finding_id) {

      var params
      if (this.correctiveActionForm.value.finding_id.hasOwnProperty('finding_department_ids'))
        params = this.correctiveActionForm.value.finding_id?.finding_department_ids ? '?department_ids=' + this.correctiveActionForm.value.finding_id?.finding_department_ids : ''
      else if (this.correctiveActionForm.value.finding_id.hasOwnProperty('departments'))
        params = this.correctiveActionForm.value?.finding_id?.departments.length > 0 ? `?department_ids=${this.getEditValue(this.correctiveActionForm.value?.finding_id?.departments)}` : ''
      console.log(params);
      // let params = '&department_ids='+this.correctiveActionForm.value.finding_id.departments[0].id
      // let params =this.correctiveActionForm.value?.finding_id?.departments.length > 0 ? `?department_ids=${this.getEditValue(this.correctiveActionForm.value?.finding_id?.departments)}`:''
      this._userService.searchUsers('?q=' + e.term + params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id);
    }
    return returnValue;
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
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  // for resetting the form
  resetForm() {
    // resetting respective form values to the null state for keeping findings id 
    if (this.CaSource.component == 'FindingCorrectiveAction') {
      this.correctiveActionForm.patchValue({
        title: '',
        responsible_user_id: null,
        description: '',
        start_date: null,
        target_date: null
      });
    } else {
      this.correctiveActionForm.reset();
      this.correctiveActionForm.pristine;
    }
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();

  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  processSaveData() {
    let saveData = this.correctiveActionForm.value;
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    saveData['start_date'] = this._helperService.processDate(this.correctiveActionForm.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.correctiveActionForm.value.target_date, 'join');
    saveData['finding_id'] = this.correctiveActionForm.value.finding_id.id;
    return saveData;
  }

  // save function
  save(close: boolean = false) {
    //console.log(close);
    this.formErrors = null;
    // this.correctiveActionForm.patchValue({
    //   documents: ExternalAuditCorrectiveActionStore.docDetails,
    //   start_date:  this.formatStartDate(),
    //   target_date: this.formatTargetDate(),
    // })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.kpiing_to);
    if (this.correctiveActionForm.value.id) {
      save = this._externalAuditCorrectiveActionService.UpdateItem(ExternalAuditCorrectiveActionStore.correctiveActionDetails.finding_id, this.correctiveActionForm.value.id, this.processSaveData());
    } else {
      save = this._externalAuditCorrectiveActionService.saveItem(this.correctiveActionForm.value.finding_id.id, this.processSaveData());
    }
    save.subscribe((res: any) => {
      ExternalAuditCorrectiveActionStore.new_ca_id = res.id;
      const finding_id=this.correctiveActionForm.value.finding_id.id  
      if(this.CaSource?.type=='Add' && !close)
      {
        this.resetForm();
        ExternalAuditCorrectiveActionStore.clearDocumentDetails();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
      if (this.CaSource.component == 'FindingCorrectiveAction' && close ){
      this._router.navigateByUrl(
        "/external-audit/audit-findings/" + ExternalAuditCorrectiveActionStore?.correctiveActionDetails?.finding_id + "/corrective-actions")
      }else if (this.CaSource.component == 'CorrectiveAction' && close){
        this._router.navigateByUrl(
          "/external-audit/corrective-action/findings/" + finding_id + "/corrective-actions/" +ExternalAuditCorrectiveActionStore.new_ca_id)
      }
        // external-audit/audit-findings/106/corrective-actions
        // external-audit/corrective-action/findings/106/corrective-actions/256
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
    this.resetForm();
    AppStore.disableLoading();
    this._eventEmitterService.dismissCorrectiveActionModal();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  ngOnDestroy() {
    // $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }
}
