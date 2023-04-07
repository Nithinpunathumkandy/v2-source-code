import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BiaWorkflowService } from 'src/app/core/services/bcm/bia/bia-workflow.service';
import { BiaService } from 'src/app/core/services/bcm/bia/bia.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaWorkflowStore } from 'src/app/stores/bcm/bia/bia-workflow.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;
@Component({
  selector: 'app-bia-detail',
  templateUrl: './bia-detail.component.html',
  styleUrls: ['./bia-detail.component.scss']
})
export class BiaDetailComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;

  BiaStore = BiaStore
  AppStore = AppStore
  BiaWorkflowStore = BiaWorkflowStore;
  reactionDisposer: IReactionDisposer;
  emptyTier = "emptyTier";
  sideCollapsed: boolean = false;
  sliderSubscriptionEvent: any = null; 

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  biaObject = {
    component: 'BCP',
    values: null,
    type: null
  }; 

  workflowModalOpened: boolean=false;
  workflowHistoryOpened=false
  biaWorkflowHistorySubscription: any;
  biaWorkflowSubscription: any;
  biaCommentSubscription: any;
  popupControlEventSubscription: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,  
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _biaService:BiaService,
    private _biaWorkflowService : BiaWorkflowService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this._activatedRoute.params.subscribe(params => {
      id = +params['id']; 
      BiaStore.selectedId = id;
      
    });
    this.reactionDisposer = autorun(() => {
      AppStore.showDiscussion = false;
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal": 
            this.biaObject.type = 'Edit';
            BiaStore.is_edit = true   
            BiaStore.selectedProcessId = BiaStore.ImpactResult.process.id            //Make procedure select button disabled
            this._router.navigateByUrl('bcm/business-impact-analysis/edit');
            break;
          case "export_to_excel":
            // this.exportBiaContext();
            break;
            case 'submit':
              this.submitBiaForReview();
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
                break
            case "history": 
            this.openHistoryPopup();
                break;
            case "workflow": 
            this.openWorkflowPopup();
                break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
      setTimeout(() => {
        SubMenuItemStore.submitClicked = false;
      }, 250);
    })

    this.biaWorkflowHistorySubscription = this._eventEmitterService.BiaHistory.subscribe(element=>{
      this.closeHistoryPopup();
    })

    this.biaWorkflowSubscription = this._eventEmitterService.BiaWorkflow.subscribe(element=>{
      this.closeWorkflowPopup();
    })

    this.biaCommentSubscription = this._eventEmitterService.BiaCommentModal.subscribe(element=>{
      this.closeCommentForm();
    })

    setTimeout(() => {
      this.getBiaDetails()
    }, 50);

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    SubMenuItemStore.setNoUserTab(true);
    
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
      userDetails['first_name'] = users?.created_by?.first_name;
      userDetails['last_name'] = users?.created_by?.last_name;
      userDetails['designation'] = users?.created_by?.designation.title;
      userDetails['image_token'] = users?.created_by?.image_token;
      userDetails['email'] = users?.created_by?.email;
      userDetails['mobile'] = users?.created_by?.mobile;
      userDetails['id'] = users?.created_by.id;
      userDetails['department'] = users?.created_by.department?.title;
      userDetails['status_id'] = users?.created_by.status_id;
      userDetails['created_at'] = created ? created : null;
    }
    return userDetails;

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

  getWorkflow() {
    this._biaWorkflowService.getItems(BiaStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getBiaDetails() {
    this.getWorkflow();
    BiaStore.ImpactResultLoaded = false;
    this._biaService.getImpactResult(BiaStore.selectedId).subscribe(res => {
      if (res.business_impact_analysis_status.type == 'completed') {
        var subMenuItems = [
          { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
          { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'close', path: "../" } },
        ]
        this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      } else {
        if (res.business_impact_analysis_status.type == 'in-review') {
          var subMenuItems = [
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
            { activityName: 'APPROVE_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'approve' } },
            { activityName: 'REVERT_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'revert' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } }
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
        else if (res.next_review_user_level == 1 && res.submitted_by == null) {
          var subMenuItems = [
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
            { activityName: 'SUBMIT_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'submit' } },
            { activityName: 'UPDATE_BUSINESS_IMPACT_ANALYSIS_RESULT', submenuItem: { type: 'edit_modal' } },
            { activityName: null, submenuItem: { type: 'close', path: "../" } },
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        } else if (res.submitted_by != null && res.next_review_user_level && this.isUser()) {
          if (res?.next_review_user_level == BiaWorkflowStore?.workflowDetails[BiaWorkflowStore?.workflowDetails?.length - 1]?.level) {
            var subMenuItems = [
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
              { activityName: 'APPROVE_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'approve' } },
              { activityName: 'REVERT_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'close', path: '../' } }
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }
          else if (res.next_review_user_level != BiaWorkflowStore?.workflowDetails[BiaWorkflowStore?.workflowDetails?.length - 1]?.level) {
            var subMenuItems = [
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
              { activityName: 'SUBMIT_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'review_submit' } },
              { activityName: 'REVERT_BUSINESS_IMPACT_ANALYSIS', submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'close', path: '../' } }
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }
        } else if (res.business_impact_analysis_status.id == 4) {
          {
            var subMenuItems = [
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
              { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '../' } }
            ]
            this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
            this._utilityService.detectChanges(this._cdr);
          }
        } else {
          var subMenuItems = [
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW', submenuItem: { type: 'workflow' } },
            { activityName: 'LIST_BUSINESS_IMPACT_ANALYSIS_WORKFLOW_HISTORY', submenuItem: { type: 'history' } },
            { activityName: 'UPDATE_BUSINESS_IMPACT_ANALYSIS_RESULT', submenuItem: { type: 'edit_modal' } },
            { activityName: null, submenuItem: { type: 'close', path: '../' } }
          ]
          this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        }
      }
    })
  }

  isUser() {
    if(BiaStore?.ImpactResultLoaded){
      for (let i of BiaStore?.ImpactResult.workflow_items) {
        if (i.level == BiaStore?.ImpactResult?.next_review_user_level) {
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


  submitBiaForReview(){
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'submit_bia';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  submitAccepted(status){
    if(status){
      this._biaWorkflowService.submitBia(BiaStore.selectedId).subscribe(res=>{
        SubMenuItemStore.submitClicked = false;
        this.getBiaDetails()
        this._utilityService.detectChanges(this._cdr);
      })
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
   }

   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Confirm': this.submitAccepted(status)
        break;
    }
    
  }

  openWorkflowPopup() {
    this._biaWorkflowService.getItems(BiaStore.selectedId).subscribe(res => {
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

  openHistoryPopup() {
    BiaWorkflowStore.setCurrentPage(1);
    this._biaWorkflowService.getHistory(BiaStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  approveWorkflow(type?) {
    if (type) {
      BiaWorkflowStore.type = 'submit';
    }
    else
    BiaWorkflowStore.type = 'approve';
    BiaWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }
  
  closeCommentForm() {
    this.getBiaDetails();
    BiaWorkflowStore.type = '';
    BiaWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
  
    this._utilityService.detectChanges(this._cdr)
  }
  
  revertWorkflow() {
    BiaWorkflowStore.type = 'revert';
    BiaWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  
  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    if(this.reactionDisposer) this.reactionDisposer();
    this.biaWorkflowSubscription.unsubscribe();
    this.biaWorkflowHistorySubscription.unsubscribe();
    this.biaCommentSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
  }

}
