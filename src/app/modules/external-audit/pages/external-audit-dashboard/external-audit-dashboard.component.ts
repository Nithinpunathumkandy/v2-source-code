import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ExternalAuditDashboardService } from 'src/app/core/services/external-audit/dashboard/external-audit-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ExternalAuditDashboardStore } from 'src/app/stores/external-audit/dashboard/dasboard-store';
import { EADepartmentRiskStore } from 'src/app/stores/external-audit/dashboard/department-risk-rating-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-external-audit-dashboard',
  templateUrl: './external-audit-dashboard.component.html',
  styleUrls: ['./external-audit-dashboard.component.scss']
})
export class ExternalAuditDashboardComponent implements OnInit {

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  ExternalAuditDashboardStore = ExternalAuditDashboardStore;
  AuthStore = AuthStore
  close_count: { count: number; percentage: number; };
  open_count: { count: number; percentage: number; };
  showPieNoDataMap:boolean = false;
  showNoDataBarChart:boolean=false
  chart
  clientOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
  };
  noDataMsg = 'no_records_found';
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
    private _externalAuditDashboardService:ExternalAuditDashboardService,
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.getCharts()
      this.getAllCounts()
      this.showNoDataBarChart = false
      ExternalAuditDashboardStore.dashboardLoaded = true;
    }, 1000);
    this.getOverdueActionPlan(1);
  }

  ngAfterViewInit(){
    this.getCharts()
  }

  getCharts() {
    setTimeout(() => {
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRiskRatingFindings();
        this.createPieChartForDivisionFindings();
        this.createDepartmentFindingsBarChart();
        this.createPieChartForAuditType();
        this.createPieChartForMsTypes();
      });
    }, 1000);
  }

  getAllCounts(){
    this.getMsTypes();
    this.getStatusWiseAnalysisFindings();
    this.getTop10Findings()
    this.getDepartmentFindings()
    this.getOverdueActionPlan()
    this.getSecondTop10Findings()
    this.getRiskRatingFindings();
    this.getDivisionFindings();
    this.getCorrectiveActionOpenCloseCount();
    this.getAuditsByTypeCount();
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  routeToFindingDetails(){
    this._router.navigateByUrl('external-audit/finding-details') 
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getMsTypes(){
    this._externalAuditDashboardService.getMsTypes().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForMsTypes()
      }, 200);
      ExternalAuditDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getOverdueActionPlan(newPage: number = null){
    if (newPage) ExternalAuditDashboardStore.setCurrentPageOverdue(newPage);
    this._externalAuditDashboardService.getOverdueActionPlan().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCorrectiveActionOpenCloseCount(){
    this._externalAuditDashboardService.getCorrectiveActionOpenCloseCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStatusWiseAnalysisFindings(){
    this._externalAuditDashboardService.getStatusWiseAnalysisFindings().subscribe(res=>{
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

  getAuditsByTypeCount() {
    this._externalAuditDashboardService.getAuditByTypesCount().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForAuditType()
      }, 200);
      ExternalAuditDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTop10Findings(newPage: number = null){
    if (newPage) ExternalAuditDashboardStore.setCurrentPage(newPage);
    this._externalAuditDashboardService.getTop10Findings(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSecondTop10Findings(newPage: number = null){
    if (newPage) ExternalAuditDashboardStore.setCurrentSecondPage(newPage);
    this._externalAuditDashboardService.getSecondTop10Findings(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskRatingFindings(){
    this._externalAuditDashboardService.getRiskRatingFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForRiskRatingFindings()
      }, 200);
      ExternalAuditDashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  riskRatingFindingsCount(){
    let res_array = []
    ExternalAuditDashboardStore.RiskRatingFindings.forEach(res=>{
      if(res.findings.count!=0){
        res['count']=res.findings.count
        res_array.push(res)
      }
    })
    return res_array
  }

  createPieChartForMsTypes() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("MsTypesDiv", am4charts.PieChart);
    chart.data = this.MsTypesCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MsTypes"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
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
    label.text = "Audit By Ms Type";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;
    
    this._utilityService.detectChanges(this._cdr);
  }

  MsTypesCount(){
    let res_array = []
    ExternalAuditDashboardStore.auditMsTypes.forEach(res=>{
      if(res.audit.count!=0){
        res['count']=res.audit.count
        res_array.push(res)
      }
    })
    return res_array
  }

  // checkDataIsPresent(dataArray:any[],field){
  //   if(dataArray.length > 0){
  //     let dataNotPresent = 0;
  //     for(let i of dataArray){
  //       if(i[field.count] == 0) dataNotPresent++;
  //     }
  //     if(dataNotPresent == dataArray.length) return false;
  //     else return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  checkDataIsPresent(dataArray:any[],field){
    if(dataArray.length > 0){
      let dataNotPresent = 0;
      for(let i of dataArray){
        if(i[field]['count'] == 0) dataNotPresent++;
      }
      if(dataNotPresent == dataArray.length) return false;
      else return true;
    } else return true;
  }

  createPieChartForRiskRatingFindings() {
    am4core.addLicense("CH199714744");
    if(!this.checkDataIsPresent(ExternalAuditDashboardStore.RiskRatingFindings,'findings')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }

    let chart = am4core.create("RiskRatingFindingsDiv", am4charts.PieChart);
    chart.data = this.riskRatingFindingsCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatingFindings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    // chart.legend.labels.template.disabled = true;

    chart.legend.fontSize = 11
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(0,0,0,0);
    chart.legend.itemContainers.template.togglable = false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;

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
    label.text = "Finding Zone";
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;
    
    this._utilityService.detectChanges(this._cdr);
  }

  getDivisionFindings(){
    this._externalAuditDashboardService.getDivisionFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForDivisionFindings()
      }, 200);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  DivisionFindingsCount(){
    let res_array = []
    ExternalAuditDashboardStore.DivisionFindings.forEach(res=>{
      if(res.findings.count!=0){
        res['count']=res.findings.count
        res_array.push(res)
      }
    })
    return res_array
  }

  createPieChartForDivisionFindings() {
    am4core.addLicense("CH199714744");

    if(!this.checkDataIsPresent(ExternalAuditDashboardStore.DivisionFindings,'findings')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }

    let chart = am4core.create("DivisionFindingsDiv", am4charts.PieChart);
    chart.data = this.DivisionFindingsCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "DivisionFindings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 100;
    chart.legend.scrollable = true;
    // chart.legend.labels.template.disabled = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);

    // chart.legend.labels.template.disabled = true;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
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
    label.text = "Division Wise";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;
    
    this._utilityService.detectChanges(this._cdr);
  }

  getDepartmentFindings(){
    this._externalAuditDashboardService.getDepartmentFindings(false,null,true).subscribe(res=>{
      this.createDepartmentFindingsBarChart()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  assignChartData(){
    var chartData=[]
    var num=0
    ExternalAuditDashboardStore.DepartmentFindings.forEach(res=>{
      if(res.total!=0){
        chartData.push(res)
      }else{
        num++
        if(num==ExternalAuditDashboardStore.DepartmentFindings.length)this.showNoDataBarChart=true;
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
    let markerTemplate = this.chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    this._utilityService.detectChanges(this._cdr);
  }

  createPieChartForAuditType() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("StatusWiseCountsDiv", am4charts.PieChart);
    chart.data = this.retrunAuditTypeCounts();

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "StatusWiseCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    // chart.legend.valueLabels.template.disabled = true;
    // chart.legend.itemContainers.template.togglable = false;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0,0,0,0);
     
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    markerTemplate.fontSize = 10;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color_code";
    // pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    // pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%"
    // pieSeries.labels.template.radius = am4core.percent(-40);
    // pieSeries.labels.template.fill = am4core.color("white");
    // pieSeries.ticks.template.events.on("ready", hideSmall);
    // pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    // pieSeries.labels.template.events.on("ready", hideSmall);
    // pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
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

  retrunAuditTypeCounts(){
    let array = []
    if(ExternalAuditDashboardStore.AuditByTypeCount?.length>0){
      ExternalAuditDashboardStore.AuditByTypeCount.forEach(res=>{
        var obj1 = new Object()
          obj1['title'] = res.title;
          obj1['count'] = res.audit.count;
          array.push(obj1);
      })
    }
    return array
  }

  createSeries(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "code";
    series.stacked = true;
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
  }

  ngOnDestroy() {
    EADepartmentRiskStore.unsetDepartmentFindingsPage();
    this.ExternalAuditDashboardStore.dashboardLoaded = false;
  }

}
