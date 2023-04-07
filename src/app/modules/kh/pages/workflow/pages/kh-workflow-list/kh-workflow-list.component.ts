import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import {WorkFlowStore } from 'src/app/stores/knowledge-hub/work-flow/workFlow.store'
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';

declare var $: any;

@Component({
  selector: 'app-kh-workflow-list',
  templateUrl: './kh-workflow-list.component.html',
  styleUrls: ['./kh-workflow-list.component.scss']
})
export class KhWorkflowListComponent implements OnInit {

  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  OrganizationModulesStore = OrganizationModulesStore;
  WorkFlowStore = WorkFlowStore;
  KHSettingStore=KHSettingStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  deleteEventSubscription: any;
  modalEventSubscription: any;
  ModalStyleSubscriptionEvent: any;
  networkFailureSubscription: any;
  
  
  workFlowObject = {
    values: null,
    type:null
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

  ReviewUserDetailObject = {
    id:null,
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    department:'',
    status_id:null
    
  }

  ApprovalUserDetailObject = {
    id:null,
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    department:'',
    status_id:null
  }
  
  filterSubscription: Subscription = null;

  constructor(
    private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _workFlowService: WorkflowService,
    private _imageService: ImageServiceService,
    private _khFileService: KhFileServiceService,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _organizationModuleService: OrganizationModulesService,
    private _KhSettingsService:KhSettingsService
  ) { }

  ngOnInit(): void {


    this.checkKHSettings();
    RightSidebarLayoutStore.showFilter = true;
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.WorkFlowStore.workFlowLoaded = false;
      this.pageChange();
    })

    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      this.setSubMenu()
      if(!KHSettingStore.khSettingsItems?.is_document_workflow)
      NoDataItemStore.setNoDataItems({title: "Looks like workflow is disabled!", subtitle: 'Enable Worfklow to add workflow to the engine.'});
      else
      NoDataItemStore.setNoDataItems({title: "Looks like we don't have Workflow's added here!", subtitle: 'Add Worfklow if there is any. To add, simply tap the button below. ',buttonText: 'Add New Workflow'});

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.workFlowObject.type = 'Add'
              WorkFlowStore.addFlag=true;
              this.workFlowObject.values=null
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          case "refresh":
            WorkFlowStore.unsetWorkFlowList();
            // this.getOrganizationModules()
              this.pageChange(1);
            break;
            case "search":
            WorkFlowStore.searchText = SubMenuItemStore.searchText;
            // this.getOrganizationModules()
            this.pageChange(1);
            break;
            // case "template":
            //   this._workFlowService.generateTemplate();
            //   break;
            case "export_to_excel":
              this._workFlowService.exportToExcel();
              break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.workFlowObject.type = 'Add'
        this.workFlowObject.values=null
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }  
      }
    })
    // SubScribing to Set the Style of Modal Once Closed in Child Component.

    this.ModalStyleSubscriptionEvent = this._eventEmitterService.ModalStyle.subscribe(res => {

      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    })

    SubMenuItemStore.setNoUserTab(true);
    this.getOrganizationModules()

    RightSidebarLayoutStore.filterPageTag = 'kh_workflow';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'document_type_ids'
    ]);
    this.pageChange(1)
    // this.getInitialData()

  }

  checkKHSettings(){
    this._KhSettingsService.getItems().subscribe()

  }

  setSubMenu(){
    var subMenuItems = [
      {activityName: 'DOCUMENT_WORKFLOW_LIST', submenuItem: {type: 'search'}},
      {activityName: 'DOCUMENT_WORKFLOW_LIST', submenuItem: { type: 'refresh' } },
      // {activityName: 'GENERATE_DOCUMENT_WORKFLOW', submenuItem: {type: 'template'}},
      {activityName: 'EXPORT_DOCUMENT_WORKFLOW', submenuItem: { type: 'export_to_excel' } }
    ]

    if(KHSettingStore.khSettingsItems?.is_document_workflow)
    subMenuItems.splice(1,0, {activityName: 'CREATE_DOCUMENT_WORKFLOW', submenuItem: {type: 'new_modal'}})

    this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
  }
  
  // * Getting Module Group Id

  getOrganizationModules() {
    if (OrganizationModulesStore.loaded) {
      let moduleGroup = OrganizationModulesStore.organizationModules.find(element => element.client_side_url == "/knowledge-hub")
      WorkFlowStore.moduleGroupId = moduleGroup.id;
      this.pageChange(1);
    }
    else{
      this._organizationModuleService.getAllItems('?side_menu=true').subscribe(res=>{
        let moduleGroup = OrganizationModulesStore.organizationModules.find(element => element.client_side_url == "/knowledge-hub")
        WorkFlowStore.moduleGroupId = moduleGroup.id;
        this.pageChange(1);
      })
    }  
  }

  pageChange(newPage: number = null) {
      if (newPage) WorkFlowStore.setCurrentPage(newPage);
      this._workFlowService
        .getAllItems(false,`&module_group_ids=${WorkFlowStore.moduleGroupId}`)
        .subscribe(() =>
          setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
        );
  }

  edit(id) {
    event.stopPropagation();
    this._workFlowService.getItemById(id).subscribe(res => {
      var workFlowDetails = res;
      this.workFlowObject.values = {
        id: workFlowDetails.id,
        title:workFlowDetails.title ,
        description: workFlowDetails.description,
        document_type_ids: workFlowDetails.document_types ? this.getEditData(workFlowDetails.document_types) : [],
        module_id:workFlowDetails.module?.id
      }

      this.workFlowObject.type = 'Edit';
      WorkFlowStore.addFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()

    })
  }


  
  
