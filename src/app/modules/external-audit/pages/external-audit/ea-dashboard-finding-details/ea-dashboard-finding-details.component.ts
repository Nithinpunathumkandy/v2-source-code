import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { EaDashboardService } from 'src/app/core/services/external-audit/ea-dashboard/ea-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ea-dashboard-finding-details',
  templateUrl: './ea-dashboard-finding-details.component.html',
  styleUrls: ['./ea-dashboard-finding-details.component.scss']
})
export class EaDashboardFindingDetailsComponent implements OnInit,OnDestroy {

  activeRow=0;
  activeColumn=0;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  EADashboardStore = EADashboardStore;
  filterSubscription: Subscription = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _themestructureService: ThemeStructureSettingsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eaDashboardService: EaDashboardService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService

  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "/external-audit/dashboard"}
    ]);

    
    // setTimeout(() => {
    //   this.getAll();
    //   this.getCharts();
    //   EADashboardStore.dashboardLoaded = true;
    // }, 250);
    this.getEACountByCategory();
    this.getEACountByStatus();
    this.getEACountByRiskRating();
    this.getEACountByDepartmentAndRiskRating();

    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EADashboardStore.dashboardLoaded = false;
      this.getAll();
      setTimeout(() => {
        this.EADashboardStore.dashboardLoaded = true;
      }, 1000);

    });


    RightSidebarLayoutStore.filterPageTag = 'ea_dashbord';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'finding_category_ids',
      'risk_rating_ids',
      'finding_status_ids',
      
		]);
    this._utilityService.detectChanges(this._cdr);
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      if (!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById) {
        this._themestructureService.getItems().subscribe(() => {
          this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
            this.getAll();
            this.getCharts();
          });
        })
      }
      else {
        this.getAll();
        this.getCharts();
      }
     
    }, 1000);
  }

  getAll() {

    this.getEACountByCategory();
    this.getEACountByStatus();
    this.getEACountByRiskRating();
    this.getEACountByDepartmentAndRiskRating();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  getCharts() {
    setTimeout(() => {
      //   // Chart code goes in here
      let theme = 'am4themes_animated';
      if (ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
      let iTheme: ITheme = this._helperService.getThemes(theme);
      this.browserOnly(() => {
        am4core.useTheme(iTheme);

      });
    }, 1000);

  }

  getEACountByCategory() {
    this._eaDashboardService.getEACountByCategory().subscribe(res => {
      this.createPieChartForCountByCategory();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByStatus(){
    this._eaDashboardService.getEACountByStatus().subscribe(res=>{
      this.createPieChartForFindingStatus(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByRiskRating(){
    this._eaDashboardService.getEACountByRiskRating().subscribe(res=>{
      this.createPieChartForCountByRiskRating();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  redirectToHeatMap(risk_score,num?,column?,count=0){
    if(count!=0){
      EADashboardStore.setRiskScore(risk_score)
      EADashboardStore.setActiveRow(num)
      EADashboardStore.setActiveColumn(column)
      this._router.navigateByUrl('/isms/isms-risk-heat-map');
    }
  }

  getEACountByDepartmentAndRiskRating(){
    this._eaDashboardService.getEACountByDepartmentAndRiskRating().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createPieChartForCountByRiskRating(){
    am4core.addLicense("CH199714744");
    


    var chart = am4core.create("riskRatingDiv", am4charts.XYChart);
    chart.data = EADashboardStore.EACountByRiskRating;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // chart.padding(40, 40, 40, 40);
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.dataFields.category = "title";
      categoryAxis.renderer.inversed = true;
      categoryAxis.fontSize = 10
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true; 
    valueAxis.renderer.line.strokeOpacity = 0.3;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0
    valueAxis.fontSize = 10
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "title";
    series.dataFields.valueX = "count";
    // series.tooltipText = "{valueX.value}"
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.events.on("hit", this.gotFindingByRiskRating,this)
    
    // var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    // labelBullet.label.horizontalCenter = "left";
    // labelBullet.label.dx = 10;
    // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    // labelBullet.locationX = 1;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    categoryAxis.sortBySeries = series;
    this._utilityService.detectChanges(this._cdr);
  }

  createPieChartForFindingStatus(data) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("FindingStatus", am4charts.PieChart);
    if(data)
    {
      chart.data = data
    }
    else
    {
      chart.data = EADashboardStore.EACountsByStatus
    }
    console.log(chart.data)
     
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "FindingStatusWiseCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    markerTemplate.fontSize = 10;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    // pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "finding_statuses";
    
    // pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%"
    // pieSeries.labels.template.radius = am4core.percent(-40);
    // pieSeries.labels.template.fill = am4core.color("white");
    // pieSeries.ticks.template.events.on("ready", hideSmall);
    // pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    // pieSeries.labels.template.events.on("ready", hideSmall);
    // pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.gotFindingStatus,this)
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

  createPieChartForCountByCategory(){
    am4core.addLicense("CH199714744");
    let chart = am4core.create("EaCategory", am4charts.PieChart);
    chart.data = EADashboardStore.EACountsByCategory
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MsTypes"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    chart.legend.marginTop = 15;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    markerTemplate.fontSize = 10;
   

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.gotFindingonByCategory,this)
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Finding By Category";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;
    
    this._utilityService.detectChanges(this._cdr);
  }

  goToDashboard(){
    this._router.navigateByUrl('external-audit/dashboard') 
  }

  goToPendingCA(){
    this._router.navigateByUrl('external-audit/pending-ca') 
  }

  gotFindingStatus(event)
  {
   
   let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&finding_status_ids=' + params)
    this._router.navigateByUrl('external-audit/audit-findings')
  }

  gotFindingByRiskRating(event)
  {
    let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&risk_rating_ids=' + params)
    this._router.navigateByUrl('external-audit/audit-findings')
  }

  gotFindingonByCategory(event)
  {
    let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&finding_category_ids=' + params)
    this._router.navigateByUrl('external-audit/audit-findings')
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    // EADashboardStore.dashboardLoaded = false;
    this.filterSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    SubMenuItemStore.makeEmpty();
  }

}
