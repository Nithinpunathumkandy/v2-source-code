import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/ms-audit-management/ms-audit/dashboard/dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditDashboardStore } from 'src/app/stores/ms-audit-management/dashboard/audit-dashboard.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  AuditDashboardStore = AuditDashboardStore;
  showNoDataBarChart:boolean=false
  showNoDataBarChartDept: boolean = false;
  filterSubscription: Subscription = null;
  selectedChart: number;

  constructor(private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _router: Router,
    private _dashboardService : DashboardService,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService: EventEmitterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AuditDashboardStore.dashboardLoaded = false;
      this.getAll();
      setTimeout(() => {
        this.AuditDashboardStore.dashboardLoaded = true;
        }, 1000);
    })
  this.getAll();
    RightSidebarLayoutStore.filterPageTag = 'audit_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'ms_audit_finding_status_ids',
      'ms_audit_finding_category_ids',
      'ms_audit_finding_corrective_action_status_ids',
      'ms_audit_schedule_status_ids'
    
    ]);
  }


  getAll(){
    //this.getStatusByPlan();
    
    this.getAuditCount();
    this.getAuditFindingCount();
    this.getStatusByCorrectiveAction();
    this.getProgramByCategories();
    this.getFindingsyByDepartment();
    this.getFindingsByMsType();
    this.scheduleStatus();
    this.getFindingsByStatus();
    this.getFindingCategory();
    this.getCaDelayCount();
  }

  getProgramByCategories(){
    this._dashboardService.getProgramByCategories().subscribe(res=>{
      if (AuditDashboardStore.programByCategories?.length != 0) {
        setTimeout(() => {
          this.createProgramByCategories()
        }, 500);
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getStatusByPlan(){
    this._dashboardService.getPlanByStatus().subscribe(res=>{
      if (AuditDashboardStore.planByStatus.length != 0) {
        setTimeout(() => {
          this.createPlanByStatus()
        }, 500);
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getStatusByCorrectiveAction(){
    this._dashboardService.getCorrectiveActionByStatus().subscribe(res=>{
      if (AuditDashboardStore.correctiveActionByStatus.length != 0) {
        setTimeout(() => {
          this.createPlanByCorrectiveAction()
        }, 500);
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  scheduleStatus(){
    this._dashboardService.getScheduleStatus().subscribe(res=>{
      if (AuditDashboardStore.schdueleByStatus.length != 0) {
        setTimeout(() => {
          this.sheduleByStatus()
        }, 500);
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getFindingsyByDepartment(){
    this._dashboardService.getFindingByDepartment().subscribe(res=>{
      if(AuditDashboardStore.findingsByDepartment?.length != 0){
        setTimeout(() => {
          this.createBarChart(1)
        }, 500);
      }else{
        this.showNoDataBarChartDept = true;
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getFindingsByMsType(){
    this._dashboardService.findingsByMsTypes().subscribe(res=>{
      if(AuditDashboardStore.findingsByMsType?.length != 0){
        this.createBarChart(2)
      }
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getFindingsByStatus(){
    this._dashboardService.findingsByStatus().subscribe(res=>{
      if(AuditDashboardStore.findingsByStatus?.length != 0){
        this.createBarChart(3)
      }
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getFindingCategory(){
    this._dashboardService.findingsByCategory().subscribe(res=>{
      if(AuditDashboardStore.findingCategory?.length != 0){
        this.createBarChart(4)
      }
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getCaDelayCount(){
    this._dashboardService.caDelayCountByDepartments().subscribe(res=>{
      if(AuditDashboardStore.caDelayCount?.length != 0){
        this.createBarChart(5)
      }
      this._utilityService.detectChanges(this._cdr)
    })
  }

  
  getAuditCount(){
    this._dashboardService.getAuditCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getAuditFindingCount(){
    this._dashboardService.getAuditFindingCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)

    })
  }

  getFindingsByDepartment() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    let dataArray = this._helperService.getArrayProcessed(AuditDashboardStore.findingsByDepartment, null);
    for (let i of dataArray) {
      chart.data.push({
        "code": i.title,
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
    chart.exporting.filePrefix = "Findings_by_department"
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
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  createProgramByCategories() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartdiv2", am4charts.PieChart);
    chart.data = AuditDashboardStore.programByCategories;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Audit_program_by_categories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

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
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize= 10;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "category_name";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.clickByCategory,this)
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
  }

  createPlanByStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = AuditDashboardStore.planByStatus;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Audit_plan_by_status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Status";
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 50;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.truncate = true;
    chart.legend.itemContainers.template.padding(0,0,0,0);
    chart.legend.itemContainers.template.togglable = false;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

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
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
  }

  createPlanByCorrectiveAction() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("chartdiv1", am4charts.PieChart);
    chart.data = AuditDashboardStore.correctiveActionByStatus;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Corrective_action_by_status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.numberFormatter.numberFormat = "#.";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Status";
    label.wrap = true
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
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
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
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.clickCorrectiveActionByStatus,this)
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }
  }



  sheduleByStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("scheduleByStatus", am4charts.PieChart);
    chart.data = AuditDashboardStore.schdueleByStatus;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Schedule_by_status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.numberFormatter.numberFormat = "#.";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Status";
    label.wrap = true
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
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
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
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.slices.template.events.on("hit", this.pieChartClicked,this)
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.events.on("hit", this.scheduleBySttaus,this)
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

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
    
  }

  createBarChart(filter: number = 1) {
    let x;
    let y;
    this.selectedChart = filter
    am4core.addLicense("CH199714744");
    let chart
    if (filter == 5) {
      if( AuditDashboardStore.caDelayCount.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      chart = am4core.create("caDelayCount", am4charts.XYChart);
      chart.data = AuditDashboardStore.caDelayCount
      y = "count"
      x = 'title'
    }
    if (filter == 4) {
      if( AuditDashboardStore.findingCategory.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      chart = am4core.create("findingCategory", am4charts.XYChart);
      
      chart.data = AuditDashboardStore.findingCategory
      
      y = "count"
      x = 'title'
    }
    if (filter == 3) {
      if( AuditDashboardStore.findingsByStatus.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      chart = am4core.create("barChartStatus", am4charts.XYChart);
      chart.data = AuditDashboardStore.findingsByStatus
      
      y = "count"
      x = 'title'
    }
    if (filter == 2) {
      if( AuditDashboardStore.findingsByMsType.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      chart = am4core.create("barChartControls", am4charts.XYChart);
      chart.data = AuditDashboardStore.findingsByMsType
     
      y = "count"
      x = 'title'
    }
    if (filter == 1) {
      if( AuditDashboardStore.findingsByDepartment.length==0){
        this.showNoDataBarChartDept = true;
      }else{
        this.showNoDataBarChartDept = false;
      }
      chart = am4core.create("barChartDepartment", am4charts.XYChart);
      chart.data = AuditDashboardStore.findingsByDepartment
     
      y = "count"
      x = 'title'
    }

    chart.numberFormatter.numberFormat = "#.";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.fontSize=12;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

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
    categoryAxis.events.on("sizechanged", function (ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    chart.exporting.menu = new am4core.ExportMenu();
    if(filter == 1)
    {
      chart.exporting.filePrefix = "Findings_by_department"
    }
    else if(filter == 2)
    {
      chart.exporting.filePrefix = "Findings_by_mstype"
    }
    else if(filter == 3)
    {
      chart.exporting.filePrefix = "Findings_by_status"
    }
    else if(filter == 4)
    {
      chart.exporting.filePrefix = "Findings_by_category"
    }
    else 
    {
      chart.exporting.filePrefix = "Corrective_action_delay_by_department"
    }
    
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.fontSize=12;


    // let series = chart.series.push(new am4charts.ColumnSeries());
    // series.dataFields.valueY = y;
    // series.dataFields.categoryX = x;
    // series.name = "";
    // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    // series.columns.template.fillOpacity = 1;

    // let columnTemplate = series.columns.template;
    // columnTemplate.strokeWidth = 2;
    // columnTemplate.strokeOpacity = 1;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "title";
    lineSeries.dataFields.valueY = "count";
    lineSeries.tooltipText = "Count: {valueY.value}";
    lineSeries.fillOpacity = 0;
    lineSeries.strokeWidth = 3;
    //lineSeries.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    


    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#416f93");
    bullet.circle.strokeWidth = 3;
    bullet.events.on("hit",this.lineChartClicked,this)
    //bullet.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    this._utilityService.detectChanges(this._cdr);
  }

  lineChartClicked(event){
   switch (this.selectedChart) {
    case 5 :
    this.correctiveActionDelayCountClick(event.target.dataItem.dataContext.id)
      break;
  case 4 :
    this.nonConformityClickByCategory(event.target.dataItem.dataContext.id)
      break;
     case 3 :
      this.nonConformityClickByStatus(event.target.dataItem.dataContext.id)
       break;
     case 2 :
       this.nonConformityClickMsType(event.target.dataItem.dataContext.id)
        break;
     case 1 :
       this.nonConformityClickByDepartment(event.target.dataItem.dataContext.id)
        break;
     default:
       break;
   }

  }

  nonConformityClickByDepartment(data){
    let params = data
    AuditDashboardStore.setFilterParams('&department_ids=' + params)
    
    this._router.navigateByUrl('ms-audit-management/findings')
  }

  scheduleBySttaus(event)
  {
    let params = event.target.dataItem.dataContext.id
    AuditDashboardStore.setFilterParams('&ms_audit_schedule_status_ids=' + params)
    
    this._router.navigateByUrl('ms-audit-management/ms-audit-schedules')
  }

  nonConformityClickMsType(data){
    let params = data
    AuditDashboardStore.setFilterParams('&ms_type_ids=' + params)
    
    this._router.navigateByUrl('ms-audit-management/findings')
  }

  clickByCategory(event){
    let params = event.target.dataItem.dataContext.id
    AuditDashboardStore.setFilterParams('&ms_audit_category_ids=' + params);
    this._router.navigateByUrl('ms-audit-management/ms-audit-programs');
  }

  clickCorrectiveActionByStatus(event){
    let params = event.target.dataItem.dataContext.id
    AuditDashboardStore.setFilterParams('&ms_audit_finding_corrective_action_status_ids=' + params);
    this._router.navigateByUrl('ms-audit-management/corrective-actions');
  }

  nonConformityClick(){
    let params = '1,2'
    AuditDashboardStore.setFilterParams('&ms_audit_finding_status_ids=' + params)
    this._router.navigateByUrl('ms-audit-management/findings');
  }

  nonConformityClickByStatus(data){
    let params = data
    AuditDashboardStore.setFilterParams('&ms_audit_finding_status_ids=' + params)
    
    this._router.navigateByUrl('ms-audit-management/findings')
  }

  nonConformityClickByCategory(data){
    let params = data
    AuditDashboardStore.setFilterParams('&ms_audit_finding_category_ids=' + params)
    
    this._router.navigateByUrl('ms-audit-management/findings')
  }

  correctiveActionDelayCountClick(data){
    let params = data
    AuditDashboardStore.setFilterParams('&department_ids='+ params+'&delay_analysis=true')
    
    this._router.navigateByUrl('ms-audit-management/corrective-actions')
  }

  auditProgramClick(){
    this._router.navigateByUrl('ms-audit-management/ms-audit-programs');
  }

  auditsClick(){
    this._router.navigateByUrl('ms-audit-management/ms-audits');
  }

  auditPlanClick(){
    this._router.navigateByUrl(`/ms-audit-management/ms-audit-plans`);
  }
  
  ngOnDestroy(){
    am4core.disposeAllCharts();
    AuditDashboardStore.unsetDashboard();
    this.filterSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    this.AuditDashboardStore.dashboardLoaded = false;
    this.selectedChart = null
  }
  

}
