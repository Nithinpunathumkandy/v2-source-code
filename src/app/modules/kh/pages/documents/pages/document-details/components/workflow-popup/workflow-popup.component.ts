import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentWorkflowService } from 'src/app/core/services/knowledge-hub/documents/document-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';

declare var $: any;

@Component({
  selector: 'app-workflow-popup',
  templateUrl: './workflow-popup.component.html',
  styleUrls: ['./workflow-popup.component.scss']
})
export class WorkflowPopupComponent implements OnInit {

  constructor(
    private _documentWorkflowService: DocumentWorkflowService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private documentsService: DocumentsService,
    private _workFlowService: WorkflowService,
  ) { }

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workFlowEditModal', { static: true }) workFlowEditModal: ElementRef;

  DocumentWorkflowStore = documentWorkFlowStore;
  alligRight: boolean = true;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  userMatch: boolean = false;
  levelMatch: boolean = false;
  DocumentsStore = DocumentsStore;

  workFlowSourceData = {
    values: null,
    type: null
  };

  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
    type: '',
    teamType: '',
    userId: null
  };

  clearPopupObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
  }

  popupControlEventSubscription: any;
  historyPopupSubscription: any;
  workFlowEditModalSubscription: any
  emptyHistoy="workflow_history_empty_title";

  ngOnInit(): void {

    console.log("Helllo")

    AppStore.showDiscussion = true;
    this.getDocumentWorkflow()
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.workFlowEditModalSubscription = this._eventEmitterService.workflowUserAddModal.subscribe(res => {
      this.getDocumentWorkflow()
      this.closeFormModal()
      this.getDocumentDetails()
    })
  }

  getDocumentDetails() {    
    this.documentsService.getItemById(DocumentsStore.documentId).subscribe(res => {      
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getDocumentWorkflow() {
    this._documentWorkflowService.getWorkflow(DocumentsStore.documentId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none edit-option'
    // *Checking and setting class name based on document status type.
    if (!workflow.workflow_status) {
      if (workflow.level == DocumentsStore?.documentDetails?.next_review_user_level)
        className = className + ' ' + 'pending active'
      else
        className = className + ' ' + 'pending'
    }
    else {
      switch (workflow.workflow_status?.id) {
        case 5:
          if (workflow.level == DocumentsStore?.documentDetails?.next_review_user_level)
            className = className + ' ' + 'approved active'
          else
            className = className + ' ' + 'approved '
          break;
        case 4:
          if (workflow.level == DocumentsStore?.documentDetails?.next_review_user_level)
            className = className + ' ' + 'rejected active'
          else
            className = className + ' ' + 'rejected '
          break;
        case 1:
          if (workflow.level == DocumentsStore?.documentDetails?.next_review_user_level)
            className = className + ' ' + 'pending active'
          else
            className = className + ' ' + 'pending'
          break;
        case 3:
          if (workflow.level == DocumentsStore?.documentDetails?.next_review_user_level)
            className = className + ' ' + 'reverted active'
          else
            className = className + ' ' + 'reverted'
          break;
        default:
          break;
      }
    }

    // this.checkAllignment(workflow)

    return className



  }

  getCreatedByPopupDetails(users) {
    let userDetails: any = {};

    userDetails['first_name'] = users?.first_name;
    userDetails['last_name'] = users?.last_name;
    userDetails['designation'] = users?.designation;
    userDetails['image_token'] = users?.image?.token;
    userDetails['email'] = users?.email;
    userDetails['mobile'] = users?.mobile;
    userDetails['id'] = users?.id;
    userDetails['department'] = users?.department;
    userDetails['status_id'] = users?.status?.id;
    userDetails['created_at'] = null;
    return userDetails;

  }


  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type, token, h, w);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  openPopupSection(id: number, level: number, type: boolean) {
    let levelId;
    if (type) {
      levelId = level + 1;
    } else {
      levelId = level;
    }
    this.workFlowSourceData.type = "Add"
    this.workFlowSourceData.values = {
      documentId: DocumentsStore.documentId,
      level: levelId,
      itemId: id,
      module: 'KH',
      moduleGroupId: 3200
    }
    $(this.workFlowEditModal.nativeElement).modal('show');
  }

  deleteWorkflowSections(id: number, level) {
    event.stopPropagation();
    this.deleteObject.type = '';
    this.deleteObject.id = id;
    this.deleteObject.title = 'Remove Level?';
    this.deleteObject.subtitle = 'Are you sure you want to remove the level ' + level + ' from the Workflow?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.deleteWorkflow(status);
        break;
      case 'Delete': this.deleteUser(status);
        break;
      default:
        break;
    }
  }

  deleteWorkflow(status: boolean) {
    if (status && this.deleteObject.id) {
      this._workFlowService.deleteWorkflowLevel(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this.getDocumentWorkflow()
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  deleteUser(status) {
    if (status && this.deleteObject.id) {
      this._workFlowService.deleteUser(this.deleteObject.id, this.deleteObject.userId).subscribe(res => {
        setTimeout(() => {
          this.getDocumentWorkflow()
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  deleteParticularUser(id, user) {
    this.deleteObject.type = 'Delete';
    this.deleteObject.userId = user.id;
    this.deleteObject.id = id;
    this.deleteObject.title = 'Remove User?';
    this.deleteObject.subtitle = 'Are you sure you want to remove the user from the Workflow?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  closeFormModal() {
    ($(this.workFlowEditModal.nativeElement) as any).modal('hide');
    this.workFlowSourceData.type = null;
  }

  closeHistory() {
    this._eventEmitterService.dismissDocumentWorkflowPopup();
  }

  ngOnDestroy() {
    this.workFlowEditModalSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
  }

}
