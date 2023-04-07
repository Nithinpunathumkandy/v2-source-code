import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ITheme } from '@amcharts/amcharts4/core';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import { IncidentDshboardService } from 'src/app/core/services/incident-management/incident-dash-board/incident-dshboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentDashBoardStore } from 'src/app/stores/incident-management/incident-dashboard/incident-dashboard.store';
import { ByYearsStore } from 'src/app/stores/internal-audit/annual-plan/by-year/by-year-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

@Component({
  selector: 'app-incident-dashboard',
  templateUrl: './incident-dashboard.component.html',
  styleUrls: ['./incident-dashboard.component.scss']
})
export class IncidentDashboardComponent implements OnInit {
  IncidentDashBoardStore = IncidentDashBoardStore
  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  Incident_dashboard_loader: boolean = false;
  personInvolvedPieChart: boolean = false;
  incidentCategoryPieChart: boolean = false;
  correctiveActionBarChart: boolean = false;
  personInvolvedData: string = 'pie';
  incidentCategoryData: string = 'pie';
  correctiveActionData: string = 'bar';
  filterSubscription: Subscription = null;
  
  constructor(@Inject(PLATFORM_ID) private platformId,private zone: NgZone,
              private _incidentDashboardService : IncidentDshboardService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef, 
              private _themestructureService: ThemeStructureSettingsService,
              private _helperService: HelperServiceService,
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
    RightSidebarLayoutStore.showFilter = true;
    RightSidebarLayoutStore.filterPageTag = 'incident_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'incident_category_ids',
      'incident_status_ids'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.Incident_dashboard_loader = false;
      this.getAll();
      setTimeout(() => {
        this.Incident_dashboard_loader = true;
      }, 500);
    })
    this.getAll();
    setTimeout(() => {
      this.Incident_dashboard_loader = true;
    }, 500);
    this._utilityService.detectChanges(this._cdr);
  }

  ngAfterViewInit(): void{
    setTimeout(() => {
    if(!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById){
      this._themestructureService.getItems().subscribe(() => {
        this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
          this.getCharts();
          this.getAll();
        });
      })
    }
    else{
      this.getAll();
      this.getCharts();
    }
    // setTimeout(() => {
    //   RightSidebarLayoutStore.filterPageTag = 'incident_dashboard';
    //   this._rightSidebarFilterService.setFiltersForCurrentPage([
    //     'organization_ids',
    //     'division_ids',
    //     'department_ids',
    //     'section_ids',
    //     'sub_section_ids',
    //     'incident_category_ids',
    //     'incident_status_ids'
    //   ]);
    //   this._utilityService.detectChanges(this._cdr);
    // }, 1000);
  }, 1000);
  }
  


  getCharts() {
    setTimeout(() => {
      let theme = 'am4themes_animated';
      if(ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      // Chart code goes in here
      this.browserOnly(() => {
        am4core.useTheme(iTheme);
      });
    }, 1000);
  }

  getAll() {
    this.getCharts()
    if(AuthStore.getActivityPermission(2500,'INCIDENT_DASHBOARD_COUNT')) this.getIncidentCount();
    if(AuthStore.getActivityPermission(2500,'INCIDENT_DASHBOARD_COUNT_BY_YEAR')) this.getIncidentCountByYears()
    if(AuthStore.getActivityPermission(2500,'INCIDENT_DASHBOARD_COUNT_BY_DEPARTMENT')) this.getIncidentCountByDepartments();
    if(AuthStore.getActivityPermission(2500,'DASHBOARD_INCIDENT_BY_CATEGORY_PERCENTAGE')) this.getIncidentCountByCategories();
    if(AuthStore.getActivityPermission(2500,'DASHBOARD_INCIDENT_CORRECTIVE_ACTION_COUNT_BY_DEPARTMENT')) this.getIncidentCorrectiveActionCountByDepartments();
    if(AuthStore.getActivityPermission(2500,'INCIDENT_DASHBOARD_EMPLOYEE_VERSUS_PERSON_INVOLVED_PERCENTAGE')) this.getIncidentEmployeesVsPersonInvolved()
    if(AuthStore.getActivityPermission(2500,'INCIDENT_DASHBOARD_COUNT_BY_MONTH')) this.getIncidentCountByMonths();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getIncidentCount(){
    this._incidentDashboardService.getIncidentCount().subscribe((res)=>{
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentCountByYears(){
    this._incidentDashboardService.getIncidentCountByYears().subscribe((res)=>{
      setTimeout(() => {
          this.createBarChartForIncident(2)
      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentCountByMonths(){
    this._incidentDashboardService.getIncidentCountByMonths().subscribe((res)=>{
      setTimeout(() => {
          this.createBarChartForIncident(1)

        // });
      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentCountByDepartments(){
    this._incidentDashboardService.getIncidentCountByDepartments().subscribe((res)=>{
      setTimeout(() => {
          this.createBarChartForIncident(3)

      }, 1000)
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentCountByCategories(){
    this._incidentDashboardService.getIncidentCountByCategories().subscribe((res)=>{
      setTimeout(() => {
          this.createPieChartForCategory();
      }, 1000)
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentCorrectiveActionCountByDepartments(){
    this._incidentDashboardService.getIncidentCorrectiveActionCountByDepartments().subscribe((res)=>{
      setTimeout(() => {
          this.createBarChartForCorrectiveActionByDepartmemt()
      }, 1000)
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getIncidentEmployeesVsPersonInvolved(){
    this._incidentDashboardService.getIncidentEmployeesVsPersonInvolved().subscribe((res)=>{
      setTimeout(() => {
          this.createPieChartForPersonInvolved();
      }, 1000)
      this._utilityService.detectChanges(this._cdr);

    })
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

  createBarChartForCorrectiveActionByDepartmemt(){

    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChartCorrective", am4charts.XYChart);
    if(!this.checkDataIsPresent(IncidentDashBoardStore.incidentCorrectiveActionCountByDepartments,'count')){
      this.correctiveActionBarChart = true;
      return;
    }
    else{
      this.correctiveActionBarChart = false;
    }
    chart.data = IncidentDashBoardStore.incidentCorrectiveActionCountByDepartments
    chart.numberFormatter.numberFormat = "#";
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Incident"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // chart.fill = am4core.color("green");

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.fontSize= 10;
    categoryAxis.dataFields.category = 'department_code';
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{department}";
    label.fontSize = 10;
      // label.wrap = true;
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });
  
   
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize = 10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'count' ;
    series.dataFields.categoryX = 'department_code';
    series.name = "Visits";
    // series.columns.template.stroke =filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    // series.columns.template.fill = filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    series.columns.template.tooltipText = "{department}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    series.columns.template.events.on("hit",this.incidentCADepartmentChartClick,this)
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  incidentCADepartmentChartClick(event){
    this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.id;
    IncidentDashBoardStore.setIncidentDashboardParam('&department_ids='+this.IncidentDashBoardStore.incidentDashboardParam)
      this._router.navigateByUrl('/incident-management/incident-corrective-actions');
  }

  createBarChartForIncident(filter:number = 1){
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if(filter == 1){
     chart = am4core.create("barChart1", am4charts.XYChart);
      chart.data = IncidentDashBoardStore.incidentCountByMonths
      y = "total_count"
      x = 'month'
    }
    if(filter == 2){
     chart = am4core.create("barChart2", am4charts.XYChart);
      chart.data = IncidentDashBoardStore.incidentCountByYears
      y = "total_count"
      x = 'year'
    }
    if(filter == 3){
     chart = am4core.create("barChart3", am4charts.XYChart);

      chart.data = IncidentDashBoardStore.incidentCountByDepartments
      y = "count"
      x = 'department_code'
    }
    
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.fontSize= 10;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Incident"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize= 10;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "Visits";
    // series.columns.template.stroke =filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    // series.columns.template.fill = filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.monthsChartClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.yearChartClick,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.departmentChartClick,this)
     }
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  monthsChartClick(event){
    this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.month_num;
    IncidentDashBoardStore.setIncidentDashboardParam('&month='+this.IncidentDashBoardStore.incidentDashboardParam)
      this._router.navigateByUrl('/incident-management/incidents');
  }

  yearChartClick(event){
    this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.year;
    IncidentDashBoardStore.setIncidentDashboardParam('&year='+this.IncidentDashBoardStore.incidentDashboardParam)
      this._router.navigateByUrl('/incident-management/incidents');
  }

  departmentChartClick(event){
    this.IncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.id;
    IncidentDashBoardStore.setIncidentDashboardParam('&department_ids='+this.IncidentDashBoardStore.incidentDashboardParam)
      this._router.navigateByUrl('/incident-management/incidents');
  }
  
  createPieChartForCategory() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("category", am4charts.PieChart);
    if(!this.checkDataIsPresent(IncidentDashBoardStore.incidentCountByCategories,'count')){
      this.incidentCategoryPieChart = true;
      return;
    }
    else{
      this.incidentCategoryPieChart = false;
    }
    chart.data = IncidentDashBoardStore.incidentCountByCategories;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Incident Category"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = am4core.percent(50);

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('by_category');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
  
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "incident_category";
    pieSeries.labels.template.text = "";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    pieSeries.slices.template.events.on("hit", this.categoryChartClick,this)
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
    setTimeout(() => {
      // CeoRiskDashboardStore.dashboardLoaded = true;
    }, 250);
    this._utilityService.detectChanges(this._cdr);
  }

  categoryChartClick(event){
    // console.log(event.target.column.dataItem.dataContext.id);
    
    this.IncidentDashBoardStore.incidentDashboardParam = event.target.dataItem.dataContext.id;
    IncidentDashBoardStore.setIncidentDashboardParam('&incident_category_ids='+this.IncidentDashBoardStore.incidentDashboardParam)
      this._router.navigateByUrl('/incident-management/incidents');
  }

  createPieChartForPersonInvolved() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("involved", am4charts.PieChart);
    if(!this.checkDataIsPresent(IncidentDashBoardStore.incidentEmployeesVsPersonInvolved,'count')){
      this.personInvolvedPieChart = true;
      return;
    }
    else{
      this.personInvolvedPieChart = false;
    }
    chart.data = IncidentDashBoardStore.incidentEmployeesVsPersonInvolved;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Person Involved"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = am4core.percent(50);

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('incidents_by_person_involved');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    // label.wrap = true;
    
    // label.fontSize = 10;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "label";
    pieSeries.labels.template.text = ""
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    // pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    // pieSeries.slices.template.events.on("hit", this.personChartClick,this)

    chart.events.on("sizechanged", function(ev) {
      var scale = (pieSeries.pixelInnerRadius * 2) / label.bbox.width;
      if (scale > 1) {
        scale = 1;
      }
      label.scale = scale;
    })

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
    setTimeout(() => {
      // CeoRiskDashboardStore.dashboardLoaded = true;
    }, 250);
    this._utilityService.detectChanges(this._cdr);
  }

  // personChartClick(event){
  //   console.log(event.target.column.dataItem.dataContext.id);
    
  //   this.IncidentDashBoardStore.incidentDashboardParam = event.target.dataItem.dataContext.id;
  //   IncidentDashBoardStore.setIncidentDashboardParam('&incident_status_ids='+this.IncidentDashBoardStore.incidentDashboardParam)
  //     this._router.navigateByUrl('/incident-management/incidents');
  // }

  redirectToListPage(status, count:number=0){
    if(count!=0){
      switch (status) {
        case 'total_incident':
          this._router.navigateByUrl('/incident-management/incidents');
          break;
        case 'new_incidents':
          IncidentDashBoardStore.setIncidentDashboardParam('&incident_status_ids=1&is_inherent=true')
          this._router.navigateByUrl('/incident-management/incidents');
          break;
        case 'investigating':
          this._router.navigateByUrl('/incident-management/incident-investigations');
          break;
        case 'investigated':
          this._router.navigateByUrl('/incident-management/incident-investigations');
          break;
      
        default:
          break;
      }
      }
  }

  ngOnDestroy(){
    am4core.disposeAllCharts();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
