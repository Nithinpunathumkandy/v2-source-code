import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import * as htmlToImage from 'html-to-image';
import { CarouselSlideDirective, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyMappingService } from 'src/app/core/services/strategy-management/mapping/strategy-mapping.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { OrganizationChartStore } from 'src/app/stores/organization/business_profile/organization-chart.store';
import { OrganizationChartService } from 'src/app/core/services/organization/business_profile/organization-chart/organization-chart.service';
import { StrategyObjectiveTypeMasterStore } from 'src/app/stores/masters/strategy/strategy-objective-type-store';
import { StrategyObjectiveTypeService } from 'src/app/core/services/masters/strategy/strategy-objective-type/strategy-objective-type.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';

declare var $: any;
@Component({
  selector: 'app-strategy-mapping',
  templateUrl: './strategy-mapping.component.html',
  styleUrls: ['./strategy-mapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrategyMappingComponent implements OnInit, OnDestroy {
 
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;
  @ViewChild('mappipngPopup', {static: true}) mappipngPopup: ElementRef;
  @ViewChild('initiativeDetailPopup', {static: true}) initiativeDetailPopup: ElementRef;
  @ViewChild('objectiveDetailPopup', {static: true}) objectiveDetailPopup: ElementRef;
  @ViewChild('objectiveTypeDrag') objectiveTypeDrag: ElementRef;
  @ViewChild('roleDrag') roleDrag: ElementRef;
  @ViewChild('functionalDrag') functionalDrag: ElementRef;
  @ViewChild('objectiveTypeModal', { static: true }) objectiveTypeModal: ElementRef;
  @ViewChild('scrollArea', { static: false }) scrollArea: ElementRef;
  @ViewChild('scrollDiv',{static:false}) scrollDiv: ElementRef;
  // @ViewChild('profileScrollDiv',{static:false}) profileScrollDiv: ElementRef;
  @ViewChild('contentAreaStandard') contentAreaStandard: ElementRef;
  @ViewChild('focusAreaInfoPopup', {static: true}) focusAreaInfoPopup: ElementRef;
  @ViewChild('objectiveInfoPopup', {static: true}) objectiveInfoPopup: ElementRef;
  @ViewChild('profileInfoPopup', {static: true}) profileInfoPopup: ElementRef;

  selectedIndex = 0
  accordionIndex = 0
  objectivesValue = 0
  strategyProfileId: number
  selectedStrategicProfile = 0
  ocView = "strategy";
  chartType: string = 'strategy-wise';
  showTab:string = 'standard_view';
  selectedItem = 0;
  selectedObjectiveIndex= 0;
  selectedObjectiveTypeIndex= 0;
  selectedChildObjectiveIndex= 0;
  selectedObjectiveId= null;
  selectedObjectiveTypeId= null;
  selectedChildObjectiveId= null;
  objectiveValueInType = 0;
  objectiveTypeId:number;
  // downloadMessage: string = 'downloading';
  downloadMessage: string = '';
  strategyEmptyList: string = 'strategy_mapping_nodata_title';
  objectiveTypeEmptyList: string = 'strategy_mapping_objective_type_nodata_title';

  readonly kpiEmptyList: string = 'kpi_nodata_title'
  readonly focusEmptyList: string = 'no_strategy_focus'
  readonly objectiveEmptyList: string = 'no_strategy_objectives'
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  StrategyObjectiveTypeMasterStore = StrategyObjectiveTypeMasterStore;
  OrganizationChartStore = OrganizationChartStore;

  strategyProfileObject = {
    id: null,
    type: null
  };

  strategyobjectiveTypeObject = {
    id: null,
    type: null,
  };

  introSteps = [
    {
      element: '#export_to_excel',
      intro: 'Export Strategic Objectives List',
      position: 'bottom'
    },
  ]

  userCount: number = 0;
  departmentCount: number = 0;

  mappingPopupOpen :boolean = false;
  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _service: StrategyService,
    private _focusArea: FocusAreaService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _eventEmitterService: EventEmitterService,
    private _strategyMappingService: StrategyMappingService,   
    private _rightSidebarFilterService: RightSidebarFilterService,
     private _strategyService:StrategyService,
    private _initiativeService:InitiativeService,
    private _organizationChartService: OrganizationChartService,
    private _strategicObjectiveTypeService : StrategyObjectiveTypeService,
    private _organizationFileService: OrganizationfileService,
    private _strategyManagementService:StrategyManagementSettingsServiceService
  ) { }

  AppStore = AppStore
  AuthStore = AuthStore
  StrategyStore = StrategyStore
  NoDataItemStore = NoDataItemStore
  SubMenuItemStore = SubMenuItemStore
  StrategyMappingStore = StrategyMappingStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  reactionDisposer: IReactionDisposer;
  strategyProfileSubscription: Subscription;
  objectiveTypeSubscription: Subscription
  mappingPopupSubscription :any;
  initiativePopupSubscription : any;
  objectPopupSubscription : any;
  focusAreaInfoPopupSubscription:any;
  objectiveInfoPopupSubscription:any;
  profileInfoPopupSubscription : any;

  private strategicMapping$ = new Subject()
  otherResponsibleUsersObject = {
    type: null,
    value: null
  }
  initiativeDetailObject = {
    type: null,
    value: null
  }
  objectDetailObject = {
    type: null,
    value: null,
    profileId:null,
    objectiveId:null
  }
  focusInfoObject = {
    type: null,
    id:null,
    profileId:null,
  }
  objectiveInfoObject = {
    type: null,
    value: null
  }
  profileInfoObject = {
    id:null,
    type: null,
  }
  customOptions: OwlOptions = {
    loop: false,
    autoWidth:false,
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
        items: 3,
        autoWidth:false 
      },
    },
    nav: true
  }

  initiativeCustomOptions: OwlOptions = {
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
  objectiveCustomOptions: OwlOptions = {
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
  activeSlides: SlidesOutputData;
  tabHide : boolean = false;
  profile_id:number;
  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    StrategyMappingStore.componentFrom = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'export_to_excel' } },
      ]
      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            if (this.showTab == 'standard_view') {
              this.downloadMessage = "export_standard_view_chart";
              this.exportMapping();
            }
            else if (this.showTab == 'strategy-profile') {
              this.downloadMessage = "export_profile_chart";
              this.exportMapping();
            }
            else if (this.showTab == 'objective') {
              this.downloadMessage = "export_objective_chart";
              this.exportMapping();
            }
            else if (this.showTab == 'role') {
              this.downloadMessage = "export_userwise_chart";
              this.exportMapping();
            }
            else if (this.showTab == 'functional') {
              this.downloadMessage = "export_depwise_chart";
              this.exportMapping();
            }
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });    
    this._route.params.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this._strategyService.getItems(false, null, false).subscribe(()=>this._utilityService.detectChanges(this._cdr));
        this.getStandardView(+params['id'])
        this.individualStrategyProfile(+params['id']) // (+) converts string 'id' to a number            
        StrategyMappingStore.setMappingId(+params['id']);
        StrategyMappingStore.setProfileId(+params['id'])
        this.profile_id = +params['id']
        StrategyStore.setSelectedId(+params['id']);
      } else {
        this.getStrategyProfile();
        // this.openStrategyProfile()
      }
    });

    if(StrategyMappingStore.mappingTab == 'role'){
      this.showTab = 'role';
    }
    else if(StrategyMappingStore.mappingTab == 'functional'){
      this.showTab = 'functional';
    }

    if(StrategyMappingStore.userWiseChartLoaded){
      this.getTotalNumberOfUsers(StrategyMappingStore.strategyRoleWise);
    }
    if(StrategyMappingStore.departmentWiseChartLoaded){
      this.getTotalNumberofDepartments(StrategyMappingStore.strategyDepartmentWise);
    }
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.getStandardView(this.profile_id);
      this.getFocusArea();
      this.getObjectives(this.profile_id);
      this.getInitiatives(this.profile_id);
    })

    this.strategyProfileSubscription = this._eventEmitterService.strategyProfileModal.subscribe(res => {
      if (res) {
        this.profile_id = res;
        StrategyStore.setSelectedId(res);
        this._router.navigateByUrl('strategy-management/strategy-mappings/' + res);
      }else {
        this._router.navigateByUrl('strategy-management/strategy-profiles');
      }
      this.closeStrategyProfile();

    });

    this.objectiveTypeSubscription = this._eventEmitterService.strategyMappingObjectiveTypeModal.subscribe(res => {
      if (res) {
        // this.getObjectiveTypeDetails(res);
        this.closeObjectiveTypeModal();
      }else {
        this.closeObjectiveTypeModal();
      }
    });

    this.mappingPopupSubscription = this._eventEmitterService.mappingPopupModal.subscribe(res => {
      this.closeMappingPopup();
    });

    this.initiativePopupSubscription = this._eventEmitterService.strategyMappingInitiativeDetailPopupModal.subscribe(res => {
      this.closeInitiativeDetailPopup();
    });

    this.objectPopupSubscription = this._eventEmitterService.strategyMappingObjectDetailPopupModal.subscribe(res => {
      this.closeObjectiveDetailPopup();
    });

    this.focusAreaInfoPopupSubscription = this._eventEmitterService.strategyMappingfocusAreaPopupModal.subscribe(res => {
      this.closeFocusAreaInfoPopup();
    });

    this.profileInfoPopupSubscription = this._eventEmitterService.strategyMappingProfilePopupModal.subscribe(res => {
      this.closeProfileInfoPopup();
    });

    this.objectiveInfoPopupSubscription = this._eventEmitterService.strategyMappingObjectivePopupModal.subscribe(res => {
      this.closeObjectiveInfoPopup();
    });
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });

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

    // this.getUserWiseChart();
    // this.getDepartmentWiseChart();
    this.getStrategySettingsDetails();
    this.getDepartmentList();

  }

  responsibleOthers(users){
    let item = users.slice(0,3)
  return item
 }

  getStrategyProfile(newPage: number = null) {
    let is_default = false
    if (newPage) StrategyStore.setCurrentPage(newPage);
    this._strategyService.getItems(false,'&is_default_enable=true').subscribe(res => {
      
      if (res.data?.length > 0) {
        for (let i of res.data) {
          if (is_default == false && i.is_default == 1) {
            is_default = true;
            this.profile_id = i.id;
            StrategyStore.setSelectedId(this.profile_id);
            this.getStandardView(this.profile_id);
            this.individualStrategyProfile(this.profile_id)
            StrategyMappingStore.setMappingId(this.profile_id);
            StrategyMappingStore.setProfileId(this.profile_id)
          }
        }
        if (is_default == false) {
          this.profile_id = res.data[0].id;
          StrategyStore.setSelectedId(res.data[0].id);
          this.getStandardView(this.profile_id);
          this.individualStrategyProfile(this.profile_id)
          StrategyMappingStore.setMappingId(this.profile_id);
          StrategyMappingStore.setProfileId(this.profile_id)
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStandardView(id){
    this._strategyMappingService.getStandardView(id).subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

 getStrategySettingsDetails(){
  this._strategyManagementService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
}

 getPopupDetails(user,is_created_by:boolean = false){
  let userDetailObject: any = {};
  if(user){
    userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
    userDetailObject['last_name'] = user.last_name;
    userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
    userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
    userDetailObject['email'] = user.email ? user.email: null;
    userDetailObject['mobile'] = user.mobile ? user.mobile: null;
    userDetailObject['id'] = user.id;
    userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
    userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
    if(is_created_by) userDetailObject['created_at'] = new Date();
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

  //here we are getting particular profile *takeuntill used to unsubscribe http call
  individualStrategyProfile(id) {
    this._strategyMappingService.getItem(id).pipe(takeUntil(this.strategicMapping$)).subscribe(result => {
        if (result) {
          this.selectedIndex = 0;
          this.accordionIndex = 0;
          this.getFocusArea();
          this.getObjective(0);
          this.getObjectives(id);
          this.getInitiatives(id);
          this.getRoleList();
          this.getObjectiveType();
          setTimeout(() => {
            // $(this.scrollDiv.nativeElement).mCustomScrollbar();
            // $(this.profileScrollDiv.nativeElement).mCustomScrollbar();
          }, 250);
        }
        this._utilityService.detectChanges(this._cdr);
      })
  }

  getFocusArea(){
    this._strategyService.focusAreaList().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getObjectives(profileId){
    this._strategyMappingService.getProfileObjectives('?strategy_profile_ids='+profileId).subscribe(res=>{      
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

  getInitiatives(profileId){
    this._strategyMappingService.getProfileInitiatives('?strategy_profile_ids='+profileId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // this is for open/close initiative accordian
  getInitiativeInd(index) {
    if (this.accordionIndex == index)
      this.accordionIndex = null;
    else
      this.accordionIndex = index;
    this._utilityService.detectChanges(this._cdr);
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

  //Exporting html to pdf *passing html as blob
  exportMapping() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      // element = document.getElementById("strategy-mapping");

      if (this.showTab == 'standard_view')
      element = document.getElementById("strategy-mapping-standard");

      else if (this.showTab == 'strategy-profile') 
      element = document.getElementById("strategy-mapping-profile");
      
      else if (this.showTab == 'objective') 
      element = document.getElementById("strategy-mapping-objective");

      else if (this.showTab == 'role') 
      element = document.getElementById("strategy-mapping-role");

      else if (this.showTab == 'functional') 
      element = document.getElementById("strategy-mapping-functional");

      let pthis = this;
      // htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
      //   .then(function (dataUrl) {
      //     var reader = new FileReader();
      //     reader.readAsDataURL(dataUrl);
      //     reader.onloadend = function () {
      //       var base64data = reader.result;            
      //       pthis.downloadPdf(base64data);
      //     }
      //   });
      htmlToImage.toJpeg(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `${pthis.showTab}.jpeg`;
        link.href = dataUrl;
        link.click();
        SubMenuItemStore.exportClicked = false;
        pthis.closeLoaderPopUp();
      });
    }, 1000);

  }

  //downloading html as pdf
  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    })
  }
  
  //export downloading loader
  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
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
      return this._strategyService.getThumbnailPreview('profile', token);
    }else if (type === "business-profile-logo" || type === "organization-logo") {
      return this._organizationFileService.getThumbnailPreview(type, token);
    }
    else {
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }
  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  openMappingPopup(objective){
    StrategyStore.setSelectedId(objective?.strategy_profile_id)
    StrategyStore.setFocusAreaId(objective?.strategy_profile_focus_area_id)
    StrategyStore.setObjectiveId(objective?.id)
    this.mappingPopupOpen = true;
    // ($(this.mappipngPopup.nativeElement) as any).modal('show');
    this._renderer2.addClass(this.mappipngPopup.nativeElement,'show');
    this._renderer2.setStyle(this.mappipngPopup.nativeElement,'display','block');
    // this._renderer2.setStyle(this.mappipngPopup.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.mappipngPopup.nativeElement,'z-index',99999);
    this._utilityService.detectChanges(this._cdr);
  }

  closeMappingPopup() {
    this._renderer2.removeClass(this.mappipngPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.mappipngPopup.nativeElement,'display');
    this._renderer2.setStyle(this.mappipngPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.strategyProfileObject.type = null;
  }

  getObjectiveDetails(item,objective_id?){
    // this._strategyService.objectivesList(item.id).subscribe(res=>{
    // })
    this.objectDetailObject.profileId = this.profile_id;
    this.objectDetailObject.objectiveId = objective_id;
    this.objectDetailObject.value = item;
    this.objectDetailObject.type = 'details';
    this._renderer2.addClass(this.objectiveDetailPopup.nativeElement,'show');
   this._renderer2.setStyle(this.objectiveDetailPopup.nativeElement,'display','block');
   this._renderer2.setStyle(this.objectiveDetailPopup.nativeElement,'z-index',99999);
   this._utilityService.detectChanges(this._cdr);
  }

  closeObjectiveDetailPopup() {
    this._renderer2.removeClass(this.objectiveDetailPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.objectiveDetailPopup.nativeElement,'display');
    this._renderer2.setStyle(this.objectiveDetailPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.objectDetailObject.type = null;
  }

  setOcView(view: string, type: string){
    this.ocView = view
    this.chartType = type;
    // this.setType(type)
  }

  setType(type: string) {
    this.chartType = type;
    if (type != 'image' && type != 'strategy') {
      var subMenuItems = [
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'full_view' } },
        { activityName: 'DOWNLOAD_ORGANIZATION_CHART_DOCUMENT_FILE', submenuItem: { type: 'export_to_excel' } },

      ]
      if (AuthStore.userPermissionsLoaded) {
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems, this.introSteps);
      }

      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
    }
    else {
      SubMenuItemStore.makeEmpty();
    }
  }

  getUserWiseChart() {
    this._organizationChartService.getUserWiseOrganizationChart().subscribe(res => {
      this.getTotalNumberOfUsers(OrganizationChartStore.userWiseChart)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDepartmentWiseChart() {
    this._organizationChartService.getDepartmentWiseOrganizationChart().subscribe(res => {
      this.getTotalNumberofDepartments(OrganizationChartStore.departmentWiseChart);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTotalNumberOfUsers(userChartArray) {
    for (let i of userChartArray) {
      this.userCount++;
      if (i.children.length > 0) {
        this.getTotalNumberOfUsers(i.children);
      }
    }
  }

  getTotalNumberofDepartments(departmentChartArray) {
    for (let i of departmentChartArray) {
      this.departmentCount++;
      if (i.hasOwnProperty('children') && i.children.length > 0) {
        this.getTotalNumberofDepartments(i.children);
      }
      if (i.hasOwnProperty('divisions') && i.divisions.length > 0) {
        this.getTotalNumberofDepartments(i.divisions);
      }
      if (i.hasOwnProperty('departments') && i.departments.length > 0) {
        this.getTotalNumberofDepartments(i.departments);
      }
      if (i.hasOwnProperty('sections') && i.sections.length > 0) {
        this.getTotalNumberofDepartments(i.sections);
      }
      if (i.hasOwnProperty('sub_sections') && i.sub_sections.length > 0) {
        this.getTotalNumberofDepartments(i.sub_sections);
      }
    }
  }

  getChartWidth() {
    let width = this.userCount * 185;
    return width.toString() + 'px !important';
  }

  show(id) {
    $('#oc-plus-minus-icon-'+id).toggleClass("far fa-plus");
    $('.hide-and-show-oc-box-'+id).slideToggle("slow");
    // $('.hide-and-show-oc-box-'+id).setStyle("display=none")
    $(".hide-and-show-oc-box-btn-"+id).toggleClass("oc-box-rotate-icon-normal");
  }

  gotoUserDetails(id: number) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }

  getDepartmentChartWidth() {
    let width = this.departmentCount * 220;
    return width.toString() + 'px !important';
  }

  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
  }

  getTest(item,owlItem){
    // this.selectedItem = item.id;
  }

  // getObjectiveType(newPage: number = null){
  //   if (newPage) StrategyObjectiveTypeMasterStore.setCurrentPage(newPage);
  //   this._strategicObjectiveTypeService.getItems(false,null,true).subscribe(res => this._utilityService.detectChanges(this._cdr));
  // }

  getObjectiveType(){
    this._strategyMappingService.getObjectiveType('?strategy_profile_id='+this.profile_id).subscribe(res=>{    
      if(StrategyMappingStore?.objectiveTypes?.with_out_child?.length > 0){
        StrategyMappingStore?.objectiveTypes?.with_out_child.forEach((value,index) => {
          if(value.strategy_profile_objectives?.length > 0){
            value['initialObjectiveCollapsed'] = true;
            value.strategy_profile_objectives.forEach((objective,Index)=>{
              if(Index == 0){
                objective['is_accordion'] = true;
              }
              else{
                objective['is_accordion'] = false;
              }  
            })            
            setTimeout(() => {
              this.setScrollBar(index);
            }, 100);
          }
        });
      } 
      this._utilityService.detectChanges(this._cdr)});
  }

  openObjectiveTypePopup(){
    this.strategyobjectiveTypeObject.type = 'Add';
    this.strategyobjectiveTypeObject.id = this.objectiveTypeId;
    this._utilityService.detectChanges(this._cdr);
    this.openObjectiveTypeModal();
  }

  //it will open choose strategy modal
  openObjectiveTypeModal() {    
    ($(this.objectiveTypeModal.nativeElement) as any).modal('show');    
  }

  //it will close add/edit treatment modal
  closeObjectiveTypeModal() {
    ($(this.objectiveTypeModal.nativeElement) as any).modal('hide');    
    this.strategyobjectiveTypeObject.type = null;
  }

  switchTab(item){
    this.showTab = item;
    if(StrategyMappingStore?.individualLoaded){
      this.setScrollDiv(item);
    }
    if(item == 'objective'){
      if(StrategyMappingStore?.objectiveTypes?.with_out_child?.length > 0){
        StrategyMappingStore?.objectiveTypes?.with_out_child.forEach((value, index) => {
          if(value.strategy_profile_objectives?.length > 0)this.setScrollBar(index);
        });
      } 
    }
    this._utilityService.detectChanges(this._cdr);
  }

  //this is for showing selected objective color as blue for focus area
  getKeyResult(arrayNo,item) {
    if (this.selectedItem == arrayNo)
      this.selectedItem = arrayNo;
    else
      this.selectedItem = arrayNo;

    this.objectiveValueInType = arrayNo
  }

  getRoleList(){
    this._strategyMappingService.getRoleWise('?strategy_profile_ids='+this.profile_id).subscribe(res => {
      this.getTotalNumberOfUsers(StrategyMappingStore.strategyRoleWise);
      this._utilityService.detectChanges(this._cdr)
    });
  }
  
  getDepartmentList(){
    this._strategyMappingService.getDepartmentWise().subscribe(res => {
      this.getTotalNumberofDepartments(StrategyMappingStore.strategyDepartmentWise);
      this._utilityService.detectChanges(this._cdr)
    });
  }

  goToRoleDetails(item){
    StrategyMappingStore.setProfileId(this.profile_id)
    
    if(item?.is_profile || item?.is_focus_area || item?.is_objective || item?.is_initiative){
      StrategyMappingStore.setUser(item)
      StrategyMappingStore.setMappingTab('role')
      this._router.navigateByUrl('strategy-management/strategy-role-details');
    }
  }

  goToDepartmentDetails(item){
    StrategyMappingStore.setProfileId(this.profile_id)
    
    if(item?.is_profile || item?.is_focus_area || item?.is_objective || item?.is_initiative){
      StrategyMappingStore.setDepartment(item)
      StrategyMappingStore.setMappingTab('functional')
      this._router.navigateByUrl('strategy-management/strategy-department-details');
    }
  }

  getNoDataSource(type,message){
    let noDataSource = {
      noData:message, border: false, imageAlign: type
    }
    return noDataSource;
  }

  calculatePercentage(actualValue,targetValue){
    let percentage = (actualValue/targetValue)*100;
    return percentage;
  }

  selectedObjective(arrayNo,typeIndex,objectives,objectiveType) {
    // objectiveType.initialObjectiveCollapsed = false;
    // this.selectedObjectiveId = item;
    // if (this.selectedObjectiveIndex == arrayNo)
    //   this.selectedObjectiveIndex = null;
    // else
    //   this.selectedObjectiveIndex = arrayNo;
    // objectiveType.objectives.is_accordion = objectives?.is_accordion == true ? false : true;
    StrategyMappingStore.objectiveTypes.with_out_child[typeIndex].strategy_profile_objectives[arrayNo].is_accordion = objectives?.is_accordion == true ? false : true;
    StrategyMappingStore.objectiveTypes.with_out_child[typeIndex].strategy_profile_objectives.forEach((element,index) => {
      if(index != arrayNo){
        element.is_accordion = false
      }   
    });
  }

  selectedObjectiveType(arrayNo,item) {
    this.selectedObjectiveTypeId = item;
    if (this.selectedObjectiveTypeIndex == arrayNo)
      this.selectedObjectiveTypeIndex = null;
    else
      this.selectedObjectiveTypeIndex = arrayNo;
  }

  selectedObjectiveInChild(arrayNo,item) {
    this.selectedChildObjectiveId = item;
    if (this.selectedChildObjectiveIndex == arrayNo)
      this.selectedChildObjectiveIndex = null;
    else
      this.selectedChildObjectiveIndex = arrayNo;

      this._utilityService.detectChanges(this._cdr);
  }

  checkForScrollbar() {
      $(this.scrollArea.nativeElement).mCustomScrollbar();
  }

  setScrollBar(index){
    let elem: Element = document.getElementById('data-div-'+index);
    setTimeout(() => {
      $(elem).mCustomScrollbar();
    }, 50);
  }

  unsetScrollBar(){
    $(".data-div").mCustomScrollbar('destroy');
  }

  treeSLider(){
    $('#right-button-objective').click(function() {
      event.preventDefault();
      $('#content-objective').animate({
         scrollLeft: "+=300px"
      }, "slow");
   });

   $('#left-button-objective').click(function() {
      event.preventDefault();
      $('#content-objective').animate({
         scrollLeft: "-=300px"
      }, "slow");
   });
  }

  moveToObjectiveType(type) {
    switch (type) {
      case 'left': $(this.objectiveTypeDrag.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.objectiveTypeDrag.nativeElement).focus();
        break;
      case 'right': $(this.objectiveTypeDrag.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.objectiveTypeDrag.nativeElement).focus();
        break;
    }
  }

  moveTostandard(type) {
    switch (type) {
      case 'left': $(this.contentAreaStandard.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.contentAreaStandard.nativeElement).focus();
        break;
      case 'right': $(this.contentAreaStandard.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.contentAreaStandard.nativeElement).focus();
        break;
    }
  }

  moveToRole(type) {
    switch (type) {
      case 'left': $(this.roleDrag.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.roleDrag.nativeElement).focus();
        break;
      case 'right': $(this.roleDrag.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.roleDrag.nativeElement).focus();
        break;
    }
  }

  moveToFunctional(type) {
    switch (type) {
      case 'left': $(this.functionalDrag.nativeElement).animate({
        scrollLeft: "-=300px"
      }, "slow");
        $(this.functionalDrag.nativeElement).focus();
        break;
      case 'right': $(this.functionalDrag.nativeElement).animate({
        scrollLeft: "+=300px"
      }, "slow");
        $(this.functionalDrag.nativeElement).focus();
        break;
    }
  }
  setScrollDiv(item){
    // if(item == 'standard_view'){
    //   setTimeout(() => {
    //     $(this.scrollDiv.nativeElement).mCustomScrollbar();
    //   }, 250);
    // }
    // else if(item == 'strategy-profile'){
    //   setTimeout(() => {
    //     $(this.profileScrollDiv.nativeElement).mCustomScrollbar();
    //   }, 250);
    // }
  }
  
  goToDetails(type,item){
    StrategyMappingStore.componentFrom = true;
    StrategyStore.setSelectedId(this.profile_id)
    switch(type){
      case 'profile':
        if (AuthStore.getActivityPermission(3200, 'STRATEGY_PROFILE_DETAILS')) {
          // this._strategyService.getItem(item).subscribe(res=>{
            this.profileInfoObject.id = item;
            this.profileInfoObject.type = 'profile';
            this._renderer2.addClass(this.profileInfoPopup.nativeElement, 'show');
            this._renderer2.setStyle(this.profileInfoPopup.nativeElement, 'display', 'block');
            this._renderer2.setStyle(this.profileInfoPopup.nativeElement, 'z-index', 99999);
            this._renderer2.setStyle(this.profileInfoPopup.nativeElement, 'overflow', 'auto');
            this._utilityService.detectChanges(this._cdr);
          // }) 
        }
        break;
      case 'focus_area':
        // this._strategyMappingService.getFocusAreaDetail(this.profile_id,item).subscribe(res=>{
          this.focusInfoObject.id = item.id;
          this.focusInfoObject.profileId = this.profile_id;
          this.focusInfoObject.type = 'focus';
          this._renderer2.addClass(this.focusAreaInfoPopup.nativeElement, 'show');
          this._renderer2.setStyle(this.focusAreaInfoPopup.nativeElement, 'display', 'block');
          this._renderer2.setStyle(this.focusAreaInfoPopup.nativeElement, 'z-index', 99999);
          this._renderer2.setStyle(this.focusAreaInfoPopup.nativeElement, 'overflow', 'auto');
          this._utilityService.detectChanges(this._cdr);
          // this._router.navigateByUrl('strategy-management/strategy-mapping-details/focus-area');
        // })
        break;
      case 'objective':
        StrategyStore.setObjectiveId(item?.id);
        this._service.induvalObjectives(item?.id, null).subscribe(res => { 
          StrategyMappingStore.setObjectiveDetail(res);
          this.objectiveInfoObject.value = res;
          this.objectiveInfoObject.type = 'object';
          this._renderer2.addClass(this.objectiveInfoPopup.nativeElement, 'show');
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'display', 'block');
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'z-index', 99999);
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'overflow', 'auto');
          this._utilityService.detectChanges(this._cdr);
         })
          
        // this._router.navigateByUrl('strategy-management/strategy-mapping-details/objective');
        break;
      case 'objective-profile':
        StrategyStore.setObjectiveId(item?.id)
        let created_by = {
          first_name:item.created_by_first_name,
          last_name:item.created_by_last_name,
          designation_title:item.created_by_designation,
          image_token:item.created_by_image_token,
          email:item.created_by_email,
          mobile:item.created_by_mobile,
          id:item.created_by,
          department:item.created_by_department,
          status_id:item.created_by_status,
          created_at:item.created_at,
        }
        item['created_by'] =created_by;
          StrategyMappingStore.setObjectiveDetail(item);
          this.objectiveInfoObject.value = item;
          this.objectiveInfoObject.type = 'object';
          this._renderer2.addClass(this.objectiveInfoPopup.nativeElement, 'show');
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'display', 'block');
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'z-index', 99999);
          this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement, 'overflow', 'auto');
          this._utilityService.detectChanges(this._cdr);
        break;
      case 'initiatives':
        StrategyInitiativeStore.setInitiativeId(item.id)
        this._initiativeService.getInduvalInitiative(item.id).subscribe(res=>{
          this.initiativeDetailObject.value = res;
          this.initiativeDetailObject.type = 'initiative';
          this._renderer2.addClass(this.initiativeDetailPopup.nativeElement,'show');
         this._renderer2.setStyle(this.initiativeDetailPopup.nativeElement,'display','block');
         this._renderer2.setStyle(this.initiativeDetailPopup.nativeElement,'z-index',99999);
         this._renderer2.setStyle(this.initiativeDetailPopup.nativeElement, 'overflow', 'auto');
         this._utilityService.detectChanges(this._cdr);
         })
        // this._router.navigateByUrl('strategy-management/strategy-initiatives/' + item)
        break;
      default:
        break
    }
  }

  closeProfileInfoPopup(){
    this._renderer2.removeClass(this.profileInfoPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.profileInfoPopup.nativeElement,'display');
    this._renderer2.setStyle(this.profileInfoPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.profileInfoObject.type = null;
  }

  closeFocusAreaInfoPopup(){
    this._renderer2.removeClass(this.focusAreaInfoPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.focusAreaInfoPopup.nativeElement,'display');
    this._renderer2.setStyle(this.focusAreaInfoPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.focusInfoObject.type = null;
  }

  closeObjectiveInfoPopup(){
    this._renderer2.removeClass(this.objectiveInfoPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.objectiveInfoPopup.nativeElement,'display');
    this._renderer2.setStyle(this.objectiveInfoPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.objectiveInfoObject.type = null;
  }

  closeInitiativeDetailPopup() {
    this._renderer2.removeClass(this.initiativeDetailPopup.nativeElement,'show');
    this._renderer2.removeStyle(this.initiativeDetailPopup.nativeElement,'display');
    this._renderer2.setStyle(this.initiativeDetailPopup.nativeElement,'z-index','9999');
    $('.modal-backdrop').remove();    
    this.initiativeDetailObject.type = null;
  }

  initialCollapse(type,objectiveIndex){
    if(type?.initialObjectiveCollapsed && objectiveIndex == 0)return true
    else return false;
  }

  //Don't forget to unsubscribe events , services and store
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.strategicMapping$.next()
    this.strategicMapping$.complete()
    NoDataItemStore.unsetNoDataItems();
    StrategyStore.allProfileLoaded = false
    this.strategyProfileSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    // StrategyMappingStore.unsetIndividualStrategyMapping()
  }
}