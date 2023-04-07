import {  ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
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
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';
declare var $: any;
@Component({
  selector: 'app-ceo-dashboard-main',
  templateUrl: './ceo-dashboard-main.component.html',
  styleUrls: ['./ceo-dashboard-main.component.scss']
})
export class CeoDashboardMainComponent implements OnInit, OnDestroy {

  @ViewChild('tableArea', { static: false }) tableArea: ElementRef;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  CeoRiskDashboardStore = CeoRiskDashboardStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  LikelihoodStore = LikelihoodStore;
  RightSidebarLayoutStore = RightSidebarLayoutStore;
  AppStore=AppStore;
  activeRow;
  activeColumn;
  riskChartInfo = "bar";
  showNoDataMap:boolean=false;
  reactionDisposer: IReactionDisposer
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  extreme_count:number = 0;
  significant_count:number = 0;
  high_count:number = 0;
  moderate_count:number = 0;
  low_count:number = 0;
  filterSubscription: Subscription = null;
  chart
  showNoDataBarChart:boolean=false
  showTable:boolean=false;
  extreme_title: any;
  significant_title: any;
  high_title: any;
  moderate_title: any;
  low_title: any;

  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _riskCeoDashboardService:RiskCeoDashboardService,
    private _riskStatusService: RiskStatusService,
    private _likelihoodService:LikelihoodService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,
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
    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    var subMenuItems = [
      { activityName: null , submenuItem: { type: 'top_20_risks' } },
      { activityName: null , submenuItem: { type: 'risk_details' } },
  
    ]

    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    this.reactionDisposer = autorun(() => {
     
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "top_20_risks":
             this._router.navigateByUrl('/risk-management/ceo-dashboard/top-risks');
            break;

          case "risk_details":
            this._router.navigateByUrl('/risk-management/ceo-dashboard/risk-details');
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CeoRiskDashboardStore.heatMapLoaded = false;
      this.showNoDataBarChart=false;
      this._utilityService.detectChanges(this._cdr);
      this.getAllDashboardData();
    });
    this.getAllDashboardData();
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
    CeoRiskDashboardStore.unsetSelectedDivisionId()
    // setTimeout(() => {
    //   if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && 
    //   !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //     this._rightSidebarFilterService.setOrUnsetFilterItem('is_functional', 1);
    //     this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }

  ngAfterViewInit(){
    CeoRiskDashboardStore.dashboardLoaded = true;
    this.getCharts()
  }

  getAllDashboardData(){
    // this.getCharts();
    this.getDivisions();
    this.getRiskCount();
    this.getRiskDivision();
    this.getRiskDepartments();
    this.getRiskCountByInherentRiskRatings();
    this.getRiskCountByResidualRiskRatings();
    this.getRiskStatuses();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createStackedBarChart()
        this.createPieChartForDivision(CeoRiskDashboardStore.riskCountByDivisions);
      });
    }, 1000);
  }

  assignChartData(){
    var chartData=[]
    var num=0
    CeoRiskDashboardStore.riskDetailsByDepartments.forEach(res=>{
      if(res.grand_total!=0){
        chartData.push(res)
      }else{
        num++
        if(num==CeoRiskDashboardStore.riskDetailsByDepartments.length)this.showNoDataBarChart=true;
      }
    })
    return chartData
  }

  setHorizontalScrollBar(){
    this.showTable = !this.showTable;
    if(this.showTable && CeoRiskDashboardStore.riskDetailsByDepartments.length > 0){
      setTimeout(() => {
        $(this.tableArea.nativeElement).mCustomScrollbar({
          axis:"x"
        });
      }, 150);
    }
  }

  createStackedBarChart(){
    
    am4core.addLicense("CH199714744");
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.data =  this.assignChartData()
    this.chart.numberFormatter.numberFormat = "#";
    this.chart.colors.list = [
      am4core.color("#FF0000"),
      am4core.color("#FFC000"),
      am4core.color("#FFFF00"),
      am4core.color("#92D050"),
      am4core.color("#00B050"),
    ];
    
    // this.chart.legend = new am4charts.Legend();
    // this.chart.legend.position = "right";
    let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";
    this.createSeries("extreme", "Extreme")
    this.createSeries("very_high", "Very High")
    this.createSeries("high", "High");
    this.createSeries("medium", "Moderate");
    this.createSeries("low", "Low");
    this._utilityService.detectChanges(this._cdr);
  }

  createSeries(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "code";
    series.stacked = true;
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
  }

  getRiskStatuses(){
    this._riskStatusService.getItems().subscribe(res=>{
    })
  }

  getRiskCountByInherentRiskRatings(){
    this._riskCeoDashboardService.getRiskCountByInherentRiskRatings().subscribe(res=>{
      if(res.length!=0){
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
      }else{
        this.extreme_count = 0;
        this.significant_count = 0;
        this.high_count = 0;
        this.moderate_count = 0;
        this.low_count = 0;
      }
      this.getRiskCountBySources();
    })
  }

  getRiskCountByResidualRiskRatings(){
    this._riskCeoDashboardService.getRiskCountByResidualRiskRatings().subscribe(res=>{
      // this.createPieChartForRisk();
    })
  }

  changePage(newPage: number = null){
    if(newPage) this.page = newPage;
    else this.page = 1;
    this.selectedIndex = 0;
    this._utilityService.scrollToTop();
  }

  navigateToDivisionDetails(param:string, id:number){
    this.CeoRiskDashboardStore.setSelectedDivisionId(id);
    this.CeoRiskDashboardStore.setSelectedDivisionTitle(param);
    this._router.navigateByUrl('/risk-management/ceo-dashboard/division-wise-details/'+id);
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
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'&is_registered=true&is_inherent=true')
        this._router.navigateByUrl('/risk-management/corporate-risks');
      }
      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'&is_registered=true&is_inherent=true')
        this._router.navigateByUrl('/risk-management/risks');
      }
    }
  }

  redirectToRiskPage(status, count:number=0){
    if(count!=0){

      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
      }else{
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
      }

    }

  }

  getRiskHeatMap(){
    this._likelihoodService.getItems().subscribe(res=>{
    })

    this._riskCeoDashboardService.getRiskHeatMap().subscribe(res=>{
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getDivisions(){
    this._riskCeoDashboardService.getDivisions().subscribe(res=>{

    })
  }

  getRiskCountByOwners(){
    this._riskCeoDashboardService.getRiskCountByOwners().subscribe(res=>{
      // this.createBarChartForRisk(6);
    })
  }

  getRiskCountByCategories(){
    this._riskCeoDashboardService.getRiskCountByCategories().subscribe(res=>{
      // this.createBarChartForRisk(5);
    })
  }

  getRiskCountByStatus(){
    this._riskCeoDashboardService.getRiskCountByStatuses().subscribe(res=>{
      // this.createBarChartForRisk(4);
    })
  }

  getRiskCountBySections(){
    this._riskCeoDashboardService.getRiskCountBySections().subscribe(res=>{
      // this.createBarChartForRisk(3);
    })
  }

  getRiskCountByDepratments(){
    this._riskCeoDashboardService.getRiskCountByDepartments().subscribe(res=>{
      // this.createBarChartForRisk(2);
    })
  }

  getRiskCountBySources(){
    this._riskCeoDashboardService.getRiskCountBySources().subscribe(res=>{
      // this.createBarChartForRisk(1);
    })
  }

  getRiskCount(){
    this._riskCeoDashboardService.getRiskCount().subscribe(res=>{
    })
  }

  getRiskDepartments(){
    this._riskCeoDashboardService.getRiskDetailsByDepartments().subscribe(res=>{
      this.createStackedBarChart();
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getRiskDivision(){
    this._riskCeoDashboardService.getRiskCountByDivisions().subscribe(res=>{
      this.createPieChartForDivision(res)
    })
  }

  createPieChartForDivision(statusData) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartDivision", am4charts.PieChart);
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = CeoRiskDashboardStore.riskCountByDivisions;
    }
    chart.data = CeoRiskDashboardStore.riskCountByDivisions;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RisksDivisions"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = 70;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Division Wise";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;

    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "division";
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
    this._utilityService.detectChanges(this._cdr);
  }

  getTranslateText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    // this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    // RightSidebarLayoutStore.showFilter = false;
    CeoRiskDashboardStore.dashboardLoaded = false;
  }

}
