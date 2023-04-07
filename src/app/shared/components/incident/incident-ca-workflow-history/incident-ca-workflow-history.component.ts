import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentCaWorkflowService } from 'src/app/core/services/incident-management/incident-ca-workflow/incident-ca-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentCaWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-ca-workflow.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-incident-ca-workflow-history',
  templateUrl: './incident-ca-workflow-history.component.html',
  styleUrls: ['./incident-ca-workflow-history.component.scss']
})
export class IncidentCaWorkflowHistoryComponent implements OnInit {

  IncidentCorrectiveActionStore = IncidentCorrectiveActionStore
  IncidentCaWorkflowStore = IncidentCaWorkflowStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _cdr:ChangeDetectorRef,
    private _incidentCaWorkflowService:IncidentCaWorkflowService) { }

    ngOnInit(): void {
      this.pageChange()
    }
  
    pageChange(newPage: number = null) {
      if (newPage) IncidentCaWorkflowStore.setCurrentPage(newPage);
      this._incidentCaWorkflowService.getHistory(IncidentCorrectiveActionStore.selectedId).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
  
    }
  
    closeWorkflowHistory(){
      this._eventEmitterService.dismissCaHistoryModal();
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
    }

}
