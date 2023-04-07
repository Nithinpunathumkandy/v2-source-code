import { ITheme } from '@amcharts/amcharts4/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsDashboardService } from 'src/app/core/services/isms/dashboard/isms-dashboard.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit { 

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

  ISMSDashboardStore = ISMSDashboardStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  showNoDataMap:boolean=false;
  barChartId: number;
  riskChartInfo = "bar";
  noDataSource = "pie";
  showPieNoDataMap:boolean =false;

  activeRow=0;
  activeColumn=0;
  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _router: Router,
    private _ismsDashboardService: IsmsDashboardService
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof DashboardComponent
   */
  ngOnInit(): void {
    this.getAll();
    setTimeout(() => {
      ISMSDashboardStore.dashboardLoaded = true;
      }, 1000);
      
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById){
        this._themestructureService.getItems().subscribe(() => {
          this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
            this.getAll();
            this.getCharts();
          });
        })
      }
      else{
        this.getAll();
        this.getCharts();
      }
    }, 1000);
  }

  getAll() {
    this.getIsmsInherentRating();
    this.getIsmsRiskCount();
    this.getRiskCountByDepratments();
    this.getRiskCountByOwners();
    this.getRiskAssetCriticality();
  }

  getIsmsInherentRating(){
    this._ismsDashboardService.getIsmsInherentRating().subscribe(res=>{
      setTimeout(() => {
        this.createPieChart();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
    })
  }

  getIsmsRisk(){
    this._ismsDashboardService.getRisk(false, null).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    })
  }

  getIsmsRiskCount(){
    this._ismsDashboardService.getIsmsRiskCount().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskCountByDepratments(){
    this._ismsDashboardService.getIsmsRiskDepartments().subscribe(res=>{
      this.barChartId = 1;
      this.createBarChartForRisk(1);
    })
  }

  getRiskCountByOwners(){
    this._ismsDashboardService.getIsmsRiskOwners().subscribe(res=>{
      this.barChartId = 2;
      this.createBarChartForRisk(2);
    })
  }

  getRiskByCategory(){
    this._ismsDashboardService.getIsmsRiskCategories().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskBySection(){
    this._ismsDashboardService.getIsmsRiskSections().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskByStatus(){
    this._ismsDashboardService.getIsmsRiskStatuses().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskBySources(){
    this._ismsDashboardService.getIsmsRiskSource().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskAssetCriticality(){
    this._ismsDashboardService.getIsmsRiskAssetCriticality().subscribe(res=>{
      setTimeout(() => {
        this.createCriticalityPieChart();
    }, 1000);
      this._utilityService.detectChanges(this._cdr);
    })
  }



  getRiskHeatMap(){
    this._ismsDashboardService.getIsmsRiskHeatMap().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getCharts() {
    setTimeout(() => {
    //   // Chart code goes in here
    let theme = 'am4themes_animated';
      if(ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      this.browserOnly(() => {
        am4core.useTheme(iTheme);

      });
    }, 1000);
   
  }
  
  checkDataIsPresent(dataArray:any[],field){
    if(dataArray.length > 0){
      let dataNotPresent = 0;
      for(let i of dataArray){
        if(i[field] == 0) dataNotPresent++;
      }
      if(dataNotPresent == dataArray.length) return false;
      else return true;
    }
    else{
      return false;
    }
  }

  createPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ISMSDashboardStore.ismsInherentRating,'count')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = ISMSDashboardStore.ismsInherentRating
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "risk_rating"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('risk_rating');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 15;
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "isms_risk_ratings";
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

  createCriticalityPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(ISMSDashboardStore.ismsRiskAssetCriticality,'count')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }
    let chart = am4core.create("criticalityChartdiv", am4charts.PieChart);
    chart.data = ISMSDashboardStore.ismsRiskAssetCriticality
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "asset_criticality_rating"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('asset_criticality_rating');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 15;
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "asset_criticality_rating";
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

  createBarChartForRisk(filter:number){
    var category = ""
    var color = ""
    am4core.addLicense("CH199714744");
    let chart = am4core.create("barChart", am4charts.XYChart);
    
    if(filter == 1){
      chart.data = ISMSDashboardStore.ismsRiskDepartments
      if(ISMSDashboardStore.ismsRiskDepartments.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "code"
    }
    if(filter == 2){
      chart.data = ISMSDashboardStore.ismsRiskOwners
      if(ISMSDashboardStore.ismsRiskOwners.length==0){
        this.showNoDataMap = true;
      }else{
        this.showNoDataMap = false;
      }
      category = "first_name"
    }

    
    chart.numberFormatter.numberFormat = "#.";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "ISMS"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0; //to get y-axis proper integer value or avoids decimal value
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = category;
    series.name = "Visits";
    if(filter==1){
      series.columns.template.propertyFields.stroke="color"
      series.columns.template.propertyFields.fill = "color"
    }else{
      series.columns.template.stroke = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      series.columns.template.fill = filter==2? am4core.color("#A8D18D"):filter==3? am4core.color("#F9C304"):filter==4? am4core.color("#F07D2B"):filter==5? am4core.color("#5A9AD7"):am4core.color("#6FAC46");
      }
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByDepratmentClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.riskByOwnerClick,this)
     }

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  riskByDepratmentClick(ev) {
    ISMSDashboardStore.setDashboardParam(`is_registered=false&asset_rating=true&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/isms/corporate-isms-risks');
  }

  riskByOwnerClick(ev) {
    ISMSDashboardStore.setDashboardParam(`is_registered=false&risk_owner_id=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/isms/corporate-isms-risks');
  }

}
