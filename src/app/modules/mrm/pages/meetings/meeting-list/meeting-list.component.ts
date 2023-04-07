import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MeetingsService } from 'src/app/core/services/mrm/meetings/meetings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { MRMDashboardStore } from 'src/app/stores/mrm/mrm-dashboard/mrm-dashboard-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MeetingsStore = MeetingsStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MRMDashboardStore=MRMDashboardStore;

  popupObject = {
    id: null,
    type: '',
    title: '',
    subtitle: '',
    meetingType: ''
  };

  filterSubscription: Subscription = null;
  popupControlMeetingPlanEventSubscription: any;

  constructor(private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _meetingsService: MeetingsService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.filterPageTag = 'meeting';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'venue_ids',
      'organizer_ids',
      'meeting_plan_ids',
      'meeting_category_ids',
      'meeting_status_ids'
      
    ]);
    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MeetingsStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'MEETING_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MEETING_LIST', submenuItem: {type: 'refresh'}},
        { activityName: 'CREATE_MEETING', submenuItem: { type: 'un-planned-meeting' } },
        { activityName: 'CREATE_MEETING', submenuItem: { type: 'planned-meeting' } },
        { activityName: 'EXPORT_MEETING', submenuItem: { type: 'export_to_excel' } },
      ];

      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   MeetingsStore.meetingsId = null;
          //   this.MeetingsStore.clearDocumentDetails();
          //   MeetingsStore.newMeetingsMom = [];
          //   this.addUnplannedNewMeeting();
          //   //this.openPlanUnplan();
          //   break;
          
          case "planned-meeting":
            this._rightSidebarFilterService.resetFilter();
            MeetingPlanStore.unSetMeetingPlan();
            MeetingsStore.meetingsId = null;
            this.MeetingsStore.clearDocumentDetails();
            MeetingsStore.newMeetingsMom = [];
            this.addnewMeeting();
            break;
          case "un-planned-meeting":
            MeetingsStore.meetingsId = null;
            this.MeetingsStore.clearDocumentDetails();
            MeetingsStore.newMeetingsMom = [];
            this.addUnplannedNewMeeting();
            break;
          case "template":
            this._meetingsService.generateTemplate();
            break;
          case "export_to_excel":
            this._meetingsService.exportToExcel();
            break;
            case "refresh":
              SubMenuItemStore.searchText = '';
              MeetingsStore.searchText = '';
              MeetingsStore.loaded = false;
              this.pageChange(1);
            break;
          case "search":
            MeetingsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addnewMeeting();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    // for deleting/activating/deactivating using delete modal
    this.popupControlMeetingPlanEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);

    
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMeetings(status)
        break;
    }
  }

  // delete function call
  deleteMeetings(status: boolean) {
    if (status && this.popupObject.id) {
      if (this.popupObject.meetingType = 'Planned') {
        this._meetingsService.delete(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
        });
      } else {
        this._meetingsService.deleteUnplanned(this.popupObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearPopupObject();
        });
      }

    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // for delete
  delete(id: number, meetingType) {
    if (meetingType)
      this.popupObject.meetingType = 'Unplanned'
    else
      this.popupObject.meetingType = 'Planned'
    event.stopPropagation();

    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  editMeetingPlan(id, isUnplanned) {
    MeetingsStore.setMeetingsId(id);
    MeetingsStore.setEditFlag();
    MeetingsStore.meetingListCancelFlag='list';
    if (isUnplanned)
      this._router.navigateByUrl('mrm/meetings/edit-unplanned-meeting');
    else
      this._router.navigateByUrl('mrm/meetings/edit-meeting');
  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingsStore.setCurrentPage(newPage);
    var additionalParams=''
    if (MRMDashboardStore.dashboardParameter) {
      additionalParams = MRMDashboardStore.dashboardParameter
    }
    this._meetingsService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addnewMeeting() {
    this._router.navigateByUrl('mrm/meetings/add-meeting');
  }

  addUnplannedNewMeeting() {
    this._router.navigateByUrl('mrm/meetings/add-unplanned-meeting');
  }

  getDetails(id: number) {
    MeetingsStore.setMeetingsId(id);
    this._router.navigateByUrl('mrm/meetings/' + id);
  }

  // for sorting
  sortTitle(type: string) {

    this._meetingsService.sortMeetingsList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {

    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MeetingsStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlMeetingPlanEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    MeetingsStore.unSetMeetings();//meeting list
    RightSidebarLayoutStore.showFilter = false;
  }

}
