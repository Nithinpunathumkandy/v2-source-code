import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BcsFinancesService } from 'src/app/core/services/masters/bcm/bcs-finances/bcs-finances.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcsFinanceMasterStore } from 'src/app/stores/masters/bcm/bcs-finances-store';

@Component({
  selector: 'app-bcs-finances',
  templateUrl: './bcs-finances.component.html',
  styleUrls: ['./bcs-finances.component.scss']
})
export class BcsFinancesComponent implements OnInit {

  BcsFinanceMasterStore = BcsFinanceMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(
    private _bcsFinancesService: BcsFinancesService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_CONTINUITY_STRATEGY_FINANCE_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_BUSINESS_CONTINUITY_STRATEGY_FINANCE', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._bcsFinancesService.exportToExcel();
            break;
          case "search":
            BcsFinanceMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // BcsFinanceMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
 pageChange(newPage: number = null) {
    if (newPage) BcsFinanceMasterStore.setCurrentPage(newPage);
    this._bcsFinancesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._bcsFinancesService.sortBcsStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BcsFinanceMasterStore.searchText = '';
    BcsFinanceMasterStore.currentPage = 1 ;
    }

}
