import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KhDashboardStore } from 'src/app/stores/knowledge-hub/kh-dashboard/kh-dashboard-store'
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KhDashboardService } from 'src/app/core/services/knowledge-hub/kh-dashboard/kh-dashboard.service';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss']
})
export class DashboardDetailsComponent implements OnInit {

  @ViewChild('type') type: ElementRef<HTMLElement>;
  @ViewChild('crStatus') crStatus: ElementRef<HTMLElement>;
  @ViewChild('status') status: ElementRef<HTMLElement>;
  @ViewChild('department') department: ElementRef<HTMLElement>;
  @ViewChild('priority') priority: ElementRef<HTMLElement>;

  reactionDisposer: IReactionDisposer;
  KhDashboardStore = KhDashboardStore
  private destroy$ = new Subject()
  private multipleCall;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _khDashboardService: KhDashboardService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: '../' } },
      ]
      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
    });

    this.multipleCall = zip(
      this.getDocumentByPriority(),
      this.getDocumentByCRStatuses(),
      this.getDocumentByStatuses(),
      this.getDocumentByTypes(),
      this.getDocumentByDepartments()
    )

    this.multipleCall.pipe(takeUntil(this.destroy$)).subscribe(values => {
      if (values.length != 0) {
        this.documentByPriority()
        this.pieChartForCRStatuses()
        this.documentByStatus()
        this.documentByTypes()
        this.documentByDepartment()
      }
    })
  }

  getDocumentByPriority(){
    return this._khDashboardService.getDocumentByPriority()
  }

  getDocumentByCRStatuses() {
    return this._khDashboardService.getDocumentByCRStatuses()
  }

  getDocumentByStatuses() {
    return this._khDashboardService.getDocumentByStatuses()
  }

  getDocumentByTypes() {
    return this._khDashboardService.getDocumentByTypes()
  }

  getDocumentByDepartments() {
    return this._khDashboardService.getDocumentByDepartments()
  }

  //chart 1
  documentByPriority() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.priority.nativeElement, am4charts.PieChart);
    chart.data = KhDashboardStore.documentPriority
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
    this._utilityService.detectChanges(this._cdr);
  }

  //chart 2
  pieChartForCRStatuses() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.crStatus.nativeElement, am4charts.PieChart);
    chart.data = KhDashboardStore.documentCRStatuses
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Document Status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.marginTop = 15;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;

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
    this._utilityService.detectChanges(this._cdr);
  }

  //chart 3
  documentByStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create(this.status.nativeElement, am4charts.XYChart);
    chart.data = KhDashboardStore.documentStatuses

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "count";
    series.dataFields.categoryY = "title";
    series.columns.template.tooltipText = "{category}:[bold]{count}%[/]\nCount:[bold]{count}[/]\nTotalCount:[bold]{totalCount}[/]";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.propertyFields.stroke = "color"
    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.fontSize = 15;
    valueLabel.label.horizontalCenter = "right";
    valueLabel.label.text = "{count}" + "%";

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    this._utilityService.detectChanges(this._cdr);
  }

  //chart 4
  documentByTypes() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create(this.type.nativeElement, am4charts.PieChart);

    chart.data = KhDashboardStore.documentTypes
    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "DocumentByType"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Document By Type";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.marginTop = 15;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.itemContainers.template.padding(3,0,3,0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "suggested_timing";
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
    this._utilityService.detectChanges(this._cdr);
  }

  //chart 5
  documentByDepartment() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.department.nativeElement, am4charts.XYChart);
    chart.data = KhDashboardStore.documentDepartment

    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code";
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
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "code";
    series.name = "Visits";

    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    am4core.disposeAllCharts();
  }

}
