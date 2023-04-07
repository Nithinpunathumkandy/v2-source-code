import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ChecklistAnswersListService } from 'src/app/core/services/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ChecklistsAnswersListStore } from 'src/app/stores/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list-store';

@Component({
  selector: 'app-checklist-single-view-modal',
  templateUrl: './checklist-single-view-modal.component.html',
  styleUrls: ['./checklist-single-view-modal.component.scss']
})
export class ChecklistSingleViewModalComponent implements OnInit {
  @Input('source') ChecklistViewSource: any;
  AppStore = AppStore;
  ChecklistsAnswersListStore = ChecklistsAnswersListStore;
  constructor(private _eventEmitterService:EventEmitterService,
    private _checklistAnswersListService: ChecklistAnswersListService,
    private _internalAuditFileService: InternalAuditFileService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    ) { }

  ngOnInit(): void {
    this.checklistAnswerSingleItem();
  }

  checklistAnswerSingleItem(){
    // ChecklistsAnswersListStore.clearIndividualCheckList()
    let params='?audit_schedule_ids='+this.ChecklistViewSource.values.schedule_id;
    this._checklistAnswersListService.getItem(this.ChecklistViewSource.values.id,params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

   // Returns default image
   getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  // Returns image url according to type and token
  createImageUrl(type, token) {
    if(type=='checklists-single-data')
    return this._internalAuditFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);
  }



   // extension check function
   checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
   
  }

  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "checklist":
        this._internalAuditFileService.downloadFile(
          'check-list-answers',
          document.audit_schedule_checklist_answer_id,
          document.id,
          null,
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

  // for downloading files
  downloadChecklistAnswersDocument(type, checklistAnswer, checklistAnswerDocument) {

    event.stopPropagation();
    switch (type) {
      case "downloadChecklistAnswersDocument":
        this._internalAuditFileService.downloadFile(
          "check-list-answers",
          checklistAnswer.id,
          checklistAnswerDocument.id,
          null,
          checklistAnswerDocument.name,
          checklistAnswerDocument
        );
        break;

    }

  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();



  }

  closeFormModal(){
    ChecklistsAnswersListStore.clearIndividualCheckList()
    this._eventEmitterService.dismissChecklistSingleViewModal();
    this._eventEmitterService.dismissChecklistsSingleViewFocusControl();
  }

}
