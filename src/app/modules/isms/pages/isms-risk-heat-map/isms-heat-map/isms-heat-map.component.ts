import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
// import {RiskHeatMapService} from 'src/app/core/services/risk-management/risk-heat-map/risk-heat-map.service';
// import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
// import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { Router } from '@angular/router';
import { IsmsRiskHeatMapStore } from 'src/app/stores/isms/isms-risk-heat-map/isms-risk-heat-map.store';
import { IsmsImpactService } from 'src/app/core/services/isms/isms-risk-configuration/isms-impact/isms-impact.service';
import { IsmsRiskScoreService } from 'src/app/core/services/isms/isms-risk-configuration/isms-risk-score/isms-risk-score.service';
import { IsmsLikelihoodService } from 'src/app/core/services/isms/isms-risk-configuration/isms-likelihood/isms-likelihood.service';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsImpactStore } from 'src/app/stores/isms/isms-risk-configuration/isms-impact.store';
import { IsmsLikelihoodStore } from 'src/app/stores/isms/isms-risk-configuration/isms-likelihood.store';
import { IsmsHeatMapService } from 'src/app/core/services/isms/isms-risk-heat-map/isms-heat-map.service';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';

@Component({
  selector: 'app-isms-heat-map',
  templateUrl: './isms-heat-map.component.html',
  styleUrls: ['./isms-heat-map.component.scss']
})
export class IsmsHeatMapComponent implements OnInit {
  IsmsRiskHeatMapStore = IsmsRiskHeatMapStore;
  // RiskDashboardStore = RiskDashboardStore;
  LikelihoodStore = IsmsLikelihoodStore;
  ImpactStore = IsmsImpactStore;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  activeRow=0;
  activeColumn=0;
  mapEmptyList = "look_like_we_dont_have_any_risk_data_to_display_heat_map_here"
  filterSubscription: Subscription = null;

  constructor(private _riskHeatMapService:IsmsHeatMapService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _impactService:IsmsImpactService,
    private _riskScoreService:IsmsRiskScoreService,
    private _likelihoodService:IsmsLikelihoodService,
    private _risksService:IsmsRisksService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService: EventEmitterService,
    private _router:Router
    ) { }

  ngOnInit(): void {
    IsmsRisksStore.is_registered==true
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'risk_heat_map';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'risk_category_ids',
      'risk_type_ids',
      'risk_status_ids',
      'is_corporate',
      'is_functional'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.IsmsRiskHeatMapStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getHeatMap();
      // this.pageChange();
    });

    this.ImpactStore.orderBy = "asc";
    this.ImpactStore.orderItem="score";
    this.LikelihoodStore.orderItem = "score";
    IsmsRisksStore.unsetRiskDetails();
    IsmsRisksStore.loaded=false;
        
    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskScoreService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    
    // if(IsmsRiskHeatMapStore.loaded)
    this.getHeatMap();
    // this.pageChange();
   }

  pageChange(newPage: number = null,params?,num?,column?,score=null) {
    this.IsmsRisksStore.loaded = false;
    if(ISMSDashboardStore.riskScore && score && ISMSDashboardStore.riskScore!=score){
      ISMSDashboardStore.unsetRiskScore()
      ISMSDashboardStore.unsetActiveRow()
      ISMSDashboardStore.unsetActiveColumn()
    }
    if(!params){
      params = 'inherent_risk_score='+IsmsRiskHeatMapStore.riskHeatMapDetails[0][0]?.total_score+'&is_inherent=true'; 
      num=0;
      column=0;
    }
    if(ISMSDashboardStore.riskScore){
      params = 'inherent_risk_score='+ISMSDashboardStore.riskScore+'&is_inherent=true';
    }
    this.activeRow =ISMSDashboardStore.activeRowRiskHeat ? ISMSDashboardStore.activeRowRiskHeat : num;
    this.activeColumn = ISMSDashboardStore.activeColumnRiskHeat ? ISMSDashboardStore.activeColumnRiskHeat : column;

    if (newPage) IsmsRisksStore.setCurrentPage(newPage);
    this._risksService.getItems(false,params?params:'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  gotoRisk(id){
    IsmsRisksStore.setRiskId(id);
    this._router.navigateByUrl('isms/isms-risks/' + id);
  }

  getHeatMap() {
    this._riskHeatMapService.getItem().subscribe(res=>{
      if(res.length>0 && res[0][0]?.total_score){
        this.pageChange(1,'inherent_risk_score='+res[0][0]?.total_score+'&is_inherent=true',0,0);
  
      }
     
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }

  ngOnDestroy(){
    IsmsRisksStore.unsetRiskDetails();
    IsmsRisksStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
