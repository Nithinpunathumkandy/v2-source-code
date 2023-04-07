import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AMAuditDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/am-audit-dashboard.store';
import { AmAuditDashboardService } from 'src/app/core/services/audit-management/am-audit-dashboard/am-audit-dashboard.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Router } from '@angular/router';
import { toJS } from 'mobx';

@Component({
  selector: 'app-audit-management-dashboard',
  templateUrl: './audit-management-dashboard.component.html',
  styleUrls: ['./audit-management-dashboard.component.scss']
})
export class AuditManagementDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('caPieChart') caPieChart: ElementRef<HTMLElement>;
  @ViewChild('programCategory') programCategory: ElementRef<HTMLElement>;
  @ViewChild('findingXYChart') findingXYChart: ElementRef<HTMLElement>;
  @ViewChild('planXYChart') planXYChart: ElementRef<HTMLElement>;

  AMAuditDashboardStore = AMAuditDashboardStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  showBarChart: boolean = true
  showBarChartPlan: boolean = true
  showPieChart: boolean = true
  showPieChartProgram: boolean = true

  filterSubscription: Subscription = null;

  highestNumber: string
  highestRating: string

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _router:Router,
    private _eventEmitterService: EventEmitterService,
    private _amAuditDashboardService: AmAuditDashboardService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;


    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      AMAuditDashboardStore.unsetDashboardData()
      am4core.disposeAllCharts();    
      am5.disposeAllRootElements();
      AMAuditDashboardStore.commonLoader = false;
      this.getAuditCounts()    
      this.getAuditStatus()
      this.getAuditPlan()
      this.getFindingRiskRating()
      this.getAuditDepartment()
      this.getCorrectiveAction()
      this.getImpactAnalysis()
    });

    RightSidebarLayoutStore.filterPageTag = 'am_audit_dashboard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      // 'audit_manager_ids',
      'am_audit_status_ids',
      'department_ids',
      'risk_rating_ids',
      'finding_status_ids',
      'responsible_user_ids'
    ]);
    this.getAuditCounts()
    // this.getCorrectiveActionCountByStatuses()
    // this.getProgramCountByCategories()
    // this.getFindingCountByStatuses()
    // this.getAnnualPlanCountByAuditors()
    this.getAuditStatus()
    this.getAuditPlan()
    this.getFindingRiskRating()
    this.getAuditDepartment()
    this.getCorrectiveAction()
    this.getImpactAnalysis()
  }

  getAuditCounts() {
    this._amAuditDashboardService.getAuditCount().subscribe(res => {

    })
  }

  getAuditStatus() {
    this.showPieChart = true
    this._amAuditDashboardService.getAuditStatuses().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.getAuditStatuses?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getAuditStatusChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getAuditPlan() {
    this.showPieChart = true
    this._amAuditDashboardService.getAuditPlan().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.getAuditPlan?.total_am_audit == 0 && AMAuditDashboardStore.getAuditPlan?.total_am_individual_audit_plan ==0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getAuditPlanChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getFindingRiskRating() {
    this.showPieChart = true
    this._amAuditDashboardService.getFindingRiskRating().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.getFindingRiskRating?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getFindingRiskRatingChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getAuditDepartment() {
    this.showPieChart = true
    this._amAuditDashboardService.getAuditDepartment().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.getAuditDepartment?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getAuditDepartmentChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getCorrectiveAction() {
    this._amAuditDashboardService.getCorrectiveAction().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getImpactAnalysis() {
    this._amAuditDashboardService.getImpactAnalysis().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCorrectiveActionCountByStatuses() {
    this.showPieChart = true
    this._amAuditDashboardService.getCorrectiveActionCountByStatuses().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.caCountByStatuses?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createPieChartCA()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getProgramCountByCategories() {
    this.showPieChartProgram = true
    this._amAuditDashboardService.getProgramCountByCategories().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.programCountByCategory?.length == 0) {
        this.showPieChartProgram = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createRiskByStatus()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getFindingCountByDepartments() {
    this.showBarChart = true
    this._amAuditDashboardService.getFindingCountByDepartments().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.findingCountByDepartments?.length == 0) {
        this.showBarChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createBarChart(2)
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getFindingCountByStatuses() {
    this.showBarChart = true
    this._amAuditDashboardService.getFindingCountByStatuses().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.findingCountByStatuses?.length == 0) {
        this.showBarChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createBarChart(1)
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getAnnualPlanCountByAuditors() {
    this.showBarChartPlan = true
    this._amAuditDashboardService.getAnnualPlanCountByAuditors().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.planCountByAuditors?.length == 0) {
        this.showBarChartPlan = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createBarChartForPlan(1);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getAnnualPlanCountByDepartments() {
    this.showBarChartPlan = true
    this._amAuditDashboardService.getAnnualPlanCountByDepartments().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.planCountByDepartments?.length == 0) {
        this.showBarChartPlan = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createBarChartForPlan(2);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getAnnualPlanCountByYears() {
    this.showBarChartPlan = true
    this._amAuditDashboardService.getAnnualPlanCountByYears().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AMAuditDashboardStore.planCountByYears?.length == 0) {
        this.showBarChartPlan = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.createBarChartForPlan(3);
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  //Chart 1
  createPieChartCA() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create(this.caPieChart?.nativeElement, am4charts.PieChart);
    chart.data = AMAuditDashboardStore.caCountByStatuses;

    // for exporting the data
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Status"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Status";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    // pieSeries.slices.template.events.on("hit", this.riskRatingNavigation, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

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

  //Chart 2
  createRiskByStatus() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create(this.programCategory?.nativeElement, am4charts.PieChart);

    // Add data
    chart.data = AMAuditDashboardStore.programCountByCategory

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.maxWidth = 100;
    chart.legend.maxHeight = 150;
    chart.legend.scrollable = true;
    //leagend disabled clickable
    chart.legend.itemContainers.template.clickable = false;
    chart.legend.itemContainers.template.focusable = false;
    chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.tooltipText = "{category}:[bold]{count}[/]\n";
    // pieSeries.slices.template.events.on("hit", this.navigateToAudit, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
    chart.exporting.menu = new am4core.ExportMenu();

    this._utilityService.detectChanges(this._cdr);
  }

  //Chart 3
  createBarChart(filter: number = 1) {
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if (filter == 1) {
      chart = am4core.create(this.findingXYChart?.nativeElement, am4charts.XYChart);
      chart.data = AMAuditDashboardStore.findingCountByStatuses
      y = "count"
      x = 'title'
    }
    if (filter == 2) {
      chart = am4core.create(this.findingXYChart?.nativeElement, am4charts.XYChart);
      chart.data = AMAuditDashboardStore.findingCountByDepartments
      y = "count"
      x = 'title'
    }

    chart.numberFormatter.numberFormat = "#.";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.fontSize = 12;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function (ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "BPM"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.fontSize = 12;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "title";
    lineSeries.dataFields.valueY = "count";
    lineSeries.tooltipText = "count: {valueY.value}";
    lineSeries.fillOpacity = 0;
    lineSeries.strokeWidth = 3;

    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#416f93");
    bullet.circle.strokeWidth = 3;
    // bullet.events.on("hit",this.lineChartClicked,this)

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    this._utilityService.detectChanges(this._cdr);
  }

  //Chart 4
  createBarChartForPlan(filter: number) {
    var valueX = ""
    var valueY = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create(this.planXYChart?.nativeElement, am4charts.XYChart);
    if (filter == 1) {
      chart.data = AMAuditDashboardStore.planCountByAuditors
      valueX = "audit_manager_first_name"
      valueY = "individual_audit_plans_count"
    }
    if (filter == 2) {
      chart.data = AMAuditDashboardStore.planCountByDepartments
      valueX = "title"
      valueY = "individual_audit_plans_count"
    }
    if (filter == 3) {
      chart.data = AMAuditDashboardStore.planCountByYears
      valueX = "year"
      valueY = "individual_audit_plans_count"
    }

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
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.tooltipText = '{category}';
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = valueX;
    series.name = "Visits";
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

  //chart1

  getAuditStatusChart() {
    am4core.addLicense("CH199714744");
    // Create chart
    var chart = am4core.create("risk-by-rating-chart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = AMAuditDashboardStore.getAuditStatuses

    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "count";
    // series.dataFields.radiusValue = "count";
    series.dataFields.category = "title";
    series.slices.template.propertyFields.fill = "color_code";
    series.slices.template.cornerRadius = 1;
    series.colors.step = 3;
    series.hiddenState.properties.endAngle = -90;
    series.slices.template.events.on("hit", this.navigateToAudit, this);
    series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    chart.legend = new am4charts.Legend();
    chart.legend.hide();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "center";
    chart.legend.useDefaultMarker = true;
    chart.legend.fontSize = 0;
    chart.legend.maxHeight = 0;
    chart.legend.scrollable = true;

    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;

    /* Create axes */

    var label = series.labels.template;

    label.wrap = true;

    label.maxWidth = 80;
    label.fontSize = 10;
    label.fill = am4core.color("#33475B");
  }

  getAuditPlanChart() {

    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    let dataArray = [
        { title: 'Audit Plan', value: null,color: '#6771DC',type:'audit-plan' },
        { title: 'Audits', value: null,color: '#DC676F',type:'audits' },
      ]

    dataArray[0].value = AMAuditDashboardStore.getAuditPlan?.total_am_individual_audit_plan
    dataArray[1].value = AMAuditDashboardStore.getAuditPlan?.total_am_audit

    chart.data = dataArray

    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
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
    categoryAxis.renderer.labels.template.tooltipText = '{category}';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "title";
    series.name = "Visits";
    series.columns.template.propertyFields.stroke="color"
    series.columns.template.propertyFields.fill = "color"
    series.columns.template.width = am4core.percent(40);
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",  this.navigateToAuditvsPlan, this);

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{value}";
    valueLabel.label.dy = 20;
    valueLabel.label.fill = am4core.color("#fff");
    valueLabel.label.fontSize = 14;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
    
  }

  getFindingRiskRatingChart() {
    am4core.addLicense("CH199714744");
    var chart = am4core.create("risk-treatment-chart", am4charts.PieChart);
    chart.data = AMAuditDashboardStore.getFindingRiskRating
    this.getMaxCount(AMAuditDashboardStore.getFindingRiskRating)
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.events.on("hit", this.riskRatingNavigation, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 100;
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
    
    chart.innerRadius = am4core.percent(60);

    var label = pieSeries.createChild(am4core.Label);
    label.text = "[bold]"+this.highestNumber+"[/]" + "\n "+this.highestRating;
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 13;
    label.textAlign = "middle";
  }

  getMaxCount(data){
    const amounts = data.map((a) => a.count)
    const highestAmount = Math.max(...amounts);
    var obj = data.find(obj => obj.count === highestAmount);
    this.highestRating = obj.title
    this.highestNumber = highestAmount.toString()
  }

  getAuditDepartmentChart() {      
    // var root = am5.Root.new("chartdiv2");
        
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chartdiv2", am4charts.XYChart);

    chart.data = AMAuditDashboardStore.getAuditDepartment

    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    if(AMAuditDashboardStore.getAuditDepartment?.length <= 3){
      categoryAxis.renderer.cellStartLocation = 0.4;
      categoryAxis.renderer.cellEndLocation = 0.6;
    }else{
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
    }
    
    categoryAxis.renderer.minGridDistance = 10;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Risks"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.maxWidth = 120;
    categoryAxis.renderer.labels.template.tooltipText = '{category}';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "title";
    series.name = "Visits";
    series.columns.template.propertyFields.stroke="color_code"
    series.columns.template.propertyFields.fill = "color_code"
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",  this.navigateToAuditvsPlan, this);
    series.columns.template.width = am4core.percent(40);

    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{count}";
    valueLabel.label.dy = 20;
    valueLabel.label.fill = am4core.color("#fff");
    valueLabel.label.fontSize = 14;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);

  }

  changeReponse(data){
    let dummy = []
    data.forEach(element => {
      dummy.push({id:element?.id,title:element?.title,count:element?.count,columnSettings: { fill: element?.color_code ? element?.color_code : '#67b7dc'}})
    });
    return dummy
  }

  //Navigation starts

  goToFindings(){
    this._router.navigateByUrl(`/audit-management/finding-dashboard`)
  }

  goToAudit(count){
    if(count !=0){
      this._router.navigateByUrl(`/audit-management/am-audits`)
    }    
  }

  goToFinding(count){
    if(count !=0){
      this._router.navigateByUrl(`/audit-management/am-audits-findings`)
    }    
  }

  goToAuditPlan(){
    this._router.navigateByUrl(`/audit-management/finding-dashboard`)
  }

  goToAuditProgram(count){
    if(count !=0){
      this._router.navigateByUrl(`/audit-management/am-audit-plans`)
    }    
  }

  goToTopFindings(){
    this._router.navigateByUrl(`/audit-management/top-finding-dashboard`)
  }

  goToIndividualAuditPlan(count){
    if(count !=0){
      this._router.navigateByUrl(`/audit-management/individual-audit-plans`)
    }    
  }

  navigateToAudit(ev){
    AMAuditDashboardStore.setDashboardParam(`am_audit_status_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/audit-management/am-audits`)
  }

  navigateToAuditvsPlan(event){
    var seriesIndex = event?.target?.dataItem?.dataContext?.type == 'audits'
    if(seriesIndex){
      this._router.navigateByUrl(`/audit-management/am-audits`)
    }else{
      this._router.navigateByUrl(`/audit-management/individual-audit-plans`)
    }
  }

  navigateToAuditByDepartment(ev){
    AMAuditDashboardStore.setDashboardParam(`department_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/audit-management/am-audits`)
  }

  riskRatingNavigation(ev){
    AMAuditDashboardStore.setDashboardParam(`risk_rating_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/audit-management/am-audit-findings`)
  }

  //Navigations ends

  ngOnDestroy(): void {
    am4core.disposeAllCharts();
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    AMAuditDashboardStore.unsetDashboardData()
    this._rightSidebarFilterService.resetFilter();
    am5.disposeAllRootElements();
  }

}
