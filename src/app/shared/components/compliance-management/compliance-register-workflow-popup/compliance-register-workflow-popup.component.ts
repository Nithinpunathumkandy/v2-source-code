import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { ComplianceRegisterWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/compliance-register-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-compliance-register-workflow-popup',
  templateUrl: './compliance-register-workflow-popup.component.html',
  styleUrls: ['./compliance-register-workflow-popup.component.scss']
})
export class ComplianceRegisterWorkflowPopupComponent implements OnInit {

  ComplianceRegisterWorkflowStore = ComplianceRegisterWorkflowStore;
  ComplianceRegisterStore = ComplianceRegisterStore;
  AuthStore = AuthStore;
  workflowCommentEventSubscription:any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  WorkflowEmptyMessage = "empty_workflow_title"
  emptyMessage = "no_data_found";

  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  isUser(){
    for(let i of ComplianceRegisterWorkflowStore?.workflowDetails){
      if(i.level==ComplianceRegisterStore.ComplianceRegisterDetailsList.next_review_user_level){
       var pos=i.compliance_workflow_item_users.findIndex(e=>e.id==AuthStore.user.id)
       if(pos!=-1)
         return true;
       else
        return false
      }
    }
  }
   checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if (!workflow.workflow_status) {
      
      if (workflow.level == IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
      className = className+' '+'pending active'
    else
      className = className+' '+'pending'
    }
    else {
      
    
    switch (workflow.workflow_status?.id) {

      case 5:
        
        if (workflow.level == IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
          className = className+' '+'approved active'
        else
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          if (workflow.level == IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
          className = className+' '+'rejected active'
        else
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          if (workflow.level == IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
          className = className+' '+'pending active'
        else
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        if (workflow.level == IncidentInvestigationStore.individualInvestigationItem?.next_review_user_level)
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
    this._eventEmitterService.dismissIncidentInvestigationWorkflowModal();
  }

}
