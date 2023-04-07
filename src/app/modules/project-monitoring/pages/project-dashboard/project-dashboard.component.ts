import { ITheme } from '@amcharts/amcharts4/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild,OnDestroy } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectDashboardService } from 'src/app/core/services/project-monitoring/project-dashboard/project-dashboard.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectDashboardStore } from 'src/app/stores/project-monitoring/project-dashboard-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit,OnDestroy {
  @ViewChild('chartProjectCount') chartProjectCount: ElementRef;
  @ViewChild('barChartProjectByYears') barChartProjectByYears: ElementRef;
  @ViewChild('chartProjectByTypes') chartProjectByTypes: ElementRef;
  @ViewChild('chartProjectByPriority') chartProjectByPriority: ElementRef;
  @ViewChild('chartProjectByContractTypes') chartProjectByContractTypes: ElementRef;
  @ViewChild('barChartProjectByDepartment') barChartProjectByDepartment: ElementRef;
  @ViewChild('chartProjectIssuesByDepartment') chartProjectIssuesByDepartment: ElementRef;
  @ViewChild('chartProjectIssuesByStatuses') chartProjectIssuesByStatuses: ElementRef;
  @ViewChild('barChartBudgetYears') barChartBudgetYears: ElementRef;
  @ViewChild('barChartBudgetDepartment') barChartBudgetDepartment: ElementRef;
  @ViewChild('barChartMilestoneDepartments') barChartMilestoneDepartments: ElementRef;
  @ViewChild('barChartMilestoneMonths') barChartMilestoneMonths: ElementRef;

  ProjectDashboardStore = ProjectDashboardStore;
  showNoDataMap: boolean = false;
  projectByDepartmentChart="bar";
  projectByContractTypes="pie";
  projectByPriority="bar";
  projectByYears="bar";
  projectCounts="pie";
  projectIssuesByStatuses="pie";

  count: number=null;
  filterSubscription: Subscription = null;
  emptyList = "no_data_found";

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _projectDashboardService: ProjectDashboardService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
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
    ProjectDashboardStore.dashboardLoaded = false;
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectDashboardStore.dashboardLoaded = false;
      this.getProjectCount();
      this.getProjectByDepartment();
      this.getProjectByContractTypes();
      this.getProjectByPriority();
      this.getProjectByYears();
      this.getProjectIssuesByStatuses();
      this.getBudgetByYears();
      this.getBudgetByDepartments();
      this.getMilestoneByMonths();
      this.getMilestoneByDepartments();
      this.getProjectByTypes();
      this.getProjectIssuesByDepartment();
      setTimeout(() => {
        this.ProjectDashboardStore.dashboardLoaded = true;
      }, 1000);
    });
   
    setTimeout(() => {
      ProjectDashboardStore.dashboardLoaded = true;
    }, 500);
    this._utilityService.detectChanges(this._cdr);
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      if (!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById) {
        this._themestructureService.getItems().subscribe(() => {
          this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
            this.getAll();
            this.getCharts();
          });
        })
      }
      else {
        this.getAll();
        this.getCharts();
      }
      // setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'project_main_dashbord';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',
          // 'project_ids',
          'project_monitoring_status_ids',
          // 'project_type_ids',
          // 'project_category_ids',
          'project_contract_type_ids',
          'project_priority_ids'
        ]);
        this._utilityService.detectChanges(this._cdr);
      // }, 1000);
    }, 1000);
  }

  getAll() {

    this.getProjectCount();
    this.getProjectByDepartment();
    this.getProjectByContractTypes();
    this.getProjectByPriority();
    this.getProjectByYears();
    this.getProjectIssuesByStatuses();
    this.getBudgetByYears();
    this.getBudgetByDepartments();
    this.getMilestoneByMonths();
    this.getMilestoneByDepartments();
    this.getProjectByTypes();
    this.getProjectIssuesByDepartment();

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getCharts() {
    setTimeout(() => {
      //   // Chart code goes in here
      let theme = 'am4themes_animated';
      if (ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      this.browserOnly(() => {
        am4core.useTheme(iTheme);

      });
    }, 1000);

  }

  getProjectCount() {
    this._projectDashboardService.getProjectCount().subscribe(res => {
      setTimeout(() => {
        if (res.length != 0) {
          this.count = null;
          res.forEach(element => {
            this.count+=element.count
          });
          this.pieChartForProjectCount(res);
        }else
        {
          this.count = null;
          this.pieChartForProjectCount(res);
        }  

    }, 1100);
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectByDepartment(){
    this._projectDashboardService.getProjectByDepartment().subscribe(res => {
      setTimeout(() => {
   
          this.createBarChartForProjectByDepartment();

      }, 1100);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectByContractTypes(){
    this._projectDashboardService.getProjectByContractTypes().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectByContractTypes();

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectByPriority(){
    this._projectDashboardService.getProjectByPriority().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectByPriority(res);

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectByYears(){
    this._projectDashboardService.getProjectByYears().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectByYears(res);

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectIssuesByStatuses(){
    this._projectDashboardService.getProjectIssuesByStatuses().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectIssuesByStatuses(res);

      }, 1100);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBudgetByYears(){
    this._projectDashboardService.getBudgetByYears().subscribe(res => {
      setTimeout(() => {
   
          this.createChartBudget(1);

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBudgetByDepartments(){
    this._projectDashboardService.getBudgetByDepartments().subscribe(res => {
      setTimeout(() => {
   
          this.createChartBudget(2);

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMilestoneByMonths(){
    this._projectDashboardService.getMilestoneByMonths().subscribe(res => {
      setTimeout(() => {
   
          this.createChartMilestoneMonths();

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMilestoneByDepartments(){
    this._projectDashboardService.getMilestoneByDepartments().subscribe(res => {
      setTimeout(() => {
   
          this.createChartMilestoneDepartments();

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectByTypes(){
    this._projectDashboardService.getProjectByTypes().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectByTypes();

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectIssuesByDepartment(){
    this._projectDashboardService.getProjectIssuesByDepartment().subscribe(res => {
      setTimeout(() => {
   
          this.createChartProjectIssuesByDepartment();

      }, 1000);
      ProjectDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createChartProjectIssuesByDepartment() {
    // am4core.useTheme(am4themes_animated);
    am4core.addLicense("CH199714744");

    if (ProjectDashboardStore?.ProjectIssuesByDepartment.length == 0) {
      this.showNoDataMap = true;
      return
    } else {
      this.showNoDataMap = false;
    }

    let chart = am4core.create(this.chartProjectIssuesByDepartment?.nativeElement, am4charts.XYChart);
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.data = ProjectDashboardStore?.ProjectIssuesByDepartment;
    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.start = 0.0;
    categoryAxis.end = 0.75;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    label.fontSize = 10;


    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.inversed = false;
    valueAxis.fontSize = 10;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0;


    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "total_project_issues";
    series1.dataFields.categoryX = "department_code";
    series1.name = "department_code";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{categoryX}: {valueY}";
    // series1.legendSettings.valueText = "{valueY}";
    // series1.visible = false;

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = "zoomY";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

  }

  createChartProjectByTypes() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ProjectDashboardStore.ProjectByTypes,'total_project')){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create(this.chartProjectByTypes?.nativeElement, am4charts.PieChart);

    chart.data = ProjectDashboardStore.ProjectByTypes;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('project_by_types');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    pieSeries.dataFields.value = "total_project";
    pieSeries.dataFields.category = "project_type";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.projectTypeClick, this);
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

  projectTypeClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&project_type_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/projects');
  }

  createChartMilestoneDepartments() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);


    if (ProjectDashboardStore.MilestoneByDepartments.length == 0) {
      this.showNoDataMap = true;
      return
    } else {
      this.showNoDataMap = false;
    }

    let chart = am4core.create(this.barChartMilestoneDepartments?.nativeElement, am4charts.XYChart);
    chart.data = ProjectDashboardStore.MilestoneByDepartments;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    chart.legend.useDefaultMarker = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.title.text = "";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize = 10;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "new_milestones";
    series.dataFields.categoryX = "department_code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;
    series.name = "New Milestones";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "delayed_milestones";
    series1.dataFields.categoryX = "department_code";
    series1.name = "Delayed Milestones";

    series1.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series1.columns.template.fillOpacity = 1;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "completed_milestones";
    series2.dataFields.categoryX = "department_code";
    series2.name = "Completed Milestones";

    series2.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series2.columns.template.fillOpacity = 1;

    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.wrap = true;
    label.tooltipText = "{categoryX}";

    let columnTemplate1 = series.columns.template;
    columnTemplate1.strokeWidth = 2;
    columnTemplate1.strokeOpacity = 1;
    // let x;
    // let y;
    // am4core.addLicense("CH199714744");
    // let chart
    // if (filter == 1) {
    //   chart = am4core.create("barChartMilestoneDepartments", am4charts.XYChart);
    //   //  chart.dateFormatter.dateFormat = "y";
    //   chart.numberFormatter.numberFormat = "#.";
    //   chart.data = ProjectDashboardStore.MilestoneByDepartments
    //   y = "milestone_count"
    //   x = 'department_title'
    // }
    // if (filter == 2) {
    //   chart = am4core.create("barChartMilestoneMonths", am4charts.XYChart);
    //   chart.data = ProjectDashboardStore.MilestoneByMonths
    //   y = "total_count"
    //   x = 'month'
    // }
    


    // // Create category axis
    // let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = x;
    // categoryAxis.tooltip.label.maxWidth = 200;
    // categoryAxis.tooltip.label.wrap = true;
    // // categoryAxis.events.on("sizechanged", function (ev) {
    // //   let axis = ev.target;
    // //   let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
    // //   axis.renderer.labels.template.maxWidth = cellWidth;
    // // });
    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 15;
    // categoryAxis.renderer.cellStartLocation = 0.4;
    // categoryAxis.renderer.cellEndLocation = 0.6;
    // categoryAxis.start = 0.0;
    // categoryAxis.end = 0.75;
    // categoryAxis.fontSize = 11;

    // // Create value axis
    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // //  valueAxis.renderer.inversed = false;
    // //  valueAxis.renderer.minLabelPosition = 0;
    // valueAxis.min = 0;
    // valueAxis.fontSize = 11;

    // let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    // label.maxWidth = 120;
    // label.fontSize = 10;
    // // label.truncate = true;
    // // label.tooltipText = "{category}";

    // chart.exporting.menu = new am4core.ExportMenu();
    // chart.exporting.filePrefix = "Milestone"
    // chart.exporting.menu.align = "right";
    // chart.exporting.menu.verticalAlign = "top";

    // let series = chart.series.push(new am4charts.ColumnSeries());
    // series.dataFields.valueY = y;
    // series.dataFields.categoryX = x;
    // series.name = "";
    // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    // series.columns.template.fillOpacity = 1;

    // let columnTemplate = series.columns.template;
    // columnTemplate.strokeWidth = 2;
    // columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  createChartMilestoneMonths() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);


    if (ProjectDashboardStore.MilestoneByMonths.length == 0) {
      this.showNoDataMap = true;
      return
    } else {
      this.showNoDataMap = false;
    }

    let chart = am4core.create(this.barChartMilestoneMonths?.nativeElement, am4charts.XYChart);
    chart.data = ProjectDashboardStore.MilestoneByMonths;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    chart.legend.useDefaultMarker = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.title.text = "";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize = 10;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "new_milestones";
    series.dataFields.categoryX = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;
    series.name = "New Milestones";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "delayed_milestones";
    series1.dataFields.categoryX = "month";
    series1.name = "Delayed Milestones";

    series1.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series1.columns.template.fillOpacity = 1;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "completed_milestones";
    series2.dataFields.categoryX = "month";
    series2.name = "Completed Milestones";

    series2.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series2.columns.template.fillOpacity = 1;

    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    label.maxWidth = 60;
    label.truncate = false;
    label.wrap = true;
    label.tooltipText = "{categoryX}";

    let columnTemplate1 = series.columns.template;
    columnTemplate1.strokeWidth = 2;
    columnTemplate1.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }
  

  createChartBudget(filter: number = 1) {
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if (filter == 1) {
      chart = am4core.create(this.barChartBudgetYears?.nativeElement, am4charts.XYChart);
      chart.data = ProjectDashboardStore.BudgetByYears
      y = "budget_sum"
      x = 'year'
    }
    if (filter == 2) {
      chart = am4core.create(this.barChartBudgetDepartment?.nativeElement, am4charts.XYChart);
      //  chart.dateFormatter.dateFormat = "y";
      chart.numberFormatter.numberFormat = "#.";
      chart.data = ProjectDashboardStore.BudgetByDepartments
      y = "budget_sum"
      x = 'department_code'
    }


    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    // categoryAxis.events.on("sizechanged", function (ev) {
    //   let axis = ev.target;
    //   let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
    //   axis.renderer.labels.template.maxWidth = cellWidth;
    // });
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    // categoryAxis.start = 0.0;
    // categoryAxis.end = 0.75;
    categoryAxis.fontSize = 11;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //  valueAxis.renderer.inversed = false;
    //  valueAxis.renderer.minLabelPosition = 0;
    valueAxis.min = 0;
    valueAxis.fontSize = 11;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    label.fontSize = 10;
    // label.truncate = true;
    // label.tooltipText = "{category}";

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Budget"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  createChartProjectIssuesByStatuses(statusData){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ProjectDashboardStore.ProjectIssuesByStatuses,'count')){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create("chartProjectIssuesByStatuses", am4charts.PieChart);
    
    chart.data = ProjectDashboardStore.ProjectIssuesByStatuses;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = ProjectDashboardStore.ProjectIssuesByStatuses;
    }
    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "status";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.projectIssueByStatusClick, this);
   
    this._utilityService.detectChanges(this._cdr);
  }

  projectIssueByStatusClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&project_issue_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/issues');
  }

  pieChartForProjectCount(statusData){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ProjectDashboardStore.ProjectCounts,'count')){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create(this.chartProjectCount?.nativeElement, am4charts.PieChart);
    
    chart.data = ProjectDashboardStore.ProjectCounts;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = ProjectDashboardStore.ProjectCounts;
    }
    
    chart.legend = new am4charts.Legend();    
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.projectStatusClick, this);
   
    this._utilityService.detectChanges(this._cdr);
  }

  projectStatusClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&project_monitoring_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/projects');
  }

  createChartProjectByYears(yearsData){
    am4core.addLicense("CH199714744");
    
    // Create chart instance
    if(ProjectDashboardStore.ProjectByYears.length==0){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    // this.chartElementForCompliance.nativeElement
    let chart = am4core.create(this.barChartProjectByYears?.nativeElement, am4charts.XYChart);
    chart.data = ProjectDashboardStore.ProjectByYears;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    if(yearsData){
      chart.data = yearsData
    }else{
      chart.data = ProjectDashboardStore.ProjectByYears;
    }
    

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.title.text = "";
    categoryAxis.fontSize= 10;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.fontSize = 10;
    label.tooltipText = "{year}";
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize=10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "project_count";
    series.dataFields.categoryX = "year";
    series.name = "";
    
    series.columns.template.tooltipText = "{year}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",this.projectByYear,this)
  
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  projectByYear(ev) {
    ProjectDashboardStore.setDashboardParam(`&year=${ev?.target?.dataItem?.dataContext?.year}`)
    this._router.navigateByUrl('/project-monitoring/projects');
  }

  createChartProjectByPriority(statusData){
    am4core.addLicense("CH199714744");

    var chart = am4core.create(this.chartProjectByPriority?.nativeElement, am4charts.XYChart);
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = ProjectDashboardStore.ProjectByPriority;
    }
    
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // chart.padding(40, 40, 40, 40);
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.dataFields.category = "project_priority";
      categoryAxis.renderer.inversed = true;
      categoryAxis.fontSize = 10
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true; 
    valueAxis.renderer.line.strokeOpacity = 0.3;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0
    valueAxis.fontSize = 10
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "project_priority";
    series.dataFields.valueX = "total_project";
    // series.tooltipText = "{valueX.value}"
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.events.on("hit",this.projectByPriorityClick,this)
    
    // var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    // labelBullet.label.horizontalCenter = "left";
    // labelBullet.label.dx = 10;
    // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    // labelBullet.locationX = 1;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    categoryAxis.sortBySeries = series;
    this._utilityService.detectChanges(this._cdr);
  }

  projectByPriorityClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&project_priority_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/projects');
  }

  createChartProjectByContractTypes() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ProjectDashboardStore.ProjectByContractTypes,'total_project')){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create(this.chartProjectByContractTypes?.nativeElement, am4charts.PieChart);
    
    chart.data = ProjectDashboardStore.ProjectByContractTypes;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 40;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "total_project";
    pieSeries.dataFields.category = "project_contract_type";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.projectContractTypeClick, this);
   
    this._utilityService.detectChanges(this._cdr);
  }

  projectContractTypeClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&project_contract_type_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/projects');
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

  createBarChartForProjectByDepartment(){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(ProjectDashboardStore.ProjectByDepartment.length==0){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    // this.chartElementForCompliance.nativeElement
    let chart = am4core.create(this.barChartProjectByDepartment?.nativeElement, am4charts.XYChart);
    chart.data = ProjectDashboardStore.ProjectByDepartment;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.title.text = "";
    categoryAxis.fontSize= 10;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.fontSize = 10;
    label.tooltipText = "{department_code}";
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize=10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "total_project";
    series.dataFields.categoryX = "department_code";
    series.name = "";
    
    series.columns.template.tooltipText = "{department_code}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",this.projectByDepartmentClick,this)
  
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  projectByDepartmentClick(ev) {
    ProjectDashboardStore.setDashboardParam(`&department_title=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/project-monitoring/projects');
  }

  projectClosurePage(){
    this._router.navigateByUrl('project-monitoring/project-closure-dashboard') 
  }

  changeRequestPage(){
    this._router.navigateByUrl('project-monitoring/change-request-dashboard') 
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    ProjectDashboardStore.dashboardLoaded = false;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
  }

}
