import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { KpiWorkflowStore } from 'src/app/stores/strategy-management/kpi-workflow.store';
import { ActionPlanWorkflowStore } from 'src/app/stores/strategy-management/action-plan-workflow.store';
import { ActionPlanWorkflowService } from 'src/app/core/services/strategy-management/action-plan-workflow/action-plan-workflow.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;


@Component({
  selector: 'app-action-plan-info',
  templateUrl: './action-plan-info.component.html',
  styleUrls: ['./action-plan-info.component.scss']
})
export class ActionPlanInfoComponent implements OnInit {
  @ViewChild('planMesure') planMesure: ElementRef;
  @ViewChild('otherResponsibleUsers', { static: true }) otherResponsibleUsers: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('commentModal') commentModal: ElementRef;
  @ViewChild('workflowHistory') workflowHistory: ElementRef;






  ActionPlansStore = ActionPlansStore;
  AppStore = AppStore;
  ActionPlanWorkflowStore = ActionPlanWorkflowStore
  AuthStore = AuthStore
  emptyMessage = "no_data_found"
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  planMesureObject = {
    type: null,
    value: null,
    id: null
  }
  otherResponsibleUsersObject = {
    type: null,
    value: null
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
    frequency: null
  };
  plnMesureModalModalEventSubscription: any;
  otherResponsibleUsersSubscription: any;
  reactionDisposer: IReactionDisposer;
  popupControlEventSubscription: any;
  actionPlanReviewCommentSubscription: any;
  workflowHistoryOpened: boolean;

