import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditDashboardService } from 'src/app/core/services/audit-management/am-audit-dashboard/am-audit-dashboard.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-am-individual-audit-plans-list',
  templateUrl: './am-individual-audit-plans-list.component.html',
  styleUrls: ['./am-individual-audit-plans-list.component.scss']
})
export class AmIndividualAuditPlansListComponent implements OnInit {

  AmAuditPlansStore = AmAuditPlansStore
  AmAnnualAuditPlansStore = AmAnnualAuditPlansStore
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  reactionDisposer: IReactionDisposer;

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    department: '',
    image_token: '',
    status_id: null,
    email: '',
    mobile: ''

  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _amAuditDashboardService: AmAuditDashboardService,
    private _helperService:HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'refresh' } },
        { activityName: null, submenuItem: { type: 'search' } },                
      ]
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle'});

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case 'refresh':
            this.pageChange(1);
            break

          case "search":
            AmAnnualAuditPlansStore.searchText = SubMenuItemStore.searchText;

            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })
    this.pageChange()
  }

  pageChange(newPage: number = null){
    AmAnnualAuditPlansStore.loaded = false;
    if (newPage) AmAnnualAuditPlansStore.setCurrentPage(newPage);
    this._amAuditDashboardService.getIndividualAuditPlan(false, 'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setAuditPlanSort(type) {
    // this._annualAuditPlansService.sortAuditPlanList(type);
    this.pageChange();
  }

  getPopupDetails(user) {
    this.userDetailObject.id = user.audit_manager_id;
    this.userDetailObject.first_name = user.audit_manager_first_name;
    this.userDetailObject.last_name = user.audit_manager_last_name;
    this.userDetailObject.designation = user.audit_manager_designation;
    this.userDetailObject.image_token = user.audit_manager_image_token;
    this.userDetailObject.status_id = user.audit_manager_status_id ? user.audit_manager_status_id : 1;
    this.userDetailObject.department = user.audit_manager_department_title ? user.audit_manager_department_title : '';
    this.userDetailObject.email = user.audit_manager_email ? user.audit_manager_email : '';
    this.userDetailObject.mobile = user.audit_manager_mobile ? user.audit_manager_mobile : '';

    return this.userDetailObject;

  }

}
