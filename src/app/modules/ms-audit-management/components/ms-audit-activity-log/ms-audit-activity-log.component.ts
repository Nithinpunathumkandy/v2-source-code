import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MsAuditPlanActivityLogService } from 'src/app/core/services/ms-audit-management/audit-plan-activity-log/ms-audit-plan-activity-log.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditPlanActivityLogsStore } from 'src/app/stores/ms-audit-management/audit-plan-activity-log/activity-log';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';


@Component({
  selector: 'app-ms-audit-activity-log',
  templateUrl: './ms-audit-activity-log.component.html',
  styleUrls: ['./ms-audit-activity-log.component.scss']
})
export class MsAuditActivityLogComponent implements OnInit {

  AppStore= AppStore;
  AuditPlanActivityLogsStore = AuditPlanActivityLogsStore;
  OrganizationGeneralSettingsStore= OrganizationGeneralSettingsStore;
  

  emptyActivityLog = "audit_activity_logs_empty";

  constructor(
    private _datepipe: DatePipe,
    private _cdr:ChangeDetectorRef,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _activityLogsService: MsAuditPlanActivityLogService,
    private _humanCapitalService: HumanCapitalService,
  ) { }

  ngOnInit(): void {
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditPlanActivityLogsStore.setCurrentPage(newPage);
    this._activityLogsService.getItemsAuditActivityLog(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  cancel() {
    this._eventEmitterService.dismissAuditActivityLogsModal();
  }

  activityType(type){
    return ['REJECT','APPROVE','REVERT','SUBMIT','UPDATE','CREATE','PUBLISH'].includes(type);
  }

  dateToOrgnatiztionConvert(row){
    if(Date.parse(row))
      return this._datepipe.transform(row, OrganizationGeneralSettingsStore?.organizationSettings?.date_format); 
    else
      return row;
  }

  ngOnDestroy(){
    AuditPlanActivityLogsStore.unSetActivityLogs();
  }

}
