import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessImpactAnalysisStatusesService } from 'src/app/core/services/masters/bcm/business-impact-analysis-statuses/business-impact-analysis-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BusinessImpactAnalysisStatusesMasterStore } from 'src/app/stores/masters/bcm/businesss-impact-analysis-statuses.store';

@Component({
  selector: 'app-business-impact-analysis-statuses',
  templateUrl: './business-impact-analysis-statuses.component.html',
  styleUrls: ['./business-impact-analysis-statuses.component.scss']
})
export class BusinessImpactAnalysisStatusesComponent implements OnInit {

  BusinessImpactAnalysisStatusesMasterStore = BusinessImpactAnalysisStatusesMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(private _biaStatusesService:BusinessImpactAnalysisStatusesService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'BUSINESS_IMPACT_ANALYSIS_STATUS_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_BUSINESS_IMPACT_ANALYSIS_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._biaStatusesService.exportToExcel();
            break;
          case "search":
            BusinessImpactAnalysisStatusesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // BusinessImpactAnalysisStatusesMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) BusinessImpactAnalysisStatusesMasterStore.setCurrentPage(newPage);
    this._biaStatusesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._biaStatusesService.sortBusinessImpactAnalysisStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BusinessImpactAnalysisStatusesMasterStore.searchText = '';
    BusinessImpactAnalysisStatusesMasterStore.currentPage = 1 ;
    }
}
