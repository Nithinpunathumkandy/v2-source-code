import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MyprofileProfileService } from 'src/app/core/services/my-profile/profile/profile/myprofile-profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';

@Component({
  selector: 'app-profile-edit-modal',
  templateUrl: './profile-edit-modal.component.html',
  styleUrls: ['./profile-edit-modal.component.scss']
})
export class ProfileEditModalComponent implements OnInit {

  @Input('source') profileDetails: any;
  MyProfileProfileStore = MyProfileProfileStore;
  AppStore = AppStore;
  profileForm:FormGroup;
  CancelButton:boolean = false;
  Savebutton:boolean = false;
  formErrors: any;
  userId:number;
  fileUploadProgress = 0;
  constructor(private _formBuilder:FormBuilder,
              private _eventEmitterService:EventEmitterService,
              private _utilityService:UtilityService,
              private _profileService:MyprofileProfileService,
              private _helperService:HelperServiceService,
              private _imageService:ImageServiceService,
              private _humanCapitalService:HumanCapitalService,
              private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.profileForm = this._formBuilder.group({

      first_name: ['',[Validators.required, Validators.maxLength(255)]],
      last_name: ['',[Validators.required, Validators.maxLength(255)]],
      email: ['',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      mobile: [''],
      addresses: [null],
      address: [''],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      country_id: [null],
      contact: [null],
      relative_address: [''],
      relative_name: [''],
      relationship: [''],
      relative_mobile: [''],
      relative_street: [''],
      relative_city: [''],
      relative_state: [''],
      relative_zip: [''],
      relative_country_id: [null],
      relative_contact: [null]
    });

    // this.resetForm();
    if (this.profileDetails) {
      this.setImageDetails();
      this.setFormValues();
    }
  }

  setImageDetails(){
    if (this.profileDetails.values.hasOwnProperty('image_token') && this.profileDetails.values['image_token']) {
      var purl = this._humanCapitalService.getThumbnailPreview('user-profile-picture', this.profileDetails.values.image_token);
      var lDetails = {
        name: this.profileDetails.values['image_name'],
        ext: this.profileDetails.values['image_ext'],
        size: this.profileDetails.values['image_size'],
        url: this.profileDetails.values['image_url'],
        token: this.profileDetails.values['image_token'],
        preview: purl
      };
      this._profileService.setImageDetails(lDetails, purl);
    }
    else{
      MyProfileProfileStore.noImages();
    }
  }

  setFormValues(){
    if(this.profileDetails.hasOwnProperty('values') && this.profileDetails.values){
      this.userId = this.profileDetails.values.id;
      let {first_name, last_name, email, mobile } = this.profileDetails.values;
      let emergencyDetails = this.profileDetails.values.emergency;
      let contactDetails = this.profileDetails.values.contact;
      this.profileForm.setValue({
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile: mobile,
        address: contactDetails.address,
        street: contactDetails.street,
        city: contactDetails.city,
        state: contactDetails.state,
        zip: contactDetails.zip,
        country_id: contactDetails.country_id,
        contact: contactDetails.contact,
        relative_address: emergencyDetails.address,
        relative_name: emergencyDetails.relative_name,
        relationship: emergencyDetails.relationship,
        relative_mobile:emergencyDetails.relative_mobile,
        relative_street: emergencyDetails.street,
        relative_city: emergencyDetails.city,
        relative_state: emergencyDetails.state,
        relative_zip: emergencyDetails.zip,
        relative_country_id: emergencyDetails.country_id,
        relative_contact: emergencyDetails.contact,
        addresses:null
      })
    }
  }

  updateProfile(close:boolean){
    let image;
    let address = {
      "contact": {
        address: this.profileForm.value.address,
        street: this.profileForm.value.street,
        state: this.profileForm.value.state,
        city: this.profileForm.value.city,
        zip: this.profileForm.value.zip,
        contact: this.profileForm.value.contact,
        country_id: this.profileForm.value.country_id
      },
      "emergency": {
        relative_name: this.profileForm.value.relative_name,
        relationship: this.profileForm.value.relationship,
        address: this.profileForm.value.relative_address,
        relative_mobile: this.profileForm.value.relative_mobile,
        street: this.profileForm.value.relative_street,
        state: this.profileForm.value.relative_state,
        city: this.profileForm.value.relative_city,
        zip: this.profileForm.value.relative_zip,
        contact: this.profileForm.value.relative_contact,
        country_id: this.profileForm.value.relative_country_id
      }
    }
    if(MyProfileProfileStore.getProductImageDetails){
      if(MyProfileProfileStore.getProductImageDetails.is_deleted == true){
        image ={
          is_deleted:'true'
       }
      }
      else{
        image ={
          is_new: this.getIsNew(),
          name: MyProfileProfileStore.getProductImageDetails.name,
          ext: MyProfileProfileStore.getProductImageDetails.ext,
          mime_type: MyProfileProfileStore.getProductImageDetails.mime_type,
          size: MyProfileProfileStore.getProductImageDetails.size,
          url: MyProfileProfileStore.getProductImageDetails.url,
          thumbnail_url: MyProfileProfileStore.getProductImageDetails.thumbnail_url,
          token: MyProfileProfileStore.getProductImageDetails.token
        }
      }
    }
    this.profileForm.patchValue({
      addresses: address
    });
    this.formErrors = null;
    if (this.profileForm.valid) {
      let save;
      AppStore.enableLoading();
      this.Savebutton = true ;

      let saveData = {
        first_name: this.profileForm.value.first_name,
        last_name: this.profileForm.value.last_name,
        email: this.profileForm.value.email,
        mobile: this.profileForm.value.mobile,
        addresses: this.profileForm.value.addresses,
        image:image
    }
        save = this._profileService.updateProfile(this.userId,saveData);
      
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        this.Savebutton = false;
        this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.profileForm.reset();
          this.closeFormModal();
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.Savebutton = false;
        }
        if (err.status == 403 || err.status == 500) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this.closeFormModal();
          this.Savebutton = false;
        }
      });
    }
  }

    getIsNew(){
      if(MyProfileProfileStore.getProductImageDetails.is_new==true){
        return 'true';
      }
      else
        return 'false';
    }
  
  closeFormModal(){
    this.CancelButton = true
    this._eventEmitterService.dismissProfileModal();
    this.CancelButton = false;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  deleteImage(){
    this.MyProfileProfileStore.unsetImageDetails();
  }

  onFileChange(event, type: string) {
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];


      const formData = new FormData();
      formData.append('file', file);
      if (type == 'logo') MyProfileProfileStore.logo_preview_available = true;
        else
        MyProfileProfileStore.profile_preview_available = true;
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

            let temp: any = uploadEvent['body'];
            temp['is_new'] = true;
            this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                MyProfileProfileStore.logo_preview_available = false;
                MyProfileProfileStore.profile_preview_available = false;

              this.createImageFromBlob(prew, temp);
            }, (error) => {
              MyProfileProfileStore.logo_preview_available = false;
              MyProfileProfileStore.profile_preview_available = false;
              this._utilityService.detectChanges(this._cdr);
            })
        }
      }, (error) => {
        let errorMessage = "";
          if(error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
        this._utilityService.showErrorMessage('Failed', errorMessage);
        MyProfileProfileStore.logo_preview_available = false;
        MyProfileProfileStore.profile_preview_available = false;
        this.fileUploadProgress = 0;
        this._utilityService.detectChanges(this._cdr);
      })


    }
  }

  createImageFromBlob(image: Blob, imageDetails) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;

      this._profileService.setImageDetails(imageDetails, logo_url);

      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
