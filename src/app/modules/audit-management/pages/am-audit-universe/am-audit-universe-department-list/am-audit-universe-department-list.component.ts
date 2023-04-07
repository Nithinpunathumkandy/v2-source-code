import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmAuditUniverseService } from 'src/app/core/services/audit-management/am-audit-universe/am-audit-universe.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditUniverseStore } from 'src/app/stores/audit-management/am-audit-universe/am-audit-universe.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-am-audit-universe-department-list',
  templateUrl: './am-audit-universe-department-list.component.html',
  styleUrls: ['./am-audit-universe-department-list.component.scss']
})
export class AmAuditUniverseDepartmentListComponent implements OnInit {
  AmAuditUniverseStore = AmAuditUniverseStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  reactionDisposer:IReactionDisposer;
  filterSubscription: Subscription = null;

  constructor(private _auditUniverseService:AmAuditUniverseService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditUniverseStore.department_loaded = false;
      this.getDepartments(1);
    });
    
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'AM_AUDIT_UNIVERSE_PROCESS_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_AUDIT_UNIVERSE_PROCESS_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_AM_AUDIT_UNIVERSE_PROCESS', submenuItem: { type: 'export_to_excel' } },
      ]

      NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
     
      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case 'refresh':
            this.getDepartments(1);
            break

          case "export_to_excel":
            this._auditUniverseService.departmentExportToExcel();
            break;

          case "search":
            AmAuditUniverseStore.departmentSearchText = SubMenuItemStore.searchText;

            this.getDepartments(1);
            break;
       
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({ title: "", subtitle: 'common_nodata_title'});
   

    RightSidebarLayoutStore.filterPageTag = 'am_audit_universe_department';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
    ]);
    this.getDepartments(1);
  }

  getDepartments(newPage: number = null) {
    AmAuditUniverseStore.department_loaded = false;
    if (newPage) AmAuditUniverseStore.setDepartmentCurrentPage(newPage);
    this._auditUniverseService.getDepartments().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

   // for sorting
   sortTitle(type: string) {
    //ExternalAuditMasterStore.setCurrentPage(1);
    this._auditUniverseService.sortDepartmentList(type, null);
    this.getDepartments();
  }

  ngOnDestory(){
    SubMenuItemStore.searchText = null;
    AmAuditUniverseStore.departmentSearchText = null;
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
  }

}
