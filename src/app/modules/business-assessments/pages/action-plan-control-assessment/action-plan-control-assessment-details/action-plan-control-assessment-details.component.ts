import { number } from '@amcharts/amcharts4/core';
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer,toJS } from 'mobx';
import { ControlAssessmentActionPlanService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-action-plan/control-assessment-action-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { CAActionPlanStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-action-plan-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-action-plan-control-assessment-details',
  templateUrl: './action-plan-control-assessment-details.component.html',
  styleUrls: ['./action-plan-control-assessment-details.component.scss']
})
export class ActionPlanControlAssessmentDetailsComponent implements OnInit {
  @ViewChild('addCAformModal', { static: true }) addCAformModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('UpdateCAformModal', { static: true }) UpdateCAformModal: ElementRef;
  @ViewChild('historyPopup', { static: true }) historyPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore=AuthStore;
  CAActionPlanStore=CAActionPlanStore;
  AppStore = AppStore;
  correctiveActionPlanId:number;
  actionPlanModalObject = {
    values: null,
    type: null,
    controlId:null,
  };
  caUpdateObject = {
    completion: '',
    values: null,
    type: null,
    id:null,
    status:null
  };
  popupObject = {
    category: '',
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  historyObject={
    type:''
  }
  totalDays:number;
  remainingDaysAre:number;
  historySubscriptionEvent: any;
  updateSubscriptionEvent: any;
  actionPlanSubscriptionEvent: any = null;
  deleteEventSubscription:any;
  todayDate: any = new Date();
  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private route: ActivatedRoute,
    private _controlAssessmentActionPlanService:ControlAssessmentActionPlanService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.gotoEditPage();
            break;
          case "delete":
            this.deleteCa(CAActionPlanStore.CAActionPlanDetails.id);
            break;
          case "update_modal":
            this.updateCorrectiveAction();
            break;
          case "history":
            this.openHistoryModal();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.actionPlanSubscriptionEvent = this._eventEmitterService.controlAssessmentActionModalControl.subscribe(res => {
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.updateSubscriptionEvent = this._eventEmitterService.controlAssessmentCaUpdateModal.subscribe(res => {
      this.closeUpdateModal();
    })

    this.historySubscriptionEvent = this._eventEmitterService.controlAssessmentCaHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    })
    this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.correctiveActionPlanId = id;
      this.getActionPlan(id);
    });

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:"action_plan",
      path:'/business-assessments/control-assessment-action-plans'
    });
  }

  setSubmenu(res) {
    var subMenuItems = [];
    if(this.isUser() || AuthStore.isRoleChecking('super-admin'))
    {
      if(res.control_assessment_action_plan_status?.type!='resolved' && res.control_assessment_action_plan_status?.type!='closed')
      {
        subMenuItems.push({ activityName: '', submenuItem: { type: 'edit_modal' } });
        subMenuItems.push({ activityName: '', submenuItem: { type: 'delete' } });
        subMenuItems.push({ activityName: '', submenuItem: { type: 'update_modal' } });
      }
    }
    else{
      if(res.control_assessment_action_plan_status?.type!='resolved' && res.control_assessment_action_plan_status?.type!='closed')
      {
        subMenuItems.push({ activityName: '', submenuItem: { type: 'edit_modal' } });
        subMenuItems.push({ activityName: '', submenuItem: { type: 'delete' } });
      }
    }
    subMenuItems.push({ activityName: '', submenuItem: { type: 'history' } });
    subMenuItems.push({ activityName: null, submenuItem: { type: 'close', path: '/business-assessments/control-assessment-action-plans' } });
    this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
  }
  getActionPlan(id) {
    this._controlAssessmentActionPlanService.getItem(id).subscribe(res => {
      this.setSubmenu(res);
     this._utilityService.detectChanges(this._cdr);
    });
  }

  isUser() {
        for (let i of CAActionPlanStore.CAActionPlanDetails?.responsible_users) {
            if (i.id == AuthStore.user.id){
              return true;
            }
        }
    }

  getDaysRemaining() {
    let startDate = new Date(CAActionPlanStore.CAActionPlanDetails?.target_date);
    this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDaysAre >= 0)
      this.remainingDaysAre = this.remainingDaysAre + 1;
    else
      this.remainingDaysAre = 0;
    return this.remainingDaysAre;
  }
  getTotaldays() {
    let startDate = new Date(CAActionPlanStore.CAActionPlanDetails?.start_date);
    let targetDate = new Date(CAActionPlanStore.CAActionPlanDetails?.target_date);
    let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
    this.totalDays = Math.abs(days) + 1;
    return this.totalDays;
  }

  updateCorrectiveAction() {
    this.caUpdateObject.type = null;
    this.caUpdateObject.id =CAActionPlanStore.CAActionPlanDetails?.id,
    this.caUpdateObject.status =CAActionPlanStore.CAActionPlanDetails?.business_assessment_action_plan_status,
    this.caUpdateObject.completion =CAActionPlanStore.CAActionPlanDetails?.completion
      
    //CAActionPlanStore.clearDocumentDetails();
    this.caUpdateObject.type = 'Add'

    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('show');
    }, 50);
    this._utilityService.detectChanges(this._cdr);
  }

  closeUpdateModal() {
    setTimeout(() => {
      $(this.UpdateCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this.caUpdateObject.type = null;
    // this.pageChange();
    this.getActionPlan(CAActionPlanStore.CAActionPlanDetails.id);
  }

   // History Modal
   openHistoryModal() {
   // this.historyPageChange(1);
    this.historyObject.type='view';
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    
  }
  closeHistoryModal() {
    this.historyObject.type='';
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);

    // this.pageChange();
    //this.getCorrectiveActions();
  }
  historyPageChange(newPage: number = null) {
    if (newPage) CAActionPlanStore.setHistoryCurrentPage(newPage);
    this._controlAssessmentActionPlanService.getCaHistory(CAActionPlanStore.CAActionPlanDetails?.id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  openFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('show');
    }, 50);
  }

  // for closing the rca form modal
  closeFormModal() {
    setTimeout(() => {
      $(this.addCAformModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);

    }, 100);
    this.actionPlanModalObject.type = null;
    this.getActionPlan(this.correctiveActionPlanId);
  }

  gotoEditPage() {
    const corrective_action = CAActionPlanStore.CAActionPlanDetails; // assigning values for edit
    this.actionPlanModalObject.controlId=corrective_action.control_assessment_document_version_content_control.id,
    this.actionPlanModalObject.values = {
      id: corrective_action.id,
      title: corrective_action.title,
      responsible_users: toJS(corrective_action.responsible_users),
      description: corrective_action.description,
      start_date: corrective_action.start_date,
      target_date: corrective_action.target_date,
    }
    this.actionPlanModalObject.type = 'Edit';
    this.openFormModal();
  }

  getCreatedByPopupDetails(users, created?: string) {
    let userDetial: any = {};
    userDetial['first_name'] = users.first_name;
    userDetial['last_name'] = users.last_name;
    userDetial['designation'] = users.designation;
    userDetial['image_token'] = users.image.token;
    userDetial['email'] = users.email;
    userDetial['mobile'] = users.mobile;
    userDetial['id'] = users.id;
    userDetial['department'] = users.department;
    userDetial['status_id'] = users.status_id ? users.status_id : users.status.id;
    userDetial['created_at'] = created ? created : null;
    return userDetial;

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  delete(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteCorrectiveActions(status)
        break;
    }
  }

  deleteCa(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Action Plan?';
    this.popupObject.subtitle = 'cyber_it_will_remove_the_action_plan';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCorrectiveActions(status) {
    if (status && this.popupObject.id) {
      this._controlAssessmentActionPlanService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this._router.navigateByUrl('/business-assessments/control-assessment-action-plan');
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
  getTimezoneFormatted(time) {
    return this._helperService.timeZoneFormatted(time);
  }
  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }
      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation;
      userInfoObject.image_token = user?.image.token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status.id
      userInfoObject.department = null;
      return userInfoObject;
    }

  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.actionPlanSubscriptionEvent.unsubscribe();
    CAActionPlanStore.unSetActionPlanHistory();
    CAActionPlanStore.unsetCAACtionPlanDetails();
    this.updateSubscriptionEvent.unsubscribe();
    this.historySubscriptionEvent.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
  }

}