  constructor(private _router: ActivatedRoute, private _renderer2: Renderer2, private _actionPlanService: ActionPlansService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService, private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService, private _sanitizer: DomSanitizer, private _actionPlanWorkflowService: ActionPlanWorkflowService,
    private _imageService: ImageServiceService, private _reviewService: StrategyReviewService, private _helperService: HelperServiceService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "update_modal":
            this.openPlanMesureModal(ActionPlansStore.selectedActionPlanId);
            break;
          case 'submit':
            SubMenuItemStore.submitClicked = true;
            this.submitActionPlanForReview();

            break
          case 'approve':
            SubMenuItemStore.approveClicked = true;
            this.approveWorkflow();
            break
          case 'review_submit':
            this.approveWorkflow(true);
            break
          case 'revert':
            SubMenuItemStore.revertClicked = true;
            this.revertWorkflow();
            break;
          case 'reject':
            this.rejectWorkflow();
            break
          case "history":
            this.openHistoryPopup();
            break;
          case "workflow":
            //  this.openWorkflowPopup();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    // SubMenuItemStore.setSubMenuItems([
    //   { type: "edit_modal" },
    //   {type: "close", path: "../strategy-scoring"}
    // ]);
    this.plnMesureModalModalEventSubscription = this._eventEmitterService.planMesureModal.subscribe(item => {
      this.closePlanMesure();
      this.getInduavlActionPlan(ActionPlansStore.selectedActionPlanId)
      // this.pageChange(1);
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res => {
      this.closeResponsibleUsersModal();
    });
    this.actionPlanReviewCommentSubscription = this._eventEmitterService.actionPlanReviewCommentModal.subscribe(item => {
      this.closeCommentForm()
      this.getInduavlActionPlan(ActionPlansStore.selectedActionPlanId)

    })
    let id: number
    this._router.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      if (id) {
        ActionPlansStore.selectedActionPlanId = id
        this.getInduavlActionPlan(id);
        this.getOtherActionPlans(id)
      }
    })
  }

  getInduavlActionPlan(id) {
    this._actionPlanService.getInduvalActionPlan(id).subscribe(res => {
      let id = res['review_frequency'].id
      ActionPlanWorkflowStore.selectedId = id
      this.getWorkflow(id)
      // this.setSubMenuItems()
      this._utilityService.detectChanges(this._cdr);
    })
    setTimeout(() => {
      this.getCompletedPercentageChart();
      this._utilityService.detectChanges(this._cdr);
    }, 3000);
  }

  getOtherActionPlans(id) {
    this._actionPlanService.getotherActionPlans(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  responsibleOthers(users) {
    let item = users.slice(0, 3)
    return item
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
  getNoDataSource(type) {
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
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

  openPlanMesureModal(id) {
    this._actionPlanService.getInduvalActionPlan(id).subscribe(res => {
      this.planMesureObject.value = res;
      this.planMesureObject.type = res['actual_value'] ? 'Edit' : 'Add';
      this.openPlanMesureModalPopup()
      this._utilityService.detectChanges(this._cdr)
    })
  }

  openPlanMesureModalPopup() {
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.planMesure.nativeElement, 'show');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.planMesure.nativeElement, 'overflow', 'auto');
  }

  closePlanMesure() {
    this.planMesureObject.type = null;

    // $(this.kpiMesure.nativeElement).modal('hide');
    this._renderer2.removeClass(this.planMesure.nativeElement, 'show');
    this._renderer2.setStyle(this.planMesure.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  openResponsibleUsersModal(users) {
    event.stopPropagation();
    this.otherResponsibleUsersObject.type = 'Add';
    this.otherResponsibleUsersObject.value = users
    this.openResponsibleUsers()
  }

  openResponsibleUsers() {
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.otherResponsibleUsers.nativeElement, 'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'z-index', 99999);
  }

  closeResponsibleUsersModal() {
    setTimeout(() => {
      // $(this.otherResponsibleUsers.nativeElement).modal('hide');
      this.otherResponsibleUsersObject.type = null;
      this.otherResponsibleUsersObject.value = null;
      this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement, 'show');
      this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement, 'display', 'none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  getCompletedPercentageChart() {
    let minValue = 0;
    let maxValue = 100;
    let percent = 100;

    let achieved = parseFloat(ActionPlansStore.induvalActionPlan.actual_value);
    let target = parseFloat(ActionPlansStore.induvalActionPlan?.target);

    maxValue = target < achieved ? achieved : target;
    maxValue = Math.ceil(maxValue / 100) * 100;
    percent = achieved / maxValue * 100;

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    //create chart
    let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    //Normal axis
    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = minValue;
    axis.max = maxValue;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(100);
    axis.renderer.inside = false;
    axis.renderer.line.strokeOpacity = 0;
    axis.renderer.ticks.template.disabled = false
    // axis.disabled = true;
    axis.renderer.ticks.template.strokeOpacity = 0;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 10;
    axis.renderer.labels.template.adapter.add("text", function (text) {
      return text;
    })

    //Axis for ranges
    let colorSet = new am4core.ColorSet();

    let axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color("#049dff");
    range0.axisFill.tooltip = new am4core.Tooltip();
    range0.axisFill.tooltipText = `Target:[bold]${ActionPlansStore.induvalActionPlan?.target}[/]`;
    range0.axisFill.interactionsEnabled = true;
    range0.axisFill.isMeasured = true;

    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color("#b1e1ff");

    //Label
    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 15;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    // label.text = "182";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 50;

    hand.events.on("propertychanged", function (ev) {
      range0.endValue = target / maxValue * 100;
      range1.value = target / maxValue * 100;

      label.text = ActionPlansStore.induvalActionPlan?.actual_value;
      axis2.invalidate();
    });

    setInterval(function () {
      let value = percent;
      // if(ActionPlansStore.induvalActionPlan && ActionPlansStore.induvalActionPlan.actual_value){
      //   value =  ActionPlansStore.induvalActionPlan.actual_value  // set store values
      // }else{
      //   value =  0 // set store values
      // }
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  viewIncidentDocument(type, docuDetails, frequencyId, documentFile) {
    switch (type) {
      case "plan-measure":
        this._reviewService.getPlanFilePreview(docuDetails, frequencyId).subscribe(res => {
          var resp: any = this._utilityService.getDownLoadLink(
            res,
            docuDetails.name
          );
          this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId);
        }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "permission_denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "unable_generate_preview"
              );
            }
          };
        break;
      case "document-version":
        this._documentFileService
          .getFilePreview(type, docuDetails.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              docuDetails.title
            );
            this.openPreviewModal(type, resp, documentFile, docuDetails, frequencyId);
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

  openPreviewModal(type, filePreview, documentFiles, document, frequencyId) {
    this.previewObject.component = type
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.id;
      this.previewObject.frequency = frequencyId
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  *// Closes from preview
    closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createPreviewUrl(type, token) {
    return this._reviewService.getThumbnailPreview(type, token)
  }

  // Returns image url according to type and token
  createImageUrl(type, token) {
    return this._reviewService.getThumbnailPreview(type, token);
  }

  downloKpiMesureDocument(type, kpiDocument, docs, frequencyId) {
    event.stopPropagation();
    switch (type) {
      case "plan-measure":
        this._reviewService.downloadFile(
          frequencyId,
          "plan-measure",
          kpiDocument.id,
          null,
          kpiDocument.title,
          kpiDocument
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          kpiDocument.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  submitActionPlanForReview() {
    // ActionPlanWorkflowStore.selectedId = id
    this.popupObject.type = 'submit';
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
      this._actionPlanWorkflowService.submitProject(ActionPlanWorkflowStore.selectedId).subscribe(res => {
        SubMenuItemStore.submitClicked = false;
        this.getInduavlActionPlan(ActionPlansStore.selectedActionPlanId)
        this._utilityService.detectChanges(this._cdr);
      },
        (error) => {
          SubMenuItemStore.submitClicked = false;
        })
    } else {
      SubMenuItemStore.submitClicked = false;
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  revertWorkflow() {
    ActionPlanWorkflowStore.type = 'revert';
    ActionPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }


  rejectWorkflow() {
    ActionPlanWorkflowStore.type = 'reject';
    ActionPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  approveWorkflow(type?) {
    if (type) {
      ActionPlanWorkflowStore.type = 'submit';
    }
    else
      ActionPlanWorkflowStore.type = 'approve';
    ActionPlanWorkflowStore.commentForm = true;
    $(this.commentModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 999999);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'auto');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'block');
  }

  closeCommentForm() {
    // this.setSubMenuItems();
    ActionPlanWorkflowStore.type = '';
    ActionPlanWorkflowStore.commentForm = false;
    $(this.commentModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.commentModal.nativeElement, 'overflow', 'none');
    this._renderer2.setStyle(this.commentModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    SubMenuItemStore.approveClicked = false;
    SubMenuItemStore.revertClicked = false;
    this._utilityService.detectChanges(this._cdr)
  }

  openHistoryPopup() {
    // ActionPlanWorkflowStore.selectedId = freequency.id
    ActionPlanWorkflowStore.setCurrentPage(1);
    this._actionPlanWorkflowService.getHistory(ActionPlanWorkflowStore.selectedId).subscribe(res => {
      this.workflowHistoryOpened = true;
      this._utilityService.detectChanges(this._cdr);
      $(this.workflowHistory.nativeElement).modal('show');
    });
  }

  closeHistoryPopup() {
    this.workflowHistoryOpened = false;
    $(this.workflowHistory.nativeElement).modal('hide');
  }

  isUser() {
    if (ActionPlansStore.induvalActionPlan && ActionPlansStore.induvalActionPlan.review_users) {
      var pos = ActionPlansStore.induvalActionPlan.review_users?.findIndex(e => e.id == AuthStore.user.id)
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
    if (ActionPlansStore.induvalActionPlan && ActionPlansStore.induvalActionPlan.responsible_users) {
      // for (let i of ActionPlansStore.induvalActionPlan.responsible_users) {
      //   if (i.level == ProjectChangeRequestStore?.individualChangeRequestItem?.next_review_user_level) {
      var pos = ActionPlansStore.induvalActionPlan.responsible_users?.findIndex(e => e.id == AuthStore.user.id)
      if (pos != -1) {
        return true;
      }
      else {
        return false
      }
      // }
      // }
    }
    else {
      return false;
    }
  }

  getWorkflow(id) {
    this._actionPlanWorkflowService.getItems(id).subscribe(res => {
      this.setSubMenuItems()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setSubMenuItems() {
    if (ActionPlansStore.induvalActionPlan?.actual_value && ActionPlansStore.induvalActionPlan?.review_frequency.strategy_initiative_action_plan_review_frequency_status.type == 'draft' && ActionPlansStore.induvalActionPlan?.strategy_initiative_action_plan_status?.type != 'closed') {
      var subMenuItems = [
        // {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
        { activityName: null, submenuItem: { type: 'history', title: '' } },
        { activityName: null, submenuItem: { type: 'submit', title: '' } },
        { activityName: null, submenuItem: { type: 'update_modal', title: '' } },
        { activityName: null, submenuItem: { type: 'close', path: "../strategy-scoring", title: '' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

      this._utilityService.detectChanges(this._cdr);
    } else if (ActionPlansStore.induvalActionPlan?.actual_value && this.isUser() && ActionPlansStore.induvalActionPlan?.review_frequency.strategy_initiative_action_plan_review_frequency_status.type == 'in-review' && ActionPlansStore.induvalActionPlan?.strategy_initiative_action_plan_status?.type != 'closed') {
      // if (ProjectMonitoringStore.individualDetails?.next_review_user_level == ProjectWorkflowStore?.workflowDetails[ProjectWorkflowStore?.workflowDetails?.length - 1]?.level){
      var subMenuItems = [
        // {activityName:'LIST_PROJECT_WORKFLOW', submenuItem: {type: 'workflow',title : ''}},
        { activityName: null, submenuItem: { type: 'history', title: '' } },
        { activityName: null, submenuItem: { type: 'approve', title: '' } },
        { activityName: null, submenuItem: { type: 'revert', title: '' } },
        // {activityName:null,submenuItem:{type:'reject',title:''}},

        { activityName: null, submenuItem: { type: 'close', path: this.closeTo(), title: '' } }
      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    } else if (ActionPlansStore.induvalActionPlan?.review_frequency.strategy_initiative_action_plan_review_frequency_status.type != 'in-review' && ActionPlansStore.induvalActionPlan?.review_frequency.strategy_initiative_action_plan_review_frequency_status.type != 'approved' && ActionPlansStore.induvalActionPlan?.review_frequency.strategy_initiative_action_plan_review_frequency_status.type != 'rejected' && ActionPlansStore.induvalActionPlan?.strategy_initiative_action_plan_status?.type != 'closed') {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'history', title: '' } },
        { activityName: null, submenuItem: { type: 'update_modal', title: '' } },
        { activityName: null, submenuItem: { type: 'close', path: this.closeTo(), title: '' } }

      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);

      this._utilityService.detectChanges(this._cdr);
    } else {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'history', title: '' } },
        { activityName: null, submenuItem: { type: 'close', path: this.closeTo(), title: '' } }

      ]
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  closeTo() {
    if (StrategyStore.strategyProfileId != null)
      return '/strategy-management/strategy-profiles/' + StrategyStore.strategyProfileId + '/action-plans'
    else
      return '../strategy-scoring'
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.plnMesureModalModalEventSubscription.unsubscribe();
    this.otherResponsibleUsersSubscription.unsubscribe();
    this.popupControlEventSubscription.unsubscribe()
    ActionPlansStore.induvalActionPlanLoaded = false;
    this.actionPlanReviewCommentSubscription.unsubscribe()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    StrategyStore.setSelectedId(null)
  }

}
