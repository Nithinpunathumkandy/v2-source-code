import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { AmAuditDashboardService } from 'src/app/core/services/audit-management/am-audit-dashboard/am-audit-dashboard.service';
import { AuditFindingDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/audit-finding-dashboard.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { AMAuditDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/am-audit-dashboard.store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-am-findings-dashboard',
  templateUrl: './am-findings-dashboard.component.html',
  styleUrls: ['./am-findings-dashboard.component.scss']
})
export class AmFindingsDashboardComponent implements OnInit {

  AMAuditDashboardStore = AMAuditDashboardStore
  AuditFindingDashboardStore = AuditFindingDashboardStore

  showPieChart: boolean = true
  findingDepartment: string
  filterSubscription: Subscription = null;

  highestNumber: string
  highestRating: string

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _amAuditDashboardService: AmAuditDashboardService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      AMAuditDashboardStore.commonLoader = false;
      this.getFindingsCount()
    this.getFindingStatuses()
    this.getFindingYears()
    this.getActionPlan()
    this.getFindingDepartment()
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
    this.getFindingsCount()
    this.getFindingStatuses()
    this.getFindingYears()
    this.getActionPlan()
    this.getFindingDepartment()
    this.getImpactAnalysis()
  }

  getFindingsCount() {
    this._amAuditDashboardService.getFindingsCount().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditFindingDashboardStore?.findingsCount?.finding_by_risk_rating?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getFindingRiskRatingChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getFindingStatuses() {
    this._amAuditDashboardService.getFindingStatuses().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindingYears() {
    this._amAuditDashboardService.getFindingYears().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditFindingDashboardStore?.findingCountByYears?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getFindingTrendsChart()
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getActionPlan() {
    this._amAuditDashboardService.getActionPlan().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindingDepartment() {
    this.findingDepartment = "Rating"
    this._amAuditDashboardService.getFindingDepartment().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditFindingDashboardStore?.findingCountByDepartments?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getFindingDepartmentRating(1)
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getFindingDepartmentStatus() {
    this.findingDepartment = "Status"
    this._amAuditDashboardService.getFindingDepartmentStatus().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (AuditFindingDashboardStore?.findingCountByDepartments?.length == 0) {
        this.showPieChart = false
        this._utilityService.detectChanges(this._cdr);
      } else {
        this.getFindingDepartmentRating(2)
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  getImpactAnalysis() {
    this._amAuditDashboardService.getImpactAnalysis().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTopFinding() {
    this._amAuditDashboardService.getTopFinding().subscribe(res => {

    })
  }

  getFindingRiskRatingChart() {
    am4core.addLicense("CH199714744");
    var chart = am4core.create("findings-by-risk-rating-qcb", am4charts.PieChart);

    chart.data = AuditFindingDashboardStore?.findingsCount?.finding_by_risk_rating
    this.getMaxCount(AuditFindingDashboardStore?.findingsCount?.finding_by_risk_rating)
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.slices.template.events.on("hit", this.riskRatingNavigation, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "center";
    chart.legend.useDefaultMarker = true;
    chart.legend.fontSize = 12;
    chart.legend.maxHeight = 70;
    chart.legend.scrollable = true;

    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;

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

  getFindingTrendsChart() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("chart-finding-trend-qcb", am4charts.XYChart);

    chart.data = AuditFindingDashboardStore?.findingCountByYears

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.start = 0.0;
    categoryAxis.end = 0.75;
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";


    let label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = '{category}'

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.min = 0;
    // valueAxis.max = 100;


    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "finding_count";
    series1.dataFields.categoryX = "month";
    series1.name = "month";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{categoryX}: {valueY}";
    // series1.legendSettings.valueText = "{valueY}";
    // series1.visible = false;

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = "zoomY";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "JSO"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
  }

  getFindingDepartmentRating(type) {
    am4core.addLicense("CH199714744");
    var container = am4core.create("findings-by-department-rating", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";


    var chart = container.createChild(am4charts.PieChart);
    chart.data = AuditFindingDashboardStore?.findingCountByDepartments

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.propertyFields.fill = "color_code";
    // pieSeries.slices.template.events.on("hit", this.findingDepartmentNavigation, this);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

    pieSeries.slices.template.events.on("hit", function (event) {
      selectSlice(event.target.dataItem);
    })

    var chart2 = container.createChild(am4charts.PieChart);
    chart2.width = am4core.percent(30);
    chart2.radius = am4core.percent(80);

    // Add and configure Series
    var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "value";
    pieSeries2.dataFields.category = "name";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    pieSeries2.slices.template.propertyFields.fill = "color_code";
    if(type==1){
      pieSeries2.slices.template.events.on("hit", this.findingDepartmentNavigation, this);
    }else{
      pieSeries2.slices.template.events.on("hit", this.findingDepartmentNavigationStatus, this);
    }
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color("#ffffff");
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.events.on("positionchanged", updateLines);

    var interfaceColors = new am4core.InterfaceColorSet();

    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    line1.isMeasured = false;

    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;

    var selectedSlice;

    function selectSlice(dataItem) {

      selectedSlice = dataItem.slice;

      var fill = selectedSlice.fill;

      var count = dataItem.dataContext.subData.length;
      // pieSeries2.colors.list = [];
      // for (var i = 0; i < count; i++) {
      //   pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
      // }

      chart2.data = dataItem.dataContext.subData;
      pieSeries2.appear();

      var middleAngle = selectedSlice.middleAngle;
      var firstAngle = pieSeries.slices.getIndex(0).startAngle;
      var animation = pieSeries.animate([{
        property: "startAngle",
        to: firstAngle - middleAngle
      }, {
        property: "endAngle",
        to: firstAngle - middleAngle + 360
      }], 600, am4core.ease.sinOut);
      animation.events.on("animationprogress", updateLines);

      selectedSlice.events.on("transformed", updateLines);

      //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
      //  animation.events.on("animationprogress", updateLines)
    }


    function updateLines() {
      if (selectedSlice) {
        var p11 = {
          x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle),
          y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle)
        };
        var p12 = {
          x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc),
          y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc)
        };

        p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
        p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

        var p21 = {
          x: 0,
          y: -pieSeries2.pixelRadius
        };
        var p22 = {
          x: 0,
          y: pieSeries2.pixelRadius
        };

        p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
        p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

        line1.x1 = p11.x;
        line1.x2 = p21.x;
        line1.y1 = p11.y;
        line1.y2 = p21.y;

        line2.x1 = p12.x;
        line2.x2 = p22.x;
        line2.y1 = p12.y;
        line2.y2 = p22.y;
      }
    }

    chart.events.on("datavalidated", function () {
      setTimeout(function () {
        selectSlice(pieSeries.dataItems.getIndex(0));
      }, 1000);
    });

  }

  goToDashboard() {
    this._router.navigateByUrl(`/audit-management/dashboard`)
  }

  goToTopFindings() {
    this._router.navigateByUrl(`/audit-management/top-finding-dashboard`)
  }

  riskRatingNavigation(ev){
    AMAuditDashboardStore.setDashboardParam(`risk_rating_ids=${ev.target.dataItem.dataContext.id}`)
    this._router.navigateByUrl(`/audit-management/am-audit-findings`)
  }

  findingDepartmentNavigation(ev){
    AMAuditDashboardStore.setDashboardParam(`risk_rating_ids=${ev.target.dataItem.dataContext?.id}&department_ids=${ev.target.dataItem.dataContext?.department_id}`)
    this._router.navigateByUrl(`/audit-management/am-audit-findings`)
  }
  
  findingDepartmentNavigationStatus(ev){
    AMAuditDashboardStore.setDashboardParam(`finding_status_ids=${ev.target.dataItem.dataContext?.id}&department_ids=${ev.target.dataItem.dataContext?.department_id}`)
    this._router.navigateByUrl(`/audit-management/am-audit-findings`)
  }

  goToList(type,count){
    if(count !=0){
      if(type=='total'){
        this._router.navigateByUrl(`/audit-management/am-audit-findings`)
      }else if(type == 'open'){
        AMAuditDashboardStore.setDashboardParam(`finding_status_id=1`)
        this._router.navigateByUrl(`/audit-management/am-audit-findings`)
      }else {
        AMAuditDashboardStore.setDashboardParam(`finding_status_id=2`)
        this._router.navigateByUrl(`/audit-management/am-audit-findings`)
      }
    }
  }

  ngOnDestroy(){
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    AuditFindingDashboardStore.unsetDashboardData()
    this._rightSidebarFilterService.resetFilter();
  }

}
