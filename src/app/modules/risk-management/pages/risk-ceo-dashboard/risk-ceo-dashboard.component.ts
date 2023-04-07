import {  ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Component({
  selector: 'app-risk-ceo-dashboard',
  templateUrl: './risk-ceo-dashboard.component.html',
  styleUrls: ['./risk-ceo-dashboard.component.scss']
})
export class RiskCeoDashboardComponent implements OnInit, OnDestroy {
  

  constructor(
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'risk_ceo_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'is_corporate',
      'is_functional'
    ]);
    setTimeout(() => {
      if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && 
      !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
        this._rightSidebarFilterService.setOrUnsetFilterItem('is_functional', 1);
        this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  ngOnDestroy(){
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
  }

}
