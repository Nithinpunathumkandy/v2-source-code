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
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AmAnnualAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan.service';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';

import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAnnualAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan-workflow.store';
import { AmAnnualAuditPlanWorkflowService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan-workflow/am-annual-audit-plan-workflow.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-am-annual-audit-plan',
  templateUrl: './am-annual-audit-plan.component.html',
  styleUrls: ['./am-annual-audit-plan.component.scss']
})
export class AmAnnualAuditPlanComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  ImportItemStore = ImportItemStore;
  AmAnnualAuditPlansStore = AmAnnualAuditPlansStore;
  AmAuditPlansStore = AmAuditPlansStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmAnnualAuditPlanWorkflowStore = AmAnnualAuditPlanWorkflowStore;


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
  // pipe = new DatePipe('en-US');

  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _annualAuditPlansService: AmAnnualAuditPlanService,
    private _auditPlansService: AmAuditPlanService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _auditPlanWorkflowService: AmAnnualAuditPlanWorkflowService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.AmAnnualAuditPlansStore.unsetIndiviudalAnnualAuditPlanDetails();
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.AmAnnualAuditPlansStore.loaded = false;
      this.pageChange(1);
    });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'AM_ANNUAL_PLAN_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_AM_ANNUAL_PLAN_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_AM_ANNUAL_PLAN', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close',path:'/audit-management/am-audit-plans' } },
      ]


      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_annual_audit_plan' });
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_ANNUAL_PLAN')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewAuditPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }


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

          // case "template":

          //   this._annualAuditPlansService.generateTemplate();
          //   break;

          case "export_to_excel":
            this._annualAuditPlansService.exportToExcel();
            break;

          case "search":
            AmAnnualAuditPlansStore.searchText = SubMenuItemStore.searchText;

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
        this._annualAuditPlansService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    this.auditPlanEventSubscription = this._eventEmitterService.auditManagementAnnualAuditPlanAddModal.subscribe(item => {
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

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })


    this.pageChange(1);
    // this.getWorkflow();

    SubMenuItemStore.setNoUserTab(true);

    RightSidebarLayoutStore.filterPageTag = 'am_anual_audit_plan_details';
    this._rightSidebarFilterService.setFiltersForCurrentPage([

      'am_annual_plan_auditable_item_ids',
      'am_annual_plan_frequency_item_ids',
      'audit_manager_ids',
      // 'am_audit_status_ids',
      'department_ids'
    ]);

  }

  getWorkflow() {
    this._auditPlanWorkflowService.getItems(AmAuditPlansStore.auditPlanId, AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addNewAuditPlan() {

    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }



  openFormModal() {
    // event.stopPropagation();
    this.auditPlanObject.type = 'Add';
    this.auditPlanObject.values = null;
    // setTimeout(() => {
    $(this.formModal.nativeElement).modal('show');
    // }, 200);
    this._utilityService.detectChanges(this._cdr);

  }

  pageChange(newPage: number = null) {
    AmAnnualAuditPlansStore.loaded = false;
    if (newPage) AmAnnualAuditPlansStore.setCurrentPage(newPage);
    this._annualAuditPlansService.getItems(false, 'status=all').subscribe(res => {
      // this.setSubmenu();
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
        case '': type = this._annualAuditPlansService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        // this.setSubmenu();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (AmAnnualAuditPlansStore.currentPage > 1 && this.deleteObject.type == '') {
            AmAnnualAuditPlansStore.currentPage = Math.ceil(AmAnnualAuditPlansStore.totalItems / 15);
            this.pageChange(AmAnnualAuditPlansStore.currentPage);
            // this.getAuditPlan();
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
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.auditPlanObject.type = null;
    // this.setSubmenu()
    this._utilityService.detectChanges(this._cdr);
  }

  deleteAuditPlan(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_annual_audit_plan_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }


  editAuditPlan(id) {

    this._annualAuditPlansService.getItem(id).subscribe(res => {

      this.auditPlanObject.values = {
        id: id,
        am_annual_plan_id: AmAuditPlansStore?.auditPlanId,
        am_annual_plan_auditable_item_id: res['am_annual_plan_auditable_item'],
        am_annual_plan_frequency_item_id: res['am_annual_plan_frequency_item'],
        audit_manager_id: res['audit_manager'],
        start_date: this._helperService.processDate(res['start_date'], 'split'),
        end_date: this._helperService.processDate(res['end_date'], 'split'),
        hours: res['hours'],
        user_ids: res['auditors'],
        department_ids: res['departments']

      }
      this.auditPlanObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
        this._utilityService.detectChanges(this._cdr);
      }, 100);

    })
  }

  getDetails(id) {

    // this._annualAuditPlansService.getItem(id).subscribe(res => {
    //   this.getWorkflow();
    //   this._utilityService.detectChanges(this._cdr);
      // setTimeout(() => {
        this._router.navigateByUrl('/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans/' + id)
        // $(this.detailsModal.nativeElement).modal('show');
      // }, 100);
    // })

  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }



  setAuditPlanSort(type) {
    this._annualAuditPlansService.sortAuditPlanList(type);
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



  clearDeleteObject() {

    this.deleteObject.id = null;
  }




  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditPlanEventSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    SubMenuItemStore.searchText = '';
    AmAnnualAuditPlansStore.searchText = '';
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    this._rightSidebarFilterService.resetFilter();
    AmAnnualAuditPlansStore.unsetIndividualAuditPlanList();

  }


}
