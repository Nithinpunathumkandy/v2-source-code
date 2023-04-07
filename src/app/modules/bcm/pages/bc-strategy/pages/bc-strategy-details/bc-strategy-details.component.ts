import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BcmStrategiesService } from 'src/app/core/services/bcm/bcm-strategies/bcm-strategies.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcmStrategyStore } from 'src/app/stores/bcm/strategy/bcm-strategy-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;
@Component({
  selector: 'app-bc-strategy-details',
  templateUrl: './bc-strategy-details.component.html',
  styleUrls: ['./bc-strategy-details.component.scss']
})
export class BcStrategyDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  BcmStrategyStore = BcmStrategyStore;
  AppStore = AppStore;
  AuthStore = AuthStore

  popupObject = {
    mode: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;
  solution_id: number;
  workFlowSubscription: any = null;
  workflowModalOpened: boolean = false;
  workflowHistoryOpened=false
  workflowHistorySubscription: any = null;
  strategyCommentSubscription: any;
  accepted: boolean;
  opens: boolean;
  holding: boolean;
  rejecting: boolean;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _bcmStrategiesService: BcmStrategiesService,
    private _renderer2: Renderer2,
    private _imageService: ImageServiceService,
    private _activatedRouter: ActivatedRoute,
    private _route: Router,
    private _router: ActivatedRoute,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    BcmStrategyStore.unsetDetails()
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editBcStrategy();
            this._utilityService.detectChanges(this._cdr);
            break;
          case "submit":
            this.submitStrategies();
            this._utilityService.detectChanges(this._cdr);
            break;
          case 'approve':
            this.approveStrategies();
            this._utilityService.detectChanges(this._cdr);
            break
          case 'revert':
            this.revertStrategies();
            this._utilityService.detectChanges(this._cdr);
            break
          case 'reject':
            this.rejectStrategies();
            this._utilityService.detectChanges(this._cdr);
            break
          case "workflow": this.openWorkflowPopup();
            break;
            case "history": this.openHistoryPopup();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      BcmStrategyStore.selectedId = id;
      this.solution_id = id;
      this.getStrategy(id);
    });

    // for deleting/activating/deactivating using delete modal
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.workFlowSubscription = this._eventEmitterService.bcmStrategyWorkflowEvent
      .subscribe(element => {
        this.closeWorkflowPopup();

      })

      this.workflowHistorySubscription = this._eventEmitterService.strategyWorkFlowHistoryModal.subscribe(element=>{
        this.closeHistoryPopup();
      })

      this.strategyCommentSubscription = this._eventEmitterService.strategyCommentModal.subscribe(element=>{
        this.closeCommentForm();
      })
      // if(BcmStrategyStore._singleStrategies?.solutions?.length > 0){
      //   BcmStrategyStore.showId = BcmStrategyStore._singleStrategies?.solutions[0]?.id;
      // }
    
  }
  getStrategy(id) {
    this._bcmStrategiesService.getStrategy(id).subscribe(
      res => {
        // BcmStrategyStore.showId = res.solutions[0]?.id;
       if(res.solutions&&!BcmStrategyStore.showId){
        BcmStrategyStore.showId = res.solutions[0].id
       }
       this.getWorkflow(id);
       this._utilityService.detectChanges(this._cdr);
      });
  }

  getWorkflow(id){
    this._bcmStrategiesService.strategyWorkFlow(id).subscribe(res=>{
      setTimeout(() => {
        this.setSubMenuItems()
      }, 100);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  returnSolutionStatus(){
    let status = true
    for (let index = 0; index < BcmStrategyStore._singleStrategies?.solutions.length; index++) {
      const element = BcmStrategyStore._singleStrategies?.solutions[index];
      if(element.business_continuity_strategy_solution_status?.id!=3){
        status = false;
        break;
      }
    }
    return status
  }

  setSubMenuItems(){
    var subMenuItems = [];
    let pthis = this;
    if(!this.returnSolutionStatus()){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:'LIST_BUSINESS_CONTINUITY_STRATEGY_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        { activityName: 'UPDATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
    }
    else if(pthis.BcmStrategyStore._singleStrategies?.submitted_by == null){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:'LIST_BUSINESS_CONTINUITY_STRATEGY_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        { activityName: null, submenuItem: { type: 'submit' } },
        { activityName: 'UPDATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
      console.log(1);
    }
    else if(pthis.BcmStrategyStore._singleStrategies?.next_review_user_level == 1 && pthis.BcmStrategyStore._singleStrategies?.submitted_by == null) {
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:'LIST_BUSINESS_CONTINUITY_STRATEGY_WORKFLOW_HISTORY', submenuItem: {type: 'history'}},
        { activityName: null, submenuItem: { type: 'submit' } },
        { activityName: 'UPDATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
      console.log(2);
      // && BcmStrategyStore._singleStrategies?.business_continuity_strategy_status?.id!=2
    } else if(pthis.BcmStrategyStore._singleStrategies?.submitted_by != null && pthis.isUser()){
      if (pthis.BcmStrategyStore._singleStrategies?.next_review_user_level == pthis.BcmStrategyStore?.Workflow[BcmStrategyStore?.Workflow.length - 1]?.level){

          subMenuItems = [
          { activityName: null, submenuItem: { type: 'workflow' } },
          {activityName:null, submenuItem: {type: 'history'}},
          { activityName: null, submenuItem: { type: 'approve' } },
          { activityName: null, submenuItem: { type: 'revert' } },
          // { activityName: null, submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        console.log(3);
      } else if (pthis.BcmStrategyStore._singleStrategies?.next_review_user_level != pthis.BcmStrategyStore?.Workflow[BcmStrategyStore?.Workflow.length - 1]?.level){
        subMenuItems = [
          { activityName: null, submenuItem: { type: 'workflow' } },
          {activityName:null, submenuItem: {type: 'history'}},
            { activityName: null, submenuItem: { type: 'approve' } },
            { activityName: null, submenuItem: { type: 'revert' } },
          // { activityName: 'UPDATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        console.log(4);
      } else {
          subMenuItems = [
          { activityName: null, submenuItem: { type: 'workflow' } },
          {activityName:null, submenuItem: {type: 'history'}},
          // { activityName: null, submenuItem: { type: 'edit_modal' } },
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        console.log(5);
      }
    }
    else if(pthis.BcmStrategyStore._singleStrategies?.business_continuity_strategy_status?.type == 'closed'){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:null, submenuItem: {type: 'history'}},
        // { activityName: null, submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
    }
    else if(pthis.BcmStrategyStore._singleStrategies?.business_continuity_strategy_status?.type == 'open'){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:null, submenuItem: {type: 'history'}},
        // { activityName: null, submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
    }
    else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'workflow' } },
        {activityName:null, submenuItem: {type: 'history'}},
        { activityName: 'UPDATE_BUSINESS_CONTINUITY_STRATEGY', submenuItem: { type: 'edit_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: "../" } },
      ]
      console.log(6);
    }

    setTimeout(() => {
      pthis._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      pthis._utilityService.detectChanges(this._cdr);
    }, 100);    
  }

  editBcStrategy(){
    BcmStrategyStore.new_strategy_id = this.solution_id;
    this._route.navigateByUrl('/bcm/business-continuity-strategies/edit');
    this._utilityService.detectChanges(this._cdr);
  }

  setSubmenuItems() {
    // this._bcmStrategiesService.strategyWorkFlow(this.solution_id).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    // })
   
  }

  isUser() {
    if (BcmStrategyStore?.single_loaded) {
      let review_level = BcmStrategyStore._singleStrategies?.next_review_user_level
      for (let i of BcmStrategyStore.Workflow) {
        if (i.level == review_level) {
          var pos = i.users?.findIndex(e => e.id == AuthStore.user.id)
          if (pos != -1) {
            return true;
          }
          else {
            return false
          }
        }
      }
    }
    else {
      return false;
    }

  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  openHistoryPopup() {
    BcmStrategyStore.historyPage = 1;
    let workflowHistory;
    // if(BcpStore.changeRequestWorkflow)
    //   workflowHistory = this._bcpChangeRequestService.getWorkflowHistory(this.BcpStore.bcpContents.change_request[0].id);
    // else
      workflowHistory = this._bcmStrategiesService.strategyWorkFlowHistory(false,null, this.solution_id);
    workflowHistory.subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  openWorkflowPopup() {
    this.workflowModalOpened = true;
    let workflowDetails;
    workflowDetails = this._bcmStrategiesService.strategyWorkFlow(this.solution_id);
    workflowDetails.subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  closeWorkflowPopup() {
    this.workflowModalOpened = false
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  getBcmSolutions(id) {
    BcmStrategyStore.showId = id;
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.mode) {

      case 'Accept': this.acceptBsSolutions(status)
        break;

      case 'OnHold': this.holdBsSolutions(status);
        break;

      case 'Reject': this.rejectBsSolutions(status);
        break;

      case 'Open': this.openBsSolutions(status);
        break;

      case 'Submit': this.submitStrategy(status);
        break;

      // case 'Srevert': this.revetStrategy(status);
      //   break;

      case 'Sapprove': this.approveStrategy(status);
        break;

      case 'Sreject': this.rejectStrategy(status);
        break;



    }

  }

  submitStrategies() {
    this.popupObject.mode = 'Submit';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to Submit?';
    this.popupObject.subtitle = 'Are you sure want to Submit?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  approveStrategies() {
    this.popupObject.mode = 'Sapprove';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to Accept?';
    this.popupObject.subtitle = 'Are you sure want to Accept?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  revertStrategies() {
    // this.popupObject.mode = 'Srevert';
    // this.popupObject.type = 'Confirm';
    // this.popupObject.title = 'Are you sure you want revert this action?';
    // this.popupObject.subtitle = 'Are you sure want to revert this action?';

    // $(this.confirmationPopUp.nativeElement).modal('show');
    BcmStrategyStore.type = 'revert';
    BcmStrategyStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  rejectStrategies() {
    this.popupObject.mode = 'Sreject';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to reject this action?';
    this.popupObject.subtitle = 'Are you sure want to reject this action?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }


  accept() {
    event.stopPropagation();
    this.popupObject.mode = 'Accept';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to Accept?';
    this.popupObject.subtitle = 'Are you sure want to Accept?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  hold() {
    event.stopPropagation();
    this.popupObject.mode = 'OnHold';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to hold this action?';
    this.popupObject.subtitle = 'Are you sure want to hold this action?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  reject() {
    event.stopPropagation();
    this.popupObject.mode = 'Reject';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to reject this action?';
    this.popupObject.subtitle = 'Are you sure want to reject this action?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  open() {
    event.stopPropagation();
    this.popupObject.mode = 'Open';
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'Are you sure want to confirm this action?';
    this.popupObject.subtitle = 'Are you sure want to confirm this action?';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  submitStrategy(status) {
    if (status) {
      AppStore.enableLoading();
      SubMenuItemStore.submitClicked = true;
      this._bcmStrategiesService.strategySubmit(this.solution_id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        SubMenuItemStore.submitClicked = false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  // revetStrategy(status) {
  //   if (status) {
  //     AppStore.enableLoading();
  //     SubMenuItemStore.submitClicked = true;
  //     this._bcmStrategiesService.strategyRevert(this.solution_id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this.clearPopupObject();
  //       this.getStrategy(this.solution_id);
  //       AppStore.disableLoading();
  //       SubMenuItemStore.submitClicked = false;
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUp.nativeElement).modal('hide');
  //   }, 250);

  // }

  approveStrategy(status) {
    if (status) {
      AppStore.enableLoading();
      SubMenuItemStore.submitClicked = true;
      this._bcmStrategiesService.strategyApprove(this.solution_id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        SubMenuItemStore.submitClicked = false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  rejectStrategy(status) {
    if (status) {
      AppStore.enableLoading();
      SubMenuItemStore.submitClicked = true;
      this._bcmStrategiesService.strategyReject(this.solution_id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        SubMenuItemStore.submitClicked = false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  acceptBsSolutions(status) {
    if (status) {
      AppStore.enableLoading();
      this.accepted = true;
      this._bcmStrategiesService.approve(BcmStrategyStore.showId).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        this.accepted = false
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  openBsSolutions(status) {
    if (status) {
      AppStore.enableLoading();
      this.opens = true;
      this._bcmStrategiesService.open(BcmStrategyStore.showId).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        this.opens = false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }


  holdBsSolutions(status) {
    if (status) {
      AppStore.enableLoading();
      this.holding = true;
      this._bcmStrategiesService.onHold(BcmStrategyStore.showId).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        this.holding=false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }


  rejectBsSolutions(status) {
    if (status) {
      AppStore.enableLoading();
      this.rejecting = true;
      this._bcmStrategiesService.reject(BcmStrategyStore.showId).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.getStrategy(this.solution_id);
        AppStore.disableLoading();
        this.rejecting = false;
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }






  /// for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
    this.popupObject.mode = '';

  }

  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  closeCommentForm() {
    this.getStrategy(BcmStrategyStore.selectedId);
    BcmStrategyStore.type = '';
    BcmStrategyStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.workFlowSubscription.unsubscribe();
    this.workflowHistorySubscription.unsubscribe();
    SubMenuItemStore.submitClicked = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.strategyCommentSubscription.unsubscribe();
  }

}
