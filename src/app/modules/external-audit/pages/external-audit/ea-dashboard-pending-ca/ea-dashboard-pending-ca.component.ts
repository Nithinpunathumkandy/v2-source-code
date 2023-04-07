import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EaDashboardService } from 'src/app/core/services/external-audit/ea-dashboard/ea-dashboard.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-ea-dashboard-pending-ca',
  templateUrl: './ea-dashboard-pending-ca.component.html',
  styleUrls: ['./ea-dashboard-pending-ca.component.scss']
})
export class EaDashboardPendingCaComponent implements OnInit {

  EADashboardStore = EADashboardStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  EADetailEmpty="common_nodata_title";
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  filterSubscription: Subscription = null;

  constructor(
    private _eaDashboardService: EaDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "/external-audit/dashboard"}
    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      EADashboardStore.loaded = false;
      this.pageChange();
      // setTimeout(() => {
      //   this.EADashboardStore.dashboardLoaded = true;
      // }, 1000);

    });
    RightSidebarLayoutStore.filterPageTag = 'ea_dashbord';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'finding_category_ids',
      'risk_rating_ids',
      'responsible_user_ids'
		]);

    this.pageChange();
  }

  pageChange() { 
    this._eaDashboardService.getFindingCAList().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  goToFindingDetails(){
    this._router.navigateByUrl('external-audit/finding-details') 
  }

  goToDashboard(){
    this._router.navigateByUrl('external-audit/dashboard') 
  }

  // redirectCAPage(){
  //   this._router.navigateByUrl('/external-audit/corrective-action')
  // }

  redirectCAPage(row) {
    this._router.navigateByUrl('/external-audit/corrective-action/findings/' + row.finding_id + '/corrective-actions/' + row.id)
    // if (count != 0) {
     
    //   if (status == 'all') {
        //EADashboardStore.dashboardParam='finding_corrective_action_status_ids=7'
       // this._router.navigateByUrl('/external-audit/corrective-action');
    //   }
    // }
  }



  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.makeEmpty();
    SubMenuItemStore.makeEmpty();
    this.filterSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
  }
}
