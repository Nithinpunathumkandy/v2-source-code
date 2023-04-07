import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store'
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { BusinessAssessmentService } from 'src/app/core/services/business-assessments/business-assessment-service/business-assessment.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';

@Component({
  selector: 'app-assessment-doc-preview',
  templateUrl: './assessment-doc-preview.component.html',
  styleUrls: ['./assessment-doc-preview.component.scss']
})
export class AssessmentDocPreviewComponent implements OnInit {

  @Input('source') iFrameSource: any;
  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  fileUrl: any;
  UsersStore = UsersStore;
  downloadMessage: string = '';
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _businessAssessmentService:BusinessAssessmentService,
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService,
    private _documentFileService:DocumentFileService) { }

  ngOnInit(): void {
    // console.log(this.iFrameSource)
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
    //console.log(this.iFrameSource)
    switch (this.iFrameSource.component) {
      case 'checklist-document':
        this._businessAssessmentService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId, this.iFrameSource.file_details.id, this.iFrameSource.file_details.name, this.iFrameSource.file_details);
        break;
        case 'document-version':
        this._documentFileService.downloadFile(this.iFrameSource.component,this.iFrameSource.file_details.document_id, this.iFrameSource.file_details.id,null, this.iFrameSource.file_details.title, this.iFrameSource.file_details);
        break;
        case 'control-assessment-action-plan-update-document':
        this._controlAssessmentActionPlanService.downloadFile(this.iFrameSource.component,this.iFrameSource.componentId, this.iFrameSource.file_details.id, this.iFrameSource.file_details.control_assessment_action_plan_update_id, this.iFrameSource.file_details);
        break;
     

    }

  }

}
