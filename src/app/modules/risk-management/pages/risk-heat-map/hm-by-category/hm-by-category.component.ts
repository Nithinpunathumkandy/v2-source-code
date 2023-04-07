import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { RiskHeatMapService } from 'src/app/core/services/risk-management/risk-heat-map/risk-heat-map.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
@Component({
  selector: 'app-hm-by-category',
  templateUrl: './hm-by-category.component.html',
  styleUrls: ['./hm-by-category.component.scss']
})
export class HmByCategoryComponent implements OnInit {
RiskScoreStore = RiskScoreStore;
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
    private _riskScoreService:RiskScoreService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _risksService:RisksService,
    private _router:Router) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'heap_by_category';
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,41501)){
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      // 'risk_category_ids',
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
      'department_ids',
      'section_ids',
      'sub_section_ids',
      // 'risk_category_ids',
      'risk_type_ids',
      'risk_status_ids',
    ]);
  }
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RiskHeatMapStore.categoryLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getAllItemByCategory();
      // this.pageChange();
    });
    
    RisksStore.unsetRiskDetails();
    RisksStore.loaded=true;
    this._riskHeatMapService.getItemByCategory().subscribe(res=>{
      if(CeoRiskDashboardStore.selectedHeatMapParam!=null && res.length>0 && res[0]?.risk_score[0]?.score){
        this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true &risk_category_ids='+res[0]?.risk_category_id,0,0);
      }

      this._utilityService.detectChanges(this._cdr)
    })

    this._riskScoreService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this.getAllItemByCategory();
  }
  gotoRisk(id){
    RisksStore.setRiskId(id);
    this._router.navigateByUrl('risk-management/risks/' + id);
  }

  pageChange(newPage: number = null,params?,num?,column?,selected:boolean=false) {
    this.RisksStore.loaded = false;
    if(CeoRiskDashboardStore.selectedHeatMapParam && selected){
      CeoRiskDashboardStore.unsetSelectedHeatMapParam()
      CeoRiskDashboardStore.unsetActiveRow()
      CeoRiskDashboardStore.unsetActiveColumn()
    }
    
    if(!params){
      params = 'inherent_risk_score='+RiskHeatMapStore.heatMapByCategoryDetails[0]?.risk_score[0]?.score+'&is_inherent=true &risk_category_ids='+RiskHeatMapStore.heatMapByCategoryDetails[0]?.risk_category_id;
      num=0;
      column=0;
    }

    if(CeoRiskDashboardStore.selectedHeatMapParam){
      params = CeoRiskDashboardStore.selectedHeatMapParam
    }
    
    this.activeRow =CeoRiskDashboardStore.activeRowRiskHeat?CeoRiskDashboardStore.activeRowRiskHeat:num;
    this.activeColumn = CeoRiskDashboardStore.activeColumnRiskHeat?CeoRiskDashboardStore.activeColumnRiskHeat:column;


    if (newPage) RisksStore.setCurrentPage(newPage);
    this._risksService.getItems(false,params?params:'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getAllItemByCategory() {
    this._riskHeatMapService.getItemByCategory().subscribe(res=>{
      if(res.length>0 && res[0]?.risk_score[0]?.score)
      this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true',0,0);
  
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }
  ngOnDestroy(){
    RiskHeatMapStore.unsetHeatMapByCategoryDetails();
    RisksStore.unsetRiskDetails()
    RisksStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}
