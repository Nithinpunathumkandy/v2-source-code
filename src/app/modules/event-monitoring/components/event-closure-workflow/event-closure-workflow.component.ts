import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { EventClosureMainStore } from 'src/app/stores/event-monitoring/event-closure-main-store';
import { EventClosureEventDetailsService } from 'src/app/core/services/event-monitoring/event-closure-event-details/event-closure-event-details.service';

@Component({
  selector: 'app-event-closure-workflow',
  templateUrl: './event-closure-workflow.component.html',
  styleUrls: ['./event-closure-workflow.component.scss']
})
export class EventClosureWorkflowComponent implements OnInit {  
  EventClosureMainStore = EventClosureMainStore  
  EventsStore = EventsStore;
  AuthStore = AuthStore;
  workflowCommentEventSubscription:any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  WorkflowEmptyMessage = "empty_workflow_title"
  emptyMessage = "no_data_found";

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _eventClosureEventDetailsService: EventClosureEventDetailsService,
  ) { }

  ngOnInit(): void {
    this.getDocumentWorkflow()
  }

  getDocumentWorkflow() {
    this._eventClosureEventDetailsService.getWorkflow(EventClosureMainStore.closureId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.
    if (!workflow.workflow_status) {
      if (workflow.level == EventClosureMainStore.indivitualEventClosure?.next_review_user_level)
        className = className + ' ' + 'pending active'
      else
        className = className + ' ' + 'pending'
    }
    else {
      switch (workflow.workflow_status?.id) {
        case 5:
          if (workflow.level == EventClosureMainStore.indivitualEventClosure?.next_review_user_level)
            className = className + ' ' + 'approved active'
          else
            className = className + ' ' + 'approved '
          break;

        case 4:
          if (workflow.level == EventClosureMainStore.indivitualEventClosure?.next_review_user_level)
            className = className + ' ' + 'rejected active'
          else
            className = className + ' ' + 'rejected '
          break;

        case 1:
          if (workflow.level == EventClosureMainStore.indivitualEventClosure?.next_review_user_level)
            className = className + ' ' + 'pending active'
          else
            className = className + ' ' + 'pending'
          break;

        case 3:
          if (workflow.level == EventClosureMainStore.indivitualEventClosure?.next_review_user_level)
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
    this._eventEmitterService.dismissClosureWorkflow();
  }

  createImageUrl(type, token, h?, w?) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    EventClosureMainStore.unsetEventClosureWorkflow()
  }

}
