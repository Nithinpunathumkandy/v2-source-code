import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
// import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
// import { RiskManagementService } from 'src/app/core/services/risk-management/risk-management-service/risk-management.service';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { IsmsService } from 'src/app/core/services/isms/isms-service/isms.service';

@Component({
  selector: 'app-isms-risk-preview-modal',
  templateUrl: './isms-risk-preview-modal.component.html',
  styleUrls: ['./isms-risk-preview-modal.component.scss']
})
export class IsmsRiskPreviewModalComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _ismsService: IsmsService,
    private _humanCapitalService:HumanCapitalService) { }

  ngOnInit(): void {
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closePreviewModal() {
    this.close.emit(0);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.component) {
     
      case 'risk-treatment-documents':
        this._ismsService.downloadFile(this.iFrameSource.component, IsmsRiskTreatmentStore.riskTreatmentDetails.id, this.iFrameSource.file_details.risk_treatment_update_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      
    }

  }

}
