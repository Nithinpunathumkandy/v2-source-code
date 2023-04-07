import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BcpWorkflowService } from 'src/app/core/services/bcm/bcp-workflow/bcp-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcpWorkflowStore } from 'src/app/stores/bcm/bcp-workflow/bcp-workflow-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-bcp-workflow-list',
  templateUrl: './bcp-workflow-list.component.html',
  styleUrls: ['./bcp-workflow-list.component.scss']
})
export class BcpWorkflowListComponent implements OnInit {
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
  BcpWorkflowStore = BcpWorkflowStore;

  popupControlEventSubscription: any;
  workflowAddModalSubscription:any;
  networkFailureSubscription:any;
  idleTimeoutSubscription: any;
  
  moduleGroup = [];
  moduleGroupId: number=2800;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _bcpWorkflowService: BcpWorkflowService,
    private _helperService: HelperServiceService,
  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BcpWorkflowListComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    var subMenuItems = [
      {activityName: 'BUSINESS_CONTINUITY_PLAN_WORKFLOW_LIST', submenuItem: {type: 'search'}},
      {activityName: 'BUSINESS_CONTINUITY_PLAN_WORKFLOW_LIST', submenuItem: {type: 'refresh'}},
      {activityName: 'CREATE_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'new_modal'}},
      // {activityName: 'GENERATE_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'template'}},
      {activityName: 'EXPORT_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'export_to_excel'}},
    ]
    if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_BUSINESS_CONTINUITY_PLAN_WORKFLOW')){
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
              this.addNewBcpWorkflow();
            }, 1000);
            break;
          // case "template":
          //   this._bcpWorkflowService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._bcpWorkflowService.exportToExcel();
            break;
          case "search":
            BcpWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            BcpWorkflowStore.loaded = false;
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
        this.addNewBcpWorkflow();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.workflowAddModalSubscription = this._eventEmitterService.bcpWorkflowAddModal.subscribe(res=>{
      this.pageChange();
      this.closeFormModal();
    });

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
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      this.pageChange(1);
    }, 1000);
  }

  pageChange(newPage:number=null){
    if (newPage) BcpWorkflowStore.setCurrentPage(newPage);
    var module_id = BcpWorkflowStore.moduleGroupId?BcpWorkflowStore.moduleGroupId:this.moduleGroupId;
    this._bcpWorkflowService.getAllItems('?module_group_ids=2800').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  addNewBcpWorkflow(){
    this.workFlowObject.type = 'Add';
    this.workFlowObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    this.workFlowObject.type = null;
    this.workFlowObject.values = null;
    $(this.formModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteBcpWorkflow(status)
        break;
        case 'Activate': this.activateWorkflow(status)
        break;
      case 'Deactivate': this.deactivateWorkflow(status)
        break;
    }
  }

  deleteBcpWorkflow(status: boolean) {
    if (status && this.popupObject.id) {

      this._bcpWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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
      this._bcpWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._bcpWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

  gotToRiskWorkflowDetails(id: number) {
    this._router.navigateByUrl('/bcm/bcp-workflows/'+id);
  }

  edit(id: number) {
    event.stopPropagation();
    this._bcpWorkflowService.getItem(id).subscribe(res=>{
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.type = 'Edit';
      this.workFlowObject.values = res;
      this.openFormModal();
    })
  }

  deleteConfirm(id: number, status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='delete';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this.popupObject.type = ''
    this.popupObject.status=status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'activate';
    this.popupObject.subtitle = '	common_activate_subtitle';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'deactivate';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this.popupObject.type='Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
  }

 

   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BcpWorkflowListComponent
   */
  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    BcpWorkflowStore.searchText = null;
		SubMenuItemStore.searchText = '';
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
