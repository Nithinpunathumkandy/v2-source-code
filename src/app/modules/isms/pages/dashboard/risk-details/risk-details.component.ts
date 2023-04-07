import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { IsmsDashboardService } from 'src/app/core/services/isms/dashboard/isms-dashboard.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html'
})
export class RiskDetailsComponent implements OnInit {

  activeRow=0;
  activeColumn=0;
  ISMSDashboardStore = ISMSDashboardStore;
  reactionDisposer: IReactionDisposer;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _ismsDashboardService: IsmsDashboardService,
    private _helperService: HelperServiceService,
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof RiskDetailsComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null , submenuItem: { type: 'close', path: "/isms/dashboard" } },    
    
      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
    
     
    })
    ISMSDashboardStore.dashboardLoaded = false;
    this.getDetails();
  }

  ngAfterViewInit(){
    ISMSDashboardStore.dashboardLoaded = true;
    this.getCharts()
  }

  getDetails(){
    this.getCharts()
    this.getRiskCountByCategories()
    this.getRiskCountByStatus()
    this.getRiskCountBySources()
    this.getRiskHeatMap();
    this.getRiskRiskTreatment();
    this.getRiskAgeningStatusCount();
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

  redirectToHeatMap(risk_score,num?,column?,count=0){
    if(count!=0){
      ISMSDashboardStore.setRiskScore(risk_score)
      ISMSDashboardStore.setActiveRow(num)
      ISMSDashboardStore.setActiveColumn(column)
      this._router.navigateByUrl('/isms/isms-risk-heat-map');
    }
  }

  getRiskCountByCategories(){
    this._ismsDashboardService.getIsmsRiskCategories().subscribe(res=>{
      this.createInnerPieChartForRiskCategory;
    })
  }

  getRiskCountByStatus(){
    this._ismsDashboardService.getIsmsRiskStatuses().subscribe(res=>{
      this.createPieChartForRiskStatus();
    })
  }

  getRiskCountBySources(){
    this._ismsDashboardService.getIsmsRiskSource().subscribe(res=>{
      this.createBarChartForRisk()
    })
  }

  getRiskHeatMap(){
    this._ismsDashboardService.getIsmsRiskHeatMap().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskAgeningStatusCount(){
    this._ismsDashboardService.getIsmsRiskAgeningStatusCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskRiskTreatment(){
    this._ismsDashboardService.getIsmsRiskTreatmentProgressCount().subscribe(res=>{
      setTimeout(() => {
        this.createRiskTreatmentPieChart();
    }, 1000);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createPieChartForRiskStatus() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartStatus", am4charts.PieChart);
    chart.data = ISMSDashboardStore.IsmsRiskStatuses;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RisksCategories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.labels.template.fontSize = 14;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;
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
    chart.data = ISMSDashboardStore.ismsRiskSource
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
    legend.labels.template.fontSize = 14
    legend.width = 500;
    let markerTemplate = legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;

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
    var cellSize = 40;
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
    chart.data = ISMSDashboardStore.ismsRiskCategories;
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
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;
    
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



  createRiskTreatmentPieChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartRiskTreatment", am4charts.PieChart);
    chart.data = ISMSDashboardStore.ismsRiskTreatmentProgressCount;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RisksCategories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.labels.template.fontSize = 14;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "status";
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


  checkDataIsPresent(dataArray:any[],field){
    if(dataArray.length > 0){
      let dataNotPresent = 0;
      for(let i of dataArray){
        if(i[field] == 0) dataNotPresent++;
      }
      if(dataNotPresent == dataArray.length) return false;
      else return true;
    }
    else{
      return false;
    }
  }

}
