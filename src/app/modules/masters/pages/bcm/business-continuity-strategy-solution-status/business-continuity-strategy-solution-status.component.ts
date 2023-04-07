import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessContinuityStrategySolutionStatusService } from 'src/app/core/services/masters/bcm/business-continuity-strategy-solution-status/business-continuity-strategy-solution-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BusinessContinuityStrategySolutionStatusMasterStore } from 'src/app/stores/masters/bcm/business-continuity-strategy-solution-status-store';

@Component({
  selector: 'app-business-continuity-strategy-solution-status',
  templateUrl: './business-continuity-strategy-solution-status.component.html',
  styleUrls: ['./business-continuity-strategy-solution-status.component.scss']
})
export class BusinessContinuityStrategySolutionStatusComponent implements OnInit {

  BusinessContinuityStrategySolutionStatusMasterStore = BusinessContinuityStrategySolutionStatusMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(
    private _bcssStatusService: BusinessContinuityStrategySolutionStatusService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_CONTINUITY_STRATEGY_SOLUTION_STATUS_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_BUSINESS_CONTINUITY_STRATEGY_SOLUTION_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._bcssStatusService.exportToExcel();
            break;
          case "search":
            BusinessContinuityStrategySolutionStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // BusinessContinuityStrategySolutionStatusMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
 pageChange(newPage: number = null) {
    if (newPage) BusinessContinuityStrategySolutionStatusMasterStore.setCurrentPage(newPage);
    this._bcssStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._bcssStatusService.sortBusinessContinuityStrategySolutionStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BusinessContinuityStrategySolutionStatusMasterStore.searchText = '';
    BusinessContinuityStrategySolutionStatusMasterStore.currentPage = 1 ;
    }

}
