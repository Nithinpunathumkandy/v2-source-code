import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { PendingReviewsService } from 'src/app/core/services/kpi-management/dashboard/pending-reviews/pending-reviews.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KPIPendingRivewsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-pending-reviews';
import { KPIScorePendingRivewsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-score-pending-reviews';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-pending-reviews',
  templateUrl: './pending-reviews.component.html',
  styleUrls: ['./pending-reviews.component.scss']
})
export class PendingReviewsComponent implements OnInit,OnDestroy {
  
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  KPIPendingRivewsDashboardStore = KPIPendingRivewsDashboardStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  KPIScorePendingRivewsDashboardStore = KPIScorePendingRivewsDashboardStore;

  filterSubscription: Subscription = null;
  
  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _humanCapitalService:HumanCapitalService,
    private _pendingReviewsService: PendingReviewsService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      KPIScorePendingRivewsDashboardStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.allItems();
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (!BreadCrumbMenuItemStore.refreshBreadCrumbMenu) {
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name: "kpi_dashboard",
        path: `/kpi-management/dashboard`
      });
    }
    
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    });

    RightSidebarLayoutStore.filterPageTag = 'KPI_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'kpi_management_status_ids',
      'kpi_category',
      'kpi_type',
      'kpi_review_frequency'
    ]);

    this.allItems();
  }

  allItems(){
    this.getByKpi(1);
    this.getByKpiScore(1);
  }

  getByKpi(newPage: number = null){
    if (newPage) KPIPendingRivewsDashboardStore.setCurrentPage(newPage);
    this._pendingReviewsService.getByKpi(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getByKpiScore(newPage: number = null){
    if (newPage) KPIScorePendingRivewsDashboardStore.setCurrentPage(newPage);
    this._pendingReviewsService.getByKpiScore(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  ngOnDestroy(): void {
    if (this.reactionDisposer) this.reactionDisposer();
    KPIPendingRivewsDashboardStore.unSetKpiPendingReivews();
    KPIScorePendingRivewsDashboardStore.unSetKpiScorePendingReivews();

    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}
