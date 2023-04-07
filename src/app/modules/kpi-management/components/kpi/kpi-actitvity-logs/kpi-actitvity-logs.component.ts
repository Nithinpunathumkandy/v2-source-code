
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ActivityLogsService } from 'src/app/core/services/kpi-management/kpi/activity-logs/activity-logs.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { KpiActivityLogsStore } from 'src/app/stores/kpi-management/kpi/kpi-activity-logs-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-kpi-actitvity-logs',
  templateUrl: './kpi-actitvity-logs.component.html',
  styleUrls: ['./kpi-actitvity-logs.component.scss'],
  providers: [DatePipe]
})
export class KpiActitvityLogsComponent implements OnInit {

  AppStore =AppStore;
  KpisStore = KpisStore;
  KpiActivityLogsStore = KpiActivityLogsStore;
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
    if (newPage) KpiActivityLogsStore.setCurrentPage(newPage);
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
    KpiActivityLogsStore.unSetActivityLogs();
  }

}
