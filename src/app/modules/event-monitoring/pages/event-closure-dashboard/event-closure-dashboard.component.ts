import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { EventDashboardService } from 'src/app/core/services/event-monitoring/event-dashboard/event-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventDashboardStore } from 'src/app/stores/event-monitoring/dashboard/dashboard-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

@Component({
  selector: 'app-event-closure-dashboard',
  templateUrl: './event-closure-dashboard.component.html',
  styleUrls: ['./event-closure-dashboard.component.scss']
})
export class EventClosureDashboardComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('crPieChart') crPieChart: ElementRef<HTMLElement>;
  @ViewChild('crBarChart') crBarChart: ElementRef<HTMLElement>;

  reactionDisposer: IReactionDisposer;
  EventDashboardStore=EventDashboardStore

  count:number=null
  noPieChart: boolean=false;
  noBarChart: boolean=false;

  emptyList = "no_data_found";

  filterSubscription: Subscription = null;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventDashboardService: EventDashboardService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      //this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../dashboard' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    });

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      // this.EventDashboardStore.dashboardLoaded = false;
      this.getClosureByStatuses()
      this.getEventClosureByDepartments()
      // setTimeout(() => {
      //   this.EventDashboardStore.dashboardLoaded = true;
      // }, 1000);
    });
    this.getClosureByStatuses()
    this.getEventClosureByDepartments()
    this._utilityService.detectChanges(this._cdr);
    
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
      RightSidebarLayoutStore.filterPageTag = 'event_closure_dashbord';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
        // 'event_type_ids',
        // 'event_priority_ids',
        'event_status_ids',
      ]);
      this._utilityService.detectChanges(this._cdr);
    // }, 1000);
  
}

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        //this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        //this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }  

  getClosureByStatuses() {
    this._eventDashboardService.getEventClosureByStatuses().subscribe(res => {
      if(EventDashboardStore.eventClosureByStatuses.length !=0){
        this.count = null;
        this.noPieChart=false;
        res.forEach(element => {
        this.count+=element.count
      });      
      this.pieChartForCR(res)
      }else
      {
        this.count = null;
        this.noPieChart=true
        this.pieChartForCR(res);
      }      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventClosureByDepartments() {
    this.noBarChart=false;
    this._eventDashboardService.getEventClosureByDepartments().subscribe(res => {
      if(EventDashboardStore.eventClosureByDepartments.length !=0){
        this.createBarChartForRisk()
      }else{
        this.noBarChart=true
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  pieChartForCR(chartData) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.crPieChart.nativeElement, am4charts.PieChart);
    if(chartData){
      chart.data = chartData
    }else{
      chart.data = EventDashboardStore.eventClosureByStatuses;
    }
    chart.data = EventDashboardStore.eventClosureByStatuses
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Document Status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.togglable = false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 14;
    markerTemplate.height = 14;
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
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

  createBarChartForRisk() {
    var valueY = ""
    var valueX = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.crBarChart.nativeElement, am4charts.XYChart);
    chart.data = EventDashboardStore.eventClosureByDepartments
    valueX = "title"
    valueY = "count"

    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = valueX;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.minGridDistance = 10;
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

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  //need to destroy 
  ngOnDestroy() {
    am4core.disposeAllCharts();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}
