import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { IsmsRiskHeatMapStore } from 'src/app/stores/isms/isms-risk-heat-map/isms-risk-heat-map.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsHeatMapService } from 'src/app/core/services/isms/isms-risk-heat-map/isms-heat-map.service';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';


@Component({
  selector: 'app-isms-hm-by-source',
  templateUrl: './isms-hm-by-source.component.html',
  styleUrls: ['./isms-hm-by-source.component.scss']
})
export class IsmsHmBySourceComponent implements OnInit {

  IsmsRiskHeatMapStore = IsmsRiskHeatMapStore;
  IsmsRisksStore = IsmsRisksStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  activeRow=0;
  activeColumn=0;
  mapEmptyList = "look_like_we_dont_have_any_risk_data_to_display_heat_map_here";
  filterSubscription: Subscription = null;

  constructor(private _riskHeatMapService:IsmsHeatMapService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _risksService:IsmsRisksService,
    private _router:Router) { }
    

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'heap_by_risk_source';
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
      this.IsmsRiskHeatMapStore.sourceLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getAllItemBySource();
      // this.pageChange();
    });
    
    IsmsRisksStore.unsetRiskDetails();
    IsmsRisksStore.loaded=false;
    this._riskHeatMapService.getItemBySource().subscribe(res=>{
      if(res?.length>0 && res[0]?.risk_score[0]?.score){
        this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true &risk_source_ids='+res[0]?.risk_source_id,0,0);
  
      }
     
      this._utilityService.detectChanges(this._cdr)
    })

    this.getAllItemBySource();

   }

   gotoRisk(id){
    IsmsRisksStore.setRiskId(id);
    this._router.navigateByUrl('isms/isms-risks/' + id);
  }

  pageChange(newPage: number = null,params?,num?,column?,selected:boolean=false) {
    this.IsmsRisksStore.loaded = false;
    // if(CeoRiskDashboardStore.selectedHeatMapParam && selected){
    //   CeoRiskDashboardStore.unsetSelectedHeatMapParam()
    //   CeoRiskDashboardStore.unsetActiveRow()
    //   CeoRiskDashboardStore.unsetActiveColumn()
    // }

    if(!params){
      params = 'inherent_risk_score='+IsmsRiskHeatMapStore.heatMapBySourceDetails[0]?.risk_score[0]?.score+'&is_inherent=true &risk_source_ids='+IsmsRiskHeatMapStore.heatMapBySourceDetails[0]?.risk_source_id;
      num=0;
      column=0;
    }

    // if(CeoRiskDashboardStore.selectedHeatMapParam){
    //   params = CeoRiskDashboardStore.selectedHeatMapParam
    // }
    
    this.activeRow =num;
    this.activeColumn = column;

    if (newPage) IsmsRisksStore.setCurrentPage(newPage);
    this._risksService.getItems(false,params?params:'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAllItemBySource() {
    this._riskHeatMapService.getItemBySource().subscribe(res=>{
      if(res.length>0 && res[0]?.risk_score[0]?.score)
      this.pageChange(1,'inherent_risk_score='+res[0]?.risk_score[0]?.score+'&is_inherent=true',0,0);
  
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }

  //Right left scroll starts
	prev(){
		var container = document.getElementById('container');
		this.sideScroll(container,'left',0,1000,10);
	}

	next(){
		var container = document.getElementById('container');
		this.sideScroll(container,'right',0,1000,10);
	}

	sideScroll(element,direction,speed,distance,step){
		let scrollAmount = 0;
		var slideTimer = setInterval(function(){
			if(direction == 'left'){
				element.scrollLeft -= step;
			} else {
				element.scrollLeft += step;
			}
			scrollAmount += step;
			if(scrollAmount >= distance){
				window.clearInterval(slideTimer);
			}
		}, speed);
	  }
	  //Right left scroll ends

  ngOnDestroy(){
    IsmsRisksStore.unsetRiskDetails()
    IsmsRisksStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}
