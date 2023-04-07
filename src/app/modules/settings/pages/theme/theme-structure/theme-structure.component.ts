import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-theme-structure',
  templateUrl: './theme-structure.component.html',
  styleUrls: ['./theme-structure.component.scss']
})
export class ThemeStructureComponent implements OnInit {

  ThemeStructureSettingStore = ThemeStructureSettingStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  color: any;
  // fileUploadProgress = 0;
  logoUploaded = false;
  buttonDisabled: boolean = true;
  category: string;
  fileChanged: boolean = false;
  formErrors: any;
  structureObject = {
    style: null,
    bar_chart_color: null,
    app_theme_setting_images: [],
    charts_theme: null
  };

  fileUploadProgress = {
    header_logo: 0,
    loader: 0,
    fournotthree: 0,
    fournotfour: 0,
    fivehundred: 0,
    fav_icon: 0,
    discussion_icon: 0,
    empty_screen: 0,
    empty_pi_chart: 0,
    empty_bar_chart: 0,
  }
  
  themesList = [
    { title: 'Default', value: 'am4themes_animated', style: { 'background-image': 'linear-gradient(45deg, #67b7dc 0%,#67b7dc 50%,#c767dc 50%,#c767dc 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Material', value: 'am4themes_material', style: {'background-image': 'linear-gradient(45deg, #E91E63 0%,#E91E63 50%,#9C27B0 50%,#9C27B0 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Dataviz', value: 'am4themes_dataviz', style: {'background-image': 'linear-gradient(45deg, #283250 0%,#283250 50%,#902c2d 50%,#902c2d 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Kelly', value: 'am4themes_kelly', style: {'background-image': 'linear-gradient(45deg, #F3C300 0%,#F3C300 50%,#875692 50%,#875692 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Dark', value: 'am4themes_dark', style: {'background-image': 'linear-gradient(45deg, #67b7dc 0%,#67b7dc 50%,#c767dc 50%,#c767dc 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Frozen', value: 'am4themes_frozen', style: {'background-image': 'linear-gradient(45deg, #bec4f8 0%,#bec4f8 50%,#a5abee 50%,#a5abee 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Moonrise Kingdom', value: 'am4themes_moonrisekingdom', style: {'background-image': 'linear-gradient(45deg, #3a1302 0%,#3a1302 50%,#c79f59 50%,#c79f59 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}},
    { title: 'Spirited Away', value: 'am4themes_spiritedaway', style: {'background-image': 'linear-gradient(45deg, #65738e 0%,#65738e 50%,#523b58 50%,#523b58 100%)', 'border-color': '#fff', 'width': '25px', 'height': '25px', 'border-radius': '12px'}}
  ]

  constructor(private _utilityService: UtilityService,
    private _themestructureservice: ThemeStructureSettingsService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.setColor();
    AppStore.showDiscussion = false;
    this.getDetails();
  }

  getDetails() {
    this._themestructureservice.getItems().subscribe(() => {
      this.structureObject.bar_chart_color = (ThemeStructureSettingStore.structureDetails.length > 0 && ThemeStructureSettingStore.structureDetails[0].hasOwnProperty('bar_chart_color')) ? ThemeStructureSettingStore.structureDetails[0]?.bar_chart_color : null;
      this._utilityService.detectChanges(this._cdr);
      if (ThemeStructureSettingStore.structureDetails[0]?.id) {
        this._themestructureservice.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
          this._utilityService.detectChanges(this._cdr);
          this.setOBjectValue();
        });
      }

    });
  }

  getStyle(type){
    let pos = this.themesList.findIndex(e=>e.title == type);
    return this.themesList[pos].style;
  }

  setOBjectValue() {
    this.structureObject.style = ThemeStructureSettingStore.structureDetailsById.style;
    this.structureObject.charts_theme = ThemeStructureSettingStore.structureDetailsById.charts_theme
    this.setImage();
  }

  setImage() {
    let imageDetails = ThemeStructureSettingStore.structureDetailsById?.app_theme_setting_images;
    if (imageDetails?.length > 0) {
      for (let i = 0; i < imageDetails?.length; i++) {
        this.category = imageDetails[i].type;
        var preview = this._themestructureservice.getThumbnailPreview(this.category, imageDetails[i].token);
        imageDetails[i]['preview_url'] = preview;
        this._themestructureservice.setImageDetails(imageDetails[i], this.category, imageDetails[i].id);
        this._utilityService.detectChanges(this._cdr);
      }
    }
  }

  onFileChange(event, type: string, category) {
    this.category = category;
    // this.fileUploadProgress = 0;
    this.setFileUploadProgress(0, category);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.uploadProgress(true, category);
      this._utilityService.detectChanges(this._cdr);
      var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
      this._imageService.uploadImageWithProgress(formData, typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if (uploadEvent.loaded) {
                let fileProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                this.setFileUploadProgress(fileProgress, category);
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
                  ThemeStructureSettingStore.logo_preview_available = false;
                  this.uploadProgress(false, category);
                }
                this.createImageFromBlob(prew, temp, category);
              }, (error) => {
                ThemeStructureSettingStore.logo_preview_available = false;
                this.uploadProgress(false, category);
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          let errorMessage = "";
          if (error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('Failed', errorMessage);
          ThemeStructureSettingStore.logo_preview_available = false;
          this.uploadProgress(false, category);
          this.setFileUploadProgress(0, category);
          this._utilityService.detectChanges(this._cdr);
        })
    }
  }

  revertStructureTheme(){
    this._themestructureservice.revertStructureSettings(1).subscribe(res=>{
      this.getDetails();
    })
  }

  createImageFromBlob(image: Blob, imageDetails, category) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (imageDetails != null) {
        imageDetails['preview_url'] = logo_url;
        if (!imageDetails['title'] && imageDetails['name']) imageDetails['title'] = imageDetails['name'];
        this.fileChanged = true;
        this.buttonDisabled = false;
        this._themestructureservice.setImageDetails(imageDetails, category);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  barChartColorChange(e){
    this.buttonDisabled = false;
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  removeFile(category) {
    this.buttonDisabled = false;
    ThemeStructureSettingStore.unsetFileDetails(category, false);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  setFileUploadProgress(value: number, type: string) {
    switch (type) {
      case 'discussion-icon': this.fileUploadProgress.discussion_icon = value;
        break;
      case 'empty-bar-chart': this.fileUploadProgress.empty_bar_chart = value;
        break
      case 'empty-pi-chart': this.fileUploadProgress.empty_pi_chart = value;
        break
      case 'empty-screen': this.fileUploadProgress.empty_screen = value;
        break
      case 'header-logo': this.fileUploadProgress.header_logo = value;
        break
      case 'fav-icon': this.fileUploadProgress.fav_icon = value;
        break;
      case 'loader': this.fileUploadProgress.loader = value;
        break
      case '404': this.fileUploadProgress.fournotfour = value;
        break
      case '403': this.fileUploadProgress.fournotthree = value;
        break
      case '500': this.fileUploadProgress.fivehundred = value;
        break
    }
  }

  uploadProgress(value: boolean, category) {
    switch (category) {
      case 'discussion-icon':
        ThemeStructureSettingStore.discussionicon_preview_available = value;
        break;
      case 'empty-bar-chart':
        ThemeStructureSettingStore.emptybarchart_preview_available = value;
        break
      case 'empty-pi-chart':
        ThemeStructureSettingStore.emptypichart_preview_available = value;
        break
      case 'empty-screen':
        ThemeStructureSettingStore.emptyscreen_preview_available = value;
        break
      case 'fav-icon':
        ThemeStructureSettingStore.favicon_preview_available = value;
        break
      case '500':
        ThemeStructureSettingStore.fivehundred_preview_available = value;
        break;
      case '404':
        ThemeStructureSettingStore.fournotfour_preview_available = value;
        break
      case '403':
        ThemeStructureSettingStore.fournotthree_preview_available = value;
        break
      case 'header-logo':
        ThemeStructureSettingStore.headerlogo_preview_available = value;
        break
      case 'loader':
        ThemeStructureSettingStore.loader_preview_available = value;
        break
    }
  }

  checkPendingFileUploads() {
    if (this.fileUploadProgress.discussion_icon != 0 && this.fileUploadProgress.discussion_icon != 100) {
      return true;
    }
    else if (this.fileUploadProgress.empty_bar_chart != 0 && this.fileUploadProgress.empty_bar_chart != 100) {
      return true;
    }
    else if (this.fileUploadProgress.empty_pi_chart != 0 && this.fileUploadProgress.empty_pi_chart != 100) {
      return true;
    }
    else if (this.fileUploadProgress.empty_screen != 0 && this.fileUploadProgress.empty_screen != 100) {
      return true;
    }
    else if (this.fileUploadProgress.fav_icon != 0 && this.fileUploadProgress.fav_icon != 100) {
      return true;
    }
    else if (this.fileUploadProgress.fivehundred != 0 && this.fileUploadProgress.fivehundred != 100) {
      return true;
    }
    else if (this.fileUploadProgress.fournotfour != 0 && this.fileUploadProgress.fournotfour != 100) {
      return true;
    }
    else if (this.fileUploadProgress.fournotthree != 0 && this.fileUploadProgress.fournotthree != 100) {
      return true;
    }
    else if (this.fileUploadProgress.header_logo != 0 && this.fileUploadProgress.header_logo != 100) {
      return true;
    }
    else if (this.fileUploadProgress.loader != 0 && this.fileUploadProgress.loader != 100) {
      return true;
    }
    else {
      return false
    }
  }

  save() {
    AppStore.enableLoading();
    this.buttonDisabled = true;
    this.setImageValue();
    // this.structureObject.style = "Login"
    this._themestructureservice.updateThemeLogin(1, this.structureObject).subscribe(resp => {
      AppStore.disableLoading();
      ThemeStructureSettingStore.removeDeletedElement();
      this._utilityService.detectChanges(this._cdr);
      this.getDetails();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        AppStore.disableLoading();
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
      if (err.status == 403 || err.status == 500) {
        AppStore.disableLoading();
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    });
   }

  setImageValue() {
    let structure_theme_images = [];
    if (ThemeStructureSettingStore.headerLogoImageDetails != null) {
      let header_logo = {
        is_new: ThemeStructureSettingStore.headerLogoImageDetails?.is_new ? ThemeStructureSettingStore.headerLogoImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.headerLogoImageDetails?.is_deleted ? ThemeStructureSettingStore.headerLogoImageDetails?.is_deleted : false,
        type: 'header-logo',
        name: ThemeStructureSettingStore.headerLogoImageDetails?.title ? ThemeStructureSettingStore.headerLogoImageDetails?.title : ThemeStructureSettingStore.headerLogoImageDetails?.name,
        ext: ThemeStructureSettingStore.headerLogoImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.headerLogoImageDetails?.mime_type,
        size: ThemeStructureSettingStore.headerLogoImageDetails?.size,
        url: ThemeStructureSettingStore.headerLogoImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.headerLogoImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.headerLogoImageDetails?.token,
      }
      structure_theme_images.push(header_logo);
    }
    if (ThemeStructureSettingStore.loaderImageDetails != null) {
      let loader = {
        is_new: ThemeStructureSettingStore.loaderImageDetails?.is_new ? ThemeStructureSettingStore.loaderImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.loaderImageDetails?.is_deleted ? ThemeStructureSettingStore.loaderImageDetails?.is_deleted : false,
        type: 'loader',
        name: ThemeStructureSettingStore.loaderImageDetails?.title ? ThemeStructureSettingStore.loaderImageDetails?.title : ThemeStructureSettingStore.loaderImageDetails?.name,
        ext: ThemeStructureSettingStore.loaderImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.loaderImageDetails?.mime_type,
        size: ThemeStructureSettingStore.loaderImageDetails?.size,
        url: ThemeStructureSettingStore.loaderImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.loaderImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.loaderImageDetails?.token,
      }
      structure_theme_images.push(loader);
    }
    if (ThemeStructureSettingStore.discussionIconImageDetails != null) {
      let discussion_icon = {
        is_new: ThemeStructureSettingStore.discussionIconImageDetails?.is_new ? ThemeStructureSettingStore.discussionIconImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.discussionIconImageDetails?.is_deleted ? ThemeStructureSettingStore.discussionIconImageDetails?.is_deleted : false,
        type: 'discussion-icon',
        name: ThemeStructureSettingStore.discussionIconImageDetails?.title ? ThemeStructureSettingStore.discussionIconImageDetails?.title : ThemeStructureSettingStore.discussionIconImageDetails?.name,
        ext: ThemeStructureSettingStore.discussionIconImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.discussionIconImageDetails?.mime_type,
        size: ThemeStructureSettingStore.discussionIconImageDetails?.size,
        url: ThemeStructureSettingStore.discussionIconImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.discussionIconImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.discussionIconImageDetails?.token,
      }
      structure_theme_images.push(discussion_icon);
    }
    if (ThemeStructureSettingStore.favIconImageDetails != null) {
      let fav_icon = {
        is_new: ThemeStructureSettingStore.favIconImageDetails?.is_new ? ThemeStructureSettingStore.favIconImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.favIconImageDetails?.is_deleted ? ThemeStructureSettingStore.favIconImageDetails?.is_deleted : false,
        type: 'fav-icon',
        name: ThemeStructureSettingStore.favIconImageDetails?.title ? ThemeStructureSettingStore.favIconImageDetails?.title : ThemeStructureSettingStore.favIconImageDetails?.name,
        ext: ThemeStructureSettingStore.favIconImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.favIconImageDetails?.mime_type,
        size: ThemeStructureSettingStore.favIconImageDetails?.size,
        url: ThemeStructureSettingStore.favIconImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.favIconImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.favIconImageDetails?.token,
      }
      structure_theme_images.push(fav_icon);
    }
    if (ThemeStructureSettingStore.emptyBarImageDetails != null) {
      let empty_bar_chart = {
        is_new: ThemeStructureSettingStore.emptyBarImageDetails?.is_new ? ThemeStructureSettingStore.emptyBarImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.emptyBarImageDetails?.is_deleted ? ThemeStructureSettingStore.emptyBarImageDetails?.is_deleted : false,
        type: 'empty-bar-chart',
        name: ThemeStructureSettingStore.emptyBarImageDetails?.title ? ThemeStructureSettingStore.emptyBarImageDetails?.title : ThemeStructureSettingStore.emptyBarImageDetails?.name,
        ext: ThemeStructureSettingStore.emptyBarImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.emptyBarImageDetails?.mime_type,
        size: ThemeStructureSettingStore.emptyBarImageDetails?.size,
        url: ThemeStructureSettingStore.emptyBarImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.emptyBarImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.emptyBarImageDetails?.token,
      }
      structure_theme_images.push(empty_bar_chart);
    }
    if (ThemeStructureSettingStore.emptyPIChartImageDetails != null) {
      let empty_pi_chart = {
        is_new: ThemeStructureSettingStore.emptyPIChartImageDetails?.is_new ? ThemeStructureSettingStore.emptyPIChartImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.emptyPIChartImageDetails?.is_deleted ? ThemeStructureSettingStore.emptyPIChartImageDetails?.is_deleted : false,
        type: 'empty-pi-chart',
        name: ThemeStructureSettingStore.emptyPIChartImageDetails?.title ? ThemeStructureSettingStore.emptyPIChartImageDetails?.title : ThemeStructureSettingStore.emptyPIChartImageDetails?.name,
        ext: ThemeStructureSettingStore.emptyPIChartImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.emptyPIChartImageDetails?.mime_type,
        size: ThemeStructureSettingStore.emptyPIChartImageDetails?.size,
        url: ThemeStructureSettingStore.emptyPIChartImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.emptyPIChartImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.emptyPIChartImageDetails?.token,
      }
      structure_theme_images.push(empty_pi_chart);
    }
    if (ThemeStructureSettingStore.emptyScreenImageDetails != null) {
      let empty_screen = {
        is_new: ThemeStructureSettingStore.emptyScreenImageDetails?.is_new ? ThemeStructureSettingStore.emptyScreenImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.emptyScreenImageDetails?.is_deleted ? ThemeStructureSettingStore.emptyScreenImageDetails?.is_deleted : false,
        type: 'empty-screen',
        name: ThemeStructureSettingStore.emptyScreenImageDetails?.title ? ThemeStructureSettingStore.emptyScreenImageDetails?.title : ThemeStructureSettingStore.emptyScreenImageDetails?.name,
        ext: ThemeStructureSettingStore.emptyScreenImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.emptyScreenImageDetails?.mime_type,
        size: ThemeStructureSettingStore.emptyScreenImageDetails?.size,
        url: ThemeStructureSettingStore.emptyScreenImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.emptyScreenImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.emptyScreenImageDetails?.token,
      }
      structure_theme_images.push(empty_screen);
    }
    if (ThemeStructureSettingStore.fiveHundredImageDetails != null) {
      let five_hundred = {
        is_new: ThemeStructureSettingStore.fiveHundredImageDetails?.is_new ? ThemeStructureSettingStore.fiveHundredImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.fiveHundredImageDetails?.is_deleted ? ThemeStructureSettingStore.fiveHundredImageDetails?.is_deleted : false,
        type: '500',
        name: ThemeStructureSettingStore.fiveHundredImageDetails?.title ? ThemeStructureSettingStore.fiveHundredImageDetails?.title : ThemeStructureSettingStore.fiveHundredImageDetails?.name,
        ext: ThemeStructureSettingStore.fiveHundredImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.fiveHundredImageDetails?.mime_type,
        size: ThemeStructureSettingStore.fiveHundredImageDetails?.size,
        url: ThemeStructureSettingStore.fiveHundredImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.fiveHundredImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.fiveHundredImageDetails?.token,
      }
      structure_theme_images.push(five_hundred);
    }
    if (ThemeStructureSettingStore.fourNotFourImageDetails != null) {
      let four_not_four = {
        is_new: ThemeStructureSettingStore.fourNotFourImageDetails?.is_new ? ThemeStructureSettingStore.fourNotFourImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.fourNotFourImageDetails?.is_deleted ? ThemeStructureSettingStore.fourNotFourImageDetails?.is_deleted : false,
        type: '404',
        name: ThemeStructureSettingStore.fourNotFourImageDetails?.title ? ThemeStructureSettingStore.fourNotFourImageDetails?.title : ThemeStructureSettingStore.fourNotFourImageDetails?.name,
        ext: ThemeStructureSettingStore.fourNotFourImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.fourNotFourImageDetails?.mime_type,
        size: ThemeStructureSettingStore.fourNotFourImageDetails?.size,
        url: ThemeStructureSettingStore.fourNotFourImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.fourNotFourImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.fourNotFourImageDetails?.token,
      }
      structure_theme_images.push(four_not_four);
    }
    if (ThemeStructureSettingStore.fourNotThreeImageDetails != null) {
      let four_not_three = {
        is_new: ThemeStructureSettingStore.fourNotThreeImageDetails?.is_new ? ThemeStructureSettingStore.fourNotThreeImageDetails?.is_new : false,
        is_deleted: ThemeStructureSettingStore.fourNotThreeImageDetails?.is_deleted ? ThemeStructureSettingStore.fourNotThreeImageDetails?.is_deleted : false,
        type: '403',
        name: ThemeStructureSettingStore.fourNotThreeImageDetails?.title ? ThemeStructureSettingStore.fourNotThreeImageDetails?.title : ThemeStructureSettingStore.fourNotThreeImageDetails?.name,
        ext: ThemeStructureSettingStore.fourNotThreeImageDetails?.ext,
        mime_type: ThemeStructureSettingStore.fourNotThreeImageDetails?.mime_type,
        size: ThemeStructureSettingStore.fourNotThreeImageDetails?.size,
        url: ThemeStructureSettingStore.fourNotThreeImageDetails?.url,
        thumbnail_url: ThemeStructureSettingStore.fourNotThreeImageDetails?.thumbnail_url,
        token: ThemeStructureSettingStore.fourNotThreeImageDetails?.token,
      }
      structure_theme_images.push(four_not_three);
    }
    this.structureObject.app_theme_setting_images = structure_theme_images;
  }

  changeStyleField(){
    this.buttonDisabled = false;
  }

  setColor(){
    // document.querySelector("body").style.cssText = "--my-var: #d51067 ; --my-var1: #f17fb3; --my-var2: rgba(156, 0, 69, 0.8); --my-var3: #ff0071 ; --my-var4: #485f75 ; --my-var5: #f00a1538 ; --my-var6: #ffa0ca ; --my-var7: #fff ; --my-var8: rgba(156, 0, 69, 0.7); --my-var9: #760034 ; --my-var10: #ff519e ; --my-var11: #ffd0e5 ; --my-var12: #ffe6f2 ; --my-var13: #ffeef6 ; --my-var14: #fff5fa ; --my-var15: #ffa7ce; --my-var16: rgba(156, 0, 69, 0.25); --my-var17: #C6001D; --my-var18: #CBD6E2; --my-var19: #33475B; --my-var20: #f5f6f7; --my-var21: #9c0045";
    // document.querySelector("body").style.cssText = "--my-var: #d51067 ; --my-var1: #f17fb3";
  }
}
