import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { KpiDashboardService } from 'src/app/core/services/kpi-management/dashboard/kpi-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { KPIDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-dashbord';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { KpiTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-types-store';
import { KpiTypesService } from 'src/app/core/services/masters/strategy/kpi-types/kpi-types.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { KPIDetialsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-detials-dashboard-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { KpiDetialsDashbordService } from 'src/app/core/services/kpi-management/dashboard/kpi-detials/kpi-detials-dashbord.service';
@Component({
  selector: 'app-kpi-main-dashbord',
  templateUrl: './kpi-main-dashbord.component.html',
  styleUrls: ['./kpi-main-dashbord.component.scss']
})
export class KpiMainDashbordComponent implements OnInit, OnDestroy {
  AuthStore =AuthStore;
  reactionDisposer: IReactionDisposer;
  KPIDashboardStore = KPIDashboardStore;
  KpiTypesMasterStore = KpiTypesMasterStore;
  KPIDetialsDashboardStore = KPIDetialsDashboardStore;
  KpisStore = KpisStore;

  chart1:boolean=true;
  chart2:boolean=true;
  chart3:boolean=true;
  chart4:boolean=true;

  selectedSection = 0;
  // clientOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: false,
  //   touchDrag: true,
  //   pullDrag: false,
  //   dots: true,
  //   navSpeed: 700,
  //   autoplay: true,
  //   navText: ['<', '>'],
  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     400: {
  //       items: 1,
  //     },
  //     740: {
  //       items: 1,
  //     },
  //     940: {
  //       items: 1,
  //     },
  //   },
  //   nav: false,
  // };

  filterSubscription: Subscription = null;

  constructor(
    private _router:Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _kpiTypesService: KpiTypesService,//kpi type master-SM
    private _helperService: HelperServiceService,
    private _kpiDashboardService: KpiDashboardService,
    private _eventEmitterService: EventEmitterService,
    private _kpiDetialsDashbordService: KpiDetialsDashbordService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      KPIDashboardStore.dashboardLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.allItems();
    });

    this.reactionDisposer = autorun(() => {

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    });


    am4core.useTheme(am4themes_animated); // Themes begin
    am4core.addLicense("CH199714744");//License key 

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
    this.getKpiCounts();//1
    this.getKpiImprovementPlanCounts();//2
    this.getKpiByPerformanceCounts();//Dount chart -3
    this.getKpiPerformanceByDepartmentCounts();//Stacked Column Chart vertical-4
    this.getKpiCountByStatus();
    this.getKpiCountByDepartment();
    this.getKpiTopPerforming();
    // this.getKpisByType();//5
    // this.getKpiPerformanceByTypeCounts();//Stacked Bar Chart chart horizontal-6
  }

  gotoKpiDetails(id){
    KpisStore.setKpiId(id);
    this._router.navigateByUrl('kpi-management/kpis/'+id);
  }

  //1
  getKpiCounts(){
    this._kpiDashboardService.getKpiCounts().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiTopPerforming(){
    this._kpiDetialsDashbordService.getKpiTopPerforming().subscribe(res=>{  
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getKpiCountByStatus(){
    this._kpiDetialsDashbordService.getKpiCountByStatus().subscribe(res=>{
      setTimeout(() => {
        this.kpiStatusDonutChart(false)//Kpi status - 1
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

  //2
  getKpiImprovementPlanCounts(){
    this._kpiDashboardService.getKpiImprovementPlanCounts().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  //3
  getKpiByPerformanceCounts(){
    this._kpiDashboardService.getKpiByPerformanceCounts().subscribe(res=>{
      setTimeout(() => {
        this.kpiPerformanceDountChart(false);//3
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //4
  getKpiPerformanceByDepartmentCounts(){
    this._kpiDashboardService.getKpiPerformanceByDepartmentCounts().subscribe(res=>{
      setTimeout(() => {
        this.kpiPerformanceByDepartmentCounts(false);//4
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  kpiStatusDonutChart(chartEnable:boolean){
    var chart = am4core.create("kpiStatusDountChart", am4charts.PieChart);
        
        chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;// left to rihgth chart breaking issue (arabic support)
        
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

  KPIStatus(ev){    
    KPIDashboardStore.setDashboardParam(`&kpi_management_status_ids=${(ev?.target?.dataItem?.dataContext?.id)}`)
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

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

  departmentRouting(ev){
    KPIDashboardStore.setDashboardParam(`&department_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

  //5
  getKpisByType(){
    this._kpiTypesService.getAllItems().subscribe((res) =>{ 
      if(res.length>0){
        this.getKpiByTypeTableDetials(1,res[0]?.id);
      }
      else KPIDashboardStore.kpiByTypesloaded = true;
      setTimeout(() => 
      this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  //5 -table detials
  getKpiByTypeTableDetials(newPage: number = null,id){
    
    this._kpiDashboardService.getKpisByType(id).subscribe(res=>{

      this._utilityService.detectChanges(this._cdr);
    });

    if (newPage) KPIDashboardStore.setCurrentPage(newPage);
    this._kpiDashboardService.getKpisByType(false,`?kpi_type_ids=${id}`).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  //6
  getKpiPerformanceByTypeCounts(){
    this._kpiDashboardService.getKpiPerformanceByTypeCounts().subscribe(res=>{
      setTimeout(() => {
        this.kpiPerformanceByTypeCounts(false);
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    });
  }

    /*
    @ Chart Postion :- 6
    @ Chart Name    :- kpi Performance By Type Counts
    @ Chart used    :- Stacked Bar Chart
    @ api           :- kpi-performance-by-type-counts
  */

  kpiPerformanceByTypeCounts(chartEnable:boolean){
    var chart = am4core.create("kpiPerformanceByTypeCountsChartDiv", am4charts.XYChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix =this._helperService.translateToUserLanguage("kpi_performance_by_type");
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add data
    chart.data = KPIDashboardStore.kpiPerformanceByTypeCounts;
    chart.numberFormatter.numberFormat = "#";
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.fontSize = 10;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

    chart.colors.list = [
      am4core.color("#19c268"),
      am4core.color("#ffbb00"),
      am4core.color("#f9384b"),
    ];

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
    valueAxis.min = 0;
    valueAxis.fontSize=12;
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
      this.chart3=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  /*
    @ Chart Postion :- 4
    @ Chart Name    :- kpi Performance By Department Counts
    @ Chart used    :- Stacked Column Chart
    @ api           :- kpi-performance-by-department-counts
  */
  kpiPerformanceByDepartmentCounts(chartEnable:boolean){
    // Create chart instance
    var chart = am4core.create("kpiPerformanceByDepartmentCountsDiv", am4charts.XYChart);

    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;// left to rihgth chart breaking issue (arabic support)

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix =  this._helperService.translateToUserLanguage("kpi_performance_by_department");
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add data
    chart.data = KPIDashboardStore.KpiPerformanceByDepartmentCounts;

    chart.colors.list = [
      am4core.color("#19c268"),
      am4core.color("#ffbb00"),
      am4core.color("#f9384b"),
    ];

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.fontSize = 10;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

  
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.fontSize = 12;

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.maxPrecision = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";
    valueAxis.fontSize=12;
        
    this.createSeries("excellent_count", this._helperService.translateToUserLanguage("excellent"),chart);
    this.createSeries("good_count", this._helperService.translateToUserLanguage("good"),chart);
    this.createSeries("average_count", this._helperService.translateToUserLanguage("average"),chart);

    if(chartEnable){
      this.chart2=false;
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Create series
  createSeries(field, name,chart) {
      
    // Set up series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "code";
    series.sequencedInterpolation = true;
    
    // Make it stacked
    series.stacked = true;
    
    // Configure columns
    series.columns.template.width = am4core.percent(60);
    series.columns.template.events.on("hit",  this.performanceDepartmentRouting, this);
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
    
    return series;
  }

  /*
    @ Chart Postion :- 3
    @ Chart Name    :- kpi Performance
    @ Chart used    :- Dount Chart
    @ api           :- kpi-by-performance-counts
  */

  kpiPerformanceDountChart(chartEnable:boolean){
    var chart = am4core.create("kpiPerformanceDountChart", am4charts.PieChart);

        chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;// left to rihgth chart breaking issue (arabic support)

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.filePrefix = this._helperService.translateToUserLanguage("KPI_performance");
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";
    // Add data
    chart.data =  [ 
      {
        "title": this._helperService.translateToUserLanguage("average"),
        "count": KPIDashboardStore.kpiByPerformanceCounts?.average_count,
        "color": am4core.color("#DF4A4A")
      }, {
        "title": this._helperService.translateToUserLanguage("good"),
        "count": KPIDashboardStore.kpiByPerformanceCounts?.good_count,
        "color": am4core.color("#FFE026")
      }, {
        "title": this._helperService.translateToUserLanguage("excellent"),
        "count": KPIDashboardStore.kpiByPerformanceCounts?.excellent_count,
        "color": am4core.color("#24C871")
      }
    ];
    
    // Set inner radius
    chart.innerRadius = am4core.percent(50);
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.events.on("hit", this.KPIPerformance, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    // Add label
    // chart.innerRadius = 70;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text =  this._helperService.translateToUserLanguage("KPI_performance");
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

  goToKpiDetialsPage(){
    this._router.navigateByUrl('kpi-management/dashboard/kpi-detials');
  }

  goToPendingReviewsPage(){
    this._router.navigateByUrl('kpi-management/dashboard/peending-reviews');
  }

  getKpiType(index,id){
    this.selectedSection=index;

    KPIDashboardStore.unSetKpiBytypes();
    this.getKpiByTypeTableDetials(1,id);
  }

  prgressSorting(progress){
    let pro= progress.slice(0,-1);
    
    if(pro>10)
      return progress;
    else
      return '10%';
  }

  //Navigation starts

  redirectToKPIListPage(count:number=0, status){
    if(count!=0){

      switch (status) {
        case 'draft':
            KPIDashboardStore.setDashboardParam('&kpi_management_status_ids=1');
          break;
        case 'in-review':
            KPIDashboardStore.setDashboardParam('&kpi_management_status_ids=2');
          break;
        case 'reject':
            KPIDashboardStore.setDashboardParam('&kpi_management_status_ids=4');
          break;
        case 'approved':
            KPIDashboardStore.setDashboardParam('&kpi_management_status_ids=5');
          break;
        default:
            KPIDashboardStore.setDashboardParam('');
          break;
      }
      this._router.navigateByUrl('/kpi-management/kpis');
    }else{
      KPIDashboardStore.unsetDashboardParam();
    }
  }

  redirectToImprovementListPage(count:number=0, status){
    if(count!=0){

      switch (status) {
        case 'open':
            KPIDashboardStore.setImprovementDashboardParam('&kpi_management_kpi_improvement_plan_status_ids=1,2,3');
          break;
        case 'closed':
            KPIDashboardStore.setImprovementDashboardParam('&kpi_management_kpi_improvement_plan_status_ids=4,5');
          break;
        case 'in-review':
            KPIDashboardStore.setImprovementDashboardParam('&kpi_management_kpi_improvement_plan_status_ids=2');
          break;
        case 'overdue':
            KPIDashboardStore.setImprovementDashboardParam('&kpi_management_kpi_improvement_plan_status_types=overdue&kpi_management_kpi_improvement_plan_status_ids=1');
          break;
        default:
            KPIDashboardStore.setImprovementDashboardParam('');
          break;
      }
      this._router.navigateByUrl('/kpi-management/improvement-plans');
    
    }else{
      KPIDashboardStore.unsetImprovementDashboardParam();
    }
  }

  KPIPerformance(ev){
    KPIDashboardStore.setDashboardParam(`&performance_types=${(ev?.target?.dataItem?.dataContext?.title).toLowerCase()}`)
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

  performanceDepartmentRouting(event){
    if(event.target.dataItem.component?.dataFields?.valueY=='average_count'){
      KPIDashboardStore.setDashboardParam(`&department_ids=${(event?.target?.dataItem?.dataContext?.id)}&performance_types=average`)
    }else if(event.target.dataItem.component?.dataFields?.valueY=='excellent_count'){
      KPIDashboardStore.setDashboardParam(`&department_ids=${(event?.target?.dataItem?.dataContext?.id)}&performance_types=excellent`)
    }else{
      KPIDashboardStore.setDashboardParam(`&department_ids=${(event?.target?.dataItem?.dataContext?.id)}&performance_types=good`)
    }
    this._router.navigateByUrl(`/kpi-management/kpis`)
  }

  //Navigation ends

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    am4core.disposeAllCharts();
    KPIDashboardStore.unsetKpiByPerformanceCounts();
    KPIDashboardStore.unsetKpiCounts();
    KPIDashboardStore.unsetKpiImprovementPlanCounts();
    KPIDashboardStore.unsetKpiPerformanceByDepartmentCounts();
    KPIDashboardStore.usetKpiPerformanceByTypeCounts();
    KpiTypesMasterStore.unsetAllKpiTypes();// kpi master 
    KPIDashboardStore.unSetKpiBytypes();

    this.chart1=true;
    this.chart2=true;
    this.chart3=true;
    this.chart4=true;

    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
