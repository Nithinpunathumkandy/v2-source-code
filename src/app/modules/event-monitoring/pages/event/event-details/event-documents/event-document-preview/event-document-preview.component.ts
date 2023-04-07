import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { EventDocumentsService } from 'src/app/core/services/event-monitoring/event-documents/event-documents.service';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';



@Component({
  selector: 'app-event-document-preview',
  templateUrl: './event-document-preview.component.html',
  styleUrls: ['./event-document-preview.component.scss']
})
export class EventDocumentPreviewComponent implements OnInit {
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
    private _projectDocumentService: EventDocumentsService,
    private _projectIssueCaService: ProjectIssueCaService,) { }

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

  downloadFile(){
    //console.log(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details)
    if(this.iFrameSource.component=='document-version')
    this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='event-documents')
    this._projectDocumentService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='project-issue-corrective-action-document')
    this._projectIssueCaService.downloadFile(this.iFrameSource.component,this.iFrameSource.frequency,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    else if (this.iFrameSource.component=='corrective-action-history')
    this._projectIssueCaService.downloadHistoryFile(this.iFrameSource.component,this.iFrameSource.frequency,this.iFrameSource.file_details?.project_issue_corrective_action_update_id,this.iFrameSource.file_details.title,this.iFrameSource.file_details.id,this.iFrameSource.file_details);
    else
    this._organizationFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.organization_policy_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
  }

  checkIeorNot(){
    return this._helperService.checkBrowser();
  }

}

