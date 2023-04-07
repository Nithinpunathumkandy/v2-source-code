import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AmAuditDashboardService } from 'src/app/core/services/audit-management/am-audit-dashboard/am-audit-dashboard.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditFindingDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/audit-finding-dashboard.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Component({
  selector: 'app-am-top-findings-dashboard',
  templateUrl: './am-top-findings-dashboard.component.html',
  styleUrls: ['./am-top-findings-dashboard.component.scss']
})
export class AmTopFindingsDashboardComponent implements OnInit , OnDestroy {

  AuditFindingDashboardStore = AuditFindingDashboardStore
  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,    
    private _eventEmitterService: EventEmitterService,
    private _amAuditDashboardService: AmAuditDashboardService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      AuditFindingDashboardStore.commonLoader = false;
      this.getTopFinding()
    });
    RightSidebarLayoutStore.filterPageTag = 'am_top_findings_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      // 'audit_manager_ids',
      'am_audit_status_ids',
      'department_ids',
      'risk_rating_ids'
    ]);
    this.getTopFinding()
  }

  getTopFinding(){
    this._amAuditDashboardService.getTopFinding().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  goToDashboard(){
    this._router.navigateByUrl(`/audit-management/dashboard`)
  }

  goToFindings(){
    this._router.navigateByUrl(`/audit-management/finding-dashboard`)
  }

  gotoDetails(item) {
    AmAuditFindingStore.findingComponent = 'finding';
    this._router.navigateByUrl('/audit-management/am-audit-field-works/'+item.am_audit_id+'/am-audit-findings/' + item.id)
  }

  ngOnDestroy(): void {
    AuditFindingDashboardStore.loaded = false
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    AuditFindingDashboardStore.unsetDashboardData()
    this._rightSidebarFilterService.resetFilter();
  }

}
