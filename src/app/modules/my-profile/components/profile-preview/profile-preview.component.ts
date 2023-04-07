import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss']
})
export class ProfilePreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
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
        this._humanCapitalService.downloadFile(this.iFrameSource.component, this.iFrameSource.userId, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, '', this.iFrameSource.file_details);
        break;
      case 'user-job-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.user_id, this.iFrameSource.file_details.jd_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'user-kpi-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.user_id, this.iFrameSource.file_details.kpi_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'user-report-documents':
        this._humanCapitalService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.user_id, this.iFrameSource.file_details.user_report_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'user-download-documents':
        // this._humanCapitalService.downloadFile('user-download-documents', MyProfileProfileStore.userId, id, filename, file_id, doc);
        this._humanCapitalService.downloadFile(this.iFrameSource.component, MyProfileProfileStore.userId, this.iFrameSource.doc_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
    }

  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : null;
      userDetailObject['created_at'] = this.iFrameSource.created_at ? this.iFrameSource.created_at : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id ? user.id : null;
      userDetailObject['department'] = user.created_by_department ? user.created_by_department : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      return userDetailObject;
    }
  }

}
