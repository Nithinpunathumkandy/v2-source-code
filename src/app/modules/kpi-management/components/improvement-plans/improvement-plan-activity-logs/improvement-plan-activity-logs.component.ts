import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ActivityLogsService } from 'src/app/core/services/kpi-management/improvement-plans/activity-logs/activity-logs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ImprovementActivityLogsStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-activity-logs-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-improvement-plan-activity-logs',
  templateUrl: './improvement-plan-activity-logs.component.html',
  styleUrls: ['./improvement-plan-activity-logs.component.scss'],
  providers: [DatePipe]
})
export class ImprovementPlanActivityLogsComponent implements OnInit, OnDestroy {

  AppStore= AppStore;
  ImprovementActivityLogsStore = ImprovementActivityLogsStore;
  OrganizationGeneralSettingsStore= OrganizationGeneralSettingsStore;

  emptyActivityLog = "kpi_activity_logs_empty";

  constructor(
    private _datepipe: DatePipe,
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _activityLogsService: ActivityLogsService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ImprovementActivityLogsStore.setCurrentPage(newPage);
    this._activityLogsService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  cancel() {
    this._eventEmitterService.dismisskpiActivityLogsModal();
  }

  dateToOrgnatiztionConvert(row){
    if(Date.parse(row))
      return this._datepipe.transform(row, OrganizationGeneralSettingsStore?.organizationSettings?.date_format); 
    else
      return row;
  }

  ngOnDestroy(){
    ImprovementActivityLogsStore.unSetActivityLogs();
  }

}
