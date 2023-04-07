import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-strategy-activity-history-popup',
  templateUrl: './strategy-activity-history-popup.component.html',
  styleUrls: ['./strategy-activity-history-popup.component.scss']
})
export class StrategyActivityHistoryPopupComponent implements OnInit {

  @Input('source') activityHisyorySource: any; 

  historyEmptyList = "common_nodata_title";
  StrategyStore = StrategyStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  constructor(private _strategyService : StrategyService,private _eventEmitterService:EventEmitterService,
    private _humanCapitalService:HumanCapitalService,private _imageService:ImageServiceService,
    private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.pageChange(1)
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategyStore.setHistoryCurrentPage(newPage);
    // if (this.activityHisyorySource.type == 'Profile') {
    //   this._strategyService.getProfileActivityHistory(this.activityHisyorySource.id).subscribe(res => {
    //     this._utilityService.detectChanges(this._cdr);
    //   })
    // }
    switch (this.activityHisyorySource.type) {
      case "Profile":
        this._strategyService.getProfileActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      case "Focus Area":
        this._strategyService.getFocusAreaActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      case "Objective":
        this._strategyService.getObjectiveActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
        break;
      case "KPI":
        this._strategyService.getKPIActivityHistory(this.activityHisyorySource.id).subscribe(() => this._utilityService.detectChanges(this._cdr));
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
    this._eventEmitterService.dismissProfileHistoryControlModal();
  }
}
