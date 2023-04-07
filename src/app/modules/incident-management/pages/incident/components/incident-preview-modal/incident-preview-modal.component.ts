import { Component, ElementRef, Input,EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
declare var $: any;

@Component({
  selector: 'app-incident-preview-modal',
  templateUrl: './incident-preview-modal.component.html',
  styleUrls: ['./incident-preview-modal.component.scss']
})
export class IncidentPreviewModalComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  downloadMessage: string = '';
  constructor(private _imageService: ImageServiceService, private _documentFileService: DocumentFileService,
    private _incidentFileService : IncidentFileService, private _correctiveActionService : IncidentCorrectiveActionService) { }

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
    if (this.iFrameSource.component == 'incident-item') 
      this._incidentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if(this.iFrameSource.component == 'incident_corrective_action'){
      this._correctiveActionService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.incident_corrective_action_update_id,this.iFrameSource.file_details.title,this.iFrameSource.file_details.id,this.iFrameSource.file_details);
    } else if(this.iFrameSource.component == 'corrective-action-details'){
      this._correctiveActionService.downloadFile(this.iFrameSource.component,this.iFrameSource.ca_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,null,this.iFrameSource.file_details);
    }
    else if(this.iFrameSource.component=='document-version'){
      this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
    else if(this.iFrameSource.component == 'investigation-item'){
      this._incidentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
    else{
      this._incidentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    }
    // this.closeDownloadPopUp();
  }



}
