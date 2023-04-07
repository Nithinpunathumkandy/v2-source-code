import { Component, OnInit,ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import {RiskHeatMapService} from 'src/app/core/services/risk-management/risk-heat-map/risk-heat-map.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { Router } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { autorun, IReactionDisposer } from 'mobx';
import * as htmlToImage from 'html-to-image';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;
@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  RiskHeatMapStore = RiskHeatMapStore;
  RiskDashboardStore = RiskDashboardStore;
  LikelihoodStore = LikelihoodStore;
  ImpactStore = ImpactStore;
  RisksStore = RisksStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  activeRow=0;
  activeColumn=0;
  mapEmptyList = "look_like_we_dont_have_any_risk_data_to_display_heat_map_here"
  filterSubscription: Subscription = null;
  reactionDisposer: IReactionDisposer;
  SubmenuItemStore = SubMenuItemStore;

  constructor(private _riskHeatMapService:RiskHeatMapService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _impactService:ImpactService,
    private _riskScoreService:RiskScoreService,
    private _likelihoodService:LikelihoodService,
    private _risksService:RisksService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _router:Router,
    private _helperService: HelperServiceService,
    ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => { 
    var subMenuItems=[];
    subMenuItems = [
      
      { activityName: null, submenuItem: { type: 'export_to_excel' } },
      
      ]
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this.exportRiskContext();
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }
    });

    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'risk_heat_map';
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,41501)){
   
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
  }
  else{
     
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'risk_category_ids',
      'risk_type_ids',
      'risk_status_ids',
    ]);
  }
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RiskHeatMapStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getHeatMap();
      // this.pageChange();
    });

    ImpactStore.orderBy = "asc";
    ImpactStore.orderItem="score";
    LikelihoodStore.orderItem = "score";
    RisksStore.unsetRiskDetails();
    RisksStore.loaded=true;
        
    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskScoreService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    
    // if(RiskHeatMapStore.loaded)
    this.getHeatMap();
    // this.pageChange();
   }

   exportRiskContext() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      element = document.getElementById("risk-context");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
        .then(function (dataUrl) {
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            // console.log(base64data);
            pthis.downloadPdf(base64data);
          }
          // SubMenuItemStore.exportClicked = false;
          // pthis.closeLoaderPopUp();
        });
    }, 100);

  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    })
  }

  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  pageChange(newPage: number = null,params?,num?,column?,score=null) {
    this.RisksStore.loaded = false;
    if(RiskDashboardStore.riskScore && score && RiskDashboardStore.riskScore!=score){
      RiskDashboardStore.unsetRiskScore()
      RiskDashboardStore.unsetActiveRow()
      RiskDashboardStore.unsetActiveColumn()
    }
    if(!params){
      params = 'inherent_risk_score='+RiskHeatMapStore.riskHeatMapDetails[0][0]?.risk_score+'&is_inherent=true'; 
      num=0;
      column=0;
    }
    if(RiskDashboardStore.riskScore){
      params = 'inherent_risk_score='+RiskDashboardStore.riskScore+'&is_inherent=true';
    }
    this.activeRow =RiskDashboardStore.activeRowRiskHeat?RiskDashboardStore.activeRowRiskHeat:num;
    this.activeColumn = RiskDashboardStore.activeColumnRiskHeat?RiskDashboardStore.activeColumnRiskHeat:column;

    if (newPage) RisksStore.setCurrentPage(newPage);
    this._risksService.getItems(false,params?params:'').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  gotoRisk(id){
    RisksStore.setRiskId(id);
    this._router.navigateByUrl('risk-management/risks/' + id);
  }

  getHeatMap() {
    this._riskHeatMapService.getItem().subscribe(res=>{
      if(res.length>0 && res[0][0]?.risk_score){
        RisksStore.loaded=false
        this.pageChange(1,'inherent_risk_score='+res[0][0]?.risk_score+'&is_inherent=true',0,0);
  
      }
     
      this._utilityService.detectChanges(this._cdr)
    })
  }

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }

  ngOnDestroy(){
    RiskHeatMapStore.unsetRiskHeatMapDetails();
    RisksStore.unsetRiskDetails();
    RisksStore.loaded=false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
