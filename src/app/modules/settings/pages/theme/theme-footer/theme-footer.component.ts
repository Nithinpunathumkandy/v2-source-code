import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ThemeFooterSettingsService } from 'src/app/core/services/settings/theme-settings/theme-footer-settings/theme-footer-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ThemeFooterSettingsStore } from 'src/app/stores/settings/theme/theme-footer.store';

@Component({
  selector: 'app-theme-footer',
  templateUrl: './theme-footer.component.html',
  styleUrls: ['./theme-footer.component.scss']
})
export class ThemeFooterComponent implements OnInit {

  color: any;
  fileUploadProgress = 0;
  logoUploaded = false;
  ThemeFooterSettingsStore = ThemeFooterSettingsStore;
  AuthStore = AuthStore;
  constructor(private _utilityService: UtilityService, private _themefooterservice: ThemeFooterSettingsService,
    private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService) { }

  ngOnInit(): void {
  }

  onFileChange(event, type: string) {

    this.fileUploadProgress = 0;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      if (type == 'logo') ThemeFooterSettingsStore.logo_preview_available = true;
      this._utilityService.detectChanges(this._cdr);
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
              let temp: any = uploadEvent['body'];
              temp['is_new'] = true;
              this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                if (type == 'logo') {
                  this.logoUploaded = true;
                  ThemeFooterSettingsStore.logo_preview_available = false;
                }
                this.createImageFromBlob(prew, temp, type);
              }, (error) => {
                ThemeFooterSettingsStore.logo_preview_available = false;
                this._utilityService.detectChanges(this._cdr);
              })
          }
        }, (error) => {
          this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
          ThemeFooterSettingsStore.logo_preview_available = false;
          this.fileUploadProgress = 0;
          this._utilityService.detectChanges(this._cdr);
        })
    }
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      if (imageDetails != null) {
        imageDetails['preview'] = logo_url;
        this._themefooterservice.setImageDetails(imageDetails, logo_url, type);
      }
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
