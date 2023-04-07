import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { DiscussionBotService } from 'src/app/core/services/general/discussion-bot/discussion-bot.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild ('revertModal') revertModal: ElementRef;
  @ViewChild ('approveModal') approveModal: ElementRef;
  @ViewChild ('workflowModal') workflowModal: ElementRef;
  @ViewChild ('filePreviewModal') filePreviewModal: ElementRef;//-document
  @ViewChild ('activityLogsModal') activityLogsModal: ElementRef;//activity logs
  @ViewChild ('workflowHistoryModal') workflowHistoryModal: ElementRef;

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  KpisStore = KpisStore;
  AuthStore = AuthStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  hover = false;
  activeIndex = null;

  popupObject = {
    type: '',
    id: null,
    position: null,
    title:'',
    subtitle:''
  };
  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  approveAndReviewSub={
    id:null,
    type:''
  }

  deleteEventSubscription: any;
  revertEventSubscription: any;
  approveEventSubscription: any;
  kpiWorkflowEventSubscription: any;
  kpiActivityLogsSubscription: any;
  kpiWorkflowHistoryEventSubscription: any;

  barChartEnable:boolean=false;
  GaugeChartChangeEnable:boolean=true;
  barChartChagneEnable:boolean=true;

  componeDistory:boolean=false;

  constructor(
    private _router:Router,
    private _renderer2: Renderer2,
    private _cdr:ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _kpisService: KpisService,
    private _utilityService:UtilityService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _kpiManagementFileService: KpiManagementFileService
  ) { }

  ngOnInit(): void {

    this.componeDistory=true;
    
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.addBreadCrumbMenu({
      name:this._helperService.translateToUserLanguage('kpis'),
      path:`/kpi-management/kpis`
    });

    AppStore.showDiscussion = true;
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
                KpisStore.setEditFlag();
                this._router.navigateByUrl('/kpi-management/kpis/edit-kpi');
              }, 1000);
            break;
          case "delete":
              this.delete();
            break;
          case 'submit':
              this.submit();
            break;
          case 'review_submit':
              this.approveOpenModal('review_submit');
            break;
          case 'revert':
              this.revertOpenModal();
            break;
          case 'reject':
              this.reject();
            break;
          case 'approve':
                  this.approveOpenModal('approve');
            break;
          case 'workflow':
              this.workflowOpenModal();
            break;
          case 'history':
              this.workflowHistoryOpenModal();
            break;
          case 'activity_log':
              this.activityLogsOpenModal();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    setTimeout(() => {
      window.addEventListener('click', this.clickEvent, false);
      this._utilityService.detectChanges(this._cdr);
    }, 250);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.revertEventSubscription = this._eventEmitterService.kpiRevertModal.subscribe(res => {
      this.revertCloseModal(res);
    });

    this.approveEventSubscription = this._eventEmitterService.kpiApproveModal.subscribe(res => {
      this.approveCloseModal(res);
    });

    this.kpiWorkflowEventSubscription = this._eventEmitterService.kpiWorkflowModal.subscribe(res => {
      this.workflowColseModal();
    });
    
    this.kpiWorkflowHistoryEventSubscription = this._eventEmitterService.kpiWorkflowHistoryModal.subscribe(res => {
      this.workflowHistoryCloseModal();
    });

    this.kpiActivityLogsSubscription = this._eventEmitterService.kpiActivityLogsModal.subscribe(res => {
      this.activityLogsCloseModal();
    });
    this.getWorkFlow();
    this.getDetials();
    this.getScoreByFrequencyChart();
  }

  getDetials(){
    this._kpisService.getItem(KpisStore.kpiId).subscribe(res=>{
      if(KpisStore.individualKpiDetails?.kpi_management_status?.type!='approved'){
        KpisStore.showKpiScoreUpdateTab=false;
      }else{
        KpisStore.showKpiScoreUpdateTab=true;
      }
      if(KpisStore.individualLoaded && this.componeDistory){
        this.setSubMenuItems();
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getWorkFlow(){
    this._kpisService.getWorkFlow(KpisStore.kpiId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getColorKey(){
    let label_color = KpisStore.individualKpiDetails?.kpi_management_status?.label.split('-');
    
    return 'draft-tag-'+label_color[0];
  }

  getScoreByFrequencyChart(){
    this._kpisService.getScoreByFrequencyChart(KpisStore.kpiId).subscribe(res=>{
      this.barChartEnable=false;
      for (let index = 0; index < KpisStore.scoreByFrequencyChart.length; index++) {
        const element = KpisStore.scoreByFrequencyChart[index];
        if(element.value){
          this.barChartEnable=true;
          break;
        }
        
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setSubMenuItems(){

    let subMenuItems=[];

    if(KpisStore.individualKpiDetails?.next_review_user_level==1 && KpisStore.individualKpiDetails?.submitted_by==null){

      subMenuItems = [
       // {activityName:null,submenuItem:{type:'submit',title : ''}},
        {activityName:null, submenuItem: { type: 'edit_modal',title : '' } },
        {activityName:null, submenuItem: { type: 'delete' } },
        {activityName:null, submenuItem: {type: 'workflow',title : ''}},
        {activityName:null, submenuItem: {type: 'history',title : ''}},
        {activityName:'KPI_MANAGEMENT_KPI_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        {activityName:null, submenuItem: {type: 'close', path: "../",title : ''}},
      ]
      if(KpisStore.individualKpiDetails.created_by.id==AuthStore?.user?.id){
        subMenuItems = [
          {activityName:null,submenuItem:{type:'submit',title : ''}},
        ]
      }
    }   else if(KpisStore.individualKpiDetails?.submitted_by!=null && KpisStore.individualKpiDetails?.next_review_user_level && this.isUser()){
      if (KpisStore.individualKpiDetails?.next_review_user_level == KpisStore?.workflowDetails[KpisStore?.workflowDetails?.length - 1]?.level){

        subMenuItems = [
          {activityName:null,submenuItem:{type:'approve',title : ''}},
          {activityName:null,submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:null,submenuItem:{type:'reject',title:''}},
          {activityName:null, submenuItem: {type: 'workflow',title : ''}},
          {activityName:null, submenuItem: {type: 'history',title : ''}},
          {activityName:'KPI_MANAGEMENT_KPI_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
      }
      else if (KpisStore.individualKpiDetails?.next_review_user_level != KpisStore?.workflowDetails[KpisStore?.workflowDetails?.length - 1]?.level){
        
        subMenuItems  = [
          {activityName:null,submenuItem:{type:'review_submit',title : 'Approve'}},
          {activityName:null,submenuItem:{type:'revert',title:'Send Back'}},
          {activityName:null,submenuItem:{type:'reject',title:''}},
          {activityName:null, submenuItem: {type: 'workflow',title : ''}},
          {activityName:null, submenuItem: {type: 'history',title : ''}},
          {activityName:'KPI_MANAGEMENT_KPI_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
      } 
      
    }else if (KpisStore.individualKpiDetails?.next_review_user_level == null && KpisStore.individualKpiDetails?.submitted_by!=null){
      subMenuItems  = [
        {activityName:null, submenuItem: {type: 'workflow',title : ''}},
        {activityName:null, submenuItem: {type: 'history',title : ''}},
        {activityName:'KPI_MANAGEMENT_KPI_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
        {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
      ]
    }
    else{
      
        subMenuItems = [
          {activityName:null, submenuItem: {type: 'workflow',title : ''}},
          {activityName:null, submenuItem: {type: 'history',title : ''}},
          {activityName:'KPI_MANAGEMENT_KPI_ACTIVITY_LOGS', submenuItem: { type: 'activity_log' } },
          {activityName:null, submenuItem: {type: 'close', path: '../',title : ''}}
        ]
      }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
  }

  isUser() {
    if(KpisStore?.individualLoaded){
      for (let i of KpisStore.individualKpiDetails?.workflow_items) {
        if (i.level == KpisStore.individualKpiDetails?.next_review_user_level) {
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

  GaugeChart(){
    // 1. target > achieved ---> (percent=a/t*100, mim=0, max=taget) 
    // 2. target < achieved ---> (percent=100%,    mim=0, max=achieved)
    // 3. target == achieved --->(percent=100%,    mim=0, max=target)  

    let minValue=0;
    let maxValue=100;
    let percent=100;

    let achieved = parseFloat(KpisStore.individualKpiDetails?.achieved_value);
    let target = parseFloat(KpisStore.individualKpiDetails?.target);

    maxValue= target<achieved? achieved:target;
    maxValue=  Math.ceil(maxValue/100)*100;
    percent =  achieved/maxValue*100;
    

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    //create chart
    let chart = am4core.create("gaugeChartdiv", am4charts.GaugeChart);
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
    axis.renderer.ticks.template.strokeOpacity = 0;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 10;
    axis.renderer.labels.template.adapter.add("text", function(text) {
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
    range0.axisFill.fill = am4core.color("#6cb5f9");
    range0.axisFill.tooltip = new am4core.Tooltip();
    range0.axisFill.tooltipText = `Target:[bold]${KpisStore.individualKpiDetails?.target}[/]`;
    range0.axisFill.interactionsEnabled = true;
    range0.axisFill.isMeasured = true;

    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color("#6f23c1");

    //Label
    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 20;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value =  50;
    
    hand.events.on("propertychanged", function(ev) {
      range0.endValue = target/maxValue*100;
      range1.value = target/maxValue*100;

      label.text =KpisStore.individualKpiDetails?.achieved_value;
      axis2.invalidate();
    });

    setInterval(function() {
      let value =percent;// set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);

    //don't mouse click call chart again 
    this.GaugeChartChangeEnable=false;
  }

  barChart(){
    
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    am4core.addLicense("CH199714744");
    // Create chart instance
    let chart = am4core.create("barchartdiv", am4charts.XYChart);
    //color
    chart.colors.list = [
      am4core.color("#89CFF0"),
    ];
    
    // Add data
    chart.data = KpisStore.scoreByFrequencyChart;

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.cellStartLocation = 0.2;//width
    categoryAxis.renderer.cellEndLocation = 0.8;//width

    categoryAxis.events.on("sizechanged", function(ev) {
      let axis = ev.target;
        var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        if (cellWidth < axis.renderer.labels.template.maxWidth) {
          axis.renderer.labels.template.rotation = -45;
          axis.renderer.labels.template.horizontalCenter = "right";
          axis.renderer.labels.template.verticalCenter = "middle";
        }
        else {
          axis.renderer.labels.template.rotation = 0;
          axis.renderer.labels.template.horizontalCenter = "middle";
          axis.renderer.labels.template.verticalCenter = "top";
        }
      });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    // valueAxis.renderer.minGridDistance = 10;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.columns.template.width = am4core.percent(10);
    series.columns.template.maxWidth = 80;
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "title";
    series.name = "value";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    series.columns.template.width = am4core.percent(80);//width

    //don't mouse click call chart again 
    this.barChartChagneEnable=false;
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  activityLogsOpenModal(){//Activity Logs
    KpisStore.activity_log_form_modal=true;
    setTimeout(() => {
      $(this.activityLogsModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  activityLogsCloseModal(){
    KpisStore.activity_log_form_modal=false;
    $(this.activityLogsModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.activityLogsModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  workflowHistoryOpenModal(){
    KpisStore.workflow_history_form_modal=true;
    setTimeout(() => {
      $(this.workflowHistoryModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  workflowHistoryCloseModal(){
    KpisStore.workflow_history_form_modal=false;
    $(this.workflowHistoryModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowHistoryModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  workflowOpenModal(){
    KpisStore.workflow_form_modal=true;
    setTimeout(() => {
      $(this.workflowModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'auto');
    },100);
  }

  workflowColseModal(){
    KpisStore.workflow_form_modal=false;
    $(this.workflowModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.workflowModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
  }

  revertOpenModal(){
    setTimeout(() => {
      $(this.revertModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  revertCloseModal(res){
    $(this.revertModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    if(res){
      KpisStore.individualLoaded=false;
      this.getDetials();
    }
  }

  approveOpenModal(type){
    this.approveAndReviewSub={
      id:KpisStore.individualKpiDetails.id,
      type:type
    }
    setTimeout(() => {
      $(this.approveModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  approveCloseModal(res){
    $(this.approveModal.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    if(res){
      KpisStore.individualLoaded=false;
      this.getDetials();
    }
    this.approveAndReviewSub={ id:null, type:''};
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Delete': this.deleteKpi(status);
        break;
      case 'submit': this.submitKpi(status);
        break;
      case 'reject': this.rejectKpi(status);
        break;
      default:
      break;
    }
  }

  approve(){
    this.popupObject.id = KpisStore.kpiId;
    this.popupObject.type = 'approve';
    this.popupObject.subtitle="are_you_sure_you_want_to_approve_this_kpi";
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  reject(){
    this.popupObject.id = KpisStore.kpiId;
    this.popupObject.type = 'reject';
    this.popupObject.subtitle="it_will_be_rejected_and_no_further_approval";
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  submit(){
    this.popupObject.id = KpisStore.kpiId;
    this.popupObject.type = 'submit';
    this.popupObject.subtitle="submit_kpi_for_approval";
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  delete(){//delete
    this.popupObject.id = KpisStore.kpiId;
    this.popupObject.type = 'Delete';
    this.popupObject.subtitle="kpi_delete_subtitle";
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  deleteKpi(status) {//delete
    if (status && this.popupObject.id) {
      this._kpisService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('kpi-management/kpis');
        
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

  submitKpi(status){

    if (status && this.popupObject.id) {
      KpisStore.individualLoaded=false;

      this._kpisService.submit(this.popupObject.id).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
        }, 500);
        this.clearDeleteObject();
        },(err: HttpErrorResponse)=>{
          KpisStore.individualLoaded=true;
        });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  
  }

  rejectKpi(status){
    
    if (status && this.popupObject.id) {
      KpisStore.individualLoaded=false;

      this._kpisService.reject(this.popupObject.id).subscribe(res=>{
        this.getDetials();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        
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

  clearDeleteObject(){//delete
    setTimeout(() => {
      this.popupObject.id = null;
      this.popupObject.type = '';
    }, 500);
  }

  // kh-module base document-document
  viewDocument(type, documents, documentFile) {
    
    switch (type) {
      case "kpi-document":
        this._kpiManagementFileService
          .getFilePreview(type, documents.kpi_management_kpi_id, documentFile.id)
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

  // kh-module base document- Returns image url according to type and token-document
  createImageUrl(type, token) {
    if(type=='kpi-document')
    return this._kpiManagementFileService.getThumbnailPreview(type, token);
    else
    return this._documentFileService.getThumbnailPreview(type, token);

  }

  // kh-module base document-document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "kpi-document":
        this._kpiManagementFileService.downloadFile(
          type,
          document.kpi_management_kpi_id,
          document.id,
          null,
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

  // kh-module base document-document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.kpi_management_kpi_id;
      
      this.previewObject.uploaded_user = KpisStore.individualKpiDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview-document
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
  }

  // extension check function-document
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  clickEvent = (event: any): void => {
    this.activeIndex = null;
    this.hover = false;
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    am4core.disposeAllCharts();
    this.deleteEventSubscription.unsubscribe();
    this.revertEventSubscription.unsubscribe();
    this.approveEventSubscription.unsubscribe();
    KpisStore.unsetIndividualKpiDetails();
    KpisStore.unSetIndividualKpiChart();
    this.kpiWorkflowEventSubscription.unsubscribe();
    this.kpiActivityLogsSubscription.unsubscribe();
    this.kpiWorkflowHistoryEventSubscription.unsubscribe();
    this.componeDistory=false;
  }
}
