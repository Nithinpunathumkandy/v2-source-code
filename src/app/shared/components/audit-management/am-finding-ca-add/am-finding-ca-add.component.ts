import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
// import { AmFindingCAStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { Router } from '@angular/router';
// import { AmAuditFindingStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
// import { CorrectiveActionService } from 'src/app/core/services/internal-audit/audit-findings/corrective-action/corrective-action.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AmFindingCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ca.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmAuditFindingCaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-ca/am-audit-finding-ca.service';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
// import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
declare var $: any;

@Component({
  selector: 'app-am-finding-ca-add',
  templateUrl: './am-finding-ca-add.component.html',
  styleUrls: ['./am-finding-ca-add.component.scss']
})
export class AmFindingCaAddComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('source') CaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  AmFindingCAStore = AmFindingCAStore;
  AmAuditFindingStore = AmAuditFindingStore;
  correctiveActionForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  UsersStore = UsersStore;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadsArray = []; // for multiple file uploads

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _router: Router,
    private _helperService: HelperServiceService,
    private _correctiveActionService: AmAuditFindingCaService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _auditFindingsService: AmAuditFindingService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    // form values

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

    // initial form reseting
    // this.resetForm();
    // Checking if Source has Values and Setting Form Value

    if (this.CaSource.type == 'Edit') {
      this.setFormValues();
    }
    if (this.CaSource.component == 'FindingCorrectiveAction' && (this.CaSource.type == 'Add' || this.CaSource.type == 'Edit')) {
      // this.setFindingId();
      this.searchFindings({ term: this.AmAuditFindingStore?.individualFindingDetails?.id ? this.AmAuditFindingStore?.individualFindingDetails?.id: this.CaSource.values.id}, true);

    } else if (this.CaSource.component == 'CorrectiveAction' && this.CaSource.type == 'Add') {
      this.correctiveActionForm.patchValue({
        finding_id: null,
      })
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    // calling data initially
    this.getResponsibleUsers();
  }

  ngDoCheck() {
    if (this.CaSource && this.CaSource.hasOwnProperty('values') && this.CaSource.values && !this.correctiveActionForm.value.id)
      this.setFormValues();
  }

  removeBrochure(doc) {
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

  setFormValues() {
    setTimeout(() => {
      this.enableScrollbar();
    }, 50);
    if (this.CaSource.hasOwnProperty('values') && this.CaSource.values) {
      this.correctiveActionForm.patchValue({
        id: this.CaSource.values.id,
        title: this.CaSource.values.title,
        description: this.CaSource.values.description,
        responsible_user_id: this.CaSource.values.responsible_user_id,
        finding_id: this.CaSource.values.findings,
        start_date: this.CaSource.values.start_date,
        target_date: this.CaSource.values.target_date,
        documents: ''
      })
      this.getFindingDetails();
    }
  }

  setDepartment(finding_id) {
    UsersStore.unsetUserList();
  }

  getFindingDetails() {
    if (this.correctiveActionForm.value?.finding_id) {
      this._auditFindingsService.getItem(this.correctiveActionForm.value.finding_id.id).subscribe(res => {
        this.getResponsibleUsers();
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  // serach Findings
  searchFindings(e, patchValue?) {
    this._auditFindingsService.getItems(false, 'q=' + e.term+'&am_audit_ids='+AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
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
    this._auditFindingsService.getItems(false,'am_audit_ids='+AmAuditFieldWorkStore.auditFieldWorkId).subscribe(() => this._utilityService.detectChanges(this._cdr));
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

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // getting Responsible user
  getResponsibleUsers() {
    // if (this.correctiveActionForm.value.finding_id) {
      // .am_audit?.am_individual_audit_plan?.departments?
      var params='';
       if (AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments)
        params = AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments? `?department_ids=${this.getEditValue(AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments)}` : ''
      this._userService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    // }
  }

  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i.id);
    }
    return returnValue;
  }

  // serach users
  searchUsers(e) {
    // if (this.correctiveActionForm.value.finding_id) {
      var params='';
      if (AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments)
       params = AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments? `&department_ids=${this.getEditValue(AmAuditFindingStore.individualFindingDetails?.am_audit?.am_individual_audit_plan?.departments)}` : ''
       this._userService.searchUsers('?q=' + e.term + params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    // }
  }

  // formating date
  formatStartDate() {
    // converting start date
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

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // file change function
  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
            .subscribe((res: HttpEvent<any>) => {
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
                  this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                    this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
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

  // imageblob function
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._correctiveActionService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
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
  /**
  * removing document file from the selected list
  * @param token -image token
  */
  removeDocument(token) {
    AmFindingCAStore.unsetDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkForFileUploadsScrollbar() {

    if (AmFindingCAStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  // for resetting the form
  resetForm() {
    // resetting respective form values to the null state for keeping findings id 
    this.correctiveActionForm.reset();
    this.correctiveActionForm.pristine;
    this.formErrors = null;
    this.clearCommonFilePopupDocuments();
    AppStore.disableLoading();


  }



  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    // this.correctiveActionForm.patchValue({
    //   documents: AmFindingCAStore.docDetails,
    //   start_date: this.formatStartDate(),
    //   target_date: this.formatTargetDate(),

    // })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    if (this.correctiveActionForm.value.id) {
      save = this._correctiveActionService.UpdateItem(AmFindingCAStore.correctiveActionDetails.am_audit_finding?.id, this.correctiveActionForm.value.id, this.processDataForSave());
    } else {
      save = this._correctiveActionService.saveItem(this.correctiveActionForm.value.finding_id.id, this.processDataForSave());
    }
    save.subscribe((res: any) => {
      AmFindingCAStore.new_ca_id = res.id;
      if(!this.correctiveActionForm.value.id){
        this.resetForm();
        AmFindingCAStore.clearDocumentDetails();
      }
      else{
        this.clearEditFiles();
      }
    

      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
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

  clearEditFiles(){
    fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }


  processDataForSave() {

    var saveData = {
      ...this.correctiveActionForm.value,
      start_date: this.formatStartDate(),
      target_date: this.formatTargetDate(),
      finding_id:this.correctiveActionForm.value.finding_id?.id
    };

    if (this.correctiveActionForm.value.id) {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    } else
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
    return saveData;
  }
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAmAuditFindingCaModal();
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  // *Common  File Upload/Attach Modal Functions Starts Here
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
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
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);

  }
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 2) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // *Common  File Upload/Attach Modal Functions Ends Here


  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.resetForm();
    AmFindingCAStore.clearDocumentDetails();
    // $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

}
