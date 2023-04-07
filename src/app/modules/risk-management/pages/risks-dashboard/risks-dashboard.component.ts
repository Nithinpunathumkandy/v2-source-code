import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { RiskDashboardService } from 'src/app/core/services/risk-management/risk-dashboard/risk-dashboard.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskStatusService } from 'src/app/core/services/masters/risk-management/risk-status/risk-status.service';
import { RiskStatusMasterStore } from 'src/app/stores/masters/risk-management/risk-status-store';
import { Router } from '@angular/router';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

declare var $: any;
@Component({
  selector: 'app-risks-dashboard',
  templateUrl: './risks-dashboard.component.html',
  styleUrls: ['./risks-dashboard.component.scss']
})
export class RisksDashboardComponent implements OnInit {
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  RiskDashboardStore = RiskDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  LikelihoodStore = LikelihoodStore;
  ImpactStore = ImpactStore;
  activeRow;
  activeColumn;
  riskChartInfo = "bar";
  riskPieChartInfo = "pie";
  showNoDataMap:boolean=false;
  showPieNoDataMap:boolean =false;
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  extreme_count:number = 0;
  significant_count:number = 0;
  high_count:number = 0;
  moderate_count:number = 0;
  low_count:number = 0;
  filterSubscription: Subscription = null;
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
  barChartId: number;
  chartSelectedId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _riskDashboardService:RiskDashboardService,
    private _riskStatusService: RiskStatusService,
    private _likelihoodService:LikelihoodService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _impactService:ImpactService,
  ) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "no_risk_dashboard_data"});
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.RiskDashboardStore.heatMapLoaded = false;
      RiskDashboardStore.dashboardLoaded = false;
      this.getAll();
      // this.getCharts()
      setTimeout(() => {
        this.RiskDashboardStore.heatMapLoaded = true;
        RiskDashboardStore.dashboardLoaded = true;
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
      this._utilityService.detectChanges(this._cdr);
    });
   
    this.getAll();
    // this.getCharts()
    this._utilityService.detectChanges(this._cdr);
    RightSidebarLayoutStore.filterPageTag = 'risk_dashboard';
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(900,41501)){
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
        'is_corporate',
        'is_functional',
        'risk_classification_ids'
      ]);
  
    }
    else{
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
        'risk_classification_ids'
      ]);
    }
   
    ImpactStore.orderBy = "asc";
    ImpactStore.orderItem="score";

    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    // setTimeout(() => {
    //   // console.log(RightSidebarLayoutStore.isFilterSelected('is_functional',1));
    //   if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1)){
    //     this._rightSidebarFilterService.setOrUnsetFilterItem('is_functional', 1);
    //   }else if(RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
    //     this._rightSidebarFilterService.setOrUnsetFilterItem('is_corporate', 1);
    //   }
        
    // }, 250);

  }
  ngAfterViewInit(){
    setTimeout(() => {
      RiskDashboardStore.dashboardLoaded = true;
      this.getCharts()
    }, 100);
  }

  getAll() {
    this.getRiskCountBySources();
    this.getCharts()
    this.getRiskDetails();
    this.getSecondRiskDetails()
    this.getRiskCount();
    this.getRiskHeatMap();
    this.getRiskCountByInherentRiskRatings();
    this.getRiskCountByResidualRiskRatings();
    this.getRiskStatuses()
    
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }


  redirectToHeatMap(risk_score,num?,column?,count=0){
    if(count!=0){
      RiskDashboardStore.setRiskScore(risk_score)
      RiskDashboardStore.setActiveRow(num)
      RiskDashboardStore.setActiveColumn(column)
      this._router.navigateByUrl('/risk-management/risk-heat-map');
    }
  }

  returnRatingId(title:string){
    var id:number=null
    RiskDashboardStore.riskCountByInherentRiskRatings.forEach(res=>{
      if(res.risk_ratings==title){
        id = res.id;
      }
    })
    return id
  }

  processUserNameforChart(dataArray){
    if(dataArray.length > 0){
      for(let i of dataArray){
        i['name'] = i['first_name']+' '+i['last_name'];
      }
      return dataArray;
    }
    else return [];
  }

  redirectRiskRateList(title:string, count:number=0){
    if(count!=0){
      if(RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'&is_inherent=true')
        this._router.navigateByUrl('/risk-management/corporate-risks');
      }
      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('inherent_risk_rating_ids='+this.returnRatingId(title)+'is_inherent=true')
        this._router.navigateByUrl('/risk-management/risks');
      }
    }
  } 

  redirectToRiskPage(status, count:number=0){
    if(count!=0){

      if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_inherent=true')
          this._router.navigateByUrl('/risk-management/risks');
        }
      }else{
        if(status=='open'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=1&is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='closed'){
          RiskDashboardStore.setRiskDashboardParam('risk_status_ids=2&is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
        if(status=='all'){
          RiskDashboardStore.setRiskDashboardParam('is_inherent=true')
          this._router.navigateByUrl('/risk-management/corporate-risks');
        }
      }

    }

  }

  getRiskStatuses(){
    this._riskStatusService.getItems().subscribe(res=>{
    })
  }

  getRiskCountByInherentRiskRatings(){
    this._riskDashboardService.getRiskCountByInherentRiskRatings().subscribe(res=>{
      if(res.length!=0){
        this.showPieNoDataMap=false;
        this.createPieChartForRisk(res);
        this._utilityService.detectChanges(this._cdr);
        res.forEach(element=>{
          if(element.id==1){
            this.extreme_count = element.count
          }
          if(element.id==2){
            this.significant_count = element.count
          }
          if(element.id==3){
            this.high_count = element.count
          }
          if(element.id==4){
            this.moderate_count = element.count
          }
          if(element.id==5){
            this.low_count = element.count
          }
        })
      }else{
        this.showPieNoDataMap=true;
        this.extreme_count= 0;
        this.significant_count= 0;
        this.high_count= 0;
        this.moderate_count= 0;
        this.low_count= 0;
      }
      // this.getRiskCountBySources();
    })
    this._utilityService.detectChanges(this._cdr);
    this.getRiskCountBySources();
  }

  getRiskCountByResidualRiskRatings(){
    this._riskDashboardService.getRiskCountByResidualRiskRatings().subscribe(res=>{
      // this.createPieChartForRisk();
    })
  }

  changePage(newPage: number = null){
    if(newPage) this.page = newPage;
    else this.page = 1;
    this.selectedIndex = 0;
    this._utilityService.scrollToTop();
  }

  getRiskHeatMap(){
    this._likelihoodService.getItems().subscribe(res=>{
    })

    this._riskDashboardService.getRiskHeatMap().subscribe(res=>{
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getRiskCountByOwners(){
    this._riskDashboardService.getRiskCountByOwners().subscribe(res=>{
      this.barChartId = 6;
      this.createBarChartForRisk(res,6);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountByCategories(){
    this._riskDashboardService.getRiskCountByCategories().subscribe(res=>{
      this.barChartId = 5;
      this.createBarChartForRisk(res,5);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountByStatus(){
    this._riskDashboardService.getRiskCountByStatuses().subscribe(res=>{
      this.barChartId = 4;
      this.createBarChartForRisk(res,4);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountBySections(){
    this._riskDashboardService.getRiskCountBySections().subscribe(res=>{
      this.barChartId = 3;
      this.createBarChartForRisk(res,3);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountByDepratments(){
    this._riskDashboardService.getRiskCountByDepartments().subscribe(res=>{
      this.barChartId = 2;
      this.createBarChartForRisk(res,2);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountBySources(){
    this._riskDashboardService.getRiskCountBySources().subscribe(res=>{
      this.barChartId = 1;
      this.showNoDataMap = false;
      // setTimeout(() => {
        this.createBarChartForRisk(res,1);
      // }, 1000);
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCount(){
    this._riskDashboardService.getRiskCount().subscribe(res=>{
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getRiskDetails(){
    this._riskDashboardService.getRisk().subscribe(res=>{

    })
  }

  getSecondRiskDetails(){
    this._riskDashboardService.getSecondTopRisk().subscribe(res=>{

    })
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        setTimeout(() => {
          // this.createPieChartForRisk()
          // this.createBarChartForRisk(res,this.barChartId)
        }, 1000);
      
      });
    }, 1000);
  }

  createBarChartForRisk(res,filter:number){
    var category = ""
    var color = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    
    if(filter == 1){
      chart.data = res
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "risk_sources"
      color="color"
    }
    if(filter == 2){
      chart.data = res
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "code"
    }
    if(filter == 3){
      chart.data = res
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "section"
    }
    if(filter == 4){
      chart.data = res
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "risk_statuses"
    }
    if(filter == 5){
      chart.data = res
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "risk_category"
    }
    if(filter == 6){
      chart.data = this.processUserNameforChart(res);
      if(res.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "name"
    }

    this._utilityService.detectChanges(this._cdr);
    
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.fontSize = 11;
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Risks"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize = 11;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = category;
    series.name = "Visits";
    // series.columns.template.events.on("hit",  this.riskRouting, this);
    if(filter==1){
      series.columns.template.propertyFields.stroke="color"
      series.columns.template.propertyFields.fill = "color"
    }else{
      series.columns.template.stroke = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      series.columns.template.fill = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      }
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskBySourceClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByDepartmentClick,this)
     }
    //  if(filter == 3){
    //  }
     if(filter == 4){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByStatusClick,this)
     }
     if(filter == 5){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByCategoryClick,this)
     }
     if(filter == 6){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByOwnerClick,this)
     }

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  riskBySourceClick(ev) {
    RiskDashboardStore.setRiskDashboardParam(`risk_source_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/risk-management/risks');
  }

  riskByDepartmentClick(ev) {
    RiskDashboardStore.setRiskDashboardParam(`department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/risk-management/risks');
  }

  riskByStatusClick(ev) {
      RiskDashboardStore.setRiskDashboardParam(`risk_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/risk-management/risks');
  }

  riskByCategoryClick(ev) {
      RiskDashboardStore.setRiskDashboardParam(`risk_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/risk-management/risks');
  }

  riskByOwnerClick(ev) {
    RiskDashboardStore.setRiskDashboardParam(`risk_owner_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/risk-management/risks');
  }

  createPieChartForRisk(res?) {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    
    // Add data
    // chart.data = [
    //   { "text": "Very High", "value": 6.6, "color": "red" },
    //   { "text": "High", "value": 0.6, "color": "orange" },
    //   { "text": "Medium", "value": 23.2, "color": "yellow" },
    //   { "text": "Low", "value": 2.2, "color": "#18e309" }
    // ];
    // if(res.length==0){
    //   this.showPieNoDataMap=true;
    //   return
    // }else{
    //   this.showPieNoDataMap=false;
    // }
    chart.data = res;
    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = am4core.percent(50);

    // Add label
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Risk Zone";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 18;

    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.position = 'right'
    chart.legend.fontSize = 11;
    chart.legend.maxHeight = 80;
    chart.legend.scrollable = true;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);




    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    // chart.legend.maxWidth = 100;
    // chart.legend.maxHeight = 80;
    // chart.legend.scrollable = true;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "risk_ratings";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
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

  pieChartClicked(ev){
    this.chartSelectedId=ev.target.dataItem.dataContext.id
    this.routeToRisk()
  }

  routeToRisk(){
    if(RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)
      || !RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1)){
        RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true&inherent_risk_rating_ids='+this.chartSelectedId)
        this._router.navigateByUrl('/risk-management/risks');
    }else{
      RiskDashboardStore.setRiskDashboardParam('is_registered=true&is_inherent=true&inherent_risk_rating_ids='+this.chartSelectedId)
      this._router.navigateByUrl('/risk-management/corporate-risks');
    }
  } 

  ngOnDestroy(){
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    RiskDashboardStore.dashboardLoaded = false;
  }

}
