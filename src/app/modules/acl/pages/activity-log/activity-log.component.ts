import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ActivityLogService } from 'src/app/core/services/acl/activity-log/activity-log.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivityLogStore } from 'src/app/stores/acl/activity-log.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  @ViewChild('logDetailsModal') logDetailsModal: ElementRef
  ActivityLogStore = ActivityLogStore;
  AppStore =AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  constructor(private _activityLogService:ActivityLogService,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef) { 
      AppStore.showDiscussion = false;
    }

  ngOnInit(): void {
    
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ACTIVITY_LOG_LIST', submenuItem: { type: 'search' }},
        { activityName: 'EXPORT_ROLE', submenuItem: { type: 'export_to_excel' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1200, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._activityLogService.exportToExcel();
            break;
          case "search":
            ActivityLogStore.searchText = SubMenuItemStore.searchText;
            this.activityLogDetails();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.activityLogDetails(1);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

  activityLogDetails(newPage: number = null){
    if (newPage) ActivityLogStore.setCurrentPage(newPage);
    this._activityLogService.getDetails(false, null, true).subscribe(()=>setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._activityLogService.sortActivityLogList(type);
    this.activityLogDetails();
  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.created_by_first_name ? user.created_by_first_name : user.created_by_first_name ? user.created_by_first_name : '';
      userDetailObject['last_name'] = user.created_by_last_name;
      userDetailObject['designation'] = user.created_by_designation ? user.created_by_designation : null;
      userDetailObject['image_token'] = user.created_by_image_token ? user.created_by_image_token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id ? user.id : null;
      userDetailObject['department'] =  user.created_by_department ? user.created_by_department : null;
      userDetailObject['status_id'] = user.created_by_status ? user.created_by_status : 1;
      
      return userDetailObject;
    }
  }

  getActivityLogDetails(id){
    if(AuthStore.getActivityPermission(100,'ACTIVITY_LOG_DETAILS')){
      this._activityLogService.getActivityLogDetails(id).subscribe(res=>{
        this.openDetailsPopUp();
      });
    }
  }

  openDetailsPopUp(){
    setTimeout(() => {
      $(this.logDetailsModal.nativeElement).modal('show');
    }, 100);
  }

  ngOnDestroy(){
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.makeEmpty();
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }
}
