import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-am-audit-plan-list',
  templateUrl: './am-audit-plan-list.component.html',
  styleUrls: ['./am-audit-plan-list.component.scss']
})
export class AmAuditPlanListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ImportItemStore = ImportItemStore;
  AmAuditPlansStore = AmAuditPlansStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  auditPlanObject = {
    component: 'Audit Plan',
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
  auditPlanEventSubscription: any;
  filterSubscription: Subscription = null;


  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _auditPlansService: AmAuditPlanService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService) { }

  ngOnInit(): void {
    this.AmAuditPlansStore.unsetIndiviudalAuditPlanDetails();
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAuditPlansStore.loaded = false;
      this.pageChange(1);
    });
    this.reactionDisposer = autorun(() => {


      var subMenuItems = [
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_AM_ANNUAL_PLAN_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_AM_ANNUAL_PLAN', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_AM_ANNUAL_PLAN', submenuItem: { type: 'import' } },

      ]

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_audit_plan' });
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900,'CREATE_AM_ANNUAL_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAuditPlan();
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

            this._auditPlansService.generateTemplate();
            break;

          case "export_to_excel":
            this._auditPlansService.exportToExcel();
            break;

          case "search":
            AmAuditPlansStore.searchText = SubMenuItemStore.searchText;

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
        this._auditPlansService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.auditPlanEventSubscription = this._eventEmitterService.auditManagementAuditPlanAddModal.subscribe(item => {
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

    RightSidebarLayoutStore.filterPageTag = 'am_audit_plan';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
     
      'am_audit_category_ids',
      'am_annual_plan_frequency_ids'
    ]);

    SubMenuItemStore.setNoUserTab(true);

  }

  addNewAuditPlan() {
 
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }



  openFormModal() {
    this.auditPlanObject.type = 'Add';
    this.auditPlanObject.values = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);

  }

  pageChange(newPage: number = null) {
    AmAuditPlansStore.loaded = false;
    if (newPage) AmAuditPlansStore.setCurrentPage(newPage);
    this._auditPlansService.getItems(false, 'status=all').subscribe(res => {
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
* Delete the audit plan
* @param id -audit plan id
*/
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._auditPlansService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAuditPlansStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAuditPlansStore.currentPage = Math.ceil(AmAuditPlansStore.totalItems / 15);
            this.pageChange(AmAuditPlansStore.currentPage);
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
    this.auditPlanObject.type = null;
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
   
  }

  deleteAuditPlan(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_audit_plan_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  editAuditPlan(id) {

    this._auditPlansService.getItem(id).subscribe(res => {

      this.auditPlanObject.values = {
        id: id,
        am_audit_category_id: res['am_audit_category'],
        am_annual_plan_frequency_id: res['am_annual_plan_frequency'],
        start_date: this._helperService.processDate(res['start_date'], 'split'),
        end_date: this._helperService.processDate(res['end_date'], 'split'),

      }
      this.auditPlanObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }




  gotoDetailsPage(id) {
    
    if (AuthStore.getActivityPermission(3900, 'AM_ANNUAL_PLAN_DETAILS')) {
      this._router.navigateByUrl('audit-management/am-audit-plans/' + id);
    }
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setAuditPlanSort(type) {
    this._auditPlansService.sortAuditPlanList(type);
    this.pageChange();
  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove(); 
    let userDetailObject: any = {};
    userDetailObject['id'] = user.created_by;
    userDetailObject['first_name'] = user.created_by_first_name;
    userDetailObject['last_name'] = user.created_by_last_name;
    userDetailObject['designation'] = user.created_by_designation;
    userDetailObject['image_token'] = user.created_by_image_token;
    userDetailObject['department'] = user.created_by_department;
    userDetailObject['email'] = user.created_by_email?user.created_by_email:'';
    userDetailObject['status_id'] = user.created_by_status_id?user.created_by_status_id:1;
    userDetailObject['mobile'] = user.created_by_mobile;
    return userDetailObject;
  
  }
  
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditPlanEventSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AmAuditPlansStore.searchText = '';
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    AmAuditPlansStore.unsetAuditPlanList();
  }

}
