import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BiaWorkflowService } from 'src/app/core/services/bcm/bia/bia-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaWorkflowStore } from 'src/app/stores/bcm/bia/bia-workflow.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-bia-workflow-history',
  templateUrl: './bia-workflow-history.component.html'
})
export class BiaWorkflowHistoryComponent implements OnInit {

  BiaWorkflowStore = BiaWorkflowStore;
  BiaStore = BiaStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  historyEmptyList = "workflow_history_empty_title"

  constructor(private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _biaWorkflowService:BiaWorkflowService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.pageChange()
  }

  pageChange(newPage: number = null) {
    if (newPage) BiaWorkflowStore.setCurrentPage(newPage);
    this._biaWorkflowService.getHistory(BiaStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });

  }

  closeWorkflowHistory(){
    this._eventEmitterService.dismissBiaHistoryModal();
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
