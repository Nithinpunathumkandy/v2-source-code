import {  ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { RiskCeoDashboardService } from 'src/app/core/services/risk-management/risk-ceo-dashboard/risk-ceo-dashboard.service';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { OrganizationLevelSettingsStore, } from 'src/app/stores/settings/organization-level-settings.store';
import { RiskStatusMasterStore } from 'src/app/stores/masters/risk-management/risk-status-store';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AppStore } from 'src/app/stores/app.store';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-automative-division',
  templateUrl: './automative-division.component.html',
  styleUrls: ['./automative-division.component.scss']
})
export class AutomativeDivisionComponent implements OnInit, OnDestroy {

  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  RightSidebarLayoutStore = RightSidebarLayoutStore;
  CeoRiskDashboardStore = CeoRiskDashboardStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  LikelihoodStore = LikelihoodStore;
  RisksStore = RisksStore;
  AppStore = AppStore;
  activeRow;
  activeColumn;
  riskChartInfo = "bar";
  showNoDataMap:boolean=false;
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  extreme_count:number = 0;
  significant_count:number = 0;
  high_count:number = 0;
  moderate_count:number = 0;
  low_count:number = 0;
  mapEmptyList = "look_like_we_dont_have_any_risk_data_to_display_heat_map_here";
  emptyMessage="Looks like we don't have Top 10 Risk!"
  filterSubscription: Subscription = null;
  reactionDisposer: IReactionDisposer;
  clientOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
  };
  extreme_title: any;
  significant_title: any;
  high_title: any;
  moderate_title: any;
  low_title: any;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _riskCeoDashboardService:RiskCeoDashboardService,
    private _risksService:RisksService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = false;
    RiskDashboardStore.enableDivisionFilter = false;
    RightSidebarLayoutStore.unsetFilterItemValues('division_ids');
    CeoRiskDashboardStore.dashboardLoaded = false;
    CeoRiskDashboardStore.divisionLoaded = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/risk-management/ceo-dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CeoRiskDashboardStore.heatMapLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getAllDashboardData();
    });
    // NoDataItemStore.setNoDataItems({ title: "Looks like we don't have Top 10 Risk!"});
    this.getAllDashboardData();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 500);
  }

  ngAfterViewInit(){
    this.getCharts()
  }

  getRiskTopRisks(){
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRisk('?by_division=true&page=1&division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{

      })
    }else{
      this._riskCeoDashboardService.getRisk('?by_division=true&page=1').subscribe(res=>{

      })
    }
   
  }

  getSecondTopRisks(){
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getSecondTopRisk('?by_division=true&page=2&division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{

      })
    }else{
      this._riskCeoDashboardService.getSecondTopRisk('?by_division=true&page=2').subscribe(res=>{

      })
    }
  
  }

  getAllDashboardData(){
    this.getRiskTopRisks();
    this.getSecondTopRisks();
    this.getRiskCountByDepratments();
    this.getRiskCountByInherentRiskRatings();
    this.getRiskCountByResidualRiskRatings();
    this.getRiskHeatMapByCategories();
    this.getRiskCount();
  }

  getRiskHeatMap(newPage: number = null,params?,num?,column?,selected:boolean=false) {
    this.RisksStore.loaded = false;
    
    if(!params){
      // console.log('hai');
      params = 'inherent_risk_score='+RiskHeatMapStore.heatMapByCategoryDetails[0]?.risk_score[0]?.score+'&is_inherent=true &risk_category_ids='+RiskHeatMapStore.heatMapByCategoryDetails[0]?.risk_category_id;
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

  setRiskSort(type, callList: boolean = true) {
    this._risksService.sortRiskList(type, callList);
  }

  redirectToHeatmapCategory(redirectUrl: string = null,params?,num?,column?) {
    CeoRiskDashboardStore.setActiveRow(num)
    CeoRiskDashboardStore.setActiveColumn(column)
    CeoRiskDashboardStore.setSelectedHeatMapParam(params)
    this._router.navigateByUrl('/risk-management/risk-heat-map/'+redirectUrl);
  }

  returnRatingId(title:string){
    var id:number=null
    CeoRiskDashboardStore.riskCountByInherentRiskRatings.forEach(res=>{
      if(res.risk_ratings==title){
        id = res.id;
      }
    })
    return id
  }

  redirectRiskRateList(title:string, count:number=0){
    if(count!=0){
      if(RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
        this._router.navigateByUrl('/risk-management/corporate-risks');
      }
      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
        this._router.navigateByUrl('/risk-management/risks');
      }
    }
  }

  redirectToRiskPage(status, count:number=0){
    if(count!=0){

      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/risks');
        }
      }else{
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true&division_ids='+CeoRiskDashboardStore.selected_division_id)
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
      }

    }

  }

  getRiskCount(){
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRiskCount('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
      })
    }else{
      this._riskCeoDashboardService.getRiskCount().subscribe(res=>{
      })
    }
    
  }

  getRiskCountByResidualRiskRatings(){
    this._riskCeoDashboardService.getRiskCountByResidualRiskRatings().subscribe(res=>{
      // this.createPieChartForRisk();
    })
  }

  getRiskCountByInherentRiskRatings(){
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRiskCountByInherentRiskRatings('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
        res.forEach(element=>{
          if(element.id==1){
            this.extreme_title = element.risk_ratings
            this.extreme_count = element.count
          }
          if(element.id==2){
            this.significant_title = element.risk_ratings
            this.significant_count = element.count
          }
          if(element.id==3){
            this.high_title = element.risk_ratings
            this.high_count = element.count
          }
          if(element.id==4){
            this.moderate_title = element.risk_ratings
            this.moderate_count = element.count
          }
          if(element.id==5){
            this.low_title = element.risk_ratings
            this.low_count = element.count
          }
        })
        this.getRiskCountBySources();
      })
    }else{
      this._riskCeoDashboardService.getRiskCountByInherentRiskRatings().subscribe(res=>{
        res.forEach(element=>{
          if(element.id==1){
            this.extreme_title = element.risk_ratings
            this.extreme_count = element.count
          }
          if(element.id==2){
            this.significant_title = element.risk_ratings
            this.significant_count = element.count
          }
          if(element.id==3){
            this.high_title = element.risk_ratings
            this.high_count = element.count
          }
          if(element.id==4){
            this.moderate_title = element.risk_ratings
            this.moderate_count = element.count
          }
          if(element.id==5){
            this.low_title = element.risk_ratings
            this.low_count = element.count
          }
        })
        this.getRiskCountBySources();
      })
    }
   
  }

  getRiskCountBySources(){
    this._riskCeoDashboardService.getRiskCountBySources().subscribe(res=>{
      // this.createBarChartForRisk(1);
    })
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRisk()
      });
    }, 1000);
  }

  getRiskHeatMapByCategories(){
    this.RisksStore.loaded = false;
    this.activeRow=0
    this.activeColumn = 0
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRiskHeatMapByCategories('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this._riskCeoDashboardService.getRiskHeatMapByCategories().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getRiskHeatMapByStatus(){
    this.RisksStore.loaded = false;
    this.activeRow=0
    this.activeColumn = 0
    if(CeoRiskDashboardStore.selected_division_id){

    }else{

    }
    this._riskCeoDashboardService.getRiskHeatMapByStatus('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskHeatMapBySources(){
    this.RisksStore.loaded = false;
    this.activeRow=0
    this.activeColumn = 0
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRiskHeatMapBySources('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this._riskCeoDashboardService.getRiskHeatMapBySources().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
  }

  getRiskCountByDepratments(){
    if(CeoRiskDashboardStore.selected_division_id){
      this._riskCeoDashboardService.getRiskCountByDepartments('?division_ids='+CeoRiskDashboardStore.selected_division_id).subscribe(res=>{
        this.getCharts();
      })
    }else{
      this._riskCeoDashboardService.getRiskCountByDepartments().subscribe(res=>{
        this.getCharts();
      })
    }
   
  }

  createPieChartForRisk() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = CeoRiskDashboardStore.riskCountByDepartments;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = 70;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Department Wise";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "department";
    pieSeries.labels.template.text = "";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
    CeoRiskDashboardStore.dashboardLoaded = true;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    CeoRiskDashboardStore.dashboardLoaded = false;
    RiskDashboardStore.enableDivisionFilter = true;
    CeoRiskDashboardStore.divisionLoaded = false;
  }

}
