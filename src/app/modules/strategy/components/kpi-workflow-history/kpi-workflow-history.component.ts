import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ProjectChangeRequestWorkflowService } from 'src/app/core/services/project-monitoring/project-monitoring/project-change-request-workflow-service/project-change-request-workflow.service';
import { KpiWorkflowService } from 'src/app/core/services/strategy-management/kpi-workflow/kpi-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { KpiWorkflowStore } from 'src/app/stores/strategy-management/kpi-workflow.store';

@Component({
  selector: 'app-kpi-workflow-history',
  templateUrl: './kpi-workflow-history.component.html',
  styleUrls: ['./kpi-workflow-history.component.scss']
})
export class KpiWorkflowHistoryComponent implements OnInit {
  KpiWorkflowStore = KpiWorkflowStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"
  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _utilityService:UtilityService,
    private _kpiWorkflowService : KpiWorkflowService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    // this.pageChange(1)
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiWorkflowStore.setCurrentPage(newPage);
    this._kpiWorkflowService.getHistory(KpiWorkflowStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissKPIWorkflowHistoryModal();
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
