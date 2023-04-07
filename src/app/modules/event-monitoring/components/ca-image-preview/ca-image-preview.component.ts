import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventDocumentsService } from 'src/app/core/services/event-monitoring/event-documents/event-documents.service';
import { EventLessonLearntCaService } from 'src/app/core/services/event-monitoring/event-lesson-learnt-ca/event-lesson-learnt-ca.service';

@Component({
  selector: 'app-ca-image-preview',
  templateUrl: './ca-image-preview.component.html',
  styleUrls: ['./ca-image-preview.component.scss']
})
export class CaImagePreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(
    private _imageService: ImageServiceService, 
    private _organizationFileService: OrganizationfileService, 
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService,
    private _eventDocumentService: EventDocumentsService,
    private _eventLessonLearntCaService: EventLessonLearntCaService,) { }

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

  downloadFile(){
    console.log(this.iFrameSource.comonent)
    console.log(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details)
    if(this.iFrameSource.component=='document-version')
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='event-documents')
    this._eventDocumentService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='lesson-learned-corrective-action-document')
    this._eventLessonLearntCaService.downloadFile(this.iFrameSource.component,this.iFrameSource.frequency,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='corrective-action-history')
    this._eventLessonLearntCaService.downloadHistoryFile(this.iFrameSource.component,this.iFrameSource.frequency,this.iFrameSource.file_details?.event_lesson_learned_corrective_action_status_update_id,this.iFrameSource.file_details.title,this.iFrameSource.file_details.id,this.iFrameSource.file_details);
    else
    this._organizationFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.organization_policy_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
  }

  checkIeorNot(){
    return this._helperService.checkBrowser();
  }

}
