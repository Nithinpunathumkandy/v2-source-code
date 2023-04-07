import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RiskHeatMapService } from 'src/app/core/services/risk-management/risk-heat-map/risk-heat-map.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
@Component({
  selector: 'app-hm-by-department',
  templateUrl: './hm-by-department.component.html',
  styleUrls: ['./hm-by-department.component.scss']
})
export class HmByDepartmentComponent implements OnInit {
  RiskHeatMapStore = RiskHeatMapStore;
  RisksStore = RisksStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  activeRow=0;
  activeColumn=0;
  mapEmptyList = "look_like_we_dont_have_any_risk_data_to_display_heat_map_here";
  filterSubscription: Subscription = null;

  constructor(private _riskHeatMapService:RiskHeatMapService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _risksService:RisksService,
    private _router:Router) { }
    

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'heap_by_department';
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,41501)){
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'section_ids',
      'sub_section_ids',
      'risk_category_ids',
      'risk_type_ids',
      'risk_status_ids',
      'is_corporate',
      'is_functional'
    ]);
  }
  else{
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'section_ids',
      'sub_section_ids',
      'risk_category_ids',
      'risk_type_ids',
      'risk_status_ids',
    ]);
  }
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RiskHeatMapStore.departmentLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getAllItemByDepartment();
      // this.pageChange();
    });
    
    RisksStore.unsetRiskDetails();
    RisksStore.loaded=true;
    this._riskHeatMapService.getItemByDepartment().subscribe(res=>{
      if(res.length>0 && res[0]?.risk_score[0]?.score>0){
        this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true &department_ids='+res[0]?.department_id,0,0);
  
      }
     
      this._utilityService.detectChanges(this._cdr)
    })

    this.getAllItemByDepartment();
   }
   gotoRisk(id){
    RisksStore.setRiskId(id);
    this._router.navigateByUrl('risk-management/risks/' + id);
  }
  pageChange(newPage: number = null,params?,num?,column?) {
    this.RisksStore.loaded = false;
    if(!params){
      if(RiskHeatMapStore.heatMapByDepartmentDetails[0]?.risk_score[0]?.score>0)
      params = 'inherent_risk_score='+RiskHeatMapStore.heatMapByDepartmentDetails[0]?.risk_score[0]?.score+'&is_inherent=true &department_ids='+RiskHeatMapStore.heatMapByDepartmentDetails[0]?.department_id;
      num=0;
      column=0;
    }
    
    this.activeRow = num;
    this.activeColumn = column;

    if (newPage) RisksStore.setCurrentPage(newPage);
    this._risksService.getItems(false,params?params:'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAllItemByDepartment() {
    this._riskHeatMapService.getItemByDepartment().subscribe(res=>{
      if(res.length>0 && res[0]?.risk_score[0]?.score>0)
      this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true',0,0);
  
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }

  ngOnDestroy(){
    RiskHeatMapStore.unsetHeatMapByDepartmentDetails();
    RisksStore.unsetRiskDetails()
    RisksStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
