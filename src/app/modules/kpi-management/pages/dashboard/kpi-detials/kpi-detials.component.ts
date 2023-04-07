import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KPIDetialsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-detials-dashboard-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { KpiDetialsDashbordService } from 'src/app/core/services/kpi-management/dashboard/kpi-detials/kpi-detials-dashbord.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { autorun, IReactionDisposer } from 'mobx';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { KPIDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-dashbord';

@Component({
  selector: 'app-kpi-detials',
  templateUrl: './kpi-detials.component.html',
  styleUrls: ['./kpi-detials.component.scss']
})
export class KpiDetialsComponent implements OnInit, OnDestroy {
  
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  KpisStore = KpisStore;
  KPIDetialsDashboardStore = KPIDetialsDashboardStore;
  ThemeStructureSettingStore = ThemeStructureSettingStore;

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

  chart1:boolean=true;
  chart2:boolean=true;
  chart3:boolean=true;
  chart4:boolean=true;

  filterSubscription: Subscription = null;

  constructor(
    private _router:Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _kpiDetialsDashbordService: KpiDetialsDashbordService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      KPIDetialsDashboardStore.dashboardLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.allItems();
    });

    am4core.useTheme(am4themes_animated); // Themes begin
    am4core.addLicense("CH199714744");//License key 
    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (!BreadCrumbMenuItemStore.refreshBreadCrumbMenu) {
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name: "kpi_dashboard",
        path: `/kpi-management/dashboard`
      });
    }
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);

    });

    this.allItems();

    RightSidebarLayoutStore.filterPageTag = 'KPI_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'kpi_management_status_ids',
      'kpi_category',
      'kpi_type',
      'kpi_review_frequency'
    ]);
  }

  allItems(){
    this.getKpiCountByStatus();//Kpi status Dount chart- 1
    this.getkpiPerformancebyTypeCounts();//Stacked Bar Chart -2
    this.getKpiCountByCategory();//kpi by category Pie chart- 3
    this.getKpiTopPerforming();
    this.getKpiLeastPerforming();
    this.getKpiCountByDepartment();//kpi By Department simple bar chart- 4
  }

  gotoKpiDetails(id){
    KpisStore.setKpiId(id);
    this._router.navigateByUrl('kpi-management/kpis/'+id);
  }

  getKpiCountByStatus(){
    this._kpiDetialsDashbordService.getKpiCountByStatus().subscribe(res=>{
      setTimeout(() => {
        this.kpiStatusDonutChart(false)//Kpi status - 1
      }, 0);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getkpiPerformancebyTypeCounts(){
    this._kpiDetialsDashbordService.getkpiPerformancebyTypeCounts().subscribe(res=>{
      setTimeout(() => {
        this.kpiByTypeStackedBarChart(false)//kpi by type - 2
      }, 0);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiCountByCategory(){
    this._kpiDetialsDashbordService.getKpiCountByCategory().subscribe(res=>{
      setTimeout(() => {
        this.kpiBycategoryPieChart(false);//kpi by category - 3
      }, 0);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiCountByDepartment(){
    this._kpiDetialsDashbordService.getKpiCountByDepartment().subscribe(res=>{
      setTimeout(() => {
        this.kpiByDepartment(false); //kpi By Department - 4
      }, 0);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiTopPerforming(){
    this._kpiDetialsDashbordService.getKpiTopPerforming().subscribe(res=>{  
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiLeastPerforming(){
    this._kpiDetialsDashbordService.getKpiLeastPerforming().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

    /*
    @ Chart Postion :- 4
    @ Chart Name    :- Kpi by Department
    @ Chart used    :- simple bar Chart
  */

  kpiByDepartment(chartEnable:boolean){    
    // Create chart instance
    var chart = am4core.create("kpiByDepartmentBardiv", am4charts.XYChart);
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix = this._helperService.translateToUserLanguage("kip_by_department");
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";
    // Add data
    chart.data = KPIDetialsDashboardStore.KpiCountByDepartment;
    chart.numberFormatter.numberFormat = "#";
    chart.colors.list = [
      am4core.color("#67b7dc"),
    ];
    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.maxPrecision = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";
    valueAxis.fontSize=12;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.fontSize = 12;

    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 200;
    label.tooltipText = "{code}";

    categoryAxis.events.on("sizechanged", function(ev) {
      var axis = ev.target;
      var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      if (cellWidth < axis.renderer.labels.template.maxWidth) {
        axis.renderer.labels.template.rotation = -45;
        axis.renderer.labels.template.horizontalCenter = "right";
        axis.renderer.labels.template.verticalCenter = "middle";
      }
      else {
        axis.renderer.labels.template.rotation = 0;
        axis.renderer.labels.template.horizontalCenter = "middle";
        axis.renderer.labels.template.verticalCenter = "top";
      }
    });

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "code";
    series.name = "Department";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.columns.template.events.on("hit",  this.departmentRouting, this);
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
    if(chartEnable){
      this.chart4=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  /*
    @ Chart Postion :- 3
    @ Chart Name    :- Kpi by category
    @ Chart used    :- simple Pie Chart
  */
  kpiBycategoryPieChart(chartEnable:boolean){
    var chart = am4core.create("kpiByCategoryPiechart", am4charts.PieChart);
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix =  this._helperService.translateToUserLanguage("kpi_by_category");
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

    // Add data
    chart.data = KPIDetialsDashboardStore.kpiCountByCategory;
   
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 0;
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;    

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    var colorSet = new am4core.ColorSet();
    colorSet.list = ["#67b7dc"].map(function(color) {
      return am4core.color(color);
    });
    pieSeries.colors = colorSet;

    chart.hiddenState.properties.radius = am4core.percent(0);


    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10
    chart.legend.maxHeight = 50;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
    chart.legend.labels.template.maxWidth = 100;
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    if(chartEnable){
      this.chart3=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  /*
    @ Chart Postion :- 2
    @ Chart Name    :- Kpi by Type
    @ Chart used    :- Stacked Bar Chart
  */

  kpiByTypeStackedBarChart(chartEnable:boolean){
    var chart = am4core.create("kpiByTypeStackedBarChartDiv", am4charts.XYChart);
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix =  this._helperService.translateToUserLanguage("kpi_by_type");
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

    // Add data
    chart.data = KPIDetialsDashboardStore.KpiPerformancebyTypeCounts;
    chart.numberFormatter.numberFormat = "#";
    
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.fontSize = 10
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    chart.colors.list = [
      am4core.color("#19c268"),
      am4core.color("#ffbb00"),
      am4core.color("#f9384b"),
    ];

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.line.strokeOpacity = 1;
    categoryAxis.renderer.line.strokeWidth = 1;
    categoryAxis.renderer.line.stroke = am4core.color("#d3d3d3");
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.inversed = true;
    categoryAxis.fontSize = 10
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.fontSize=12;
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";

    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "title";
      series.stacked = true;
      series.name = name;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryY}: {valueX}";
      
    }

    createSeries("excellent_count", this._helperService.translateToUserLanguage("excellent"));
    createSeries("good_count", this._helperService.translateToUserLanguage("good"));
    createSeries("average_count", this._helperService.translateToUserLanguage("average"));

    if(chartEnable){
      this.chart2=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }
    
  /*
    @ Chart Postion :- 1
    @ Chart Name    :- Kpi Status
    @ Chart used    :- Dount Chart
  */

  kpiStatusDonutChart(chartEnable:boolean){
    var chart = am4core.create("kpiStatusDountChart", am4charts.PieChart);
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix = this._helperService.translateToUserLanguage("kpi_status");
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

    // Add data
    chart.data =  KPIDetialsDashboardStore.kpiCountByStatus;
    
    
    // Set inner radius
    chart.innerRadius = am4core.percent(50);
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.events.on("hit", this.KPIStatus, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    // Add label
    chart.innerRadius = 50;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage("kpi_status");
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'left'
    chart.legend.fontSize = 10
    chart.legend.maxHeight = 50;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "right"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
    chart.legend.labels.template.maxWidth = 100;
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    if(chartEnable){
      this.chart1=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  prgressSorting(progress){
    let pro= progress.slice(0,-1);
    
    if(pro>10)
      return progress;
    else
      return '10%';
  }

  //Navigation
  KPIStatus(ev){    
    KPIDashboardStore.setDashboardParam(`&kpi_management_status_ids=${(ev?.target?.dataItem?.dataContext?.id)}`)
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

  departmentRouting(ev){
    KPIDashboardStore.setDashboardParam(`&department_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

  //Navigation ends

  ngOnDestroy(){
    am4core.disposeAllCharts(); 
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    KPIDetialsDashboardStore.unsetKpiCountByCategory();
    KPIDetialsDashboardStore.unsetKpiCountByDepartment();
    KPIDetialsDashboardStore.unsetKpiCountByStatus();
    KPIDetialsDashboardStore.unsetKpiLeastPerforming();
    KPIDetialsDashboardStore.unsetKpiTopPerforming();
    KPIDetialsDashboardStore.unsetKpiPerformancebyTypeCounts();

    this.chart1=true;
    this.chart2=true;
    this.chart3=true;
    this.chart4=true;

    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}