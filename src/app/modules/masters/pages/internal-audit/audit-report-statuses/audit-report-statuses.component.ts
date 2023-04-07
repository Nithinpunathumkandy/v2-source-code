import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditReportStatusesService } from 'src/app/core/services/masters/internal-audit/audit-report-statuses/audit-report-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditReportStatusMasterStore } from 'src/app/stores/masters/internal-audit/audit-report-statuses-store';

@Component({
  selector: 'app-audit-report-statuses',
  templateUrl: './audit-report-statuses.component.html',
  styleUrls: ['./audit-report-statuses.component.scss']
})
export class AuditReportStatusesComponent implements OnInit , OnDestroy{
  AuditReportStatusStore = AuditReportStatusMasterStore;
  reactionDisposer: IReactionDisposer;

  constructor(private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _auditReportStatusService: AuditReportStatusesService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {


      var subMenuItems = [
        {activityName: 'AUDIT_REPORT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: {type: 'close', path:'internal-audit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                 
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            AuditReportStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) AuditReportStatusMasterStore.setCurrentPage(newPage);
    this._auditReportStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
   // for sorting
   sortTitle(type: string) {
    // AuditObjectiveMasterStore.setCurrentPage(1);
    this._auditReportStatusService.sortAuditReportStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditReportStatusMasterStore.searchText = '';
    AuditReportStatusMasterStore.currentPage = 1 ;
  }
}
