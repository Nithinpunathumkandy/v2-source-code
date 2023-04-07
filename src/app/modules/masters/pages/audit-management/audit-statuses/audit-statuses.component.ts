import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditStatusesService } from 'src/app/core/services/masters/audit-management/audit-statuses/audit-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditStatusesMasterStore } from 'src/app/stores/masters/audit-management/audit-statuses-store';

declare var $: any;
@Component({
  selector: 'app-audit-statuses',
  templateUrl: './audit-statuses.component.html',
  styleUrls: ['./audit-statuses.component.scss']
})
export class AuditStatusesComponent implements OnInit {
  
  reactionDisposer: IReactionDisposer;
      
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  AuditStatusesMasterStore = AuditStatusesMasterStore;
  
  constructor(    
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _auditStatusesService: AuditStatusesService,    
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'AM_AUDIT_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_AM_AUDIT_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'audit-management' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._auditStatusesService.exportToExcel();
            break;
          case "search":
            AuditStatusesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {

        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    // for deleting/activating/deactivating using delete modal   

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) AuditStatusesMasterStore.setCurrentPage(newPage);
    this._auditStatusesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._auditStatusesService.sortAuditStatusesList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditStatusesMasterStore.searchText = '';
    AuditStatusesMasterStore.currentPage = 1;    
  }

}
