import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { RiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { RiskManagementService } from 'src/app/core/services/risk-management/risk-management-service/risk-management.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';


@Component({
  selector: 'app-risk-preview-modal',
  templateUrl: './risk-preview-modal.component.html',
  styleUrls: ['./risk-preview-modal.component.scss']
})
export class RiskPreviewModalComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _riskManagementService: RiskManagementService,
    private _bcmFileService: BcmFileServiceService,
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
    console.log("image",type)
    console.log("compo",this.iFrameSource.component)
    if(this.iFrameSource.component=='risk-treatment-documents')return this._humanCapitalService.getThumbnailPreview(type, token);
    if(this.iFrameSource.component=='test-and-exercise')return this._imageService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  downloadFile() {
    switch (this.iFrameSource.component) {
     
      case 'risk-treatment-documents':
        this._riskManagementService.downloadFile(this.iFrameSource.component, RiskTreatmentStore.riskTreatmentDetails.id, this.iFrameSource.file_details.risk_treatment_update_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
      case 'test-and-exercise':
        this._bcmFileService.downloadFile(this.iFrameSource.component, TestAndExerciseStore.riskTestEndExercise.id, this.iFrameSource.file_details.risk_treatment_update_id, this.iFrameSource.file_details.title, this.iFrameSource.file_details.id, this.iFrameSource.file_details);
        break
    }

  }


}
