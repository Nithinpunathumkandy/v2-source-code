import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ComplianceActionPlanStatusService } from 'src/app/core/services/masters/compliance-management/compliance-action-plan-status/compliance-action-plan-status.service';
import { ComplianceActionPlanStore } from 'src/app/stores/masters/compliance-management/compliance-action-plan-store';

@Component({
  selector: 'app-compliance-action-plan-status',
  templateUrl: './compliance-action-plan-status.component.html',
  styleUrls: ['./compliance-action-plan-status.component.scss']
})
export class ComplianceActionPlanStatusComponent implements OnInit {


  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ComplianceActionPlanStore=ComplianceActionPlanStore;
  constructor(
    private _complianceActionPlanStatusService:ComplianceActionPlanStatusService,
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MEETING_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: null, submenuItem: { type: 'close', path: 'mrm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});

      if (SubMenuItemStore.clikedSubMenuItem) {
        ComplianceActionPlanStore.searchText = SubMenuItemStore.searchText;
            this.getItems(1);

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.getItems(1);
  }

  getItems(newPage: number = null){
    if (newPage) ComplianceActionPlanStore.setCurrentPage(newPage);
    this._complianceActionPlanStatusService.getAllItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._complianceActionPlanStatusService.sortBAActionPlanStatusList(type);
    this.getItems();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    ComplianceActionPlanStore.searchText = '';
    ComplianceActionPlanStore.currentPage = 1 ;
  }

}
