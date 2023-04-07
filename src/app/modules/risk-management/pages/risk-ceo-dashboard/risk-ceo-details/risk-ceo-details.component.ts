import { isPlatformBrowser } from '@angular/common';
import {  ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { RiskCeoDashboardService } from 'src/app/core/services/risk-management/risk-ceo-dashboard/risk-ceo-dashboard.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskStatusMasterStore } from 'src/app/stores/masters/risk-management/risk-status-store';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-risk-ceo-details',
  templateUrl: './risk-ceo-details.component.html',
  styleUrls: ['./risk-ceo-details.component.scss']
})
export class RiskCeoDetailsComponent implements OnInit, OnDestroy {

  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  RightSidebarLayoutStore = RightSidebarLayoutStore;
  CeoRiskDashboardStore = CeoRiskDashboardStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  RiskDashboardStore = RiskDashboardStore;
  LikelihoodStore = LikelihoodStore;
  ImpactStore = ImpactStore;
  activeRow;
  activeColumn;
  riskChartInfo = "bar";
  showNoDataMap:boolean=false;
  page = 1;
  pageSize = 5;
  selectedIndex: number = 0;
  filterSubscription: Subscription = null;
  reactionDisposer: IReactionDisposer;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _riskCeoDashboardService:RiskCeoDashboardService,
    private _likelihoodService:LikelihoodService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _router: Router,
    private _impactService:ImpactService,
    private _helperService: HelperServiceService
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    CeoRiskDashboardStore.dashboardLoaded = false;
    RightSidebarLayoutStore.showFilter = true;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/risk-management/ceo-dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.CeoRiskDashboardStore.heatMapLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.getDetails();

    });
    ImpactStore.orderBy = "asc";
    ImpactStore.orderItem="score";

    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this.getDetails();
  }

  ngAfterViewInit(){
    CeoRiskDashboardStore.dashboardLoaded = true;
    this.getCharts()
  }

  getDetails(){
    this.getCharts()
    this.getRiskCountByCategories()
    this.getRiskCountByStatus()
    this.getRiskCountBySources()
    this.getRiskHeatMap()
  }

  getCharts() {
    setTimeout(() => {
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createInnerPieChartForRiskCategory();
        this.createPieChartForRiskStatus();
        this.createBarChartForRisk()
      });
    }, 1000);
  }

  getRiskHeatMap(){
    this._likelihoodService.getItems().subscribe(res=>{
    })

    this._riskCeoDashboardService.getRiskHeatMap().subscribe(res=>{
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getRiskCountByCategories(){
    this._riskCeoDashboardService.getRiskCountByCategories().subscribe(res=>{
      this.createInnerPieChartForRiskCategory;
    })
  }

  getRiskCountByStatus(){
    this._riskCeoDashboardService.getRiskCountByStatuses().subscribe(res=>{
      this.createPieChartForRiskStatus();
    })
  }

  getRiskCountBySources(){
    this._riskCeoDashboardService.getRiskCountBySources().subscribe(res=>{
      this.createBarChartForRisk()
    })
  }

  redirectToHeatMap(risk_score,num?,column?,count=0){
    if(count!=0){
      RiskDashboardStore.setRiskScore(risk_score)
      RiskDashboardStore.setActiveRow(num)
      RiskDashboardStore.setActiveColumn(column)
      this._router.navigateByUrl('/risk-management/risk-heat-map');
    }
  }

  createPieChartForRiskStatus() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartStatus", am4charts.PieChart);
    chart.data = CeoRiskDashboardStore.riskCountByStatus;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RisksCategories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
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
    chart.legend.labels.template.fontSize = 14;    
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "risk_statuses";
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
  // ==============================================
  createBarChartForRisk(){
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    chart.data = CeoRiskDashboardStore.riskCountBySources
    chart.maskBullets = false;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "risk_sources";
    categoryAxis.renderer.grid.template.opacity = 0;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.line.strokeOpacity = 0.5;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.renderer.labels.template.text
    
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Risks"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    // valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.cellStartLocation = 0.3
    valueAxis.renderer.cellEndLocation = 0.7
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueX = "count";
    series.dataFields.categoryY = "risk_sources";
    series.calculatePercent = true;
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.propertyFields.stroke="color"
    series.columns.template.propertyFields.fill = "color"
    // series.padding(0,20,0,20)

    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueX.percent.formatNumber('#.0')}%";
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.fontSize=12

    var bullet = series.bullets.push(new am4charts.LabelBullet());
    bullet.label.text = "{valueX}"
    bullet.label.horizontalCenter = "right";
    bullet.locationX = 1;
    // bullet.label.fontWeight="bold"
    bullet.label.fontSize=12
    bullet.paddingLeft = -5

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    var legend = new am4charts.Legend();
    legend.parent = chart.chartContainer;
    legend.itemContainers.template.togglable = false;
    legend.dy = 15;
    legend.labels.template.fontSize = 10
    legend.width = 500;
    // legend.marginTop = 5;
    legend.maxHeight = 40;
    legend.scrollable = true;
    legend.valueLabels.template.align = "left"
    legend.valueLabels.template.textAlign = "end"
    legend.itemContainers.template.padding(3,0,3,0);

    let markerTemplate = legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    
    series.events.on("ready", function(ev) {
      var legenddata = [];
      series.columns.each(function(columns) {
        legenddata.push({
          name: columns.dataItem?.categories.categoryY,
          fill: columns.fill
        });
      });
      legend.data = legenddata;
    });
    var cellSize = 28;
    chart.events.on("datavalidated", function(ev) {
      
      // Get objects of interest
      var chart = ev.target;
      var categoryAxis = chart.yAxes.getIndex(0);
      
      // Calculate how we need to adjust chart height
      var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

      // get current chart height
      var targetHeight = chart.pixelHeight + adjustHeight;

      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    legend.position="top"
    this._utilityService.detectChanges(this._cdr);
  }

  createInnerPieChartForRiskCategory() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = CeoRiskDashboardStore.riskCountByCategories;
    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RisksCategories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Add label
    chart.innerRadius = 50;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Risks";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.labels.template.fontSize = 14;
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

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "risk_category";
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

  ngOnDestroy() {
    CeoRiskDashboardStore.dashboardLoaded = false;
  }

}
