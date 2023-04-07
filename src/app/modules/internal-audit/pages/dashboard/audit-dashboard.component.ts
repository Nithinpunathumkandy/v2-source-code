import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { InternalAuditDashboardService } from 'src/app/core/services/internal-audit/dashboard/internal-audit-dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IADashboardStore } from 'src/app/stores/internal-audit/dashboard/dasboard-store';
import { IADepartmentRiskStore } from 'src/app/stores/internal-audit/dashboard/department-risk-rating-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

@Component({
  selector: 'app-audit-dashboard',
  templateUrl: './audit-dashboard.component.html',
  styleUrls: ['./audit-dashboard.component.scss']
})
export class AuditDashboardComponent implements OnInit {

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  IADashboardStore = IADashboardStore;
  IADepartmentRiskStore = IADepartmentRiskStore;
  AuthStore = AuthStore
  close_count: { count: number; percentage: number; };
  open_count: { count: number; percentage: number; };
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
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.getCharts()
      this.getAllCounts()
      this.showNoDataBarChart = false
      IADashboardStore.dashboardLoaded = true
    }, 100);
  }

  ngAfterViewInit(){
    this.getCharts()
  }

  getCharts() {
    setTimeout(() => {
      this.browserOnly(() => {
        am4core.useTheme(am4themes_animated);
        this.createPieChartForRiskRatingFindings()
        this.createPieChartForDivisionFindings()
        this.createDepartmentFindingsBarChart()
      });
    }, 1000);
  }

  getAllCounts(){
    this.getStatusWiseAnalysisFindings();
    this.getTop10Findings()
    this.getDepartmentFindings()
    this.getOverdueActionPlan()
    this.getSecondTop10Findings()
    this.getRiskRatingFindings();
    this.getDivisionFindings()
    this.getCorrectiveActionOpenCloseCount()
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  routeToFindingDetails(){
    this._router.navigateByUrl('internal-audit/finding-details') 
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getOverdueActionPlan(newPage: number = null){
    if (newPage) IADashboardStore.setCurrentPageOverdue(newPage);
    this._InternalAuditDashboardService.getOverdueActionPlan().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getCorrectiveActionOpenCloseCount(){
    this._InternalAuditDashboardService.getCorrectiveActionOpenCloseCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStatusWiseAnalysisFindings(){
    this._InternalAuditDashboardService.getStatusWiseAnalysisFindings().subscribe(res=>{
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

  getTop10Findings(newPage: number = null){
    if (newPage) IADashboardStore.setCurrentPage(newPage);
    this._InternalAuditDashboardService.getTop10Findings(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSecondTop10Findings(newPage: number = null){
    if (newPage) IADashboardStore.setCurrentSecondPage(newPage);
    this._InternalAuditDashboardService.getSecondTop10Findings(false,null).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskRatingFindings(){
    this._InternalAuditDashboardService.getRiskRatingFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForRiskRatingFindings()
      }, 200);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  riskRatingFindingsCount(){
    let res_array = []
    IADashboardStore.RiskRatingFindings.forEach(res=>{
      if(res.findings.count!=0){
        res['count']=res.findings.count
        res_array.push(res)
      }
    })
    return res_array
  }

  createPieChartForRiskRatingFindings() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("RiskRatingFindingsDiv", am4charts.PieChart);
    chart.data = this.riskRatingFindingsCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "RiskRatingFindings"
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
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.slices.template.events.on("hit", this.findingByRatingClick, this);
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Finding Zone";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;
    
    this._utilityService.detectChanges(this._cdr);
  }

  findingByRatingClick(ev){
    IADashboardStore.setDashboardParam(`&risk_rating_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/internal-audit/findings');
  }

  getDivisionFindings(){
    this._InternalAuditDashboardService.getDivisionFindings().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForDivisionFindings()
      }, 200);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  DivisionFindingsCount(){
    let res_array = []
    IADashboardStore.DivisionFindings.forEach(res=>{
      if(res.findings.count!=0){
        res['count']=res.findings.count
        res_array.push(res)
      }
    })
    return res_array
  }

  createPieChartForDivisionFindings() {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("DivisionFindingsDiv", am4charts.PieChart);
    chart.data = this.DivisionFindingsCount();
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "DivisionFindings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
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
    label.text = "Finding Zone";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;
    
    this._utilityService.detectChanges(this._cdr);
  }

  getDepartmentFindings(){
    this._InternalAuditDashboardService.getDepartmentFindings(false,null,true).subscribe(res=>{
      this.createDepartmentFindingsBarChart()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  assignChartData(){
    var chartData=[]
    var num=0
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
    this.chart.rtl = AuthStore?.user?.language?.is_rtl? true : false;
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
    this.chart.legend.itemContainers.template.padding(3,0,3,0);
    this.chart.legend.fontSize = 10
    this.chart.legend.position = "top"
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
    // series.columns.template.events.on("hit",this.findingDepartmentClick,this)
  }

  // findingDepartmentClick(ev){
  //   IADashboardStore.setDashboardParam(`&finding_department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
  //   this._router.navigateByUrl('/internal-audit/findings');
  // }

  ngOnDestroy() {
    IADepartmentRiskStore.unsetDepartmentFindingsPage();
  }

}
