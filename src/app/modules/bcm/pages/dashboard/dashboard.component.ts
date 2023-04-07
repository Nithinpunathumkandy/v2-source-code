import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { BcmDashboardService } from 'src/app/core/services/bcm/bcm-dashboard/bcm-dashboard.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BCMDashboardStore } from 'src/app/stores/bcm/bcm-dashboard/bcm-dashboard-store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  BCMDashboardStore = BCMDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AppStore = AppStore
  riskDataExisting: boolean = false;
  filterSubscription: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _bcmDashboardService: BcmDashboardService,
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
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.BCMDashboardStore.dashboardLoaded = false;
      this.getAllCounts();
      setTimeout(() => {
        this.BCMDashboardStore.dashboardLoaded = true;
      }, 3000);
    });
    this.getAllCounts()
    setTimeout(() => {
      // this.getAllCounts()
    }, 200);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      RightSidebarLayoutStore.filterPageTag = 'bcm_dashboard';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
      ]);
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
    this.getCharts()
  }

  getCharts() {
    setTimeout(() => {
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        // this.createPieChartForCriticalProcessCounts()
        // this.createPieChartForRiskCounts()
        // this.createChangeRequestCountByYears()
        // this.createBarChartForBIAByYearCounts()
        // this.createPieChartForBCPCountByStatus()
        // this.createPieChartForStrategyCountByTypes()
        // this.createBarChartForSolutionCountByScores()
        // this.createPieChartForStrategyCountByStatuses()
        // this.createPieChartForTestAndExercisePerformedCounts()
        // this.createPieChartForBIAPerformedVsNonPerformedCounts()
      });
    }, 1000);
  }

  getAllCounts() {
    this.getBCMCounts()
    this.getCriticalProcessCounts()
    this.getRiskCounts()
    this.getBIAPerformedVsNonPerformedCounts()
    this.getBIAByYearCounts()
    this.getBCPCountByStatus()
    this.getStrategyCountByTypes()
    this.getSolutionCountByScores()
    this.getStrategyCountByStatuses()
    this.getChangeRequestCountByYears()
    this.getTestAndExercisePerformedCounts()
    this.getCharts()
  }

  getTotalCriticalProcessCount() {
    var score = 0
    BCMDashboardStore.CriticalProcessCounts.forEach(res => {
      score = score + res.count
    })
    return score
  }

  getTotalRiskCount() {
    var score = 0
    BCMDashboardStore.RiskCounts.forEach(res => {
      score = score + res.count
    })
    return score
  }

  getBCMCounts() {
    this._bcmDashboardService.getBCMCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCriticalProcessCounts() {
    this._bcmDashboardService.getCriticalProcessCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.CriticalProcessCounts.length == 0){
        this._utilityService.detectChanges(this._cdr);
      }else{        
        this.createPieChartForCriticalProcessCounts()
        this._utilityService.detectChanges(this._cdr);
      }
      // this._utilityService.detectChanges(this._cdr);
    })
  }

  createPieChartForCriticalProcessCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("CriticalProcessCountsDiv", am4charts.PieChart);
    chart.data = BCMDashboardStore.CriticalProcessCounts;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "CriticalProcessCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "{value}"
    // "{value.percent.formatNumber('#.')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.criticalProcessClick,this)
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

  criticalProcessClick(ev) {
    BCMDashboardStore.setDashboardParam(`bia_tire_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bcm/business-impact-analysis');
  }

  getRiskCounts() {
    this._bcmDashboardService.getRiskCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.RiskCounts.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForRiskCounts()
        this._utilityService.detectChanges(this._cdr);
      }            
    })
  }

  returnRiskArrayCount() {
    let riskArray = BCMDashboardStore.RiskCounts

    riskArray.forEach(res => {
      if (res.count != 0) {
        this.riskDataExisting = true
      }
    })

    return riskArray
  }

  createPieChartForRiskCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("RiskCountsDiv", am4charts.PieChart);
    chart.data = BCMDashboardStore.RiskCounts
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "risk_ratings";
    pieSeries.labels.template.text = "{value}"
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
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

  getBIAPerformedVsNonPerformedCounts() {
    this._bcmDashboardService.getBIAPerformedVsNonPerformedCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore?.BIAPerformedCounts?.total ==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForBIAPerformedVsNonPerformedCounts()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  retrunBIAPerformedVsNonPerformedCounts() {
    let array = []

    if (BCMDashboardStore.BIAPerformedCounts?.total > 0) {
      var obj1 = new Object()
      obj1['title'] = 'Performed'
      obj1['count'] = BCMDashboardStore.BIAPerformedCounts?.bia_count
      array.push(obj1)
      var obj2 = new Object()
      obj2['title'] = 'Non Performed'
      obj2['count'] = BCMDashboardStore.BIAPerformedCounts?.process_count
      array.push(obj2)
    }

    return array
  }

  createPieChartForBIAPerformedVsNonPerformedCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("BIAPerformedVsNonPerformedCountsDiv", am4charts.PieChart);
    chart.data = this.retrunBIAPerformedVsNonPerformedCounts();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "BIAPerformedVsNonPerformedCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    // chart.legend.valueLabels.template.disabled = true;
    // chart.legend.itemContainers.template.togglable = false;
    // chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    // chart.legend.valueLabels.template.align = "left"
    // chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "{value}"
    pieSeries.labels.template.fontSize =10;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
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

  getBIAByYearCounts() {
    this._bcmDashboardService.getBIAByYearCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.BIAByYear.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createBarChartForBIAByYearCounts()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createBarChartForBIAByYearCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("BarChartForBIAByYearCountsDiv", am4charts.XYChart);
    chart.data = BCMDashboardStore.BIAByYear
    chart.numberFormatter.numberFormat = "#";

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 11;

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "BIA By Year"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.grid.template.disabled = true;
    valueAxis.maxPrecision = 0
    valueAxis.min = 0;
    valueAxis.fontSize = 11;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "year";
    series.name = "Visits";
    series.columns.template.propertyFields.stroke = "color"
    series.columns.template.propertyFields.fill = "color"
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",this.biaYearClick,this)

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  biaYearClick(ev) {
    BCMDashboardStore.setDashboardParam(`year=${ev?.target?.dataItem?.dataContext?.year}`)
    this._router.navigateByUrl('/bcm/test-and-exercises');
  }

  getBCPCountByStatus() {
    this._bcmDashboardService.getBCPCountByStatus().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.BCPCountByStatuses.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForBCPCountByStatus()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createPieChartForBCPCountByStatus() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("BCPCountByStatusDiv", am4charts.PieChart);
    chart.data = BCMDashboardStore.BCPCountByStatuses;

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "BCPCountByStatus"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.maxHeight = 50;
    chart.legend.dx=-20;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.truncate = true;
    chart.legend.itemContainers.template.togglable = false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "business_continuity_plan_status";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    // Add label
    chart.innerRadius = am4core.percent(50);

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "BCP Status";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    this._utilityService.detectChanges(this._cdr);
  }

  getStrategyCountByTypes() {
    this._bcmDashboardService.getStrategyCountByTypes().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.StrategyCountByTypes.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForStrategyCountByTypes()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createPieChartForStrategyCountByTypes() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("StrategyCountByTypesDiv", am4charts.PieChart);
    chart.data = BCMDashboardStore.StrategyCountByTypes;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "StrategyCountByTypes"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10;
    // chart.legend.maxWidth = 200;
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;
    chart.legend.dx=-30;
    // chart.legend.labels.template.truncate = false;
    // chart.legend.labels.template.wrap = true;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "type";
    pieSeries.labels.template.text = "{value}"
    pieSeries.labels.template.fontSize =10;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.strategyTypeClick,this)
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

  strategyTypeClick(ev) {
    BCMDashboardStore.setDashboardParam(`&business_continuity_strategy_type_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bcm/business-continuity-strategies');
  }

  getSolutionCountByScores() {
    this._bcmDashboardService.getSolutionCountByScores().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.SolutionCountByScores.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createBarChartForSolutionCountByScores()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createBarChartForSolutionCountByScores() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("BarChartForSolutionCountByScoresDiv", am4charts.XYChart);
    chart.data = BCMDashboardStore.SolutionCountByScores
    chart.numberFormatter.numberFormat = "#";

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "score";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    // categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 11

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Solution Count By Score"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.fontSize = 11

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "score";
    series.name = "Visits";
    series.columns.template.propertyFields.stroke = "color"
    series.columns.template.propertyFields.fill = "color"

    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  getStrategyCountByStatuses() {
    this._bcmDashboardService.getStrategyCountByStatuses().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.StrategyCountByStatuses.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForStrategyCountByStatuses()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createPieChartForStrategyCountByStatuses() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("StrategyCountByStatusesDiv", am4charts.PieChart);
    chart.data = BCMDashboardStore.StrategyCountByStatuses;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "StrategyCountByStatuses"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "business_continuity_strategy_status";
    pieSeries.labels.template.text = "{value}"
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    // Add label
    chart.innerRadius = am4core.percent(50);

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Strategy Status";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.strategyStatusClick,this)
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

  strategyStatusClick(ev) {
    BCMDashboardStore.setDashboardParam(`&bcs_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bcm/business-continuity-strategies');
  }

  getChangeRequestCountByYears() {
    this._bcmDashboardService.getChangeRequestCountByYears().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.ChangeRequestCountByYears.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createChangeRequestCountByYears()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  createChangeRequestCountByYears() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("ChangeRequestCountByYearsDiv", am4charts.XYChart);
    chart.data = BCMDashboardStore.ChangeRequestCountByYears
    chart.numberFormatter.numberFormat = "#";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 11;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.opposite = true;
    valueAxis.renderer.grid.template.location = 0;
    valueAxis.min = 0;
    valueAxis.fontSize = 11;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'total_count';
    series.dataFields.categoryY = "year";
    series.name = 'Visit';
    series.columns.template.padding(0, 0, 10, 0)
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;
    series.columns.template.events.on("hit",this.changeRequestYearClick,this)

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  changeRequestYearClick(ev) {
    BCMDashboardStore.setDashboardParam(`year=${ev?.target?.dataItem?.dataContext?.year}`)
    this._router.navigateByUrl('/bcm/test-and-exercises');
  }

  getTestAndExercisePerformedCounts() {
    this._bcmDashboardService.getTestAndExercisePerformedCounts().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if(BCMDashboardStore.TestAndExercisePerformedCounts.length==0){
        this._utilityService.detectChanges(this._cdr);
      }else{
        this.createPieChartForTestAndExercisePerformedCounts()
        this._utilityService.detectChanges(this._cdr);
      }      
    })
  }

  retrunTestExercisePerformedVsNonPerformedData() {
    let array = []

    BCMDashboardStore.TestAndExercisePerformedCounts.forEach(res => {
      if (res.test_performed_count != 0) {
        let data = {
          "title": '',
          "count": 0
        }
        data.count = res.test_performed_count
        data.title = 'Performed'
        array.push(data)
      }
      if (res.total_count != 0) {
        let data = {
          "title": '',
          "count": 0
        }
        data.count = res.total_count - res.test_performed_count
        data.title = 'Non Performed'
        array.push(data)
      }
    })
    return array
  }

  createPieChartForTestAndExercisePerformedCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("TestAndExercisePerformedCountsDiv", am4charts.PieChart);
    chart.data = this.retrunTestExercisePerformedVsNonPerformedData();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "TestAndExercisePerformedCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;
    chart.legend.dx=-30;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    // chart.legend.valueLabels.template.disabled = true;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "{value}"
    pieSeries.labels.template.fontSize =10;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
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

  ngOnDestroy() {
    am4core.disposeAllCharts();
    this.BCMDashboardStore.dashboardLoaded = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
