import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
// import { BaActionPlanService } from 'src/app/core/services/business-assessments/action-plans/ba-action-plan.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ComplianceActionPlanService } from 'src/app/core/services/compliance-management/compliance-action-plans/compliance-action-plan.service';
import { ComplianceRegisterActionPlanStore } from 'src/app/stores/compliance-management/compliance-register/action-plan-store';

declare var $: any

@Component({
  selector: 'app-compliance-action-plans-details',
  templateUrl: './compliance-action-plans-details.component.html',
  styleUrls: ['./compliance-action-plans-details.component.scss']
})
export class ComplianceActionPlansDetailsComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef
  @ViewChild('actionPlanUpdate') actionPlanUpdate: ElementRef;
  @ViewChild('actionPlanHistory') actionPlanHistory: ElementRef;

  daysDue: number = 0;
  Totaldays: number = 0;
  remainingDate: number = 0;
  remainingDateGraph: number = 0;
  todayDate: any = new Date();

  openActionPlanPopup:boolean=false;



  
  //Giving component as checklist parent to dismiss properly in event emittor.
  //Type is given to handle different ways of handling action plan add/edit.
  actionPlanData={
    values:null,
    type:'submenu-edit'
  }


  // BAActionPlanStore=BAActionPlanStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore=AppStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  AuthStore=AuthStore;
  ComplianceRegisterActionPlanStore=ComplianceRegisterActionPlanStore;
  
  actionPlanFormSubscription:any
  actionPlanStatusModalSubscription:any
  actionPlanHistoryModalSubscription:any;
  constructor(
    // private _BAactionPlanService:BaActionPlanService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _compianceRegisterActionPlanService:ComplianceActionPlanService
  ) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    this.route.params.subscribe(params => {
      // (+) converts string 'id' to a number
      let id = +params['id'];
      ComplianceRegisterActionPlanStore.actionPlanId=id
      this.getActionPlanDetails(id);

    });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'UPDATE_CONTROL', submenuItem: { type: 'edit_modal' } },
        {activityName: null, submenuItem: {type: 'close',path:'../'}},
      ]
      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.editActionPlan()
              this._utilityService.detectChanges(this._cdr);
            }, 1000);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.actionPlanFormSubscription=this._eventEmitterService.complianceRegisterActionPlanModal.subscribe(res=>{

      this.closeActionPlanForm()
    })

    this.actionPlanStatusModalSubscription=this._eventEmitterService.baActionPlanStatusModal.subscribe(res=>{

      this.clsoeActionPlanStatusUpdateModal()
    })

    this.actionPlanHistoryModalSubscription=this._eventEmitterService.baActionPlanHistoryModal.subscribe(res=>{

      this.closeActionPlanHistorymodal()
    })


    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

  }

  getActionPlanDetails(actionPlanId){

    this._compianceRegisterActionPlanService.getItem(actionPlanId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })


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

  openHistoryModal(){

    ComplianceRegisterActionPlanStore.actionPlanStatusHistoryModal = true;
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', '99999'); 
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'block'); 
    $(this.actionPlanHistory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeActionPlanHistorymodal(){

    ComplianceRegisterActionPlanStore.actionPlanStatusHistoryModal = false;
    $(this.actionPlanHistory.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'z-index', '9999'); 
    this._renderer2.setStyle(this.actionPlanHistory.nativeElement, 'display', 'none'); 
    $('.modal-backdrop').remove();
  }

  editActionPlan() {
    if (ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.id) {
      this.actionPlanData.values = {
        id: ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.id,
        title: ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.title,
        start_date: this._helperService.processDate(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails.start_date,'split'),
        target_date: this._helperService.processDate(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails.start_date,'split'),
        description: ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.description,
        responsible_user_id: ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.responsible_user_id,
        documentId:ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails.id
      }

      this._utilityService.detectChanges(this._cdr);
      this.openActionPlanForm();
    }
  }

  openActionPlanForm(){
    this.openActionPlanPopup=true
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '99999'); 
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'block'); 
    $(this.actionPlanModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  
  }
  
  closeActionPlanForm(){
  
    $(this.actionPlanModal.nativeElement).modal('hide');
    this.openActionPlanPopup=false;
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '9999'); 
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'none'); 
    $('.modal-backdrop').remove();
  
  }

  openActionPlanStatusUpdateModal() {
    ComplianceRegisterActionPlanStore.actionPlanStatusUpdateModal = true;
    $(this.actionPlanUpdate.nativeElement).modal('show');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 99999);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'auto');
    this._utilityService.detectChanges(this._cdr);
  }

  clsoeActionPlanStatusUpdateModal() {
    ComplianceRegisterActionPlanStore.actionPlanStatusUpdateModal = false;
    $(this.actionPlanUpdate.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.actionPlanUpdate.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    AppStore.showDiscussion = true;
  }

  // openHistoryModal() {
  //   ActionPlansStore.action_plan_history = true;
  //   $(this.actionPlanHistory.nativeElement).modal('show');
  //   this._utilityService.detectChanges(this._cdr);
  // }

  // closeHistoryModal() {
  //   ActionPlansStore.action_plan_history = false;
  //   $(this.actionPlanHistory.nativeElement).modal('hide');
  //   this._utilityService.detectChanges(this._cdr);
  //   ActionPlansStore.unSetActionPlanHistory();
  //   AppStore.showDiscussion = true;
  // }

 

  getremainingDateChartAttendance() {

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate: any = new Date(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.start_date);
    const targetDate: any = new Date(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.target_date);
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
  daysRemainingGraph() {
    let startDate = new Date(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.start_date);
    let targetDate = new Date(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.target_date);

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

    let startDate = new Date(ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.start_date);

    this.remainingDate = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
    if (this.remainingDate >= 0)
      this.remainingDate = this.remainingDate + 1;
    else
      this.remainingDate = 0;

    return this.remainingDate;
  }

  getColorKey() {
    var label_color = ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails?.document_action_plan_status?.label.split('-');
    return 'draft-tag-' + label_color[0];
  }
  
  

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = typeof(user.designation) == 'string' ? user.designation : user.designation?.title ? user.designation?.title : '';
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = ComplianceRegisterActionPlanStore?.complianceRegisterActionPlanDetails.created_at;
      return userDetailObject;
    }
  }

  ngOnDestroy(){
    ComplianceRegisterActionPlanStore.clearComplianceRegisterActionPlanDetails();
    this.actionPlanFormSubscription.unsubscribe();
    this.actionPlanStatusModalSubscription.unsubscribe();
    this.actionPlanHistoryModalSubscription.unsubscribe();
  }

}
