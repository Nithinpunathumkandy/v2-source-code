import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MaturityMatrixRangesService } from 'src/app/core/services/masters/event-monitoring/maturity-matrix-ranges/maturity-matrix-ranges.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventMaturityMatrixRangesMaster } from 'src/app/stores/masters/event-monitoring/event-maturity-matrix-ranges.store';

@Component({
  selector: 'app-event-maturity-matrix-ranges',
  templateUrl: './event-maturity-matrix-ranges.component.html',
  styleUrls: ['./event-maturity-matrix-ranges.component.scss']
})
export class EventMaturityMatrixRangesComponent implements OnInit {

  reactionDisposer:IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  EventMaturityMatrixRangesMaster = EventMaturityMatrixRangesMaster

  constructor(
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,  
    private _maturityMatrixRangeService:MaturityMatrixRangesService,
    private _cdr: ChangeDetectorRef,
    
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: 'event-monitoring' } },
      ]      
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            EventMaturityMatrixRangesMaster.searchText = SubMenuItemStore.searchText;
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
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) EventMaturityMatrixRangesMaster.setCurrentPage(newPage);
    this._maturityMatrixRangeService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    //
    this._maturityMatrixRangeService.sortTaskPhaseList(type, null);
    this.pageChange();
  }

}
