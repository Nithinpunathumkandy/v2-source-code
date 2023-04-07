import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BcsStatusService } from 'src/app/core/services/masters/bcm/bcs-status/bcs-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcsStatusMasterStore } from 'src/app/stores/masters/bcm/bcs-status-store';

@Component({
  selector: 'app-bcs-status',
  templateUrl: './bcs-status.component.html',
  styleUrls: ['./bcs-status.component.scss']
})
export class BcsStatusComponent implements OnInit {

  BcsStatusMasterStore = BcsStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(
    private _bcsStatusService: BcsStatusService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_CONTINUITY_STRATEGY_STATUS_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_BUSINESS_CONTINUITY_STRATEGY_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._bcsStatusService.exportToExcel();
            break;
          case "search":
            BcsStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // BcsStatusMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
 pageChange(newPage: number = null) {
    if (newPage) BcsStatusMasterStore.setCurrentPage(newPage);
    this._bcsStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._bcsStatusService.sortBcsStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BcsStatusMasterStore.searchText = '';
    BcsStatusMasterStore.currentPage = 1 ;
    }
}
