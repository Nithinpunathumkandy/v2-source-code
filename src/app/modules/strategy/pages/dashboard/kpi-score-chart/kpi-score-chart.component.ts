import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from 'src/app/core/services/strategy-management/dashboard/dashboard.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ITheme } from '@amcharts/amcharts4/core';
import { AuthStore } from 'src/app/stores/auth.store';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Subject, Subscription } from 'rxjs';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Component({
  selector: 'app-kpi-score-chart',
  templateUrl: './kpi-score-chart.component.html',
  styleUrls: ['./kpi-score-chart.component.scss']
})
export class KpiScoreChartComponent implements OnInit {
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  StrategyStore = StrategyStore
  strategyProfileId: any;
  form: FormGroup;
  formErrors: any;
  StrategyDaashboardStore = StrategyDaashboardStore;
  selectedPos: any = 0;
  freequencies: boolean = false;
  kpiData: string = 'bar';
  criteriaEmptyList = "common_nodata_title"
  reactionDisposer: IReactionDisposer;
  strategy_dashboard_loader: boolean = false;
  profile_id:any;
  AppStore = AppStore
  AuthStore = AuthStore
  NoDataItemStore = NoDataItemStore
  SubMenuItemStore = SubMenuItemStore
  StrategyMappingStore = StrategyMappingStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  private strategicMapping$ = new Subject()

  selectedIndex = 0
  selectedKpiIndex = 0
  accordionIndex = 0
  objectivesValue = 0
  kpiValue = 0
  selectedStrategicProfile = 0

  otherResponsibleUsersObject = {
    type: null,
    value: null
  }

  strategyProfileObject = {
    id: null,
    type: null
  };
  readonly kpiEmptyList: string = 'kpi_nodata_title'
  strategyProfileSubscription:any;
  filterSubscription: Subscription = null;

  constructor(private _profileService : StrategyService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _dashbordService : DashboardService,
    private _renderer2: Renderer2,
    private _focusArea: FocusAreaService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _strategyMappingService: StrategyMappingService,  
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService
    ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {      
      if(toJS(AuthStore.userPermissions).length > 0){
        this.openProfile();
      }
    });

    SubMenuItemStore.setSubMenuItems([
      {type: "close", path: "../dashboard"}
    ]);

    this.form = this._formBuilder.group({
      strategy_profile_id : null,
      strategy_profile_focus_area_id :null,
      strategy_profile_objective_id : null
    })
    
