import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IsmsRiskJourneyWorkflowService } from 'src/app/core/services/isms/isms-risks/isms-risk-journey-workflow/isms-risk-journey-workflow.service';
// import { RiskJourneyWorkflowService } from 'src/app/core/services/risk-management/risks/risk-journey-workflow/risk-journey-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskJourneyWorkflowStore } from 'src/app/stores/isms/isms-risks/risk-journey-workflow.store';
// import { IsmsRiskJourneyWorkflowStore } from 'src/app/stores/risk-management/risks/risk-journey-workflow.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


@Component({
  selector: 'app-isms-risk-journey-workflow-history',
  templateUrl: './isms-risk-journey-workflow-history.component.html',
  styleUrls: ['./isms-risk-journey-workflow-history.component.scss']
})
export class IsmsRiskJourneyWorkflowHistoryComponent implements OnInit {
  IsmsRiskJourneyWorkflowStore = IsmsRiskJourneyWorkflowStore;
  RisksStore = RisksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _riskJourneyWorkflowService:IsmsRiskJourneyWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) IsmsRiskJourneyWorkflowStore.setCurrentPage(newPage);
    this._riskJourneyWorkflowService.getHistory(RisksStore.riskId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissIsmsRiskJourneyHistoryModal();
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
