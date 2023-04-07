import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActionPlansStore } from 'src/app/stores/mrm/action-plans/action-plans-store';
import { ActionPlansService } from 'src/app/core/services/mrm/action-plans/action-plans.service';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AuthStore } from "src/app/stores/auth.store";
import { DocumentFileService } from "src/app/core/services/knowledge-hub/documents/document-file.service";
import { MeetingPlanFileService } from "src/app/core/services/mrm/file-service/meeting-plan-file.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";


declare var $: any;
@Component({
  selector: 'app-action-plans-details',
  templateUrl: './action-plans-details.component.html',
  styleUrls: ['./action-plans-details.component.scss']
})
export class ActionPlansDetailsComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;

  daysDue: number = 0;
  Totaldays: number = 0;
  remainingDate: number = 0;
  remainingDateGraph: number = 0;
  todayDate: any = new Date();

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  ActionPlansStore = ActionPlansStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  modalEventSubscription: any;
  modelEventSubscriptionUpdate: any;
  modelEventSubscriptionHistory: any;
  popupControlMeetingsEventSubscription: any;
  fileUploadPopupSubscriptionEvent:any;

  actionId: number;

  actionPlansObject = {
    type: null,
    values: null,
  }

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    updateId: null,
  };

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _sanitizer: DomSanitizer,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _actionPlansService: ActionPlansService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _discussionBotService: DiscussionBotService,
    private _meetingPlanFileService: MeetingPlanFileService,
  ) { }

  ngOnInit(): void {

    let id: number;
    this._route.params.subscribe(params => {
      id = +params['id'];
      ActionPlansStore.actionId = this.actionId = id
      this.getActionPlansDetails(id);
      if (id) {
        DiscussionBotStore.setDiscussionMessage([]);
        DiscussionBotStore.setbasePath('/meeting-action-plans/');
        DiscussionBotStore.setDiscussionAPI(id + '/comments');
        this.downloadDiscussionThumbnial();
        this.showThumbnailImage();
        this.getImagePrivew();
        this.getDiscussions();
      }
    })

    AppStore.showDiscussion = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (!BreadCrumbMenuItemStore.refreshBreadCrumbMenu) {
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name: "action_plans",
        path: `/mrm/meeting-action-plans`
      });
    }
    this.reactionDisposer = autorun(() => {




      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "update_modal":
          //   setTimeout(() => {       
          //     this.addModelUpdate();
          //   }, 1000);
          //   break;
          case "edit_modal":
            this.getEdit();
            break;
          case "delete":
            this.deleteActionPlan(ActionPlansStore._individualActionPlansDetails?.id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    this.modelEventSubscriptionHistory = this._eventEmitterService.actionPlanHistoryModal.subscribe(res => {
      this.closeHistoryModal();
    });

    this.modelEventSubscriptionUpdate = this._eventEmitterService.actionPlanUpadateModal.subscribe(res => {
      this.closeModelUpdate();
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal();
    });

    this.popupControlMeetingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.changeZIndex();
    })

  }

  getDiscussions() { //discussion
    this._discussionBotService.getDiscussionMessage().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  downloadDiscussionThumbnial() {
    DiscussionBotStore.setThumbnailDownloadAPI(ActionPlansStore._individualActionPlansDetails?.id + '/comments/')
  }

  showThumbnailImage() {
    DiscussionBotStore.setShowThumbnailAPI(ActionPlansStore._individualActionPlansDetails?.id + '/comments/')
  }

  getImagePrivew() {
    DiscussionBotStore.setDiscussionThumbnailAPI('/mrm/files/meeting-action-plan-comment-document/thumbnail?token=')
  }

  setSubMenuItems(){
    var subMenuItems=[]
    if(ActionPlansStore.individualActionPlansDetails.meeting_action_plan_status.type=='new'){
       subMenuItems = [
        { activityName: 'UPDATE_MEETING_ACTION_PLAN', submenuItem: { type: 'edit_modal' } },
        { activityName: 'DELETE_MEETING_ACTION_PLAN', submenuItem: { type: 'delete' } },
        { activityName: null, submenuItem: { type: 'close', path: ActionPlansStore.path } },
      ]
    }
    else{
       subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path: ActionPlansStore.path } },
      ]
    }

    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  getremainingDateChartAttendance() {

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate: any = new Date(ActionPlansStore.individualActionPlansDetails?.start_date);
    const targetDate: any = new Date(ActionPlansStore.individualActionPlansDetails?.target_date);
    let todaydayToTargetday;
    let startdayToTodayday;

    todaydayToTargetday = Math.round(Math.abs((this.todayDate - targetDate) / oneDay));
    startdayToTodayday = Math.round(Math.abs((startDate - this.todayDate) / oneDay));

    if (todaydayToTargetday == startdayToTodayday) {
      startdayToTodayday = 0;
    } else if (this.remainingDate > 0) {
      todaydayToTargetday = 0;
      startdayToTodayday = 0;
    }

    am4core.addLicense("CH199714744");
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        category: "Days",
        value1: startdayToTodayday,
        value2: todaydayToTargetday,
      }
    ];

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(50);
    series1.columns.template.tooltipText =
      "{name}: {value1} Days";
    series1.name = "Series 1";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{value1} Days";
    bullet1.label.fill = am4core.color("#000");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(50);
    series2.columns.template.tooltipText =
      "{name}: {value2} Days";
    series2.name = "Series 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{value2} Days";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

  }

  getActionPlansDetails(id) {
    this._actionPlansService.getItem(id).subscribe(res => {
      this.setSubMenuItems()
      this.getDatesRemaining();
      this.daysRemainingGraph();
      setTimeout(() => {
        this.getremainingDateChartAttendance();
      }, 1000);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  daysRemainingGraph() {
    let startDate = new Date(ActionPlansStore.individualActionPlansDetails?.start_date);
    let targetDate = new Date(ActionPlansStore.individualActionPlansDetails?.target_date);

    let days = Math.floor((startDate.getTime() - targetDate.getTime()) / 1000 / 60 / 60 / 24);
    this.Totaldays = Math.abs(days) + 1;

    if (this.getDatesRemaining() == 0) {
      this.remainingDateGraph = Math.floor((targetDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
      if (this.remainingDateGraph >= 0) {
        this.remainingDateGraph = this.remainingDateGraph + 1;
        this.getDueDates(this.remainingDateGraph, this.Totaldays);
      }
      else
        this.remainingDateGraph = 0;
    } else {
      this.remainingDateGraph = 0;
    }

  }

  getDueDates(remainingDate, Totalday) {
    if (remainingDate == Totalday)
      this.daysDue = 0
    else
      this.daysDue = (Totalday - remainingDate) - 1;
  }

  getDatesRemaining() {

    let startDate = new Date(ActionPlansStore.individualActionPlansDetails?.start_date);

    this.remainingDate = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDate >= 0)
      this.remainingDate = this.remainingDate + 1;
    else
      this.remainingDate = 0;

    return this.remainingDate;
  }


  getEmployeePopupDetails(users, created?: string) { //user popup

    let userDetails: any = {};
    if (users) {
      userDetails['first_name'] = users?.first_name ? users?.first_name : users?.name;
      userDetails['last_name'] = users?.last_name;
      userDetails['image_token'] = users?.image?.token ? users?.image.token : users?.image_token;
      userDetails['email'] = users?.email;
      userDetails['mobile'] = users?.mobile;
      userDetails['id'] = users?.id;
      // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
      userDetails['department'] = users?.department;
      userDetails['status_id'] = users?.status_id ? users?.status_id : users?.status.id;
      userDetails['created_at'] = created ? created : null;
      userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    }
    return userDetails;
  }

  getEdit() {
    if (ActionPlansStore.individualActionPlansDetails?.id) {
      this.actionPlansObject.values = {
        id: ActionPlansStore.individualActionPlansDetails?.id,
        title: ActionPlansStore.individualActionPlansDetails?.title,
        budget: ActionPlansStore.individualActionPlansDetails?.budget,
        meeting_id: ActionPlansStore.individualActionPlansDetails?.meeting,
        completion: ActionPlansStore.individualActionPlansDetails?.completion ? ActionPlansStore.individualActionPlansDetails?.completion : 0,
        start_date: ActionPlansStore.individualActionPlansDetails?.start_date,
        target_date: ActionPlansStore.individualActionPlansDetails?.target_date,
        description: ActionPlansStore.individualActionPlansDetails?.description,
        responsible_user_id: ActionPlansStore.individualActionPlansDetails?.responsible,
        meeting_action_plan_watcher_ids: ActionPlansStore.individualActionPlansDetails?.meeting,
      }

      this.actionPlansObject.type = 'Edit';
      ActionPlansStore.editFlag = true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    }
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeActionPlan(planId) {

    this._actionPlansService.closeItem(planId).subscribe(res => {
      this.getActionPlansDetails(this.actionId);
    })

  }

  closeFormModal() {
    this.getActionPlansDetails(this.actionId);
    $(this.formModal.nativeElement).modal('hide');
    this.actionPlansObject.type = null;
    AppStore.showDiscussion = true;
  }

  addModelUpdate() {
    ActionPlansStore.action_plan_update = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModelUpdate() {
    this.getActionPlansDetails(this.actionId)
    ActionPlansStore.action_plan_update = false;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }

  openHistoryModal() {
    // this.historyPageChange(1);
    ActionPlansStore.action_plan_history = true;
    $(this.actionPlanHistory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    ActionPlansStore.action_plan_history = false;
    $(this.actionPlanHistory.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    ActionPlansStore.unSetActionPlanHistory();
    AppStore.showDiscussion = true;
  }

  deleteActionPlan(id) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title = 'Delete';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // modal control event
  modalControl(status: boolean) {

    switch (this.popupObject.type) {
      case '': this.deleteActionPlans(status);
        break;
    }
  }

  // delete function call
  deleteActionPlans(status: boolean) {

    if (status && this.popupObject.id) {

      this._actionPlansService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('mrm/meeting-action-plans');
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

  clearPopupObject() {
    this.popupObject.id = null;
  }

  getColorKey() {
    var label_color = ActionPlansStore.individualActionPlansDetails?.meeting_action_plan_status?.label.split('-');
    return 'draft-tag-' + label_color[0];
  }


  // kh-module base document
  viewDocument(type, documents, documentFile) {

    switch (type) {
      case "meeting-action-plan-update-document":
        this._meetingPlanFileService
          .getFilePreview(type, ActionPlansStore.individualActionPlansDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "action-plan":
        this._meetingPlanFileService
          .getFilePreview(type, ActionPlansStore.individualActionPlansDetails.id, documentFile.id, documents.meeting_action_plan_update_id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;

      case "document-version":
        this._documentFileService
          .getFilePreview(type, documents.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }

  // kh-module base document- Returns image url according to type and token
  createImageUrl(type, token) {
    if (type == 'meeting-action-plan-update-document')
      return this._meetingPlanFileService.getThumbnailPreview(type, token);
    else if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else if (type == 'action-plan')
      return this._meetingPlanFileService.getThumbnailPreview(type, token);
  }



  // kh-module base document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "meeting-action-plan-update-document":
        this._meetingPlanFileService.downloadFile(
          type,
          ActionPlansStore.individualActionPlansDetails.id,
          document.id,
          document.meeting_action_plan_update_id,
          document.title,
          document
        );
        break;
      case "action-plan":
        this._meetingPlanFileService.downloadFile(
          type,
          ActionPlansStore.individualActionPlansDetails.id,
          document.id,
          document.meeting_action_plan_update_id,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  // kh-module base document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component = type;

    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.updateId = document.meeting_action_plan_update_id;
      this.previewObject.componentId = ActionPlansStore.individualActionPlansDetails.id;

      this.previewObject.uploaded_user = ActionPlansStore.individualActionPlansDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  // extension check function
  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    am4core.disposeAllCharts();
    SubMenuItemStore.makeEmpty();
    ActionPlansStore.unSetActionPlanHistory();
    ActionPlansStore.unsetIndividualActionPlansDetails();
    this.modalEventSubscription.unsubscribe();
    this.modelEventSubscriptionUpdate.unsubscribe();
    this.modelEventSubscriptionHistory.unsubscribe();
    this.popupControlMeetingsEventSubscription.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
  }

}