    this.strategyProfileSubscription = this._eventEmitterService.strategyProfileModal.subscribe(res => {
      if (res) {
        this.individualStrategyProfile(res)
      }
      this.closeStrategyProfile();
    });

    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      // this.StrategyInitiativeStore.loaded = false;
      this.getKpiCounts(1);
    })

    setTimeout(() => {
      this.strategy_dashboard_loader = true;
    }, 500);
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
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


  changeProfile(){
    
    this.individualStrategyProfile(this.profile_id)
    // this._utilityService.detectChanges(this._cdr);
  }

  
  closeProfile(){
    this.form.patchValue({
      strategy_profile_focus_area_id : null,
      strategy_profile_objective_id : null
    })
    StrategyStore._objectives = []
    StrategyStore._focusAreas = []

    StrategyDaashboardStore._kpiScoreCount = null
    this.openProfile();
    this._utilityService.detectChanges(this._cdr);
  }

  openProfile(){
   this._profileService.getItems().subscribe(res=>{
    this.individualStrategyProfile(res.data[0].id)
    this.profile_id = res.data[0].id;
    this._utilityService.detectChanges(this._cdr);

   })
  }

  //here we are getting particular profile *takeuntill used to unsubscribe http call
  individualStrategyProfile(id) {
    this._strategyMappingService.getItem(id).pipe(takeUntil(this.strategicMapping$)).subscribe(result => {
        if (result) {
          this.selectedIndex = 0;
          this.selectedKpiIndex= 0;
          this.accordionIndex = 0;
          StrategyStore.setSelectedId(result.id)
          
        //  if(result.strategy_profile_focus_areas?.length > 0) StrategyStore.setFocusAreaId(result.strategy_profile_focus_areas[0]?.id)
        //  if(result.strategy_profile_focus_areas[0]?.objectives?.length > 0) StrategyStore.setObjectiveId(result.strategy_profile_focus_areas[0]?.objectives[0]?.id)
          // this.getObjective(0)
          
          // if(result.strategy_profile_focus_areas[0]?.objectives?.length > 0) 
          this.getKpiCounts();
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  serarchProfile(e){
    this._profileService.getItems(false, '&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
  
     })
  }
  openFocus(){
   this._profileService.focusAreaList().subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
   })
  }

  selectedKpi(pos,kpi){
    this.selectedPos = pos;
    setTimeout(() => {
      this.createBarChartForKPI(kpi)
    }, 1000);
   
    this._utilityService.detectChanges(this._cdr);
  }

  clearObjective(){
    StrategyDaashboardStore._kpiScoreCount = null
    this._utilityService.detectChanges(this._cdr);
  }

  clearFocus(){
    this.form.patchValue({
      strategy_profile_objective_id : null
    })
    StrategyStore._objectives = []
    StrategyDaashboardStore._kpiScoreCount = null
    this._utilityService.detectChanges(this._cdr);
  }

  changeFocusArea(){
    this.form.patchValue({
      strategy_profile_objective_id : null
    })
    StrategyStore._objectives = []
    StrategyDaashboardStore._kpiScoreCount = null
    StrategyStore.setFocusAreaId(this.form.value.strategy_profile_focus_area_id.id)
    this.form.value.strategy_profile_objective_id = [];
    StrategyStore._kpis = [];
    this._utilityService.detectChanges(this._cdr);
  }

  changeObjective(){
    StrategyDaashboardStore._kpiScoreCount = null
    StrategyStore.setObjectiveId(this.form.value.strategy_profile_objective_id.id)
    StrategyStore._kpis = [];
    this.getKpiCounts()
    // this.getKpis();

    this._utilityService.detectChanges(this._cdr);

  }

  getKpis(){
    this._profileService.getAllKpis().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  
  openObjective(){
    if(this.form.value.strategy_profile_focus_area_id.id){
      this._profileService.objectivesList(this.form.value.strategy_profile_focus_area_id.id ).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
       })
    }

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

  responsibleOthers(users) {
    let item = users.slice(0, 3)
    return item
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  openResponsibleUsersModal(users){
    this.otherResponsibleUsersObject.type = 'Add';
    this.otherResponsibleUsersObject.value = users
    this.openResponsibleUsers()
  }
  openResponsibleUsers(){
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.otherResponsibleUsers.nativeElement,'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','block');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'z-index',99999);
  }
  
  closeResponsibleUsersModal(){
    setTimeout(() => {
      // $(this.otherResponsibleUsers.nativeElement).modal('hide');
      this.otherResponsibleUsersObject.type = null;
      this.otherResponsibleUsersObject.value = null;
      this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement,'show');
      this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }
  
  //this is for showing selected objective color as blue for focus area
  getObjective(arrayNo,item?) {
    
    StrategyDaashboardStore._kpiScoreCount = null;
    this.objectivesValue = arrayNo;
    if(item){
      StrategyStore.setFocusAreaId(item?.id);
      if(item?.objectives?.length > 0){
        StrategyStore.setObjectiveId(item?.objectives[0]?.id)
      this.getKpi(0)
      } 
    }
    
    if (this.selectedIndex == arrayNo)
      this.selectedIndex = arrayNo;
    else
      this.selectedIndex = arrayNo;
  }

  getKpi(arrayNo,id?) {
    StrategyDaashboardStore._kpiScoreCount = null

    if(id)StrategyStore.setObjectiveId(id)
    if (this.selectedKpiIndex == arrayNo)
      this.selectedKpiIndex = arrayNo;
    else
      this.selectedKpiIndex = arrayNo;

      this.kpiValue = arrayNo;
     this.getKpiCounts()
  }

  // this is for open/close initiative accordian
  getInitiatives(index) {
    if (this.accordionIndex == index)
      this.accordionIndex = null;
    else
      this.accordionIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  //this is for showing responsible user popups
  getResponsibleUser(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title;
    userDetial['image_token'] = users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;
  }

  //getting token as 
  createImageUrl(token, type?) {
    if (type === "focus_area") {
      return this._focusArea.getThumbnailPreview('focus_area', token);
    } else if (type === "strategy_profile") {
      return this._profileService.getThumbnailPreview('profile', token);
    }
    else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }
  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  //this is for opening choose strategy modal
  openStrategyProfile() {
    this.strategyProfileObject.type = 'Add';
    this.strategyProfileObject.id = StrategyMappingStore?.individualStrategyMapping?.id;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  //it will open choose strategy modal
  openFormModal() {    
    ($(this.formModal.nativeElement) as any).modal('show');    
  }

  //it will close add/edit treatment modal
  closeStrategyProfile() {
    ($(this.formModal.nativeElement) as any).modal('hide');    
    this.strategyProfileObject.type = null;
  }

  //Don't forget to unsubscribe events , services and store
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
