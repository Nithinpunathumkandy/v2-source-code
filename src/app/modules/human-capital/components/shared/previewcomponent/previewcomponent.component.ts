import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";

@Component({
  selector: 'app-previewcomponent',
  templateUrl: './previewcomponent.component.html',
  styleUrls: ['./previewcomponent.component.scss']
})
export class PreviewcomponentComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService) { }

  ngOnInit(): void {
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.component) {
      case 'user-download-certificate':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, UsersStore.user_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, '', this.iFrameSource.file_details);
        break;
      case 'user-job-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, UsersStore.user_id, this.iFrameSource.file_details.jd_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'user-kpi-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, UsersStore.user_id, this.iFrameSource.file_details.kpi_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'user-report-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, UsersStore.user_id, this.iFrameSource.file_details.user_report_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break

    }

  }

}
