import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/strategy-management/dashboard/dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AuthStore } from 'src/app/stores/auth.store';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppStore } from 'src/app/stores/app.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
  StrategyDaashboardStore = StrategyDaashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyMappingStore = StrategyMappingStore;
  StrategyStore = StrategyStore;
  StrategyInitiativeStore = StrategyInitiativeStore;
  AppStore = AppStore;

  correctiveActionData: string = 'bar';
  budgetvsActualPieChart = "pie";
  showPieNoDataMap:boolean =false;
  statusBydept: boolean = false;
  reactionDisposer: IReactionDisposer;
  strategy_dashboard_loader: boolean = false;
  profile_id:any;
  selectedIndex = 0;
  selectedObjectiveIndex = 0;
  objectivesValue = 0;
  initiativeValue = 0;
  accordionIndex = 0;
  selectedInitiativeIndex = 0;
  chart: am4charts.XYChart;
  private strategicMapping$ = new Subject()
  criteriaEmptyList = "common_nodata_title"
  freequencies: boolean = false;
  selectedPos: any = 0;
  kpiData: string = 'bar';

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: true
  }

  customObjectiveOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: true
  }

  filterSubscription: Subscription = null;

  constructor(private _dashbordService : DashboardService,private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef, private _strategyService:StrategyService,
              private _humanCapitalService: HumanCapitalService,private _strategyMappingService: StrategyMappingService,
              private _imageService: ImageServiceService,private _initiativeService : InitiativeService,
              private _router: Router, private _eventEmitterService: EventEmitterService,
              private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() =>{
      if(toJS(AuthStore.userPermissions).length > 0){
        this.getCounts();
        this.totalVsActual()
        this.getStrategyProfiles(1)
        this.statusByDepartment()
      }
    })

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      // this.StrategyInitiativeStore.loaded = false;
      this.getKpiCounts(1);
    })

    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any profiles here!" });
    setTimeout(() => {
      this.strategy_dashboard_loader = true;
    }, 500);
    this._utilityService.detectChanges(this._cdr);
    
    RightSidebarLayoutStore.filterPageTag = 'strategy_kpi_scorecard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'strategy_kpi_scoreboard_focus_area_ids',
    'strategy_kpi_scoreboard_objective_ids',
    ]);

  }

  getKpiCounts(newPage:number = null) {
    StrategyStore.unsetFocusAreaId();
    StrategyStore.unsetObjectiveId();
    if (newPage) StrategyDaashboardStore.setKPICurrentPage(newPage);
    this._dashbordService.getKpiScoreCounts(false,'&strategy_profile_id='+StrategyStore.strategyProfileId).subscribe(res => {
      setTimeout(() => {
        this.createBarChartForKPI(res['data'][0])
      }, 1000);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createBarChartForKPI(kpi){
    let x;
    let y;
    am4core.addLicense("CH199714744");
    if (!kpi || kpi?.strategy_review_frequency_targets?.length == 0){
      this.freequencies = true
    }else {
      this.freequencies = false
    }
    if (kpi || kpi?.strategy_review_frequency_targets?.length > 0){
      kpi?.strategy_review_frequency_targets.forEach((element, index) => {
        element['frequency'] = element['review_frequency'].slice(0, 3);
      });
    }
    
    let chart
     chart = am4core.create("barChart1", am4charts.XYChart);
      chart.data = kpi?.strategy_review_frequency_targets
      y = "actual_value"
      x = 'frequency'
    
    chart.numberFormatter.numberFormat = "#";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = x;

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.title.text = "Frequencies"
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.filePrefix = "KPI"
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Achived Value"



    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = y;
    series.dataFields.categoryX = x;
    series.name = "Visits";
    series.columns.template.stroke = am4core.color("#73b0ff");
    series.columns.template.fill =  am4core.color("#ceebff");
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;
    // if(ThemeStructureSettingStore.structureDetails.length > 0 && ThemeStructureSettingStore.structureDetails[0].hasOwnProperty('bar_chart_color') && ThemeStructureSettingStore.structureDetails[0].bar_chart_color){
    //   series.columns.template.fill = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
    //   series.columns.template.stroke = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
    // } 
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    this._utilityService.detectChanges(this._cdr);
  }

  getCounts(){
    this._dashbordService.getStrategyCounts().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)})
  }

  selectedKpi(pos,kpi){
    this.selectedPos = pos;
    setTimeout(() => {
      this.createBarChartForKPI(kpi)
    }, 1000);
   
    this._utilityService.detectChanges(this._cdr);
  }

  createImageUrl(token, type?) {
    if (type === "strategy_profile") {
      return this._strategyService.getThumbnailPreview('profile', token);
    } else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoOngoing(){
    this._router.navigateByUrl('strategy-management/on-going-profiles') 
  }

  onGoinngDetails(id,title){
    StrategyDaashboardStore.selectedOnGoingProfile = title;
    this._router.navigateByUrl('strategy-management/profiles-details/'+id) 
  }

  kpiScoreCahrt(){
    this._router.navigateByUrl('strategy-management/kpi-score') 
  }

  totalVsActual(){
    this._dashbordService.totalBudgetvsActual().subscribe(res=>{
      setTimeout(() => {
        this.getCompletedPercentageChart();
        this._utilityService.detectChanges(this._cdr);
      },3000);
      this._utilityService.detectChanges(this._cdr)
    })
   
  }

  getStaregyLimitedProfiles(data){
    let item = []
    if(data){
       item = data.slice(0,6);
    }
    return item
  }

  getCompletedPercentageChart(){

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);
    if(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_budget_used == 0){
      this.showPieNoDataMap = true;
      return;
    }
    else{
      this.showPieNoDataMap = false;
    }
    //create chart
    let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(88);

    //Normal axis
    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.fontSize = 10;
    axis.max = Number(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_budget_used);
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(100);
    axis.renderer.inside = false;
    axis.renderer.line.strokeOpacity = 0;
    axis.renderer.ticks.template.disabled = false
    axis.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 0;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 10;
    axis.renderer.labels.template.adapter.add("text", function(text) {
      return text;
    })

    //Axis for ranges
    let colorSet = new am4core.ColorSet();

    let axis2 =  chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = Number(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_budget_used);
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = Number(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_budget_used);
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color("#fe6984");

    let range1 = axis2.axisRanges.create();
    range1.value = 0;
    range1.endValue = Number(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_budget_used);
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color("#ffd9e0");

    //Label
    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 12;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "182";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 100;

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      axis2.invalidate();
    });

    setInterval(function() {
      let value =  parseInt(StrategyDaashboardStore.totalBudgevsActual.strategy_profile_actual_budget)// set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }

  getStrategyProfiles(newPage:number = null){
    this._strategyService.getItems(false,'&is_default=1').subscribe(res => {
      this.individualStrategyProfile(res.data[0].id)
      this.profile_id = res.data[0].id;
      StrategyStore.setSelectedId(this.profile_id);
      this.getKpiCounts(1);
      this.getFocusArea();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  //this is for showing selected objective color as blue for focus area
  getObjective(arrayNo) { 
    if (this.selectedIndex == arrayNo)
      this.selectedIndex = arrayNo;
    else
      this.selectedIndex = arrayNo;

    this.objectivesValue = arrayNo
  }

  getInitiatives(arrayNo){
    if (this.selectedObjectiveIndex == arrayNo)
      this.selectedObjectiveIndex = arrayNo;
    else
      this.selectedObjectiveIndex = arrayNo;

      this.initiativeValue = arrayNo
  }
  goToRiskList(item){
    this._router.navigateByUrl('/strategy-management/risk-list');
  }
  getActionPlanIndex(index){
    if (this.accordionIndex == index)
      this.accordionIndex = null;
    else
      this.accordionIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  getMIlestoneOrActionPlan(arrayNo ,id){
    StrategyInitiativeStore.setInitiativeId(id);
    if (this.selectedInitiativeIndex == arrayNo)
      this.selectedInitiativeIndex = arrayNo;
    else
      this.selectedInitiativeIndex = arrayNo;
      this.getActionPlans();
      this.getMileStones();
  }

  getActionPlans(){
    this._initiativeService.getActionPlan().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

getMileStones(){
  this._initiativeService.getMilestons().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

  getFocusArea(){
    this._strategyService.focusAreaList().subscribe(res => {
      this.openObjective(StrategyStore.focusAreas[0]?.id)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openObjective(id) {
    this._strategyService.objectivesList(id,false,'?is_dashboard=1').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  goToStrategyList(type){
    StrategyDaashboardStore.statusType = type
    this._router.navigateByUrl('strategy-management/strategy-profiles')
  }

  statusByDepartment(){
    this._dashbordService.profileStatusByDepartment().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
      setTimeout(() => {
        this.createBarChartForStatusByDepartment();
        this._utilityService.detectChanges(this._cdr);
      },3000);
    })
  }

  processAxis(dataArray){
    for(var i of dataArray){
            let c = i.month.substring(0,3).split('-');
            i['month'] = c[0];
            }
    return dataArray;
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


  createBarChartForStatusByDepartment(){
    
    am4core.addLicense("CH199714744");
    if(StrategyDaashboardStore.totalBudprofileStatusByDepartment.length == 0){
      this.statusBydept = true;
      return;
    }
    else{
      this.statusBydept = false;
    }
    this.chart = am4core.create("barChartRequirementType", am4charts.XYChart);
    // this.chart.data =  this.assignChartData()
    this.chart.data = StrategyDaashboardStore.totalBudprofileStatusByDepartment
    this.chart.numberFormatter.numberFormat = "#";
    this.chart.colors.list = [
      am4core.color("#4670C0"),
      am4core.color("#FF0000"),
      // am4core.color("#6FAC46"),
    ];

    var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "department_code";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.title.text = "Departments"
    categoryAxis.fontSize = 12

    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 50
    valueAxis.renderer.grid.template.opacity = 0;
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;
    valueAxis.min = 0;
    valueAxis.title.text = "title"
    valueAxis.title.fontSize = 12
    valueAxis.maxPrecision = 0

    this.chart.legend = new am4charts.Legend();
    this.chart.legend.paddingBottom = 20;
    this.chart.legend.position = "top";
    this.chart.legend.contentAlign = "right";
    this.chart.legend.fontSize = 10

    let markerTemplate = this.chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10
    this.createSeriesOverdue("new_profile", "New")
    this.createSeriesOverdue("ongoing_profile", "On-going")
    // this.createSeriesOverdue("closed_profile", "Closed")

    
    this._utilityService.detectChanges(this._cdr);
  }

  createSeriesOverdue(field, name) {
    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "department_code";
    series.sequencedInterpolation = true;
    series.name = name;
    // series.columns.template.events.on("hit",this.riskTreatmentOverdueClick,this)
    series.columns.template.width = am4core.percent(40);
    series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
    let bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.interactionsEnabled = false
    bullet.fontSize=10;
    bullet.locationY = 0;
    bullet.dy = -6;
    bullet.label.text = '{valueY}'
    bullet.label.fill = am4core.color('#00000')
  }

  //here we are getting particular profile *takeuntill used to unsubscribe http call
  individualStrategyProfile(id) {
    this._strategyMappingService.getItem(id).pipe(takeUntil(this.strategicMapping$)).subscribe(result => {
        if (result) {
          
          this.selectedIndex = 0;
          this.accordionIndex = 0;
          this.selectedObjectiveIndex = 0;
          StrategyStore.setSelectedId(this.profile_id);
          this.getKpiCounts(1);
          this.getObjective(0)
          this.getDefaultMilestoneorActionPlan(StrategyMappingStore?.individualStrategyMapping?.strategy_profile_focus_areas)
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  getDefaultMilestoneorActionPlan(item){
    let initiativeId = item[0]?.objectives[0]?.initiatives[0]?.id;
    StrategyInitiativeStore.setInitiativeId(initiativeId);
    this.getActionPlans();
    this.getMileStones();
  }
  changeProfile(){
    this.individualStrategyProfile(this.profile_id)
    this.getFocusArea();
  }

  serarchProfile(e){
    this._strategyService.getItems(false, '&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
     })
  }

  openProfile(){
    this._strategyService.getItems().subscribe(res=>{
    //  this.individualStrategyProfile(res.data[0].id)
    //  this.profile_id = res.data[0].id;
     this._utilityService.detectChanges(this._cdr);
    })
   }

   ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    this.strategicMapping$.next()
    this.strategicMapping$.complete()
    NoDataItemStore.unsetNoDataItems();
    StrategyStore.allProfileLoaded = false
    StrategyMappingStore.unsetIndividualStrategyMapping()
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
