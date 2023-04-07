import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { FindingCorrectiveActionStatusesMasterStore } from 'src/app/stores/masters/internal-audit/finding-corrective-action-statuses.store';
import { FindingCorrectiveActionStatusesService } from 'src/app/core/services/masters/internal-audit/finding-corrective-action-statuses/finding-corrective-action-statuses.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-finding-corrective-action-statuses',
  templateUrl: './finding-corrective-action-statuses.component.html'
})
export class FindingCorrectiveActionStatusesComponent implements OnInit {  

  reactionDisposer: IReactionDisposer;
  FindingCorrectiveActionStatusesMasterStore = FindingCorrectiveActionStatusesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _findingCorrectiveActionStatusesService: FindingCorrectiveActionStatusesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof FindingCorrectiveActionStatuses
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'FINDING_CORRECTIVE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: '', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'internal-audit'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._findingCorrectiveActionStatusesService.exportToExcel();
                break;
                case "search":
                  FindingCorrectiveActionStatusesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) FindingCorrectiveActionStatusesMasterStore.setCurrentPage(newPage);
    this._findingCorrectiveActionStatusesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._findingCorrectiveActionStatusesService.sortFindingCorrectiveActionStatuses(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof FindingCorrectiveActionStatuses
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      FindingCorrectiveActionStatusesMasterStore.searchText = '';
      FindingCorrectiveActionStatusesMasterStore.currentPage = 1 ;
    }
    
}
