import { ITheme } from '@amcharts/amcharts4/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NonConformityDashboardService } from 'src/app/core/services/non-conformity/non-conformity-dashboard/non-conformity-dashboard.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NonConformityDashboardStore } from 'src/app/stores/non-conformity/dashboard/non-conformity-dashboard-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { Router } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

@Component({
  selector: 'app-non-conformity-dashboard',
  templateUrl: './non-conformity-dashboard.component.html',
  styleUrls: ['./non-conformity-dashboard.component.scss']
})
export class NonConformityDashboardComponent implements OnInit,OnDestroy {
  @ViewChild('findingCategoryPieChartDiv') findingCategoryPieChartDiv: ElementRef<HTMLElement>;

  findingCategoryPieChart = "pie";
  actionPlanPieChart = "pie";

  showCategoryPieNoData: boolean = false;
  showActionPlanPieNoData: boolean = false;

  NonConformityDashboardStore = NonConformityDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;

  filterSubscription: Subscription = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _nonConformityDashboardService: NonConformityDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
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
      this.NonConformityDashboardStore.dashboardLoaded = false;
      this.getAll();
      this.getCharts();
      setTimeout(() => {
        NonConformityDashboardStore.dashboardLoaded = true;
        }, 1000);
    })
    
    setTimeout(() => {
      NonConformityDashboardStore.dashboardLoaded = true;
    }, 1000);
    this.showCategoryPieNoData = false;
    this.showActionPlanPieNoData = false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      RightSidebarLayoutStore.filterPageTag = 'non_conformity_dashboard';
      this._rightSidebarFilterService.setFiltersForCurrentPage([
        'organization_ids',
        'division_ids',
        'department_ids',
        'section_ids',
        'sub_section_ids',
      ]);
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
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

  getAll() {
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT')) this.getFindingCount();
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT_BY_RISK_RATING')) this.getRiskRating();
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT_BY_FINDING_CATEGORY')) this.getFindingPieChartCategory();
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT_BY_ACTION_PLAN')) this.getFindingPieChartActionPlan();
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT_BY_DEPARTMENT')) this.getFindingLineDepartment();
    if (AuthStore.getActivityPermission(2500, 'NON_CONFORMITY_DASHBOARD_COUNT_BY_YEAR')) this.getFindingLineYear();
    this.getCharts();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
  }


  getFindingCount() {
    this._nonConformityDashboardService.getFindingCount().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRiskRating() {
    this._nonConformityDashboardService.getRiskRating().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFindingPieChartCategory() {
    this._nonConformityDashboardService.getFindingPieChartCategory().subscribe(res => {
      setTimeout(() => {

        this.createPieChartForCategory();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getFindingPieChartActionPlan() {
    this._nonConformityDashboardService.getFindingPieChartActionPlan().subscribe(res => {
      setTimeout(() => {

        this.createPieChartForActionPlan();

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getFindingLineDepartment() {
    this._nonConformityDashboardService.getFindingLineDepartment().subscribe(res => {
      setTimeout(() => {

        this.createLineChart(1);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getFindingLineYear() {
    this._nonConformityDashboardService.getFindingLineYear().subscribe(res => {
      setTimeout(() => {

        this.createLineChart(2);

      }, 1000);
      this._utilityService.detectChanges(this._cdr);

    })
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


  createPieChartForCategory() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if (!this.checkDataIsPresent(NonConformityDashboardStore.findingPieChartCategory, 'count')) {
      this.showCategoryPieNoData = true;
      return
    } else {
      this.showCategoryPieNoData = false;
    }

    let chart = am4core.create("chartfindingCategory", am4charts.PieChart);
    chart.data = NonConformityDashboardStore.findingPieChartCategory
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

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.findingCategoryChartClick, this);

    this._utilityService.detectChanges(this._cdr);
  }

  findingCategoryChartClick(ev){
    NonConformityDashboardStore.setDashboardParam(`&finding_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/non-conformity/findings');
  }

  createPieChartForActionPlan() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if (!this.checkDataIsPresent(NonConformityDashboardStore.findingPieChartActionPlan, 'count')) {
      this.showActionPlanPieNoData = true;
      return
    } else {
      this.showActionPlanPieNoData = false;
    }
    let chart = am4core.create("chartfindingActionPlan", am4charts.PieChart);
    chart.data = NonConformityDashboardStore.findingPieChartActionPlan
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('action_plans');
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 14;

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

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "finding_corrective_action_statuses";
    pieSeries.labels.template.text = "";
    // pieSeries.slices.template.events.on("hit", this.actionPlanClick, this);
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

  // actionPlanClick(ev){
  //   NonConformityDashboardStore.setDashboardParam(`&action_plan_ids=${ev?.target?.dataItem?.dataContext?.id}`)
  //   this._router.navigateByUrl('/non-conformity/findings');
  // }

  createLineChart(filter: number = 1) {
    let x;
    let y;
    am4core.addLicense("CH199714744");
    let chart
    if (filter == 1) {
      chart = am4core.create("lineChartDepartment", am4charts.XYChart);
      chart.data = NonConformityDashboardStore.findingLineDepartment
      y = "count"
      x = 'code'
    }
    if (filter == 2) {
      chart = am4core.create("lineChartYears", am4charts.XYChart);
      //  chart.dateFormatter.dateFormat = "y";
      chart.numberFormatter.numberFormat = "#.";
      chart.data = NonConformityDashboardStore.findingLineYear
      y = "total_count"
      x = 'year'
    }


    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;
    categoryAxis.tooltip.label.maxWidth = 200;
    categoryAxis.tooltip.label.wrap = true;
    // categoryAxis.events.on("sizechanged", function (ev) {
    //   let axis = ev.target;
    //   let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
    //   axis.renderer.labels.template.maxWidth = cellWidth;
    // });
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.start = 0.0;
    categoryAxis.end = 0.75;
    categoryAxis.fontSize = 11;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //  valueAxis.renderer.inversed = false;
    //  valueAxis.renderer.minLabelPosition = 0;
    valueAxis.min = 0;
    valueAxis.fontSize = 11;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    label.fontSize = 10;
    // label.truncate = true;
    // label.tooltipText = "{category}";

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Non Conformity / Findings"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    if(filter == 1){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.departmentChartClick,this)
     }
     if(filter == 2){
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer
      series.columns.template.events.on("hit",this.yearChartClick,this)
     }

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  departmentChartClick(event){
    this.NonConformityDashboardStore.nonConformityDashboardParam = event.target.column.dataItem.dataContext.id;
    NonConformityDashboardStore.setDashboardParam('&department_ids='+this.NonConformityDashboardStore.nonConformityDashboardParam)
      this._router.navigateByUrl('/non-conformity/findings');
  }

  yearChartClick(event){
    this.NonConformityDashboardStore.nonConformityDashboardParam = event.target.column.dataItem.dataContext.year;
    NonConformityDashboardStore.setDashboardParam('&year='+this.NonConformityDashboardStore.nonConformityDashboardParam)
      this._router.navigateByUrl('/non-conformity/findings');
  }

  redirectRiskRateList(title: string, count: number = 0) {
    if (count != 0) {

      NonConformityDashboardStore.setDashboardParam('risk_rating_ids=' + this.returnRatingId(title))
      // this._router.navigateByUrl('/non-conformity/findings');
    }
  }

  returnRatingId(title: string) {
    var id: number = null
    NonConformityDashboardStore.riskRating.forEach(res => {
      if (res.type == title) {
        id = res.id;
      }
    })
    return id
  }

  redirectToPage(status, count: number = 0) {
    if (count != 0) {
      // if(status=='findings'){
      //   this._router.navigateByUrl('/non-conformity/findings');
      // }
      if (status == 'open') {
        NonConformityDashboardStore.setDashboardParam('finding_status_ids=1')
        this._router.navigateByUrl('/non-conformity/findings');
      }
      if (status == 'closed') {
        NonConformityDashboardStore.setDashboardParam('finding_status_ids=2')
        this._router.navigateByUrl('/non-conformity/findings');
      }
      if (status == 'all') {
        NonConformityDashboardStore.setDashboardParam('')
        this._router.navigateByUrl('/non-conformity/findings');
      }
    }
  }

  ngOnDestroy() {
    am4core.disposeAllCharts();
    // NonConformityDashboardStore.unsetDashboardParam();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }
}
