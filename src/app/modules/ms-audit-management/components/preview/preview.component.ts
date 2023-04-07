import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @Output()close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _fileServiceService: FileServiceService,
   private _followUpService : FollowUpService,
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
    console.log(this.iFrameSource)
    if(this.iFrameSource.component=='document-version')
    {
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }else if(this.iFrameSource.component == 'audit-follow-up'){
      this._followUpService.downloadFile(this.iFrameSource.correctiveActionId,this.iFrameSource.file_details.document_id,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.updateId,this.iFrameSource.file_details.title,this.iFrameSource.file_details)
    }
     else if(this.iFrameSource.component == 'corrective-action'){
      this._fileServiceService.downloadFile(this.iFrameSource.component,this.iFrameSource.fid,this.iFrameSource.file_details.id,this.iFrameSource.ca_id,this.iFrameSource.file_details.title,this.iFrameSource.file_details)
    }
    else if(this.iFrameSource.component == 'corrective-action-history'){
      this._fileServiceService.downloadFile(this.iFrameSource.component,this.iFrameSource.ca_id,this.iFrameSource.file_details.id,this.iFrameSource.update_id,this.iFrameSource.file_details.title,this.iFrameSource.file_details)
    }
    else {
      this._fileServiceService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,this.iFrameSource.updateId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
  }
}
