import { Renderer2, ElementRef, ChangeDetectorRef, ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditWorkflowService } from 'src/app/core/services/internal-audit/audit-workflow/audit-workflow.service';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;
@Component({
  selector: 'app-audit-workflow-list',
  templateUrl: './audit-workflow-list.component.html',
  styleUrls: ['./audit-workflow-list.component.scss']
})
export class AuditWorkflowListComponent implements OnInit {
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
  AuditWorkflowStore=AuditWorkflowStore;
  OrganizationModulesStore = OrganizationModulesStore;
  popupControlEventSubscription: any;
  workflowAddModalSubscription:any;
  networkFailureSubscription: any;
  moduleGroup = [];
  moduleGroupId: number=1000;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _auditWorkflowService:AuditWorkflowService,
    private _router: Router,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INTERNAL_AUDIT_WORKFLOW_LIST', submenuItem: {type: 'search'}},
        { activityName: 'INTERNAL_AUDIT_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
        {activityName: 'CREATE_INTERNAL_AUDIT_WORKFLOW', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_INTERNAL_AUDIT_WORKFLOW', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INTERNAL_AUDIT_WORKFLOW', submenuItem: {type: 'export_to_excel'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_INTERNAL_AUDIT_WORKFLOW')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_workflow'});
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add';
              this.workFlowObject.values = null; // for clearing the value
              this.workFlowObject.module_id = this.moduleGroupId;
              this._utilityService.detectChanges(this._cdr);
              this.addAuditTemplate();
            }, 1000);
            break;
          // case "template":
          //   this._auditWorkflowService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditWorkflowService.exportToExcel();
            break;
          case "search":
            AuditWorkflowStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1)
            break;
          case "refresh":
            AuditWorkflowStore.loaded = false;
            this.pageChange(1)
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        setTimeout(() => {
          this.workFlowObject.type = 'Add';
          this.workFlowObject.values = null; // for clearing the value
          this.workFlowObject.module_id = this.moduleGroupId;
          this._utilityService.detectChanges(this._cdr);
          this.addAuditTemplate();
        }, 1000);
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }  
      }
    })
    
    this.workflowAddModalSubscription = this._eventEmitterService.auditWorkflowAddModal.subscribe(res=>{
      this.pageChange()
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });
    // this.getOrganizationModules();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: 'refresh' },
    //   {type:'new_modal'},
    //   // { type: 'template' },
    //   { type: 'export_to_excel' ,path:'internal-audit' }

    // ]);
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
      this.pageChange(1);
    }, 1000);
  }

  // getOrganizationModules() {
  //   this._organizationModuleService.getAllItems('?side_menu=false').subscribe();
  //   setTimeout(() => {
  //     OrganizationModulesStore.organizationModules.forEach(res => {
  //       this.moduleGroup.push(res)
  //     })
  //     this.setModuleId();
  //   }, 1000);
  // }

  // setModuleId(){
  //   this.moduleGroup.forEach(res=>{
  //     if(res.title=="Internal Audit"){
  //       this.moduleGroupId = res.id;
  //       AuditWorkflowStore.moduleGroupId = res.id;
  //       return;
  //     }
  //   })
  // }

  gotToAuditWorkflowDetails(id: number){
    this._router.navigateByUrl('/internal-audit/workflow/'+id);
  }

  addAuditTemplate(){
    $(this.formModal.nativeElement).modal('show');
    this.workFlowObject.type="add";
    this._utilityService.detectChanges(this._cdr);
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
      this._auditWorkflowService.activate(this.popupObject.id).subscribe(resp => {
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

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  deleteAuditTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditWorkflowService.delete(this.popupObject.id).subscribe(resp => {
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

  deactivateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._auditWorkflowService.deactivate(this.popupObject.id).subscribe(resp => {
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

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';

  }

  closeModal(){
    $(this.formModal.nativeElement).modal('hide');
    this.workFlowObject.type = null;
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  edit(id) {
    event.stopPropagation();
    this._auditWorkflowService.getItem(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.module_id = this.moduleGroupId;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title,
        audit_categories:workFlowDetails.audit_categories?this.getEditData(workFlowDetails.audit_categories):[],
        module_ids: workFlowDetails.module.id,
        description:workFlowDetails.description
      }
      this.workFlowObject.type = 'Edit';
      AuditWorkflowStore.addFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()
    })
  }

  getEditData(data) {
    var returnData = []
    
    data.forEach(element => {
      returnData.push(element.id)
    });
    return returnData;
  }

  openFormModal() {

    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='Remove?';
    this.popupObject.subtitle = 'Do you want to remove Audit workflow ?';
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

  pageChange(newPage:number=null){
    if (newPage) AuditWorkflowStore.setCurrentPage(newPage);
    var module_id = AuditWorkflowStore.moduleGroupId?AuditWorkflowStore.moduleGroupId:this.moduleGroupId;
    this._auditWorkflowService.getItems(false,'&module_group_ids=1000').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.workflowAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    AuditWorkflowStore.searchText = null;
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AuditWorkflowStore.searchText = '';
    AuditWorkflowStore.loaded=false
  }
}
