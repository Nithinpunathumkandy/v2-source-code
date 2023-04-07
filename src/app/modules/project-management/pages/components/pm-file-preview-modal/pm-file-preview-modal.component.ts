import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectDetailsDocumentsService } from 'src/app/core/services/project-management/project-details/project-documents/project-details-documents.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-pm-file-preview-modal',
  templateUrl: './pm-file-preview-modal.component.html',
  styleUrls: ['./pm-file-preview-modal.component.scss']
})
export class PmFilePreviewModalComponent implements OnInit, OnChanges {
  @Input('source') iFrameSource: any;
  @Input('previewObjectID') previewObjectID;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  // UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _pmDocumentService:ProjectDetailsDocumentsService,
    private _documentFileService:DocumentFileService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    console.log(this.iFrameSource)
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._pmDocumentService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.component) {
      case 'pm-document':
        this._pmDocumentService.downloadFile(this.iFrameSource.component, undefined, this.iFrameSource.componentId, undefined, undefined, this.iFrameSource.file_details);
        break;
        case 'document-version':
        this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id,null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
    }

  }

}
