import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs'
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators'
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { StrategyWorkflowStore } from 'src/app/stores/strategy-management/strategy-workflow.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyWorkflowService } from 'src/app/core/services/strategy-management/strategy-workflow/strategy-workflow.service';

declare var $: any;
@Component({
  selector: 'app-strategy-workflow-list',
  templateUrl: './strategy-workflow-list.component.html',
  styleUrls: ['./strategy-workflow-list.component.scss']
})
export class StrategyWorkflowListComponent implements OnInit {

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

  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  StrategyWorkflowStore = StrategyWorkflowStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  workflowAddModalSubscription: any;
  popupControlEventSubscription: any;
  reactionDisposer: IReactionDisposer;

  moduleGroup = [];
  moduleGroupId: number = 3200;

  private strategyWorkflow$ = new Subject()

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _strategyWorkflowService: StrategyWorkflowService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      var subMenuItems = [
        { activityName: 'STRATEGY_WORKFLOW_LIST', submenuItem: { type: 'search' } },
        { activityName: 'STRATEGY_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_STRATEGY_WORKFLOW', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_STRATEGY_WORKFLOW', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_STRATEGY_WORKFLOW', submenuItem: { type: 'export_to_excel' } },
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_STRATEGY_WORKFLOW')){
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
            this._strategyWorkflowService.generateTemplate();
            break;
          case "export_to_excel":
            this._strategyWorkflowService.exportToExcel();
            break;
          case "search":
            StrategyWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            StrategyWorkflowStore.loaded = false;
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

    this.workflowAddModalSubscription = this._eventEmitterService.strategyWorkflowAddModal.subscribe(res => {
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
    if (newPage) StrategyWorkflowStore.setCurrentPage(newPage);
    this._strategyWorkflowService.getItems(false,'&module_group_ids=3200').pipe(takeUntil(this.strategyWorkflow$)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
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
      this._strategyWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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
      this._strategyWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._strategyWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

  gotToStrategyWorkflowDetails(id: number) {
    this._router.navigateByUrl('/strategy-management/strategy-workflows/' + id);
  }

  edit(id: number) {
    event.stopPropagation();
    this._strategyWorkflowService.getItem(id).subscribe(res => {
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
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type = 'Activate'
    this.popupObject.title = 'activate';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
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

  //Don't forget to to unsubscribe/unset event and http calls and store
  ngOnDestroy() {
    SubMenuItemStore.makeEmpty()
    this.strategyWorkflow$.next()
    this.strategyWorkflow$.complete()
    SubMenuItemStore.searchText = ''
    StrategyWorkflowStore.searchText = null
    this.idleTimeoutSubscription.unsubscribe()
    StrategyWorkflowStore.unsetStrategyWorkflow()
    this.networkFailureSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    this.popupControlEventSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false
  }
}