import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HumanCapitalDashboardService } from 'src/app/core/services/human-capital/dashboard/human-capital-dashboard.service';
import { HumanCapitalDashboardStore } from 'src/app/stores/human-capital/dashboard/dashboard-store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-human-capital-dashboard-page',
  templateUrl: './human-capital-dashboard.page.html',
  styleUrls: ['./human-capital-dashboard.page.scss']
})
export class HumanCapitalDashboardPage implements OnInit, OnDestroy {

  AuthStore = AuthStore
  HumanCapitalDashboardStore = HumanCapitalDashboardStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  selectedChartId:number
  filterSubscription: Subscription = null;

  constructor(
    private _router:Router,
    private _helperService: HelperServiceService,
    private _HCDashboardService: HumanCapitalDashboardService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit() {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.HumanCapitalDashboardStore.loaded = false;
      this.getAll();
      setTimeout(() => {
        HumanCapitalDashboardStore.loaded = true;
        }, 1000);
    })

    this.getAll();
    RightSidebarLayoutStore.filterPageTag = 'hc_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'role_ids',
      'designation_ids',
    ]);
  }

  getAll() {
    this.getCoutByRole()
    this.getCoutByDesignation()
    this.getCountByDepartment()
    this.getTotalCount()
  }

  routeToQlikDashboard(){
    this._router.navigateByUrl('human-capital/qlik-dashboard')
  }

  getCoutByRole() {
    this._HCDashboardService.getUserCountByRole().subscribe(res => {
      if (HumanCapitalDashboardStore.countByRole.length != 0) {
        this.createPieChartForRole()
      }
    })
  }

  getCoutByDesignation() {
    this._HCDashboardService.getUserCountByDesignation().subscribe(res => {
      if (HumanCapitalDashboardStore.countByDesignation.length != 0) {
        this.designationChart()
      }
    })
  }

  getCountByDepartment() {
    this._HCDashboardService.getUserCountByDepartment().subscribe(res => {
      if (HumanCapitalDashboardStore.countByDepartment.length != 0) {
        this.getBarChartForUserCount()
      }
    })
  }

  getTotalCount() {
    this._HCDashboardService.getTotalCounts().subscribe()
  }

  getBarChartForUserCount() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    let dataArray = this._helperService.getArrayProcessed(HumanCapitalDashboardStore.countByDepartment, null);
    for (let i of dataArray) {
      chart.data.push({
        "code": i.code,
        "count": i.count,
      });
    }
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.3;
    categoryAxis.renderer.cellEndLocation = 0.5;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.fontSize = 11;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Human Capital"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.maxWidth = 80;
    categoryAxis.renderer.labels.template.dx = -20
    // categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.tooltipText = '{category}';
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize= 11;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "code";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  barChartRedirection(event){
    this.selectedChartId = event.target.column.dataItem.dataContext.id
    HumanCapitalDashboardStore.setHCDashboardParam('is_registered=true&is_inherent=true&department_ids='+this.selectedChartId)
    this._router.navigateByUrl('/risk-management/risks');
  }

  createPieChartForRole() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = HumanCapitalDashboardStore.countByRole;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Role"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Role";
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.position = "bottom"
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.truncate = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "role";
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
  }

  pieChartClicked(ev){
    this.selectedChartId=ev.target.dataItem.dataContext.id
    this.routeToUsers("role")
  }

  routeToUsers(type){
    console.log(this.selectedChartId,type)
    if(type=="designation"){
      HumanCapitalDashboardStore.setHCDashboardParam(`&designation_ids=${this.selectedChartId}`)
    }else{
      HumanCapitalDashboardStore.setHCDashboardParam(`&role_ids=${this.selectedChartId}`)
    }
    console.log(HumanCapitalDashboardStore.dashboardParam)
    //this.selectedChartId = event.target.column.dataItem.dataContext.id
    SubMenuItemStore.userGridSystem=true    
    this._router.navigateByUrl('/human-capital/users');
  }

  designationChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("designationchart", am4charts.XYChart);
    let dataArray = this._helperService.getArrayProcessed(HumanCapitalDashboardStore.countByDesignation, null);
    for (let i of dataArray) {
      chart.data.push({
        "designation": i.designation,
        "count": i.count,
        "id":i.id
      });
    }

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.fontSize = 11;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.dataFields.category = "designation";
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;
    //categoryAxis.renderer.cellStartLocation = 0.1;
    //categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.maxWidth = 80;
    //categoryAxis.renderer.labels.template.dx = -20
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.tooltipText = '{category}';
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";

    //scrollbar
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.fontSize= 11;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "designation";
    lineSeries.dataFields.valueY = "count";
    lineSeries.tooltipText = "count: {valueY.value}";
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeWidth = 3;

    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;
    bullet.events.on("hit",this.lineChartClicked,this)

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Role"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
  }

  lineChartClicked(event){
    this.selectedChartId=event.target.dataItem.dataContext.id
    this.routeToUsers("designation")
  }
  
  redirectUsersList(){
    this._router.navigateByUrl('/human-capital/users');
  }

  redirectDepartmentList(){
    this._router.navigateByUrl('/human-capital/departments');
  }

  redirectRoleList(){
    this._router.navigateByUrl('/security/roles');
  }

  redirectDesignationList(){
    this._router.navigateByUrl('/masters/designations');
  }

  redirectSectionList(){
    this._router.navigateByUrl('/masters/sections');
  }
  redirectDivisionList(){
    this._router.navigateByUrl('/masters/divisions');
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    HumanCapitalDashboardStore.loaded=false
    //HumanCapitalDashboardStore.unsetDashboardParam()
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
