import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ThemeLoginSettingsService } from 'src/app/core/services/settings/theme-settings/theme-login-settings/theme-login-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeLoginSettingStore } from 'src/app/stores/settings/theme/theme-login.store';

@Component({
  selector: 'app-theme-login',
  templateUrl: './theme-login.component.html',
  styleUrls: ['./theme-login.component.scss']
})
export class ThemeLoginComponent implements OnInit {
  
 id:number;
 details:any
  color: any;
  // fileUploadProgress = 0;
  logoUploaded = false;
  category: string;
  ThemeLoginSettingStore = ThemeLoginSettingStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  imageDeletedDetails: any;
  fileChanged: boolean = false;
  formErrors: any;
  buttonDisabled: boolean = true;
  profileObject = {
    is_isorobot: null,
    is_isorobot_logo: null,
    is_google_login: null,
    is_linked_login: null,
    app_login_setting_images: [],
    solution_name: null
  };
  // fileUploadProgress = {
  //   login_logo: 0,
  //   top-cube: 0,
  //   bottom-cube: 0,
  //   login-bg: 0,
  //   two-factor-bg: 0
  // };
  fileUploadProgress = {
    login_logo: 0,
    top_cube: 0,
    bottom_cube: 0,
    login_bg: 0,
    two_factor_bg: 0
  }
  constructor(private _utilityService: UtilityService,
    private _themeloginservice: ThemeLoginSettingsService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,) { 
      AppStore.showDiscussion = false;
    }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    this._themeloginservice.getItems().subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
      if (ThemeLoginSettingStore.themeLoginDetails[0]?.id) {
        this._themeloginservice.getItemsById(ThemeLoginSettingStore.themeLoginDetails[0]?.id).subscribe(() => {
          this._utilityService.detectChanges(this._cdr);
          this.setOBjectValue();
        });
      }

    });
  }

  setOBjectValue() {
    this.profileObject.is_isorobot_logo = ThemeLoginSettingStore.themeLoginDetailsById.is_isorobot_logo;
    this.profileObject.is_isorobot = ThemeLoginSettingStore.themeLoginDetailsById.is_isorobot;
    this.profileObject.is_google_login = ThemeLoginSettingStore.themeLoginDetailsById.is_google_login;
    this.profileObject.is_linked_login = ThemeLoginSettingStore.themeLoginDetailsById.is_linked_login;
    this.profileObject.solution_name = ThemeLoginSettingStore.themeLoginDetailsById.solution_name;
    this.setImage();
  }

  setImage() {
    let imageDetails = ThemeLoginSettingStore.themeLoginDetailsById?.app_login_setting_images;
    if (imageDetails?.length > 0) {
      for (let i = 0; i < imageDetails?.length; i++) {
        this.category = imageDetails[i].type;
        var preview = this._themeloginservice.getThumbnailPreview(this.category, imageDetails[i].token);
        imageDetails[i]['preview_url'] = preview;
        this._themeloginservice.setImageDetails(imageDetails[i], this.category, imageDetails[i].id);
        this._utilityService.detectChanges(this._cdr);
      }
    }
  }

  onFileChange(event, type: string, category) {
    this.category = category;
    // this.fileUploadProgress = 0;
    this.setFileUploadProgress(0,category);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.uploadProgress(true,category);
      this._utilityService.detectChanges(this._cdr);
      var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
      this._imageService.uploadImageWithProgress(formData, typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if (uploadEvent.loaded){
                let fileProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                this.setFileUploadProgress(fileProgress,category);
              }
                // this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              let temp: any = uploadEvent['body'];
              temp['is_new'] = true;
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                if (type == 'logo') {
                  this.logoUploaded = true;
                  ThemeLoginSettingStore.logo_preview_available = false;
                  this.uploadProgress(false,category);
                }
                this.createImageFromBlob(prew, temp,category);
              }, (error) => {
                ThemeLoginSettingStore.logo_preview_available = false;
                this.uploadProgress(false,category);
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          let errorMessage = "";
          if (error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('Failed', errorMessage);
          ThemeLoginSettingStore.logo_preview_available = false;
          this.uploadProgress(false,category);
          this.setFileUploadProgress(0,category);
          this._utilityService.detectChanges(this._cdr);
        })
    }
  }

  createImageFromBlob(image: Blob, imageDetails, category) {
    console.log(imageDetails);
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (imageDetails != null) {
        imageDetails['preview_url'] = logo_url;
        if(!imageDetails['title'] && imageDetails['name']) imageDetails['title'] =  imageDetails['name'];
        this.fileChanged = true;
        this.buttonDisabled = false;
        this._themeloginservice.setImageDetails(imageDetails, category);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  uploadProgress(value: boolean,category) {
    switch (category) {
      case 'login-logo':
        ThemeLoginSettingStore.clientlogo_preview_available = value;
        break;
      case 'top-cube':
        ThemeLoginSettingStore.topcube_preview_available = value;
        break
      case 'bottom-cube':
        ThemeLoginSettingStore.bottomcube_preview_available = value;
        break
      case 'login-bg':
        ThemeLoginSettingStore.loginbg_preview_available = value;
        break
      case 'two-factor-bg':
        ThemeLoginSettingStore.authbg_preview_available = value;
        break
    }
  }

  setFileUploadProgress(value: number, type: string){
    switch (type) {
      case 'login-logo': this.fileUploadProgress.login_logo = value;
        break;
      case 'top-cube': this.fileUploadProgress.top_cube = value;
        break
      case 'bottom-cube': this.fileUploadProgress.bottom_cube = value;
        break
      case 'login-bg': this.fileUploadProgress.login_bg = value;
        break
      case 'two-factor-bg': this.fileUploadProgress.two_factor_bg = value;
        break
    }
  }
  solutionName(event){
    this.buttonDisabled = false;
  }
  loginThemeChange(event, type) {
    this.buttonDisabled = false;
    switch (type) {
      case 'is_isorobot':
        this.profileObject.is_isorobot = event.target.checked;
        break;
      case 'is_isorobot_logo':
        this.profileObject.is_isorobot_logo = event.target.checked;
        break
      case 'is_google_login':
        this.profileObject.is_google_login = event.target.checked;
        break
      case 'is_linked_login':
        this.profileObject.is_linked_login = event.target.checked;
        break
    }
  }

  checkPendingFileUploads(){
    if(this.fileUploadProgress.login_logo != 0 && this.fileUploadProgress.login_logo != 100){
      return true;
    }
    else if(this.fileUploadProgress.bottom_cube != 0 && this.fileUploadProgress.bottom_cube != 100){
      return true;
    }
    else if(this.fileUploadProgress.login_bg != 0 && this.fileUploadProgress.login_bg != 100){
      return true;
    }
    else if(this.fileUploadProgress.top_cube != 0 && this.fileUploadProgress.top_cube != 100){
      return true;
    }
    else if(this.fileUploadProgress.two_factor_bg != 0 && this.fileUploadProgress.two_factor_bg != 100){
      return true;
    }
    else{
      return false
    }
  }
  selectRevertLoginTheme(){
    this._themeloginservice.chooseRevertLoginTheme(this.id,this.details).subscribe(res=>{
      this.getDetails();
    });
  }

  save() {
    AppStore.enableLoading();
    this.buttonDisabled = true;
    this.setImageValue();
    this._themeloginservice.updateThemeLogin(ThemeLoginSettingStore.themeLoginDetailsById.id, this.profileObject).subscribe(resp => {
      AppStore.disableLoading();
      ThemeLoginSettingStore.removeDeletedElement();
      this._utilityService.detectChanges(this._cdr);
      this.getDetails();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        AppStore.disableLoading();
        this.formErrors = err.error.errors;
      }
      if (err.status == 403 || err.status == 500) {
        AppStore.disableLoading();
        this.formErrors = err.error.errors;
      }
    });
  }

  setImageValue() {
    let login_theme_images = [];
    let loginbg;
    let clientlogo;
    let bottomcube;
    let topcube;
    let authbg;
    if (ThemeLoginSettingStore.loginbgImageDetails != null) {
      loginbg = {
        id: ThemeLoginSettingStore.loginbgImageDetails?.id,
        is_new: ThemeLoginSettingStore.loginbgImageDetails?.is_new ? ThemeLoginSettingStore.loginbgImageDetails?.is_new : false,
        is_deleted: ThemeLoginSettingStore.loginbgImageDetails?.is_deleted ? ThemeLoginSettingStore.loginbgImageDetails?.is_deleted : false,
        type: 'login-bg',
        name: ThemeLoginSettingStore.loginbgImageDetails?.title ? ThemeLoginSettingStore.loginbgImageDetails?.title : ThemeLoginSettingStore.loginbgImageDetails?.name,
        ext: ThemeLoginSettingStore.loginbgImageDetails?.ext,
        mime_type: ThemeLoginSettingStore.loginbgImageDetails?.mime_type,
        size: ThemeLoginSettingStore.loginbgImageDetails?.size,
        url: ThemeLoginSettingStore.loginbgImageDetails?.url,
        thumbnail_url: ThemeLoginSettingStore.loginbgImageDetails?.thumbnail_url,
        token: ThemeLoginSettingStore.loginbgImageDetails?.token,
      }
      login_theme_images.push(loginbg);
    }
    if (ThemeLoginSettingStore.clientlogoImageDetails != null) {
      clientlogo = {
        id: ThemeLoginSettingStore.clientlogoImageDetails?.id,
        is_new: ThemeLoginSettingStore.clientlogoImageDetails?.is_new ? ThemeLoginSettingStore.clientlogoImageDetails?.is_new : false,
        is_deleted: ThemeLoginSettingStore.clientlogoImageDetails?.is_deleted ? ThemeLoginSettingStore.clientlogoImageDetails?.is_deleted : false,
        type: 'login-logo',
        name: ThemeLoginSettingStore.clientlogoImageDetails?.title ? ThemeLoginSettingStore.clientlogoImageDetails?.title : ThemeLoginSettingStore.clientlogoImageDetails?.name,
        ext: ThemeLoginSettingStore.clientlogoImageDetails?.ext,
        mime_type: ThemeLoginSettingStore.clientlogoImageDetails?.mime_type,
        size: ThemeLoginSettingStore.clientlogoImageDetails?.size,
        url: ThemeLoginSettingStore.clientlogoImageDetails?.url,
        thumbnail_url: ThemeLoginSettingStore.clientlogoImageDetails?.thumbnail_url,
        token: ThemeLoginSettingStore.clientlogoImageDetails?.token,
      }
      login_theme_images.push(clientlogo);
    }
    if (ThemeLoginSettingStore.bottomcubeImageDetails != null) {
      bottomcube = {
        id: ThemeLoginSettingStore.bottomcubeImageDetails?.id,
        is_new: ThemeLoginSettingStore.bottomcubeImageDetails?.is_new ? ThemeLoginSettingStore.bottomcubeImageDetails?.is_new : false,
        is_deleted: ThemeLoginSettingStore.bottomcubeImageDetails?.is_deleted ? ThemeLoginSettingStore.bottomcubeImageDetails?.is_deleted : false,
        type: 'bottom-cube',
        name: ThemeLoginSettingStore.bottomcubeImageDetails?.title ? ThemeLoginSettingStore.bottomcubeImageDetails?.title : ThemeLoginSettingStore.bottomcubeImageDetails?.name,
        ext: ThemeLoginSettingStore.bottomcubeImageDetails?.ext,
        mime_type: ThemeLoginSettingStore.bottomcubeImageDetails?.mime_type,
        size: ThemeLoginSettingStore.bottomcubeImageDetails?.size,
        url: ThemeLoginSettingStore.bottomcubeImageDetails?.url,
        thumbnail_url: ThemeLoginSettingStore.bottomcubeImageDetails?.thumbnail_url,
        token: ThemeLoginSettingStore.bottomcubeImageDetails?.token,
      }
      login_theme_images.push(bottomcube);
    }
    if (ThemeLoginSettingStore.topcubeImageDetails != null) {
      topcube = {
        id: ThemeLoginSettingStore.topcubeImageDetails?.id,
        is_new: ThemeLoginSettingStore.topcubeImageDetails?.is_new ? ThemeLoginSettingStore.topcubeImageDetails?.is_new : false,
        is_deleted: ThemeLoginSettingStore.topcubeImageDetails?.is_deleted ? ThemeLoginSettingStore.topcubeImageDetails?.is_deleted : false,
        type: 'top-cube',
        name: ThemeLoginSettingStore.topcubeImageDetails?.title ? ThemeLoginSettingStore.topcubeImageDetails?.title : ThemeLoginSettingStore.topcubeImageDetails?.name,
        ext: ThemeLoginSettingStore.topcubeImageDetails?.ext,
        mime_type: ThemeLoginSettingStore.topcubeImageDetails?.mime_type ? ThemeLoginSettingStore.topcubeImageDetails.mime_type : '',
        size: ThemeLoginSettingStore.topcubeImageDetails?.size,
        url: ThemeLoginSettingStore.topcubeImageDetails?.url,
        thumbnail_url: ThemeLoginSettingStore.topcubeImageDetails?.thumbnail_url,
        token: ThemeLoginSettingStore.topcubeImageDetails?.token,
      }
      login_theme_images.push(topcube);
    }
    if (ThemeLoginSettingStore.authbgImageDetails != null) {
      authbg = {
        id: ThemeLoginSettingStore.authbgImageDetails?.id,
        is_new: ThemeLoginSettingStore.authbgImageDetails?.is_new ? ThemeLoginSettingStore.authbgImageDetails?.is_new : false,
        is_deleted: ThemeLoginSettingStore.authbgImageDetails?.is_deleted ? ThemeLoginSettingStore.authbgImageDetails?.is_deleted : false,
        type: 'two-factor-bg',
        name: ThemeLoginSettingStore.authbgImageDetails?.title ? ThemeLoginSettingStore.authbgImageDetails?.title : ThemeLoginSettingStore.authbgImageDetails?.name,
        ext: ThemeLoginSettingStore.authbgImageDetails?.ext,
        mime_type: ThemeLoginSettingStore.authbgImageDetails?.mime_type,
        size: ThemeLoginSettingStore.authbgImageDetails?.size,
        url: ThemeLoginSettingStore.authbgImageDetails?.url,
        thumbnail_url: ThemeLoginSettingStore.authbgImageDetails?.thumbnail_url,
        token: ThemeLoginSettingStore.authbgImageDetails?.token,
      }
      login_theme_images.push(authbg);
    }
    this.profileObject.app_login_setting_images = login_theme_images
  }

    checkAcceptFileTypes(type){
      return this._imageService.getAcceptFileTypes(type);
    }

    checkExtension(ext, extType) {
      var res = this._imageService.checkFileExtensions(ext, extType);
      return res;
    }

    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
    removeFile(category){
      this.buttonDisabled = false;
      ThemeLoginSettingStore.unsetFileDetails(category, false);
    }

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }
  }
