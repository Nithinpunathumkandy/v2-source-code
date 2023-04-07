import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationDashboardService } from 'src/app/core/services/organization/dashboard/organization-dashboard.service';
import { ThemeStructureSettingsService } from 'src/app/core/services/settings/theme-settings/theme-structure-settings/theme-structure-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationDashboardStore } from 'src/app/stores/organization/dashboard/organization-dashboard-store';
import { ThemeStructureSettingStore } from 'src/app/stores/settings/theme/theme-structure.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ITheme } from '@amcharts/amcharts4/core';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { Router } from '@angular/router';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-organization-dashboard',
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.scss']
})

export class OrganizationDashboardComponent implements OnInit,OnDestroy {
  @ViewChild('swotchart') swotchart: ElementRef;
  @ViewChild('categorychart') categorychart: ElementRef;
  @ViewChild('pestelBarchart') pestelBarchart: ElementRef;
  @ViewChild('domainchart') domainchart: ElementRef;
  @ViewChild('barChartOrgDepartmenr') barChartOrgDepartmenr: ElementRef;

  swotAnalysisPieChart = 'pie';
  issueCategoryPieChart = 'pie';
  issueDomainPieChart = 'pie';
  organizationDepartmentBarChart = 'bar';
  IssuePestelBarChart = 'bar';

  showPieNoDataMap = false;
  showIssueCategoryPieNoDataMap = false;
  showIssueDomainPieNoDataMap = false;
  showOrganizationDepartmentNoDataMap = false;
  showIssuePestelNoDataMap = false;
  
  OrganizationDashboardStore = OrganizationDashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AuthStore = AuthStore;

