import {  ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { RiskCeoDashboardService } from 'src/app/core/services/risk-management/risk-ceo-dashboard/risk-ceo-dashboard.service';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';

@Component({
  selector: 'app-top-risks',
  templateUrl: './top-risks.component.html',
  styleUrls: ['./top-risks.component.scss']
})
export class TopRisksComponent implements OnInit, OnDestroy {
  
  RightSidebarLayoutStore = RightSidebarLayoutStore;
  CeoRiskDashboardStore = CeoRiskDashboardStore;
  filterSubscription: Subscription = null;
  reactionDisposer: IReactionDisposer;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _riskCeoDashboardService:RiskCeoDashboardService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    CeoRiskDashboardStore.dashboardLoaded=false;
    NoDataItemStore.setNoDataItems({title: "", subtitle: "risk_top_20_title_nodata"});
    RightSidebarLayoutStore.showFilter = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/risk-management/ceo-dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CeoRiskDashboardStore.heatMapLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getRiskTopRisks();
      this.getSecondTopRisks();
    });
    this.getRiskTopRisks()
    this.getSecondTopRisks();
    // RightSidebarLayoutStore.filterPageTag = 'risk_ceo_dashboard';
    // this._rightSidebarFilterService.setFiltersForCurrentPage([
    //   'organization_ids',
    //   'division_ids',
    //   'department_ids',
    //   'section_ids',
    //   'sub_section_ids',
    //   'is_corporate',
    //   'is_functional'
    // ]);
    // setTimeout(() => {
    //   if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && 
    //   !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //     this._rightSidebarFilterService.setOrUnsetFilterItem('is_functional', 1);
    //     this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }


  getRiskTopRisks(){
    this._riskCeoDashboardService.getRisk('?page=1').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        CeoRiskDashboardStore.dashboardLoaded=true;
      }, 100);
    })
  }

  getSecondTopRisks(){
    this._riskCeoDashboardService.getSecondTopRisk('?page=2').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    // this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    // RightSidebarLayoutStore.showFilter = false;
    CeoRiskDashboardStore.dashboardLoaded=false;
  }

}
