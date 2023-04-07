import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { BpmDashboardService } from 'src/app/core/services/bpm/bpm-dashboard/bpm-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BPMDashboardStore } from 'src/app/stores/bpm/bpm-dashboard/bpm-dashboard-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Subscription } from 'rxjs';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-bpm-dashboard',
  templateUrl: './bpm-dashboard.component.html',
  styleUrls: ['./bpm-dashboard.component.scss']
})
export class BpmDashboardComponent implements OnInit {
  @ViewChild('bpmchart') bpmchart: ElementRef;
  @ViewChild('barChartDepartment') barChartDepartment: ElementRef;
  @ViewChild('barChartControls') barChartControls: ElementRef;
  @ViewChild('barChartOwner') barChartOwner: ElementRef;

  bpmPieChart = "pie";
  AuthStore = AuthStore;
  showPieNoDataMap: boolean = false;
  emptyIntro="no_data_found";
  OrganizationModulesStore = OrganizationModulesStore;
  BPMDashboardStore = BPMDashboardStore;
  filterSubscription: Subscription = null;
  showNoDataBarChart:boolean=false

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
    private _bpmDashboardService: BpmDashboardService,
    private _themestructureService: ThemeStructureSettingsService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService: EventEmitterService,

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
      this.BPMDashboardStore.dashboardLoaded = false;
      // this.getAll();
      this.getBPMCount();
      this.getPieChart();
      this.getBpm();
      this.getSecondBpm();
      this.getBpmBarOwner();
      this.getBpmBarDepartment();
      this.getBpmBarControls();
      setTimeout(() => {
        this.BPMDashboardStore.dashboardLoaded = true;
      }, 1000);
    });

    setTimeout(() => {
      BPMDashboardStore.dashboardLoaded = true;
    }, 500);
    
    this.getBPMCount();
    this.getPieChart();
    this.getBpm();
    this.getSecondBpm();
    this.getBpmBarOwner();
    this.getBpmBarDepartment();
    this.getBpmBarControls();
    this._utilityService.detectChanges(this._cdr);


  }

  routeToQlikDashboard(){
    this._router.navigateByUrl('bpm/qlik-dashboard')
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
      setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'bpm_dashbord';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',

        ]);
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    }, 1000);
  }

  getAll() {

    this.getBPMCount();
    this.getPieChart();
    this.getBpm();
    this.getSecondBpm();
    this.getBpmBarOwner();
    this.getBpmBarDepartment();
    this.getBpmBarControls();

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

  getBpmBarOwner() {
    this._bpmDashboardService.getBpmBarOwner().subscribe(res => {
      setTimeout(() => {

        this.createBarChart(3);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getBpmBarDepartment() {
    this._bpmDashboardService.getBpmBarDepartment().subscribe(res => {
      setTimeout(() => {

        this.createBarChart(1);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getBpmBarControls() {
    this._bpmDashboardService.getBpmBarControls().subscribe(res => {
      setTimeout(() => {

        this.createBarChart(2);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getBpm(newPage: number = null) {
    if (newPage) BPMDashboardStore.setCurrentPage(newPage);
    this._bpmDashboardService.getBpm(false, null).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSecondBpm(newPage: number = null) {
    if (newPage) BPMDashboardStore.setCurrentSecondPage(newPage);
    this._bpmDashboardService.getSecondBpm(false, null).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBPMCount() {
    this._bpmDashboardService.getBPMCount().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPieChart() {
    this._bpmDashboardService.getPieChart().subscribe(res => {
      setTimeout(() => {

        this.createPieChart(res);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }



  gotoProcessDetails(id) {
    this._router.navigateByUrl('/bpm/process/' + id);
  }



  redirectToListPage(status, count: number = 0) {
    if (count != 0) {
      if (status == 'process') {
        this._router.navigateByUrl('/bpm/process');

      }
      if (status == 'process-groups') {
        this._router.navigateByUrl('/masters/process-groups');

      }
      if (status == 'controls') {
        BPMDashboardStore.setBpmDashboardParam(true)
        this._router.navigateByUrl('/bpm/controls');

      }
    }

  }


  createPieChart(statusData) {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if (!this.checkDataIsPresent(BPMDashboardStore.BpmPieChart, 'count')) {
      this.showPieNoDataMap = true;
      return
    } else {
      this.showPieNoDataMap = false;
    }
    let chart = am4core.create(this.bpmchart?.nativeElement, am4charts.PieChart);
    if(statusData){
      chart.data = statusData
    }else{
      chart.data = BPMDashboardStore.BpmPieChart;
    }
    chart.data = BPMDashboardStore.BpmPieChart
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.innerRadius = am4core.percent(50);

    // Add label
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('Risk Zone');
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 15;
    
    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.marginTop = 15;
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.position = "bottom"
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.truncate = true;
    chart.legend.itemContainers.template.togglable = false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "risk_ratings";

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.processRiskClick,this)
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

  processRiskClick(ev) {
    BPMDashboardStore.setDashboardParam(`&process_risk_rating_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bpm/process');
  }


  processUserNameforChart(dataArray){
    if(dataArray.length > 0){
      for(let i of dataArray){
        i['name'] = i['first_name']+' '+i['last_name'];
      }
      return dataArray;
    }
    else return [];
  }

  createBarChart(filter: number = 1) {
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if (filter == 3) {
      chart = am4core.create(this.barChartOwner?.nativeElement, am4charts.XYChart);
      chart.data = this.processUserNameforChart(BPMDashboardStore.BpmBarOwner);
      if(BPMDashboardStore.dashboardLoaded && BPMDashboardStore.BpmBarOwner.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'name'
    }
    if (filter == 2) {
      chart = am4core.create(this.barChartControls?.nativeElement, am4charts.XYChart);
      chart.data = BPMDashboardStore.BpmBarControls
      if(BPMDashboardStore.dashboardLoaded && BPMDashboardStore.BpmBarControls.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'control'
    }
    if (filter == 1) {
      chart = am4core.create(this.barChartDepartment?.nativeElement, am4charts.XYChart);

      chart.data = BPMDashboardStore.BpmBarDepartment
      if(BPMDashboardStore.dashboardLoaded && BPMDashboardStore.BpmBarDepartment.length==0){
        this.showNoDataBarChart = true;
      }else{
        this.showNoDataBarChart = false;
      }
      y = "count"
      x = 'department_code'
    }

    chart.numberFormatter.numberFormat = "#.";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.fontSize=12;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;

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
    valueAxis.fontSize=12;


    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.DepratmentClick,this)
     }
    //  if(filter == 2){

    //   }
     if(filter == 3){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.processOwnerClick,this)
     }

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  DepratmentClick(ev){
    BPMDashboardStore.setDashboardParam(`&department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bpm/process');
  }

  processOwnerClick(ev){
    BPMDashboardStore.setDashboardParam(`&process_owner_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/bpm/process');
  }

  checkDataIsPresent(dataArray: any[], field) {
    if (dataArray.length > 0) {
      let dataNotPresent = 0;
      for (let i of dataArray) {
        if (i[field] == 0) dataNotPresent++;
      }
      if (dataNotPresent == dataArray.length) return false;
      else return true;
    }
    else {
      return false;
    }
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    BPMDashboardStore.dashboardLoaded = false;
  }

}
