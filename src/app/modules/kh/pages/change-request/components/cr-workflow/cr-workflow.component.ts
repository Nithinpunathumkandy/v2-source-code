import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ChangeRequestWorkflowService } from 'src/app/core/services/knowledge-hub/change-request/change-request-workflow.service';

@Component({
  selector: 'app-cr-workflow',
  templateUrl: './cr-workflow.component.html',
  styleUrls: ['./cr-workflow.component.scss']
})
export class CrWorkflowComponent implements OnInit , OnDestroy {

  changeRequestStore = changeRequestStore;
  emptyHistoy="empty_workflow_title"

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _changeRequestWorkflowService: ChangeRequestWorkflowService,
  ) { }

  ngOnInit(): void {
    this.getDocumentWorkflow()
  }

  getDocumentWorkflow() {
    this._changeRequestWorkflowService.getWorkflowNew(changeRequestStore.documentId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.
    if (!workflow.workflow_status) {
      if (workflow.level == changeRequestStore.requestDetails.next_review_user_level)
        className = className + ' ' + 'pending active'
      else
        className = className + ' ' + 'pending'
    }
    else {
      switch (workflow.workflow_status?.id) {
        case 5:
          if (workflow.level == changeRequestStore.requestDetails.next_review_user_level)
            className = className + ' ' + 'approved active'
          else
            className = className + ' ' + 'approved '
          break;

        case 4:
          if (workflow.level == changeRequestStore.requestDetails.next_review_user_level)
            className = className + ' ' + 'rejected active'
          else
            className = className + ' ' + 'rejected '
          break;

        case 1:
          if (workflow.level == changeRequestStore.requestDetails.next_review_user_level)
            className = className + ' ' + 'pending active'
          else
            className = className + ' ' + 'pending'
          break;

        case 3:
          if (workflow.level == changeRequestStore.requestDetails.next_review_user_level)
            className = className + ' ' + 'reverted active'
          else
            className = className + ' ' + 'reverted'
          break;

        default:
          break;
      }
    }
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

  closeHistory() {
    this._eventEmitterService.dismissCRWorkflow();
  }

  createImageUrl(type, token, h?, w?) {
    return this._documentFileService.getThumbnailPreview(type, token, h, w);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    changeRequestStore.unsetChangeRequestWorkflow()
  }

}
