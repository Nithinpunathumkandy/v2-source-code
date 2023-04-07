import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MockDrillProgramMappingService } from 'src/app/core/services/mock-drill/mock-drill-program-mapping/mock-drill-program-mapping.service';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { SitesMasterStore } from 'src/app/stores/masters/general/sites-store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { MappingStore } from 'src/app/stores/mrm/meeting-plan/mapping-store';
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-program-mapping',
  templateUrl: './mock-drill-program-mapping.component.html',
  styleUrls: ['./mock-drill-program-mapping.component.scss']
})
export class MockDrillProgramMappingComponent implements OnInit {

  @ViewChild('projectFormModal') projectFormModal: ElementRef;
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('eventFormModal') eventFormModal: ElementRef;
  @ViewChild('locationFormModal') locationFormModal: ElementRef;
  @ViewChild('siteFormModal') siteFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  LocationMasterStore = LocationMasterStore;
  OrganizationModulesStore = OrganizationModulesStore;
  MockDrillProgramStore = MockDrillProgramStore;
  SitesMasterStore = SitesMasterStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ProcessStore = ProcessStore;
  EventsStore = EventsStore;
  BusinessProjectsStore = BusinessProjectsStore;
  reactionDisposer: IReactionDisposer;
  MappingStore = MappingStore;
  IssueListStore = IssueListStore;
  eventSelectSubscription: any;
  locationSelectSubscription: any;
  siteSelectSubscription: any;
  deleteObject = {
    id: null,
    title: '',
    type: '',
    subtitle: ''
  };

  modalObject = {
    component: 'mock_drill_program',
  }

