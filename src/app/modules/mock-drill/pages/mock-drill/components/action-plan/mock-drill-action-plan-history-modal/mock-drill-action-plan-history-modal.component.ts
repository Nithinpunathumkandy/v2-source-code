import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MockDrillActionPlanService } from 'src/app/core/services/mock-drill/mock-drill-action-plans/mock-drill-action-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-action-plan-history-modal',
  templateUrl: './mock-drill-action-plan-history-modal.component.html',
  styleUrls: ['./mock-drill-action-plan-history-modal.component.scss']
})
export class MockDrillActionPlanHistoryModalComponent implements OnInit {

  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  AppStore = AppStore;
  MockDrillActionPlanStore = MockDrillActionPlanStore;
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
    private _actionPlansService: MockDrillActionPlanService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MockDrillActionPlanStore.setHistoryCurrentPage(newPage);
    this._actionPlansService.getHistory(MockDrillActionPlanStore.selectedPlan.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  imageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  // kh-module base document
  viewDocument(type, documents, documentFile) {
    switch (type) {
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
    if (type == 'mock-drill-action-plan-update-document')
      return this._actionPlansService.getThumbnailPreview(type, token);
    else
      return this._documentFileService.getThumbnailPreview(type, token);
  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "mock-drill-action-plan-update-document":
        this._actionPlansService.downloadFile(
          type,
          MockDrillActionPlanStore.selectedPlan.id,
          document.id,
          document.mock_drill_action_plan_update_id,
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
      this.previewObject.updateId = document.mock_drill_action_plan_update_id;
      this.previewObject.componentId = MockDrillActionPlanStore.selectedPlan.id;

      this.previewObject.uploaded_user = MockDrillActionPlanStore.selectedPlan.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
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
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this._eventEmitterService.dismissActionPlanHistoryModal();
    MockDrillActionPlanStore.unSetActionPlanHistory();
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    let userDetails: any = {};
    if (users) {
      userDetails['first_name'] = users?.created_by_first_name;
      userDetails['last_name'] = users?.created_by_last_name;
      userDetails['image_token'] = users?.created_by_image_token ? users?.created_by_image_token : users?.image_token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.created_by;
      userDetails['department'] = users?.created_by_department;
      userDetails['status_id'] = users?.created_by_status;
      userDetails['created_at'] = created ? created : null;
      userDetails['designation'] = users?.created_by_designation;
    }
    return userDetails;
  }

  ngOnDestroy() {
    MockDrillActionPlanStore.unSetActionPlanHistory();
  }
}
