import { ITheme } from '@amcharts/amcharts4/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID,OnDestroy } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectDashboardStore } from 'src/app/stores/project-monitoring/project-dashboard-store';
import { ProjectDashboardService } from 'src/app/core/services/project-monitoring/project-dashboard/project-dashboard.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-closure-dashboard',
  templateUrl: './project-closure-dashboard.component.html',
  styleUrls: ['./project-closure-dashboard.component.scss']
})
export class ProjectClosureDashboardComponent implements OnInit,OnDestroy {

  ProjectDashboardStore = ProjectDashboardStore;
  showNoDataMap: boolean = false;

  count: number=null;
  filterSubscription: Subscription = null;
  emptyList = "no_data_found"

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _projectDashboardService: ProjectDashboardService,
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
    ProjectDashboardStore.closureLoaded = false;
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "/project-monitoring/dashboard"}
    ]);
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.ProjectDashboardStore.dashboardLoaded = false;
       this.getProjectClosureByStatus();
       this.getProjectClosureByDepartments();
      setTimeout(() => {
        this.ProjectDashboardStore.dashboardLoaded = true;
      }, 1000);
    });
   
    setTimeout(() => {
      ProjectDashboardStore.closureLoaded = true;
    }, 1000);
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
      RightSidebarLayoutStore.filterPageTag = 'project_closure_dashbord';
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
        'project_priority_ids',
        'project_monitor_closure_status_ids'
      ]);
    // }, 1000);
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
  }

  getAll() {

    this.getProjectClosureByStatus();
    this.getProjectClosureByDepartments();

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

  getProjectClosureByDepartments(){
    this._projectDashboardService.getProjectClosureByDepartments().subscribe(res => {
      setTimeout(() => {
   
          this.createBarChartProjectClosureByDepartments();

      }, 1100);
      ProjectDashboardStore.closureLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectClosureByStatus() {
    this._projectDashboardService.getProjectClosureByStatus().subscribe(res => {
      setTimeout(() => {
        if (res.length != 0) {
          res.forEach(element => {
            this.count+=element.count
          });
          this.pieChartForProjectClosureByStatus(res);
        }else
        {
          this.count = null;
          this.pieChartForProjectClosureByStatus(res);
        }   

    }, 1100);
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createBarChartProjectClosureByDepartments(){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(ProjectDashboardStore.ProjectClosureByDepartments.length==0){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    // this.chartElementForCompliance.nativeElement
    let chart = am4core.create('barChartProjectClosureByDepartments', am4charts.XYChart);
    chart.data = ProjectDashboardStore.ProjectClosureByDepartments;
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
    valueAxis.fontSize=12;
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "department_code";
    series.name = "";
    
    series.columns.template.tooltipText = "{department_code}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
  
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  pieChartForProjectClosureByStatus(chartCount){
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ProjectDashboardStore.ProjectClosureByStatus,'count')){
      this.showNoDataMap=true;
      return
    }else{
      this.showNoDataMap=false;
    }
    let chart = am4core.create("chartProjectClosureByStatus", am4charts.PieChart);
    
    chart.data = ProjectDashboardStore.ProjectClosureByStatus;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    if(chartCount){
      chart.data = chartCount
    }else{
      chart.data = ProjectDashboardStore.ProjectClosureByStatus;
    }
    
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.maxHeight = 70;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);
    chart.legend.labels.template.maxWidth = 150;
    // chart.legend.labels.template.truncate = true;
    chart.legend.labels.template.wrap = true;
    chart.legend.itemContainers.template.togglable = true;


    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize= 10;
    // chart.legend.labels.template.disabled = true;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
   
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

  ngOnDestroy(){
    am4core.disposeAllCharts();
    SubMenuItemStore.makeEmpty();
    ProjectDashboardStore.closureLoaded = false;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
  }

}
