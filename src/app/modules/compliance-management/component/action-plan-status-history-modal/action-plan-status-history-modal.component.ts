import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { ComplianceActionPlanService } from 'src/app/core/services/compliance-management/compliance-action-plans/compliance-action-plan.service';
import { ComplianceManagementFileService } from 'src/app/core/services/compliance-management/compliance-management-file/compliance-management-file.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
// import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterActionPlanStore } from 'src/app/stores/compliance-management/compliance-register/action-plan-store';
// import { ComplianceRegisterActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
declare var $: any;

@Component({
  selector: 'app-action-plan-status-history-modal',
  templateUrl: './action-plan-status-history-modal.component.html',
  styleUrls: ['./action-plan-status-history-modal.component.scss']
})
export class ActionPlanStatusHistoryModalComponent implements OnInit {


  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  // ComplianceRegisterActionPlanStore=ComplianceRegisterActionPlanStore
  ComplianceRegisterActionPlanStore=ComplianceRegisterActionPlanStore;
  actionPlanFormSubscription:any
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId: null,
    file_type : null,
  };

  historyEmptyList = 'look_like_we_dont_have_any_update_action plan_progress_history_to_display_here';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _complianceManagementFileService: ComplianceManagementFileService,
    // private _baActionPlanService:BaActionPlanService
    private _complianceActionPlanService:ComplianceActionPlanService,
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
    this.actionPlanFormSubscription=this._eventEmitterService.slaDocumentPreviewModal.subscribe(res=>{

      this.closePreviewModal()
    })
  }

  pageChange(newPage: number = null) {
    if (newPage) ComplianceRegisterActionPlanStore.setHistoryCurrentPage(newPage);
    this._complianceActionPlanService.getActionPlanStatusHistory( ComplianceRegisterActionPlanStore.complianceRegisterActionPlanDetails.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  imageUrl(token) {
    return this._documentFileService.getThumbnailPreview('user-profile-picture', token);
  }

  // kh-module base document
  viewDocument(type, documents, documentFile) {
    switch (type) {
      case "compliance-action-plan-update-document":
        this._complianceManagementFileService
          .getFilePreview(type, ComplianceRegisterActionPlanStore.complianceRegisterActionPlanDetails.id, documents.document_action_plan_update_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

    }
  }

  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'compliance-action-plan-update-document')
      return this._complianceManagementFileService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);

  }

  getStatusColorKey(colr){
    var label_color = colr.split('-');

    return 'dot-div-new dot-'+label_color[0]+' font-normal';
  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "compliance-action-plan-update-document":
        this._complianceManagementFileService.downloadFile(
          type,
          ComplianceRegisterActionPlanStore.complianceRegisterActionPlanDetails.id,
          document.id,
          document.document_action_plan_update_id,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  // kh-module base document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.updateId = document.document_action_plan_update_id;
      this.previewObject.componentId =  ComplianceRegisterActionPlanStore.complianceRegisterActionPlanDetails.id;
      this.previewObject.file_type = document.ext;
      this.previewObject.uploaded_user =  ComplianceRegisterActionPlanStore.complianceRegisterActionPlanDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal() {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.file_type = null;
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this._eventEmitterService.dismissBAActionPlanHistoryModal();
    ComplianceRegisterActionPlanStore.unSetActionPlanHistory();
  }

  ngOnDestroy() {
    ComplianceRegisterActionPlanStore.unSetActionPlanHistory();
  }


}
