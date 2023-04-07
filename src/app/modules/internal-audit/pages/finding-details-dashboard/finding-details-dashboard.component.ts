import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InternalAuditDashboardService } from 'src/app/core/services/internal-audit/dashboard/internal-audit-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { IADashboardStore } from 'src/app/stores/internal-audit/dashboard/dasboard-store';
import { IADepartmentRiskStore } from 'src/app/stores/internal-audit/dashboard/department-risk-rating-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';

@Component({
  selector: 'app-finding-details-dashboard',
  templateUrl: './finding-details-dashboard.component.html',
  styleUrls: ['./finding-details-dashboard.component.scss']
})
export class FindingDetailsDashboardComponent implements OnInit {

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  IADashboardStore = IADashboardStore;
  IADepartmentRiskStore = IADepartmentRiskStore;
  AuthStore = AuthStore
  close_count: { count: number; percentage: number; };
  open_count: { count: number; percentage: number; };
  showNoDataBarChart: boolean = false;
  chart

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,  
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _InternalAuditDashboardService:InternalAuditDashboardService,
    private _humanCpitalService: HumanCapitalService
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../dashboard"}
    ]);
    setTimeout(() => {
      this.getCharts();
      this.getAllCounts();
      this.showNoDataBarChart = false;
      IADashboardStore.dashboardLoaded = true;
    }, 100);
    this.pageChangeCorrectiveActionDepartment(1);
    this.pageChangeCorrectiveActionResponsibleUser(1);
    this.pageChangeDepartmentFindingsPagination(1);
  }

  ngAfterViewInit(){
    this.getCharts()
  }

  pageChangeCorrectiveActionDepartment(newPage: number = null) {
    if (newPage) IADashboardStore.setCurrentPageCorrectiveActionDepartment(newPage);
    this._InternalAuditDashboardService.getCorrectvieActionByDepartment(false,null).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  pageChangeDepartmentFindingsPagination(newPage: number = null) {
    if (newPage) IADepartmentRiskStore.setDepartmentFindingsPagination(newPage);
    this._InternalAuditDashboardService.getDepartmentFindingsPage(false,null).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  pageChangeCorrectiveActionResponsibleUser(newPage: number = null) {
    if (newPage) IADashboardStore.setCurrentPageCorrectiveActionResponsibleUser(newPage);
    this._InternalAuditDashboardService.getCorrectvieActionByResponsibleUser(false,null).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  assignChartData(){
    var chartData = [];
    var num = 0;
    IADashboardStore.DepartmentFindings.forEach(res=>{
      if(res.total!=0){
        chartData.push(res)
      }else{
        num++
        if(num==IADashboardStore.DepartmentFindings.length)this.showNoDataBarChart=true;
      }
    })
    return chartData
  }

  createDepartmentFindingsBarChart(){
    
    am4core.addLicense("CH199714744");
    this.chart = am4core.create("DepartmentFindingsBarChartDiv", am4charts.XYChart);
    this.chart.data =  this.assignChartData()
    this.chart.numberFormatter.numberFormat = "#";
    this.chart.colors.list = [
      am4core.color("#FF0000"),
      am4core.color("#FFC000"),
      am4core.color("#FFFF00"),
      am4core.color("#92D050"),
      am4core.color("#00B050"),
    ];
    
    // this.chart.legend = new am4charts.Legend();
    // this.chart.legend.position = "right";
    let categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.dataFields.category = "code";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    let valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.line.strokeOpacity = 0.3;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.renderer.grid.template.disabled = true; 
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "#";
    this.createSeries("extreme", "Extreme")
    this.createSeries("very_high", "Very High")
    this.createSeries("high", "High");
    this.createSeries("medium", "Moderate");
    this.createSeries("low", "Low");
    this.chart.legend = new am4charts.Legend();
    this.chart.legend.fontSize = 10
    this.chart.legend.position = "top"
    this.chart.legend.marginRight = 10;
    this.chart.legend.maxHeight = 40;
    this.chart.legend.scrollable = true;
    this.chart.legend.itemContainers.template.padding(3,0,3,0);
    this.chart.legend.itemContainers.template.togglable = true;
    this.chart.legend.labels.template.wrap = true;
    
    let markerTemplate = this.chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    this._utilityService.detectChanges(this._cdr);
  }

  createSeries(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "code";
    series.stacked = true;
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
  }

  getDepartmentFindings(){
    this._InternalAuditDashboardService.getDepartmentFindings(false,null,true).subscribe(res=>{
      this.createDepartmentFindingsBarChart()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCharts() {
    setTimeout(() => {
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForStatusWiseCounts();
        this.createPieChartForCategoryFindings();
        this.createDepartmentFindingsBarChart();
      });
    }, 1000);
  }

  getAllCounts(){
    this.getCategoryFindings();
    this.getRiskRatingFindings();
    this.getStatusWiseAnalysisFindings();
    this.getDepartmentFindings();
  }

  retrunStatusWiseCounts(){
    let array = []
    if(IADashboardStore.StatusWiseAnalysisFindings?.length>0){
      IADashboardStore.StatusWiseAnalysisFindings.forEach(res=>{
        var obj1 = new Object()
        if(res.type=='open'){
          obj1['title'] = 'Open'
          obj1['count'] = res.findings.count
          array.push(obj1)
        }
        else if(res.type=='closed'){
          obj1['title'] = 'Closed'
          obj1['count'] = res.findings.count
          array.push(obj1)
        }
      })
    }
    return array
  }

  createPieChartForStatusWiseCounts() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("StatusWiseCountsDiv", am4charts.PieChart);
    chart.data = this.retrunStatusWiseCounts();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "StatusWiseCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.marginRight = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.labels.template.wrap = true;
    
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;
    chart.legend.valueLabels.template.disabled = true;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%"
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
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

  getRiskRatingFindings(){
    this._InternalAuditDashboardService.getRiskRatingFindings().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStatusWiseAnalysisFindings(){
    this._InternalAuditDashboardService.getStatusWiseAnalysisFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForStatusWiseCounts()
      }, 200);
      res.forEach(elem=>{
        if(elem.type == 'open'){
          this.open_count = elem.findings
        }
        else if(elem.type == 'closed'){
          this.close_count = elem.findings
        }
      })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCategoryFindings(){
    this._InternalAuditDashboardService.getCategoryFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForCategoryFindings()
      }, 200);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  CategoryFindingsCount(){
    let res_array = []
    IADashboardStore.CategoryFindings.forEach(res=>{
      if(res.findings.count!=0){
        res['count']=res.findings.count
        res_array.push(res)
      }
    })
    return res_array
  }

  createPieChartForCategoryFindings() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("CategoryFindingsDiv", am4charts.PieChart);
    chart.data = this.CategoryFindingsCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "CategoryFindings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
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

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Finding By Category";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;
    
    this._utilityService.detectChanges(this._cdr);
  }

  getDefaultGeneralImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImageUrl(type, token) {
    return this._humanCpitalService.getThumbnailPreview(type, token);
  }

  ngOnDestroy() {
    IADashboardStore.unsetCorrectiveActionDepartment();
    IADashboardStore.unsetCorrectiveActionResponsibleUser();
    IADashboardStore.unsetDepartmentFindings();
    IADepartmentRiskStore.unsetDepartmentFindingsPage();
  }

}
