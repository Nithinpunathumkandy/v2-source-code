import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AmAuditFieldWorkService } from 'src/app/core/services/audit-management/am-audit-field-work/am-audit-field-work.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-field-work-list',
  templateUrl: './am-audit-field-work-list.component.html',
  styleUrls: ['./am-audit-field-work-list.component.scss']
})
export class AmAuditFieldWorkListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ImportItemStore = ImportItemStore;
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  AmAuditsStore = AmAuditsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  auditFieldWorkObject = {
    component: 'Audit Field Work',
    values: null,
    type: null
  };
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditFieldWorkEventSubscription: any;

  filterSubscription: Subscription = null;


  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _auditFieldWorkService: AmAuditFieldWorkService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
  ) { }

  ngOnInit(): void {
    AmAuditsStore.unsetIndiviudalAuditDetails();
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditFieldWorkStore.loaded = false;
      this.pageChange(1);
    });
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit_field_work' });
     

    this.reactionDisposer = autorun(() => {


      var subMenuItems = [
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_AM_ANNUAL_PLAN', submenuItem: { type: 'export_to_excel' } },

      ]

      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_ANNUAL_PLAN')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAuditFieldWork();
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


          case "export_to_excel":
            this._auditFieldWorkService.exportToExcel();
            break;

          case "search":
            AmAuditFieldWorkStore.searchText = SubMenuItemStore.searchText;

            this.pageChange(1);
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })


    AppStore.showDiscussion = false;
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.auditFieldWorkEventSubscription = this._eventEmitterService.amAuditFieldWorkModal.subscribe(item => {
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

    RightSidebarLayoutStore.filterPageTag = 'am_audit_field_work'
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'audit_manager_ids',
      'am_audit_status_ids'
    ])

  }

  addNewAuditFieldWork() {

    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    this.auditFieldWorkObject.type = 'Add';
    this.auditFieldWorkObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);

  }

  pageChange(newPage: number = null) {
    AmAuditFieldWorkStore.loaded = false;
    if (newPage) AmAuditFieldWorkStore.setCurrentPage(newPage);
    this._auditFieldWorkService.getItems(false, 'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }


  /**
* Delete the audit field workk
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditFieldWorkService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditFieldWorkStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditFieldWorkStore.currentPage = Math.ceil(AmAuditFieldWorkStore.totalItems / 15);
            this.pageChange(AmAuditFieldWorkStore.currentPage);
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

  closeFormModal() {
    this.auditFieldWorkObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  deleteAuditFieldWork(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_field_work_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  editAuditFieldWork(fieldwork) {

    this.auditFieldWorkObject.values = {
      id: fieldwork.id,
      field_work_start_date: this._helperService.processDate(fieldwork.field_work_start_date, 'split'),
    }
    this.auditFieldWorkObject.type = 'Edit';

    this._utilityService.detectChanges(this._cdr);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);

  }




  gotoDetailsPage(id) {

    if (AuthStore.getActivityPermission(3900, 'AM_ANNUAL_PLAN_DETAILS')) {
      this._router.navigateByUrl('/audit-management/am-audit-field-works/' + id);
    }
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  sortTitle(type) {
    this._auditFieldWorkService.sortAuditFieldWorkList(type);
    this.pageChange();
  }

  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['id'] = user.audit_manager_id;
    userDetailObject['first_name'] = user.audit_manager_first_name;
    userDetailObject['last_name'] = user.audit_manager_last_name;
    userDetailObject['designation'] = user.audit_manager_designation;
    userDetailObject['image_token'] = user.audit_manager_image_token;
    userDetailObject['department'] = user.audit_manager_department;
    userDetailObject['email'] = user.audit_manager_email;
    userDetailObject['mobile'] = user.audit_manager_mobile;
    userDetailObject['status_id'] = user.audit_manager_status_id? user.audit_manager_status_id:1;
    return userDetailObject;

  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AmAuditFieldWorkStore.searchText = '';
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    NoDataItemStore.unsetNoDataItems();
  }


}
