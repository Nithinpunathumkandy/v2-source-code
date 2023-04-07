import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _imageService: ImageServiceService,
    private _documentFileService:DocumentFileService,
    private _eventEmitterService:EventEmitterService,
    private _fileService: CustomerEngagementFileServiceService
  ) { }

  ngOnInit(): void {
  }
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }
  closePreviewModal(){
    this._eventEmitterService.dismissCustomerCorrectiveActionPreviewModal();
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.type) {
    case'customer-complaint-document':
      this._fileService.downloadFile(this.iFrameSource.type,this.iFrameSource.file_details.customer_complaint_id,null,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
    case'customer-investigation-document':
      this._fileService.downloadFile(this.iFrameSource.type,this.iFrameSource.file_details.customer_complaint_investigation_id,null,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
    case 'corrective-action':
      this._fileService.downloadFile('corrective-action',null,this.iFrameSource.file_details.customer_complaint_action_plan_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
      break;
    case 'customer-compaint-action-plans-update':
      this._fileService.downloadFile(this.iFrameSource.type, this.iFrameSource.ca_id,null,this.iFrameSource.file_details.customer_complaint_action_plan_update_id,null,this.iFrameSource.file_id);
      break;
    case'document-version':
    if(this.iFrameSource.component == 'complaints')
      this._fileService.downloadFile(this.iFrameSource.type,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if(this.iFrameSource.component == 'action-plan')
      this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
    break;
      default:
      break;
    }
  }
}
