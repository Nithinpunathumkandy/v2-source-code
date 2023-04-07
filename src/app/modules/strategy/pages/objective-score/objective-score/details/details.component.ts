import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ObjectiveWorkflowService } from 'src/app/core/services/strategy-management/objective-workflow-service/objective-workflow.service';
import { ObjectiveScoreService } from 'src/app/core/services/strategy-management/objective/objective-score.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyManagementSettingStore } from 'src/app/stores/settings/strategy-management-settings.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

declare var $: any;


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('objectiveScore') objectiveScore: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;

  ObjectiveScoreStore = ObjectiveScoreStore;
  StrategyStore = StrategyStore;
  AppStore = AppStore;
  StrategyManagementSettingStore = StrategyManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  objectiveMesureObject = {
    type: null,
    value: null,
    id: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  objectiveMesureModalModalEventSubscription: any;
  popupControlEventSubscription: any;
  objectiveReviewCommentSubscription: any;
  workflowHistoryOpened: boolean = false; objectChangeRequstWorkFlowHistorySubsscription: any;
  ;
  constructor(private _objectiveService: ObjectiveScoreService, private _router: ActivatedRoute,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _route: Router,
    private _profileServicce: StrategyService, private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService, private _objectiveReviewWorkflowService: ObjectiveWorkflowService,) { }

  ngOnInit(): void {
    let id: number;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {        
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    SubMenuItemStore.setSubMenuItems([
      { type: "close", path: "../strategy-scoring" }
    ]);

    this.objectiveMesureModalModalEventSubscription = this._eventEmitterService.objectiveScore.subscribe(item => {
      this.closeObjectiveMesure();
      this.getInduvalObjective(ObjectiveScoreStore.selectedobjectiveId);
      this.getReviewFreequency()
    })

    this.objectiveReviewCommentSubscription = this._eventEmitterService.objectiveReviewCommentModal.subscribe(item => {
      this.closeCommentForm()
      this.getInduvalObjective(ObjectiveScoreStore.selectedobjectiveId);
      this.getReviewFreequency()
    })

    this.objectChangeRequstWorkFlowHistorySubsscription = this._eventEmitterService.objectiveWorkflowHistoryModal.subscribe(item => {
      this.closeHistoryPopup()
    })

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if (id) {
        StrategyStore.setObjectiveId(id)
        ObjectiveScoreStore.selectedobjectiveId = id
        this.getInduvalObjective(id);
        this.getReviewFreequency()
      }
    })
  }
  getInduvalObjective(id) {
    this._objectiveService.induvalObjective(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPopupDetails(user, is_created_by: boolean = false) {
    let userDetailObject: any = {};
    if (user) {
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title ? user.designation_title : user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email : null;
      userDetailObject['mobile'] = user.mobile ? user.mobile : null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof (user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if (is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  goToList() {
    this._route.navigateByUrl('strategy-management/objectives/' + ObjectiveScoreStore.selectedobjectiveId + '/frequencies')
  }

  getReviewFreequency() {
    this._profileServicce.getObjectiveTargetBreakdown().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  isUser() {
    if (ObjectiveScoreStore.induvalObjective && ObjectiveScoreStore.induvalObjective.review_users.length > 0) {
      var pos = ObjectiveScoreStore.induvalObjective.review_users?.findIndex(e => e.id == AuthStore.user.id)
      if (pos != -1) {
        return true;
      }
      else {
        return false
      }
    }
    else {
      return false;
    }

  }

  responsibleUser() {
    if (ObjectiveScoreStore.induvalObjective && ObjectiveScoreStore.induvalObjective.responsible_users.length > 0) {
      var pos = ObjectiveScoreStore.induvalObjective.responsible_users?.findIndex(e => e.id == AuthStore.user.id)
      if (pos != -1) {
        return true;
      }
      else {
        return false
      }
    }
    else {
      return false;
    }
  }

  openObjectiveMesureModal(freequency) {
    this._profileServicce.getObjectiveInduvalReview(freequency.id).subscribe(res => {
      this.objectiveMesureObject.value = res;
      this.objectiveMesureObject.type = freequency.actual_value ? 'Edit' : 'Add';
      this.openObjectiveMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  openObjectiveMesureModalPopup() {
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.objectiveScore.nativeElement, 'show');
    this._renderer2.setStyle(this.objectiveScore.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.objectiveScore.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.objectiveScore.nativeElement, 'overflow', 'auto');
  }

  closeObjectiveMesure() {
    this.objectiveMesureObject.type = null;
    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.objectiveScore.nativeElement, 'show');
    this._renderer2.setStyle(this.objectiveScore.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  submitProjectForReview(id) {
    ObjectiveWorkflowStore.selectedId = id
    this.popupObject.type = 'Confirm';
    this.popupObject.title = 'submit';
    this.popupObject.subtitle = 'Are you sure you want to submit this review?';
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.title) {
      case 'submit': this.submitAccepted(status)
        break;

    }
  }

  submitAccepted(status) {
    if (status) {
      this._objectiveReviewWorkflowService.submitProject(ObjectiveWorkflowStore.selectedId).subscribe(res => {
        // SubMenuItemStore.submitClicked = false;
        this.getInduvalObjective(ObjectiveScoreStore.selectedobjectiveId);
        this.getReviewFreequency()
        this._utilityService.detectChanges(this._cdr);
      },
        (error) => {
          // SubMenuItemStore.submitClicked = false;
        })

    } else {
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  approveWorkflow(type, id) {
    ObjectiveScoreStore.type = type;
    ObjectiveWorkflowStore.selectedId = id
    ObjectiveScoreStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeCommentForm() {
    ObjectiveScoreStore.type = '';
    ObjectiveScoreStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  openHistoryPopup(freequency) {
    ObjectiveWorkflowStore.selectedId = freequency.id
    ObjectiveWorkflowStore.setCurrentPage(1);
    this._objectiveReviewWorkflowService.getHistory(ObjectiveWorkflowStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
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

  remainingDate(end_date){
    let currentDate = new Date();
    end_date = new Date(end_date);
    let remaining =  Math.floor((Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()) -
     Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
    return remaining;
  }

  ngOnDestroy() {
    this.objectiveMesureModalModalEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popupControlEventSubscription.unsubscribe();
    this.objectiveReviewCommentSubscription.unsubscribe()
    this.objectChangeRequstWorkFlowHistorySubsscription.unsubscribe()
  }

}
