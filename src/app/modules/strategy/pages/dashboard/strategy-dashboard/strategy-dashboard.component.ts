import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import * as am4charts from "@amcharts/amcharts4/charts";
import { DashboardService } from 'src/app/core/services/strategy-management/dashboard/dashboard.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { Subscription } from 'rxjs';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
declare var $: any;
@Component({
  selector: 'app-strategy-dashboard',
  templateUrl: './strategy-dashboard.component.html',
  styleUrls: ['./strategy-dashboard.component.scss']
})
export class StrategyDashboardComponent implements OnInit {
  @ViewChild('scrollArea', { static: false }) scrollArea: ElementRef;

  StrategyDaashboardStore = StrategyDaashboardStore;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  StrategyStore = StrategyStore;
  StrategyInitiativeStore = StrategyInitiativeStore;
  AppStore = AppStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  reactionDisposer: IReactionDisposer;
  strategy_dashboard_loader: boolean = false;

  profile_id:any;
  selectedIndex = 0;
  objectivesValue = 0;
  selectedObjectiveIndex = 0;
  initiativeValue = 0;
  accordionIndex = 0;
  selectedInitiativeIndex = 0;
  userCount: number = 0;
  criteriaEmptyList = "common_nodata_title"
  freequencies: boolean = false;
  selectedPos: any = 0;
  kpiData: string = 'bar';
  initDetails;
  chart: am4charts.XYChart;
  customOptions: OwlOptions = {
    autoWidth:true,
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
      940: {
        items: 4
      },
      1440: {
        items: 5
      },
      2640: {
        items: 6
      }
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
      940: {
        items: 4
      },
      1440: {
        items: 5
      },
      // 2640: {
      //   items: 1
      // }
    },
    nav: true
  }

  // index Variable
  selectedFocusIndex=null;

  filterSubscription: Subscription = null;

  constructor(private _dashbordService : DashboardService,
    private _cdr: ChangeDetectorRef, private _strategyService:StrategyService,
    private _initiativeService : InitiativeService,private _utilityService: UtilityService,
    private _router: Router, private _eventEmitterService: EventEmitterService,
    private _strategyManagementService:StrategyManagementSettingsServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() =>{
      if(toJS(AuthStore.userPermissions).length > 0){
        this.getStrategyProfiles(1)
      }
    })

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      // this.StrategyInitiativeStore.loaded = false;
      this.getKpiCounts(1);
      this.getCounts();
      this.getFocusArea();
      this.getObjectives();
      this.getInitiatives();
    })

    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any data here!" });
    
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
    this.getStrategySettingsDetails();
  }

  getStrategySettingsDetails(){
    this._strategyManagementService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  getKpiCounts(newPage:number = null) {
    this.userCount = 0;
    StrategyStore.unsetFocusAreaId();
    StrategyStore.unsetObjectiveId();
    if (newPage) StrategyDaashboardStore.setKPICurrentPage(newPage);
    this._dashbordService.getKpiScoreCounts(false,'&strategy_profile_id='+StrategyStore.strategyProfileId).subscribe(res => {
      this.getTotalNumberOfUsers(StrategyDaashboardStore.kpiScoreCount)
      setTimeout(() => {
        if (StrategyDaashboardStore.kpiScoreCount?.length > 0)
          this.createBarChartForKPI(res['data'][0])
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  checkForScrollbar() {
    if (StrategyDaashboardStore?.strategyInitiatives?.length > 5) {
      $(this.scrollArea.nativeElement).mCustomScrollbar();
    }
    // else {
    //   $(this.scrollArea.nativeElement).mCustomScrollbar("destroy");
    // }
  }

  createBarChartForKPI(kpi) {
    let x;
    let y;
    let chartData = []
    
    am4core.addLicense("CH199714744");
    if (!kpi || kpi?.strategy_review_frequency_targets?.length == 0) {
      this.freequencies = true
    } else {
      this.freequencies = false
    }
    if (kpi || kpi?.strategy_review_frequency_targets?.length > 0) {
      kpi?.strategy_review_frequency_targets.forEach((element, index) => {
        element['frequency'] = element['review_frequency'].slice(0, 3);
        element['year'] = element['review_frequency'].slice(7, 11);
      });
      // let data = [];
      for (let i of kpi?.strategy_review_frequency_targets) {
        // let actualValue = i.actualValue + kpi.target_unit_title

        let dataObject = {
          frequency: i.frequency,
          year: i.year,
          actual_value: i.actual_value ,
          // actual_value: actualValue,
          target_unit:kpi.target_unit_title
        }
        chartData.push(dataObject)
      }
    }

    // let chart
    //  chart = am4core.create("barChart1", am4charts.XYChart);
    //   chart.data = kpi?.strategy_review_frequency_targets
    //   y = "actual_value"
    //   x = 'frequency'

    // chart.numberFormatter.numberFormat = "#";
    // let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = x;

    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 15;
    // categoryAxis.renderer.cellStartLocation = 0.1;
    // categoryAxis.renderer.cellEndLocation = 0.9;
    // categoryAxis.title.text = "Frequencies"
    // chart.exporting.menu = new am4core.ExportMenu();
    // chart.exporting.filePrefix = "KPI"
    // chart.exporting.menu.align = "right";
    // chart.exporting.menu.verticalAlign = "top";
    // chart.rtl = AuthStore.user.language.is_rtl ? true : false;
    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    // valueAxis.title.text = "Achived Value"



    // let series = chart.series.push(new am4charts.ColumnSeries());
    // series.dataFields.valueY = y;
    // series.dataFields.categoryX = x;
    // series.name = "Visits";
    // series.columns.template.stroke = am4core.color("#73b0ff");
    // series.columns.template.fill =  am4core.color("#ceebff");
    // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    // series.columns.template.fillOpacity = 1;
    // if(ThemeStructureSettingStore.structureDetails.length > 0 && ThemeStructureSettingStore.structureDetails[0].hasOwnProperty('bar_chart_color') && ThemeStructureSettingStore.structureDetails[0].bar_chart_color){
    //   series.columns.template.fill = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
    //   series.columns.template.stroke = am4core.color(ThemeStructureSettingStore.structureDetails[0].bar_chart_color);
    // } 
    // let columnTemplate = series.columns.template;
    // columnTemplate.strokeWidth = 2;
    // columnTemplate.strokeOpacity = 1;


    // ---------------------------------------------------------------------new
    let chart = am4core.create("barChart1", am4charts.XYChart);
    chart.data = chartData
    let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "frequency";
    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.title.text = 'Targets('+kpi.target_unit_title+')';

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "actual_value";
    series.dataFields.categoryY = "frequency";
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
    series.columns.template.strokeWidth = 0;
    series.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem) {
        switch (target.dataItem.dataContext['year']) {
          case "2021":
            return chart.colors.getIndex(0);
            break;
          case "2022":
            return chart.colors.getIndex(1);
            break;
          case "2023":
            return chart.colors.getIndex(2);
            break;
          case "2024":
            return chart.colors.getIndex(3);
            break;
        }
      }
      return fill;
    });

    let axisBreaks = {};
    let legendData = [];


    // function addRange(label, start, end, color) {
    //   let range = yAxis.axisRanges.create();
    //   range.category = start;
    //   range.endCategory = end;
    //   range.label.text = label;
    //   range.label.disabled = false;
    //   range.label.fill = color;
    //   range.label.location = 0;
    //   range.label.dx = -130;
    //   range.label.dy = 12;
    //   range.label.fontWeight = "bold";
    //   range.label.fontSize = 12;
    //   range.label.horizontalCenter = "left"
    //   range.label.inside = true;

    //   range.grid.stroke = am4core.color("#396478");
    //   range.grid.strokeOpacity = 1;
    //   range.tick.length = 200;
    //   range.tick.disabled = false;
    //   range.tick.strokeOpacity = 0.6;
    //   range.tick.stroke = am4core.color("#396478");
    //   range.tick.location = 0;

    //   range.locations.category = 1;
    //   let axisBreak = yAxis.axisBreaks.create();
    //   axisBreak.startCategory = start;
    //   axisBreak.endCategory = end;
    //   axisBreak.breakSize = 1;
    //   axisBreak.fillShape.disabled = true;
    //   axisBreak.startLine.disabled = true;
    //   axisBreak.endLine.disabled = true;
    //   axisBreaks[label] = axisBreak;

    //   legendData.push({ name: label, fill: color });
    // }

    // addRange("Central", "Texas", "North Dakota", chart.colors.getIndex(0));
    // addRange("East", "New York", "West Virginia", chart.colors.getIndex(1));
    // addRange("South", "Florida", "South Carolina", chart.colors.getIndex(2));
    // addRange("West", "California", "Wyoming", chart.colors.getIndex(3));

    chart.cursor = new am4charts.XYCursor();


    let legend = new am4charts.Legend();
    legend.position = "right";
    legend.scrollable = true;
    legend.valign = "top";
    legend.reverseOrder = true;

    chart.legend = legend;
    legend.data = legendData;

    legend.itemContainers.template.events.on("toggled", function (event) {
      let name = event.target.dataItem.dataContext['name'];
      let axisBreak = axisBreaks[name];
      if (event.target.isActive) {
        axisBreak.animate({ property: "breakSize", to: 0 }, 1000, am4core.ease.cubicOut);
        yAxis.dataItems.each(function (dataItem) {
          if (dataItem.dataContext['year'] == name) {
            dataItem.hide(1000, 500);
          }
        })
        series.dataItems.each(function (dataItem) {
          if (dataItem.dataContext['year'] == name) {
            dataItem.hide(1000, 0, 0, ["valueX"]);
          }
        })
      }
      else {
        axisBreak.animate({ property: "breakSize", to: 1 }, 1000, am4core.ease.cubicOut);
        yAxis.dataItems.each(function (dataItem) {
          if (dataItem.dataContext['year'] == name) {
            dataItem.show(1000);
          }
        })

        series.dataItems.each(function (dataItem) {
          if (dataItem.dataContext['year'] == name) {
            dataItem.show(1000, 0, ["valueX"]);
          }
        })
      }
    })
    this._utilityService.detectChanges(this._cdr);
  }

  selectedKpi(pos,kpi){
    this.selectedPos = pos;
    setTimeout(() => {
      this.createBarChartForKPI(kpi)
    }, 1000);
   
    this._utilityService.detectChanges(this._cdr);
  }

  getCounts(){
    this._dashbordService.getStrategyCounts('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)})
  }

  getStrategyProfiles(newPage:number = null){
    let is_default = false;
    this._strategyService.getItems(false,'&is_custom=1').subscribe(res => {
      if (res.data?.length > 0) {
        for (let i of res.data) {
          if (is_default == false && i.is_default == 1) {
            is_default = true;
            this.individualStrategyProfile(i.id)
            this.profile_id = i.id;
            StrategyStore.setSelectedId(this.profile_id);
            // setTimeout(() => {
            //   this.strategy_dashboard_loader = true;
            // }, 500);
          }
        }
        if (is_default == false) {
          this.individualStrategyProfile(res.data[0].id)
          this.profile_id = res.data[0].id;
          StrategyStore.setSelectedId(this.profile_id);
          // setTimeout(() => {
          //   this.strategy_dashboard_loader = true;
          // }, 500);
        }
      }
      else{
        this.strategy_dashboard_loader = true;
      }
      
      // this.getKpiCounts(1);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeProfile(){
    this.strategy_dashboard_loader = false;
    this.individualStrategyProfile(this.profile_id)
    //  this.getKpiCounts(1);
    // this.getFocusArea();
    this._utilityService.detectChanges(this._cdr);
  }

  serarchProfile(e){
    this._strategyService.getItems(false, '&q=' + e.term).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  openProfile(){
    this._strategyService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
   }

   clearProfile(){
   }

   individualStrategyProfile(id){
    this._dashbordService.profileDetails(id).subscribe(res=>{
      StrategyStore.setSelectedId(this.profile_id);
      this.getKpiCounts(1);
      this.getCounts();
      this.getObjective(0);
      this.getInitiative(0);
      this.getFocusArea();
      this.getObjectives();
      this.getInitiatives();

      StrategyInitiativeStore.unsetActionPlan();
      StrategyInitiativeStore.unsetMilestones();

      setTimeout(() => {
        this.strategy_dashboard_loader = true;
      }, 250);
      this._utilityService.detectChanges(this._cdr);
      if(StrategyDaashboardStore?.induvalProfile?.focus_area)
      this.getDefaultMilestoneorActionPlan(StrategyDaashboardStore?.induvalProfile?.focus_area)
    })
   }

   getDefaultMilestoneorActionPlan(item){
     if (item[0]?.objectives?.length > 0) {
       if (item[0]?.objectives[0]?.initiatives?.length > 0) {
         let initiativeId = null;
         initiativeId = item[0]?.objectives[0]?.initiatives[0]?.id;
         if (initiativeId) {
           StrategyInitiativeStore.setInitiativeId(initiativeId);
           this.getMIlestoneOrActionPlan(0, initiativeId,item[0]?.objectives[0]?.initiatives[0])
         }
       }
     } 
  }

   getFocusArea(){
    this._strategyService.focusAreaList().subscribe(res => {
      if(StrategyStore.focusAreas?.length > 0)
      this.openObjective(StrategyStore.focusAreas[0]?.id)
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openObjective(id) {
    this._strategyService.objectivesList(id,false,'?is_dashboard=1').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getObjective(index,focus?){
    if (this.selectedIndex == index)
      this.selectedIndex = index;
    else
      this.selectedIndex = index;

    this.objectivesValue = index;

    if(focus){
      StrategyInitiativeStore.unsetActionPlan();
      StrategyInitiativeStore.unsetMilestones();
    let initiativeId = null;
     initiativeId = focus?.objectives[0]?.initiatives[0]?.id;

     if(initiativeId) this.getMIlestoneOrActionPlan(0,initiativeId,focus?.objectives[0]?.initiatives[0])
    }
  }

  getInitiative(arrayNo,objective?){
    if (this.selectedObjectiveIndex == arrayNo)
      this.selectedObjectiveIndex = arrayNo;
    else
      this.selectedObjectiveIndex = arrayNo;
      
    // if (objective) {
    //   StrategyInitiativeStore.unsetActionPlan();
    //   StrategyInitiativeStore.unsetMilestones();
    //   let initiativeId = null;
    //   initiativeId = objective?.initiatives[0]?.id;
    //   if (initiativeId) this.getMIlestoneOrActionPlan(0, initiativeId,objective?.initiatives[0])
    // }

  }

  getMIlestoneOrActionPlan(arrayNo ,id,init?){
    this.initDetails = init;
    StrategyInitiativeStore.unsetActionPlan();
    StrategyInitiativeStore.unsetMilestones();
    StrategyInitiativeStore.setInitiativeId(id);

    if (this.selectedInitiativeIndex == arrayNo)
      this.selectedInitiativeIndex = arrayNo;
    else
      this.selectedInitiativeIndex = arrayNo;
      this.getActionPlans();
      this.getMileStones();
  }

  getActionPlanIndex(index){
    if (this.accordionIndex == index)
      this.accordionIndex = null;
    else
      this.accordionIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  getActionPlans() {
    this._initiativeService.getActionPlan().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMileStones() {
    this._initiativeService.getMilestons().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // conditionApply(item){
  //   switch(item){
  //     case "initiative-enable":
  //       if(StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives?.length > 0){
  //         if(StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives[this.initiativeValue]?.initiatives?.length > 0)
  //         return true
  //         else
  //         return false
  //       }
  //       else if(StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives == null){
  //         return false
  //       }    
  //       break;

  //       case "initiative-nodata":
  //         if (StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives?.length > 0) {
  //           if (StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives[this.initiativeValue]?.initiatives?.length > 0)
  //             return false
  //           else if(StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives[this.initiativeValue]?.initiatives == null)
  //             return true
  //         }
  //         else if (StrategyDaashboardStore?.induvalProfile?.focus_area[this.objectivesValue]?.objectives == null) {
  //           return true
  //         }    
	// 			break;
  //   }
  // }

  goToReport(){
    StrategyStore.backToDashboard = true;
			this._router.navigateByUrl(`strategy-management/strategy-reports/${this.profile_id}`);
  }

  getTotalNumberOfUsers(userChartArray) {
    for (let i of userChartArray) {
      this.userCount++;
      if (i.length > 0) {
        this.getTotalNumberOfUsers(i);
      }
    }
  }

  getChartWidth() {
    let height = this.userCount * 185;
    if(height < 420)
    height = 420;
    return height.toString() + 'px !important';
  }

  setTopObjectiveLabelColor(data, item) {
    let className = ''
    switch (item) {
      case 'objective':
        if (data?.score < data?.minimum)
          className = 'red'
        else if (data?.score >= data.minimum && data?.score <= data?.maximum)
          className = 'yellow'
        else if (data?.score > data?.maximum)
          className = 'green'
        break;

      case 'actionplan':
        if (data?.actual_value < data?.minimum)
          className = 'red'
        else if (data?.actual_value >= data?.minimum && data?.actual_value <= data?.maximum)
          className = 'yellow'
        else if (data?.actual_value > data?.maximum)
          className = 'green'
        break;

      case 'kpi':
        if (data.score < data.minimum)
          className = 'red'
        else if (data.score >= data.minimum && data.score <= data.maximum)
          className = 'yellow'
        else if (data.score > data.maximum)
          className = 'green'
        break;
    }

    return className
  }

  getObjectives(){
    this._dashbordService.getProfileObjectives('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getInitiatives(){
    this._dashbordService.getProfileInitiatives('?strategy_profile_ids='+StrategyStore.strategyProfileId).subscribe(res=>{
      if(StrategyDaashboardStore?.strategyInitiatives?.length > 0){
        this.getMIlestoneOrActionPlan(0,StrategyDaashboardStore?.strategyInitiatives[0].id,StrategyDaashboardStore?.strategyInitiatives[0])
        this.checkForScrollbar();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getObjectivesWithId(params){
    this._dashbordService.getProfileObjectives(params).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getInitiativesId(params){
    this._dashbordService.getProfileInitiatives(params).subscribe(res=>{
      this.checkForScrollbar();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getKpiCountbyId(params){
    this._dashbordService.getKpiScoreCounts(false,params).subscribe(res => {
      this.getTotalNumberOfUsers(StrategyDaashboardStore.kpiScoreCount)
      setTimeout(() => {
        if (StrategyDaashboardStore.kpiScoreCount?.length > 0)
          this.createBarChartForKPI(res['data'][0])
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  goToRiskList(type,objId){
    event.stopPropagation();
    StrategyDaashboardStore.objectiveId = objId;
    StrategyDaashboardStore.riskStatusId = type;
    console.log('risk')
    this._router.navigateByUrl('/strategy-management/risk-list');
  }

  getWithFocusAreaId(id,index){
    this.selectedFocusIndex = index;
    this.getKpiCountbyId('?strategy_kpi_scoreboard_focus_area_ids='+id);
    this.getObjectivesWithId('?strategy_kpi_scoreboard_focus_area_ids='+id);
    this.getInitiativesId('?strategy_kpi_scoreboard_focus_area_ids='+id);
  }

  getWithObjectiveId(id,index){
    event.stopPropagation();
    // this.selectedFocusIndex = index;
    // this.getKpiCountbyId('?strategy_kpi_scoreboard_focus_area_ids='+id);
    // this.getObjectivesWithId('?strategy_kpi_scoreboard_focus_area_ids='+id);
    // this.getInitiativesId('?strategy_kpi_scoreboard_focus_area_ids='+id);
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    StrategyStore.unsetProfiles();
    StrategyDaashboardStore.unsetInduvalProfileDetails();
    // StrategyStore.backToDashboard = false;
    NoDataItemStore.unsetNoDataItems();
    StrategyStore.allProfileLoaded = false
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    // $(this.scrollArea.nativeElement).mCustomScrollbar("destroy");
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
