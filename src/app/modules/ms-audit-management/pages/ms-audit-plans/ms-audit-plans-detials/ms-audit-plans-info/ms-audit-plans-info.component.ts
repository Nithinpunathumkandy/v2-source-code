import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanWorkflowService } from 'src/app/core/services/ms-audit-management/audit-plan-workflow/audit-plan-workflow.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ms-audit-plans-info',
  templateUrl: './ms-audit-plans-info.component.html',
  styleUrls: ['./ms-audit-plans-info.component.scss']
})
export class MsAuditPlansInfoComponent implements OnInit,OnDestroy {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('activityLogsModal') activityLogsModal: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  ProcessStore = ProcessStore;//*mapping
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MsAuditPlansStore = MsAuditPlansStore;
  AuditPlanWorkflowStore = AuditPlanWorkflowStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  workflowHistoryOpened=false;
  modalEventSubscription: any;
  popupControlEventSubscription: any;
  workflowModalOpened: boolean=false;
  MsAuditPlansObject = {
    type:null,
    values: null,
  };

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };
  auditWorkflowHistorySubscription: any;
  auditWorkflowSubscription: any;
  auditWorkflowCommentSubscription: any;
  planActivityLogsSubscription:any;
  
  constructor(  
    private _router:Router,
    private _renderer2: Renderer2,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _msAuditPlansService: MsAuditPlansService,
    private __auditPlanWorkflowService : AuditPlanWorkflowService,
    private _discussionBotService: DiscussionBotService
  ) { }

  ngOnInit(): void {
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditPlansStore.setMsAuditPlansId(id);
      this.getDetails(id);
    })
    
    AppStore.showDiscussion = false;
    SubMenuItemStore.cancelClicked = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    // if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
    //   BreadCrumbMenuItemStore.makeEmpty();
    //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
    //     name:"ms_audit_plans",
    //     path:`/ms-audit-management/ms-audit-plans`
    //   });
    // }
    NoDataItemStore.unsetNoDataItems();
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    
    this.reactionDisposer = autorun(() => {
      
      // this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "publish_modal":
            if(!SubMenuItemStore.cancelClicked)
            this.publishPlan();
          break;
          case "edit_modal":
              this.getEdit();
            break;
          case "delete":
            this.delete(MsAuditPlansStore.msAuditPlansId);
          break;
          case 'submit':
            this.submitProjectForReview();
            SubMenuItemStore.submitClicked = true;
              
              break
            case 'approve':
              this.approveWorkflow();
              break
            case 'review_submit':
                 this.approveWorkflow(true);
                break
            case 'revert':
                 this.revertWorkflow();
                break;
                case 'reject':
                 this.rejectWorkflow();
                break
            case "history": 
             this.openHistoryPopup();
                break;
            case "workflow": 
             this.openWorkflowPopup();
                break;
            case 'activity_log':
              this.activityLogsOpenModal();
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.auditWorkflowHistorySubscription = this._eventEmitterService.AuditHistoryComments.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.auditWorkflowSubscription = this._eventEmitterService.AuditWorkflow.subscribe(element=>{
      this.closeCommentForm();
      this.getDetails(MsAuditPlansStore.msAuditPlansId)
    })

    this.auditWorkflowCommentSubscription = this._eventEmitterService.AuditHistory.subscribe(element=>{
      this.closeWorkflowPopup();
    })
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.planActivityLogsSubscription = this._eventEmitterService.auditPlanActivityLogsModal.subscribe(res => {
      this.activityLogsCloseModal();
    });

  }

  getDetails(id){
    this._msAuditPlansService.getItem(id).subscribe(res => {
      this.setPath();
      this.getWorkflow()
      this.setProcesses(MsAuditPlansStore.individualMsAuditPlansDetails?.processes);
      //this.getDiscussions();
    this._utilityService.detectChanges(this._cdr);
    });
  }

  // getDiscussions() {
  //   this._discussionBotService.getDiscussionMessage().subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  publishPlan()
  {
    // this.popupObject.id = MsAuditPlansStore.individualMsAuditPlansDetails?.id;
    // this.popupObject.type = 'Publish';
    // this.popupObject.subtitle="it_will_send_invitation_to_all_auditees";
    // $(this.confirmationPopUp.nativeElement).modal('show');

    this.popupObject.id = MsAuditPlansStore.individualMsAuditPlansDetails?.id;
    this.popupObject.type = 'Publish';
    this.popupObject.title='Publish';
    this.popupObject.subtitle = 'it_will_send_invitation_to_all_auditees';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // it function use brud crud and close button navigation set 
  setPath(){
    if(MsAuditPlansStore.redirectAuditProgram)
    {
        MsAuditPlansStore.setPath(`/ms-audit-management/ms-audit-programs/${MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program?.id}/audit-plans`);
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_plans",
        path:`/ms-audit-management/ms-audit-programs/${MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program?.id}/audit-plans`
      });
    }
    else
    {
      MsAuditPlansStore.setPath(`/ms-audit-management/ms-audit-plans`);
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_plans",
        path:`/ms-audit-management/ms-audit-plans`
      });
    }
    
  }

  getWorkflow() {
    this.__auditPlanWorkflowService.getItems(MsAuditPlansStore.msAuditPlansId).subscribe(res=>{
      this.setSubMenuItems()
      this._utilityService.detectChanges(this._cdr);
    })
  }
  getArrayFormatedString(type,items,languageSupport?){
    let item=[];
    if(languageSupport){
      for(let i of items){
        for(let j of i.language){
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',',type,items);
  }
  setSubMenuItems() {

    if(MsAuditPlansStore.individualMsAuditPlansDetails.workflow_items.length==0)
    {
      // if(MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='draft' && 
      // MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_schedules?.length && (AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')))
      // {
      //   let subMenuItems=[];
      //   subMenuItems = [
      //     //{activityName:null,submenuItem:{type:'publish_modal',title : ''}},
      //     { activityName:'UPDATE_MS_AUDIT_PLAN', submenuItem: { type: 'edit_modal',title : '' } },
      //     {activityName: 'DELETE_MS_AUDIT_PLAN', submenuItem: {type: 'delete',title:''}},
      //     {activityName: null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}},
      //   ]
      //     this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
      //     this._utilityService.detectChanges(this._cdr);
      // }
      // else{
      //   let subMenuItems=[];
        if((AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')) 
          && MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='draft')
        {
          subMenuItems = [
            //{activityName:null,submenuItem:{type:'publish_modal',title : ''}},
            { activityName:'UPDATE_MS_AUDIT_PLAN', submenuItem: { type: 'edit_modal',title : '' } },
            {activityName: 'DELETE_MS_AUDIT_PLAN', submenuItem: {type: 'delete',title:''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } }
            //{activityName: null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}},
          ]
        }
        subMenuItems.push({activityName: null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}});
        
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
          this._utilityService.detectChanges(this._cdr);
      //}
      
    }
    else
    {
      if(MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level==1&&
        MsAuditPlansStore.individualMsAuditPlansDetails?.submitted_by==null && 
        MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_schedules?.length){
        let subMenuItems=[];
  
          subMenuItems = [
            {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:'SUBMIT_MS_AUDIT_PLAN',submenuItem:{type:'submit',title : ''}},
            { activityName:'UPDATE_MS_AUDIT_PLAN', submenuItem: { type: 'edit_modal',title : '' } },
            {activityName: 'DELETE_MS_AUDIT_PLAN', submenuItem: {type: 'delete',title:''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            {activityName: null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}},
          ]
        
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);  
        
        this._utilityService.detectChanges(this._cdr);
      }   else if(MsAuditPlansStore.individualMsAuditPlansDetails?.submitted_by!=null && MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level && this.isUser()){
        if (MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level == AuditPlanWorkflowStore?.workflowDetails[AuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems = [
            {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:"APPROVE_MS_AUDIT_PLAN",submenuItem:{type:'approve',title : ''}},
            {activityName:"REVERT_MS_AUDIT_PLAN",submenuItem:{type:'revert',title:''}},
            {activityName:"REJECT_MS_AUDIT_PLAN",submenuItem:{type:'reject',title:''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            {activityName:null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level != AuditPlanWorkflowStore?.workflowDetails[AuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level){
          var subMenuItems  = [
            {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
            {activityName:'LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
            {activityName:null,submenuItem:{type:'review_submit',title : ''}},
            {activityName:"REVERT_MS_AUDIT_PLAN",submenuItem:{type:'revert',title:''}},
            {activityName:"REJECT_MS_AUDIT_PLAN",submenuItem:{type:'reject',title:''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            {activityName:null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        } 
        
      }else if (MsAuditPlansStore.individualMsAuditPlansDetails?.next_review_user_level == null && MsAuditPlansStore.individualMsAuditPlansDetails?.submitted_by!=null){
        var subMenuItems  = [
          {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
          {activityName:'LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history',title : ''}},
          { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
          {activityName:null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}}
        ]
        // if(MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_schedules?.length && MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_plan_status?.type=='approved' && (AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')))
        //   {
        //     subMenuItems.unshift({activityName:null,submenuItem:{type:'publish_modal',title : ''}},)
        //   }
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      
      else{
        let subMenuItems=[];
  
        if(AuthStore.isRoleChecking('lead-auditor') || AuthStore.isRoleChecking('super-admin')){
          subMenuItems = [
            // {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
            // {activityName: "LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY", submenuItem: {type: 'history',title : ''}},
            {activityName: 'UPDATE_MS_AUDIT_PLAN', submenuItem: {type: 'edit_modal',title : ''}},
            {activityName: 'DELETE_MS_AUDIT_PLAN', submenuItem: {type: 'delete',title:''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            {activityName:null, submenuItem: {type: 'close',path:MsAuditPlansStore.path, title : ''}}
          ];
          // if(MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_schedules?.length)
          // {
          //   subMenuItems.unshift({activityName:null,submenuItem:{type:'publish_modal',title : ''}},)
          // }
        }else{
          subMenuItems = [
            {activityName:"LIST_MS_AUDIT_PLAN_WORKFLOW", submenuItem: {type: 'workflow',title : ''}},
            {activityName: "LIST_MS_AUDIT_PLAN_WORKFLOW_HISTORY", submenuItem: {type: 'history',title : ''}},
            { activityName: '', submenuItem: { type: 'activity_log',title:'' } },
            {activityName:null, submenuItem: {type: 'close', path:MsAuditPlansStore.path, title : ''}}
          ]
        }
          
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        }
    }
    
    
}
  // Activity logs
  activityLogsOpenModal(){
    MsAuditPlansStore.activity_log_form_modal=true;
    setTimeout(() => {
      $(this.activityLogsModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  activityLogsCloseModal(){
    MsAuditPlansStore.activity_log_form_modal=false;
    $(this.activityLogsModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

isUser() {
  if(MsAuditPlansStore?.individualLoaded){
    for (let i of MsAuditPlansStore?.individualMsAuditPlansDetails?.workflow_items) {
      if (i.level == MsAuditPlansStore?.individualMsAuditPlansDetails?.next_review_user_level) {
        var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
          if (pos != -1){
            return true;
          }
          else{
            return false
          }
      }
    }
  }
  else{
    return false;
  } 
}

revertWorkflow() {
  AuditPlanWorkflowStore.type = 'revert';
  AuditPlanWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  this._utilityService.detectChanges(this._cdr);
}


rejectWorkflow() {
  AuditPlanWorkflowStore.type = 'reject';
  AuditPlanWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  this._utilityService.detectChanges(this._cdr);
}

approveWorkflow(type?) {
  if (type) {
    AuditPlanWorkflowStore.type = 'submit';
  }
  else
  AuditPlanWorkflowStore.type = 'approve';
  AuditPlanWorkflowStore.commentForm = true;
  $(this.commentModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  this._utilityService.detectChanges(this._cdr);
}

closeCommentForm() {
  this.setSubMenuItems();
  AuditPlanWorkflowStore.type = '';
  AuditPlanWorkflowStore.commentForm = false;
  $(this.commentModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
  this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
  $('.modal-backdrop').remove();

  this._utilityService.detectChanges(this._cdr)
}

openHistoryPopup() {
  AuditPlanWorkflowStore.setCurrentPage(1);
  this.__auditPlanWorkflowService.getHistory(MsAuditPlansStore.msAuditPlansId).subscribe(res => {
    this.workflowHistoryOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowHistory.nativeElement).modal('show');
  });
}

closeHistoryPopup() {
  this.workflowHistoryOpened = false;
  $(this.workflowHistory.nativeElement).modal('hide');
}


openWorkflowPopup() {
  this.__auditPlanWorkflowService.getItems(MsAuditPlansStore.msAuditPlansId).subscribe(res => {
    this.workflowModalOpened = true;
    this._utilityService.detectChanges(this._cdr);
    $(this.workflowModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
  })
}

closeWorkflowPopup() {
  this.workflowModalOpened = false;
  $(this.workflowModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
  this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
  $('.modal-backdrop').remove();
}

  setProcesses(items) {
    ProcessStore.selectedProcessesList = [];
    let processItem = items;
    for (let i of processItem) {
      i['process_group_title'] = i.title;
      i['department'] = i.department?.title;
      i['process_category_title'] = i.process_category?.title;
      ProcessStore.selectedProcessesList.push(i);
    }
  }

// Edit
  getEdit() {
    this.getDetails(MsAuditPlansStore.msAuditPlansId);
    if(MsAuditPlansStore.individualMsAuditPlansDetails?.id){
      this.MsAuditPlansObject.type = 'Edit';
      MsAuditPlansStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }  
  }
//**Edit

//delete
  delete(id){
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete';
    this.popupObject.subtitle = 'are_you_sure_you_want_to_delete_this_ms_audit_plan';

    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  submitProjectForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'Are you sure want to submit';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.title) {
      case 'Delete': this.deleteItem(status);
        break;
      case 'submit': this.submitAccepted(status)
        break;
      case 'Publish': this.publish(status);
        break;
    }
  }

  publish(status){

    if (status && this.popupObject.id) {
      MsAuditPlansStore.individualLoaded=false;
      SubMenuItemStore.cancelClicked = true;
      this._msAuditPlansService.publishAuditPlan(this.popupObject.id).subscribe(res=>{
        this.getDetails(this.popupObject.id);
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
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  submitAccepted(status){
    if(status){
      this.__auditPlanWorkflowService.submitProject(MsAuditPlansStore.msAuditPlansId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getDetails(MsAuditPlansStore.msAuditPlansId)
        this._utilityService.detectChanges(this._cdr);
      },
      (error)=>{
        SubMenuItemStore.submitClicked = false;
      })
      
    }else{
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

  // delete function call
  deleteItem(status: boolean) {
    
    if (status && this.popupObject.id) {

      this._msAuditPlansService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl( MsAuditPlansStore.path);
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

  clearPopupObject() {
    this.popupObject.id = null;
  }

  //**delete

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    this.MsAuditPlansObject.type = null;
    NoDataItemStore.unsetNoDataItems();
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: null, buttonText: null});
    this.getDetails(MsAuditPlansStore.msAuditPlansId);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = false;
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  getNoDataSource(type){
    let noDataSource = {
      noData:"no_data_found", border: false, imageAlign: type
    }
    return noDataSource;
  }

  openUrl(url){
   if(url){
     window.open(url.external_link)
   }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    SubMenuItemStore.cancelClicked = false;
    AppStore.showDiscussion = false;
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.auditWorkflowHistorySubscription.unsubscribe();
    this.planActivityLogsSubscription.unsubscribe();
    this.auditWorkflowSubscription.unsubscribe();
    MsAuditPlansStore.unsetIndividualMsAuditPlansDetails();
  }
}
