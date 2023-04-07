import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillWorkflowService } from 'src/app/core/services/mock-drill/mock-drill-workflow/mock-drill-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillWorkflowStore } from 'src/app/stores/mock-drill/mock-drill-workflow/mock-drill-workflow-store';

declare var $: any;

@Component({
  selector: 'app-mock-drill-workflow-list',
  templateUrl: './mock-drill-workflow-list.component.html',
  styleUrls: ['./mock-drill-workflow-list.component.scss']
})
export class MockDrillWorkflowListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

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
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  MockDrillWorkflowStore = MockDrillWorkflowStore;
  popupControlEventSubscription: any;
  workflowAddModalSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  moduleGroup = [];
  moduleGroupId: number = 4600;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _mockDrillWorkflowService: MockDrillWorkflowService,
    private _router: Router,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_WORKFLOW_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MOCK_DRILL_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_MOCK_DRILL_WORKFLOW', submenuItem: { type: 'new_modal' } },
        // {activityName: 'GENERATE_MOCK_DRILL_WORKFLOW', submenuItem: {type: 'template'}},
        { activityName: 'EXPORT_MOCK_DRILL_WORKFLOW', submenuItem: { type: 'export_to_excel' } },
      ]
      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100, 'CREATE_MOCK_DRILL_WORKFLOW')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_workflow' });

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add';
              this.workFlowObject.values = null; // for clearing the value
              this.workFlowObject.module_id = this.moduleGroupId;
              this._utilityService.detectChanges(this._cdr);
              this.addMockDrillTemplate();
            }, 1000);
            break;
          case "export_to_excel":
            this._mockDrillWorkflowService.exportToExcel();
            break;
          case "search":
            MockDrillWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            MockDrillWorkflowStore.loaded = false;
            this.pageChange(1)
            break;
          default:
            break;
        }

        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.workFlowObject.type = 'Add';
        this.workFlowObject.values = null; // for clearing the value
        this.workFlowObject.module_id = this.moduleGroupId;
        this._utilityService.detectChanges(this._cdr);
        this.addMockDrillTemplate();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
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
    this.workflowAddModalSubscription = this._eventEmitterService.mockDrillWorkflowAddModal.subscribe(res => {
      this.pageChange();
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
      this.pageChange(1);
    }, 1000);
  }
  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  edit(id) {
    event.stopPropagation();
    this._mockDrillWorkflowService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title: workFlowDetails.title,
        module_ids: workFlowDetails.module.id,
        description: workFlowDetails.description
      }
      this.workFlowObject.type = 'Edit';
      MockDrillWorkflowStore.addFlag = false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()

    })
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  gotToMockDrillWorkflowDetails(id: number) {
    this._router.navigateByUrl('/mock-drill/mock-drill-workflows/' + id);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditTemplate(status)
        break;
      case 'Activate': this.activateWorkflow(status)
        break;
      case 'Deactivate': this.deactivateWorkflow(status)
        break;
    }
  }

  activateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._mockDrillWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._mockDrillWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

  deleteAuditTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._mockDrillWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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

  closeModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.workFlowObject.type = null;
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeConfirmationPopup() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteConfirm(id: number, status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Remove?';
    this.popupObject.subtitle = 'Do you want to remove Workflow ?';
    this.popupObject.type = ''
    this.popupObject.status = status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'This action cannot be undone';
    this.popupObject.type = 'Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deactivateConfirm(id: number) {
    if (event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'This action cannot be undone';
    this.popupObject.type = 'Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.style.height = '45px';
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  pageChange(newPage: number = null) {
    if (newPage) MockDrillWorkflowStore.setCurrentPage(newPage);
    var module_id = MockDrillWorkflowStore.moduleGroupId ? MockDrillWorkflowStore.moduleGroupId : this.moduleGroupId;
    this._mockDrillWorkflowService.getAllItems(false, '&module_group_ids=4600').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addMockDrillTemplate() {
    $(this.formModal.nativeElement).modal('show');
    this.workFlowObject.type = "add";
    this._utilityService.detectChanges(this._cdr);
  }

  // for sorting
  sortTitle(type: string) {
    this._mockDrillWorkflowService.sortWorkflowList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    MockDrillWorkflowStore.searchText = null;
    SubMenuItemStore.searchText = '';
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    MockDrillWorkflowStore.unsetMockDrillWorkflow();
  }

}
