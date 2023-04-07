import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
// Comment by Dinesh
// import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
// import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
// import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
// import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { IsmsRiskRatingMasterStore } from 'src/app/stores/masters/isms/isms-risk-rating-master-store';
import { IsmsImpactStore } from 'src/app/stores/isms/isms-risk-configuration/isms-impact.store';
import { IsmsLikelihoodStore } from 'src/app/stores/isms/isms-risk-configuration/isms-likelihood.store';
import { IsmsRiskScoreStore } from 'src/app/stores/isms/isms-risk-configuration/isms-risk-score.store';
// Comment by Dinesh
// import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { IsmsRiskRatingService } from 'src/app/core/services/masters/isms/isms-risk-rating/isms-risk-rating.service';
// Comment by Dinesh
// import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { IsmsImpactService } from 'src/app/core/services/isms/isms-risk-configuration/isms-impact/isms-impact.service';
// Comment by Dinesh
// import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { IsmsLikelihoodService } from 'src/app/core/services/isms/isms-risk-configuration/isms-likelihood/isms-likelihood.service';
// Comment by Dinesh
// import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { IsmsRiskScoreService } from 'src/app/core/services/isms/isms-risk-configuration/isms-risk-score/isms-risk-score.service';


import * as htmlToImage from 'html-to-image';
import { RiskInfoWorkflowService } from 'src/app/core/services/risk-management/risks/risk-info-workflow/risk-info-workflow.service';
// import { IsmsRiskInfoWorkflowStore } from 'src/app/stores/risk-management/risks/risk-info-workflow.store';
// import { RiskJourneyService } from 'src/app/core/services/risk-management/risks/risk-journey/risk-journey.service';
import { RiskJourneyStore } from 'src/app/stores/risk-management/risks/risk-journey.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';
import { IsmsRiskSettingsService } from 'src/app/core/services/settings/organization_settings/isms-risk-settings/isms-risk-settings.service';
import { IsmsRiskInfoWorkflowService } from 'src/app/core/services/isms/isms-risks/isms-risk-info-workflow/isms-risk-info-workflow.service';
import { IsmsRiskInfoWorkflowStore } from 'src/app/stores/isms/isms-risks/isms-risk-info-workflow.store';

declare var $: any;

