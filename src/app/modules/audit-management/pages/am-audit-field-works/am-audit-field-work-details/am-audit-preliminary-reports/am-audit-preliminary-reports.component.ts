import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AmAuditPreliminaryReportsService } from 'src/app/core/services/audit-management/am-audit-preliminary-reports/am-audit-preliminary-reports.service';
import { AmPreliminaryWorkflowService } from 'src/app/core/services/audit-management/am-audit-field-work/am-preliminary-workflow/am-preliminary-workflow.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmPreliminaryReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-preliminary-report-store';
import { AmPreliminaryReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-field-work/am-preliminary-report-workflow.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as htmlToImage from 'html-to-image';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-am-audit-preliminary-reports',
  templateUrl: './am-audit-preliminary-reports.component.html',
  styleUrls: ['./am-audit-preliminary-reports.component.scss']
})
export class AmAuditPreliminaryReportsComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('workflowModal') workflowModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  deleteObject = {
    id: null,
    type: '',
    subtitle: '',
    title: '',
  };

  reportObject = {
    component: 'Preliminary',
    values: null,
    audit_id: null,
    report_id: null,
    content_id: null
  }
  AmPreliminaryReportStore = AmPreliminaryReportStore;
  AmPreliminaryReportWorkflowStore = AmPreliminaryReportWorkflowStore;
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
    private _preliminaryReportService: AmAuditPreliminaryReportsService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _reportWorkflowService: AmPreliminaryWorkflowService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'generate_preliminary_report' });

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
      this.closePreliminaryReportModal();
    })

    this.workflowEventSubscription = this._eventEmitterService.amPreliminaryWorkflow.subscribe(item => {
      this.closeWorkflowPopup();
    })

    this.historyEventSubscription = this._eventEmitterService.amPreliminaryHistory.subscribe(item => {
      this.closeHistoryPopup();
    })

    this.workflowCommentEventSubscription = this._eventEmitterService.amPreliminaryWorkflowCommentModal.subscribe(item => {
      this.closeCommentForm();
    })

    SubMenuItemStore.setNoUserTab(true);

    this.getReports();
    this.setSubmenu();
    this.GaugeChart();
  }


  getReports() {


    this._preliminaryReportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
      if(Object.keys(res).length !=0){
        this.getWorkflow(res['id']);
      }
      this.setSubmenu();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  generateConfirm() {

    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'generate'
    this.deleteObject.subtitle = 'am_generate_report_confirm';

    $(this.deletePopup.nativeElement).modal('show');
  }

  generatePreliminaryReport() {
    this._utilityService.detectChanges(this._cdr);
    this._preliminaryReportService.saveItem(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
      this.setSubmenu()
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr);
    })
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  setSubmenu(id?) {
    this._preliminaryReportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(res => {
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
          if (res?.next_review_user_level == AmPreliminaryReportWorkflowStore?.workflowDetails[AmPreliminaryReportWorkflowStore?.workflowDetails?.length - 1]?.level) {
            subMenuItems = [
              { activityName: null, submenuItem: { type: 'approve' } },
              { activityName: null, submenuItem: { type: 'revert' } },
              // { activityName: null, submenuItem: { type: 'workflow' } },
              // { activityName: null, submenuItem: { type: 'history' } },
              { activityName: null, submenuItem: { type: 'close', path: '/audit-management/am-audit-field-works' } },
            ]
          }
          else if (res?.next_review_user_level != null && (res?.next_review_user_level != AmPreliminaryReportWorkflowStore?.workflowDetails[AmPreliminaryReportWorkflowStore?.workflowDetails?.length - 1]?.level)) {
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

    })
    this._utilityService.detectChanges(this._cdr);

  }

  isUser(response) {
    if (AmPreliminaryReportWorkflowStore?.loaded && response?.workflow_items) {
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

  delete() {
    if (this.deleteObject.id) {
      this._preliminaryReportService.delete(AmAuditFieldWorkStore.auditFieldWorkId, AmPreliminaryReportStore.reportDetails?.id, this.deleteObject.id).subscribe(resp => {
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

  deleteReport() {
    if (this.deleteObject.id) {
      this._preliminaryReportService.deleteReport(AmAuditFieldWorkStore.auditFieldWorkId).subscribe(resp => {
        setTimeout(() => {
          this.setSubmenu();
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

  editPreliminaryReport(data) {
    this.reportObject.values = data.description;
    this.reportObject.audit_id = AmAuditFieldWorkStore.auditFieldWorkId;
    this.reportObject.report_id = AmPreliminaryReportStore.reportDetails?.id;
    this.reportObject.content_id = data.id;
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    $(this.formModal.nativeElement).modal('show');

  }

  closePreliminaryReportModal() {
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
  confirmReportDelete(){
    this.deleteObject.id =  AmAuditFieldWorkStore.auditFieldWorkId;
    this.deleteObject.type = '';
    this.deleteObject.title='report';
    this.deleteObject.subtitle = 'delete_am_report_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }
  deletePreliminaryReport(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_am_report_content_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
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
    userDetial['created_at'] = AmPreliminaryReportStore.reportDetails?.created_at;

    return userDetial;
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
    this._reportWorkflowService.submitReport(AmPreliminaryReportStore.reportDetails?.id).subscribe(res => {
      // this._preliminaryReportService.getItems(AmAuditFieldWorkStore.auditFieldWorkId).subscribe((res) => {
      SubMenuItemStore.submitClicked = false;
      this.setSubmenu();
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
    this._reportWorkflowService.getItems(AmPreliminaryReportStore.reportDetails?.id).subscribe(res => {
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
      AmPreliminaryReportWorkflowStore.type = 'submit';
    }
    else
      AmPreliminaryReportWorkflowStore.type = 'approve';
    AmPreliminaryReportWorkflowStore.approveText = 'am_report_approve_text';
    AmPreliminaryReportWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');

  }

  closeCommentForm() {
    AmPreliminaryReportWorkflowStore.type = '';
    AmPreliminaryReportWorkflowStore.approveText = '';
    AmPreliminaryReportWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this.setSubmenu();
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();

    this._utilityService.detectChanges(this._cdr)
  }

  revertAuditPlan() {
    AmPreliminaryReportWorkflowStore.type = 'revert';
    AmPreliminaryReportWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  openHistoryPopup() {
    AmPreliminaryReportWorkflowStore.setCurrentPage(1);
    this._reportWorkflowService.getHistory(AmPreliminaryReportStore.reportDetails?.id).subscribe(res => {
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
          break
        case 'Confirm':
          if (this.deleteObject.title && this.deleteObject.title == 'generate') {
            this.generatePreliminaryReport();
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

  submitConfirm() {
    SubMenuItemStore.submitClicked = false;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.subtitle = 'am_report_submit_confirm';

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
    if(AmPreliminaryReportStore.reportDetails?.submitted_by==null)
    status = 'new';
    else
    status = 'in-review'
    return status;
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  
  GaugeChart() {
    am4core.addLicense("CH199714744");
    // Create chart instance
  
// Create chart instance
let chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
chart.data = [{
  "year": "2016",
  "europe": 2.5,
  "namerica": 2.5,
  "asia": 2.1,
  "lamerica": 0.3,
  "meast": 0.2,
  "africa": 0.1
}, {
  "year": "2017",
  "europe": 2.6,
  "namerica": 2.7,
  "asia": 2.2,
  "lamerica": 0.3,
  "meast": 0.3,
  "africa": 0.1
}, {
  "year": "2018",
  "europe": 2.8,
  "namerica": 2.9,
  "asia": 2.4,
  "lamerica": 0.3,
  "meast": 0.3,
  "africa": 0.1
}];

chart.legend = new am4charts.Legend();
chart.legend.position = "right";

// Create axes
let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "year";
categoryAxis.renderer.grid.template.opacity = 0;

let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.renderer.grid.template.opacity = 0;
valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
valueAxis.renderer.ticks.template.length = 10;
valueAxis.renderer.line.strokeOpacity = 0.5;
valueAxis.renderer.baseGrid.disabled = true;
valueAxis.renderer.minGridDistance = 40;

// Create series
function createSeries(field, name) {
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueX = field;
  series.dataFields.categoryY = "year";
  series.stacked = true;
  series.name = name;
  
  let labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.locationX = 0.5;
  labelBullet.label.text = "{valueX}";
  labelBullet.label.fill = am4core.color("#fff");
}

createSeries("europe", "Europe");
createSeries("namerica", "North America");
createSeries("asia", "Asia");
createSeries("lamerica", "Latin America");
createSeries("meast", "Middle East");
createSeries("africa", "Africa");

    this._utilityService.detectChanges(this._cdr);
  }

  //Export starts 
  getExport(id){
    this._preliminaryReportService.export(id).subscribe(res=>{
      SubMenuItemStore.exportClicked = false
    }, (err: HttpErrorResponse) => {
        SubMenuItemStore.exportClicked = false
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
    })
  }

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
