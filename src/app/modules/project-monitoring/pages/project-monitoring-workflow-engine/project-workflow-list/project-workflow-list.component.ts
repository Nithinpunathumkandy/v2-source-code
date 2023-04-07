import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectWorkflowServiceService } from 'src/app/core/services/project-monitoring/project-monitoring-workflow/project-workflow-service.service';
import { StrategyWorkflowService } from 'src/app/core/services/strategy-management/strategy-workflow/strategy-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProjectMonitoringWorkflowStore } from 'src/app/stores/project-monitoring/project-monitoring-workflow.store';
declare var $: any;

@Component({
  selector: 'app-project-workflow-list',
  templateUrl: './project-workflow-list.component.html',
  styleUrls: ['./project-workflow-list.component.scss']
})
export class ProjectWorkflowListComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;

  workFlowObject = {
    values: null,
    type: null,
    module_id: null
  }

  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
  };

  popupObject = {
    title: '',
    id: null,
    subtitle: '',
    status: '',
    type: null
  };
  moduleGroup = [];
  moduleGroupId: number = 3700;
  networkFailureSubscription: any;
  workflowAddModalSubscription: any;
  popupControlEventSubscription: any;
  idleTimeoutSubscription: any;
  ProjectMonitoringWorkflowStore = ProjectMonitoringWorkflowStore;
  AuthStore = AuthStore
  AppStore = AppStore
  reactionDisposer: IReactionDisposer;

  private strategyWorkflow$ = new Subject()

  constructor(  private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projctWorkflowService: ProjectWorkflowServiceService,) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      var subMenuItems = [
        { activityName: 'PROJECT_WORKFLOW_LIST', submenuItem: { type: 'search' } },
        { activityName: 'PROJECT_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_PROJECT_WORKFLOW', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_PROJECT_WORKFLOW', submenuItem: { type: 'template' } },
        // { activityName: 'EXPORT_PROJECT_WORKFLOW', submenuItem: { type: 'export_to_excel' } },
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_PROJECT_WORKFLOW')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
        }
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_workflow' });
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addNewStrategyWorkflow();
            break;
          case "template":
            this._projctWorkflowService.generateTemplate();
            break;
          case "export_to_excel":
            this._projctWorkflowService.exportToExcel();
            break;
          case "search":
            ProjectMonitoringWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            ProjectMonitoringWorkflowStore.loaded = false;
            this.pageChange(1)
            break;
          default:
            break;
        }

        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
         this.addNewStrategyWorkflow();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
       this.modalControl(item);
    })

    this.workflowAddModalSubscription = this._eventEmitterService.projectWorkflowAddModal.subscribe(res => {
       this.closeFormModal();
    });

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      this.pageChange(1);
    }, 1000);
  }

  pageChange(newPage: number = null) {
    if (newPage) ProjectMonitoringWorkflowStore.setCurrentPage(newPage);
    this._projctWorkflowService.getItems(false,'&module_group_ids=3700').pipe(takeUntil(this.strategyWorkflow$)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  gotToProjectWorkflowDetails(id: number) {
     this._router.navigateByUrl('/project-monitoring/Workflow/' + id);
  }

  addNewStrategyWorkflow() {
    this.workFlowObject.type = 'Add';
    this.workFlowObject.values = null; // for clearing the value
    this.workFlowObject.module_id = this.moduleGroupId;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal() {
    this.workFlowObject.type = null;
    this.workFlowObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStrategyWorkflow(status)
        break;
      case 'Activate': this.activateWorkflow(status)
        break;
      case 'Deactivate': this.deactivateWorkflow(status)
        break;
    }
  }

  deleteStrategyWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._projctWorkflowService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
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

  activateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._projctWorkflowService.activate(this.popupObject.id).subscribe(resp => {
        this.pageChange(1);
        this.closeConfirmationPopup();
        this.clearPopupObject();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  deactivateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._projctWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
        this.pageChange(1);
        this.closeConfirmationPopup();
        this.clearPopupObject();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  closeConfirmationPopup() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
  edit(id: number) {
    event.stopPropagation();
    this._projctWorkflowService.getItem(id).subscribe(res => {
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.type = 'Edit';
      this.workFlowObject.values = res;
      this.openFormModal();
    })
  }

  deleteConfirm(id: number, status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = ''
    this.popupObject.status = status
    this.popupObject.title = 'delete';
    this.popupObject.subtitle = 'pm_workflow_delete_message';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = 'Activate'
    this.popupObject.title = 'activate';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.type = 'Deactivate'
    this.popupObject.title = 'deactivate';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearPopupObject() {
    this.popupObject.id = null
    this.popupObject.type = ''
    this.popupObject.title = ''
    this.popupObject.subtitle = ''
  }
  ngOnDestroy() {
    SubMenuItemStore.makeEmpty()
    this.strategyWorkflow$.next()
    this.strategyWorkflow$.complete()
    SubMenuItemStore.searchText = ''
    ProjectMonitoringWorkflowStore.searchText = null
    this.idleTimeoutSubscription.unsubscribe()
    ProjectMonitoringWorkflowStore.unsetProjectWorkflow()
    this.networkFailureSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false
  }
}
