import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { Router } from '@angular/router';
import { EventDashboardService } from 'src/app/core/services/event-monitoring/event-dashboard/event-dashboard.service';
import { EventDashboardStore } from 'src/app/stores/event-monitoring/dashboard/dashboard-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.scss']
})
export class EventDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('eventStatusePieChart') eventStatusePieChart: ElementRef<HTMLElement>;
  @ViewChild('eventBarChart') eventBarChart: ElementRef<HTMLElement>;
  @ViewChild('taskByStatusPieChart') taskByStatusPieChart: ElementRef<HTMLElement>;
  @ViewChild('budgetChart') budgetChart: ElementRef<HTMLElement>;
  @ViewChild('milestoneBarChart') milestoneBarChart: ElementRef<HTMLElement>;

  EventDashboardStore = EventDashboardStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  AuthStore = AuthStore

  private destroy$ = new Subject()
  count: number=null
  noPieChart: boolean=false;
  noBarChart: boolean=false;
  noPieChartTask: boolean=false;
  noBarChartBudget: boolean=false;
  noBarChartMilestone: boolean=false;

  emptyList= "no_data_found";
  type: string = 'over-due'
  selected_id = [];

  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventDashboardService: EventDashboardService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      // this.EventDashboardStore.dashboardLoaded = false;
      this.getEventByStatuses()
      this.getEventTaskCounts()
      this.getEventTaskByStatuses()
      this.getEventByDepartments()
      this.getMilestoneByMonth()
      this.getEventBudgetByDepartments()
      // setTimeout(() => {
      //   this.EventDashboardStore.dashboardLoaded = true;
      // }, 1000);
    });
    this.getEventByStatuses()
      this.getEventTaskCounts()
      this.getEventTaskByStatuses()
      this.getEventByDepartments()
      this.getMilestoneByMonth()
      this.getEventBudgetByDepartments()
    this._utilityService.detectChanges(this._cdr);
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'event_main_dashbord';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',
          'event_type_ids',
          'event_priority_ids',
          'event_status_ids',
        ]);
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    
  }

  getEventByStatuses() {
    this._eventDashboardService.getEventByStatuses().pipe(takeUntil(this.destroy$)).subscribe(res => {
      // this.getEventByOverdue();
      if (EventDashboardStore.dashboardCount.length != 0) {
      
        this.getOverDueCount(res);
        this.count = null;
        this.noPieChart = false;
        // res.forEach(element => {
        //   this.count+=element.count
        // });
        this.pieChartForEventStatuses(res)
      }
      else
        {
          this.count = null;
          this.noPieChart=true
          this.pieChartForEventStatuses(res);
        } 
      // else{
      //   this.noPieChart=true
      // }
    })
    this._utilityService.detectChanges(this._cdr);
  }

  // getOverDueCount(){
  //   let pthis = this;
  //   this._eventDashboardService.getEventByOverdue().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

  //     // let testData:any=res
  //     // console.log(this.EventDashboardStore.dashboardCount)
  //     // if(this.EventDashboardStore.dashboardCount.length>0)
  //     let index=pthis.EventDashboardStore?.dashboardCount?.findIndex(e=>e.type== 'over-due')
  //     if(index != -1) pthis.EventDashboardStore.dashboardCount[index].count = res;
  //     pthis.count = null;
  //     pthis.noPieChart = false;
  //     pthis.EventDashboardStore.dashboardCount.forEach(element => {
  //       pthis.count+=element.count
  //       });
  //       pthis.pieChartForEventStatuses(pthis.EventDashboardStore.dashboardCount)
  //     // this.EventDashboardStore.dashboardCount[index].count=testData
      
  //     // var index = this.EventDashboardStore.dashboardCount.findIndex(e => e.count == res)
  //     // if (index != -1) {
  //     //   return true
  //     // }
  //   })
  // }

  getOverDueCount(data){
    let pthis = this;
    this._eventDashboardService.getEventByOverdue().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {     
      let dataArray=[];
      for(let i of data){

        if(i.type=='over-due'){
          
          dataArray.push({
            count: res,
            id: i.id,
            percentage: i.percentage,
            title: i.title,
            type: i.type
          })
        }else{
          dataArray.push({
            count: i.count,
            id: i.id,
            percentage: i.percentage,
            title: i.title,
            type: i.type
          })
        }
        
      }
      EventDashboardStore.setEventByStatuses(dataArray)

      pthis.count = null;
      pthis.noPieChart = false;
      pthis.EventDashboardStore.dashboardCount.forEach(element => {
        pthis.count+=element.count
        });
        pthis.pieChartForEventStatuses(pthis.EventDashboardStore.dashboardCount)
 
    })
  }

  getEventByOverdue(){
    this._eventDashboardService.getEventByOverdue().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.pieChartForEventStatuses(res);
    })
  }

  getEventTaskCounts() {
    this._eventDashboardService.getTaskCounts().pipe(takeUntil(this.destroy$)).subscribe(res => {
    })
  }

  getEventTaskByStatuses() {
    this.noPieChartTask = false;
    this._eventDashboardService.getEventTaskByStatuses().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.taskByStatuses.length !=0){
        
        this.pieChartForTaskByStatuses()
      }else{
        this.noPieChartTask=true
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventByDepartments() {
    this.noBarChart=false
    this._eventDashboardService.getEventByDepartments().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.eventDepartments.length !=0){
        this.barChartForEvent(1)
      }else{
        this.noBarChart=true
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventByTypes() {
    this.noBarChart=false
    this._eventDashboardService.getEventByTypes().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.eventByTypes.length !=0){
        this.barChartForEvent(2)
      }else{
        this.noBarChart=true
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventByYears() {
    this.noBarChart=false
    this._eventDashboardService.getEventByYears().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.eventByYears.length !=0){        
        this.barChartForEvent(3)
      }else{
        this.noBarChart=true
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMilestoneByMonth() {
    this.noBarChartMilestone=false
    this._eventDashboardService.getMilestoneByMonth().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.milestoneByMonths.length !=0){
        this.barChartForMilestone(1)
      }else{
        this.noBarChartMilestone=true
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMilestoneByDepartments() {
    this.noBarChartMilestone=false
    this._eventDashboardService.getMilestoneByDepartments().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.milestoneByDepartments.length !=0){
        this.barChartForMilestone(2)
      }else{
        this.noBarChartMilestone=true
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventBudgetByDepartments() {
    this.noBarChartBudget=false
    this._eventDashboardService.getEventBudgetByDepartments().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.budgetByDepartments.length !=0){
        this.barChartForBudget(1)
      }else{
        this.noBarChartBudget=true
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventBudgetByYears() {
    this.noBarChartBudget=false
    this._eventDashboardService.getEventBudgetByYears().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(EventDashboardStore.budgetByYears.length !=0){
        this.barChartForBudget(2)
      }else{
        this.noBarChartBudget=true
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pieChartForEventStatuses(statusData) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.eventStatusePieChart?.nativeElement, am4charts.PieChart);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = EventDashboardStore.dashboardCount;
    }
    chart.data = EventDashboardStore.dashboardCount
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Document Status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
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
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.labels.template.wrap = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.eventStatusClick,this)
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

  eventStatusClick(ev) {
    EventDashboardStore.setDashboardParam(`&event_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/event-monitoring/events');
  }

  pieChartForTaskByStatuses() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create(this.taskByStatusPieChart?.nativeElement, am4charts.PieChart);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    chart.data = EventDashboardStore.taskByStatuses
    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Task By Statuses";
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
    chart.legend.labels.template.disabled = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.taskByStatusClick,this)
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

    // this._utilityService.detectChanges(this._cdr);
  }

  taskByStatusClick(ev) {
    EventDashboardStore.setDashboardParam(`&event_task_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/event-monitoring/event-tasks');
  }

  //this is bar chart creation of risk and risk treatment department
  barChartForEvent(filter: number) {
    var valueY = ""
    var valueX = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.eventBarChart?.nativeElement, am4charts.XYChart);
    if (filter == 1) {
      chart.data = EventDashboardStore.eventDepartments
      valueX = "title"
      valueY = "count"
    }
    if (filter == 2) {
      chart.data = EventDashboardStore.eventByTypes
      valueX = "title"
      valueY = "count"
    }
    if (filter == 3) {
      chart.data = EventDashboardStore.eventByYears
      valueX = "year"
      valueY = "event_count"
    }

    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = valueX;
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.3;
    categoryAxis.renderer.cellEndLocation = 0.5;
    categoryAxis.renderer.minGridDistance = 11;
    categoryAxis.fontSize = 11;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Risks"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.maxWidth = 120;
    categoryAxis.renderer.labels.template.dx = -20
    // categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.tooltipText = '{category}';
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = valueX;
    series.name = "Visits";
    //series.columns.template.stroke =filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    //series.columns.template.fill = filter==1? am4core.color("#4670C0"):filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
    if (valueY === 'percentage') {
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";
    } else {
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    }
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.eventByDepratmentClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.eventByTypeClick,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.eventByYearClick,this)
     }

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    //this._utilityService.detectChanges(this._cdr);
  }

  eventByDepratmentClick(ev) {
    EventDashboardStore.setDashboardParam(`&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/event-monitoring/events');
  }

  eventByTypeClick(ev) {
    EventDashboardStore.setDashboardParam(`&event_type_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/event-monitoring/events');
  }

  eventByYearClick(ev) {
    EventDashboardStore.setDashboardParam(`&year=${ev?.target?.dataItem?.dataContext?.year}`)
    this._router.navigateByUrl('/event-monitoring/events');
  }

  //chart-3
  barChartForMilestone(filter) {
    let dataArray
    // Create chart instance
    let chart = am4core.create(this.milestoneBarChart?.nativeElement, am4charts.XYChart);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top';
    chart.legend.contentAlign = "right";
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 40;
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    
    // chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95
    chart.legend.position = "top";
    chart.legend.contentAlign = "right";
    chart.responsive.enabled = true;

    //leagend disabled clickable
    chart.legend.itemContainers.template.clickable = false;
    chart.legend.itemContainers.template.focusable = false;
    chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'category'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;
    // xAxis.renderer.labels.template.rotation = -90;
    xAxis.renderer.minGridDistance = 10;
    //xAxis.autoGridCount = false;

    //autoGridCount: false;
    //xAxis.renderer.minGridDistance = 0;

    let label = xAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;
    label.location = 0.3
    label.tooltipText = '{category}'

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, name, color) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value;
      series.dataFields.categoryX = 'category';
      series.name = name;
      if(filter==1){
        series.columns.template.tooltipText = "{name}:[bold]{valueY}[/]\nTotalCount:[bold]{totalCount}[/]";
      }else{
        series.columns.template.tooltipText = "{name}:[bold]{valueY}[/]";
      }

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);
      series.columns.template.fill = am4core.color(color);
      series.columns.template.stroke = am4core.color(color);

      let bullet = series.bullets.push(new am4charts.LabelBullet())
      bullet.interactionsEnabled = false
      bullet.dy = 30;
      bullet.label.text = '{valueY}'
      bullet.label.fill = am4core.color('#000000')

      return series;
    }

    if (filter == 1) {
      dataArray = this._helperService.getArrayProcessed(EventDashboardStore.milestoneByMonths, null);
    }
    if (filter == 2) {
      dataArray = this._helperService.getArrayProcessed(EventDashboardStore.milestoneByDepartments, null);
    }

    if (filter == 1) {
      for (let i of dataArray) {
        chart.data.push({
          "category": i.month,
          "first": i.new_milestones,
          "second": i.completed_milestones,
          "third": i.delayed_milestones,
          "totalCount": i.total_count
        });
      }
    }
    if (filter == 2) {
      for (let i of dataArray) {
        chart.data.push({
          "category": i.department_title,
          "first": i.new_milestones,
          "second": i.completed_milestones,
          "third": i.delayed_milestones,
          "totalCount": i.total_count
        });
      }
    }

    if(filter==1){
      createSeries('first', 'New', '#ffe400');
      createSeries('second', 'Completed', '#22bf38');
      createSeries('third', 'Delayed', '#da2002');
    }
    if(filter==2){
      createSeries('first', 'New', '#ffe400');
      createSeries('second', 'Completed', '#22bf38');
      createSeries('third', 'Delayed', '#da2002');
    }

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "left";
    chart.exporting.menu.verticalAlign = "top";

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
  }

  barChartForBudget(filter) {
    var valueY = ""
    var valueX = ""
    var chart = am4core.create(this.budgetChart?.nativeElement, am4charts.XYChart);
    chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = this._helperService.translateToUserLanguage("milestone");
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add data
    if (filter == 1) {
      chart.data = EventDashboardStore.budgetByDepartments
      valueY = "department_amount"
      valueX = "title"
    }
    if (filter == 2) {
      chart.data = EventDashboardStore.budgetByYears
      valueY = "year_amount"
      valueX = "year"
    }
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
    categoryAxis.dataFields.category = valueX;
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
    valueAxis.fontSize = 12;
    valueAxis.maxPrecision = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#,## a";

    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = valueX;
      series.stacked = true;
      series.name = name;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryY}: {valueX}";
      // if(filter == 1){
      //   series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      //   series.columns.template.events.on("hit",this.budgetByDepratmentClick,this)
      //  }
      //  if(filter == 2){
      //   series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      //   series.columns.template.events.on("hit",this.budgetByYearClick,this)
      //  }
    }

    if (valueY == "department_amount") {
      createSeries("department_amount", this._helperService.translateToUserLanguage("department_amount"));
    } else {
      createSeries("year_amount", this._helperService.translateToUserLanguage("year_amount"));
    }
    
  }

  // budgetByDepratmentClick(ev) {
  //   EventDashboardStore.setDashboardParam(`&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
  //   this._router.navigateByUrl('/event-monitoring/events');
  // }

  // budgetByYearClick(ev) {
  //   EventDashboardStore.setDashboardParam(`&year=${ev?.target?.dataItem?.dataContext?.year}`)
  //   this._router.navigateByUrl('/event-monitoring/events');
  // }

  gotoStakeholder() {
    this._router.navigateByUrl("/event-monitoring/stakeholder-dashboard")
  }

  gotoClosure() {
    this._router.navigateByUrl("/event-monitoring/closure-dashboard")
  }

  gotoRequest() {
    this._router.navigateByUrl("/event-monitoring/cr-dashboard")
  }

  //need to destroy 
  ngOnDestroy() {
    am4core.disposeAllCharts();
    this.destroy$.next()
    this.destroy$.complete()
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
