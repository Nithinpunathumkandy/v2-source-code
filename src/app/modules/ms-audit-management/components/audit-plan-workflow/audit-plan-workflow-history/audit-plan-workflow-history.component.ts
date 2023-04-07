import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuditPlanWorkflowService } from 'src/app/core/services/ms-audit-management/audit-plan-workflow/audit-plan-workflow.service';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';

@Component({
  selector: 'app-ms-audit-plan-workflow-history',
  templateUrl: './audit-plan-workflow-history.component.html',
  styleUrls: ['./audit-plan-workflow-history.component.scss']
})
export class AuditPlanWorkflowHistoryComponent implements OnInit {
  MsAuditPlansStore = MsAuditPlansStore;
  AuditPlanWorkflowStore = AuditPlanWorkflowStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"

  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private __auditPlanWorkflowService : AuditPlanWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    // this.pageChange()
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanWorkflowStore.currentPage = newPage;
    this.__auditPlanWorkflowService.getHistory(MsAuditPlansStore.msAuditPlansId).subscribe(res=>{
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
        
        className = className+' '+'reverted';
        break;

        case 2: 
        
        className = className+' '+'submitted'
      
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
  }

}
