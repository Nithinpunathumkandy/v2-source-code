import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmCsaService } from 'src/app/core/services/audit-management/am-csa/am-csa.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  selector: 'app-am-csa-modal',
  templateUrl: './am-csa-modal.component.html',
  styleUrls: ['./am-csa-modal.component.scss']
})
export class AmCsaModalComponent implements OnInit {

  @Input('source') csaSource: any
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  AuthStore = AuthStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadPopupSubscriptionEvent: any;

  constructor(private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _departmentService: DepartmentService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _auditManagementService: AuditManagementService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _csaService: AmCsaService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      department_id: [null],
      documents: [[]],

    });

    // restingForm on initial load

    // Checking if Source has Values and Setting Form Value
    if (this.csaSource.type == 'Edit') {
      this.setFormValues()
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  searchDepartment(e) {

    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  
  setFormValues() {
    if (this.csaSource.hasOwnProperty('values') && this.csaSource.values) {
      let { id, title, description, department, documents } = this.csaSource.values
      this.form.patchValue({
        id: id,
        title: title,
        description: description,
        department_id: department?.id?department.id:department,
      })
    }
    this.searchDepartment({term:this.form.value.department_id});
  }


  // Get Department
  getDepartment() {

    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAmCSAModal();
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.clearFIleUploadPopupData();

    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }



  // document upload
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
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
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  removeDocument(doc) {
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
      return this._auditManagementService.getThumbnailPreview(type, token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  processDataForSave() {
    let saveParam = {

      title: this.form.value.title,
      description: this.form.value.description,
      department_id: this.form.value.department_id?.id ? this.form.value.department_id?.id : this.form.value.department_id,
      documents: this.form.value.id ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
    }
    return saveParam;
  }



  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._csaService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id


        save = this._csaService.saveItem(this.processDataForSave())
      }

      save.subscribe((res: any) => {

        if (!this.form.value.id) {
          this.resetForm();
        }
        else{
          this.clearEditFiles();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.closeFormModal();
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  clearEditFiles(){
    fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();


  }

}
