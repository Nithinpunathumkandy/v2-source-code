import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { AuthStore } from "src/app/stores/auth.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";
import { CommentStore } from 'src/app/stores/comment.store';
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-bcp-change-request-component',
  templateUrl: './app-bcp-change-request-component.component.html',
  styleUrls: ['./app-bcp-change-request-component.component.scss']
})
export class BcpChangeRequestPageComponent implements OnInit {

  @ViewChild('clauseFormModal') clauseFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('bcpSearchModal') bcpSearchModal: ElementRef;
  @ViewChild('changeRequestModal') changeRequestModal: ElementRef;
  
  bcpClauseObject = {
    type: null,
    values: null,
    version_id: null,
    order: null,
    business_continuity_plan_version_content_id: null,
    bcpType: null,
    business_continuity_plan_change_request_id: null,
    business_continuity_plan_change_request_content_id: null,
    index_no: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    bcpType: null
  };
  changeRequestObject = {
    change_request_id: null
  }
  
  BcpStore = BcpStore;
  AuthStore = AuthStore;
  ThemeStructureSettingStore = ThemeStructureSettingStore;
  reactionDisposer: IReactionDisposer;
  bcpClauseModalSubscription: any = null;
  popupControlSubscription: any = null;
  bcpClauseChangeEventSubscription: any = null;
  workFlowSubscription: any = null;
  workflowHistorySubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  bcpModalSubscription: any = null;
  workflowCommentSubscription: any = null;
  bcpChangeRequestSubscription: any = null;
  searchModalSubscription: any = null;
  clauseIndex='content0'
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  showCommentModal: boolean = false;
  changeRequest: boolean = false;
  searchType: string;
  emptyMessage = "common_nodata_title";
  constructor(private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2, private _bcpService: BcpService,
    private _helperService: HelperServiceService, private _bcpChangeRequestService: BcpChangeRequestService,
    private _router: Router) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_bcp_clause'});
    this.bcpClauseModalSubscription = this._eventEmitterService.addBcpClauseModal.subscribe(res=>{
      this.closeClauseFormModal();
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(this.popupObject.type == '' && this.popupObject.bcpType)
        this.deleteBcpCRClause(item);
      else{
        if(this.popupObject.bcpType == 'cancel')
          this.cancelChangeRequest(item)
        else this.submitBcp(item);
      }
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
  
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.workFlowSubscription = this._eventEmitterService.IncidentInfoWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();

    })
    this.workflowHistorySubscription = this._eventEmitterService.IncidentInfoHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })
    this.bcpClauseChangeEventSubscription = this._eventEmitterService.bcpChildClauseEvent.subscribe(res=>{
      this.clauseChangeEventControl(res);
    })
    this.workflowCommentSubscription = this._eventEmitterService.IncidentInvestigationWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();
    })
    this.searchModalSubscription = this._eventEmitterService.bcpSearchModal.subscribe(res=>{
      this.closeSearchModal()
    })

    this.bcpChangeRequestSubscription = this._eventEmitterService.bcpChangeRequestModal.subscribe(res=>{
      this.closeExistingContentsModal();
    })

    this.reactionDisposer = autorun(() => {
      if(BcpStore.bcpDetails && BcpStore.detailsLoaded && BcpStore.bcpWorkflow){
        this.setSubMenuItems();
      }
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(1100,'CREATE_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_CONTENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "submit": 
            SubMenuItemStore.submitClicked = true;
            this.submitBcpForReview();
            break;
          case 'approve':
            this.approveWorkflow();
            break
          case 'review_submit':
            this.approveWorkflow(true);
            break
          case 'revert':
            this.revertWorkflow();
            break;
          case "history": this.openHistoryPopup();
            break;
          case "workflow": this.openWorkflowPopup();
            break;
          case "cancel": 
            SubMenuItemStore.cancelClicked = true;
            this.crCancelConfirmation();
            break;
          default:
            break;
        }
  
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
  }

  clauseChangeEventControl(item){
    if(item.type == 'New'){
      this.newSubClause(item.values,item.order,'CR',item.bcpType,item.index_no)
    }
    else if(item.type == 'Edit'){
      this.editClause(item.values,'CR',item.bcpType);
    }
    else if(item.type == 'Delete'){
      this.deleteClauseConfirm(item.values,'CR');
    }
  }

  changeZIndex(){
    if($(this.clauseFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'overflow','auto');
    }
  }

  submitBcpForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_bcp_cr_workflow';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  submitBcp(status){
    if(status){
      let submitWorkflow;
      submitWorkflow = this._bcpChangeRequestService.submitForWorkflow(this.BcpStore.bcpContents.change_request[0].id);
      this.closeConfirmationPopUp();
      submitWorkflow.subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getBcpDetails(BcpStore.bcpDetails.id);
        this._utilityService.detectChanges(this._cdr);
      },(error) =>{
        SubMenuItemStore.submitClicked = false;
      })
    }
    else{
      this.closeConfirmationPopUp();
    }
  }

  crCancelConfirmation(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.bcpType = 'cancel';
    this.popupObject.subtitle = 'cancel_bcp_change_request';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  cancelChangeRequest(status){
    if(status){
      let cancelCr;
      cancelCr = this._bcpChangeRequestService.cancelChangeRequest(this.BcpStore.bcpContents.change_request[0].id);
      this.closeConfirmationPopUp();
      cancelCr.subscribe(res=>{
        this.popupObject.bcpType = null;
        SubMenuItemStore.cancelClicked = false;
        this.getBcpDetails(BcpStore.bcpDetails.id);
        this._utilityService.detectChanges(this._cdr);
      },(error) =>{
        SubMenuItemStore.cancelClicked = false;
      })
    }
    else{
      this.popupObject.bcpType = null;
      SubMenuItemStore.cancelClicked = false;
      this.closeConfirmationPopUp();
    }
  }

  searchClicked(type){
    this.searchType = type;
    $(this.bcpSearchModal.nativeElement).modal('show');
  }

  closeSearchModal(){
    this.searchType = null;
    $(this.bcpSearchModal.nativeElement).modal('hide');
  }

  closeConfirmationPopUp(){
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  approveWorkflow(type?) {
    if (type) BcpStore.workflowType = 'submit';
    else BcpStore.workflowType = 'approve';
    this.showCommentModal = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeCommentForm() {
    this.getBcpDetails(BcpStore.bcpDetails.id)
    BcpStore.workflowType = '';
    this.showCommentModal = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr)
  }

  revertWorkflow() {
    BcpStore.workflowType = 'revert';
    this.showCommentModal = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeExistingContentsModal() {
    this.changeRequestObject.change_request_id = null;
    this._renderer2.removeClass(this.changeRequestModal.nativeElement, 'show');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this.getBcpDetails(BcpStore.bcpDetails.id);
    this._utilityService.detectChanges(this._cdr)
  }

  addExistingContents() {
    this.changeRequestObject.change_request_id = this.BcpStore.bcpContents.change_request.length > 0 ? this.BcpStore.bcpContents.change_request[0].id : null;
    this._renderer2.addClass(this.changeRequestModal.nativeElement, 'show');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr)
  }

  openHistoryPopup() {
    BcpStore.workflowHistoryPage = 1;
    let workflowHistory;
    if(BcpStore.changeRequestWorkflow)
      workflowHistory = this._bcpChangeRequestService.getWorkflowHistory(this.BcpStore.bcpContents.change_request[0].id);
    // else
    //   workflowHistory = this._bcpService.getWorkflowHistory(BcpStore.bcpDetails.id);
    workflowHistory.subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    let workflowDetails;
    if(BcpStore.changeRequestWorkflow)
      workflowDetails = this._bcpChangeRequestService.getWorkflowDetails(this.BcpStore.bcpContents.change_request[0].id);
    else
      workflowDetails = this._bcpService.getWorkflowDetails(BcpStore.bcpDetails.id);
    workflowDetails.subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }
  
  closeWorkflowPopup() {
    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  setSubMenuItems(){
    var subMenuItems = []
    BcpStore.changeRequestWorkflow = true;
    // if(BcpStore.bcpDetails.business_continuity_plan_status.type == 'approved'){
    //   subMenuItems = [
    //     {activityName:null, submenuItem: {type: 'close', path: '../'}},
    //     {activityName:null, submenuItem: {type: 'workflow'}},
    //     {activityName:null, submenuItem: {type: 'history'}},
    //     // {activityName: null, submenuItem: {type: 'change_request'}},
    //   ]
    //   this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
    // }else{
    if(this.BcpStore.bcpContents?.change_request.length > 0){
      if(this.BcpStore.bcpContents?.change_request[0].next_review_user_level == 1 && this.BcpStore.bcpContents?.change_request[0].submitted_by == null){
        subMenuItems = [
            {activityName: null, submenuItem: {type: 'cancel'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
            {activityName: 'SUBMIT_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST', submenuItem: {type: 'submit'}},
            {activityName:null, submenuItem: {type: 'close', path: '../'}
          }
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if(this.BcpStore.bcpContents?.change_request[0].submitted_by != null && this.isUser()){
        if (this.BcpStore.bcpContents?.change_request[0].next_review_user_level == this.BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
          subMenuItems = [
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
            {activityName: null, submenuItem: {type: 'approve'}},
            {activityName: null, submenuItem: {type: 'revert'}},
            {activityName:null, submenuItem: {type: 'close', path: '../'}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (this.BcpStore.bcpContents?.change_request[0]?.next_review_user_level != this.BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
          subMenuItems = [
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
            {activityName: null, submenuItem: {type: 'review_submit'}},
            {activityName: null, submenuItem: {type: 'revert'}},
            {activityName:null, submenuItem: {type: 'close', path: '../'}}
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
      }
      else{
        subMenuItems = [
          {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
    }
    
    // }
  }

  isUser() {
    if(BcpStore?.detailsLoaded){
      let workflowItems = [];
      let review_level = BcpStore.changeRequestWorkflow ? this.BcpStore.bcpContents?.change_request[0]?.next_review_user_level : BcpStore?.bcpDetails?.next_review_user_level
      if(!BcpStore.changeRequestWorkflow)
        workflowItems = BcpStore?.bcpDetails.workflow_items;
      else
        workflowItems = BcpStore.bcpWorkflow;
      for (let i of workflowItems) {
        if (i.level == review_level) {
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

  changeClauseIndex(index, section?){
    if(this.clauseIndex == section+index) this.clauseIndex = null;
    else this.clauseIndex = section+index;
    this._utilityService.detectChanges(this._cdr);
  }

  newChangeRequestSubClause(crData){
    this.bcpClauseObject.version_id = BcpStore.currentVersionId;
    this.bcpClauseObject.order = crData.contents.length + 1;
    this.bcpClauseObject.index_no = this.bcpClauseObject.order;
    this.bcpClauseObject.type = 'Add';
    this.bcpClauseObject.bcpType = 'CR';
    this.bcpClauseObject.business_continuity_plan_change_request_id = crData.id;
    this.openClauseFormModal();
  }

  openClauseFormModal(){
    setTimeout(() => {
      this._renderer2.addClass(this.clauseFormModal.nativeElement,'show');
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'z-index','999999');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeClauseFormModal() {
    setTimeout(() => {
      this.clearBcpClauseObject();
      this._renderer2.removeClass(this.clauseFormModal.nativeElement,'show');
      this._renderer2.removeStyle(this.clauseFormModal.nativeElement,'display');
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'z-index','9999');
      $('.modal-backdrop').remove();
      this.getBcpDetails(BcpStore.bcpDetails.id);
      this.clearBcpClauseObject();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  clearBcpClauseObject(){
    this.bcpClauseObject.bcpType = null;
    this.bcpClauseObject.business_continuity_plan_change_request_content_id = null;
    this.bcpClauseObject.business_continuity_plan_change_request_id = null;
    this.bcpClauseObject.business_continuity_plan_version_content_id = null;
    this.bcpClauseObject.order = null;
    this.bcpClauseObject.type = null;
    this.bcpClauseObject.values = null;
    this.bcpClauseObject.version_id = null;
  }

  getBcpDetails(id: number){
    this._bcpService.getItem(id).subscribe(res=>{
        let pos = res.versions.findIndex(e => e.is_latest == 1);
        if(pos != -1) {
          this._bcpService.setBcpContents(res.versions[pos]);
          BcpStore.currentVersionId = res.versions[pos].id;
        }
        if(BcpStore.bcpContents?.change_request?.length == 0){
          BcpStore.changeRequestWorkflow = false;
          this._router.navigateByUrl('/bcm/business-continuity-plan/'+BcpStore.bcpDetails?.id);
        }
        else{
          BcpStore.changeRequestWorkflow = true;
        }
        if(res.versions.length > 0){
          let versions = JSON.parse(JSON.stringify(res.versions));
          pos = versions.findIndex(e => e.id == BcpStore.currentVersionId);
          versions.splice(pos,1);
          BcpStore.setBcpVersionHistory(versions);
        }
        this.getBcpWorkflow(BcpStore.bcpDetails.id);
        this._utilityService.detectChanges(this._cdr);
    })
  }

  getFormattedText(text,type?){
    if(type){
      return "<span class='add-text'>"+text+"</span>";
    }
    else{
      return "<span class='remove-text'>"+text+"</span>";
    }
  }

  getBcpWorkflow(id: number){
    let workflowDetails;
    if(BcpStore.changeRequestWorkflow)
      workflowDetails = this._bcpChangeRequestService.getWorkflowDetails(this.BcpStore.bcpContents.change_request[0].id);
    else
      workflowDetails = this._bcpService.getWorkflowDetails(BcpStore.bcpDetails.id);
    workflowDetails.subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  newSubClause(id,order?,type?,item ?,index?){
    this.bcpClauseObject.version_id = BcpStore.currentVersionId;
    this.bcpClauseObject.order = order;
    this.bcpClauseObject.type = 'Add';
    if(index) this.bcpClauseObject.index_no = index.toString()+'.'+order;
    if(type) {
      this.bcpClauseObject.bcpType = 'CR';
      this.bcpClauseObject.business_continuity_plan_change_request_id = item.business_continuity_plan_change_request_id;
      this.bcpClauseObject.business_continuity_plan_change_request_content_id = id;
    }
    else {
      this.bcpClauseObject.bcpType = null;
      this.bcpClauseObject.business_continuity_plan_version_content_id = id;
    }
    this.openClauseFormModal();
  }

  editClause(clause,type?, item ?){
    this.bcpClauseObject.type = 'Edit';
    this.bcpClauseObject.values = clause;
    this.bcpClauseObject.version_id = BcpStore.currentVersionId;
    if(type) {
      this.bcpClauseObject.bcpType = 'CR';
      this.bcpClauseObject.business_continuity_plan_change_request_id = item.business_continuity_plan_change_request_id;
      this.bcpClauseObject.business_continuity_plan_change_request_content_id = item.business_continuity_plan_change_request_content_id;
    }
    else this.bcpClauseObject.bcpType = null;
    this._utilityService.detectChanges(this._cdr);
    this.openClauseFormModal();
  }

  deleteClauseConfirm(id: number,type?, item ?){
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    if(type) this.popupObject.bcpType = type;
    else this.popupObject.bcpType = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteBcpCRClause(item){
    if (item && this.popupObject.id) {
      this._bcpChangeRequestService.delete(this.popupObject.id, BcpStore.bcpContents.change_request[0].id).subscribe(resp => {
        this.getBcpDetails(BcpStore.bcpDetails.id);
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
      this.clearPopupObject();
    }, 250);
  }

  clearPopupObject(){
    this.popupObject.type = null;
    this.popupObject.id = null;
  }

  openComment(contentId: number){
    CommentStore.unsetComments();
    AppStore.openCommentBox();
    CommentStore.setCommentObjectVariable('business_continuity_plan_version_content_comment_id');
    CommentStore.commentApi = `/bcp-version-contents/${contentId}`;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    if(this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlSubscription.unsubscribe();
    this.bcpClauseModalSubscription.unsubscribe();
    this.bcpClauseChangeEventSubscription.unsubscribe();
    this.workFlowSubscription.unsubscribe();
    this.workflowHistorySubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    // this.bcpModalSubscription.unsubscribe();
    this.workflowCommentSubscription.unsubscribe();
    this.bcpChangeRequestSubscription.unsubscribe();
    AppStore.closeCommentBox();
  }

}
