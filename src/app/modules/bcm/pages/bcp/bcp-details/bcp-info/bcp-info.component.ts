import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { UtilityService } from "src/app/shared/services/utility.service";
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { AuthStore } from "src/app/stores/auth.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { BcpClauseService } from "src/app/core/services/bcm/bcp/bcp-clause/bcp-clause.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { CommentStore } from 'src/app/stores/comment.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-bcp-info',
  templateUrl: './bcp-info.component.html',
  styleUrls: ['./bcp-info.component.scss']
})
export class BcpInfoComponent implements OnInit {
  @ViewChild('clauseFormModal') clauseFormModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('changeRequestModal') changeRequestModal: ElementRef;
  @ViewChild('bcpSearchModal') bcpSearchModal: ElementRef;

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
  bcpObject = {
    component: 'BCP',
    values: null,
    type: null
  };
  changeRequestObject = {
    change_request_id: null
  }
  BcpStore = BcpStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
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
  clauseIndex = 0;
  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  showCommentModal: boolean = false;
  changeRequest: boolean = false;
  searchText: string;
  searchType: string = "bcp_contents";
  emptyMessage = "common_nodata_title";
  constructor(private _cdr: ChangeDetectorRef, private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2, private _bcpService: BcpService,
    private _bcpClauseService: BcpClauseService, private _helperService: HelperServiceService,
    private _bcpChangeRequestService: BcpChangeRequestService, private _imageService: ImageServiceService,
    private _router: Router) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_bcp_clause'});
    this.bcpClauseModalSubscription = this._eventEmitterService.addBcpClauseModal.subscribe(res=>{
      this.closeClauseFormModal();
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(this.popupObject.type == '' && !this.popupObject.bcpType)
        this.deleteBcpClause(item);
      else if(this.popupObject.type == '' && this.popupObject.bcpType)
        this.deleteBcpCRClause(item);
      else
        this.submitBcp(item);
    })
    this.bcpClauseChangeEventSubscription = this._eventEmitterService.bcpChildClauseEvent.subscribe(res=>{
      this.clauseChangeEventControl(res);
    })
    this.workFlowSubscription = this._eventEmitterService.IncidentInfoWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();

    })
    this.workflowHistorySubscription = this._eventEmitterService.IncidentInfoHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })
    this.bcpModalSubscription = this._eventEmitterService.addBcpModal.subscribe(res=>{
      this.closeFormModal();
    })
    this.workflowCommentSubscription = this._eventEmitterService.IncidentInvestigationWorkflowCommentModal.subscribe(element=>{
      this.closeCommentForm();
    })
    this.bcpChangeRequestSubscription = this._eventEmitterService.bcpChangeRequestModal.subscribe(res=>{
      this.closeChangeRequestModal();
    })

    this.searchModalSubscription = this._eventEmitterService.bcpSearchModal.subscribe(res=>{
      this.closeSearchModal()
    })
    
    this.reactionDisposer = autorun(() => {
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(1100,'CREATE_BUSINESS_CONTINUITY_PLAN_VERSION_CONTENT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if(BcpStore.bcpDetails && BcpStore.detailsLoaded && BcpStore.bcpWorkflow){
        this.setSubMenuItems();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "submit": 
            this.submitBcpForReview();
            SubMenuItemStore.submitClicked = true;
            break;
          case 'approve':
            this.approveWorkflow();
            break
          case 'review_submit':
            this.approveWorkflow(true);
            break
          case 'revert':
            this.revertWorkflow();
            break
          case 'change_request':
            this.openChangeRequestModal();
            break
          case "edit_modal": 
            this.bcpObject.type = 'Edit';
            this.bcpObject.values = BcpStore.bcpDetails;
            this.openFormModal();
            break;
          case "history": this.openHistoryPopup();
            break;
          case "workflow": this.openWorkflowPopup();
            break;
          case "export_to_excel":
            this._bcpService.exportBcpDetails(BcpStore.selectedBcpId);
            break;
          default:
            break;
        }
  
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.newClauseFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
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
  }

  changeClauseIndex(index){
    if(this.clauseIndex == index) this.clauseIndex = null;
    else this.clauseIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  searchDocuments(e){
    let pthis = this;
    BcpStore.setBcpContents(JSON.parse(BcpStore.bcpContentsStringified));
    BcpStore.bcpContents.forEach(function(item, index, object) {
      if(item.title.indexOf(e) != -1){
        object.splice(index, 1);
      }
      if(item.children.length > 0) {
        pthis.removeDocuments(item.children,e)
      }
    });
  }

  removeDocuments(item,e){
    item.forEach(function(item, index, object) {
      if(item.title.indexOf(e) != -1){
        object.splice(index, 1);
      }
    });
  }

  changeZIndex(){
    if($(this.clauseFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'overflow','auto');
    }
    if($(this.workflowModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.workflowModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.workflowModal.nativeElement,'overflow','auto');
    }
    if($(this.workflowHistory.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.workflowHistory.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.workflowHistory.nativeElement,'overflow','auto');
    }
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.commentModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.commentModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.commentModal.nativeElement,'overflow','auto');
    }
  }

  clauseChangeEventControl(item){
    if(item.type == 'New'){
      if(!item.bcpType)
        this.newSubClause(item.values,item.order,null,null,item.index_no);
      else this.newSubClause(item.values,item.order,'CR',item.bcpType,item.index_no)
    }
    else if(item.type == 'Edit'){
      if(!item.bcpType)
        this.editClause(item.values);
      else this.editClause(item.values,'CR',item.bcpType);
    }
    else if(item.type == 'Delete'){
      if(!item.bcpType)
        this.deleteClauseConfirm(item.values);
      else this.deleteClauseConfirm(item.values,'CR');
    }
  }

  submitBcpForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_bcp_workflow';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  submitBcp(status){
    if(status){
      let submitWorkflow;
      if(BcpStore.changeRequestWorkflow)
        submitWorkflow = this._bcpChangeRequestService.submitForWorkflow(this.BcpStore.bcpContents.change_request[0].id);
      else
        submitWorkflow = this._bcpService.submitForWorkflow(BcpStore.bcpDetails.id);
      this.closeConfirmationPopUp();
      submitWorkflow.subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getBcpDetails(BcpStore.bcpDetails.id);
        this._utilityService.detectChanges(this._cdr);
      },(error)=>{
        SubMenuItemStore.submitClicked = false;
      })
    }
    else{
      SubMenuItemStore.submitClicked = false;
      this.closeConfirmationPopUp();
    }
  }

  closeConfirmationPopUp(){
    // this.popupObject.type = null;
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  approveWorkflow(type?) {
    if (type) BcpStore.workflowType = 'submit';
    else BcpStore.workflowType = 'approve';
    this.showCommentModal = true;
      // IncidentInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.getBcpDetails(BcpStore.bcpDetails.id);
    this.bcpObject.type = null;
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
    // IncidentInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeChangeRequestModal() {
    this.getBcpDetails(BcpStore.bcpDetails.id,true)
    this.changeRequest = false;
    this.changeRequestObject.change_request_id = null;
    this._renderer2.removeClass(this.changeRequestModal.nativeElement, 'show');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr)
  }

  openChangeRequestModal() {
    this.changeRequest = true;
    this.changeRequestObject.change_request_id = this.BcpStore.bcpContents.change_request.length > 0 ? this.BcpStore.bcpContents.change_request[0].id : null;
    this._renderer2.addClass(this.changeRequestModal.nativeElement, 'show');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.changeRequestModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr)
  }

  searchClicked(){
    $(this.bcpSearchModal.nativeElement).modal('show');
  }

  closeSearchModal(){
    $(this.bcpSearchModal.nativeElement).modal('hide');
  }

  createImageUrl(token){
    return this._imageService.getThumbnailPreview('user-profile-picture',token);
  }

  // Return Default Image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  setSubMenuItems(){
    var subMenuItems = []
    if(BcpStore.bcpContents?.change_request?.length == 0){
      BcpStore.changeRequestWorkflow = false;
      if(BcpStore.bcpDetails.business_continuity_plan_status.type == 'approved'){
        subMenuItems = [
         {activityName:null, submenuItem: {type: 'close', path: '../'}},
         {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
         {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
         {activityName: 'CREATE_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST', submenuItem: {type: 'change_request'}},
         {activityName: null, submenuItem: {type: 'export_to_excel'}},
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }else{
        if(BcpStore.bcpDetails.next_review_user_level == 1 && BcpStore.bcpDetails.submitted_by == null){
          subMenuItems = [
            // {activityName: null, submenuItem: {type: 'change_request'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
            {activityName: 'SUBMIT_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'submit'}},
            {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
            {activityName: null, submenuItem: {type: 'export_to_excel'}},
            {activityName:null, submenuItem: {type: 'close', path: '../'}
          }
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else if(BcpStore.bcpDetails.submitted_by != null && this.isUser()){
         if (BcpStore.bcpDetails?.next_review_user_level == BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
           subMenuItems = [
             {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
             {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
             {activityName: null, submenuItem: {type: 'approve'}},
             {activityName: null, submenuItem: {type: 'revert'}},
            //  {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
             {activityName: null, submenuItem: {type: 'export_to_excel'}},
             {activityName:null, submenuItem: {type: 'close', path: '../'}}
           ]
           this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
           this._utilityService.detectChanges(this._cdr);
         }
         else if (BcpStore.bcpDetails?.next_review_user_level != BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
            subMenuItems = [
              {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
              {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
              {activityName: null, submenuItem: {type: 'review_submit'}},
              {activityName: null, submenuItem: {type: 'revert'}},
              // {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
              {activityName: null, submenuItem: {type: 'export_to_excel'}},
              {activityName:null, submenuItem: {type: 'close', path: '../'}}
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
         }
       }
       else{
         subMenuItems = [
            // {activityName: null, submenuItem: {type: 'change_request'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
            {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
            // {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
            {activityName: null, submenuItem: {type: 'export_to_excel'}},
            {activityName:null, submenuItem: {type: 'close', path: '../'}}
         ]
         this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
         this._utilityService.detectChanges(this._cdr);
       }
      }
    }
    else{
      BcpStore.changeRequestWorkflow = true;
      if(BcpStore.bcpDetails.business_continuity_plan_status.type == 'approved'){
        subMenuItems = [
         {activityName:null, submenuItem: {type: 'close', path: '../'}},
         {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
         {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
         {activityName: null, submenuItem: {type: 'export_to_excel'}},
        //  {activityName: null, submenuItem: {type: 'change_request'}},
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      }
      else{
        subMenuItems = [
          {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW', submenuItem: {type: 'workflow'}},
          {activityName:'LIST_BUSINESS_CONTINUITY_PLAN_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
          {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
          {activityName: null, submenuItem: {type: 'export_to_excel'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      // else{
      //   if(this.BcpStore.bcpContents?.change_request[0].next_review_user_level == 1 && this.BcpStore.bcpContents?.change_request[0].submitted_by == null){
      //     subMenuItems = [
      //       {activityName:null, submenuItem: {type: 'workflow'}},
      //       {activityName:null, submenuItem: {type: 'history'}},
      //       {activityName: null, submenuItem: {type: 'submit'}},
      //       {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
      //       {activityName:null, submenuItem: {type: 'close', path: '../'}
      //     }
      //   ]
      //   this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      //   this._utilityService.detectChanges(this._cdr);
      // }
      // else if(this.BcpStore.bcpContents?.change_request[0].submitted_by != null && this.isUser()){
      //    if (this.BcpStore.bcpContents?.change_request[0].next_review_user_level == this.BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
      //      subMenuItems = [
      //        {activityName:null, submenuItem: {type: 'workflow'}},
      //        {activityName:null, submenuItem: {type: 'history'}},
      //        {activityName: null, submenuItem: {type: 'approve'}},
      //        {activityName: null, submenuItem: {type: 'revert'}},
      //        {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
      //        {activityName:null, submenuItem: {type: 'close', path: '../'}}
      //      ]
      //      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      //      this._utilityService.detectChanges(this._cdr);
      //    }
      //    else if (this.BcpStore.bcpContents?.change_request[0]?.next_review_user_level != this.BcpStore?.bcpWorkflow[BcpStore?.bcpWorkflow?.length - 1]?.level){
      //       subMenuItems = [
      //         {activityName:null, submenuItem: {type: 'workflow'}},
      //         {activityName:null, submenuItem: {type: 'history'}},
      //         {activityName: null, submenuItem: {type: 'review_submit'}},
      //         {activityName: null, submenuItem: {type: 'revert'}},
      //         {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
      //         {activityName:null, submenuItem: {type: 'close', path: '../'}}
      //       ]
      //       this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      //       this._utilityService.detectChanges(this._cdr);
      //    }
      //  }
      //  else{
      //    subMenuItems = [
      //       // {activityName: null, submenuItem: {type: 'change_request'}},
      //       {activityName:null, submenuItem: {type: 'workflow'}},
      //       {activityName:null, submenuItem: {type: 'history'}},
      //       {activityName: 'UPDATE_BUSINESS_CONTINUITY_PLAN', submenuItem: {type: 'edit_modal'}},
      //       {activityName:null, submenuItem: {type: 'close', path: '../'}}
      //    ]
      //    this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      //    this._utilityService.detectChanges(this._cdr);
      //  }
      // }
    }
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

  getBcpDetails(id: number,crRedirect?){
    this._bcpService.getItem(id).subscribe(res=>{
        let pos = res.versions.findIndex(e => e.is_latest == 1);
        if(pos != -1) {
          this._bcpService.setBcpContents(res.versions[pos]);
          BcpStore.currentVersionId = res.versions[pos].id;
        }
        if(BcpStore.bcpContents?.change_request?.length == 0){
          BcpStore.changeRequestWorkflow = false;
        }
        else{
          BcpStore.changeRequestWorkflow = true;
          if(crRedirect) this._router.navigateByUrl(`/bcm/business-continuity-plan/${BcpStore.selectedBcpId}/change-request`)
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

  openHistoryPopup() {
    BcpStore.workflowHistoryPage = 1;
    let workflowHistory;
    // if(BcpStore.changeRequestWorkflow)
    //   workflowHistory = this._bcpChangeRequestService.getWorkflowHistory(this.BcpStore.bcpContents.change_request[0].id);
    // else
      workflowHistory = this._bcpService.getWorkflowHistory(BcpStore.bcpDetails.id);
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

  newClauseFormModal(){
    this.bcpClauseObject.type = 'Add';
    this.bcpClauseObject.version_id = BcpStore.currentVersionId;
    this.bcpClauseObject.order = BcpStore.bcpContents ? BcpStore.bcpContents.contents.length+1 : 1;
    this.bcpClauseObject.index_no = this.bcpClauseObject.order;
    this._utilityService.detectChanges(this._cdr);
    this.openClauseFormModal();
  }

  newSubClause(id,order?,type?,item ?, index?){
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

  newChangeRequestSubClause(crData){
    this.bcpClauseObject.version_id = BcpStore.currentVersionId;
    this.bcpClauseObject.order = crData.contents.length + 1;
    this.bcpClauseObject.type = 'Add';
    this.bcpClauseObject.bcpType = 'CR';
    this.bcpClauseObject.business_continuity_plan_change_request_id = crData.id;
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

  deleteBcpClause(item){
    if (item && this.popupObject.id) {
      this._bcpClauseService.delete(this.popupObject.id).subscribe(resp => {
        this.getBcpDetails(BcpStore.bcpDetails.id);
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
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject(){
    this.popupObject.type = null;
    this.popupObject.id = null;
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
      this.clearClauseObject();
      this._renderer2.removeClass(this.clauseFormModal.nativeElement,'show');
      this._renderer2.removeStyle(this.clauseFormModal.nativeElement,'display');
      this._renderer2.setStyle(this.clauseFormModal.nativeElement,'z-index','9999');
      $('.modal-backdrop').remove();
      this.getBcpDetails(BcpStore.bcpDetails.id);
      this.clearBcpClauseObject();
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  openComment(contentId: number){
    CommentStore.unsetComments();
    AppStore.openCommentBox();
    CommentStore.setCommentObjectVariable('business_continuity_plan_version_content_comment_id');
    CommentStore.commentApi = `/bcp-version-contents/${contentId}`;
    this._utilityService.detectChanges(this._cdr);
  }

  clearClauseObject(){
    this.bcpClauseObject.type = null;
    this.bcpClauseObject.values = null;
    this.bcpClauseObject.business_continuity_plan_version_content_id = null;
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
    this.bcpModalSubscription.unsubscribe();
    this.workflowCommentSubscription.unsubscribe();
    this.bcpChangeRequestSubscription.unsubscribe();
    AppStore.closeCommentBox();
  }

}
