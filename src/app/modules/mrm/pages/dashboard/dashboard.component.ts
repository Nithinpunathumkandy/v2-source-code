import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { MrmDashboardService } from 'src/app/core/services/mrm/dashboard/mrm-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { MRMDashboardStore } from 'src/app/stores/mrm/mrm-dashboard/mrm-dashboard-store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {

  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;
  MRMDashboardStore = MRMDashboardStore;
  MeetingPlanStore = MeetingPlanStore;
  ActionPlansStore = ActionPlansStore;
  showNoDataMap:boolean=false;
  chart
  stackChart: boolean=false;
  RightSidebarLayoutStore=RightSidebarLayoutStore

  chart1:boolean=true;
  chart2:boolean=true;
  chart3:boolean=true;
  filterSubscription: Subscription = null;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _mrmDashboardService:MrmDashboardService
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
    RightSidebarLayoutStore.filterPageTag = 'mrm_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'department_ids',
      'meeting_plan_status_ids',
      'meeting_category_ids',
      'meeting_action_plan_status_ids',
      'organizer_ids'
    ]);
    this.stackChart = false
    NoDataItemStore.setNoDataItems({ title: "no_mrm_dashboard_data"});
    am4core.useTheme(am4themes_animated);
    this.getAll();
    RightSidebarLayoutStore.showFilter = true;
    
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      //console.log('hi');
      this.MRMDashboardStore.dashboardLoaded = false;
      // this.MRMDashboardStore.dashboardLoaded = false;
      this.getAll();
      
      this.MRMDashboardStore.dashboardLoaded = true;
    });

   
  }

  // ngAfterViewInit(){
  //   this.getCharts()
  // }

  // getCharts() {
  //   setTimeout(() => {
  //     this.browserOnly(() => {
        
  //       this.createPieChartForActionPlan()
  //       this.createPieChartForMeetingBystatus()
  //       this.getMeetingByDepartments()
  //     });
  //   }, 2000);
  // }

  // getAllCounts(){
  //   this._utilityService.detectChanges(this._cdr);
  // }

  getAll()
  {
    this.getCounts();
    this.getActionPlanCount();
    this.getMeetingByStatus();
    this.getMeetingByDepartments();
  }

  getCounts(){
    this._mrmDashboardService.getMRMCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getActionPlanCount(){
    this._mrmDashboardService.getActionPlanCount().subscribe(res=>{
      this.createPieChartForActionPlan(false);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMeetingByStatus(){
    this._mrmDashboardService.getMeetingByStatus().subscribe(res=>{
      this.createPieChartForMeetingBystatus(false);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMeetingByDepartments(flag=false){
    this.stackChart = false
    this._mrmDashboardService.getMeetingByDepartments().subscribe(res=>{
      if(!flag){
        this.createBarChart(1, false);
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMeetingByCategory(){
    this.stackChart = false
    this._mrmDashboardService.getMeetingByCategory().subscribe(res=>{
      this.createBarChart(2, false)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMeetingByYear(){
    this.stackChart = false
    this._mrmDashboardService.getMeetingByYear().subscribe(res=>{
      this.createBarChart(3, false)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMeetingVsActionplan(boolean=false){
    this.stackChart = false;
    this._mrmDashboardService.getMeetingVsActionplan().subscribe(res=>{
      // this.createMeetingVsActionPlanBarChart()
      if(res.length)
      {
        this.stackChart = true;
      }
      setTimeout(() => {
        this.createMeetingVsActionPlanBarChart()
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //chart pie-1
  createPieChartForActionPlan(refreshIssue:boolean) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("actionPlanDiv", am4charts.PieChart);
    chart.data = MRMDashboardStore.actionPlan;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MRMActionPlan"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Action Plans";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.maxWidth = 85;
    chart.legend.maxHeight = 20;

    // chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);
    chart.legend.fontSize= 10;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    // pieSeries.slices.template.propertyFields.fill = "color";
    //color
    pieSeries.colors.list = [
      am4core.color("#FFBB00"),
      am4core.color("#F7941D"),
      am4core.color("#8F5DB5"),
      am4core.color("#19C268"),
    ];
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.alignLabels = false;
    pieSeries.labels.template.disabled=true;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.clickonPieChartForMeetingActionPlanStatus,this)
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }

    if(refreshIssue){
      this.chart1=false;
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  clickonPieChartForMeetingActionPlanStatus(ev) {
    MRMDashboardStore.setDashboardParam(`&meeting_action_plan_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/mrm/meeting-action-plans');
  }

  //chart pie-2
  createPieChartForMeetingBystatus(refreshIssue:boolean) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("meetingByStatusDiv", am4charts.PieChart);
    chart.data = MRMDashboardStore.MeetingByStatus;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MeetingByStatus"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    // chart.legend.position = 'right'
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.maxWidth = 85;
    chart.legend.maxHeight = 50;
    // chart.legend.scrollable = true;
    // chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    // chart.legend.valueLabels.template.align = "left"
    // chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);
    chart.legend.fontSize= 10;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 11;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    // pieSeries.slices.template.propertyFields.fill = "color";
    //color
    pieSeries.colors.list = [
      am4core.color("#F9384B"),
      am4core.color("#F7941D"),
      am4core.color("#8F5DB5"),
    ];
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%";
    pieSeries.slices.template.tooltipText =  "{category}: {value.percent.formatNumber('#.')}% ({value.value})";
    pieSeries.labels.template.fontSize=12;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.clickonPieChartForMeetingStatus,this)
    function hideSmall(ev) {
      if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1)) {
        ev.target.hide();
      }
      else {
        ev.target.show();
      }
    }

    if(refreshIssue){
      this.chart2=false;
    }

    this._utilityService.detectChanges(this._cdr);
  }

  clickonPieChartForMeetingStatus(ev) {
    MRMDashboardStore.setDashboardParam(`&meeting_plan_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/mrm/meeting-plans');
  }

  //chart bar-3,4,5
  createBarChart(filter:number, refreshIssue){
    this.stackChart = false
    var category = ""
    var color = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    //color
    chart.colors.list = [
      am4core.color("#89CFF0"),
    ];
    
    if(filter == 1){
      chart.data = MRMDashboardStore.MeetingByDepartments
      category = "code"
      color="color"
      if(MRMDashboardStore.MeetingByDepartments.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
    }
    if(filter == 2){
      chart.data = MRMDashboardStore.MeetingByCategories
      category = "title"
      color="color"
      if(MRMDashboardStore.MeetingByCategories.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
    }
    if(filter == 3){
      chart.data = MRMDashboardStore.MeetingByYears
      category = "year"
      color="color"
      if(MRMDashboardStore.MeetingByYears.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
    }
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.fontSize= 12;
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    if(filter != 3){
      // categoryAxis.renderer.labels.template.rotation = -90;   //rotation
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    }
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MRM Meetings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize=12;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = category;
    series.name = "Visits";
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.meetingByDepratment,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.meetingByCategory,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.meetingByYear,this)
     }
    //series.columns.template.events.on("hit", this.clickonPieChartForMeeting(filter),this)
    // series.columns.template.cursorOverStyle.on("hit", function(ev) {
    //   this.clickonPieChartForMeeting(ev)
    // });
    // if(filter==1){
    //   series.columns.template.propertyFields.stroke="color"
    //   series.columns.template.propertyFields.fill = "color"
    // }
    // else{
    //   series.columns.template.stroke = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    //   series.columns.template.fill = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    //   }
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 90;
    label.tooltipText = "{category}";
    
    if(refreshIssue){
      this.chart3=false;
    }

    this._utilityService.detectChanges(this._cdr);
  }

  meetingByDepratment(ev) {
    MRMDashboardStore.setDashboardParam(`&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('mrm/meetings');
  }

  meetingByCategory(ev) {
    MRMDashboardStore.setDashboardParam(`&meeting_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('mrm/meetings');
  }

  meetingByYear(ev) {
    MRMDashboardStore.setDashboardParam(`&year=${ev?.target?.dataItem?.dataContext?.year}`)
    this._router.navigateByUrl('mrm/meetings');
  }

  formatMeetingData(data)
  {
    let item=[];
    for(let i of data)
    {
      if(i.total_meeting_action_count>0)
      {
        i.title='meeting'
      }
      if(i.total_meeting_action_count>0)
      {
        i.title='action_plan'
      }
      item.push({month:i.month,month_num:i.month_num,title:i.title,
        total_meeting_action_count:i.total_meeting_action_count,
        total_meeting_count:i.total_meeting_count,
        year:i.year
      });
    }
    return item;
  }

  //chart bar-6
  createMeetingVsActionPlanBarChart(){
    am4core.addLicense("CH199714744");
    this.chart = am4core.create("barChartForMeetingVsActionPlan", am4charts.XYChart);
    this.chart.data = this.formatMeetingData(MRMDashboardStore.MeetingVsActionPlan);
    console.log(this.chart.data)
    this.chart.numberFormatter.numberFormat = "#";
    this.chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    this.chart.colors.list = [
      am4core.color("#4670C0"),
      am4core.color("#A8D18D"),
    ];
    var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.fontSize = 12
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    // categoryAxis.renderer.labels.template.rotation = -60;     //rotation
    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 30
    // valueAxis.renderer.grid.template.opacity = 0;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    valueAxis.min = 0;
    // valueAxis.title.text = "Number of Risk Treatment"
    valueAxis.title.fontSize = 12
    valueAxis.maxPrecision = 0 //avoid decimal in y-axis

    this.chart.legend = new am4charts.Legend();
    this.chart.legend.paddingBottom = 20;
    this.chart.legend.position = "top";
    this.chart.legend.contentAlign = "right";
    this.chart.legend.fontSize = 10
    let markerTemplate = this.chart.legend.markers.template;
    
    markerTemplate.width = 10;
    markerTemplate.height = 10
    this.createSeriesOverdue("total_meeting_count", "Meeting")
    this.createSeriesOverdue("total_meeting_action_count", "Action Plan")
    
    this._utilityService.detectChanges(this._cdr);
  }

  createSeriesOverdue(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "month";
    series.sequencedInterpolation = true;
    series.name = name;
    // series.columns.template.events.on("hit",this.riskTreatmentOverdueClick,this)
    series.columns.template.width = am4core.percent(40);
    series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    series.columns.template.events.on("hit",this.meetingByActionPlan,this)

    let bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.interactionsEnabled = false
    bullet.locationY = 0;
    bullet.dy = -20;
    // bullet.label.text = '{valueY}'
    bullet.label.fill = am4core.color('#00000')
  }

  gotoMeetingPlan(){
    this._router.navigateByUrl('mrm/meeting-plans');
  }

  gotoUpcomingMeeting(){
    MRMDashboardStore.dashboardParam='&meeting_plan_status_ids=2';
    this._router.navigateByUrl('mrm/meeting-plans');
  }

  gotoMeeting(){
    this._router.navigateByUrl('mrm/meetings');
  }

  gotoActionPlan(type){
    if(type=='open'){// it is open and wip stuats
      MRMDashboardStore.dashboardParam='&meeting_action_plan_status_ids=1,2';
    }else if(type=='closed'){ //close and resolved
      MRMDashboardStore.dashboardParam='&meeting_action_plan_status_ids=5,3';
    }else{
      MRMDashboardStore.dashboardParam='';
    }
    this._router.navigateByUrl('mrm/meeting-action-plans');
  }

  meetingByActionPlan(event)
  {
    let year = event.target.dataItem.dataContext.year;
    let month=  event.target.dataItem.dataContext.month_num;
    if(event.target.dataItem.dataContext.title=='action_plan')
    {
      MRMDashboardStore.dashboardParam='&year='+year+'&month='+month;
      this._router.navigateByUrl('mrm/meeting-action-plans');
    }
    else
    {
      MRMDashboardStore.dashboardParam='&year='+year+'&month='+month;
      this._router.navigateByUrl('mrm/meetings');
    }
    
  }

  ngOnDestroy(): void {
    MRMDashboardStore.unsetMRMCounts();
    this.chart1=true;
    this.chart2=true;
    this.chart3=true;
    this.filterSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
  }
}
