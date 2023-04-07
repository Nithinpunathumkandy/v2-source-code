import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EaDashboardService } from 'src/app/core/services/external-audit/ea-dashboard/ea-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
declare var $: any;
@Component({
  selector: 'app-dashboard-external-audit',
  templateUrl: './dashboard-external-audit.component.html',
  styleUrls: ['./dashboard-external-audit.component.scss']
})
export class DashboardExternalAuditComponent implements OnInit, OnDestroy {

  EADashboardStore = EADashboardStore;
  RightSidebarLayoutStore=RightSidebarLayoutStore;
  close_count: string;
  open_count: string;
  filterSubscription: Subscription = null;
 

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _themestructureService: ThemeStructureSettingsService,
    private _helperService: HelperServiceService,
    private _eaDashboardService: EaDashboardService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService

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
    this.getEACount();
    this.getEACountByCategory();
    this.getEACountByStatus();
    this.getEACountByType();
    this.getFindingCACountByStatus();
    this.getEACountByMsType();
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.EADashboardStore.dashboardLoaded = false;
      this.getAll();
      setTimeout(() => {
        this.EADashboardStore.dashboardLoaded = true;
      }, 1000);
    });

    setTimeout(() => {
      EADashboardStore.dashboardLoaded = true;
    }, 500);
    RightSidebarLayoutStore.filterPageTag = 'ea_dashbord';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'external_audit_type_ids',
          'finding_status_ids',
          'finding_category_ids',
          'risk_rating_ids',
          'responsible_user_ids',

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
      // setTimeout(() => {
      //   RightSidebarLayoutStore.filterPageTag = 'ea_dashbord';
      //   this._rightSidebarFilterService.setFiltersForCurrentPage([
      //     'organization_ids',
      //     'division_ids',
      //     'department_ids',
      //     'section_ids',
      //     'sub_section_ids',

      //   ]);
      //   this._utilityService.detectChanges(this._cdr);
      // }, 1000);
    }, 1000);
  }

  getAll() {

    this.getEACount();
    this.getEACountByCategory();
    this.getEACountByStatus();
    this.getEACountByType();
    this.getFindingCACountByStatus();
    this.getEACountByMsType();
   

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

  getEACount() {
    this._eaDashboardService.getEACount().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByCategory() {
    this._eaDashboardService.getEACountByCategory().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByStatus(){
    this._eaDashboardService.getEACountByStatus().subscribe(res=>{
      res.forEach(elem=>{
        if(elem.type == 'open'){
          this.open_count = elem.finding_statuses
        }
        else if(elem.type == 'closed'){
          this.close_count = elem.finding_statuses
        }
      })
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByType() {
    this._eaDashboardService.getEACountByType().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForAuditType(res)
      }, 200);
      // EADashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindingCACountByStatus(){
    this._eaDashboardService.getFindingCACountByStatus().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForFindingCACountByStatus(res)
      }, 200);
      // EADashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEACountByMsType(){
    this._eaDashboardService.getEACountByMsType().subscribe(res=>{
      setTimeout(() => {
        this.createPieChartForEACountByMsType(res)
      }, 200);
      // EADashboardStore.dashboardLoaded = true;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createPieChartForEACountByMsType(msTypeData) {
    am4core.addLicense("CH199714744");
    let chart = am4core.create("msTypePieChart", am4charts.PieChart);
    if(msTypeData){
      chart.data = msTypeData
    }else{
      chart.data = EADashboardStore.EACountByMsType
    }
    
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "MsTypes"
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
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "";
    pieSeries.alignLabels = false;
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.clickonAuditByMsType,this)
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Audit By Ms Type";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 10;
    
    this._utilityService.detectChanges(this._cdr);
  }

  createPieChartForFindingCACountByStatus(statusData){
    am4core.addLicense("CH199714744");
    


    var chart = am4core.create("FindingCAStatusPieChart", am4charts.XYChart);
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = EADashboardStore.FindingCACountByStatus;
    }
    
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // chart.padding(40, 40, 40, 40);
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.dataFields.category = "finding_corrective_action_status_title";
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
    series.dataFields.categoryY = "finding_corrective_action_status_title";
    series.dataFields.valueX = "count";
    // series.tooltipText = "{valueX.value}"
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.events.on("hit", this.correctiveActionByStatus,this)
    
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

  createPieChartForAuditType(auditTypeData) {
    am4core.addLicense("CH199714744");
    
    let chart = am4core.create("AuditTypePieChart", am4charts.PieChart);
    if(auditTypeData){
      chart.data = auditTypeData
    }else{
      chart.data = EADashboardStore.EACountsByType
    }
    

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "TypeWiseCounts"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;

    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
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
    pieSeries.dataFields.category = "title";
    // pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%"
    // pieSeries.labels.template.radius = am4core.percent(-40);
    // pieSeries.labels.template.fill = am4core.color("white");
    // pieSeries.ticks.template.events.on("ready", hideSmall);
    // pieSeries.ticks.template.events.on("visibilitychanged", hideSmall);
    // pieSeries.labels.template.events.on("ready", hideSmall);
    // pieSeries.labels.template.events.on("visibilitychanged", hideSmall);
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.events.on("hit", this.clickOnAuditType,this)
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

  clickOnAuditType(event){
    let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&external_audit_type_ids=' + params);
    this._router.navigateByUrl('external-audit/external-audit');
  }

  correctiveActionByStatus(event){
    let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&finding_corrective_action_status_ids=' + params);
    this._router.navigateByUrl('external-audit/corrective-action');
  }
  clickonAuditByMsType(event)
  {
    let params = event.target.dataItem.dataContext.id
    EADashboardStore.setFilterParams('&ms_type_ids=' + params);
    this._router.navigateByUrl('external-audit/external-audit');
  }

  goToFindingcategory(id)
  {
    let params = id
    EADashboardStore.setFilterParams('&finding_category_ids=' + params)
    this._router.navigateByUrl('external-audit/audit-findings')
  }

  goToExternalAudit()
  {
    this._router.navigateByUrl('external-audit/external-audit') 
  }
  goToFindings()
  {

    this._router.navigateByUrl('external-audit/audit-findings') 
  }

  goToFindingDetails(){
    this._router.navigateByUrl('external-audit/finding-details') 
  }

  goToPendingCA(){
    this._router.navigateByUrl('external-audit/pending-ca') 
  }
  gotFindingStatus(id)
  {
    let params = id
    EADashboardStore.setFilterParams('&finding_status_ids=' + params)
    this._router.navigateByUrl('external-audit/audit-findings')
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    // this.EADashboardStore.dashboardLoaded = false;
    this.filterSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    //this.EADashboardStore.dashboardLoaded = false;
  }

}
