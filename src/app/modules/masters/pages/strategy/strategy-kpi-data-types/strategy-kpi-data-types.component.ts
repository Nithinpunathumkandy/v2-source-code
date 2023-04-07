import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { StrategyKpiDataTypesMasterStore } from 'src/app/stores/masters/strategy/strategy-kpi-data-types-store';
import { StrategyKpiDataTypesService } from 'src/app/core/services/masters/strategy/strategy-kpi-data-types/strategy-kpi-data-types.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-strategy-kpi-data-types',
  templateUrl: './strategy-kpi-data-types.component.html',
  styleUrls: ['./strategy-kpi-data-types.component.scss']
})
export class StrategyKpiDataTypeComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  StrategyKpiDataTypesMasterStore = StrategyKpiDataTypesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_strategy_kpi_data_types_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _strategyKpiDataTypesService: StrategyKpiDataTypesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof StrategyKpiDataTypeComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STRATEGY_KPI_DATA_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_STRATEGY_KPI_DATA_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'strategy-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
    
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
             
              case "export_to_excel":
                this._strategyKpiDataTypesService.exportToExcel();
                break;
                case "search":
                  StrategyKpiDataTypesMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) StrategyKpiDataTypesMasterStore.setCurrentPage(newPage);
    this._strategyKpiDataTypesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }


  sortTitle(type: string) {
    this._strategyKpiDataTypesService.sortKpiTypesList(type, null);
    this.pageChange();
  }

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof StrategyKpiDataTypeComponent
   */
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    StrategyKpiDataTypesMasterStore.searchText = '';
    StrategyKpiDataTypesMasterStore.currentPage = 1 ;
  }

}