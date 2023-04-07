import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MyprofileProfileService } from 'src/app/core/services/my-profile/profile/profile/myprofile-profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProfileCertificateStore } from 'src/app/stores/my-profile/profile/profile-certificate-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-profile-certificate-modal',
  templateUrl: './profile-certificate-modal.component.html',
  styleUrls: ['./profile-certificate-modal.component.scss']
})
export class ProfileCertificateModalComponent implements OnInit {

  @Input('source') ProfileCertificate: any;

  certificateForm:FormGroup;
  AppStore = AppStore;
  formErrors: any;
  Savebutton:boolean = false;
  SaveClosebutton:boolean = false;
  CancelButton:boolean = false;
  fileUploadProgress = 0;
  ProfileCertificateStore = ProfileCertificateStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,            
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _imageService: ImageServiceService,
              private _profileService:MyprofileProfileService,
              private _helperService: HelperServiceService,
              private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    //certification form
    this.certificateForm = this._formBuilder.group({
      id: [''],
      certificate_name: ['', [Validators.required]],
      ext: [''],
      name: [''],
      // mime_type: [''],
      size: [''],
      url: [''],
      thumbnail_url: [''],
      token: [''],
      is_new:['']
    });

    this.resetForm();
    if (this.ProfileCertificate) {
      this.setFormValues();
    }
  }

  
  resetForm() {
    this.certificateForm.reset();
    this.certificateForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  setFormValues(){
    if(this.ProfileCertificate.hasOwnProperty('values') && this.ProfileCertificate.values){
      let {id,certificate_name,name,ext,size,url,thumbnail_url,token} = this.ProfileCertificate.values
      this.certificateForm.setValue({
        id:id,
        certificate_name:certificate_name,
         name: name,
        ext: ext,
        // mime_type: mime_type,
        size: size,
        url: url,
        thumbnail_url: thumbnail_url,
        token: token,
        is_new:this.getIsNew()
      })
    }
  }

  ngDoCheck(){
    if (this.ProfileCertificate && this.ProfileCertificate.hasOwnProperty('values') && this.ProfileCertificate.values && !this.certificateForm.value.id)
      this.setFormValues();
  }

  deleteCertificateImage(token) {
    ProfileCertificateStore.unsetCertificateImageDetails('user-certificate', token);
    this._utilityService.detectChanges(this._cdr);
  }

  getIsNew(){
    if(ProfileCertificateStore.certificateImage.is_new==true){
      return true;
    }
    else
      return false;
  }

  closeCertificateFormModal(){
    this.CancelButton = true;
    this.ProfileCertificateStore.clearCertificate();
    this.resetForm();
    this._eventEmitterService.dismissProfileQualificationModal();
    this.CancelButton = false;
  }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this._imageService.validateFile(file, type)) {
        const formData = new FormData();
        formData.append('file', file);
        if (type == 'logo') MyProfileProfileStore.logo_preview_available = true;
        else
        ProfileCertificateStore.certificate_preview_available = true;
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

                MyProfileProfileStore.logo_preview_available = false;
                ProfileCertificateStore.certificate_preview_available = false;


                this.createImageFromBlob(prew, temp, type);

              }, (error) => {
                  let errorMessage = "";
                  if (error.error?.errors?.hasOwnProperty('file'))
                    errorMessage = error.error.errors.file;
                  else errorMessage = 'file_upload_failed';
                  this._utilityService.showErrorMessage('Failed', errorMessage);
                MyProfileProfileStore.logo_preview_available = false;
                ProfileCertificateStore.certificate_preview_available = false;
                this.fileUploadProgress = 0;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
          MyProfileProfileStore.logo_preview_available = false;
          ProfileCertificateStore.certificate_preview_available = false;
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
  }
  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (type == 'logo') {
        this._profileService.setImageDetails(imageDetails, logo_url);
      }
      else {
        
        this._profileService.setCertificateImageDetails(imageDetails, logo_url, type);
        if(!this.certificateForm.value.certificate_name){
          this.certificateForm.patchValue({
            certificate_name: imageDetails.name
          })
        }
       

      }

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

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  saveCertificate(close: boolean = false) {
    this.formErrors = null;
    if (this.certificateForm.valid) {
      let save;

      AppStore.enableLoading();

      if (ProfileCertificateStore.certificateImage) {
        this.certificateForm.patchValue({
          name: ProfileCertificateStore.certificateImage.name,
          ext: ProfileCertificateStore.certificateImage.ext,
          // mime_type: ProfileCertificateStore.certificateImage.mime_type,
          size: ProfileCertificateStore.certificateImage.size,
          url: ProfileCertificateStore.certificateImage.url,
          thumbnail_url: ProfileCertificateStore.certificateImage.thumbnail_url,
          token: ProfileCertificateStore.certificateImage.token,
          is_new:this.getIsNew()
        })

      }


      if (this.certificateForm.value.id) {

        save = this._profileService.updateCertificate(this.certificateForm.value.id, this.certificateForm.value);
      } else {

        let saveData = {
          certificate_name: this.certificateForm.value.certificate_name ? this.certificateForm.value.certificate_name : '',
          name: this.certificateForm.value.name ? this.certificateForm.value.name : '',
          ext: this.certificateForm.value.ext ? this.certificateForm.value.ext : '',
          // mime_type: this.certificateForm.value.mime_type ? this.certificateForm.value.mime_type : '',
          size: this.certificateForm.value.size ? this.certificateForm.value.size : '',
          url: this.certificateForm.value.url ? this.certificateForm.value.url : '',
          thumbnail_url: this.certificateForm.value.thumbnail_url ? this.certificateForm.value.thumbnail_url : '',
          token: this.certificateForm.value.token ? this.certificateForm.value.token : ''
        }

        save = this._profileService.saveCertificate( saveData);

      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        if (!this.certificateForm.value.id) {
          this.certificateForm.reset();
          this.certificateForm.markAsPristine();
          this._utilityService.detectChanges(this._cdr);
        }

        this.ProfileCertificateStore.clearCertificate();

        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.certificateForm.reset();
          this.closeCertificateFormModal();
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.Savebutton = false;
          this.SaveClosebutton = false;
        }
        if (err.status == 403 || err.status == 500) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.closeCertificateFormModal();
          this.Savebutton = false;
        }
      });
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }
}
