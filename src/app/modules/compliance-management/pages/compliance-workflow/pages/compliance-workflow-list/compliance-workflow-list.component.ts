import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ComplianceWorkflowService } from 'src/app/core/services/compliance-management/compliance-workflow/compliance-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ComplianceWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/compliance-workflow-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-compliance-workflow-list',
  templateUrl: './compliance-workflow-list.component.html',
  styleUrls: ['./compliance-workflow-list.component.scss']
})
export class ComplianceWorkflowListComponent implements OnInit {
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
  ComplianceWorkflowStore = ComplianceWorkflowStore
  popupControlEventSubscription: any;
  workflowAddModalSubscription:any;
  moduleGroup = [];
  moduleGroupId: number=2500;

  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _complianceWorkflowService: ComplianceWorkflowService,
    private _router: Router,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'COMPLIANCE_WORKFLOW_LIST', submenuItem: {type: 'search'}},
        {activityName: 'COMPLIANCE_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        {activityName: 'CREATE_COMPLIANCE_WORKFLOW', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_COMPLIANCE_WORKFLOW', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_COMPLIANCE_WORKFLOW', submenuItem: {type: 'export_to_excel'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_COMPLIANCE_WORKFLOW')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_compliance_workflow'});
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add';
              this.workFlowObject.values = null; // for clearing the value
              this.workFlowObject.module_id = this.moduleGroupId;
              this._utilityService.detectChanges(this._cdr);
              this.addRiskTemplate();
            }, 1000);
            break;
          case "template":
            this._complianceWorkflowService.generateTemplate();
            break;
          case "export_to_excel":
            this._complianceWorkflowService.exportToExcel();
            break;
          case "search":
            ComplianceWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            ComplianceWorkflowStore.loaded = false;
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
        this.addRiskTemplate();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.workflowAddModalSubscription = this._eventEmitterService.ComplianceWorkflowAddModal.subscribe(res=>{
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
    if (newPage) ComplianceWorkflowStore.setCurrentPage(newPage);
    var module_id = ComplianceWorkflowStore.moduleGroupId?ComplianceWorkflowStore.moduleGroupId:this.moduleGroupId;
    this._complianceWorkflowService.getAllItems('?module_group_ids=2500').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  edit(id) {
    event.stopPropagation();
    this._complianceWorkflowService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title,
        module_ids: workFlowDetails.module.id,
        description:workFlowDetails.description
      }
      this.workFlowObject.type = 'Edit';
      ComplianceWorkflowStore.addFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()

    })
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
      this._complianceWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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
      this._complianceWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

      this._complianceWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
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

  addRiskTemplate(){
    $(this.formModal.nativeElement).modal('show');
    this.workFlowObject.type="add";
    this._utilityService.detectChanges(this._cdr);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  gotToComplianceWorkflowDetails(id: number){
    this._router.navigateByUrl('/compliance-management/compliance-workflows/'+id);
  }

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='Remove?';
    this.popupObject.subtitle = 'remove_compliance_workflow';
    this.popupObject.type = ''
    this.popupObject.status=status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this.popupObject.type='Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  closeModal(){
    $(this.formModal.nativeElement).modal('hide');
    this.workFlowObject.type = null;
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
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

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.workflowAddModalSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