@Component({
  selector: 'app-isms-risk-context',
  templateUrl: './isms-risk-context.component.html',
  styleUrls: ['./isms-risk-context.component.scss']
})
export class IsmsRiskContextComponent implements OnInit {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('matrixForm') matrixForm: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  IsmsRisksStore = IsmsRisksStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  IsmsRiskSettingStore = ISMSRiskSettingStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  IsmsImpactStore = IsmsImpactStore;
  IsmsLikelihoodStore = IsmsLikelihoodStore;
  IsmsRiskScoreStore = IsmsRiskScoreStore;
  IsmsRiskInfoWorkflowStore = IsmsRiskInfoWorkflowStore;
  IsmsRiskRatingMasterStore = IsmsRiskRatingMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  AppStore = AppStore;
  workflowModalOpened = false;
  workflowHistoryOpened = false;
  activeIndex = null;
  hover = false;
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle: ''
  };

  userDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }

  ownerDetailObject = {
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    id: null,
    department: '',
    status_id: null,
  }
  AuthStore = AuthStore;
  deleteEventSubscription: any;
  workflowEventSubscription: any;
  historyEventSubscription: any;
  emptyAnalysis = "analysis_empty_title";
  emptyControlEfficiency = "efficiency_analysis_empty_title";
  emptyBudgetList = "budget_empty_title";
  downloadMessage: string = 'downloading';
  SubmenuItemStore = SubMenuItemStore;
  workflowCommentEventSubscription: any;


  constructor(private _utilityService: UtilityService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _ismsRisksService: IsmsRisksService,
    private _eventEmitterService: EventEmitterService,
    private _riskSettingsService: IsmsRiskSettingsService,
    private _discussionBotService: DiscussionBotService,
    // private _impactService: ImpactService,
    private _impactService: IsmsImpactService,
    // private _likelihoodService: LikelihoodService,
    private _likelihoodService: IsmsLikelihoodService,
    // private _riskRatingService: RiskRatingService,
    private _riskRatingService: IsmsRiskRatingService,
    // private _riskScoreService: RiskScoreService,
    private _riskScoreService: IsmsRiskScoreService,
    private _riskInfoWorkflowService: IsmsRiskInfoWorkflowService,
    // private _risksJourneyService: RiskJourneyService
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.makeEmpty();

    this.getWorkflowDetails();

    var subMenuItems = [];
    this.reactionDisposer = autorun(() => {
      if (IsmsRisksStore.individualRiskDetails?.risk_status?.type != 'closed') {
        if (IsmsRisksStore.individualRiskDetails?.is_functional) {
          if (IsmsRisksStore.individualRiskDetails?.submitted_by == null && IsmsRisksStore.individualRiskDetails?.workflow_items?.length > 0 && this.isProperUser()) {
            subMenuItems = [
              { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
              { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
              { activityName: 'SUBMIT_RISK', submenuItem: { type: 'submit' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
            ]
          }
          else {
            if (this.isProperEditUser()) {
              if (this.isUser() && IsmsRisksStore.individualRiskDetails?.submitted_by != null) {
                if (IsmsRisksStore.individualRiskDetails.next_review_user_level == IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'approve' } },
                    { activityName: null, submenuItem: { type: 'revert' } },
                    { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                    { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                  ]
                }
                else if (IsmsRisksStore.individualRiskDetails.next_review_user_level != IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'review_submit' } },
                    { activityName: null, submenuItem: { type: 'revert' } },
                    { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                    { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                  ]
                }
              }
              else {
                subMenuItems = [
                  { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                  { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
                  { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                ]
              }

            }
            else {

              if (this.isUser() && IsmsRisksStore.individualRiskDetails?.submitted_by != null) {
                if (IsmsRisksStore.individualRiskDetails.next_review_user_level == IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'approve' } },
                    { activityName: null, submenuItem: { type: 'revert' } },


                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                  ]
                }
                else if (IsmsRisksStore.individualRiskDetails.next_review_user_level != IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'review_submit' } },
                    { activityName: null, submenuItem: { type: 'revert' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                  ]
                }
              }
              else {
                subMenuItems = [

                  { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
                ]
              }


            }

          }

        }
        else {
          if (IsmsRisksStore.individualRiskDetails?.submitted_by == null && IsmsRisksStore.individualRiskDetails?.workflow_items?.length > 0 && this.isProperUser()) {
            subMenuItems = [
              { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
              { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
              { activityName: 'SUBMIT_RISK', submenuItem: { type: 'submit' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
            ]
          }
          else {
            if (this.isProperEditUser()) {
              if (this.isUser() && IsmsRisksStore.individualRiskDetails?.submitted_by != null) {
                if (IsmsRisksStore.individualRiskDetails.next_review_user_level == IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'approve' } },
                    { activityName: null, submenuItem: { type: 'revert' } },
                    { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                    { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                  ]
                }

                else if (IsmsRisksStore.individualRiskDetails.next_review_user_level != IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'review_submit' } },
                    { activityName: null, submenuItem: { type: 'revert' } },
                    { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                    { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                  ]
                }
              }
              else {
                subMenuItems = [

                  { activityName: 'UPDATE_RISK', submenuItem: { type: 'edit_modal' } },
                  { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },

                  { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                ]
              }


            }
            else {

              if (this.isUser() && IsmsRisksStore.individualRiskDetails?.submitted_by != null) {
                if (IsmsRisksStore.individualRiskDetails.next_review_user_level == IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'approve' } },
                    { activityName: null, submenuItem: { type: 'revert' } },


                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                  ]
                }
                else if (IsmsRisksStore.individualRiskDetails.next_review_user_level != IsmsRiskInfoWorkflowStore?.workflowDetails[IsmsRiskInfoWorkflowStore?.workflowDetails?.length - 1]?.level) {
                  subMenuItems = [
                    { activityName: null, submenuItem: { type: 'review_submit' } },
                    { activityName: null, submenuItem: { type: 'revert' } },

                    { activityName: null, submenuItem: { type: 'export_to_excel' } },
                    { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                  ]
                }
              }
              else {
                subMenuItems = [

                  { activityName: null, submenuItem: { type: 'export_to_excel' } },
                  { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
                ]
              }


            }

          }

        }
      }
      else {
        if (IsmsRisksStore.individualRiskDetails?.is_functional) {
          subMenuItems = [

            { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: '/isms/isms-risks' } },
          ]
        }
        else {
          subMenuItems = [

            { activityName: 'DELETE_RISK', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'export_to_excel' } },
            { activityName: null, submenuItem: { type: 'close', path: '/isms/corporate-isms-risks' } },
          ]
        }
      }


      if (IsmsRisksStore.individual_risk_loaded)
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              IsmsRisksStore.setEditFlag();
              this._router.navigateByUrl('/isms/isms-risks/edit-isms-risk');
            }, 1000);
            break;
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitForReview();
            break
          case 'approve':
            // SubMenuItemStore.submitClicked = true;
            this.approveRisk();
            break
          case 'review_submit':
            // SubMenuItemStore.submitClicked = true;
            this.approveRisk(true);
            break
          case 'revert':
            // SubMenuItemStore.submitClicked = true;
            this.revertRisk();
            break
          case "delete":
            this.deleteRisk(IsmsRisksStore.riskId);
            break;
          case "export_to_excel":
            this.exportRiskContext();
            break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AppStore.showDiscussion = false;

    setTimeout(() => {

      window.addEventListener('click', this.clickEvent, false);
      this._utilityService.detectChanges(this._cdr);

    }, 250);

    this._riskSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._ismsRisksService.getItem(IsmsRisksStore.riskId).subscribe(resp => {
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        if (resp['is_analysis_performed'] == 1) {
          this._ismsRisksService.getContextChart(IsmsRisksStore.riskId).subscribe(res => {
            this._riskInfoWorkflowService.getItems(IsmsRisksStore.riskId).subscribe(res => {
              this._utilityService.detectChanges(this._cdr);
            })
            this._utilityService.detectChanges(this._cdr);
          })
        }
      }, 500);
      this._utilityService.detectChanges(this._cdr);
      // this._router.onSameUrlNavigation='reload';


    })
    // this._risksJourneyService.getItem(IsmsRisksStore.riskId).subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })




    // if (IsmsRisksStore.individualRiskDetails?.is_analysis_performed == 1) {
    //   this._ismsRisksService.getContextChart(IsmsRisksStore.riskId).subscribe(res => {
    //     this._utilityService.detectChanges(this._cdr);
    //   })
    // }
    IsmsImpactStore.orderBy = "asc";
    IsmsImpactStore.orderItem = "score";
    IsmsLikelihoodStore.orderItem = "score";

    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    // else{

    // }

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.workflowEventSubscription = this._eventEmitterService.ismsRiskInfoWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.ismsRiskInfoHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.ismsRiskWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })
    DiscussionBotStore.setDiscussionMessage([]);
    DiscussionBotStore.setbasePath('/isms-risks/');
    // this.setDiscussionComment();
    // this.getDiscussions();
    // this.downloadDiscussionThumbnial();
    // this.showThumbnailImage();
    // this.getImagePrivew();
  }

  // ngAfterViewChecked(){

  // }

  isUser() {
    if (IsmsRiskInfoWorkflowStore?.loaded) {
      for (let i of IsmsRiskInfoWorkflowStore?.workflowDetails) {
        if (i.level == IsmsRisksStore.individualRiskDetails?.next_review_user_level) {
          var pos = i.risk_workflow_item_users.findIndex(e => e.id == AuthStore.user.id)
          if (pos != -1)
            return true;
          else
            return false
        }
      }
    }
    else {
      return false;
    }

  }

  getWorkflowDetails() {
    this._riskInfoWorkflowService.getItems(IsmsRisksStore.riskId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setDiscussionComment() {
    DiscussionBotStore.setDiscussionAPI(IsmsRisksStore.riskId + '/comments')
  }

  getDiscussions() {
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // risk-treatments/1/comments/1/files/1/download
  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(IsmsRisksStore.riskId + '/comments/')
  }
  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(IsmsRisksStore.riskId + '/comments/')
  }
  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/risk-management /files/risk-comment-document/thumbnail?token=')
  }

  openHistoryPopup() {
    IsmsRiskInfoWorkflowStore.setCurrentPage(1);
    this._riskInfoWorkflowService.getHistory(IsmsRisksStore.riskId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });



  }

  // ngDoCheck(){
  // this._ismsRisksService.getItem(IsmsRisksStore.riskId).subscribe(resp => {
  //   this._utilityService.detectChanges(this._cdr);
  //   setTimeout(() => {
  //     if (resp['is_analysis_performed'] == 1) {
  //       this._ismsRisksService.getContextChart(IsmsRisksStore.riskId).subscribe(res => {
  //         this._utilityService.detectChanges(this._cdr);
  //       })
  //     }
  //   }, 500);


  // })
  // }


  isProperUser() {
    if (AuthStore.user.id == IsmsRisksStore.individualRiskDetails?.created_by.id) {
      return true;
    }
    else {
      return false;
    }
  }




  isProperEditUser() {

    if (IsmsRisksStore.individualRiskDetails?.risk_status?.type == 'identified' && IsmsRisksStore.individualRiskDetails?.submitted_by == null) {
      if (this.isProperUser())
        return true;
      else
        return false
    }
    else if (IsmsRisksStore.individualRiskDetails?.risk_status?.type != 'identified' && (RiskJourneyStore.individualRiskJourney?.journey_submitted_by == null || (RiskJourneyStore.individualRiskJourney?.journey_submitted_by != null && IsmsRisksStore.individualRiskDetails?.risk_status.type != 'approved'))) {
      if (this.isProperUser())
        return true;
      else
        return false;

    }
    else
      return false;


  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  isChampion() {
    let count = 0
    for (let i of AuthStore.user?.roles) {
      if (i.id == 3) {
        count++;
        return true
      }
    }
    if (count == 0)
      return false;
  }

  submitForReview() {
    this._riskInfoWorkflowService.submitRisk(IsmsRisksStore.riskId).subscribe(res => {
      this._ismsRisksService.getItem(IsmsRisksStore.riskId).subscribe((res) => {
        SubMenuItemStore.submitClicked = false;
        this._utilityService.detectChanges(this._cdr);
      })
      // this._utilityService.detectChanges(this._cdr);

    })
  }

  openWorkflowPopup() {
    this._riskInfoWorkflowService.getItems(IsmsRisksStore.riskId).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }

  approveRisk(type?) {
    if (type) {
      IsmsRiskInfoWorkflowStore.type = 'submit';
    }
    else
      IsmsRiskInfoWorkflowStore.type = 'approve';
    IsmsRiskInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
    // this._riskInfoWorkflowService.approveRisk(IsmsRisksStore.riskId,{}).subscribe(res=>{
    //   this._ismsRisksService.getItem(IsmsRisksStore.riskId).subscribe(()=>this._utilityService.detectChanges(this._cdr))

    //   this._utilityService.detectChanges(this._cdr);
    // })
  }

  closeCommentForm() {
    IsmsRiskInfoWorkflowStore.type = '';
    IsmsRiskInfoWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertRisk() {
    IsmsRiskInfoWorkflowStore.type = 'revert';
    IsmsRiskInfoWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  getCreatedByPopupDetails(users) {
    let userDetails: any = {};

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
    return userDetails;

  }

  closeWorkflowPopup() {

    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }

  exportRiskContext() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {
      let element: HTMLElement;
      element = document.getElementById("risk-context");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
        .then(function (dataUrl) {
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            // console.log(base64data);
            pthis.downloadPdf(base64data);
          }
          // SubMenuItemStore.exportClicked = false;
          // pthis.closeLoaderPopUp();
        });
    }, 100);

  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.closeLoaderPopUp();
    })
  }

  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  deleteRisk(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_risk_confirmation';

    $(this.deletePopup.nativeElement).modal('show');
  }
  clearDeleteObject() {

    this.deleteObject.id = null;

  }

  getPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.userDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department?.title ? user.department?.title : null;
      this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
      return this.userDetailObject;
    }

  }

  getOwnerPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.ownerDetailObject.first_name = user.first_name;
      this.ownerDetailObject.last_name = user.last_name;
      this.ownerDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.ownerDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.ownerDetailObject.email = user.email;
      this.ownerDetailObject.mobile = user.mobile;
      this.ownerDetailObject.id = user.id;
      this.ownerDetailObject.department = user.department?.title ? user.department?.title : null;
      this.ownerDetailObject.status_id = user.status_id ? user.status_id : 1;
      return this.ownerDetailObject;
    }

  }


  /**
* Delete the risk
* @param id -risk id
*/
  delete(status) {
    if (status && this.deleteObject.id) {

      this._ismsRisksService.delete(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          if (IsmsRisksStore.individualRiskDetails?.is_corporate)
            this._router.navigateByUrl('isms/corporate-isms-risks');
          else
            this._router.navigateByUrl('isms/isms-risks');

        }, 500);
        this.clearDeleteObject();

      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }


  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }

  gotoRiskMatrix() {
    this._router.navigateByUrl('/isms/isms-risk-matrix')
    // $(this.matrixForm.nativeElement).modal('show');
    // this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'block');
    // this._router.navigateByUrl('/risk-management/risk-matrix');
  }

  closeMatrix() {
    $(this.matrixForm.nativeElement).modal('hide');



    this._renderer2.setStyle(this.matrixForm.nativeElement, 'display', 'none');

    $('.modal-backdrop').remove();
  }

  gotoUser(id) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }


  mouseHover(event, index?) {

    if (index != undefined) {

      this.activeIndex = index;
    }
    else {
      this.activeIndex = null;
    }
    this.hover = true;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
    }

  }

  mouseOut(event) {
    this.activeIndex = null;
    this.hover = false;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    }

  }

  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.workflowCommentEventSubscription.unsubscribe();
    // AppStore.showDiscussion = false;
  }

}
