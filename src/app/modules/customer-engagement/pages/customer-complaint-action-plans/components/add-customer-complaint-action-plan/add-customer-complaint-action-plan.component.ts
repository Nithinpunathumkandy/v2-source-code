import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerComplaintActionPlanService } from 'src/app/core/services/customer-satisfaction/customer-complaint-action-plan/customer-complaint-action-plan.service';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { CustomerComplaintActionTypesService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-action-types/customer-complaint-action-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { CustomerComplaintActionTypesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-types';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  selector: 'app-add-customer-complaint-action-plan',
  templateUrl: './add-customer-complaint-action-plan.component.html',
  styleUrls: ['./add-customer-complaint-action-plan.component.scss']
})
export class AddCustomerComplaintActionPlanComponent implements OnInit {
  @Input('source') customerComplaintActionPlanObjectSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;

  form: FormGroup;
  formErrors: any;

  AppStore = AppStore;
  fileUploadPopupStore = fileUploadPopupStore;
  CustomerComplaintStore = CustomerComplaintStore;
  CustomerComplaintActionTypesMasterStore = CustomerComplaintActionTypesMasterStore;
  UsersStore = UsersStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;

  fileUploadsArray = [];
  fileUploadPopupSubscriptionEvent: any = null;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _customerComplaintActionPlanService: CustomerComplaintActionPlanService,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _customerComplaintService: CustomerComplaintService,
    private _userService: UsersService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _documentFileService : DocumentFileService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _customerComplaintActionTypesService: CustomerComplaintActionTypesService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [""],
      title: ['', [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      description: [''],
      customer_complaint_id: [[], [Validators.required]],
      customer_complaint_action_type_id: [null,[Validators.required]],
      watcher_ids: [[]],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      documents: []
    });
    if (this.customerComplaintActionPlanObjectSource.type == 'Edit') {
      this.setFormValues()
    }
    else{
      this.form.patchValue({
        start_date: this._helperService.getTodaysDateObject(),
        target_date: this._helperService.getTodaysDateObject()
      })
    }

    if (this.customerComplaintActionPlanObjectSource.page == true) {
      this.form.patchValue({
        customer_complaint_id: CustomerComplaintStore.selectedId ? CustomerComplaintStore.selectedId : ''
      })
      this.searchCustomerComplaint({ term: CustomerComplaintStore.selectedId });
      this._utilityService.detectChanges(this._cdr);
    }

