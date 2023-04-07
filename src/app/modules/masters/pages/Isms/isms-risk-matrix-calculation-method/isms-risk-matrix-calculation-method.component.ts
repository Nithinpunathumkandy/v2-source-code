import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsRiskMatrixCalculationMethodService } from 'src/app/core/services/masters/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IsmsRiskMatrixCalculationMethodMasterStore } from 'src/app/stores/masters/Isms/isms-risk-matrix-calculation-method-master-store';

declare var $: any;
@Component({
  selector: 'app-isms-risk-matrix-calculation-method',
  templateUrl: './isms-risk-matrix-calculation-method.component.html',
  styleUrls: ['./isms-risk-matrix-calculation-method.component.scss']
})
export class IsmsRiskMatrixCalculationMethodComponent implements OnInit, OnDestroy {

  IsmsRiskMatrixCalculationMethodMasterStore = IsmsRiskMatrixCalculationMethodMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;


  constructor(
    private _utilityService: UtilityService,
    private _ismsRiskMatrixCalculationMethodService: IsmsRiskMatrixCalculationMethodService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'ISMS_RISK_MATRIX_CALCULATION_METHOD_LIST', submenuItem: { type: 'search' } },

        { activityName: 'EXPORT_ISMS_RISK_MATRIX_CALCULATION_METHOD', submenuItem: { type: 'export_to_excel' } },

        { activityName: null, submenuItem: { type: 'close', path: 'isms' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);



      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "export_to_excel":
            this._ismsRiskMatrixCalculationMethodService.exportToExcel();
            break;
          case "search":
            IsmsRiskMatrixCalculationMethodMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;

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
    if (newPage) IsmsRiskMatrixCalculationMethodMasterStore.setCurrentPage(newPage);
    this._ismsRiskMatrixCalculationMethodService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }




  // for sorting
  sortTitle(type: string) {

    this._ismsRiskMatrixCalculationMethodService.sortIsmsRiskMatrixCalculationMethodList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();

    IsmsRiskMatrixCalculationMethodMasterStore.searchText = '';
    IsmsRiskMatrixCalculationMethodMasterStore.currentPage = 1 ;

  }
}
