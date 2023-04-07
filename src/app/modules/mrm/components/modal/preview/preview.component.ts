import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  constructor(
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _meetingPlanFileService: MeetingPlanFileService
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
      this._meetingPlanFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,this.iFrameSource.updateId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
  }
}
