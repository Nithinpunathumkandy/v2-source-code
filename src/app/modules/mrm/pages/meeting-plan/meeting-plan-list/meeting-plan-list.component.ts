import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import{MeetingCriteriaMasterStore} from 'src/app/stores/masters/mrm/meeting-criteria-store';
import{MeetingObjectiveMasterStore} from 'src/app/stores/masters/mrm/meeting-objective-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AuthStore } from "src/app/stores/auth.store";
import { AppStore } from "src/app/stores/app.store";
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MRMDashboardStore } from 'src/app/stores/mrm/mrm-dashboard/mrm-dashboard-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-meeting-plan-list',
  templateUrl: './meeting-plan-list.component.html',
  styleUrls: ['./meeting-plan-list.component.scss']
})
export class MeetingPlanListComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('popup') popup: ElementRef;

  MeetingPlanStore = MeetingPlanStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  MeetingObjectiveMasterStore=MeetingObjectiveMasterStore;
  MeetingCriteriaMasterStore=MeetingCriteriaMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  popupActive: boolean;
  activeIndex = null;
  informedActiveIndex = null;
  hover = false;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  filterSubscription: Subscription = null;
  popupControlMeetingsEventSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _meetingPlanService: MeetingPlanService,
    private _renderer2: Renderer2,
    private _humanCapitalService: HumanCapitalService,
    private _router:Router,
    private _cdr: ChangeDetectorRef, 
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    RightSidebarLayoutStore.filterPageTag = 'meeting_plan';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'meeting_plan_status_ids',
      'meeting_category_ids',
      'venue_ids',
      'organizer_ids',
    ]);
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MeetingPlanStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'MEETING_PLAN_LIST', submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MEETING_PLAN', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_MEETING_PLAN_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MEETING_PLAN', submenuItem: {type: 'export_to_excel'}}
      ]
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_meeting_plan'});
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {   
          case "new_modal":
            MeetingPlanStore.meetingPlanId=null;
            this.MeetingPlanStore.clearDocumentDetails();
            MeetingPlanStore.newMeetingAgenda = [];
            MeetingPlanStore.unsetIndividualMeetingPlanDetails();
            this.gotoAddPage();
            break;
          case "template":
            this._meetingPlanService.generateTemplate();
            break;
          case "export_to_excel":
            this._meetingPlanService.exportToExcel();
            break;
          case "search":
            MeetingPlanStore.searchText   = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
              SubMenuItemStore.searchText = '';
              MeetingPlanStore.searchText = '';
              MeetingPlanStore.loaded = false;
              this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.gotoAddPage();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    })

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


    // for deleting/activating/deactivating using delete modal
    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.pageChange(1);
    

  }

  pageChange(newPage: number = null) {
    if (newPage) MeetingPlanStore.setCurrentPage(newPage);
    var additionalParams=''
    if (MRMDashboardStore.dashboardParameter) {
      additionalParams = MRMDashboardStore.dashboardParameter
    }
    this._meetingPlanService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteMeetingPlan(status);
        break;
    }

  }

  gotoAddPage()
  {
    this._router.navigateByUrl('mrm/meeting-plans/add-meeting-plan');
  }

  editMeetingPlan(id){
    MeetingPlanStore.setMeetingPlanId(id);
    MeetingPlanStore.editFlag=true;
    MeetingPlanStore.editListCancelFlag='list';
    this._router.navigateByUrl('mrm/meeting-plans/edit-meeting-plan');
    
  }

  // delete function call
  deleteMeetingPlan(status: boolean) {
    if (status && this.popupObject.id) {

      this._meetingPlanService.delete(this.popupObject.id).subscribe(resp => {
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
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  // for sorting
  sortTitle(type: string) {
    //ExternalAuditMasterStore.setCurrentPage(1);
    this._meetingPlanService.sortMeetingPlanList(type, null);
    this.pageChange();
  }

  createImageUrl(token) {
   
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  getDetails(id){
    MeetingPlanStore.setMeetingPlanId(id);
    this._router.navigateByUrl('mrm/meeting-plans/'+id);
  }
  
  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }
  
  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlMeetingsEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    MeetingPlanStore.searchText =null;
		SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    MeetingPlanStore.unSetMeetingPlan();
    MRMDashboardStore.dashboardParam=null;
  }

}
