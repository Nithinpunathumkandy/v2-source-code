import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiWorkflowService } from 'src/app/core/services/kpi-management/kpi-workflow/kpi-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpiWorkflowStore } from 'src/app/stores/kpi-management/kpi-workflow/kpi-workflow-store';

declare var $: any;

@Component({
  selector: 'app-kpi-workflow-list',
  templateUrl: './kpi-workflow-list.component.html',
  styleUrls: ['./kpi-workflow-list.component.scss']
})
export class KpiWorkflowListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  workFlowObject = {
    values: null,
    type:null,
    module_id:null
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
    status:'',
    type:null
  };
  
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  KpiWorkflowStore = KpiWorkflowStore;
  
  popupControlEventSubscription: any;
  workflowAddModalSubscription:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  moduleGroup = [];
  moduleGroupId: number=3800;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _kpiWorkflowService: KpiWorkflowService,
    private _eventEmitterService:EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'KPI_MANAGEMENT_WORKFLOW_LIST', submenuItem: {type: 'search'}},
        {activityName: 'KPI_MANAGEMENT_WORKFLOW_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_KPI_MANAGEMENT_WORKFLOW', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_KPI_MANAGEMENT_WORKFLOW_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_KPI_MANAGEMENT_WORKFLOW', submenuItem: {type: 'export_to_excel'}},
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_KPI_MANAGEMENT_WORKFLOW')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
        }
        this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
        NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_workflow'});
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add';
              this.workFlowObject.values = null; // for clearing the value
              this.workFlowObject.module_id = this.moduleGroupId;
              this._utilityService.detectChanges(this._cdr);
              this.addKpiTemplate();
            }, 1000);
            break;
          case "template":
            this._kpiWorkflowService.generateTemplate();
            break;
          case "export_to_excel":
            this._kpiWorkflowService.exportToExcel();
            break;
          case "search":
            KpiWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            KpiWorkflowStore.loaded = false;
            this.pageChange(1)
            break;
          default:
            break;
        }
        
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.workFlowObject.type = 'Add';
        this.workFlowObject.values = null; // for clearing the value
        this.workFlowObject.module_id = this.moduleGroupId;
        this._utilityService.detectChanges(this._cdr);
        this.addKpiTemplate();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.workflowAddModalSubscription = this._eventEmitterService.kpiWorkflowAddModal.subscribe(res=>{
      this.pageChange();
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });
    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
      this.pageChange(1);
    }, 1000);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  edit(id) {
    event.stopPropagation();
    this._kpiWorkflowService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title,
        module_ids: workFlowDetails.module.id,
        description:workFlowDetails.description
      }
      this.workFlowObject.type = 'Edit';
      KpiWorkflowStore.addFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()

    })
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  gotToWorkflowDetails(id: number){
    this._router.navigateByUrl('/kpi-management/kpi-management-workflows/'+id);
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
      this._kpiWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._kpiWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

      this._kpiWorkflowService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange();
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      });
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
      this.clearPopupObject();
    }, 250);
  }

  closeModal(){
    $(this.formModal.nativeElement).modal('hide');
    this.workFlowObject.type = null;
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='delete';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this.popupObject.type = ''
    this.popupObject.status=status
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'activate';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this.popupObject.type='Activate'
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this.popupObject.type='Deactivate'
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);

  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  pageChange(newPage:number=null){
    if (newPage) KpiWorkflowStore.setCurrentPage(newPage);
    this._kpiWorkflowService.getAllItems(false,'&module_group_ids=3800').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addKpiTemplate(){
    this.workFlowObject.type="add";
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  // for sorting
  sortTitle(type: string) {
    this._kpiWorkflowService.sortWorkflowList(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    KpiWorkflowStore.searchText = null;
    SubMenuItemStore.searchText = '';
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    KpiWorkflowStore.unsetKpiWorkflow();
  }

}
