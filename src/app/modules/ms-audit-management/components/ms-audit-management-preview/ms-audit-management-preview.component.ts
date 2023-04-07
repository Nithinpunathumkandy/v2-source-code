import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-ms-audit-management-preview',
  templateUrl: './ms-audit-management-preview.component.html',
  styleUrls: ['./ms-audit-management-preview.component.scss']
})
export class MsAuditManagementPreviewComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _imageService: ImageServiceService,
    
    private _eventEmitterService:EventEmitterService,
    private _fileService: FileServiceService
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
    case'ms-audit-doc':
      this._fileService.downloadFile(this.iFrameSource.type,this.iFrameSource.file_details.ms_audit_id,null,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
  
    case'document-version':
    if(this.iFrameSource.component == 'audits')
      this._fileService.downloadFile(this.iFrameSource.type,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
      default:
      break;
    }
  }
}


