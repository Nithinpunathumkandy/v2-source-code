import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditDraftReportsService } from 'src/app/core/services/audit-management/am-audit-draft-reports/am-audit-draft-reports.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmDraftReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-draft-report-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmDraftReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-field-work/am-draft-report-workflow.store';
import { AmDraftWorkflowService } from 'src/app/core/services/audit-management/am-audit-field-work/am-draft-workflow/am-draft-workflow.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-am-audit-draft-reports',
  templateUrl: './am-audit-draft-reports.component.html',
  styleUrls: ['./am-audit-draft-reports.component.scss']
})
export class AmAuditDraftReportsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle: '',
    title: ''
  };

  reportObject = {
    component: 'Draft',
    values: null,
    audit_id: null,
    report_id: null,
    content_id: null
  }
  AmDraftReportStore = AmDraftReportStore;
  AmDraftReportWorkflowStore = AmDraftReportWorkflowStore;
  AppStore = AppStore;
  reportEventSubscription: any;
  workflowEventSubscription: any;
  historyEventSubscription: any;
  workflowCommentEventSubscription: any;
  workflowModalOpened = false;
  workflowHistoryOpened = false;

  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _draftReportService: AmAuditDraftReportsService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _reportWorkflowService: AmDraftWorkflowService,
    private _auditsService: AmAuditService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'generate_draft_report' });

    this.reactionDisposer = autorun(() => {

      if (AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(3900, 'CREATE_AM_AUDIT_PRELIMINARY_REPORT') && AuthStore.user?.id==AmAuditFieldWorkStore.individualAuditFieldWorkDetails?.created_by?.id) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.generateConfirm();

        NoDataItemStore.unSetClickedNoDataItem();
      }

      this._utilityService.detectChanges(this._cdr);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {


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
            break;
          case 'history':

            this.openHistoryPopup();
            break;
          case 'delete':

            this.confirmReportDelete();
            break;

          case 'export_to_excel':
            SubMenuItemStore.exportClicked = true
            this.getExport(AmAuditFieldWorkStore.auditFieldWorkId)            
            break;


          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.reportEventSubscription = this._eventEmitterService.amReportUpdateModal.subscribe(item => {
      this.closeDraftReportModal();
    })

    this.workflowEventSubscription = this._eventEmitterService.amDraftWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.amDraftHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.amDraftWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })


    SubMenuItemStore.setNoUserTab(true);

    this.getReports();
    this.setSubMenu();
  }

  setSubMenu(id?) {
    this._draftReportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe((res) => {
      if (res?.submitted_by == null && res?.workflow_items?.length > 0 && res?.created_by?.id == AuthStore.user?.id) {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'submit' } },
          // { activityName: null, submenuItem: { type: 'workflow' } },
          // { activityName: null, submenuItem: { type: 'history' } },
          { activityName: null, submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },

        ]
      }
      else {
        if (this.isUser(res) && res?.submitted_by != null) {
          if (res?.next_review_user_level == AmDraftReportWorkflowStore?.workflowDetails[AmDraftReportWorkflowStore?.workflowDetails?.length - 1]?.level) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'approve' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }
          else if (res?.next_review_user_level != null && (res?.next_review_user_level != AmDraftReportWorkflowStore?.workflowDetails[AmDraftReportWorkflowStore?.workflowDetails?.length - 1]?.level)) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'review_submit' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }
          else {

            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }
        }
        else {
          if (res?.submitted_by == null && res?.created_by?.id == AuthStore.user?.id) {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'delete' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }
          else {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }

        }
      }
      if(Object.keys(res).length !=0){
        subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'export_to_excel' } },)
        subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'history' } },)
        subMenuItems.splice(0,0,{ activityName: null, submenuItem: { type: 'workflow' } },)
      }

      this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    });
    this._utilityService.detectChanges(this._cdr);
  }


  getReports() {
    this._draftReportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
      if(Object.keys(res).length !=0){
        this.getWorkflow(res['id']);
      }      
      this.setSubMenu();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  generateDraftReport() {

    this._utilityService.detectChanges(this._cdr);
    this._draftReportService.saveItem(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
      this.setSubMenu();
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr);
    })
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  deleteReport() {
    if (this.deleteObject.id) {
      this._draftReportService.deleteReport(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(resp => {
        setTimeout(() => {
          this.setSubMenu();
          this._utilityService.detectChanges(this._cdr);
          // this._router.navigateByUrl('audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-information-request');

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


  delete() {
    if (this.deleteObject.id) {
      this._draftReportService.delete(AmAuditFieldWorkStore.auditFieldWorkId, AmDraftReportStore.reportDetails?.id, this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          // this._router.navigateByUrl('audit-management/am-audits/' + AmAuditsStore.auditId + '/am-audit-information-request');

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
  editDraftReport(data) {
    this.reportObject.values = data.description;
    this.reportObject.audit_id = AmAuditFieldWorkStore.auditFieldWorkId;
    this.reportObject.report_id = AmDraftReportStore.reportDetails?.id;
    this.reportObject.content_id = data.id;
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    $(this.formModal.nativeElement).modal('show');

  }

  closeDraftReportModal() {
    this.reportObject.values = null;
    this.reportObject.audit_id = null;
    this.reportObject.report_id = null;
    this.reportObject.content_id = null;
    this.getReports();

    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    $(this.formModal.nativeElement).modal('hide');
    $('.modal-backdrop').remove();
  }


  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.title = '';
    // this.deleteObject.subtitle = '';
  }
  deleteDraftReport(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.title = '';
    this.deleteObject.subtitle = 'delete_report_content';

    $(this.deletePopup.nativeElement).modal('show');
  }


  getPopupDetails(user) {
    let userDetailObject: any = {};
    userDetailObject['id'] = user.id;
    userDetailObject['first_name'] = user.first_name;
    userDetailObject['last_name'] = user.last_name;
    userDetailObject['designation'] = user.designation?.title ? user.designation?.title : user?.designation;
    userDetailObject['image_token'] = user.image_token;
    userDetailObject['department'] = user.department?.title ? user.department?.title : user?.department;
    return userDetailObject;

  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token ? users?.image?.token : users?.image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department?.title ? users?.department?.title : users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;

    return userDetial;
  }



  getCreatedByPopupDetails(users) {
    let userDetial: any = {};


    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    userDetial['created_at'] = AmDraftReportStore.reportDetails?.created_at;

    return userDetial;
  }




  isUser(response) {
    if (AmDraftReportWorkflowStore?.loaded && response?.workflow_items) {
      for (let i of response?.workflow_items) {
        if (i.level == response?.next_review_user_level) {
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


  submitForReview() {
    this._reportWorkflowService.submitReport(AmDraftReportStore.reportDetails?.id).subscribe(res => {
      // this._draftReportService.getItems(AmDraftReportStore.reportDetails?.id).subscribe((res) => {
      SubMenuItemStore.submitClicked = false;
      this.setSubMenu();
      this._utilityService.detectChanges(this._cdr);
      // })

    })

  }

  getWorkflow(id){
    this._reportWorkflowService.getItems(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }


  openWorkflowPopup() {
    this._reportWorkflowService.getItems(AmDraftReportStore.reportDetails?.id).subscribe(res => {
      this.workflowModalOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    })
  }
  // Once audit plan is approved, will get more privillage

  approveAuditPlan(type?) {
    if (type) {
      AmDraftReportWorkflowStore.type = 'submit';
    }
    else
      AmDraftReportWorkflowStore.type = 'approve';
    AmDraftReportWorkflowStore.approveText = 'am_report_approve_text';
    AmDraftReportWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');

  }

  getAuditProgress() {
    this._auditsService.getAmAuditProgress(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  closeCommentForm() {
    AmDraftReportWorkflowStore.type = '';
    AmDraftReportWorkflowStore.approveText = '';
    AmDraftReportWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this.setSubMenu();
    this.getAuditProgress();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertAuditPlan() {
    AmDraftReportWorkflowStore.type = 'revert';
    AmDraftReportWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  openHistoryPopup() {
    AmDraftReportWorkflowStore.setCurrentPage(1);
    this._reportWorkflowService.getHistory(AmDraftReportStore.reportDetails?.id).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });



  }



  modalControl(status: boolean) {
    if(status){
      switch (this.deleteObject.type) {
        case '':
          if (this.deleteObject.title && this.deleteObject.title == 'report') {
            this.deleteReport();
          }
          else
            this.delete()
          break;
        case 'Confirm':
          if (this.deleteObject.title && this.deleteObject.title == 'generate') {
            this.generateDraftReport();
          }
          else
            this.confirmSubmit(status)
          break;
      }
    }
    else{
      this.clearDeleteObject();
      $(this.deletePopup.nativeElement).modal('hide');
    }
    
  }

  confirmReportDelete() {
    this.deleteObject.id = AmAuditFieldWorkStore.auditFieldWorkId;
    this.deleteObject.type = '';
    this.deleteObject.title = 'report';
    this.deleteObject.subtitle = 'delete_am_report_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  submitConfirm() {

    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'am_report_submit_confirm';

    $(this.deletePopup.nativeElement).modal('show');
  }

  generateConfirm() {

    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'generate'
    this.deleteObject.subtitle = 'am_generate_report_confirm';

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

  getStatus(){
    let status = null;
    if(AmDraftReportStore.reportDetails?.submitted_by==null)
    status = 'new';
    else
    status = 'in-review'
    return status;
  }
  
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  //Export starts 
  getExport(id){
    this._draftReportService.export(id).subscribe(res=>{
      SubMenuItemStore.exportClicked = false
    }, (err: HttpErrorResponse) => {
        SubMenuItemStore.exportClicked = false
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
    })
  }
  //Export ends

  ngOnDestroy() {
    NoDataItemStore.unsetNoDataItems();
    this.workflowEventSubscription.unsubscribe();
    this.historyEventSubscription.unsubscribe();
    this.workflowCommentEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.reportEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();

    NoDataItemStore.unSetClickedNoDataItem();
  }

}
