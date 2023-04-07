import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';

declare var $: any;
@Component({
  selector: 'app-audit-plan-preview-modal',
  templateUrl: './audit-plan-preview-modal.component.html',
  styleUrls: ['./audit-plan-preview-modal.component.scss']
})
export class AuditPlanPreviewModalComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  downloadMessage: string = '';
  constructor(private _imageService: ImageServiceService,
    private _internalAuditFileService: InternalAuditFileService,
    private _documentFileService: DocumentFileService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
  }
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  closePreviewModal() {
    //console.log('close clicked');
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    $(this.loaderPopUp.nativeElement).modal('show');
    console.log(this.iFrameSource)
    // if (this.iFrameSource.component == 'process-activities') 
    //   this._internalAuditFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.process_activity_id,this.iFrameSource.file_details.id,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    // else{
    //   this._internalAuditFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
    // }
    switch (this.iFrameSource.component) {
      case 'document-version':
        this._documentFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'audits':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.audit_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'audit-plan':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.audit_plan_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'process-activities':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.process_activity_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'findings':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.findings_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'corrective-action':
        this._internalAuditFileService.downloadCADocument(this.iFrameSource.component, AuditFindingsStore.auditFindingId, this.iFrameSource.file_details.finding_corrective_action_id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title);
        break;
      case 'auditable-item':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.auditable_item_id, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
      case 'corrective-action-history':
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.ca_id, this.iFrameSource.update_id, this.iFrameSource.file_id);
        break;

      default:
        this._internalAuditFileService.downloadFile(this.iFrameSource.component, this.iFrameSource.componentId, this.iFrameSource.file_details.id, null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
    }

    this.closeDownloadPopUp();
  }

  closeDownloadPopUp() {
    this._eventEmitterService.enablePreviewFocus()
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 1000);
  }

}
