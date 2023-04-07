import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';


@Component({
  selector: 'app-cyber-incident-file-preview',
  templateUrl: './cyber-incident-file-preview.component.html',
  styleUrls: ['./cyber-incident-file-preview.component.scss']
})
export class CyberIncidentFilePreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  constructor(private _imageService: ImageServiceService,
    private _cyberIncidentService:CyberIncidentService,
     private _documentFileService: DocumentFileService,
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
    console.log(this.iFrameSource.file_details)
    switch (this.iFrameSource.component) {
    case'cyber_incident':
    this._cyberIncidentService.downloadFile(this.iFrameSource.file_details.cyber_incident_id,this.iFrameSource.component,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
    case'corrective-action':
    this._cyberIncidentService.downloadFile(this.iFrameSource.file_details.cyber_incident_corrective_action_id, this.iFrameSource.component, null, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details);
    break;
    case'corrective-action-history':
    this._cyberIncidentService.downloadFile(this.iFrameSource.ca_id, this.iFrameSource.component, null, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details, this.iFrameSource.update_id)
    break;
    case'document-version':
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    break;
      default:
        break;
    }

   
  }

}
