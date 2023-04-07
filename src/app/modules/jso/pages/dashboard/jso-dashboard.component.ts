import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { JsoDashboardService } from 'src/app/core/services/jso/jso-dashboard/jso-dashboard.service';
import { JsoDashboardStore } from 'src/app/stores/jso/jso-dashboard/jso-dashboard-stores';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ITheme } from '@amcharts/amcharts4/core';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { isPlatformBrowser } from '@angular/common';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { autorun, IReactionDisposer } from 'mobx';

@Component({
  selector: 'app-jso-dashboard',
  templateUrl: './jso-dashboard.component.html',
  styleUrls: ['./jso-dashboard.component.scss']
})
export class JsoDashboardComponent implements OnInit {

  JsoDashboardStore = JsoDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  AuthStore = AuthStore;

  showNumberOfObservationsNoDataMap: boolean = false;
  showsafeVsUnsafeActionsNoDataMap: boolean = false;
  showOpenClosedNoDataMap: boolean = false;
  showParticipationDepartmentNoDataMap: boolean = false;
  showObservationCategoriesNoDataMap: boolean = false;
  Jso_dashboard_loader: boolean = false;

  noDataSource = "bar";
  reactionDisposer: IReactionDisposer;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone,
    private _jsoDashboardService: JsoDashboardService,
    private _utilityService: UtilityService,
    private cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if (AuthStore.userPermissions) {
        // this.getAll();
        // this.getCharts();

        setTimeout(() => {
          if (!ThemeStructureSettingStore.structureDetails && !ThemeStructureSettingStore.structureDetailsById) {
            this._themestructureService.getItems().subscribe(() => {
              this._themestructureService.getItemsById(ThemeStructureSettingStore.structureDetails[0]?.id).subscribe(() => {
                this.getCharts();
                this.getAll();
              });
            })
          }
          else {
            this.getAll();
            this.getCharts();
          }
        }, 1000);
      }
    })
    setTimeout(() => {
      this.Jso_dashboard_loader = true;
    }, 500);
  }

  getAll() {

    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_COUNTS')) this.getJSOCount();
    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_POSITIVE_VS_NEGATIVE_COUNTS')) this.getPositiveNegative();
    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_OBSERVATION_OPEN_VS_CLOSED_COUNTS')) this.getOpenClosed();
    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_OBSERVATIONS_PERCENTAGE_PARTICIPATION_PER_DEPARTMENT')) this.getParticipationDepartment();
    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_OBSERVATION_CATEGORIES')) this.getObservationCategories();
    if (AuthStore.getActivityPermission(2000, 'DASHBOARD_JSO_NUMBER_OF_OBSERVATION_PER_DEPARTMENT')) this.getNumberOfObservations();
    this.getCharts();
    setTimeout(() => {
      this._utilityService.detectChanges(this.cdr);
    }, 100);
  }

  processAxis(dataArray) {
    for (var i of dataArray) {
      let c = i.month.substring(0, 3).split('-');
      i['month'] = c[0];
    }
    return dataArray;
  }

  getCharts() {
    //   // Chart code goes in here
    let theme = 'am4themes_animated';
    if (ThemeStructureSettingStore.structureDetailsById) theme = ThemeStructureSettingStore.structureDetailsById.charts_theme;
    let iTheme: ITheme = this._helperService.getThemes(theme);
    this.browserOnly(() => {
      am4core.useTheme(iTheme);
    });
  }

  getJSOCount() {
    this._jsoDashboardService.getJSOCount().subscribe(() => { this._utilityService.detectChanges(this.cdr) })
  }

  getPositiveNegative() {
    this._jsoDashboardService.getPositiveNegative().subscribe(() => {
      this.safeVsUnsafeActionsChart();
      this._utilityService.detectChanges(this.cdr);
    })
  }

  getOpenClosed() {
    this._jsoDashboardService.getOpenClosed().subscribe(res => {
      this.OpenCloseChart();
      this._utilityService.detectChanges(this.cdr);
    });
  }

  getParticipationDepartment() {
    this._jsoDashboardService.getParticipationPerDepartment().subscribe(res => {
      this.participationDepartmentChart();
      this._utilityService.detectChanges(this.cdr);
    })
  }
  getObservationCategories() {
    this._jsoDashboardService.getObservationCategories().subscribe(res => {
      this.observationCategoriesChart();
      this._utilityService.detectChanges(this.cdr);
    })
  }
  getNumberOfObservations() {
    this._jsoDashboardService.getNumberOfObservations().subscribe(res => {
      this.numberOfObservationChart();
      this._utilityService.detectChanges(this.cdr);
    })
  }


  safeVsUnsafeActionsChart() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);


    if (JsoDashboardStore?.jsoPositiveNegative.length == 0) {
      this.showsafeVsUnsafeActionsNoDataMap = true;
      return
    } else {
      this.showsafeVsUnsafeActionsNoDataMap = false;
    }

    let chart = am4core.create('safeVsUnsafeActionChart', am4charts.XYChart);
    chart.data = this.processAxis(JsoDashboardStore?.jsoPositiveNegative);

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.title.text = "";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    valueAxis.fontSize = 10;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "positive_count";
    series.dataFields.categoryX = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.tooltip.label.wrap = true;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;
    series.name = "Safe Actions";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "negative_count";
    series1.dataFields.categoryX = "month";
    series1.name = "Unsafe Actions";

    series1.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series1.columns.template.fillOpacity = 1;

    // Configure axis label
    var label = categoryAxis.renderer.labels.template;
    // label.truncate = true;
    label.maxWidth = 60;
    label.truncate = false;
    label.wrap = true;
    label.tooltipText = "{categoryX}";

    let columnTemplate1 = series.columns.template;
    columnTemplate1.strokeWidth = 2;
    columnTemplate1.strokeOpacity = 1;
  }

  OpenCloseChart() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);

    if (JsoDashboardStore?.jsoOpenClose.length == 0) {
      this.showOpenClosedNoDataMap = true;
      return
    } else {
      this.showOpenClosedNoDataMap = false;
    }

    let chart = am4core.create("openclosechart", am4charts.XYChart);
    // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    // chart.data = JsoDashboardStore?.jsoOpenClose;
    chart.data = this.processAxis(JsoDashboardStore?.jsoOpenClose);
    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.legend.position = "bottom"
    chart.legend.fontSize = 10
    chart.legend.marginTop = 10;
    chart.legend.maxHeight = 40;
    chart.legend.scrollable = true;
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.itemContainers.template.padding(3,0,3,0);
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    markerTemplate.fontSize = 10;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 100;
    valueAxis.strictMinMax = false;
    valueAxis.calculateTotals = false;
    valueAxis.renderer.minWidth = 50;
    valueAxis.fontSize = 10;


    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText =
      "{name}: {valueY.formatNumber('#.00')}%";
    series1.name = "Open";
    series1.dataFields.categoryX = "month";
    series1.dataFields.valueY = "open_percentage";
    // series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "horizontal";

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY.formatNumber('#.00')}%";
    series2.name = "Close";
    series2.dataFields.categoryX = "month";
    series2.dataFields.valueY = "closed_percentage";
    // series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "horizontal";
  }

  //for number of observation chart
  numberOfObservationChart() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);

    if (JsoDashboardStore?.jsoNumberOfObservations.length == 0) {
      this.showNumberOfObservationsNoDataMap = true;
      return
    } else {
      this.showNumberOfObservationsNoDataMap = false;
    }

    let chart = am4core.create("numberOfObservationChart", am4charts.XYChart);

    chart.data = JsoDashboardStore?.jsoNumberOfObservations;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 100;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fontSize = 10;
    valueAxis.maxPrecision = 0;
    valueAxis.min = 0;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "title";
    series.name = "count";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }

  //for Participation Department chart
  participationDepartmentChart() {
    am4core.addLicense("CH199714744");
    // am4core.useTheme(am4themes_animated);

    if (JsoDashboardStore?.jsoParticipationPerDepartment.length == 0) {
      this.showParticipationDepartmentNoDataMap = true;
      return
    } else {
      this.showParticipationDepartmentNoDataMap = false;
    }

    let chart = am4core.create("ParticipationDepartmentchart", am4charts.XYChart);

    chart.data = JsoDashboardStore?.jsoParticipationPerDepartment;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.fontSize = 10;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 100;

    // categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
    //   if (target.dataItem && target.dataItem.index) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fontSize = 10
    valueAxis.maxPrecision = 0
    valueAxis.min = 0;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "percentage";
    series.dataFields.categoryX = "department_code";
    series.name = "percentage";
    series.columns.template.tooltipText = "{department_title}: [bold]{valueY}[/] %";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }

  observationCategoriesChart() {
    // am4core.useTheme(am4themes_animated);
    am4core.addLicense("CH199714744");

    if (JsoDashboardStore?.jsoObservationCategories.length == 0) {
      this.showObservationCategoriesNoDataMap = true;
      return
    } else {
      this.showObservationCategoriesNoDataMap = false;
    }

    let chart = am4core.create("observationCategoriesChart", am4charts.XYChart);
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    chart.data = JsoDashboardStore?.jsoObservationCategories;
    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.start = 0.0;
    categoryAxis.end = 0.75;

    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 120;
    label.fontSize = 10;


    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.inversed = false;
    valueAxis.fontSize = 10;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0;


    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "count";
    series1.dataFields.categoryX = "title";
    series1.name = "title";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{categoryX}: {valueY}";
    // series1.legendSettings.valueText = "{valueY}";
    // series1.visible = false;

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = "zoomY";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

  }
  ngOnDestroy() {
    am4core.disposeAllCharts();
  }
}