assignReviewUsers(user) {
    
  if (user) {
  this.ReviewUserDetailObject.first_name =user.user.first_name,
  this.ReviewUserDetailObject.last_name = user.user.last_name,
  this.ReviewUserDetailObject.designation = user.user.designation,
  this.ReviewUserDetailObject.image_token = user.user.image.token
  this.ReviewUserDetailObject.email = user.user.email,
  this.ReviewUserDetailObject.mobile = user.user.mobile?user.user.mobile:99999
  this.ReviewUserDetailObject.id = user.id,
  this.ReviewUserDetailObject.status_id = user.user.status.id;
  this.ReviewUserDetailObject.department = user.user.department;
    return this.ReviewUserDetailObject;
  }
  
  }
  
  assignApprovalUsers(user) {
    
    if (user) {
    this.ApprovalUserDetailObject.first_name =user.user.first_name,
    this.ApprovalUserDetailObject.last_name = user.user.last_name,
    this.ApprovalUserDetailObject.designation = user.user.designation,
    this.ApprovalUserDetailObject.image_token = user.user.image.token
    this.ApprovalUserDetailObject.email = user.user.email,
    this.ApprovalUserDetailObject.mobile = user.user.mobile?user.user.mobile:99999
    this.ApprovalUserDetailObject.id = user.id,
    this.ApprovalUserDetailObject.status_id = user.user.status.id;
    this.ApprovalUserDetailObject.department = user.user.department;
      return this.ApprovalUserDetailObject;
    }
    
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

  closeFormModal() {
    this.pageChange(1);
    $(this.formModal.nativeElement).modal('hide');
    this.workFlowObject.type = null;
  }

  gotoDetails(id) {
    this._router.navigateByUrl("/knowledge-hub/work-flow/" + id);
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

  
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token, type) {
    return this._khFileService.getThumbnailPreview(type,token);
  }

  delete(id: number) {

    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.title='Delete WorkFlow?';
    this.deleteObject.subtitle = 'This action cannot be undone';

   
    $(this.deletePopup.nativeElement).modal('show');

  }

  deleteConfirm(id: number,status) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title='Delete Control?';
    this.popupObject.subtitle = 'it_will_delete_the_workflow_from_the_workflow_engine';
    this.popupObject.type = ''
    this.popupObject.status=status
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  
  activateConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'it_will_activate_the_workflow_from_the_workflow_engine';
    this.popupObject.type='Activate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  deactivateConfirm(id: number) {
    if(event) event.stopPropagation();
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'it_will_deactivate_the_workflow_from_the_workflow_engine';
    this.popupObject.type='Deactivate'
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteWorkflow(status)
        break;
      case 'Activate': this.activateWorkflow(status)
        break;
      case 'Deactivate': this.deactivateWorkflow(status)
        break;

    }

  }

  
  // Delete Workflow
  
  deleteWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      if (this.popupObject.status == 'Inactive') {
        if (status && this.popupObject.id) {
          this._workFlowService.delete(this.popupObject.id).subscribe(resp => {
            setTimeout(() => {
              // this.pageChange(1)
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopup();
            this.clearPopupObject();
          });
        }
        else {
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }
      }
      else {
            
      this._workFlowService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          // this.pageChange(1)
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.closeConfirmationPopup();
      }, (error => {
        if (error.status == 405) {
          let id = this.popupObject.id;
          this.clearPopupObject();
          this.closeConfirmationPopup();
          setTimeout(() => {
            this.deactivateConfirm(id);
          }, 500);
        }
      })
      );
    }
      }
      else {
        this.closeConfirmationPopup();
        this.clearPopupObject();
      }  
    }

  
   // Activate  Work Flow 

   activateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._workFlowService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange(1)
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  // Deactivate WorkFlow 

  deactivateWorkflow(status: boolean) {
    if (status && this.popupObject.id) {
      this._workFlowService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.pageChange(1)
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
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

}

closeConfirmationPopup(){
  $(this.confirmationPopUp.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}



  setControlSort(type) {
    WorkFlowStore.setCurrentPage(1);
    this._workFlowService.sortWorkflowList(type,true);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title='';
    this.deleteObject.subtitle='';

  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    SubMenuItemStore.searchText = null;
    this.deleteEventSubscription.unsubscribe();
    this.modalEventSubscription.unsubscribe();
    this.ModalStyleSubscriptionEvent.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    WorkFlowStore.searchText = '';
    WorkFlowStore.workFlowLoaded=false
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }


}
