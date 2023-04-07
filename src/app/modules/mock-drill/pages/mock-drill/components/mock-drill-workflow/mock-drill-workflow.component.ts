import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';

@Component({
  selector: 'app-mock-drill-workflow',
  templateUrl: './mock-drill-workflow.component.html',
  styleUrls: ['./mock-drill-workflow.component.scss']
})
export class MockDrillWorkflowComponent implements OnInit {

  MockDrillStore = MockDrillStore

  constructor(
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {
  }

  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if (!workflow.workflow_status) {

      if (workflow.level == MockDrillStore.selected?.next_review_user_level)
        className = className + ' ' + 'pending active'
      else
        className = className + ' ' + 'pending'
    }
    else {
      switch (workflow.workflow_status?.id) {

        case 5:
          if (workflow.level == MockDrillStore.selected?.next_review_user_level)
            className = className + ' ' + 'approved active'
          else
            className = className + ' ' + 'approved '
          break;

        case 4:
          if (workflow.level == MockDrillStore.selected?.next_review_user_level)
            className = className + ' ' + 'rejected active'
          else
            className = className + ' ' + 'rejected '
          break;

        case 1:
          if (workflow.level == MockDrillStore.selected?.next_review_user_level)
            className = className + ' ' + 'pending active'
          else
            className = className + ' ' + 'pending'
          break;

        case 3:
          if (workflow.level == MockDrillStore.selected?.next_review_user_level)
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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  closeWorkflowModal() {
    this._eventEmitterService.dismissRiskInfoWorkflowModal();
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  isUser() {
    for (let i of MockDrillStore?.workflowDetails) {
      if (i.level == MockDrillStore.selected.next_review_user_level) {
        var pos = i.risk_workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
        if (pos != -1)
          return true;
        else
          return false
      }
    }
  }

}