  selectedSection = 'process';
  processes = [];
  subscription: any;
  projectSelectSubscription: any;
  selectedTab: any = null;
  deleteEventSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  constructor(private _mockDrillProgramService: MockDrillProgramService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _programMappingService: MockDrillProgramMappingService, private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService, private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.setSubMenuItems([{ type: 'close', path: '/mock-drill/mock-drill-programs' }]);
    this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
    this.checkForInitialTab();
    this.gotoSection(this.selectedSection);
    this.reactionDisposer = autorun(() => {
      if (NoDataItemStore.clikedNoDataItem) {
        this.openSelectPopup();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.subscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    })

    this.projectSelectSubscription = this._eventEmitterService.projectSelect.subscribe(item => {
      this.closeProjects();
    })
    this.eventSelectSubscription = this._eventEmitterService.eventMappingModal.subscribe(item => {
      this.closeEvents();
    })
    this.siteSelectSubscription = this._eventEmitterService.siteMappingModal.subscribe(item => {
      this.closeSite();
    })
    this.locationSelectSubscription = this._eventEmitterService.locationMasterControl.subscribe(item => {
      this.closelocation();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    });

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

  }

  checkForInitialTab() {
    if (OrganizationModulesStore.checkOrganizationSubModulesPermission(600, 12801)) this.gotoSection('process');
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(100, 21901)) this.gotoSection('location');
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(400, 8101)) this.gotoSection('project');
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(4000, 81601)) this.gotoSection('event');
    else if (OrganizationModulesStore.checkOrganizationSubModulesPermission(4000, 81601)) this.gotoSection('site');
    this._utilityService.detectChanges(this._cdr);
  }


  getProgramMappingDetails(id) {
    this._programMappingService.getMockDrillMapping(id).subscribe(res => {
      console.log(toJS(MockDrillProgramStore.mappingItemList))
      this._utilityService.detectChanges(this._cdr);
      // this.setValues(res);
    })
  }

  changeZIndex() {
    if ($(this.processFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
    }
    if ($(this.projectFormModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.projectFormModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.projectFormModal.nativeElement, 'overflow', 'auto');
    }
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getArrayProcessed(itemArray) {
    if (typeof itemArray === 'object') {
      return this._helperService.getArrayProcessed(itemArray, 'title').toString();
    }
    else {
      return itemArray;
    }
  }

  gotoSection(type) {
    this.selectedSection = type;
    switch (type) {
      case 'process':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_mock_drill_program_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_process" });
        break;
      case 'location':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_mock_drill_program_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_location" });
        break;
      case 'project':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_mock_drill_program_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_projects" });
        break;
      case 'event':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_mock_drill_program_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_events" });
        break;
      case 'site':
        NoDataItemStore.setNoDataItems({ title: "common_no_data_mock_drill_program_mapping", subtitle: "common_nodata_subtitle", buttonText: "choose_events" });
        break;
    }
  }

  openSelectPopup() {
    switch (this.selectedSection) {
      case 'process': this.selectProcesses(); break;
      case 'project': this.selectProjects(); break;
      case 'event': this.selectEvent(); break;
      case 'location': this.selectLocation(); break;
      case 'site': this.selectSite(); break;
    }
  }



  deleteMapping(id, title, subtitle) {//delete
    this.deleteObject.id = id;
    this.deleteObject.title = title;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = subtitle;
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 250);
  }

  selectProjects() {
    BusinessProjectsStore.saveSelected = false;
    BusinessProjectsStore.project_select_form_modal = true;
    setTimeout(() => {
      BusinessProjectsStore.selectedProjectList = MockDrillProgramStore.mappingItemList.project;
    }, 1000);
    $(this.projectFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  selectSite() {
    SitesMasterStore.saveSelected = false;
    SitesMasterStore.siteMappingModal = true;
    setTimeout(() => {
      SitesMasterStore.selectedSites = MockDrillProgramStore.mappingItemList.site;
    }, 1000);
    $(this.siteFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.siteFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.siteFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  selectLocation() {
    LocationMasterStore.saveSelected = false;
    LocationMasterStore.location_select_form_modal = true;
    setTimeout(() => {
      LocationMasterStore.selectedLocationList = MockDrillProgramStore.mappingItemList.locations;
    }, 1000);
    $(this.locationFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);

  }

  selectEvent() {
    EventsStore.saveSelected = false;
    EventsStore.eventMappingModal = true;
    setTimeout(() => {
      EventsStore.selectedEvents = MockDrillProgramStore.mappingItemList.event;
    }, 1000);
    $(this.eventFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.eventFormModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.eventFormModal.nativeElement, 'z-index', 99999);
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {//delete
    this.deleteObject.id = null;
  }

  delete(status) {//delete
    let deleteData;

    if (status && this.deleteObject.id) {
      switch (this.deleteObject.title) {
        case 'process':
          deleteData = this._programMappingService.deleteProcessMapping(this.deleteObject.id);
          break;
        case 'project':
          deleteData = this._programMappingService.deleteProjectMapping(this.deleteObject.id);
          break;
        case 'event':
          deleteData = this._programMappingService.deleteEventMapping(this.deleteObject.id);
          break;
        case 'location':
          deleteData = this._programMappingService.deleteLocationMapping(this.deleteObject.id);
          break;
      }
      deleteData.subscribe(resp => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  selectProcesses() {
    ProcessStore.saveSelected = false;
    IssueListStore.processes_form_modal = true;
    setTimeout(() => {
      ProcessStore.selectedProcessesList = MockDrillProgramStore.mappingItemList.process;
    }, 1000);
    $(this.processFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  // Close Modal to select processes
  closeProcesses() {
    if (ProcessStore?.saveSelected) {
      let saveData = {
        process_ids: this.getIds(ProcessStore?.selectedProcessesList)
      }
      this._programMappingService.saveProcessForMapping(saveData).subscribe(res => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        IssueListStore.processes_form_modal = false;
        $(this.processFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
      IssueListStore.processes_form_modal = false;
      $(this.processFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  // Close Modal to select issues
  closeProjects() {
    if (BusinessProjectsStore?.saveSelected) {
      let saveData = {
        project_ids: this.getIds(BusinessProjectsStore?.selectedProjectsList)
      }
      this._programMappingService.saveProjectForMapping(saveData).subscribe(res => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        BusinessProjectsStore.project_select_form_modal = false;
        $(this.projectFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
      BusinessProjectsStore.project_select_form_modal = false;
      $(this.projectFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.projectFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeEvents() {
    if (EventsStore?.saveSelected) {
      let saveData = {
        event_ids: this.getIds(EventsStore?.selectedEvents)
      }
      this._programMappingService.saveEventForMapping(saveData).subscribe(res => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        EventsStore.eventMappingModal = false;
        $(this.eventFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else {
      this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
      EventsStore.eventMappingModal = false;
      $(this.eventFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.eventFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closeSite() {
    if (SitesMasterStore?.saveSelected) {
      let saveData = {
        sites_ids: this.getIds(SitesMasterStore?.selectedSites)
      }
      this._programMappingService.saveSiteForMapping(saveData).subscribe(res => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        SitesMasterStore.siteMappingModal = false;
        $(this.siteFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
      SitesMasterStore.siteMappingModal = false;
      $(this.siteFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.siteFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }
  closelocation() {
    if (LocationMasterStore?.saveSelected) {
      let saveData = {
        location_ids: this.getIds(LocationMasterStore?.selectedLocationList)
      }
      this._programMappingService.saveLocationForMapping(saveData).subscribe(res => {
        this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
        LocationMasterStore.location_select_form_modal = false;
        $(this.locationFormModal.nativeElement).modal('hide');
        this._utilityService.detectChanges(this._cdr);
      })
    } else {
      this.getProgramMappingDetails(MockDrillProgramStore.mock_drill_program_id)
      LocationMasterStore.location_select_form_modal = false;
      $(this.locationFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }
    this._renderer2.setStyle(this.locationFormModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getIds(data) {
    let idArray = [];
    for (let i of data) {
      idArray.push(i.id)
    }
    return idArray;
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.subscription.unsubscribe();
    this.projectSelectSubscription.unsubscribe();
    this.siteSelectSubscription.unsubscribe();
    this.eventSelectSubscription.unsubscribe();
    this.locationSelectSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    MockDrillProgramStore.searchText = null;
    SubMenuItemStore.searchText = '';
  }

}
