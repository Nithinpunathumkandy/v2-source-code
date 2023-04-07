import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MockDrillChecksService } from 'src/app/core/services/masters/mock-drill/mock-drill-checks/mock-drill-checks.service';
import { MockDrillResponseServiceService } from 'src/app/core/services/masters/mock-drill/mock-drill-response-service/mock-drill-response-service.service';
import { MockDrillScenarioService } from 'src/app/core/services/masters/mock-drill/mock-drill-scenario/mock-drill-scenario.service';
import { MockDrillPlanService } from 'src/app/core/services/mock-drill/mock-drill-plan/mock-drill-plan.service';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MockDrillChecksMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-checks-store';
import { MockDrillResponseServiceMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-response-service-store';
import { MockDrillScenarioMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-scenario-store';
import { MockDrillPlanStore } from 'src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-add',
  templateUrl: './mock-drill-add.component.html',
  styleUrls: ['./mock-drill-add.component.scss']
})
export class MockDrillAddComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @ViewChild('userPopup') userPopup: ElementRef;
  @ViewChild('tblParticipants', { static: false }) tblParticipants: ElementRef;
  currentTab = 0;
  regForm: FormGroup;
  formErrors: any;
  reactionDisposer: IReactionDisposer;
  subscription: any;
  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  MockDrillStore = MockDrillStore;
  MockDrillPlanStore = MockDrillPlanStore;
  MockDrillScenarioMasterStore = MockDrillScenarioMasterStore;
  MockDrillResponseServiceMasterStore = MockDrillResponseServiceMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MockDrillChecksMasterStore = MockDrillChecksMasterStore;
  UsersStore = UsersStore;
  mock_drill_observation_members: any;
  addOtherUserSubscription: any;
  saveData: any = null;
  isMockDrillFire: boolean = true;
  infoId: number;
  checksId: number;
  observationId: number;
  participantId: number;
  displayForm: any = null;
  nextButtonText = 'next';
  previousButtonText = "previous";
  showForm: boolean = false;
  short_comings_drill: boolean = false;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  confirmationEventSubscription: any;
  criteriaEmptyList = "common_nodata_title"
  formObject: any;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'common_cancel_subtitle',
    type: 'Cancel'
  };
  tempServiceChecks: any;
  startTime: any;
  endTime: any;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    public _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _mockDrillService: MockDrillService,
    private _mockDrillPlanService: MockDrillPlanService,
    private _mockDrillResponseService: MockDrillResponseServiceService,
    private _mockDrillChecksService: MockDrillChecksService,
    private _mockDrillScenarioService: MockDrillScenarioService,
  ) { }

  ngOnInit(): void {
    this.setDefaultObject();
    // Form Initialization
    this.regForm = this._formBuilder.group({
      infoId: null,
      venue: '',
      mock_drill_plan_id: [null, [Validators.required]],
      incident_controller_id: [null, [Validators.required,]],
      mock_drill_scenario_id: null,
      actual_date: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
      premises: null,
      participants: null,
      checksId: null,
      participant: [null, [Validators.required]],
      participant_id: null,
      observation_id: null,
      mock_drill_observation_members: null,
      // head_count: [null, [Validators.required]],
      observation: '',
      short_comings_of_the_drill: null,
      description: '',
      // action: '',
      effectiveness_remark: '',
      // approver_id: [null, [Validators.required]],
    });
    this.short_comings_drill = false;
    this._utilityService.scrollToTop();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      this.addOtherUserSubscription = this._eventEmitterService.userMockDrillModal.subscribe(element => {
        $(this.userPopup.nativeElement).modal('hide');
      })
    })
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", buttonText: '' });
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: '/mock-drill/mock-drills' }]);
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => { })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => { })
    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => { this.cancelMockDirllForm(item); })
    this.getUsers();
    this.showForm = true;
    this._utilityService.detectChanges(this._cdr);
    this.currentTab = 0;
    this.startForm();
    this.getMockDrillPlan();
    this.getMOckDrillResponseService();
    this.getMockDrillScenario();
    if (MockDrillStore.mock_drill_id != undefined && MockDrillStore.mock_drill_id != null && MockDrillStore.mock_drill_id != 0)
      this.setEditData();
    else
      this._router.navigateByUrl('mock-drill/mock-drills/new');
  }
  showUserPopup() {
    $(this.userPopup.nativeElement).modal('show');
  }
  // Patch Data While Edit
  setEditData() {
    // if (MockDrillStore.selected == undefined || MockDrillStore.selected == null)
    this._mockDrillService.getItem(MockDrillStore.mock_drill_id).subscribe(res => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      setTimeout(() => {
        this.infoId = MockDrillStore.selected?.id;
        MockDrillStore.participants = [];
        var userData: any = [];
        if (MockDrillStore.selected?.mock_drill_participants && MockDrillStore.selected?.mock_drill_participants.length > 0) {
          this.participantId = MockDrillStore.selected.mock_drill_participants[0].id;
          MockDrillStore.selected.mock_drill_participants.forEach(element => {
            var val = { is_new: false, user_id: element.user != null ? element.user.id : null, name: element.user != null ? element.user.first_name + ' ' + (element.user.last_name != null ? element.user.last_name : '') : element.name, designation: element.user != null ? element.user.designation : element.designation, evacuation_time: element.evacuation_time, is_delete: false, is_exist: element.user != null, participant_id: element.id, image_token: element.user != null ? element.user.image.token : null };
            MockDrillStore.participants.push(val);
            if (element.user != null)
              userData.push(element.user)
          });
        }
        this.setResponsesServiceChecks(MockDrillResponseServiceMasterStore.allItems[0]?.id);
        this.setClass(MockDrillResponseServiceMasterStore.allItems[0]?.id)
        this.mock_drill_observation_members = [];
        var tempMember: any = [];
        this.isMockDrillFire = MockDrillStore.selected.mock_drill_plan.mock_drill_type.id != 2 ? true : false;
        this.setDefaultObject();
        if (MockDrillStore.selected?.mock_drill_observations?.mock_drill_observation_members) {
          tempMember = MockDrillStore.selected.mock_drill_observations.mock_drill_observation_members.filter(x => x.user != null).map(x => x.user);
          MockDrillStore.selected.mock_drill_observations.mock_drill_observation_members.forEach(element => {
            var team = { mock_drill_observation_member_id: element.id, user_id: element.user == null ? element.user_id : element.user.id, name: element.user != null ? element.user.first_name + " " + (element.user.last_name != null ? element.user.last_name : '') : element.name, designation: element.user != null ? element.user.designation.title : element.designation, role: element.user == null ? element.role : element.user.role };
            this.mock_drill_observation_members.push(team);
          });
          if (this.mock_drill_observation_members.length > 0)
            this.observationId = this.mock_drill_observation_members[0].mock_drill_observation_id;
        }
        if (MockDrillStore.selected.mock_drill_observations)
          this.observationId = MockDrillStore.selected.mock_drill_observations.id;
        this.short_comings_drill = MockDrillStore.selected.mock_drill_observations?.short_comings_of_the_drill == 1 ? true : false;
        this.startTime = MockDrillStore.selected.start_time;
        this.endTime = MockDrillStore.selected.end_time;
        this.regForm.patchValue({
          infoId: MockDrillStore.selected.id,
          venue: MockDrillStore.selected?.mock_drill_plan?.mock_drill_type?.type + ' - ' + MockDrillStore.selected?.mock_drill_plan?.venue,
          mock_drill_plan_id: MockDrillStore.selected.mock_drill_plan.id,
          incident_controller_id: MockDrillStore.selected.incident_controller,
          mock_drill_scenario_id: MockDrillStore.selected?.scenario?.id,
          actual_date: this._helperService.processDate(MockDrillStore.selected.actual_date, 'split'),// { year: new Date(date).getFullYear(), month: new Date(date).getMonth(), day: new Date(date).getDay() },
          start_time: this.editTime(MockDrillStore.selected.start_time),
          end_time: this.editTime(MockDrillStore.selected.end_time),
          premises: MockDrillStore.selected.no_of_premises,
          participants: MockDrillStore.selected.no_of_participants,
          participant: userData,
          observation_id: this.observationId,
          mock_drill_observation_members: tempMember,
          // head_count: MockDrillStore.selected.mock_drill_observations?.head_count,
          observation: MockDrillStore.selected.mock_drill_observations?.observation,
          short_comings_of_the_drill: MockDrillStore.selected.mock_drill_observations?.short_comings_of_the_drill == 1 ? true : false,
          description: MockDrillStore.selected.mock_drill_observations?.description,
          // action: MockDrillStore.selected.mock_drill_observations?.action,
          effectiveness_remark: MockDrillStore.selected.mock_drill_observations?.effectiveness_remark,
          // approver_id: MockDrillStore.selected.mock_drill_observations?.approver,
        })
      }, 1000);
    });
  }
  editTime(val) {
    var time = this._helperService.convertTo24Hour(val.split(" ")[0], val.split(" ")[1]);
    if (time.length > 5) time = time.substring(1, 6) + ":00";
    return this._helperService.formatTimer(time);
  }
  // For Find Mock Drill Type
  getMockDrillType(val) {
    var value: any = MockDrillPlanStore.allItems;
    value = value.filter(x => x.id == val)[0];
    this.regForm.patchValue({
      actual_date: this._helperService.processDate(value.date, 'split'),
      venue: value.mock_drill_type + ' - ' + value.venue
    });
    this.isMockDrillFire = value.mock_drill_type_id != 2 ? true : false;
    this._utilityService.detectChanges(this._cdr)
    this.setDefaultObject();
  }
  // Get Scenario
  getMockDrillScenario() {
    this._mockDrillScenarioService.getItems(false, null, true).subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  getMockDrillShortComing() {
    var val = this.regForm.value.short_comings_of_the_drill == true || this.regForm.value.short_comings_of_the_drill == "true" ? true : false;
    return val;
  }
  setDefaultObject() {
    if (!this.isMockDrillFire)
      this.formObject = {
        0: [
          'mock_drill_plan_id',
          'incident_controller_id',
          'actual_date',
          'start_time',
          'end_time',
          'premises',
          'participants'
        ],
        1: [
          'participant'
        ],
        2: [
          'mock_drill_observation_members',
          // 'head_count',
          'observation',
          'short_comings_of_the_drill',
          'description',
          // 'action',
          'effectiveness_remark',
          // 'approver_id'
        ],
        3: []
      }
    if (this.isMockDrillFire)
      this.formObject = {
        0: [
          'mock_drill_plan_id',
          'incident_controller_id',
          'mock_drill_scenario_id',
          'actual_date',
          'start_time',
          'end_time',
          'premises',
          'participants'
        ],
        1: [],
        2: [
          'participant'
        ],
        3: [
          'mock_drill_observation_members',
          // 'head_count',
          'observation',
          'short_comings_of_the_drill',
          'description',
          // 'action',
          'effectiveness_remark',
          // 'approver_id'
        ],
        4: []
      }
  }
  cancelMockDirllForm(status) {
    $(this.confirmationPopup.nativeElement).modal('hide');
    if (status) {
      this._router.navigateByUrl('/mock-drill/mock-drills');
    }
  }
  // Get Selected User For Participants
  selectTeam(val: any, isRemove: boolean) {
    if (MockDrillStore.participants == undefined || MockDrillStore.participants == null) MockDrillStore.participants = [];
    if (isRemove) this.removeSeclectedUser(val.value, true);
    if (!isRemove && val.length > 0) {
      if (MockDrillStore.participants.length == 0) this.getSeclectedUser(val[0]);
      else
        val.forEach(element => {
          var data = MockDrillStore.participants.filter(x => x.user_id == element.id);
          if (data.length == 0) this.getSeclectedUser(element);
          else if (data[0]?.is_delete) data[0].is_delete = false;
        });
    }
    // $(this.tblParticipants.nativeElement).mCustomScrollbar();
  }

  getSeclectedUser(val: any) {
    // if (MockDrillStore.participants != undefined && MockDrillStore.participants.filter(x => x.user_id == val.id).length > 0)
    //   this.removeSeclectedUser(val);
    // else {
    if (MockDrillStore.participants == undefined || MockDrillStore.participants == null) MockDrillStore.participants = [];
    if (this.participantId == undefined || this.participantId == 0) {
      var team = { user_id: val.id, name: val.first_name + " " + (val.last_name != null ? val.last_name : ''), designation: val.designation_title, evacuation_time: '', image_token: val.image_token, is_delete: false, is_new: false, participant_id: 0, is_exist: true };
      MockDrillStore.participants.push(team);
    }
    else {
      var team1 = { is_new: true, user_id: val.id, name: val.first_name + " " + (val.last_name != null ? val.last_name : ''), designation: val.designation_title, evacuation_time: '', image_token: val.image_token, is_delete: false, participant_id: 0, is_exist: true };
      MockDrillStore.participants.push(team1);
    }
    // }
  }

  removeSeclectedUser(val: any, isExistUser: boolean) {
    var tempVal = MockDrillStore.participants.filter(x => x.user_id == val.id)[0];
    if (!isExistUser)
      tempVal = MockDrillStore.participants.filter(x => x.is_exist == false && x.name.toLowerCase().trim() == val.name.toLowerCase().trim() && x.designation.toLowerCase().trim() == val.designation.toLowerCase().trim())[0];

    if (tempVal != undefined && tempVal.participant_id != null && tempVal.participant_id != 0) {
      if (isExistUser)
        MockDrillStore.participants.filter(x => x.user_id == val.id)[0].is_delete = true;
      else
        MockDrillStore.participants.filter(x => x.name == val.name && x.is_exist == false)[0].is_delete = true;
    }
    else {
      var existuser = []; var otheruser = [];
      existuser = MockDrillStore.participants.filter(x => x.is_exist == true);
      var index1 = existuser.map(x => { return x.user_id; }).indexOf(val.id);
      if (index1 >= 0)
        existuser.splice(index1, 1);
      otheruser = MockDrillStore.participants.filter(x => x.is_exist == false);
      var index2 = otheruser.map(x => { return x.name; }).indexOf(val.name);
      if (index2 >= 0)
        otheruser.splice(index2, 1);
      MockDrillStore.participants = existuser;
      if (MockDrillStore.participants == undefined || MockDrillStore.participants == null) MockDrillStore.participants = [];
      otheruser.forEach(element => { MockDrillStore.participants.push(element) });
    }
  }

  // Get Mock Drill Observation Members

  // Get Selected User For Participants
  selectObservationMember(val: any, isRemove: boolean) {
    if (this.mock_drill_observation_members == undefined || this.mock_drill_observation_members == null) this.mock_drill_observation_members = [];
    if (isRemove) this.removeObservationMembers(val.value);
    else
      if (!isRemove && val.length > 0) {
        if (this.mock_drill_observation_members.length == 0) this.getObservationMembers(val[0]);
        else
          val.forEach(element => {
            var data = this.mock_drill_observation_members.filter(x => x.user_id == element.id);
            if (data.length == 0)
              this.getObservationMembers(element);
            else if (data[0]?.is_delete)
              data[0].is_delete = false;
          });
      }
    // this.getHeadCount();
  }
  getObservationMembers(val: any) {
    if (this.mock_drill_observation_members == undefined || this.mock_drill_observation_members == null) this.mock_drill_observation_members = [];
    if (this.observationId == undefined || this.observationId == 0) {
      var team = { user_id: val.id, name: val.first_name + " " + (val.last_name != null ? val.last_name : ''), designation: val.designation_title, role: val.roles };
      this.mock_drill_observation_members.push(team);
    }
    else {
      var team1 = { is_new: true, user_id: val.id, name: val.first_name + " " + (val.last_name != null ? val.last_name : ''), designation: val.designation_title, role: val.roles };
      this.mock_drill_observation_members.push(team1);
    }
    // this.getHeadCount();
  }

  removeObservationMembers(val: any) {
    var tempVal = this.mock_drill_observation_members.filter(x => x.user_id == val.id)[0];
    if (tempVal != undefined && tempVal.mock_drill_observation_member_id != null) {
      this.mock_drill_observation_members.filter(x => x.user_id == val.id)[0].is_delete = true;
    }
    else {
      var index1 = this.mock_drill_observation_members.map(x => { return x.user_id; }).indexOf(val.id);
      this.mock_drill_observation_members.splice(index1, 1);
    }
    // this.getHeadCount();
  }

  filterExistUser(val) {
    if (MockDrillStore.participants)
      return MockDrillStore.participants.filter(x => x.is_exist == val && !(x.is_delete));
    else
      return [];
  }

  cancelClicked() {
    $(this.confirmationPopup.nativeElement).modal('show');
  }

  startForm() {
    this.showTab(this.currentTab, 0);
    this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    window.addEventListener('scroll', this.scrollEvent, true);
    //Function Call to Get All Initial Data
    // this.getAllData();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  /**
 * Scroll Event Handler
 */
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
      }
    }
  }

  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }
  }

  checkFormObject(tabNumber?: number) {
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {
        for (let i of this.formObject[this.currentTab]) {
          if (!this.regForm.controls[i].valid) {
            setValid = false;
            break;
          }
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
          for (let k of this.formObject[i]) {
            if (!this.regForm.controls[k].valid) {
              setValid = false;
              break;
            }
          }
        }
      }
    }
    if (setValid && this.currentTab == (!this.isMockDrillFire ? 1 : 2) && MockDrillStore.participants != undefined)
      for (var i = 0; i < MockDrillStore.participants.length; i++) {
        if (MockDrillStore.participants[i].designation == undefined || MockDrillStore.participants[i].designation.trim() == "") setValid = false;
        // if (MockDrillStore.participants[i].evacuation_time == undefined || MockDrillStore.participants[i].evacuation_time == 0) setValid = false;
        if (!setValid) break;
      }
    if (setValid && this.regForm.value.start_time && this.regForm.value.end_time) {
      var date1: any = new Date();
      var date2: any = new Date();
      date1.setHours(!this.regForm.value.start_time.hour ? 0 : this.regForm.value.start_time.hour);
      date1.setMinutes(!this.regForm.value.start_time.minute ? 0 : this.regForm.value.start_time.minute);
      date1.setSeconds(0);
      date2.setHours(!this.regForm.value.end_time.hour ? 0 : this.regForm.value.end_time.hour);
      date2.setMinutes(!this.regForm.value.end_time.minute ? 0 : this.regForm.value.end_time.minute);
      date2.setSeconds(0);
      setValid = date1 <= date2 ? true : false;
    }
    return setValid;
  }

  // Next And Previous Navigation
  nextPrev(n) {
    setTimeout(() => {
      // This function will figure out which tab to display
      var x: any = document.getElementsByClassName("tab");
      // Exit the function if any field in the current tab is invalid:
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
      // Hide the current tab:
      x[this.currentTab].style.display = "none";
      // Increase or decrease the current tab by 1:
      // if (!OrganizationModulesStore.checkOrganizationModules(600)) {
      //   if (this.currentTab == 1) {
      //     if (n == 1) this.currentTab = this.currentTab + n * 2;
      //     else this.currentTab = this.currentTab + n;
      //   }
      //   else if (this.currentTab == 3) {
      //     if (n == -1) this.currentTab = this.currentTab + n * 2;
      //     else this.currentTab = this.currentTab + n;
      //   }
      //   else this.currentTab = this.currentTab + n;
      // }
      // else
      this.currentTab = this.currentTab + n;
      if (this.currentTab >= x.length) {
        this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
        x[this.currentTab].style.display = "block";
        return false;
      }
      // Otherwise, display the correct tab:
      this.showTab(this.currentTab, n);
    }, 100);
  }

  showTab(n, prev) {
    if (n == 5 && prev == 1) {
      // if (document.getElementById("saveNext"))
      //   document.getElementById("nextBtn").style.display = "none";
      if (document.getElementById("saveNext")) this.nextButtonText = "Save";

    } else {
      document.getElementById("nextBtn").style.display = "inline-block";
      if (document.getElementById("saveNext")) this.nextButtonText = "Save & Next";
      if (n == 1 && prev == 1)
        this.saveInfo();
      if (this.isMockDrillFire && n == 2 && prev == 1) {
        this.saveChecks();
      }
      if ((!this.isMockDrillFire && n == 2 && prev == 1) || (this.isMockDrillFire && n == 3 && prev == 1)) {
        this.saveParticipants()
      }
      if ((!this.isMockDrillFire && n == 3 && prev == 1) || (this.isMockDrillFire && n == 4 && prev == 1))
        this.saveobservation();
      if ((!this.isMockDrillFire && n == 4 && prev == 1) || (this.isMockDrillFire && n == 5 && prev == 1)) {
        MockDrillChecksMasterStore.response_service_check_id = MockDrillResponseServiceMasterStore.allItems[MockDrillResponseServiceMasterStore.allItems.length - 1].id;
        this.getFiltedResponseServiceChecks();
        this.setClass(MockDrillChecksMasterStore.response_service_check_id);
      }
      //... and run a function that will display the correct step indicator:
      this._utilityService.scrollToTop();
      this.fixStepIndicator(n);
    }
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
  }

  saveTabDetails() {
    if (this.currentTab == 0) {
      this.saveInfo();
    }
    if (this.isMockDrillFire && this.currentTab == 1) {
      this.saveChecks();
    }
    if ((!this.isMockDrillFire && this.currentTab == 1) || (this.isMockDrillFire && this.currentTab == 2)) {
      this.saveParticipants()
    }
    if ((!this.isMockDrillFire && this.currentTab == 2) || (this.isMockDrillFire && this.currentTab == 3)) {
      this.saveobservation();
    }
    if ((!this.isMockDrillFire && this.currentTab == 3) || (this.isMockDrillFire && this.currentTab == 4)) {
      MockDrillStore.mock_drill_id = this.infoId;
      this._router.navigateByUrl('mock-drill/mock-drills/' + this.infoId);
    }
  }

  validateForm() {
    // This function deals with validation of the form fields
    var x: any, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  setInitialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (var i = 0; i < x.length; i++) {
      if (!MockDrillStore.mockDrillSettings?.is_info) {
        if (i == 1) x[i].style.display = "block";
        else x[i].style.display = "none";
      } else {
        if (i == 0) x[i].style.display = "block";
        else x[i].style.display = "none";
      }
    }
  }

  /**
 * Search for users
 * @param e e.term - character to search
 */
  searchUsers(e) {
    var params = '';
    this._usersService.searchUsers('?q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchPlan(e) {
    var params = '';
    this._mockDrillPlanService.searchPlans('?q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchScenario(e) {
    var params = '';
    this._mockDrillScenarioService.searchScenario('?q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // Get all users
  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  /**
 * Returns image preview
 * @param type Type of image
 * @param token Image token
 */
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  // Get Mock Drill Plan
  getMockDrillPlan() {
    var params = "&used_plan_id=true";
    this._mockDrillPlanService.getItems(false, params, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        this.setClass(MockDrillResponseServiceMasterStore.allItems[0]?.id);
      }, 100);
    })
  }

  setClass(dataId) {
    if (MockDrillStore.responseServiceId == dataId) {
      MockDrillStore.responseServiceId == null
    }
    else
      MockDrillStore.responseServiceId = dataId
    this._utilityService.detectChanges(this._cdr)
  }

  // Get Mock Drill REsponse Service
  getMOckDrillResponseService() {
    var params = '';
    MockDrillStore.responseServiceChecks = []
    this._mockDrillResponseService.getItems(false, params, true).subscribe(res => {
      setTimeout(() => {
        MockDrillResponseServiceMasterStore.allItems.forEach(element => {
          this.getResponseServiceChecks(element.id);
        });
      }, 500);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Get Response Service Checks (QA)
  getResponseServiceChecks(id) {
    MockDrillChecksMasterStore.response_service_check_id = id;
    this._mockDrillChecksService.getItems(false, null, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      MockDrillChecksMasterStore.allItems.forEach(element => {
        var checkId = 0;
        var tempData = null;
        if (MockDrillStore.selected?.mock_drill_checks) {
          var tempData = MockDrillStore.selected.mock_drill_checks.filter(x => x.mock_drill_response_service_check_id == element.id);
          if (tempData && tempData.length > 0) checkId = tempData[0].id;
        }
        var data = {
          mock_drill_response_service_check_id: checkId, mock_drill_check_id: element.id, service_id: element.mock_drill_response_service_id, question: element.question, answer: (tempData != null && checkId != 0) ? tempData[0].answer : ''
        }
        MockDrillStore.responseServiceChecks.push(data);

      });
      this.checksId = MockDrillStore.selected?.mock_drill_checks[0]?.id;
      this.setResponsesServiceChecks(MockDrillResponseServiceMasterStore.allItems[0].id);
    })
  }

  //setting task phase id and type when opening form
  setResponsesServiceChecks(id) {
    MockDrillStore.responseServiceId = id
    MockDrillChecksMasterStore.response_service_check_id = id;
    this.getFiltedResponseServiceChecks();
  }

  getFiltedResponseServiceChecks() {
    this.tempServiceChecks = MockDrillStore.responseServiceChecks.filter(x => x.service_id == MockDrillChecksMasterStore.response_service_check_id);
    this._utilityService.detectChanges(this._cdr)
  }

  // Save or  Update Mock Drill Info
  getSaveDataInfo() {
    var date: any = this.regForm.value.actual_date;
    this.saveData = {
      mock_drill_plan_id: this.regForm.value.mock_drill_plan_id,
      incident_controller_id: this.regForm.value.incident_controller_id.id,
      actual_date: this._helperService.passSaveFormatDate(new Date(date.year, date.month, date.day)).substring(0, 10),
      start_time: this.convertTime(this._helperService.passSaveFormatDate(new Date(date.year, date.month, date.day)).substring(0, 10), this.regForm.value.start_time),
      end_time: this.convertTime(this._helperService.passSaveFormatDate(new Date(date.year, date.month, date.day)).substring(0, 10), this.regForm.value.end_time),
      premises: this.regForm.value.premises,
      participants: this.regForm.value.participants,
    }
    if (!this.isMockDrillFire && this.regForm.value.mock_drill_scenario_id != null)
      this.saveData.mock_drill_scenario_id = this.regForm.value.mock_drill_scenario_id;
    this.startTime = (new Date(this.saveData.actual_date + ' ' + this.saveData.start_time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    this.endTime = (new Date(this.saveData.actual_date + ' ' + this.saveData.end_time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
  convertTime(date, output) {
    let outputDate = new Date(date);
    outputDate.setHours(output.hour);
    outputDate.setMinutes(output.minute);
    // outputDate.setSeconds(output.second);
    return this._helperService.passSaveFormatDate(outputDate).substring(11, 20);
  }

  saveInfo() {
    if (this.regForm.value) {
      this.formErrors = null;
      let save;
      this.regForm.value.infoId = this.infoId;
      this.getSaveDataInfo();
      AppStore.enableLoading();
      if (this.regForm.value.infoId) {
        save = this._mockDrillService.updateMockDrillInfo(this.regForm.value.infoId, this.saveData);
      } else {
        save = this._mockDrillService.saveMockDrillInfo(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.regForm.value.infoId = res.id;
          this.infoId = res.id;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  // Save or  Update Mock Drill Response Service
  getSaveDataChecks() {
    var tempData: any = [];
    if (this.checksId)
      MockDrillStore.responseServiceChecks.forEach(ele => {
        if (ele.mock_drill_response_service_check_id == 0 && (ele.answer == null || ele.answer == '')) {
        }
        else {
          var val: any = { mock_drill_check_id: ele.mock_drill_response_service_check_id, answer: ele.answer == null ? '' : ele.answer }
          if (val.mock_drill_check_id == 0 && val.answer.trim() != "")
            val = { is_new: true, mock_drill_response_service_check_id: ele.mock_drill_check_id, answer: ele.answer == null ? '' : ele.answer }
          tempData.push(val);
        }
      })
    else
      MockDrillStore.responseServiceChecks.forEach(ele => {
        var val = { mock_drill_response_service_check_id: ele.mock_drill_check_id, answer: ele.answer == null ? '' : ele.answer }
        tempData.push(val);
      })
    this.saveData = { mock_drill_checks: tempData }
  }
  saveChecks() {
    if (this.regForm.value) {
      this.formErrors = null;
      let save;
      this.regForm.value.infoId = this.infoId;
      this.regForm.value.checksId = this.checksId;
      this.getSaveDataChecks();
      AppStore.enableLoading();
      if (this.regForm.value.checksId) {
        save = this._mockDrillService.updateMockDrillChecks(this.regForm.value.infoId, this.regForm.value.checksId, this.saveData);
      } else {
        save = this._mockDrillService.saveMockDrillChecks(this.regForm.value.infoId, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.regForm.value.checksId = res.id;
          this.checksId = res.id;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          this._mockDrillService.getMockDrillChecks(this.regForm.value.infoId).subscribe(res => {
            setTimeout(() => {
              if (res) {
                MockDrillStore.responseServiceChecks.forEach(element => {
                  var value = res.filter(x => x.mock_drill_response_service_check_id == element.mock_drill_check_id);
                  if (value && value.length > 0)
                    element.mock_drill_response_service_check_id = value[0].id;
                });
                this.checksId = res[0]?.id;
              }
            }, 500);
          });
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  // Save or Update Mock Drill Observation
  getSaveDataObservation() {
    var tempMembers: any = [];
    // if (this.observationId) {
    //   this.mock_drill_observation_members.forEach(element => {
    //     if (element.is_new) {
    //       var val = { is_new: true, user_id: element.user_id, name: element.name, designation: element.designation, role: element.role };
    //       tempMembers.push(val);
    //     }
    //     else {
    //       element.mock_drill_observation_member_id = element.mock_drill_observation_member_id;
    //       tempMembers.push(element);
    //     }
    //   });
    // }
    // else
    //   this.mock_drill_observation_members.forEach(element => { tempMembers.push(element); });
    this.saveData = {
      // head_count: this.regForm.value.head_count,
      // mock_drill_observation_members: this.mock_drill_observation_members,
      observation: this.regForm.value.observation,
      short_comings_of_the_drill: this.regForm.value.short_comings_of_the_drill == "true",
      description: this.regForm.value.short_comings_of_the_drill == "true" ? this.regForm.value.description : '',
      // action: this.regForm.value.short_comings_of_the_drill == "true" ? this.regForm.value.action : '',
      effectiveness_remark: this.regForm.value.short_comings_of_the_drill != "true" ? this.regForm.value.effectiveness_remark : '',
      // approver_id: this.regForm.value.approver_id.id
    }
  }
  getHeadCount() {
    var val = this.mock_drill_observation_members.filter(x => !x?.is_delete).length;
    // this.regForm.patchValue({ head_count: val })
  }
  saveobservation() {
    if (this.regForm.value) {
      this.formErrors = null;
      let save;
      this.regForm.value.infoId = this.infoId;
      this.regForm.value.observation_id = this.observationId;
      this.getSaveDataObservation();
      AppStore.enableLoading();
      if (this.regForm.value.observation_id) {
        save = this._mockDrillService.updateMockDrillObservation(this.regForm.value.infoId, this.regForm.value.observation_id, this.saveData);
      } else {
        save = this._mockDrillService.saveMockDrillObservation(this.regForm.value.infoId, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.regForm.value.observation_id = res.id;
          this.observationId = res.id;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          this._mockDrillService.getMockDrillObservation(this.regForm.value.infoId, this.regForm.value.observation_id).subscribe(res => {
            this.mock_drill_observation_members = [];
            setTimeout(() => {
              MockDrillStore.observation.forEach(element => {
                var team = { mock_drill_observation_member_id: element.id, user_id: element.user == null ? element.user_id : element.user.id, name: element.user != null ? element.user.first_name + " " + (element.user.last_name != null ? element.user.last_name : '') : element.name, designation: element.user != null ? element.user.designation.title : element.designation, role: element.user == null ? element.role : element.user.role };
                this.mock_drill_observation_members.push(team)
              });
            }, 100);
            this._utilityService.detectChanges(this._cdr);
          })
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  // Save or Update Mock Drill Participants
  getSaveDataParticipants() {
    var tempParticipant: any = [];
    if (this.participantId) {
      MockDrillStore.participants.forEach(element => {
        if (element.is_new) {
          var val = { is_new: true, user_id: element.user_id, name: element.name, designation: element.designation, evacuation_time: element.evacuation_time };
          tempParticipant.push(val);
        }
        else {
          // element.participant_id = this.participantId;
          if (element.is_delete) {
            var val1 = { participant_id: parseInt(element.participant_id.toString()), is_delete: true, user_id: element.user_id, name: element.name, designation: element.designation, evacuation_time: element.evacuation_time };
            tempParticipant.push(val1);
          }
          else {
            var val2 = { participant_id: parseInt(element.participant_id.toString()), user_id: element.user_id, name: element.name, designation: element.designation, evacuation_time: element.evacuation_time };
            tempParticipant.push(val2);
          }
        }
      });
    }
    else {
      MockDrillStore.participants.forEach(element => {
        var val = { participant_id: element.participant_id, user_id: element.user_id, name: element.name, designation: element.designation, evacuation_time: element.evacuation_time };
        tempParticipant.push(val);
      });
    }
    this.saveData = { mock_drill_participants: tempParticipant }
  }
  saveParticipants() {
    if (this.regForm.value) {
      this.formErrors = null;
      let save;
      this.regForm.value.infoId = this.infoId;
      this.regForm.value.participant_id = this.participantId;
      this.getSaveDataParticipants();
      AppStore.enableLoading();
      if (this.participantId) {
        save = this._mockDrillService.updateMockDrillParticipants(this.regForm.value.infoId, this.regForm.value.infoId, this.saveData);
      } else {
        save = this._mockDrillService.saveMockDrillParticipants(this.regForm.value.infoId, this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.regForm.value.participant_id = res.id;
          this.participantId = res.id;
          MockDrillStore.participants.forEach(element => { element.participant_id = res.id });
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          this._mockDrillService.getMockDrillParticipants(this.regForm.value.infoId).subscribe(res => {
            setTimeout(() => {
              if (res && res.length > 0) {
                MockDrillStore.participants = [];
                res.forEach(element => {
                  var val = { is_new: false, user_id: element.user_id, name: element.name == null ? element.first_name + ' ' + (element.last_name != null ? element.user.last_name : '') : element.name, designation: element.designation_title != null ? element.designation_title : element.designation, evacuation_time: element.evacuation_time, is_delete: false, is_exist: element.user_id != null, participant_id: element.id, image_token: element.image_token };
                  MockDrillStore.participants.push(val);
                });
              }
            }, 50);
            this._utilityService.detectChanges(this._cdr);
          })
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  resetForm() {
    this.regForm.reset();
    this.formErrors = null;
    this.infoId = null;
    this.checksId = null;
    this.observationId = null;
    MockDrillStore.participants = null;
    this.tempServiceChecks = [];
    MockDrillStore.responseServiceChecks = [];
    this.mock_drill_observation_members = [];
    this.short_comings_drill = false;
    this.isMockDrillFire = true;
    this.startTime = "";
    this.endTime = "";
  }

  getPopupDetails(user) {
    if (user) {
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name;
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation;
      userDetailObject['image_token'] = user.image_token;
      userDetailObject['email'] = user.email;
      userDetailObject['mobile'] = user.mobile;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = user.department ? user.department : null;
      userDetailObject['status_id'] = user.status.id ? user.status.id : 1;
      return userDetailObject;
    }
  }

  ngOnDestroy() {
    MockDrillPlanStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.addOtherUserSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    MockDrillStore.unsetMockDrillId();
    MockDrillStore.unsetIndividualMockDrill();
    MockDrillStore.unsetParticipantsUsers();
    MockDrillStore.unsetResponseServiceChecks();
    if (this.reactionDisposer) this.reactionDisposer();
    this.resetForm();
    SubMenuItemStore.makeEmpty();
  }
}
