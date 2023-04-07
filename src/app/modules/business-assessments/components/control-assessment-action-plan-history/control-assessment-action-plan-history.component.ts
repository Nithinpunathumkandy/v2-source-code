import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CAActionPlanStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-action-plan-store';
declare var $: any;

@Component({
  selector: 'app-control-assessment-action-plan-history',
  templateUrl: './control-assessment-action-plan-history.component.html',
  styleUrls: ['./control-assessment-action-plan-history.component.scss']
})
export class ControlAssessmentActionPlanHistoryComponent implements OnInit {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  AppStore = AppStore;
  CAActionPlanStore=CAActionPlanStore;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId: null,
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
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) CAActionPlanStore.setHistoryCurrentPage(newPage);
    this._controlAssessmentActionPlanService.getCaHistory(CAActionPlanStore.CAActionPlanDetails.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  imageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  // kh-module base document
  viewDocument(type, documents, documentFile) {

    switch (type) {
      case "control-assessment-action-plan-update-document":
        this._controlAssessmentActionPlanService
          .getFilePreview(type, CAActionPlanStore.CAActionPlanDetails.id, documentFile.id, documents.control_assessment_action_plan_update_id)
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
    if (type == 'control-assessment-action-plan-update-document')
      return this._controlAssessmentActionPlanService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "control-assessment-action-plan-update-document":
        this._controlAssessmentActionPlanService.downloadFile(
          type,
          CAActionPlanStore.CAActionPlanDetails.id,
          document.id,
          document.control_assessment_action_plan_update_id,
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
      this.previewObject.updateId = document.control_assessment_action_plan_update_id;
      this.previewObject.componentId =  CAActionPlanStore.CAActionPlanDetails.id;

      this.previewObject.uploaded_user =  CAActionPlanStore.CAActionPlanDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      setTimeout(() => {
        $(this.filePreviewModal.nativeElement).modal('show');
        this._utilityService.detectChanges(this._cdr);
      }, 50);
      
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    setTimeout(() => {
      // $(this.filePreviewModal.nativeElement).modal('hide');
      document.body.classList.add('modal-open');
      this._utilityService.detectChanges(this._cdr);
    },500);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this._eventEmitterService.dismissControlAssessmentHistoryActionPlanModal();
    CAActionPlanStore.unSetActionPlanHistory();
  }

  ngOnDestroy() {
    CAActionPlanStore.unSetActionPlanHistory();
  }

}
