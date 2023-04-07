import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventWorkflowService } from 'src/app/core/services/event-monitoring/event-workflow/event-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventWorkflowStore } from 'src/app/stores/event-monitoring/event-workflow/event-workflow-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

declare var $: any;
@Component({
  selector: 'app-event-workflow-details',
  templateUrl: './event-workflow-details.component.html',
  styleUrls: ['./event-workflow-details.component.scss']
})
export class EventWorkflowDetailsComponent implements OnInit {
  
  @ViewChild('userAddModal', { static: true }) userAddModal: ElementRef;
  @ViewChild('designationAddModal', { static: true }) designationAddModal: ElementRef;
  @ViewChild('headUnitAddModal', { static: true }) headUnitAddModal: ElementRef;
  @ViewChild('teamAddModal', { static: true }) teamAddModal: ElementRef;
  @ViewChild('roleAddModal', { static: true }) roleAddModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commonModal') commonModal: ElementRef;

  SubMenuItemStore = SubMenuItemStore;
  EventWorkflowStore = EventWorkflowStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  workflowId: number;
  workflowUserAddModalSubscription: any;
  workFlowSourceData = {
    values: null,
    type: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  deleteObject = {
    title: '',
    id: null,
    subtitle: '',
    type: '',
    teamType:''
  };
  popupControlEventSubscription: any;
  nextLevelId: number;
  workflowType: string;
  showDiv: boolean=false;
  reactionDisposer: IReactionDisposer;
  modalStyleSubscription: any;
  workflowDesignationAddModalSubscription: any;
  workflowHeadUnitAddModalSubscription: any;
  workflowTeamAddModalSubscription: any;
  workflowRoleAddModalSubscription: any;
  workflowCommonAddModalSubscription: any;
  workflowSystemRoleModalSubscription: any;
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _eventWorkflowService: EventWorkflowService,
    private _route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      EventWorkflowStore.workflowId = id;
      this.workflowId = id;
      this.getWorkflow(id);
    });
    this.reactionDisposer = autorun(() => {
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.swithDivStatus();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    // NoDataItemStore.setNoDataItems({title: "no_risk_workflow_data", subtitle: 'no_risk_workflow_sub_data', buttonText: 'add_workflow'});
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }
    ]);
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteWorkflow(item);
    })
    this.modalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
      this.setZindex()
    })
    this.workflowUserAddModalSubscription = this._eventEmitterService.workflowUserAddModal.subscribe(res => {
      this.closeModal(1)
    });
    this.workflowDesignationAddModalSubscription = this._eventEmitterService.workflowDesignationAddModal.subscribe(res => {
      this.closeModal(2)
    });
    this.workflowHeadUnitAddModalSubscription = this._eventEmitterService.workflowHeadUnitAddModal.subscribe(res => {
      this.closeModal(3)
    });
    this.workflowTeamAddModalSubscription = this._eventEmitterService.workflowTeamAddModal.subscribe(res => {
      this.closeModal(4)
    });
    this.workflowRoleAddModalSubscription = this._eventEmitterService.workflowRoleAddModal.subscribe(res => {
      this.closeModal(5)
    });
    this.workflowSystemRoleModalSubscription = this._eventEmitterService.workflowSystemRoleModal.subscribe(res => {
      this.closeModal(7)
    });
    this.workflowCommonAddModalSubscription = this._eventEmitterService.auditWorkflowCommonAddModal.subscribe(res => {
      this.closeModal(6)
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
    // this.workflowUserAddModalSubscription = this._eventEmitterService.workflowSystemRoleModal.subscribe(res => {
    //   this.closeModal(7)
    // });
    this.modalStyleSubscription = this._eventEmitterService.ModalStyle.subscribe(res => {
      this.setZindex()
    })
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }


  getWorkflow(id) {
    this._eventWorkflowService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.nextLevelId = res.workflow_items.length + 1;
    });
  }

  closeModal(popUp: number) {
    if (!EventWorkflowStore.workflowPopupEnabled) {
      this.workFlowSourceData.type = null;
      this.workFlowSourceData.values = null;
    }

    if (popUp == 1) {
      $(this.userAddModal.nativeElement).modal('hide');
    }
    if (popUp == 2) {
      $(this.designationAddModal.nativeElement).modal('hide');
    }
    if (popUp == 3) {
      $(this.headUnitAddModal.nativeElement).modal('hide');
    }
    if (popUp == 4) {
      $(this.teamAddModal.nativeElement).modal('hide');
    }
    if (popUp == 5) {
      $(this.roleAddModal.nativeElement).modal('hide');
    }
    if (popUp == 6) {
      $(this.commonModal.nativeElement).modal('hide');
    }
    // if (popUp == 7) {
    //   $(this.systemRoleAddModal.nativeElement).modal('hide');
    // }
    // this.getAuditWorkflow()
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  setZindex() {
    this._renderer2.setStyle(this.commonModal.nativeElement, 'z-index', '999999');
    this._renderer2.setStyle(this.commonModal.nativeElement, 'overflow', 'auto');
  }

  changeZIndex(){
    if($(this.commonModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.commonModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.commonModal.nativeElement,'overflow','scroll');
    }
    if($(this.roleAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.roleAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.roleAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.teamAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.teamAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.teamAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.userAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.userAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.userAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.headUnitAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.headUnitAddModal.nativeElement,'overflow','scroll');
    }
    if($(this.designationAddModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.designationAddModal.nativeElement,'z-index',99999);
      this._renderer2.setStyle(this.designationAddModal.nativeElement,'overflow','scroll');
    }
    // if($(this.systemRoleAddModal.nativeElement).hasClass('show')){
    //   this._renderer2.setStyle(this.systemRoleAddModal.nativeElement,'z-index',99999);
    //   this._renderer2.setStyle(this.systemRoleAddModal.nativeElement,'overflow','scroll');
    // }
  }

  workflowPopupsSections(type: string,level?) {
    this.workFlowSourceData = {
      values: null,
      type: null
    }

    this.workFlowSourceData.type = type
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: EventWorkflowStore.EventWorkflowDetails.workflow_items.length+1,
      module:'EM',
      moduleGroupId:4000
    }
    switch (type) {
      case 'user':
        $(this.userAddModal.nativeElement).modal('show');
        break;
      case 'designation':
        $(this.designationAddModal.nativeElement).modal('show');
        break;
      case 'headOfUnit':
        $(this.headUnitAddModal.nativeElement).modal('show');
        break;
      case 'team':
        $(this.teamAddModal.nativeElement).modal('show');
        break;
      case 'role':
        $(this.roleAddModal.nativeElement).modal('show');
        break;
      // case 'system_role':
      //   $(this.systemRoleAddModal.nativeElement).modal('show');
      //   break;

      case 'common':

        EventWorkflowStore.workflowPopupEnabled = true;
          this.workFlowSourceData.values = {
            workflowId: this.workflowId,
            level: level + 1,
            module:'EM',
            moduleGroupId:4000
          }
          $(this.commonModal.nativeElement).modal('show');
          break;

      default:
        break;
    }
  }

  deleteWorkflow(status: boolean) {
    if (status && this.deleteObject.id) {
      this._eventWorkflowService.deleteWorkflowSections(this.deleteObject.id,this.workflowId).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    
    setTimeout(() => {
      // this.getAuditWorkflow();
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
    
  }

  deleteWorkflowSections(id: number, type: string,level) {
    event.stopPropagation();
    this.deleteObject.type = '';
    this.deleteObject.id = id;
    this.deleteObject.title = 'Remove Level?';
    this.deleteObject.subtitle = 'Are you sure you want to remove the level '+level+' from the Workflow?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  clearPopupObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.subtitle = '';
    this.deleteObject.type = '';
  }
  
  swithDivStatus(){
    this.showDiv = true;
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetails: any = {};
    if(type=='user'){
      userDetails['first_name'] = users?.first_name;
      userDetails['last_name'] = users?.last_name;
      userDetails['designation'] = users?.designation;
      userDetails['image_token'] = users?.image?.token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status?.id;
      userDetails['created_at'] = null;
    }
    if(type=='default'){
      userDetails['first_name'] = users?.created_by.first_name;
      userDetails['last_name'] = users?.created_by.last_name;
      userDetails['designation'] = users?.created_by.designation;
      userDetails['image_token'] = users?.created_by.image.token;
      userDetails['email'] = users?.created_by.email;
      userDetails['mobile'] = users?.created_by.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department;
      userDetails['status_id'] = users?.created_by.status.id ? users?.created_by.status.id : users?.created_by?.status?.id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

  }

  openPopupSection(type:string,level:number){
    this.workFlowSourceData = {
      values: null,
      type: null
    }
    let levelId = level+1;
    EventWorkflowStore.workflowPopupEnabled = true;
    this.workFlowSourceData.type = "Add"
    this.workFlowSourceData.values = {
      workflowId: this.workflowId,
      level: levelId,
      module:'EM',
      moduleGroupId:4000
    }
    $(this.commonModal.nativeElement).modal('show');
  }

  viewDescription(type,workflow){
    if(type == 'more')
    workflow.view_more = true;
    else{
      workflow.view_more = false;
      this._utilityService.scrollToTop();
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionContent(workflow){
    var descriptionContent = workflow.description.substring(0,185);
    return descriptionContent;
  }

  moveTo(type) {
    switch (type) {
      case 'left':  document.getElementById('slide-user-guide-menu').scrollLeft -=250;

        break;
      case 'right':  document.getElementById('slide-user-guide-menu').scrollLeft += 250;
       
        break;
    }
  }

  ngOnDestroy() {
    EventWorkflowStore.workflowId=null;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe()
    this.modalStyleSubscription.unsubscribe()
    this.workflowUserAddModalSubscription.unsubscribe()
    this.workflowDesignationAddModalSubscription.unsubscribe()
    this.workflowHeadUnitAddModalSubscription.unsubscribe()
    this.workflowTeamAddModalSubscription.unsubscribe()
    this.workflowRoleAddModalSubscription.unsubscribe()
    this.workflowCommonAddModalSubscription.unsubscribe()
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.workFlowSourceData = {
      values: null,
      type: null
    }
    EventWorkflowStore.workflowPopupEnabled = false;
    EventWorkflowStore.unsetIndividualEventTemplate();
  }
}
