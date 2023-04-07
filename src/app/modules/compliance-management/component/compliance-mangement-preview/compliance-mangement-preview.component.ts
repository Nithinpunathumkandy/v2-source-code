import { Component, Input,EventEmitter, OnInit, Output } from '@angular/core';
import { ComplianceRegisterService } from 'src/app/core/services/compliance-management/compliance-register/compliance-register.service';
import { SlaContractService } from 'src/app/core/services/compliance-management/sla-contract/sla-contract.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ComplianceRegisterActionPlanStore } from 'src/app/stores/compliance-management/compliance-register/action-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

@Component({
  selector: 'app-compliance-mangement-preview',
  templateUrl: './compliance-mangement-preview.component.html',
  styleUrls: ['./compliance-mangement-preview.component.scss']
})
export class ComplianceMangementPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  // @Output()
  // close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  ComplianceRegisterActionPlanStore=ComplianceRegisterActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _slaContractService: SlaContractService,
    private _eventEmitterService:EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _complianceRegisterService:ComplianceRegisterService) { }

  ngOnInit(): void {
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this._eventEmitterService.dismissSLADocumentPreviewModal();
  }

  createImagePreview(type, token) {
    switch(type){
      case 'sla-contract-document':
        return this._slaContractService.getThumbnailPreview(type, token);
        break;
        case 'compliance-status-document':
          return this._complianceRegisterService.getStatusThumbnailPreview(token);
          break;
    }
    
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    console.log(this.iFrameSource)
    switch(this.iFrameSource.component){
      case 'sla-download-document':
      this._slaContractService.downloadFile(this.iFrameSource.component, this.iFrameSource.id, this.iFrameSource.file_details.id, this.iFrameSource.file_details.title, '', this.iFrameSource.file_details);
      break;
      case 'compliance-status-document':
      this._complianceRegisterService.downloadFile(this.iFrameSource.component, this.iFrameSource.complianceStatus.id, this.iFrameSource.complianceStatus.document_id, this.iFrameSource.id , this.iFrameSource.file_details.title , this.iFrameSource.file_details);
      break;
      case 'compliance-register-document':
      this._complianceRegisterService.downloadFile(this.iFrameSource.component, this.iFrameSource.file_details.document_id,'', this.iFrameSource.id , this.iFrameSource.file_details);
      break;
      case 'compliance-action-plan-update-document':
      this._complianceRegisterService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId, this.iFrameSource.file_details.id, this.iFrameSource.updateId,this.iFrameSource.file_details.title, this.iFrameSource.file_details);
      break;
      case'document-version':
      this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id,this.iFrameSource.file_details.id,null,this.iFrameSource.file_details.title,this.iFrameSource.file_details);
      break;
    }
    

  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : null;
      userDetailObject['created_at'] = this.iFrameSource.created_at ? this.iFrameSource.created_at : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id ? user.id : null;
      userDetailObject['department'] = user.created_by_department ? user.created_by_department : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      return userDetailObject;
    }
  }
}
