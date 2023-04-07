import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillScopesService } from 'src/app/core/services/masters/mock-drill/mock-drill-scopes/mock-drill-scopes.service';
import { MockDrillTypesService } from 'src/app/core/services/masters/mock-drill/mock-drill-types/mock-drill-types.service';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { SitesMasterStore } from 'src/app/stores/masters/general/sites-store';
import { MockDrillScopesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-scopes-store';
import { MockDrillTypesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-types-store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
// import { SitesMasterStore } from 'src/app/stores/general/si';
declare var $: any;
@Component({
  selector: 'app-mock-drill-program-add',
  templateUrl: './mock-drill-program-add.component.html',
  styleUrls: ['./mock-drill-program-add.component.scss']
})
export class MockDrillProgramAddComponent implements OnInit {
  @ViewChild('confirmationPopup') confirmationPopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('locationFormModal') locationFormModal: ElementRef;
  @ViewChild('eventMappingModal') eventMappingModal: ElementRef;
  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('sitesMappingModal') sitesMappingModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  UsersStore = UsersStore;
  AppStore = AppStore;
  MockDrillProgramStore = MockDrillProgramStore;
  MockDrillScopesMasterStore = MockDrillScopesMasterStore;
  MockDrillTypesMasterStore = MockDrillTypesMasterStore;
  SitesMasterStore = SitesMasterStore;
  ProcessStore = ProcessStore;
  LocationMasterStore = LocationMasterStore;
  BusinessProjectsStore = BusinessProjectsStore;
  EventsStore = EventsStore;
  IssueListStore = IssueListStore;
  formErrors = null;
  form: FormGroup;
  confirmationEventSubscription: any;
  mockDrillTypeSubscriptionEvent: any;
  locationSelectSubscription: any;
  projectSelectSubscription: any
  eventMappingSubscription: any;
  siteMappingSubscription: any;
  ProcessSubscription: any
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  scopeSubscription: any;
  confirmationObject = { title: 'Cancel?', subtitle: 'common_cancel_subtitle', type: 'Cancel' };
  mockDrillTypeObject = { component: 'Master', values: null, type: null }
  modalObject = { component: ' mock_drills' }
  mockDrillTypeList: any;
  saveData: any;
  selectedScope: any;
  constructor(private _mockDrillProgramService: MockDrillProgramService, private _mockDrillScopesService: MockDrillScopesService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _mockDrillTypeService: MockDrillTypesService, private _formBuilder: FormBuilder, private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService, private _router: Router, private _renderer2: Renderer2) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: '/mock-drill/mock-drill-programs' }]);
    this.getMockDrillScopes();
    this.getMOckDrillType();
    this.resetForm();
    // Form Builder
    this.form = this._formBuilder.group({
      id: null,
      mock_drill_title: [null, [Validators.required]],
      mock_drill_scope: null,
      mock_drill_type: [],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
    });
    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => { this.cancelMockDrillForm(item); })
    // for closing the modal
    this.mockDrillTypeSubscriptionEvent = this._eventEmitterService.mockDrillTypeModel.subscribe(res => {
      this.closeFormModal();
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
      this.hidePopups();
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
      this.hidePopups();
    })
    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
      this.closeProjects();
    })

    this.locationSelectSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
      this.closeLocations();
    })
    this.siteMappingSubscription = this._eventEmitterService.siteMappingModal.subscribe(res => {
      this.closeSites();
    })
    this.eventMappingSubscription = this._eventEmitterService.eventMappingModal.subscribe(item => {
      this.closeEvents();
    })
    this.ProcessSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })
    if (MockDrillProgramStore.mock_drill_program_id && MockDrillProgramStore.selectedProgramData && MockDrillProgramStore.selectedProgramData.id) {
      setTimeout(() => {
        if (!this.mockDrillTypeList) this.mockDrillTypeList = [];
        function onlyUnique(value, index, self) { return self.indexOf(value) === index; }
        var data: any = MockDrillProgramStore.selectedProgramData.mock_drill_program_preplan.map(x => x.mock_drill_type.id).filter(onlyUnique);
        data.forEach(element => {
          this.mockDrillTypeList.push({ id: element, type: MockDrillProgramStore.selectedProgramData.mock_drill_program_preplan.filter(x => x.mock_drill_type.id == element)[0].mock_drill_type, nooftype: MockDrillProgramStore.selectedProgramData.mock_drill_program_preplan.filter(x => x.mock_drill_type.id == element).length })
        });
        LocationMasterStore.selectedLocationList = MockDrillProgramStore.selectedProgramData.locations;
        BusinessProjectsStore.selectedProjectList = MockDrillProgramStore.selectedProgramData.project;
        ProcessStore.selectedProcessesList = MockDrillProgramStore.selectedProgramData.process;
        EventsStore.selectedEventList = MockDrillProgramStore.selectedProgramData.event;
        this.form.patchValue({
          id: MockDrillProgramStore.mock_drill_program_id,
          mock_drill_title: MockDrillProgramStore.selectedProgramData.title,
          start_date: this._helperService.processDate(MockDrillProgramStore.selectedProgramData.start_date, 'split'),
          end_date: this._helperService.processDate(MockDrillProgramStore.selectedProgramData.end_date, 'split'),
          mock_drill_type: this.mockDrillTypeList.map(x => x.type.language[0].pivot.title)
        })
      }, 300);
    }
    else {
      this._router.navigateByUrl('/mock-drill/mock-drill-programs/add');
    }
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }
  hidePopups() {
    if ($(this.locationFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.locationFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.locationFormModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.projectFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.projectFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.projectFormModal.nativeElement, 'overflow', 'auto');
    } else if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    } else if ($(this.eventMappingModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.eventMappingModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.eventMappingModal.nativeElement, 'overflow', 'auto');
    }
  }

  // Get Mock Drill Scopes
  getMockDrillScopes() {
    MockDrillScopesMasterStore.setCurrentPage(1);
    this._mockDrillScopesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  openIssueProcessModal(type) {
    if (type == 'process') {
      this.selectProcesses();
    }
    else if (type == 'location') {
      this.selectLocations();
    }
    else if (type == 'project') {
      this.selectProjects();
    }
    else if (type == 'event') {
      this.selectEvents();
    }
    else if (type == 'site') {
      this.selectSites()
    }
  }
  selectScope(scope: string) {
    this.selectedScope = scope;
    this._utilityService.detectChanges(this._cdr);
  }
  // Opens Modal to Select Processes
  selectProcesses() {
    // this.selectedType="process";

    IssueListStore.processes_form_modal = true;
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }
  selectLocations() {
    // this.selectedType="issue";
    LocationMasterStore.location_select_form_modal = true;
    $(this.locationFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select issues
  closeLocations() {
    LocationMasterStore.location_select_form_modal = false;
    $(this.locationFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  selectSites() {
    SitesMasterStore.siteMappingModal = true;
    $(this.sitesMappingModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.sitesMappingModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeSites() {
    SitesMasterStore.siteMappingModal = false;
    $(this.sitesMappingModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.sitesMappingModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  //select modal for projects
  selectProjects() {
    BusinessProjectsStore.project_select_form_modal = true;
    //ProjectsStore.issue_select_form_modal = true;
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  //close modal for select projects
  closeProjects() {
    BusinessProjectsStore.project_select_form_modal = false
    $(this.projectFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  selectEvents() {
    EventsStore.eventMappingModal = true;
    $(this.eventMappingModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.eventMappingModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEvents() {
    EventsStore.eventMappingModal = false;
    $(this.eventMappingModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.eventMappingModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }


  // Close Modal to select processes
  closeProcesses() {
    IssueListStore.processes_form_modal = false;
    $(this.processFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  // Get Mock Drill Type
  getMOckDrillType() {
    this._mockDrillTypeService.getItems(false, '', true).subscribe(res => { this._utilityService.detectChanges(this._cdr); })
  }

  //New Mock Drill Type
  addNewMockDrillType() {
    this.mockDrillTypeObject.type = 'Add';
    this.mockDrillTypeObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  //Open Mock Drill Type Modal
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  //Close Mock Drill Type Modal
  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.mockDrillTypeObject.type = null;
    this.getMOckDrillType();
  }

  // Search Mock Drill Type
  searchMOckDrillType(e) {
    this._mockDrillTypeService.getItems(false, '?q=' + e.term, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  selectmockDrillType(val: any, isRemove: boolean) {
    if (!this.mockDrillTypeList) this.mockDrillTypeList = [];
    if (isRemove) {
      var index1 = this.mockDrillTypeList.map(x => { return x.type.id; }).indexOf(val.id);
      this.mockDrillTypeList.splice(index1, 1);
    }
    else if (!isRemove) {
      this.mockDrillTypeList.push({ id: '', type: val, nooftype: '' })
    }
  }

  cancelClicked() {
    $(this.confirmationPopup.nativeElement).modal('show');
  }
  cancelMockDrillForm(status) {
    $(this.confirmationPopup.nativeElement).modal('hide');
    if (status) {
      this._router.navigateByUrl('/mock-drill/mock-drill-programs');
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  validateMinDate() {
    var minPickerDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
  }
  validateMOckDrillType() {
    var val = true;
    if (this.mockDrillTypeList) {
      this.mockDrillTypeList.forEach(element => {
        if (element.nooftype == null || element.nooftype == '' || element.nooftype == 0) { val = false; return }
      });
    }
    else val = false;
    return val;
  }
  getSaveData() {
    var preplans = [];
    if (!MockDrillProgramStore.mock_drill_program_id) {
      if (this.mockDrillTypeList)
        this.mockDrillTypeList.forEach(element => {
          preplans.push({ mock_drill_type_id: element.type.id, count: element.nooftype })
        });
      this.saveData = {
        title: this.form.value.mock_drill_title,
        start_date: this._helperService.passSaveFormatDate(new Date(this.form.value.start_date.year, this.form.value.start_date.month, this.form.value.start_date.day)).substring(0, 10),
        end_date: this._helperService.passSaveFormatDate(new Date(this.form.value.end_date.year, this.form.value.end_date.month, this.form.value.end_date.day)).substring(0, 10),
        mock_drill_preplans: preplans,
        event_ids: EventsStore.selectedEventList.map(x => x.id),
        process_ids: ProcessStore.selectedProcessesList.map(x => x.id),
        location_ids: LocationMasterStore.selectedLocationList.map(x => x.id),
        project_ids: BusinessProjectsStore.selectedProjectList.map(x => x.id),
        mock_drill_type_ids: preplans.map(x => x.mock_drill_type_id)
      }
    } else
      if (MockDrillProgramStore.mock_drill_program_id)
        this.saveData = {
          title: this.form.value.mock_drill_title,
          start_date: this._helperService.passSaveFormatDate(new Date(this.form.value.start_date.year, this.form.value.start_date.month, this.form.value.start_date.day)).substring(0, 10),
          end_date: this._helperService.passSaveFormatDate(new Date(this.form.value.end_date.year, this.form.value.end_date.month, this.form.value.end_date.day)).substring(0, 10),
          event_ids: EventsStore.selectedEventList.map(x => x.id),
          process_ids: ProcessStore.selectedProcessesList.map(x => x.id),
          location_ids: LocationMasterStore.selectedLocationList.map(x => x.id),
          project_ids: BusinessProjectsStore.selectedProjectList.map(x => x.id),
        }
  }
  save(isClose) {
    if (this.form.value) {
      this.formErrors = null;
      let save;
      AppStore.enableLoading();
      this.getSaveData();
      if (MockDrillProgramStore.mock_drill_program_id) {
        save = this._mockDrillProgramService.updateItem(MockDrillProgramStore.mock_drill_program_id, this.saveData);
      } else {
        save = this._mockDrillProgramService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (isClose) {
            this.resetForm();
            this.mockDrillProgramDetails(res.id);
          }
          else if (MockDrillProgramStore.mock_drill_program_id == null || MockDrillProgramStore.mock_drill_program_id == undefined || MockDrillProgramStore.mock_drill_program_id == 0) {
            this.resetForm();
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
  mockDrillProgramDetails(id) {
    this._router.navigateByUrl('mock-drill/mock-drill-programs/' + id);
  }
  resetForm() {
    if (this.form) this.form.reset();
    this.formErrors = null;
    this.mockDrillTypeList = [];
    LocationMasterStore.selectedLocationList = [];
    EventsStore.selectedEventList = [];
    BusinessProjectsStore.selectedProjectList = [];
    ProcessStore.selectedProcessesList = [];
  }
  ngOnDestroy() {
    MockDrillProgramStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.ProcessSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.confirmationEventSubscription.unsubscribe();
    this.mockDrillTypeSubscriptionEvent.unsubscribe();
    // this.scopeSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this.resetForm();
    SubMenuItemStore.makeEmpty();
  }
}
