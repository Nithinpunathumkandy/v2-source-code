import { Component, ElementRef,EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { AuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/audit-check-list/audit-check-list.service';

@Component({
  selector: 'app-check-list-file-preview',
  templateUrl: './check-list-file-preview.component.html',
  styleUrls: ['./check-list-file-preview.component.scss']
})
export class CheckListFilePreviewComponent implements OnInit {
  @Input('source') iFrameSource: any;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  downloadMessage: string = '';
  constructor(private _imageService: ImageServiceService, private _msAuditCheckListService : MsAuditCheckListService,
    private _auditCheckListService:AuditCheckListService,
    private _documentFileService: DocumentFileService,private _auditService : MsAuditCheckListService) { }

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
      case 'check-list' :
      this._msAuditCheckListService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
      case'document-version':
      this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
      case'audit-check-list':
      this._auditCheckListService.downloadFile(this.iFrameSource.frequency,this.iFrameSource.component,this.iFrameSource.file_details.id,this.iFrameSource.componentId,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
      
    // this.closeDownloadPopUp();
  }
}
}
