import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ExternalAuditFileService } from 'src/app/core/services/external-audit/file-service/external-audit-file.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

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

  constructor(private _imageService: ImageServiceService,
    private _externalAuditFileService: ExternalAuditFileService,
    private _documentFileService: DocumentFileService,) { }

  ngOnInit(): void {



  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  closePreviewModal() {
    //console.log('close clicked');
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    console.log(this.iFrameSource);
    
    if (this.iFrameSource.component == 'process-activities')
      this._externalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.process_activity_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
    else if (this.iFrameSource.component == 'corrective-action')
      this._externalAuditFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.fid, this.iFrameSource.ca_id, this.iFrameSource.componentId, this.iFrameSource.file_details.title, this.iFrameSource.file_details)
    else if(this.iFrameSource.component == 'corrective-action-history')
    this._externalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.ca_id, this.iFrameSource.update_id,this.iFrameSource.file_id)
    else if(this.iFrameSource.component == 'document-version')
    // this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.componentId, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else
      this._externalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
  }


}
