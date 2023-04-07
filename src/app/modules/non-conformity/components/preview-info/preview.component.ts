import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { FindingCorrectiveActionService } from 'src/app/core/services/non-conformity/findings/finding-corrective-action/finding-corrective-action.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input('source') previewObject: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  constructor(
    private _imageService: ImageServiceService,
    private _findingsService: FindingsService,
    private _correctiveActionService: FindingCorrectiveActionService,
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
    
    switch (this.previewObject.component) {
     
    case'findings-document':
    this._findingsService.downloadFile(this.previewObject.component,this.previewObject.file_details.finding_id,this.previewObject.file_details.id,null,this.previewObject.file_details.title,this.previewObject.file_details);
    break;
    case'corrective-action-history':
    this._correctiveActionService.downloadFile(this.previewObject.component, this.previewObject.ca_id, this.previewObject.update_id, this.previewObject.file_id);
    case'document-version':
    this._findingsService.downloadFile(this.previewObject.component,this.previewObject.file_details.document_id,this.previewObject.file_details.id,null,this.previewObject.file_details.title,this.previewObject.file_details);
    break;
      default:
        break;
    }
  }
}
