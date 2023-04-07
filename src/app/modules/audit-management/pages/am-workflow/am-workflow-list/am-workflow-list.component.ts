import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
// import { AmWorkflowService } from 'src/app/core/services/am-management/am-workflow/am-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
// import { AmWorkflowStore } from 'src/app/stores/am-management/am-workflow/am-workflow-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmWorkflowStore } from 'src/app/stores/audit-management/am-workflow-store';
import { AmWorkflowService } from 'src/app/core/services/audit-management/am-workflow/am-workflow.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';


declare var $: any;

@Component({
  selector: 'app-am-workflow-list',
  templateUrl: './am-workflow-list.component.html',
  styleUrls: ['./am-workflow-list.component.scss']
})
export class AmWorkflowListComponent implements OnInit {
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

  AmWorkflowStore = AmWorkflowStore;
  popupControlEventSubscription: any;
  workflowAddModalSubscription:any;
  moduleGroup = [];
  moduleGroupId: number=3900;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _amWorkflowService: AmWorkflowService,
    private _router: Router,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'AUDIT_MANAGEMENT_WORKFLOW_LIST', submenuItem: {type: 'search'}},
        {activityName: 'AUDIT_MANAGEMENT_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        {activityName: 'CREATE_AUDIT_MANAGEMENT_WORKFLOW', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_AUDIT_MANAGEMENT_WORKFLOW', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_MANAGEMENT_WORKFLOW', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'IMPORT_AUDIT_MANAGEMENT_WORKFLOW', submenuItem: {type: 'import'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900,'CREATE_AUDIT_MANAGEMENT_WORKFLOW')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_am_workflow'});
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add';
              this.workFlowObject.values = null; // for clearing the value
              this.workFlowObject.module_id = this.moduleGroupId;
              this._utilityService.detectChanges(this._cdr);
              this.addAmTemplate();
            }, 1000);
            break;
          case "template":
            this._amWorkflowService.generateTemplate();
            break;
          case "export_to_excel":
            this._amWorkflowService.exportToExcel();
            break;
          case "search":
            AmWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            AmWorkflowStore.loaded = false;
            this.pageChange(1)
            break;
          case "import":
            ImportItemStore.setTitle('import_am_audit_workflow');
            ImportItemStore.setImportFlag(true);
              break;
          default:
            break;
        }
        
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._amWorkflowService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
      if(NoDataItemStore.clikedNoDataItem){
        this.workFlowObject.type = 'Add';
        this.workFlowObject.values = null; // for clearing the value
        this.workFlowObject.module_id = this.moduleGroupId;
        this._utilityService.detectChanges(this._cdr);
        this.addAmTemplate();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.workflowAddModalSubscription = this._eventEmitterService.auditManagementWorkflowAddModal.subscribe(res=>{
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

  pageChange(newPage:number=null){
    if (newPage) AmWorkflowStore.setCurrentPage(newPage);
    var module_id = AmWorkflowStore.moduleGroupId?AmWorkflowStore.moduleGroupId:this.moduleGroupId;
    this._amWorkflowService.getItems(false,'module_group_ids=3900').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  edit(id) {
    event.stopPropagation();
    this._amWorkflowService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title,
        module_ids: workFlowDetails.module.id,
        description:workFlowDetails.description
      }
      this.workFlowObject.type = 'Edit';
      AmWorkflowStore.addFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()

    })
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  gotToAmWorkflowDetails(id: number){
    this._router.navigateByUrl('/audit-management/am-workflows/'+id);
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
      this._amWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._amWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

      this._amWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title='Remove?';
    this.popupObject.subtitle = 'Do you want to remove Am workflow ?';
    this.popupObject.type = ''
    this.popupObject.status=status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'This action cannot be undone';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'This action cannot be undone';
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

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  addAmTemplate(){
    $(this.formModal.nativeElement).modal('show');
    this.workFlowObject.type="add";
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    AmWorkflowStore.searchText = null;
		SubMenuItemStore.searchText = '';
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    NoDataItemStore.unsetNoDataItems();
  }

}
