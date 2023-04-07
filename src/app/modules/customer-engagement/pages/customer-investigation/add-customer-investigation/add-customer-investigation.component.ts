import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { CustomerInvestigationService } from 'src/app/core/services/customer-satisfaction/customer-investigation/customer-investigation.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-add-customer-investigation',
  templateUrl: './add-customer-investigation.component.html',
  styleUrls: ['./add-customer-investigation.component.scss']
})
export class AddCustomerInvestigationComponent implements OnInit {
  @Input('source') customerInvestigationObjectSource: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;

  form: FormGroup;
  formErrors: any;

  previous_non_conformity = [{
    title: "Yes",
    type: "yes",
    id: 1
  },
  {
    title: "No",
    type: "no",
    id: 0
  }]

  AppStore = AppStore;
  fileUploadPopupStore = fileUploadPopupStore;
  CustomerComplaintStore = CustomerComplaintStore;
  CustomerInvestigationStore = CustomerInvestigationStore;
  CustomerComplaintActionPlanStore = CustomerComplaintActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  FindingsStore = FindingsStore;
  fileUploadPopupSubscriptionEvent: any = null;
  enableNonConfirmity: boolean = false;
  fileUploadsArray = [];

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _customerInvestigationService: CustomerInvestigationService,
    private _imageService: ImageServiceService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _findingsService: FindingsService,
    private _customerComplaintService: CustomerComplaintService,
    private _fileUploadPopupService: FileUploadPopupService,
    private _router: Router,
    private _fileService: CustomerEngagementFileServiceService

  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      description: [''],
      customer_complaint_id: [[], [Validators.required]],
      is_previous_non_conformity: [null, [Validators.required]],
      non_conformity_id: [null],
      documents: [],
      customer_complaint_investigation_status_id: [null]
    });
    if (this.customerInvestigationObjectSource.type == 'Edit') {
      this.setFormValues()
    }

    if (this._router.url !== '/customer-engagement/complaint-investigation') {
      this.form.patchValue({
        customer_complaint_id: CustomerComplaintStore.selectedId ? CustomerComplaintStore.selectedId : ''
      })
      this.searchCustomerComplaint({ term: CustomerComplaintStore.selectedId });
      this._utilityService.detectChanges(this._cdr);
    }

    this.getCustomerComplaint();

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  // getInvestigation() {
  //   this._customerInvestigationService.getItems().subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })

  // }

  setFormValues() {
    this.formErrors = null;
    this.resetForm();
    // setTimeout(() => {
    //   this.enableScrollbar();
    //   if(this.customerInvestigationObjectSource.values?.documents?.length > 0){
    //     this.enableScrollbar();
    //     this.setDocuments(this.customerInvestigationObjectSource.values?.documents)          
    //   }
    //   this._utilityService.detectChanges(this._cdr);
    // }, 50);
    
    this.form.patchValue({
      id: this.customerInvestigationObjectSource.values.id,
      is_previous_non_conformity: this.customerInvestigationObjectSource.values.is_previous_non_conformity == 1 ? 'yes' : 'no',
      customer_complaint_id: this.customerInvestigationObjectSource.values?.customer_complaint_id ? this.customerInvestigationObjectSource.values?.customer_complaint_id : '',
      description: this.customerInvestigationObjectSource.values.description ? this.customerInvestigationObjectSource.values.description : '',
      non_conformity_id: this.customerInvestigationObjectSource.values.non_conformity_id ? this.customerInvestigationObjectSource.values.non_conformity_id : '',
    })
    if (this.customerInvestigationObjectSource.values.documents.length > 0) {
      this.setDocuments(this.customerInvestigationObjectSource.values.documents);
    }
    this.showNonConfimity();
    this.searchCustomerComplaint({ term: this.customerInvestigationObjectSource.values?.customer_complaint_id })
    this.searchFindings({ term: this.customerInvestigationObjectSource.values.non_conformity_id })
    this._utilityService.detectChanges(this._cdr);
    // })
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
          var purl = this._fileService.getThumbnailPreview('customer-investigation-document', element.token);
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
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // cancel modal
  cancel() {
    this.closeFormModal();

  }

  // for closing the modal
  closeFormModal() {
    this._eventEmitterService.dismissCustomerInvestigationModal();
    this.resetForm();
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
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

  processDataForSave() {

    let saveData = {
      id: this.form.value.id ? this.form.value.id : '',
      customer_complaint_id: this.form.value.customer_complaint_id?.id ? this.form.value.customer_complaint_id?.id : this.form.value.customer_complaint_id?this.form.value.customer_complaint_id:null,
      description: this.form.value.description ? this.form.value.description : '',
      non_conformity_id: this.form.value.non_conformity_id ? this.form.value.non_conformity_id : '',
      // is_previous_non_conformity: this.form.value.is_previous_non_conformity=='yes' ? true : false
      customer_complaint_investigation_status_id: 1
    };
    if (this.form.value.is_previous_non_conformity == 'yes') {
      saveData['is_previous_non_conformity'] = this.form.value.is_previous_non_conformity == 'yes' ? true : ''
    } else {
      saveData['is_previous_non_conformity'] = this.form.value.is_previous_non_conformity == 'no' ? false : ''
    }
    if (this.form.value.id) {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    } else
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')

    return saveData;
  }


  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;

    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {

        save = this._customerInvestigationService.updateCustomerInvestigation(this.form.value.id, this.processDataForSave());
      } else {

        delete this.form.value.id
        save = this._customerInvestigationService.saveCustomerInvestigation(this.processDataForSave());
      }

      save.subscribe((res: any) => {
        // this.res_id = res.id;// assign id to variable;
        if (!this.form.value.id) {
          this.resetForm();
          CustomerInvestigationStore.clearDocumentDetails();
        }

        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.closeFormModal();
          CustomerInvestigationStore.clearDocumentDetails();

        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;

          // this.processFormErrors();
        } else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  getFindings() {
    this._findingsService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  searchFindings(e, patchValue?) {
    this._findingsService.getItems(false, '&q=' + e.term).subscribe(res => {
      if (patchValue) {
        res.data.forEach(element => {
          if (element.id == e.term) {
            this.form.patchValue({
              non_conformity_id: element,
            })
          }
        })
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  showNonConfimity() {
    if (this.form.value.is_previous_non_conformity == 'yes')
      this.enableNonConfirmity = true;
    else
      this.enableNonConfirmity = false;
  }
  // * File Upload/Attach Modal

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

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._fileService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
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

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
  }

}