    this.getCustomerComplaint();
    this.getCustomerComplaintActionTypes();
    this.getUsers();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  setFormValues() {
    this.formErrors = null;
    this.resetForm();
    setTimeout(() => {
      if(this.customerComplaintActionPlanObjectSource.values?.documents.length > 0){
        this.setDocuments(this.customerComplaintActionPlanObjectSource.values.documents)          
      }
    }, 200);
    this.form.patchValue({
      id: this.customerComplaintActionPlanObjectSource.values.id,
      customer_complaint_id: this.customerComplaintActionPlanObjectSource.values?.customer_complaint ? this.customerComplaintActionPlanObjectSource.values?.customer_complaint?.id : '',
      customer_complaint_action_type_id: this.customerComplaintActionPlanObjectSource.values?.customer_complaint_action_type ? this.customerComplaintActionPlanObjectSource.values?.customer_complaint_action_type?.id : '',
      responsible_user_id: this.customerComplaintActionPlanObjectSource.values?.responsible_user ? this.customerComplaintActionPlanObjectSource.values?.responsible_user : null,
      start_date: this.customerComplaintActionPlanObjectSource.values?.start_date ? this._helperService.processDate(this.customerComplaintActionPlanObjectSource.values?.start_date, 'split') : null,
      target_date: this.customerComplaintActionPlanObjectSource.values?.target_date ? this._helperService.processDate(this.customerComplaintActionPlanObjectSource.values?.target_date, 'split') : null,
      description: this.customerComplaintActionPlanObjectSource.values.description ? this.customerComplaintActionPlanObjectSource.values.description : '',
      title: this.customerComplaintActionPlanObjectSource.values.title ? this.customerComplaintActionPlanObjectSource.values.title : '',
      watcher_ids: this.customerComplaintActionPlanObjectSource.values.customer_complaint_action_plan_watchers ? this._helperService.getArrayProcessed(this.customerComplaintActionPlanObjectSource.values.customer_complaint_action_plan_watchers, false) : [],
      documents:''
    })
    this.searchCustomerComplaint({ term: this.customerComplaintActionPlanObjectSource.values?.customer_complaint?.id })
    this.searchCustomerComplaintActionTypes({ term: this.customerComplaintActionPlanObjectSource.values?.customer_complaint_action_type?.id })
    this._utilityService.detectChanges(this._cdr);
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._imageService.getThumbnailPreview('document-version', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    // this.enableScrollbar();
  }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  getCustomerComplaint() {
    this._customerComplaintService.getItems(false, null, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCustomerComplaint(e) {
    this._customerComplaintService.getItems(false, '&q=' + e.term).subscribe(res => {
      // this.getCustomerComplaintDetail();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCustomerComplaintDetail() {
    this._customerComplaintService.getItem(this.form.value.customer_complaint_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCustomerComplaintActionTypes() {
    this._customerComplaintActionTypesService.getItems(false, null, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCustomerComplaintActionTypes(e) {
    this._customerComplaintActionTypesService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAllUsers() {
    UsersStore.setAllUsers([]);
    this.getUsers();
  }

  // getting  user
  getUsers() {
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

  searchListclickValueClear(event) {
    return event.searchTerm = '';
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
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image url
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  cancel() {
    this.closeFormModal();

  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.clearCommonFilePopupDocuments();
    this._eventEmitterService.dissmissAddCustomerComplaintActionPlanModal();
  }

  // for resetting the form
  resetForm() {
    if (this.customerComplaintActionPlanObjectSource.page == true) {
      this.form.patchValue({
        customer_complaint_id: this.customerComplaintActionPlanObjectSource.values?.customer_complaint ? this.customerComplaintActionPlanObjectSource.values?.customer_complaint?.id : '',
        customer_complaint_action_type_id: null,
        responsible_user_id: null,
        start_date: null,
        target_date: null,
        description: null,
        title: null,
        watcher_ids: []
      })
      this.searchCustomerComplaint({ term: CustomerComplaintStore.selectedId });
    } else {
      this.form.reset();
    }
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  processDataForSave(value) {
    let saveData = {
      id: value.id ? value.id : '',
      title: value.title ? value.title : '',
      customer_complaint_action_type_id: value.customer_complaint_action_type_id ? value.customer_complaint_action_type_id : null,
      customer_complaint_id: value.customer_complaint_id ? value.customer_complaint_id : null,
      responsible_user_id: value.responsible_user_id ? value.responsible_user_id?.id : null,
      description: value.description ? value.description : '',
      start_date: this._helperService.processDate(value.start_date ? value.start_date : null, 'join'),
      target_date: this._helperService.processDate(value.target_date ? value.target_date : null, 'join'),
      watcher_ids: value.watcher_ids ? this._helperService.getArrayProcessed(value.watcher_ids, 'id') : null,
      documents: value.documents ? value.documents : []
    };
    return saveData;
  }

  clear(type) {
    switch (type) {
      case 'start_date':
        this.form.patchValue({
          start_date: null,
        });
        break;
      case 'target_date':
        this.form.patchValue({
          target_date: null,
        });
        break;
      default:
        break;
    }
  }


  // save(close: boolean = false) {
  //   this.formErrors = null;
  //   if (this.form.value) {
  //     let save;
  //     AppStore.enableLoading();
  //     if (this.form.value.id) {
  //       save = this._customerComplaintActionPlanService.updateCustomerComplaintActionPlan(this.form.value.id, this.processDataForSave());
  //     } else {
  //       delete this.form.value.id
  //       save = this._customerComplaintActionPlanService.saveCustomerComplaintActionPlan(this.processDataForSave());
  //     }
  //     save.subscribe((res: any) => {
  //       CustomerComplaintActionPlanStore.customerComplaintId = res.id;
  //       if (!this.form.value.id) {
  //         this.resetForm();
  //       }
  //       AppStore.disableLoading();
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       if (close) {
  //         this.closeFormModal();
  //         if (this.customerComplaintActionPlanObjectSource.page == true) {
  //           this._router.navigateByUrl('/customer-engagement/complaint/' + CustomerComplaintStore.selectedId + '/action-plan')
  //         } else {
  //           this._router.navigateByUrl("/customer-engagement/complaint-action-plan/" + CustomerComplaintActionPlanStore.customerComplaintId)
  //         }
  //       }
  //     }, (err: HttpErrorResponse) => {
  //       if (err.status == 422) {
  //         this.formErrors = err.error.errors;
  //       } else if (err.status == 500 || err.status == 403) {
  //         this.cancel();
  //       }
  //       AppStore.disableLoading();
  //       this._utilityService.detectChanges(this._cdr);

  //     });
  //   }
  // }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: CustomerComplaintActionPlanStore.docDetails,
    })
    let save;
    AppStore.enableLoading();
    this.form.value.documents = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
      if(this.form.value.id){
        let updateParam = {
          ...this.form.value,
          documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
        }
        save = this._customerComplaintActionPlanService.updateCustomerComplaintActionPlan(this.form.value.id,this.processDataForSave(updateParam));
      } else {
        delete this.form.value.id
        let updateParam = {
          ...this.form.value,
        }
      save = this._customerComplaintActionPlanService.saveCustomerComplaintActionPlan(this.processDataForSave(updateParam));
      }
    save.subscribe((res: any) => {
      CustomerComplaintActionPlanStore.complaintActionPlanId = res.id;
      this.resetForm();
      CustomerComplaintActionPlanStore.clearDocumentDetails();

      if (this.customerComplaintActionPlanObjectSource.page == false) {
        this._router.navigateByUrl("/customer-engagement/complaint-action-plan/" + CustomerComplaintActionPlanStore.complaintActionPlanId)
       } 
      //else {
      //   this._router.navigateByUrl("/customer-engagement/complaint-action-plan/" + CustomerComplaintActionPlanStore.customerComplaintId)
      // }
      AppStore.disableLoading();
      // setTimeout(() => {
      //   this._utilityService.detectChanges(this._cdr);
      // }, 500);
      if (close){
      this.closeFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    });

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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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
    
    ngOnDestroy(){
      this.fileUploadPopupSubscriptionEvent.unsubscribe();
      this.clearCommonFilePopupDocuments();
    }
}
