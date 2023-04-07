import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  downloadMessage: string = '';
  constructor(private _imageService: ImageServiceService, private _reviewService : StrategyReviewService,
    private _documentFileService: DocumentFileService,)
     { }

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
    // $(this.loaderPopUp.nativeElement).modal('show');

    switch (this.iFrameSource.component) {
      case 'kpi-document' :
      this._reviewService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
      case'document-version':
      this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
      case 'plan-measure' :
        this._reviewService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
        break;
      default:
        
        break;
    // this.closeDownloadPopUp();
  }
}
}
