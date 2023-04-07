import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuditPlanWorkflowService } from 'src/app/core/services/ms-audit-management/audit-plan-workflow/audit-plan-workflow.service';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { AuditFollowUpStore } from 'src/app/stores/ms-audit-management/follow-up/audit-follow-up.store';

@Component({
  selector: 'app-corrective-action-history',
  templateUrl: './corrective-action-history.component.html',
  styleUrls: ['./corrective-action-history.component.scss']
})
export class CorrectiveActionHistoryComponent implements OnInit {
  @Input('source') caSource : any;

  AuditFollowUpStore = AuditFollowUpStore;
  AuditPlanWorkflowStore = AuditPlanWorkflowStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"

  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _followUpService : FollowUpService) { }

  ngOnInit(): void {
     this.pageChange()
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanWorkflowStore.currentPage = newPage;
    this._followUpService.caHistory(this.caSource.id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissInfoHistoryModal();
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

 
  checkStatus(workflow) {
    var className = 'work-flow-review-approval work-flow-approval work-flow-audit-new box-shadow-none'
    // *Checking and setting class name based on document status type.

    if(workflow.workflow_status_id==null){
      className=className+' '+'approved';
    }
    
    switch (workflow.workflow_status_id) {

      case 5:
        
          className = className+' '+'approved '
        
        break;
      
      case 4:
        
          className = className+' '+'rejected '
        
        break;
      
      case 1: 
        
          className = className+' '+'pending'
        
        break;
       
        case 3: 
        
        className = className+' '+'reverted'
      
        break;
      
      default:
        break;
      }
    


    return className

    

  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  ngOnDestroy() {
    // documentWorkFlowStore.unsetWorkflowHistory();
    AuditFollowUpStore.unsetMsAuditCorrectiveActionHistory()
  }

}
