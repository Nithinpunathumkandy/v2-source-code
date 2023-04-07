import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-sla-contract-document-renew-modal',
  templateUrl: './sla-contract-document-renew-modal.component.html',
  styleUrls: ['./sla-contract-document-renew-modal.component.scss']
})
export class SlaContractDocumentRenewModalComponent implements OnInit {
  @Input('source') documentID: any;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  SLAContractStore = SLAContractStore;
  AppStore = AppStore;
  renewForm: FormGroup;
  formErrors: any;

  fileUploadProgress = 0;
  constructor(private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _slaContractService: SlaContractService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.renewForm = this._formBuilder.group({
      compliance_status_id: [null, Validators.required],
      issue_date: ['', Validators.required],
      expiry_date: ['', Validators.required],
    });
    this.setFormValueID();
  }

  setFormValueID() {
    this.renewForm.patchValue({
      compliance_status_id: this.documentID
    })
  }

  save(close) {
    AppStore.enableLoading();
    let formValue = this.renewForm.value;
    let saveData = {
      compliance_status_id: formValue?.compliance_status_id ? formValue?.compliance_status_id : null,
      issue_date: formValue?.issue_date ? this._helperService.processDate(formValue?.issue_date, 'join') : '',
      expiry_date: formValue?.expiry_date ? this._helperService.processDate(formValue?.expiry_date, 'join') : '',
      name: SLAContractStore.documentImage?.name ? SLAContractStore.documentImage?.name : null,
      ext: SLAContractStore.documentImage?.ext ? SLAContractStore.documentImage?.ext : null,
      mime_type: SLAContractStore.documentImage?.mime_type ? SLAContractStore.documentImage?.mime_type : null,
      size: SLAContractStore.documentImage?.size ? SLAContractStore.documentImage?.size : null,
      url: SLAContractStore.documentImage?.url ? SLAContractStore.documentImage?.url : null,
      thumbnail_url: SLAContractStore.documentImage?.thumbnail_url ? SLAContractStore.documentImage?.thumbnail_url : null,
      token: SLAContractStore.documentImage?.token ? SLAContractStore.documentImage?.token : null,
    }
    let save;
    save = this._slaContractService.renewDocument(this.documentID, saveData);
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      setTimeout(() => {
        if (close) {
          this.closeFormModal();
          this.renewForm.reset();
          this.removeDocument();
        }
      }, 300);
      this.renewForm.reset();
      this.removeDocument();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        AppStore.disableLoading();
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 404) {
        AppStore.disableLoading();
        this.closeFormModal();
        this.renewForm.reset();
        this.removeDocument();
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Something Went Wrong Try Again Later');
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeFormModal() {
    this.renewForm.reset();
    SLAContractStore.clearDocument();
    this._eventEmitterService.dismissSLADocumentRenewModal();
   }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') SLAContractStore.logo_preview_available = true;
        else
          SLAContractStore.sla_preview_available = true;
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {

          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if (uploadEvent.loaded)
                this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);

              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              //return event;
              let temp: any = uploadEvent['body'];

              temp['is_new'] = true;

              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                SLAContractStore.logo_preview_available = false;
                SLAContractStore.sla_preview_available = false;


                this.createImageFromBlob(prew, temp, type);

              }, (error) => {
                let errorMessage = "";
                if (error.error?.errors?.hasOwnProperty('file'))
                  errorMessage = error.error.errors.file;
                else errorMessage = 'file_upload_failed';
                this._utilityService.showErrorMessage('Failed', errorMessage);
                SLAContractStore.logo_preview_available = false;
                SLAContractStore.sla_preview_available = false;
                this.fileUploadProgress = 0;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
          SLAContractStore.logo_preview_available = false;
          SLAContractStore.sla_preview_available = false;
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      this._slaContractService.setDocumentImageDetails(imageDetails, logo_url, type);
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image url
  getDefaultImage(type?) {
    return this._imageService.getDefaultImageUrl(type ? type : 'user-logo');
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  removeDocument() {
    SLAContractStore.clearDocument();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    SLAContractStore.clearDocument();
    this.renewForm.reset();
  }
}
