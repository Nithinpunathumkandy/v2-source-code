import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventChangeRequestWorkflowStore } from 'src/app/stores/event-monitoring/events/event-cr-workflow-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-event-workflow-popup',
  templateUrl: './event-workflow-popup.component.html',
  styleUrls: ['./event-workflow-popup.component.scss']
})
export class EventWorkflowPopupComponent implements OnInit {

  EventWorkflowStore = EventWorkflowStore;
  EventChangeRequestWorkflowStore = EventChangeRequestWorkflowStore;
  EventChangeRequestStore = EventChangeRequestStore;
  EventsStore = EventsStore;
  AuthStore = AuthStore;
  workflowCommentEventSubscription:any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  WorkflowEmptyMessage = "empty_workflow_title"
  emptyMessage = "no_data_found";

  constructor(
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService, private _router: Router
  ) { }

  ngOnInit(): void {
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  isUser(){
    let urlItem = this.checkUrl();
    let workflowDetails = EventWorkflowStore?.workflowDetails;
    if(urlItem == 'cr') workflowDetails = EventChangeRequestWorkflowStore.eventChangeRequestWorkflow;
    let itemDetails:any = EventsStore.eventDetails;
    if(urlItem == 'cr') itemDetails = EventChangeRequestStore.individualChangeRequestItem;
    for(let i of workflowDetails){
      if(i.level==itemDetails.next_review_user_level){
       var pos=i.user.findIndex(e=>e.id==AuthStore.user.id)
       if(pos!=-1)
         return true;
       else
        return false
      }
    }
  }
   checkStatus(workflow) {
    let urlItem = this.checkUrl();
    let itemDetails:any = EventsStore.eventDetails;
    if(urlItem == 'cr') itemDetails = EventChangeRequestStore.individualChangeRequestItem;
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if (!workflow.workflow_status) {
      
      if (workflow.level == itemDetails?.next_review_user_level)
      className = className+' '+'pending active'
    else
      className = className+' '+'pending'
    }
    else {
      
    
    switch (workflow.workflow_status?.id) {

      case 5:
        
        if (workflow.level == itemDetails?.next_review_user_level)
          className = className+' '+'approved active'
        else
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          if (workflow.level == itemDetails?.next_review_user_level)
          className = className+' '+'rejected active'
        else
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          if (workflow.level == itemDetails?.next_review_user_level)
          className = className+' '+'pending active'
        else
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        if (workflow.level == itemDetails?.next_review_user_level)
        className = className+' '+'reverted active'
      else
        className = className+' '+'reverted'
      
        break;
      
      default:
        break;
      }
    }
    return className
  }
  
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  closeWorkflowModal(){
    this._eventEmitterService.dismissEventWorkflowModal();
  }

  checkUrl(){
    let url = this._router.url;
    if(url.indexOf('change-request') != -1){
      return 'cr'
    }else{
      return 'event'
    }
  }
  

}
