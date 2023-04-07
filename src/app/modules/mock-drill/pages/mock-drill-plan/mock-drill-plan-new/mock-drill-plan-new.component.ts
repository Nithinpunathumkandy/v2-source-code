import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer, autorun, toJS, values } from 'mobx';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';
import { MockDrillTypesService } from 'src/app/core/services/masters/mock-drill/mock-drill-types/mock-drill-types.service';
import { MockDrillTypesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-types-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MockDrillPlanStore } from 'src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store';
import { HttpErrorResponse } from '@angular/common/http';
import { MockDrillPlanService } from 'src/app/core/services/mock-drill/mock-drill-plan/mock-drill-plan.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillEvacuationRoleService } from 'src/app/core/services/masters/mock-drill/mock-drill-evacuation-role/mock-drill-evacuation-role.service';
import { MockDrillEvacuationRoleMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-evacuation-role-store';
import { DatePipe } from '@angular/common';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
declare var $: any;
@Component({
  selector: 'app-mock-drill-plan-new',
  templateUrl: './mock-drill-plan-new.component.html',
  styleUrls: ['./mock-drill-plan-new.component.scss']
})
export class MockDrillPlanNewComponent implements OnInit {


  reactionDisposer: IReactionDisposer;
  UsersStore = UsersStore;
  AppStore = AppStore;
  MockDrillTypesMasterStore = MockDrillTypesMasterStore;
  MockDrillEvacuationRoleMasterStore = MockDrillEvacuationRoleMasterStore;
  MockDrillPlanStore = MockDrillPlanStore;
  MockDrillProgramStore = MockDrillProgramStore;
  evacuation_team: any[] = [];
  stake_holders: any[] = [];
  mockDrillInfo: any;
  mockDrillObservation: any;
  mockDrillChecks: any;
  formErrors = null;
  form: FormGroup;
  saveData: any = null;
  userList: any;
  confirmationEventSubscription: any;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'common_cancel_subtitle',
    type: 'Cancel'
  };
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  constructor(
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _usersService: UsersService,
    private _helperService: HelperServiceService,
    private _mockDrillTypeService: MockDrillTypesService,
    private _imageService: ImageServiceService,
    private _mockDrillPlanService: MockDrillPlanService,
    private _mockDrillEvacuationRoleService: MockDrillEvacuationRoleService,
    private _eventEmitterService: EventEmitterService,
    public datepipe: DatePipe,
    private _router: Router,
    private _mockDrillProgramService: MockDrillProgramService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: '/mock-drill/mock-drill-plans' }]);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.getMOckDrillType();
    this.getEvacuationRoleService();
    this.getPreplanList();
    this.getUsers();
    // Form Builder
    this.form = this._formBuilder.group({
      id: null,
      preplan: null,
      // mock_drill_type_id: [null, [Validators.required]],
      preplan_id: [null, [Validators.required]],
      leader_id: [null, [Validators.required]],
      date: [null, [Validators.required]],
      venue: [null, [Validators.required]],
      evacuation_teams: null,
      stake_holders: null,
      title: null,
      communication: null,
    })
    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => { this.cancelMockDirllForm(item); })
    if (MockDrillPlanStore.mock_drill_plan_id != undefined && MockDrillPlanStore.mock_drill_plan_id != null && MockDrillPlanStore.mock_drill_plan_id != 0)
      this.setDataForEdit();
    else {
      this._router.navigateByUrl('mock-drill/mock-drill-plans/new');
    }

  }

  mockdrillTypeChanged(id) {
    this.form.patchValue({ 'mock_drill_type_id': id });
    this._utilityService.detectChanges(this._cdr);
  }
  // Get Mock Drill Type
  getMOckDrillType() {
    var params = '';
    this._mockDrillTypeService.getItems(false, params, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // Get Mock Drill Evacuation Role
  getEvacuationRoleService() {
    this._mockDrillEvacuationRoleService.getItems(false, null).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  cancelMockDirllForm(status) {
    $(this.confirmationPopup.nativeElement).modal('hide');
    if (status) {
      this._router.navigateByUrl('/mock-drill/mock-drill-plans');
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
  searchRole(e) {
    var params = '';
    this._mockDrillEvacuationRoleService.searchRole('?q=' + e.term + params).subscribe(res => {
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
  cancelClicked() {
    $(this.confirmationPopup.nativeElement).modal('show');
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
  selectTeam(val: any, isRemove: boolean) {
    if (this.evacuation_team == undefined || this.evacuation_team == null) this.evacuation_team = [];
    if (isRemove) this.removeSeclectedUser(val.value);
    if (!isRemove && val.length > 0) {
      if (this.evacuation_team.length == 0) this.getSeclectedUser(val[0]);
      else
        val.forEach(element => {
          var data = this.evacuation_team.filter(x => x.user_id == element.id);
          if (data.length == 0) this.getSeclectedUser(element);
          else if (data[0]?.is_delete) data[0].is_delete = false;
        });
    }
  }
  // Get Selected User
  getSeclectedUser(val: any) {
    if (MockDrillPlanStore.mock_drill_plan_id == undefined || MockDrillPlanStore.mock_drill_plan_id == 0) {
      var team = { user_id: val.id, mock_drill_evacuation_role_id: null, floor: null, resposibility: '', user: val };
      this.evacuation_team.push(team);
    }
    else {
      var team1 = { is_new: true, user_id: val.id, mock_drill_evacuation_role_id: null, floor: null, resposibility: '', user: val };
      this.evacuation_team.push(team1);
    }
  }

  removeSeclectedUser(val: any) {
    var tempVal = this.evacuation_team.filter(x => x.user_id == val.id)[0];
    if (tempVal != undefined && tempVal.mock_drill_plan_user_id != null) {
      this.evacuation_team.filter(x => x.user_id == val.id)[0].is_delete = true;
    }
    else {
      var index1 = this.evacuation_team.map(x => { return x.user_id; }).indexOf(val.id);
      this.evacuation_team.splice(index1, 1);
    }
  }
  filteredTeam() {
    return this.evacuation_team.filter(x => !x?.is_delete);
  }
  validateStakeholder() {
    return this.form.value.title != null && this.form.value.title != '' && this.form.value.communication != null && this.form.value.communication != '' ? true : false;
  }
  // Patch User Details
  getPopupDetails(user: any) {
    if (user) {
      let userDetailObject: any = {};
      userDetailObject['first_name'] = user.first_name;
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user?.designation?.title ? user.designation.title : user.designation_title;
      userDetailObject['image_token'] = user.image?.token;
      userDetailObject['email'] = user?.email;
      userDetailObject['mobile'] = user?.mobile;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = user.department ? user.department : null;
      userDetailObject['status_id'] = user.status?.id ? user.status?.id : 1;
      return userDetailObject;
    }
  }
  addStakeHolder() {
    var val = this.stake_holders.filter(x => x.title.toLowerCase().trim() == this.form.value.title.toLowerCase().trim() && x.communication.toLowerCase().trim() == this.form.value.communication.toLowerCase().trim())
    if (val != null && val.length > 0) {
      this._utilityService.showWarningMessage('Warning', "Already Exist!")
      return;
    }
    var tempHolder;
    if (!MockDrillPlanStore.mock_drill_plan_id) tempHolder = { title: this.form.value.title, communication: this.form.value.communication }
    else {
      tempHolder = { is_new: true, title: this.form.value.title, communication: this.form.value.communication }
    }
    if (!this.stake_holders) this.stake_holders = [];
    this.stake_holders.push(tempHolder);
    this.form.patchValue({ title: '', communication: "" });
  }
  deleteStakeHolder(val, idx) {
    if (val?.mock_drill_stakeholder_id) {
      this.stake_holders.filter(x => x.mock_drill_stakeholder_id == val.mock_drill_stakeholder_id)[0].is_delete = true;
    }
    else {
      this.stake_holders.filter(x => x.title.toLowerCase().trim() == val.title.toLowerCase().trim() && x.communication.toLowerCase().trim() == val.communication.toLowerCase().trim() && !x?.mock_drill_stakeholder_id)[0].is_delete = true;
      this.stake_holders = this.stake_holders.filter(x => !x?.is_new && !x?.is_delete);
      console.log(this.stake_holders)
    }
  }
  filteredStakeHolder() {
    return this.stake_holders.filter(x => !x?.isDelete);
  }
  getSaveData() {
    this.saveData = {
      mock_drill_program_pre_plan_id: this.form.value.preplan_id.id,
      // mock_drill_type_id: this.form.value.mock_drill_type_id,
      leader_id: this.form.value.leader_id.id,
      date: this._helperService.passSaveFormatDate(this._helperService.processDate(this.form.value.date, 'join')),// this.datepipe.transform(, 'yyyy-MM-dd hh:mm:ss'),
      venue: this.form.value.venue,// $("#planVenue").val(),
      evacuation_teams: this.evacuation_team,
      stakeholders: this.stake_holders,
    }
  }
  save(isClose) {
    if (this.form.value) {
      this.formErrors = null;
      let save;
      AppStore.enableLoading();
      this.getSaveData();
      if (MockDrillPlanStore.mock_drill_plan_id) {
        save = this._mockDrillPlanService.updateItem(MockDrillPlanStore.mock_drill_plan_id, this.saveData);
      } else {
        save = this._mockDrillPlanService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (isClose) {
            this.resetForm();
            this.mockDrillDetails(res.id);
          }
          else if (MockDrillPlanStore.mock_drill_plan_id == null || MockDrillPlanStore.mock_drill_plan_id == undefined || MockDrillPlanStore.mock_drill_plan_id == 0) {
            this.resetForm();
          }
          else {
            this._mockDrillPlanService.getItem(MockDrillPlanStore.mock_drill_plan_id).subscribe(res => {
              setTimeout(() => {
                this.setDataForEdit();
                this._utilityService.detectChanges(this._cdr);
              }, 100);
            });
          }
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
  mockDrillDetails(id) {
    MockDrillPlanStore.setMockDrillPlanId(id);
    setTimeout(() => { this._router.navigateByUrl('mock-drill/mock-drill-plans/' + id); }, 500);
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.evacuation_team = [];
    this.stake_holders = [];
  }

  // Set Data For Edit
  setDataForEdit() {
    setTimeout(() => {
      var mockDrillPlanDetails: any = MockDrillPlanStore.selectedPlan;
      this.patchEvacuationTeam(toJS(mockDrillPlanDetails.mock_drill_plan_users));
      this.form.patchValue({
        // mock_drill_type_id: mockDrillPlanDetails.mock_drill_type.id,
        preplan_id: mockDrillPlanDetails.mock_drill_program_preplan,
        date: new Date(mockDrillPlanDetails.date),// { year: new Date(mockDrillPlanDetails.date.substring(0, 10)).getFullYear(), month: new Date(mockDrillPlanDetails.date.substring(0, 10)).getMonth(), day: new Date(mockDrillPlanDetails.date.substring(0, 10)).getDay() },
        venue: mockDrillPlanDetails.venue,
        leader_id: mockDrillPlanDetails.team_lead,
        evacuation_teams: this.userList ? this.getEditValue(this.userList) : [],
        stake_holders: this.getStakeHolders(MockDrillPlanStore.selectedPlan.mock_drill_stakeholders)
      });
      this._utilityService.detectChanges(this._cdr);
    }, 300);
  }
  getStakeHolders(data) {
    this.stake_holders = [];
    data.forEach(element => {
      this.stake_holders.push({ mock_drill_stakeholder_id: element.id, title: element.title, communication: element.communication })
    });
    return this.stake_holders;
  }
  // Returns Values as Array
  getEditValue(field) {
    var returnValue = [];
    for (let i of field) {
      returnValue.push(i);
    }
    return returnValue;
  }

  // Patch Evacuation Team Members
  patchEvacuationTeam(val: any) {
    this.evacuation_team = [];
    var user = [];
    if (val && val.length > 0)
      val.forEach(element => {
        var team = { mock_drill_plan_user_id: element?.id, user_id: element?.user?.id, mock_drill_evacuation_role_id: element?.mock_drill_evacuation_role_id, floor: element?.floor, resposibility: element?.resposibility, user: element?.user };
        this.evacuation_team.push(team);
        user.push(element.user);
      });
    this.userList = user;
    return user;
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  // Get Mock Drill Preplan List
  getPreplanList() {
    MockDrillProgramStore.unsetPreplan();
    this._mockDrillProgramService.getPreplanList().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // Search Mock Drill Type
  searchPreplan(e) {
    this._mockDrillProgramService.getPreplanList(false, '&q=' + e.term, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  ngOnDestroy() {
    MockDrillPlanStore.unsetMockDrillPlanId();
    MockDrillPlanStore.unsetIndividualMockDrillPlan();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MockDrillPlanStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.confirmationEventSubscription.unsubscribe();
    this.resetForm();
  }
}
