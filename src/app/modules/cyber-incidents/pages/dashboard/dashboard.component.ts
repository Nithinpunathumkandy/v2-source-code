import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ITheme } from '@amcharts/amcharts4/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CyberIncidentDashboardService } from 'src/app/core/services/cyber-incident/cyber-incident-dashboard/cyber-incident-dashboard.service';
import { CyberIncidentDashBoardStore } from 'src/app/stores/cyber-incident/cyber-incident-dashboard-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Incident_dashboard_loader: boolean = false;
  correctiveActionBarChart: boolean = false;
  incidentByMonth: boolean = false;
  incidentByYear: boolean = false;
  incidentByDept: boolean = false;
  CyberIncidentDashBoardStore = CyberIncidentDashBoardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;
  correctiveActionData: string = 'bar';
  incidentData: string = 'bar';
  filterSubscription: Subscription = null;

  constructor(@Inject(PLATFORM_ID) private platformId,
              private zone: NgZone,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _themestructureService: ThemeStructureSettingsService,
              private _helperService: HelperServiceService,
              private _router: Router,
              private _eventEmitterService: EventEmitterService, 
              private _cyberIncidentDashboardService: CyberIncidentDashboardService,
              private _rightSidebarFilterService: RightSidebarFilterService) { }

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
  RightSidebarLayoutStore.filterPageTag = 'cyber_incident_dashboard';
  this._rightSidebarFilterService.setFiltersForCurrentPage([
    'department_ids',
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
  this.getIncidentCount();
  this.getIncidentCountByYears()
  this.getIncidentCountByDepartments();
  this.getIncidentCorrectiveActionCountByDepartments();
  this.getIncidentCountByMonths();
  setTimeout(() => {
    this._utilityService.detectChanges(this._cdr);
  }, 250);
}

getIncidentCount(){
  this._cyberIncidentDashboardService.getIncidentCount().subscribe((res)=>{
    this._utilityService.detectChanges(this._cdr);

  })
}

getIncidentCountByYears(){
  this._cyberIncidentDashboardService.getIncidentCountByYears().subscribe((res)=>{
    setTimeout(() => {
        this.createBarChartForIncident(2)
    }, 1000);
    this._utilityService.detectChanges(this._cdr);

  })
}

getIncidentCountByMonths(){
  this._cyberIncidentDashboardService.getIncidentCountByMonths().subscribe((res)=>{
    setTimeout(() => {
        this.createBarChartForIncident(1)

      // });
    }, 1000);
    this._utilityService.detectChanges(this._cdr);

  })
}

getIncidentCountByDepartments(){
  this._cyberIncidentDashboardService.getIncidentCountByDepartments().subscribe((res)=>{
    setTimeout(() => {
        this.createBarChartForIncident(3)

    }, 1000)
    this._utilityService.detectChanges(this._cdr);

  })
}

getIncidentCorrectiveActionCountByDepartments(){
  this._cyberIncidentDashboardService.getIncidentCorrectiveActionCountByDepartments().subscribe((res)=>{
    setTimeout(() => {
        this.createBarChartForCorrectiveActionByDepartmemt()
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
  if(!this.checkDataIsPresent(CyberIncidentDashBoardStore.incidentCorrectiveActionCountByDepartments,'count')){
    this.correctiveActionBarChart = true;
    return;
  }
  else{
    this.correctiveActionBarChart = false;
  }
  chart.data = CyberIncidentDashBoardStore.incidentCorrectiveActionCountByDepartments
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
  this.CyberIncidentDashBoardStore.incidentDashboardParam = event.target.column.dataItem.dataContext.id;
  CyberIncidentDashBoardStore.setIncidentDashboardParam('&department_ids='+this.CyberIncidentDashBoardStore.incidentDashboardParam)
    this._router.navigateByUrl('/cyber-incident/cyber-incident-corrective-actions');
}

createBarChartForIncident(filter:number = 1){
  let x;
  let y;
  am4core.addLicense("CH199714744");
  let chart
  if(filter == 1){
   chart = am4core.create("barChart1", am4charts.XYChart);
   if(!this.checkDataIsPresent(CyberIncidentDashBoardStore.incidentCountByMonths,'count')){
    this.incidentByMonth = true;
    return;
  }
  else{
    this.incidentByMonth = false;
  }
    chart.data = CyberIncidentDashBoardStore.incidentCountByMonths
    y = "total_count"
    x = 'month'
  }
  if(filter == 2){
   chart = am4core.create("barChart2", am4charts.XYChart);
   if(!this.checkDataIsPresent(CyberIncidentDashBoardStore.incidentCountByYears,'count')){
    this.incidentByYear = true;
    return;
  }
  else{
    this.incidentByYear = false;
  }
    chart.data = CyberIncidentDashBoardStore.incidentCountByYears
    y = "total_count"
    x = 'year'
  }
  if(filter == 3){
   chart = am4core.create("barChart3", am4charts.XYChart);
   if(!this.checkDataIsPresent(CyberIncidentDashBoardStore.incidentCountByDepartments,'count')){
    this.incidentByDept = true;
    return;
  }
  else{
    this.incidentByDept = false;
  }
    chart.data = CyberIncidentDashBoardStore.incidentCountByDepartments
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
  this.CyberIncidentDashBoardStore.incidentDashboardParam = event.target.column._dataItem._dataContext.month_num;
  CyberIncidentDashBoardStore.setIncidentDashboardParam('month='+this.CyberIncidentDashBoardStore.incidentDashboardParam)
    this._router.navigateByUrl('/cyber-incident/cyber-incidents');
}

yearChartClick(event){
  this.CyberIncidentDashBoardStore.incidentDashboardParam = event.target.column._dataItem._dataContext.year;
  CyberIncidentDashBoardStore.setIncidentDashboardParam('year='+this.CyberIncidentDashBoardStore.incidentDashboardParam)
    this._router.navigateByUrl('/cyber-incident/cyber-incidents');
}

departmentChartClick(event){
  this.CyberIncidentDashBoardStore.incidentDashboardParam = event.target.column._dataItem._dataContext.id;
  CyberIncidentDashBoardStore.setIncidentDashboardParam('department_ids='+this.CyberIncidentDashBoardStore.incidentDashboardParam)
    this._router.navigateByUrl('/cyber-incident/cyber-incidents');
}

redirectToListPage(status, count:number=0){
  if(count!=0){
    switch (status) {
      case 'total_incident':
        this._router.navigateByUrl('/cyber-incident/cyber-incidents');
        break;
      case 'new_incidents':
        CyberIncidentDashBoardStore.setIncidentDashboardParam('&incident_status_ids=1&is_inherent=true')
        this._router.navigateByUrl('/cyber-incident/cyber-incidents');
        break;
      case 'corrective_action':
        this._router.navigateByUrl('/cyber-incident/cyber-incident-corrective-actions');
        break;
      case 'investigated':
        // this._router.navigateByUrl('/incident-management/incident-investigations');
        break;
    
      default:
        break;
    }
    }
}

ngOnDestroy(){
  am4core.disposeAllCharts();
  // this._rightSidebarFilterService.resetFilter();
  this.filterSubscription.unsubscribe();
  // RightSidebarLayoutStore.showFilter = false;
}

}
