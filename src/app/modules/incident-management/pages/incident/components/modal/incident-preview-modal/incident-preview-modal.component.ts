import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';

@Component({
  selector: 'app-incident-preview-modal',
  templateUrl: './incident-preview-modal.component.html',
  styleUrls: ['./incident-preview-modal.component.scss']
})
export class IncidentPreviewModalComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  constructor(
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _incidentFileService: IncidentFileService
  ) { }

  ngOnInit(): void {
  }

  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }
  closePreviewModal(){

    this.close.emit(0);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    if(this.iFrameSource.component=='document-version')
    {
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }else {
      this._incidentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.incident_id,this.iFrameSource.file_details.id,this.iFrameSource.updateId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
  }

}
