import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiCalculationTypesService } from 'src/app/core/services/masters/strategy/kpi-calculation-types/kpi-calculation-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiCalculationTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-calculation-type.store';

@Component({
  selector: 'app-kpi-calculation-types',
  templateUrl: './kpi-calculation-types.component.html',
  styleUrls: ['./kpi-calculation-types.component.scss']
})
export class KpiCalculationTypesComponent implements OnInit {

  KpiCalculationTypesMasterStore = KpiCalculationTypesMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _kpiCalculationTypesService: KpiCalculationTypesService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'KPI_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_KPI_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'strategy-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
             
              case "export_to_excel":
                this._kpiCalculationTypesService.exportToExcel();
                break;
                case "search":
                  KpiCalculationTypesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                   break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
         
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })

    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) KpiCalculationTypesMasterStore.setCurrentPage(newPage);
    this._kpiCalculationTypesService.getItems(false,null,true).subscribe(() => setTimeout(() => 
    this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._kpiCalculationTypesService.sortKpiCalculationTypesList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    KpiCalculationTypesMasterStore.searchText = '';
    KpiCalculationTypesMasterStore.currentPage = 1 ;
  }
}
