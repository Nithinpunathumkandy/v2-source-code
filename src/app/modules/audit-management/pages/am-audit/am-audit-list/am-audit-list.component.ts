import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AMAuditDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/am-audit-dashboard.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-list',
  templateUrl: './am-audit-list.component.html',
  styleUrls: ['./am-audit-list.component.scss']
})
export class AmAuditListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AmAuditsStore = AmAuditsStore;
  AuthStore = AuthStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditEventSubscription: any;
  filterSubscription: Subscription = null;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  auditObject = {
    component: 'Audit',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  constructor(private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    private _cdr:ChangeDetectorRef,
    private _router: Router,
    private _auditService:AmAuditService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2:Renderer2,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditsStore.loaded = false;
      this.pageChange(1);
    });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'AM_AUDIT_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_AUDIT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_AM_AUDIT', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_AM_AUDIT_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_AM_AUDIT', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_AM_AUDIT', submenuItem: { type: 'import' } },

      ]
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit' });
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900,'CREATE_AM_AUDIT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAudit();
        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;

          case 'refresh':
            this.pageChange(1);
            break

          case "template":

            this._auditService.generateTemplate();
            break;

          case "export_to_excel":
            this._auditService.exportToExcel();
            break;

          case "search":
            AmAuditsStore.searchText = SubMenuItemStore.searchText;

            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_am_audit_plan');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._auditService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })

    AppStore.showDiscussion = false;
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.auditEventSubscription = this._eventEmitterService.auditManagementAuditAddModal.subscribe(item => {
      this.closeFormModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.pageChange(1);

    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'am_audit';
    this._rightSidebarFilterService.setFiltersForCurrentPage([

      'audit_manager_ids',
      'am_audit_status_ids',
      'department_ids'

    ]);

  }
  addNewAudit(){
 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }


  openFormModal(){
    this.auditObject.type = 'Add';
    this.auditObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);


  }

  closeFormModal(){
    this.auditObject.type = null;
    this.auditObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  pageChange(newPage: number = null){
    AmAuditsStore.loaded = false;
    var additionalParams=''
      if (AMAuditDashboardStore.DashboardParameter) {
        additionalParams = AMAuditDashboardStore.DashboardParameter
      }
    if (newPage) AmAuditsStore.setCurrentPage(newPage);
    this._auditService.getItems(false, additionalParams ? additionalParams : ''+'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoDetailsPage(id) {
    
    if (AuthStore.getActivityPermission(3900, 'AM_AUDIT_DETAILS')) {
      this._router.navigateByUrl('audit-management/am-audits/' + id);
    }
  }

  /**
* Delete the audit
*/
delete(status) {
  let type;
  if (status && this.deleteObject.id) {
    switch (this.deleteObject.type) {
      case '': type = this._auditService.delete(this.deleteObject.id);
        break;

    }

    type.subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        if (AmAuditsStore.currentPage > 1 && this.deleteObject.type == '') {
          AmAuditsStore.currentPage = Math.ceil(AmAuditsStore.totalItems / 15);
          this.pageChange(AmAuditsStore.currentPage);
        }
      }, 500);
      this.clearDeleteObject();
    }, (error => {
      setTimeout(() => {
        if (error.status == 405) {
          this._utilityService.detectChanges(this._cdr);
        }
      }, 100);

    }));
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);

}

deleteAudit(id) {
  this.deleteObject.id = id;
  this.deleteObject.type = '';
  this.deleteObject.subtitle = 'delete_am_audit_subtitle';

  $(this.deletePopup.nativeElement).modal('show');
}

clearDeleteObject() {

  this.deleteObject.id = null;
  this.deleteObject.subtitle = '';
}


editAudit(id) {


  this._auditService.getItem(id).subscribe(res => {

    this.auditObject.values = {
      id: id,
      am_individual_audit_plan_id: res['am_individual_audit_plan'],
      start_date: this._helperService.processDate(res['start_date'], 'split'),
      end_date: this._helperService.processDate(res['end_date'], 'split'),
      description:res['description'],
      objective:res['objective'],
      criteria:res['criteria'],
      scope:res['scope'],
      out_of_scope:res['out_of_scope'],
      am_audit_methodologies:res['am_audit_methodologies']

    }
    this.auditObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  })
}

createImagePreview(type, token) {
  return this._humanCapitalService.getThumbnailPreview(type, token);
}

getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

sortTitle(type) {
  this._auditService.sortAuditList(type);
  this.pageChange();
}

getPopupDetails(user) { 
  let userDetailObject: any = {};
  userDetailObject['id'] = user.audit_manager_id; 
  userDetailObject['first_name'] = user.audit_manager_first_name;
  userDetailObject['last_name'] = user.audit_manager_last_name;
  userDetailObject['designation'] = user.audit_manager_designation;
  userDetailObject['department'] = user.audit_manager_department;
  userDetailObject['image_token'] = user.audit_manager_image_token;
  userDetailObject['email'] = user.audit_manager_email;
  userDetailObject['mobile'] = user.audit_manager_mobile;
  userDetailObject['status_id'] = user.audit_manager_status_id;
  return userDetailObject;

}

 
ngOnDestroy() {
  if (this.reactionDisposer) this.reactionDisposer();
  SubMenuItemStore.makeEmpty();
  this.deleteEventSubscription.unsubscribe();
  this.idleTimeoutSubscription.unsubscribe();
  this.networkFailureSubscription.unsubscribe();
  this.auditEventSubscription.unsubscribe();
  SubMenuItemStore.searchText = '';
  AmAuditsStore.searchText = '';
  RightSidebarLayoutStore.showFilter = false;
  this.filterSubscription.unsubscribe();
  NoDataItemStore.unsetNoDataItems();
  AMAuditDashboardStore.unsetDashboardParam()
}

}
