import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RiskJourneyWorkflowService } from 'src/app/core/services/risk-management/risks/risk-journey-workflow/risk-journey-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskJourneyWorkflowStore } from 'src/app/stores/risk-management/risks/risk-journey-workflow.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-risk-journey-workflow-history',
  templateUrl: './risk-journey-workflow-history.component.html',
  styleUrls: ['./risk-journey-workflow-history.component.scss']
})
export class RiskJourneyWorkflowHistoryComponent implements OnInit {
  RiskJourneyWorkflowStore = RiskJourneyWorkflowStore;
  RisksStore = RisksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _riskJourneyWorkflowService:RiskJourneyWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) RiskJourneyWorkflowStore.setCurrentPage(newPage);
    this._riskJourneyWorkflowService.getHistory(RisksStore.riskId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissRiskJourneyHistoryModal();
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