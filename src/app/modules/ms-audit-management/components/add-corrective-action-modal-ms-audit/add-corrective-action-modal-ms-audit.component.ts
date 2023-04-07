import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsauditFindingsRcaService } from 'src/app/core/services/ms-audit-management/findings-rca/msaudit-findings-rca.service';
import { AuditNonConfirmityService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditCorrectiveActionStore } from 'src/app/stores/ms-audit-management/corrective-acction/corrective-action.store';
import { FindingRCAStore } from 'src/app/stores/ms-audit-management/findings-rca/findings-rca.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-add-corrective-action-modal-ms-audit',
  templateUrl: './add-corrective-action-modal-ms-audit.component.html',
  styleUrls: ['./add-corrective-action-modal-ms-audit.component.scss']
})
export class AddCorrectiveActionModalMsAuditComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('source') CaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  correctiveActionForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuditCorrectiveActionStore = AuditCorrectiveActionStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  UsersStore = UsersStore;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadsArray = []; // for multiple file uploads
  FindingRCAStore=FindingRCAStore;
  lastItem:any;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _auditNonConfirmityService : AuditNonConfirmityService,
    private _eventEmitterService: EventEmitterService,
    private _msauditFindingsRcaService:MsauditFindingsRcaService,
    private  _followUpService : FollowUpService) { }

  ngOnInit(): void {
    //console.log(AuditNonConfirmityStore?.msAuditNonConfirmityId)
    this.correctiveActionForm = this._formBuilder.group({
      id: [""],
      rca_title:[''],
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

    // if(this.CaSource.type == 'Add')
    // {
    //   this.getRca()
    // }
    //console.log(this.CaSource.component)
    if (this.CaSource.component == 'FindingCorrectiveAction' && (this.CaSource.type == 'Add' || this.CaSource.type == 'Edit')) {
      // this.setFindingId();
     // console.log("hi")
      this.searchFindings({ term: AuditNonConfirmityStore.msAuditNonConfirmityId }, true);
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

  getRca(newPage: number = null) {
    this.lastItem = null;
    var lastWhy = null;
    if (newPage) FindingRCAStore.setCurrentPage(newPage);
    console.log(this.correctiveActionForm.value.finding_id.id)
    if(this.correctiveActionForm.value.finding_id.id)
    {
      this._msauditFindingsRcaService.getItems(this.correctiveActionForm.value.finding_id.id).subscribe(res=>{
        lastWhy = FindingRCAStore.allItems[FindingRCAStore.allItems.length-1];
        this.lastItem = lastWhy.description;
        //console.log(this.lastItem);
        this.correctiveActionForm.patchValue({
          rca_title:this.lastItem
        })
        this._utilityService.detectChanges(this._cdr);
      });
    }
   
  
  }


  assignValues() {
    this.correctiveActionForm.patchValue({
      finding_id: AuditNonConfirmityStore.msAuditNonConfirmityId
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
    if (this.correctiveActionForm.value?.finding_id?.id) {
      this._auditNonConfirmityService.getIndividualCheckList(this.correctiveActionForm.value.finding_id.id).subscribe(res => {
        this.correctiveActionForm.patchValue({
          finding_id:res
        })
        this.getResponsibleUsers();
        this.getRca();
        
        
        
       
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
    this._auditNonConfirmityService.getItems(false, '&q=' + e.term).subscribe(res => {
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
    this._auditNonConfirmityService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
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
        this.searchFindings({ term: this.correctiveActionForm.value.finding_id }, true)
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
      // console.log(JSON.parse(JSON.stringify(this.correctiveActionForm.value)))
      // let params = '?department_ids=' + this.correctiveActionForm.value.finding_id.departments[0].id
      
      this._userService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  // serach users
  searchUsers(e) {
    

      // var params
      // if (this.correctiveActionForm.value.finding_id.hasOwnProperty('finding_department_ids'))
      //   params = this.correctiveActionForm.value.finding_id?.finding_department_ids ? '?department_ids=' + this.correctiveActionForm.value.finding_id?.finding_department_ids : ''
      // else if (this.correctiveActionForm.value.finding_id.hasOwnProperty('departments'))
      //   params = this.correctiveActionForm.value?.finding_id?.departments.length > 0 ? `?department_ids=${this.getEditValue(this.correctiveActionForm.value?.finding_id?.departments)}` : ''
      // console.log(params);
      // let params = '&department_ids='+this.correctiveActionForm.value.finding_id.departments[0].id
      // let params =this.correctiveActionForm.value?.finding_id?.departments.length > 0 ? `?department_ids=${this.getEditValue(this.correctiveActionForm.value?.finding_id?.departments)}`:''
      this._userService.searchUsers('?q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  
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
    fileUploadPopupStore.clearUpdateFiles();
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
      save = this._followUpService.UpdateItem(this.correctiveActionForm.value.id, this.processSaveData());
    } else {
      save = this._followUpService.saveItem(this.correctiveActionForm.value.finding_id.id, this.processSaveData());
    }
    save.subscribe((res: any) => {
      AuditCorrectiveActionStore.new_ca_id = res.id;
      if(this.CaSource?.type=='Add' && !close)
      {
        this.resetForm();
        AuditCorrectiveActionStore.clearDocumentDetails();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
      if (this.CaSource.component == 'CorrectiveAction' && close && this.CaSource.redirect){
        
        this._router.navigateByUrl(
        "/ms-audit-management/corrective-actions/findings/"+this.correctiveActionForm.value.finding_id?.id+"/corrective-actions/"+res.id)
        //this.resetForm();
      } 
      if(close && (this.CaSource?.type=='Edit' || this.CaSource?.type=='Add'))
      {
       
        this.resetForm();
        AuditCorrectiveActionStore.clearDocumentDetails();
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
    AuditCorrectiveActionStore.clearDocumentDetails();
    AppStore.disableLoading();
    this._eventEmitterService.dismissCorrectiveActionModal();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }
   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
