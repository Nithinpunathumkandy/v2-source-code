import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from "src/app/stores/app.store";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  ImportItemStore = ImportItemStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadProgress = 0;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  loading: boolean = false;

  constructor(private _imageService: ImageServiceService, 
    private _cdr: ChangeDetectorRef, 
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService, 
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status && $(this.formModal.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
      }
    })
    ImportItemStore.importLoading = false;
  }

  onFileChange(event,type:string){
    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // ImportItemStore.setFileDetails(file);
      if(this._imageService.checkImportFileValidation(file)){
        const formData = new FormData();
        formData.append('file',file);
        ImportItemStore.item_preview_available = true;
        this._utilityService.detectChanges(this._cdr);
        var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
        this._imageService.uploadImageWithProgress(formData,typeParams)
        .subscribe((res: HttpEvent<any>) => {
          let uploadEvent: any = res;
          switch (uploadEvent.type) {
            case HttpEventType.UploadProgress:
              // Compute and show the % done;
              if(uploadEvent.loaded)
                this.fileUploadProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
              this._utilityService.detectChanges(this._cdr);
              break;
            case HttpEventType.Response:
              $("#file").val('');
              let temp: any = uploadEvent['body'];
              temp['is_new'] = true;
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{
                ImportItemStore.item_preview_available = false;
                this.createImageFromBlob(prew,temp,type);
              },(error)=>{
                ImportItemStore.item_preview_available = false;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        },(error)=>{
          let errorMessage = "";
          $("#file").val('');
          if(error.error?.errors?.hasOwnProperty('file'))
            errorMessage = error.error.errors.file;
          else errorMessage = 'file_upload_failed';
          this._utilityService.showErrorMessage('failed', errorMessage);
          ImportItemStore.item_preview_available = false;
          this.fileUploadProgress = 0;
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else{
        $("#file").val('');
      }
    }
  }

  // Create Base64 image strig from blob
  createImageFromBlob(image: Blob,imageDetails,type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if(imageDetails != null){
        imageDetails['preview_url'] = logo_url;
        ImportItemStore.setFileDetails(imageDetails, type);
        ImportItemStore.unsetAllErrors();
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  /**
   * @param ext File Extension
   * @param extType Type of file to check - image or doc or pdf...
   */
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }
  // Check if logo is being uploaded
  checkLogoIsUploading(){
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  importData(){
    if(ImportItemStore.getFileDetails != null){
      ImportItemStore.importClicked = true;
      ImportItemStore.importLoading = true;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  removeBrochure(token) {
		ImportItemStore.unsetFileDetails(token);
		this._utilityService.detectChanges(this._cdr);
	  }

  clearForm(){
    ImportItemStore.setImportFlag(false);
    ImportItemStore.unsetFileDetails();
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
