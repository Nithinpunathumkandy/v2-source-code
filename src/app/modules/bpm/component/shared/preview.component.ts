import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import {BpmFileService} from '../../../../core/services/bpm/bpm-file/bpm-file.service'

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
     private _bpmFileService: BpmFileService,
     private _documentFileService: DocumentFileService,
     ) { }

  ngOnInit(): void {
  }
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }
  closePreviewModal(){
    //console.log('close clicked');
    this.close.emit(0);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    
    switch (this.iFrameSource.component) {
      case 'process-activities':
        this._bpmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.process_activity_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
        break;
    case'process-document':
    this._bpmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
    case'control-document':
    this._bpmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.control_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
    case'document-version':
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
      default:
        break;
    }

    // if (this.iFrameSource.component == 'process-activities') 
    //   this._bpmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.process_activity_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    // else
    // this._bpmFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
  }

}
