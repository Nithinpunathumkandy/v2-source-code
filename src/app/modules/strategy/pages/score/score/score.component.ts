import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { KpiService } from 'src/app/core/services/strategy-management/kpi/kpi.service';
import { ObjectiveScoreService } from 'src/app/core/services/strategy-management/objective/objective-score.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @ViewChild('objectiveScore') objectiveScore: ElementRef;
  @ViewChild('otherResponsibleUsers', { static: true }) otherResponsibleUsers: ElementRef;
  @ViewChild('planMesure') planMesure: ElementRef;

  selectedSection: any = 'object';
  chooseButtonTitle: string;
  profile_id: any;

  KpiStore = KpiStore
  AppStore = AppStore;
  StrategyStore = StrategyStore;
  ActionPlansStore = ActionPlansStore
  ObjectiveScoreStore = ObjectiveScoreStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;

  otherResponsibleUsersObject = {
    type: null,
    value: null
  }
  planMesureObject = {
    type: null,
    value: null,
    id: null
  }

  otherResponsibleUsersSubscription: any;
  plnMesureModalModalEventSubscription: any;
  reactionDisposer: IReactionDisposer;

  filterSubscription: Subscription = null;

  constructor(private _objectiveService: ObjectiveScoreService, private _router: Router, private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _actionPlans: ActionPlansService,
    private _kpiService: KpiService, private _renderer2: Renderer2, private _eventEmitterService: EventEmitterService,
    private _initiativeService: InitiativeService, private _strategyService: StrategyService,
    private _strategyManagementService: StrategyManagementSettingsServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' } },
        // {activityName:null, submenuItem: {type: 'refresh'}}
      ]
      if (!AuthStore.getActivityPermission(3200, 'CREATE_STRATEGY_INITIATIVE')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      // this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      this._helperService.checkSubMenuItemPermissions(3200, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "search":
            this.searchScore();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res => {
      this.closeResponsibleUsersModal();
    })

    this.plnMesureModalModalEventSubscription = this._eventEmitterService.planMesureModal.subscribe(item => {
      this.closePlanMesure();
      this.getActionPlans(1);
    })
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this._objectiveService.getItemsForScoringFilter().subscribe(() => this._utilityService.detectChanges(this._cdr))
      this._kpiService.getItemsforScoringFilter().subscribe(() => this._utilityService.detectChanges(this._cdr))
      this._actionPlans.getItemsForScoringFilter().subscribe(() => this._utilityService.detectChanges(this._cdr))
    })

    RightSidebarLayoutStore.filterPageTag = 'strategy_scorecard';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'strategy_profile_focus_area_ids',
      'strategy_profile_objective_ids',
      'strategy_initiative_action_ids',
      'strategy_profile_ids',
    ]);

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
    this.getObjectiveList(1);
    this.getKpiList(1);
    this.getActionPlans(1);
    this.getStrategySettingsDetails();
  }

  searchScore() {
    switch (ObjectiveScoreStore.selectedTab) {
      case 'object':
        ObjectiveScoreStore.searchText = SubMenuItemStore.searchText;
        this.getObjectiveList(1);
        break;
      case 'kpi':
        KpiStore.searchText = SubMenuItemStore.searchText;
        this.getKpiList(1);
        break;
      case 'action-plan':
        ActionPlansStore.searchText = SubMenuItemStore.searchText;
        this.getActionPlans(1)
        break;

    }
  }

  getActionPlans(newPage: number = null) {
    if (newPage) ActionPlansStore.setCurrentPage(newPage);
    this._actionPlans.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  getObjectiveList(newPage: number = null) {
    if (newPage) ObjectiveScoreStore.setCurrentPage(newPage);
    this._objectiveService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getKpiList(newPage: number = null) {
    if (newPage) KpiStore.setCurrentPage(newPage);
    this._kpiService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }


  gotoSection(type) {
    this.selectedSection = type;
    ObjectiveScoreStore.selectedTab = type

    this.chooseButtonTitle = 'Map ' + this.selectedSection + ' with asset';
    switch (type) {
      case 'object':
        // if(AssetRegisterStore.isProperEditUser())
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
        // else
        // NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
        break;

      case 'kpi':
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
        break;

      case 'action-plan':
        NoDataItemStore.setNoDataItems({ title: "common_nodata_title" });
        break;

    }
  }

  gotoObjectiveDetails(items) {
    StrategyStore.setSelectedId(items.strategy_profile_id)
    StrategyStore.setFocusAreaId(items.strategy_profile_focus_area_id)
    this._router.navigateByUrl('strategy-management/objectives/' + items.id)
  }


  gotoDetails(data) {
    this._router.navigateByUrl('strategy-management/strategy-kpis/' + data.id)
  }

  gotoActionPlanDetails(data) {
    this._router.navigateByUrl('strategy-management/strategy-action-plan/' + data.id)
  }

  openResponsibleUsersModal(users) {
    event.stopPropagation();
    this.otherResponsibleUsersObject.type = 'Add';
    this.otherResponsibleUsersObject.value = users
    this.openResponsibleUsers()
  }
  openResponsibleUsers() {
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.otherResponsibleUsers.nativeElement, 'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'z-index', 99999);
  }

  closeResponsibleUsersModal() {
    setTimeout(() => {
      // $(this.otherResponsibleUsers.nativeElement).modal('hide');
      this.otherResponsibleUsersObject.type = null;
      this.otherResponsibleUsersObject.value = null;
      this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement, 'show');
      this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  openPlanMesureModal(plan) {
    event.stopPropagation();
    this._actionPlans.getInduvalActionPlan(plan.id).subscribe(res => {
      this.planMesureObject.value = res;
      this.planMesureObject.type = plan.actual_value ? 'Edit' : 'Add';
      this.openPlanMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  openPlanMesureModalPopup() {
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.planMesure.nativeElement, 'show');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.planMesure.nativeElement, 'overflow', 'auto');
  }

  closePlanMesure() {
    this.planMesureObject.type = null;

    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.planMesure.nativeElement, 'show');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
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
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  getCreatedPopupDetails(user) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.created_by_first_name ? user.created_by_first_name : '';
      userDetailObject['last_name'] = user.created_by_last_name ? user.created_by_last_name : '';
      userDetailObject['designation'] = user.created_by_designation ? user.created_by_designation : null;
      userDetailObject['image_token'] = user.created_by_image_token ? user.created_by_image_token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.created_by;
      userDetailObject['department'] = typeof (user.created_by_department) == 'string' ? user.created_by_department : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      userDetailObject['created_at'] = user?.created_at;
      return userDetailObject;
    }
  }

  responsibleOthers(users) {
    let item = users.slice(0, 3)
    return item
  }

  getStrategySettingsDetails() {
    this._strategyManagementService.getItems().subscribe(() => this._utilityService.detectChanges(this._cdr))
  }

  calculatePercentage(actualValue, targetValue) {
    let percentage = (actualValue / targetValue) * 100;
    return percentage;
  }

  getAchievementPer(item) {
    let per = 0;
    if (item?.score) {
      per = (item?.score / item?.target) * 100
    }
    return per
  }

  responsibleUser(id) {
    StrategyInitiativeStore.setInitiativeId(id)
    this._initiativeService.getInduvalInitiative(id).subscribe(res => {
      if (res?.responsible_users.length > 0) {
        var pos = res?.responsible_users?.findIndex(e => e.id == AuthStore.user.id)
        if (pos != -1) {
          return true;
        }
        else {
          return false
        }
      }
      else {
        return false;
      }
    })
  }

  changeProfile() {
    if (this.profile_id != 0) {
      this._objectiveService.getItems(true, '?strategy_profile_ids=' + this.profile_id).subscribe(() => this._utilityService.detectChanges(this._cdr));
      this._kpiService.getItems(true, '?strategy_profile_id=' + this.profile_id).subscribe(() => this._utilityService.detectChanges(this._cdr))
      this._actionPlans.getItems(true, '?strategy_profile_ids=' + this.profile_id).subscribe(() => this._utilityService.detectChanges(this._cdr))
    }
    else {
      this.getObjectiveList(1);
      this.getKpiList(1);
      this.getActionPlans(1);
    }
  }

  serarchProfile(e) {
    this._strategyService.getItems(false, '&q=' + e.term).subscribe(() => this._utilityService.detectChanges(this._cdr))
  }

  openProfile() {
    let all = {
      id: 0,
      title: 'All Profile',
      reference_code: 0,
      is_default: 0,
      start_date: '',
      budget: '',
      departments: '',
      end_date: '',
      description: '',
      divisions: '',
      strategy_profile_status_id: 0,
      strategy_profile_status_label: '',
      strategy_profile_status_title: '',
      strategy_profile_status_type: '',
      strategy_status_id: 0,
    }
    this._strategyService.getItems().subscribe(() => {
      StrategyStore._stratergyProfiles.unshift(all);
      this._utilityService.detectChanges(this._cdr)
    })
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    this.otherResponsibleUsersSubscription.unsubscribe();
    this.plnMesureModalModalEventSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    KpiStore.loaded = false;
    ObjectiveScoreStore.loaded = false;
    ActionPlansStore.loaded = false;
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
