import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { TimeTrackerService } from 'src/app/core/services/project-management/time-tracker/time-tracker.service';
import { ProjectManagementProjectsService } from 'src/app/core/services/project-management/projects/project-management-projects.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';

declare var $: any;
@Component({
  selector: 'app-time-tracker-list',
  templateUrl: './time-tracker-list.component.html',
  styleUrls: ['./time-tracker-list.component.scss']
})
export class TimeTrackerListComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild("addTimeTrackerModal", { static: true }) addTimeTrackerModal: ElementRef;
  @ViewChild('customDatePopUp') customDatePopUp: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  TimeTrackerStore = TimeTrackerStore;
  ProjectsStore = ProjectsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  filterDateObject: { startDate: string, endDate: string };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  timeTrackerObject = {
    id: null,
    type: null,
    values: null,
    redirect: true
  };

  //deleteTimeTrackerSubscription: any;
  addTimeTrackerSubscription: any;
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2, private _projectManagementService: ProjectManagementProjectsService,
    private _router: Router, private _helperService: HelperServiceService, private _timeTrackerService: TimeTrackerService) {

  }

  ngOnInit(): void {
    if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
    this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);
    if (SubMenuItemStore.DatefilterValue != '') {
      this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
    }
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_time_tracker' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'PROJECT_TIME_TRACKER_LIST', submenuItem: { type: 'search' } },
        { activityName: 'PROJECT_TIME_TRACKER_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_PROJECT_TIME_TRACKER', submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'datefilter' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } }
        // {activityName: 'GENERATE_TIME_TRACKER_TEMPLATE', submenuItem: {type: 'template'}},
        // {activityName: null, submenuItem: {type: 'import'}},
      ]
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100, 'CREATE_PROJECT_TIME_TRACKER')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addTimeTracker();
            break;
          // case "template":
          //   this._eventService.generateTemplate();
          //   break;
          case "export_to_excel":
            let params = '';
            if (this.filterDateObject.startDate) {
              params = `from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
            }
            this._projectManagementService.exportToExcel(params);
            break;
          case "search":
            ProjectsStore.unsetProjectList();
            ProjectsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            ProjectsStore.unsetProjectList();
            this.pageChange(1)
            break;
          // case "import":
          //   ImportItemStore.setTitle('import_event');
          //   ImportItemStore.setImportFlag(true);
          //   break;
          default:
            break;
        }
        if (SubMenuItemStore.clikedSubMenuItem.type != 'export_to_excel' && SubMenuItemStore.clikedSubMenuItem.type != 'refresh') {
          this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addTimeTracker();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    // this.deleteTimeTrackerSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    //   this.deleteTimeTracker(item);
    // })

    this.addTimeTrackerSubscription = this._eventEmitterService.addTimeTrackerModalControl.subscribe(element => {
      if (!element) {
        this.closeAddTimeTracker();
        this.pageChange(1);
      }
    })
    this.pageChange(1);
  }

  passDates(dateObject): any {
    this.filterDateObject = dateObject;
  }

  processDateFilterSelected(dateType: any): void {
    console.log(dateType)
    if (dateType === "custom") {

      $(this.customDatePopUp?.nativeElement).modal('show');
    }
    else {
      this.filterDateObject = this._helperService.getStartEndDate(dateType);
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectsStore.setCurrentPage(newPage);
    this._projectManagementService.getItems(null, '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addTimeTracker() {
    this.timeTrackerObject.type = 'Add';
    this.timeTrackerObject.values = null;
    this.openTimeTrackerPopup()
  }

  editTimeTracker(id, event) {
    event.stopPropagation();
    this.timeTrackerObject.type = 'Edit';
    this.timeTrackerObject.values = id;
    this.openTimeTrackerPopup()
  }

  getDetails(data) {
    TimeTrackerStore.setProjectTitle(data.title);
    this._router.navigateByUrl(`/project-management/project-time-trackers/${data.id}`)
  }

  openTimeTrackerPopup() {
    setTimeout(() => {
      $(this.addTimeTrackerModal.nativeElement).modal('show');
    }, 100);
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement, 'z-index', 99999);
  }

  closeAddTimeTracker() {
    setTimeout(() => {
      this.timeTrackerObject.type = null;
      this.timeTrackerObject.values = null;
      $(this.addTimeTrackerModal.nativeElement).modal('hide');
      this._renderer2.removeClass(this.addTimeTrackerModal.nativeElement, 'show');
      this._renderer2.setStyle(this.addTimeTrackerModal.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  deleteTimeTracker(status) {
    if (status && this.popupObject.id) {
      this._timeTrackerService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  delete(id: number, event) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'delete_time_tracker';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  gotoTimeTrackerDetails(id: number) {
    //this._router.navigateByUrl(`/event-monitoring/events/${id}`)
  }

  sortTitle(type: string) {
    //this._timeTrackerService.sortTimeTrackerList(type);
    this.pageChange();
  }

  //passing token to get preview
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    //this.deleteTimeTrackerSubscription.unsubscribe();
    this.addTimeTrackerSubscription.unsubscribe();
    ProjectsStore.searchText = '';
  }


}
