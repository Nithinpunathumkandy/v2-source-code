import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { BpmSuppliersService } from 'src/app/core/services/masters/bpm/bpm-suppliers/bpm-suppliers.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BpmSuppliersMasterStore } from 'src/app/stores/masters/bpm/bpm-suppliers';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  selector: 'app-bpm-suppliers-modal',
  templateUrl: './bpm-suppliers-modal.component.html',
  styleUrls: ['./bpm-suppliers-modal.component.scss']
})
export class BpmSuppliersModalComponent implements OnInit {

  @Input('source') SuppliersSource: any;

  BpmSuppliersMasterStore = BpmSuppliersMasterStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  logoUploaded = false;
  fileUploadProgress = 0;

  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event.key == 'Escape' || event.code == 'Escape'){
        this.cancel();
    }
  }

  constructor(

    private _suppliersService: BpmSuppliersService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      image: '',
      mobile: [''],
      email: ['', [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      website: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      contact_name: ['', [Validators.required, Validators.maxLength(500)]],
      contact_role: '',
      contact_number: [''],
      contact_email: ['', [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      contact_address: [''],
      address: ['']
    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.SuppliersSource) {
      this.setFormValues();
    }
  }

  ngDoCheck() {
    if (this.SuppliersSource && this.SuppliersSource.hasOwnProperty('values') && this.SuppliersSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.SuppliersSource.hasOwnProperty('values') && this.SuppliersSource.values) {
      let { id, title, mobile, email, website, address, contact_name, contact_role, contact_number, contact_email, contact_address, image } = this.SuppliersSource.values
      // let { id, title, description } = this.SuppliersSource.values
      this.form.setValue({
        id: id,
        title: title, 
        mobile: mobile,
        email: email,
        website: website,
        address: address,
        contact_name: contact_name,
        contact_role: contact_role,
        contact_number: contact_number,
        contact_email: contact_email,
        contact_address: contact_address,
        image: ''
        // description: description
      })
    }
  }

  // createNewSupplier() {
  //   this.resetForm();
  //   this._suppliersService.setFileDetails(null,'','logo');
  //   this.BpmSuppliersMasterStore.addOrEditFlag = false;
  //   AppStore.disableLoading();
  //   this._utilityService.detectChanges(this._cdr);
  // }

  // for resetting the form
  resetForm() {
    if(this.SuppliersSource.type=='Add'){
      BpmSuppliersMasterStore.unsetFile();
    }
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
  // getting description count

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissSupplierModal();
  }


  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      this.form.value.image = this._suppliersService.getFileDetails('logo');
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._suppliersService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._suppliersService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        this.BpmSuppliersMasterStore.lastInsertedId = res.id
        if (!this.form.value.id) {
          this.resetForm();
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
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') BpmSuppliersMasterStore.logo_preview_available = true;
        var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
        this._imageService.uploadImageWithProgress(formData, typeParams)
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded)
                  this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                $("#file").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                  if (type == 'logo') {
                    this.logoUploaded = true;
                    BpmSuppliersMasterStore.logo_preview_available = false;
                  }
                  this.createImageFromBlob(prew, temp, type);
                }, (error) => {
                  $("#file").val('');
                  BpmSuppliersMasterStore.logo_preview_available = false;
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            $("#file").val('');
            BpmSuppliersMasterStore.logo_preview_available = false;
            this.fileUploadProgress = 0;
            let errorMessage = "";
            if (error.error?.errors?.hasOwnProperty('file'))
              errorMessage = error.error.errors.file;
            else errorMessage = 'file_upload_failed';
            this._utilityService.showErrorMessage('failed', errorMessage);
            this._utilityService.detectChanges(this._cdr);
          })
      }
      else{
        $("#file").val('');
        this._utilityService.detectChanges(this._cdr);
      }
    }
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      this._suppliersService.setFileDetails(imageDetails, logo_url);
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('general');
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}

