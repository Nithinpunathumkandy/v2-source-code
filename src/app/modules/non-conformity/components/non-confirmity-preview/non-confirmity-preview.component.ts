import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-non-confirmity-preview',
  templateUrl: './non-confirmity-preview.component.html',
  styleUrls: ['./non-confirmity-preview.component.scss']
})
export class NonConfirmityPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;

  fileUrl: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(private _imageService: ImageServiceService,
    private _documentFileService:DocumentFileService,
    private _correctiveActionService: FindingCorrectiveActionService,
    private _eventEmitterService:EventEmitterService,) { }

  ngOnInit(): void {
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this._eventEmitterService.dismissCorrectiveACtionPreviewModal();
  }

  createImagePreview(type, token) {
    // switch (type) {
    //   case 'corrective-action':
    //     return this._correctiveActionService.getThumbnailPreview(type, token);
    //     break;
    //   case 'corrective-action':
    //     return this._correctiveActionService.getThumbnailPreview(type, token);
    //     break;
    //   default:
    //     break;
    // }
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token)
    }
    else
      return this._correctiveActionService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch(this.iFrameSource.component){
      case 'corrective-action':
      this._correctiveActionService.downloadFile(this.iFrameSource.component,this.iFrameSource.ca_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
      break;
      case 'document-version':
        this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      default:
        break;
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
