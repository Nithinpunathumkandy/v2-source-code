import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAnnualAuditPlanWorkflowService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan-workflow/am-annual-audit-plan-workflow.service';
import { AmAnnualAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAnnualAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan-workflow.store';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-individual-audit-plan-info',
  templateUrl: './individual-audit-plan-info.component.html',
  styleUrls: ['./individual-audit-plan-info.component.scss']
})
export class IndividualAuditPlanInfoComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  AppStore = AppStore;
  AmAuditPlansStore = AmAuditPlansStore;
  AmAnnualAuditPlansStore = AmAnnualAuditPlansStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmAnnualAuditPlanWorkflowStore = AmAnnualAuditPlanWorkflowStore;
  reactionDisposer: IReactionDisposer;
  auditPlanObject = {
    component: 'Audit Plan',
    values: null,
    type: null
  };
  workflowEventSubscription: any;
  historyEventSubscription: any;
  workflowCommentEventSubscription: any;
  deleteEventSubscription: any;
  workflowModalOpened = false;
  workflowHistoryOpened = false;
  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  auditPlanEventSubscription: any;
  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _annualAuditPlansService: AmAnnualAuditPlanService,
    private _eventEmitterService: EventEmitterService,
    private _annualAuditPlanWorkflowService: AmAnnualAuditPlanWorkflowService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _route:ActivatedRoute,
    private _auditPlanService:AmAuditPlanService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if (AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.submitted_by == null && AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.workflow_items?.length > 0 && AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.created_by?.id == AuthStore.user?.id) {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'submit' } },

          { activityName: null, submenuItem: { type: 'workflow' } },
          { activityName: null, submenuItem: { type: 'history' } },
          { activityName: 'UPDATE_AM_ANNUAL_PLAN', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_AM_ANNUAL_PLAN', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } },
        ]
      }
      else {
        if (this.isUser() && AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.submitted_by != null) {
          if (AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.next_review_user_level == AmAnnualAuditPlanWorkflowStore?.workflowDetails[AmAnnualAuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'approve' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } }
            ]
          }
          else if (AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.next_review_user_level != null && (AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.next_review_user_level != AmAnnualAuditPlanWorkflowStore?.workflowDetails[AmAnnualAuditPlanWorkflowStore?.workflowDetails?.length - 1]?.level)) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'review_submit' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } }
            ]
          }
          else {
            subMenuItems = [

              { activityName: null, submenuItem: { type: 'workflow' } },
              { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } }
            ]
          }
        }
        else if (AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.submitted_by == null) {
          subMenuItems = [

            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: 'CREATE_AM_ANNUAL_PLAN', submenuItem: { type: 'edit_modal' } },
            { activityName: 'DELETE_AM_ANNUAL_PLAN', submenuItem: { type: 'delete' } },
            { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } }
          ]
        }
        else {
          subMenuItems = [
            { activityName: null, submenuItem: { type: 'workflow' } },
            { activityName: null, submenuItem: { type: 'history' } },
            { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans' } }

          ]
        }
      }


      if (subMenuItems)
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              this._utilityService.detectChanges(this._cdr);
              this.editAnnualAuditPlan(AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id);
            }, 1000);
            break;

          case 'delete':

            this.deleteAnnualAuditPlan(AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id);
            break

          case 'submit':

            this.submitConfirm();
            break
          case 'approve':

            this.approveAuditPlan();
            break
          case 'review_submit':

            this.approveAuditPlan(true);
            break
          case 'revert':

            this.revertAuditPlan();
            break

          case 'workflow':

            this.openWorkflowPopup();
            break
          case 'history':

            this.openHistoryPopup();
            break
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })


    this.auditPlanEventSubscription = this._eventEmitterService.auditManagementAnnualAuditPlanAddModal.subscribe(item => {
      this.closeFormModal();
    })



    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status) {
        this.changeZIndex();
      }
    })

    this.workflowEventSubscription = this._eventEmitterService.amAnnualAuditPlanWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.amAnnualAuditPlanHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.amAnnualAuditPlanWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    if(!AmAnnualAuditPlansStore.individual_annual_audit_plan_loaded){
      this.getAnnualAuditPlanDetails();
    }
    if(AmAnnualAuditPlansStore.individual_annual_audit_plan_loaded)
    this.getWorkflow(AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id);
  }

  

  getAnnualAuditPlanDetails(){
    let id: number;
    this._route.params.subscribe(params => {
      id = +params['ind_id']; // (+) converts string 'id' to a number
      // this._auditPlansService.saveAuditPlanId(id);
      let auditId=+params['id'];
      this._annualAuditPlansService.getItem(id).subscribe(res => {
        // this.getWorkflow(id);
        this._auditPlanService.saveAuditPlanId(auditId);
        this._auditPlanService.getItem(auditId).subscribe(res=>{
          this.getWorkflow(id);
          this._utilityService.detectChanges(this._cdr);
        })
        this._utilityService.detectChanges(this._cdr)
      })
    })
   
  }


  getWorkflow(id) {
    this._annualAuditPlanWorkflowService.getItems(AmAuditPlansStore.auditPlanId, id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }


  /**
  * Delete the audit plan
  * @param id -audit plan id
  */
  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._annualAuditPlansService.delete(this.deleteObject.id);
          break;

      }

      type.subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);
        // this.setSubmenu();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('/audit-management/am-audit-plans/' + AmAuditPlansStore.individualAuditPlanDetails?.id + '/annual-audit-plans')

        }, 500);
        this.clearDeleteObject();
      }, (error => {
        setTimeout(() => {
          if (error.status == 405) {
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }


  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.auditPlanObject.type = null;
    // this.setSubmenu()
    this._utilityService.detectChanges(this._cdr);
  }

  deleteAnnualAuditPlan(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_annual_audit_plan_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  getArrayFormattedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getCreatedByDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id ? users?.status?.id : 1;

    return userDetial;
  }



  getManagerPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id ? users?.status?.id : 1;

    return userDetial;
  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id ? users?.status?.id : 1;

    return userDetial;
  }



  isUser() {
    if (AmAnnualAuditPlanWorkflowStore?.loaded) {
      for (let i of AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.workflow_items) {
        if (i.level == AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.next_review_user_level) {
          var pos = i.users.findIndex(e => e.id == AuthStore.user?.id)
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


  editAnnualAuditPlan(id) {

    this._annualAuditPlansService.getItem(id).subscribe(res => {

      this.auditPlanObject.values = {
        id: id,
        am_annual_plan_id: AmAuditPlansStore?.auditPlanId,
        am_annual_plan_auditable_item_id: res['am_annual_plan_auditable_item'],
        am_annual_plan_frequency_item_id: res['am_annual_plan_frequency_item'],
        audit_manager_id: res['audit_manager'],
        start_date: this._helperService.processDate(res['start_date'], 'split'),
        end_date: this._helperService.processDate(res['end_date'], 'split'),
        hours: res['hours'],
        user_ids: res['auditors'],
        department_ids: res['departments']

      }
      this.auditPlanObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
        this._utilityService.detectChanges(this._cdr);
      }, 100);

    })
  }



  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
        break;
      case 'Confirm': this.confirmSubmit(status)
        break;

    }
  }

  submitConfirm() {

    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'am_annual_audit_plan_submit_confirm?';

    $(this.deletePopup.nativeElement).modal('show');
  }

  confirmSubmit(status) {
    if (status && SubMenuItemStore.submitClicked == false) {
      SubMenuItemStore.submitClicked = true;
      this.submitForReview();
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr);
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }


  submitForReview() {
    AppStore.enableLoading();
    this._annualAuditPlanWorkflowService.submitAuditPlan(AmAuditPlansStore.auditPlanId, AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id).subscribe(res => {
      // this._auditPlansService.getItem(AmAuditPlansStore.auditPlanId).subscribe((res) => {
      SubMenuItemStore.submitClicked = false;
      AppStore.disableLoading();
      // setTimeout(() => {
      //   this.setSubmenu();
      // }, 1000);

      this._utilityService.detectChanges(this._cdr);
      // })

    })
  }

  openWorkflowPopup() {
    event.stopPropagation();
    this._annualAuditPlanWorkflowService.getItems(AmAuditPlansStore.auditPlanId, AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    })
  }

  approveAuditPlan(type?) {
    if (type) {
      AmAnnualAuditPlanWorkflowStore.type = 'submit';
    }
    else
      AmAnnualAuditPlanWorkflowStore.type = 'approve';
    AmAnnualAuditPlanWorkflowStore.approveText = 'am_annual_audit_plan_approve_text';
    AmAnnualAuditPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');

  }

  closeCommentForm() {
    AmAnnualAuditPlanWorkflowStore.type = '';
    AmAnnualAuditPlanWorkflowStore.approveText = '';
    AmAnnualAuditPlanWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    // this.setSubmenu();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertAuditPlan() {
    AmAnnualAuditPlanWorkflowStore.type = 'revert';
    AmAnnualAuditPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  openHistoryPopup() {
    event.stopPropagation();
    AmAnnualAuditPlanWorkflowStore.setCurrentPage(1);
    this._annualAuditPlanWorkflowService.getHistory(AmAuditPlansStore.auditPlanId, AmAnnualAuditPlansStore.individualAnnualAuditPlanDetails?.id).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    });



  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeWorkflowPopup() {

    this.workflowModalOpened = false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditPlanEventSubscription.unsubscribe();
    this.workflowEventSubscription.unsubscribe();
    this.historyEventSubscription.unsubscribe();
    this.workflowCommentEventSubscription.unsubscribe();
    AmAnnualAuditPlansStore.unsetIndiviudalAnnualAuditPlanDetails();
  }


}
