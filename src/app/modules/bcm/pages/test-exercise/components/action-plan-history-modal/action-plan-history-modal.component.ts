import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TestActionPlanStore } from 'src/app/stores/bcm/test-exercise/test-exercise-action-plan-store';
declare var $: any;
@Component({
  selector: 'app-action-plan-history-modal',
  templateUrl: './action-plan-history-modal.component.html',
  styleUrls: ['./action-plan-history-modal.component.scss']
})
export class ActionPlanHistoryModalComponent implements OnInit {
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @Input('source') source;
  AppStore = AppStore;
  ActionPlansStore = TestActionPlanStore;

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId:null,
  };

  historyEmptyList='look_like_we_dont_have_any_update_action plan_progress_history_to_display_here';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService:ImageServiceService,
     private _actionPlansService:TestAndExerciseService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _documentFileService: DocumentFileService,
    private _bcmFileServiceService: BcmFileServiceService
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) this.ActionPlansStore.setHistoryCurrentPage(newPage);
    this._actionPlansService.getHistory(this.source.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  imageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  // kh-module base document
  viewDocument(type, documents, documentFile) {
    
    switch (type) {
      case "action-plan-history":
        this._bcmFileServiceService
          .getFilePreview(type, this.source.id, documentFile.id,documents.test_and_exercise_action_plan_update_id)
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
    if(type=='action-plan-history')
    return this._bcmFileServiceService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "action-plan-history":
        this._bcmFileServiceService.downloadFile(
          type,
          this.source.id,
          document.id,
          document.test_and_exercise_action_plan_update_id,
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
    this.previewObject.component=type;
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.updateId = document.test_and_exercise_action_plan_update_id;
      this.previewObject.componentId = this.source.id;
      this.previewObject.uploaded_user = document.updated_by ? document.updated_by : document.created_by;
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
    TestActionPlanStore.unSetActionPlanHistory();
  }

  ngOnDestroy(){
    TestActionPlanStore.unSetActionPlanHistory();
  }

}
