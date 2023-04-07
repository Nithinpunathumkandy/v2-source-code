import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { AssetDashboardService } from 'src/app/core/services/asset-management/asset-dashboard/asset-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetDashboardStore } from 'src/app/stores/asset-management/asset-dashboard/asset-dashboard-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Router } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.scss']
})
export class AssetDashboardComponent implements OnInit {
  @ViewChild('assetTypePieChartDiv') assetTypePieChartDiv: ElementRef<HTMLElement>;

  AssetDashboardStore = AssetDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;

  showPieNoDataMap:boolean =false;
  showAssetTypePieNoData: boolean = false;
  showAssetCriticalityRatingPieNoData: boolean = false;
  showAssetMaintenanceStatusPieNoData: boolean = false;
  showNoDataBarChart:boolean=false
  showDepartmentNoDataBarChart:boolean = false;
  showPurchaseYearNoDataBarChart:boolean = false;
  showCustodianNoDataBarChart:boolean = false;
  showCategoryNoDataBarChart:boolean = false;
  assetStatusPieChart = "pie";
  assetTypePieChart = "pie";
  assetCriticalityRatingPieChart = "pie";
  assetMaintenanceStatusPieChart = "pie";
  filterSubscription: Subscription = null;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId,private zone: NgZone,
    private _assetDashboardService: AssetDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _themestructureService: ThemeStructureSettingsService,
    private _router: Router

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
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AssetDashboardStore.dashboardLoaded = false;
      this.getAll();
      this.getCharts();
      setTimeout(() => {
        this.AssetDashboardStore.dashboardLoaded = true;

      }, 1000);
      this._utilityService.detectChanges(this._cdr)
    })
    this.getAll();
    this.getCharts();
    setTimeout(() => {
      this.AssetDashboardStore.dashboardLoaded = true;
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
  }

  ngDoCheck() {}

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
      setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'asset_dashboard';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',
          'asset_category_ids',
          'asset_type_ids',
          'asset_sub_category_ids',
          'asset_investment_type_ids',
          'physical_condition_ranking_ids',
          'custodian_ids',
          'supplier_ids'
        ]);
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    }, 1000);
  }


  getAll(){
    this.getAssetCriticalityRating();
    this.getAssetCount();
    this.getAssetPieTypes();
    this.getAssetPieStatus();
    this.getAssetMaintanancePieStatus();
    this.getAssetBarDepartment();
    this.getAssetBarPurchaseYear();
    this.getAssetBarCategory();
    this.getAssetBarCustodian();
    this.getMaintenanceBarAsset();
    this.getMaintenanceBarCategory();
    this.getMaintenanceBarType();
    this.getMaintenanceBarFrequency();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
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

  getAssetCount(){
    this._assetDashboardService.getAssetCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAssetPieStatus(){
    this._assetDashboardService.getAssetPieStatus().subscribe(res=>{
      setTimeout(() => {
       
          this.createPieChart();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetPieTypes(){
    this._assetDashboardService.getAssetPieTypes().subscribe(res=>{
      setTimeout(() => {
       
          this.createPieChartAssetTypes();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetCriticalityRating(){
    this._assetDashboardService.getAssetCriticalityRating().subscribe(res=>{
      setTimeout(() => {
       
          this.createPieChartCriticalityRating();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetMaintanancePieStatus(){
    this._assetDashboardService.getAssetMaintanancePieStatus().subscribe(res=>{
      setTimeout(() => {
       
          this.createPieChartForMaintananceStatus();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetBarCategory(){
    this._assetDashboardService.getAssetBarCategory().subscribe(res=>{
      // setTimeout(() => {
       
          // this.createBarChartForAsset(1);
          this._utilityService.detectChanges(this._cdr);
      // }, 1000);
      // this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetBarCustodian(){
    this._assetDashboardService.getAssetBarCustodian().subscribe(res=>{
      // setTimeout(() => {
          // this.createBarChartForAsset(2);
          // this.createBarChartForAsset(4);
          this._utilityService.detectChanges(this._cdr);
      // }, 1000);
      // this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetBarPurchaseYear(){
    this._assetDashboardService.getAssetBarPurchaseYear().subscribe(res=>{
      // setTimeout(() => {
       

        this._utilityService.detectChanges(this._cdr);
      // }, 1000);
      // this._utilityService.detectChanges(this._cdr);

    })
  }

  getAssetBarDepartment(){
    this._assetDashboardService.getAssetBarDepartment().subscribe(res=>{
      // setTimeout(() => {
        // if(AssetDashboardStore.dashboardByDepartmentLoaded){
        //   this.createBarChartForAsset(4);
        // }
        // else{
        //   // AssetDashboardStore.dashboardByDepartmentLoaded = true;
        //   AssetDashboardStore.setAssetBarDepartment(res);
          
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            this.createBarChartForAsset(4);
          }, 500);
          
        // }
        
        this._utilityService.detectChanges(this._cdr);
      // },3500);
      // this._utilityService.detectChanges(this._cdr);

    })
  }

  getMaintenanceBarAsset(){
    this._assetDashboardService.getMaintenanceBarAsset().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChartForMaintenance(1);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getMaintenanceBarCategory(){
    this._assetDashboardService.getMaintenanceBarCategory().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChartForMaintenance(2);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getMaintenanceBarType(){
    this._assetDashboardService.getMaintenanceBarType().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChartForMaintenance(3);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getMaintenanceBarFrequency(){
    this._assetDashboardService.getMaintenanceBarFrequency().subscribe(res=>{
      setTimeout(() => {
       
        this.createBarChartForMaintenance(4);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }


  createPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(AssetDashboardStore.AssetPieStatus,'count')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }
    let chart = am4core.create("assetStatusChart", am4charts.PieChart);
    chart.data = AssetDashboardStore.AssetPieStatus
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('Asset');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;
    chart.legend = new am4charts.Legend();

    chart.legend.position = 'bottom'
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);


    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
   
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    pieSeries.dataFields.value = "count";
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.category = "asset_status";
    pieSeries.labels.template.text = "";
    pieSeries.labels.template.fontSize =10;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    pieSeries.slices.template.events.on("hit", this.statusChartClick,this)
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

  statusChartClick(ev){
    AssetDashboardStore.setDashboardParam(`&asset_status_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/asset-management/assets');
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

  createPieChartAssetTypes() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(AssetDashboardStore.AssetPieTypes,'count')){
      this.showAssetTypePieNoData=true;
      return
    }else{
      this.showAssetTypePieNoData=false;
    }
    let chart = am4core.create("chartAssetType", am4charts.PieChart);
    chart.data = AssetDashboardStore.AssetPieTypes

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    // chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.valueLabels.template.disabled = false;
    chart.legend.itemContainers.template.togglable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);


    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "asset_type";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    pieSeries.slices.template.events.on("hit", this.typeChartClick,this)
  
    this._utilityService.detectChanges(this._cdr);
    
  }

  typeChartClick(ev){
    AssetDashboardStore.setDashboardParam(`&asset_type_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/asset-management/assets');
  }

  createPieChartCriticalityRating() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(AssetDashboardStore.AssetCriticalityRating,'count')){
      this.showAssetCriticalityRatingPieNoData=true;
      return
    }else{
      this.showAssetCriticalityRatingPieNoData=false;
    }
    let chart = am4core.create("chartAssetCriticalityRating", am4charts.PieChart);
    chart.data = AssetDashboardStore.AssetCriticalityRating

    chart.legend = new am4charts.Legend();

    chart.legend.position = 'bottom'
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);

    // chart.legend.labels.template.disabled = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "asset_rating_label";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "asset_rating";
    pieSeries.labels.template.text = "";
    pieSeries.labels.template.fontSize =10;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    pieSeries.slices.template.events.on("hit", this.criticalityChartClick,this)
   
    this._utilityService.detectChanges(this._cdr);
    
  }

  criticalityChartClick(ev){
    // this.AssetDashboardStore.assetDashboardParam = event.target.dataItem.dataContext.id;
    // AssetDashboardStore.setDashboardParam('asset_rating_ids='+this.AssetDashboardStore.assetDashboardParam)
    AssetDashboardStore.setDashboardParam(`&asset_rating_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/asset-management/assets');
  }

  createPieChartForMaintananceStatus() {
    
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(AssetDashboardStore.AssetMaintanancePieStatus,'count')){
      this.showAssetMaintenanceStatusPieNoData=true;
      return
    }else{
      this.showAssetMaintenanceStatusPieNoData=false;
    }
    let chart = am4core.create("chartAssetMaintenanceStatus", am4charts.PieChart);

    chart.data = AssetDashboardStore.AssetMaintanancePieStatus
    
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('Maintenance Status');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom'
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.fontSize = 10
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 50;
    chart.legend.valueLabels.template.disabled = true;
    chart.legend.itemContainers.template.togglable = false;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(0, 0, 0, 0);



    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 11;
    markerTemplate.height = 11;
    markerTemplate.fontSize = 10;
   
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "asset_maintenance_status";
    pieSeries.labels.template.text = "";
    pieSeries.labels.template.fontSize =10;
    pieSeries.ticks.template.events.on("ready", hideSmall);
    pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    pieSeries.labels.template.events.on("ready", hideSmall);
    pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
    pieSeries.slices.template.events.on("hit", this.maintenanceStatusChartClick,this)
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


  maintenanceStatusChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_maintenance_status_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/asset-maintenances');
  }

  createBarChartForAsset(filter:number = 1){
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if(filter == 1){
     chart = am4core.create("barChartCategory", am4charts.XYChart);
     chart.responsive.enabled = true;
      chart.data = AssetDashboardStore.AssetBarCategory
      if(AssetDashboardStore.dashboardByCategoryLoaded && AssetDashboardStore.AssetBarCategory.length==0){
        this.showCategoryNoDataBarChart = true;
      }else{
        this.showCategoryNoDataBarChart = false;
      }
      y = "count"
      x = 'asset_category'
    }
    if(filter == 2){
     chart = am4core.create("barChartCustodian", am4charts.XYChart);
      chart.data = AssetDashboardStore.AssetBarCustodian
      if(AssetDashboardStore.dashboardByCustodianLoaded && AssetDashboardStore.AssetBarCustodian.length==0){
        this.showCustodianNoDataBarChart = true;
      }else{
        this.showCustodianNoDataBarChart = false;
      }
      y = "count"
      x = 'asset_custodian'
    }
    if(filter == 3){
     chart = am4core.create("barChartPurchaseYear", am4charts.XYChart);

      chart.data = AssetDashboardStore.AssetBarPurchaseYear
      if(AssetDashboardStore.dashboardByPurchaseYearLoaded && AssetDashboardStore.AssetBarPurchaseYear.length==0){
        this.showPurchaseYearNoDataBarChart = true;
      }else{
        this.showPurchaseYearNoDataBarChart = false;
      }
      y = "total_count"
      x = 'year'
    }
    if(filter == 4){
      chart = am4core.create("barChartDepartment", am4charts.XYChart);
      //  if(res){
        chart.data = AssetDashboardStore.AssetBarDepartment
      //  }
       if(AssetDashboardStore.dashboardByDepartmentLoaded && AssetDashboardStore.AssetBarDepartment.length==0){
        this.showDepartmentNoDataBarChart = true;
      }else{

        this.showDepartmentNoDataBarChart = false;
       
      }
       y = "count"
       x = 'department_code'
     }
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10
    // categoryAxis.renderer.minLabelPosition = 0.05;
    // categoryAxis.renderer.maxLabelPosition = 0.95;
    // categoryAxis.renderer.labels.template.rotation = 270;
    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Asset"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize = 10
    valueAxis.maxPrecision = 0
    // valueAxis.renderer.labels.template.adapter.add("text", function(text) {
    //   if (+text < 1 || +text > 7) {
    //     return "";
    //   }
    //   return text;
    // });

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.categoryChartClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.custodianChartClick,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.purchaseYearChartClick,this)
     }
     if(filter == 4){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.departmentChartClick,this)
      
      }
    
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  categoryChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_category_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/assets');
  }

  custodianChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&custodian_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/assets');
  }

  purchaseYearChartClick(event) {
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.year;
    AssetDashboardStore.setDashboardParam('&year='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/assets');
  }

  departmentChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&department_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/assets');
  }


  createBarChartForMaintenance(filter:number = 1){
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if(filter == 1){
     chart = am4core.create("barChartMaintenanceAsset", am4charts.XYChart);
      chart.data = AssetDashboardStore.MaintenanceBarAsset
      if(AssetDashboardStore.maintenanceBarAssetLoaded && AssetDashboardStore.MaintenanceBarAsset.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'asset'
    }
    if(filter == 2){
     chart = am4core.create("barChartMaintenanceCategory", am4charts.XYChart);
      chart.data = AssetDashboardStore.MaintenanceBarCategory
      if(AssetDashboardStore.maintenanceBarCategoryLoaded && AssetDashboardStore.MaintenanceBarCategory.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'asset_category'
    }
    if(filter == 3){
     chart = am4core.create("barChartMaintenanceType", am4charts.XYChart);

      chart.data = AssetDashboardStore.MaintenanceBarType
      if(AssetDashboardStore.maintenanceBarTypeLoaded && AssetDashboardStore.MaintenanceBarType.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'asset_maintenance_type_title'
    }
    if(filter == 4){
      chart = am4core.create("barChartMaintenanceFrequency", am4charts.XYChart);
       chart.data = AssetDashboardStore.MaintenanceBarFrequency
       if(AssetDashboardStore.maintenanceBarFrequencyLoaded && AssetDashboardStore.MaintenanceBarFrequency.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
       y = "count"
       x = 'asset_maintenance_schedule_frequency_title'
     }
    chart.numberFormatter.numberFormat = "#";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;

    let label = categoryAxis.renderer.labels.template;
    // label.wrap = true;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
      let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      axis.renderer.labels.template.maxWidth = cellWidth;
    });

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Asset"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.fontSize = 10
    valueAxis.maxPrecision = 0


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.maintenanceAssetChartClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.maintenanceCategoryChartClick,this)
     }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.maintenanceTypeChartClick,this)
     }
     if(filter == 4){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.maintenanceFrequencyChartClick,this)
      
      }
    
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  maintenanceAssetChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/asset-maintenances');
  }

  maintenanceCategoryChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_maintenance_category_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/asset-maintenances');
  }

  maintenanceTypeChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_maintenance_type_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/asset-maintenances');
  }

  maintenanceFrequencyChartClick(event){
    this.AssetDashboardStore.assetDashboardParam = event.target.column.dataItem.dataContext.id;
    AssetDashboardStore.setDashboardParam('&asset_maintenance_schedule_frequency_ids='+this.AssetDashboardStore.assetDashboardParam)
      this._router.navigateByUrl('/asset-management/asset-maintenances');
  }

  redirectToPage(status, count:number=0){
    if(count!=0){
     
        if(status=='acquired'){
          AssetDashboardStore.setDashboardParam('asset_status_ids=1')
          this._router.navigateByUrl('/asset-management/assets');
        }
        if(status=='lost'){
          AssetDashboardStore.setDashboardParam('asset_status_ids=2')
          this._router.navigateByUrl('/asset-management/assets');
        }
        if(status=='total'){
          AssetDashboardStore.setDashboardParam('')
          this._router.navigateByUrl('/asset-management/assets');
        }
        if(status=='maintenance'){
          AssetDashboardStore.setDashboardParam('')
          this._router.navigateByUrl('/asset-management/asset-maintenances');
        }
      }
  }


  ngOnDestroy() {

    this.AssetDashboardStore.dashboardLoaded = false;
    AssetDashboardStore.dashboardByDepartmentLoaded = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    // AssetDashboardStore.unsetDashboardParam();
  }

}
