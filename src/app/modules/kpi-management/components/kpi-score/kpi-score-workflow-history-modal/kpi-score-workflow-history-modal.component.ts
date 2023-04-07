import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { KpiScoreService } from 'src/app/core/services/kpi-management/kpi-score/kpi-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-kpi-score-workflow-history-modal',
  templateUrl: './kpi-score-workflow-history-modal.component.html',
  styleUrls: ['./kpi-score-workflow-history-modal.component.scss']
})
export class KpiScoreWorkflowHistoryModalComponent implements OnInit {

  KpiScoreStore = KpiScoreStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  historyEmptyList = "workflow_history_empty_title";

  constructor(
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _kpiScoreService: KpiScoreService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,
    ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) KpiScoreStore.setCurrentPage(newPage);
    this._kpiScoreService.getHistory(KpiScoreStore.kpiScoreId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
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

  closeWorkflowHistoryModal(){
    this._eventEmitterService.dismisskpiWorkflowHistoryModal();
  }

}