  slideShow = false; 
  selectedSection = 'Strength';
  filterSubscription: Subscription = null;

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
    private _organizationDashboardService: OrganizationDashboardService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _themestructureService: ThemeStructureSettingsService,
    private _router: Router,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _eventEmitterService: EventEmitterService,
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
   * @memberof OrganizationDashboardComponent
   */  
  ngOnInit() {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.OrganizationDashboardStore.dashboardLoaded = false;
      // this.getAll();
      if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,3301))this.getOrganizationCount();
      if(AuthStore.getActivityPermission(100,'ORGANIZATION_DASHBOARD_ISUUE_COUNT_BY_DEPARTMENTS'))this.getOrganizationDepartment();
      if(OrganizationModulesStore.checkIndividualSubModule(100,21401))this.getOrganizationIssueSwot();
      this.getOrganizationIssueDomain();
      this.getOrganizationIssueCategories();
      if(OrganizationModulesStore.checkIndividualSubModule(100,21501))this.getOrganizationIssuePestel();
      setTimeout(() => {
        this.OrganizationDashboardStore.dashboardLoaded = true;
      }, 1000);
    });
    // this.getAll();
    setTimeout(() => {
      OrganizationDashboardStore.dashboardLoaded = true;
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
      setTimeout(() => {
        RightSidebarLayoutStore.filterPageTag = 'org_dashboard';
        this._rightSidebarFilterService.setFiltersForCurrentPage([
          'organization_ids',
          'division_ids',
          'department_ids',
          'section_ids',
          'sub_section_ids',
          'issue_type_ids',
          'organization_issue_category_ids',
          'stakeholder_ids',

        ]);
        this._utilityService.detectChanges(this._cdr);
      }, 1000);
    }, 1000);
  }

  redirectToListPage(type, count){
    if(count!=0){
    switch (type) {
        case 'divisions':
          this._router.navigateByUrl('/masters/divisions');
          break;
        case 'departments':
          this._router.navigateByUrl('/human-capital/departments');
          break;
        case 'ms_types':
          this._router.navigateByUrl('/organization/business-profile/ms-types');
          break;
        case 'produdcts':
          this._router.navigateByUrl('/organization/business-profile/products');
          break;
        case 'services':
          this._router.navigateByUrl('/organization/business-profile/services');
          break;
        case 'projects':
          this._router.navigateByUrl('/organization/business-profile/projects');
          break;
        case 'issues':
          this._router.navigateByUrl('/organization/context/issue-lists');
          break;
        case 'business_applications':
          this._router.navigateByUrl('/organization/business-profile/business-applications');
          break;
        case 'customer':
          this._router.navigateByUrl('/organization/business-profile/customers');
          break;          
        case 'branch':
          this._router.navigateByUrl('/organization/business-profile/branches');
          break;
    
      default:
        break;
    }
  }
  }

  gotoIssueDetailsPage(id) {
    this._router.navigateByUrl('/organization/issue-details/'+id);
  }

  getTopTenSwotFirst(id, type){
    this.selectedSection = type;
    let params = `&organization_issue_category_ids=${id}`
    this._organizationDashboardService.getOrganizationTopTenSwotIssues(false, params).subscribe(res=>{
      if (res.total > 5) {
        this.slideShow = true;
        this.getTopTenSwotSecond(id, type);
      }
    });
    this._utilityService.detectChanges(this._cdr);
  }

  getTopTenSwotSecond(id, type){
    this.selectedSection = type;
    let params = `&organization_issue_category_ids=${id}`
    this._organizationDashboardService.getOrganizationTopTenSecondSwotIssues(false, params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getAll() {
    if(OrganizationModulesStore.checkOrganizationSubModulesPermission(100,3301))this.getOrganizationCount(); 
    if(AuthStore.getActivityPermission(100,'ORGANIZATION_DASHBOARD_ISUUE_COUNT_BY_DEPARTMENTS'))this.getOrganizationDepartment();
    if(OrganizationModulesStore.checkIndividualSubModule(100,21401))this.getOrganizationIssueSwot();
    this.getOrganizationIssueDomain();
    this.getOrganizationIssueCategories();
    if(OrganizationModulesStore.checkIndividualSubModule(100,21501))this.getOrganizationIssuePestel();
    this.getCharts();
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

  getOrganizationCount(){
    this._organizationDashboardService.getOrganizationCount().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getOrganizationDepartment(){
    this._organizationDashboardService.getOrganizationIssueDepartments().subscribe(res=>{
      setTimeout(() => {
        this.createBarChartForOrganizationDepartment();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
    })
  }

  getOrganizationIssueSwot(){
    this._organizationDashboardService.getOrganizationIssueSwot().subscribe(res=>{
      setTimeout(() => {
        this.getTopTenSwotFirst(res[0].id, res[0].title);
        this.createPieChart();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
  })
  }

  getOrganizationIssueDomain(){
    this._organizationDashboardService.getOrganizationIssueDomain().subscribe(res=>{
      setTimeout(() => {
        this.createDomainPieChart();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
  })
  }

  getOrganizationIssueCategories(){
    this._organizationDashboardService.getOrganizationIssueCategories().subscribe(res=>{
      setTimeout(() => {
        this.createCategoriesPieChart();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
  })
  }

  getOrganizationIssuePestel(){
    this._organizationDashboardService.getOrganizationIssuePestel().subscribe(res=>{
      setTimeout(() => {
        this.createBarChartForOrganizationPestel();
    }, 1000);
    this._utilityService.detectChanges(this._cdr);
  })
  }

  createPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(OrganizationDashboardStore.organizationIssueSwot,'count')){
      this.showPieNoDataMap=true;
      return
    }else{
      this.showPieNoDataMap=false;
    }
    let chart = am4core.create(this.swotchart?.nativeElement, am4charts.PieChart);
    chart.data = OrganizationDashboardStore.organizationIssueSwot
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "SWOT Analysis"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    // Add label
    chart.innerRadius = am4core.percent(50);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = this._helperService.translateToUserLanguage('swot_analysis');
    label.wrap = true
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 12;
    chart.legend = new am4charts.Legend();
    // chart.legend.labels.template.disabled = true;
    chart.legend.fontSize = 11
    chart.legend.valueLabels.template.text = "{value.percent.formatNumber('#.')}%";
    chart.legend.valueLabels.template.align = "left"
    chart.legend.valueLabels.template.textAlign = "end"
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.itemContainers.template.padding(3,0,3,0);
    chart.legend.itemContainers.template.togglable = false;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 13;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.labels.template.text = "";
    pieSeries.slices.template.events.on("hit", this.swotClick, this);
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

  swotClick(ev){
    OrganizationDashboardStore.setorganisationDashboardParam(`issue_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/organization/context/issue-lists');
  }

  createDomainPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(OrganizationDashboardStore.organizationIssueDomain,'count')){
      this.showIssueDomainPieNoDataMap=true;
      return
    }else{
      this.showIssueDomainPieNoDataMap=false;
    }
    let chart = am4core.create(this.domainchart?.nativeElement, am4charts.PieChart);
    chart.data = OrganizationDashboardStore.organizationIssueDomain
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "SWOT Analysis"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

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
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.alignLabels = false;
    pieSeries.slices.template.events.on("hit", this.domainChartClick, this);
    // pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{count}"
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.tooltipText = "{category}:[bold]{count}"

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    pieSeries.fontSize = 10
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

  domainChartClick(ev) {
      OrganizationDashboardStore.setorganisationDashboardParam(`issue_domain_ids=${ev?.target?.dataItem?.dataContext?.id}`)
      this._router.navigateByUrl('/organization/context/issue-lists');
  }

  createCategoriesPieChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
    if(!this.checkDataIsPresent(OrganizationDashboardStore.organizationIssueCategories,'count')){
      this.showIssueCategoryPieNoDataMap=true;
      return
    }else{
      this.showIssueCategoryPieNoDataMap=false;
    }
    let chart = am4core.create(this.categorychart?.nativeElement, am4charts.PieChart);
    chart.data = OrganizationDashboardStore.organizationIssueCategories
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "Categories"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
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
    
    chart.legend.labels.template.truncate = true;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "title";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{count}"
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.tooltipText = "{category}:[bold]{count}"
    pieSeries.fontSize = 10
    pieSeries.slices.template.events.on("hit", this.categoryChartClick, this);
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
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

  categoryChartClick(ev){
    OrganizationDashboardStore.setorganisationDashboardParam(`issue_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/organization/context/issue-lists');
  }

  createBarChartForOrganizationDepartment(){
    am4core.addLicense("CH199714744");
    if(OrganizationDashboardStore.organizationIssueDepartments.length==0){
      this.showOrganizationDepartmentNoDataMap=true;
      return
    }else{
      this.showOrganizationDepartmentNoDataMap=false;
    }
    // Create chart instance
    // this.chartElementForSlaContract.nativeElement
    let chart = am4core.create(this.barChartOrgDepartmenr?.nativeElement, am4charts.XYChart);
    chart.data = OrganizationDashboardStore.organizationIssueDepartments;
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.title.text = "";
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6
    categoryAxis.fontSize = 12

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "";
    ;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "department_code";
    series.name = "";
    
    series.columns.template.tooltipText = "{title}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on("hit",this.departmentIssueClick,this)
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 4;
    columnTemplate.strokeOpacity = 1;

    this._utilityService.detectChanges(this._cdr);
  }

  departmentIssueClick(ev) {
    OrganizationDashboardStore.setorganisationDashboardParam(`department_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/organization/context/issue-lists');
  }

  createBarChartForOrganizationPestel(){
    am4core.addLicense("CH199714744");
    if(OrganizationDashboardStore.organizationIssuePestel.length==0){
      this.showIssuePestelNoDataMap=true;
      return
    }else{
      this.showIssuePestelNoDataMap=false;
    }


    var chart = am4core.create(this.pestelBarchart?.nativeElement, am4charts.XYChart);
    chart.data = OrganizationDashboardStore.organizationIssuePestel;
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
    series.columns.template.events.on("hit",this.pestelAnalysisClick,this)
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

  pestelAnalysisClick(ev) {
    OrganizationDashboardStore.setorganisationDashboardParam(`issue_category_ids=${ev?.target?.dataItem?.dataContext?.id}`)
    this._router.navigateByUrl('/organization/context/issue-lists');
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

  ngOnDestroy(){
    am4core.disposeAllCharts();
    OrganizationDashboardStore.dashboardLoaded = false;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
  }


}


