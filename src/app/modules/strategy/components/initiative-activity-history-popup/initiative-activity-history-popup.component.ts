import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';

@Component({
  selector: 'app-initiative-activity-history-popup',
  templateUrl: './initiative-activity-history-popup.component.html',
  styleUrls: ['./initiative-activity-history-popup.component.scss']
})
export class InitiativeActivityHistoryPopupComponent implements OnInit {
  @Input('source') activityHisyorySource: any; 

  historyEmptyList = "common_nodata_title";
  StrategyInitiativeStore = StrategyInitiativeStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _intiativeService : InitiativeService,private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,private _imageService:ImageServiceService,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.pageChange(1)
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategyInitiativeStore.setHistoryCurrentPage(newPage);
    switch (this.activityHisyorySource.type) {
      case "Initiative":
        this._intiativeService.getInitiativeActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      case "Milestone":
        this._intiativeService.getMilestoneActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      case "Action Plan":
        this._intiativeService.getActionPlanActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      default:
        break;
    }
  }

  createImageUrl(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type,token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeHistoryModal(){
    this._eventEmitterService.dismissInitiativeHistoryControlModal();
  }

}
