import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
// import { RiskTreatmentService } from 'src/app/core/services/risk-management/risks/risk-treatment/risk-treatment.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
// import { IsmsRiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
// import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import { HttpErrorResponse } from '@angular/common/http';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
// import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import * as htmlToImage from 'html-to-image';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskSettingsService } from 'src/app/core/services/settings/organization_settings/isms-risk-settings/isms-risk-settings.service';
import { IsmsRiskTreatmentService } from 'src/app/core/services/isms/isms-risks/isms-risk-treatment/isms-risk-treatment.service';
import { ISMSRiskSettingStore } from 'src/app/stores/settings/isms-risk-settings.store';
import { IsmsRisksService } from 'src/app/core/services/isms/isms-risks/isms-risks.service';
declare var $: any

@Component({
  selector: 'app-isms-risk-treatment-details',
  templateUrl: './isms-risk-treatment-details.component.html',
  styleUrls: ['./isms-risk-treatment-details.component.scss']
})
export class IsmsRiskTreatmentDetailsComponent implements OnInit {
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  IsmsRiskTreatmentStore = IsmsRiskTreatmentStore;
  AppStore = AppStore;
  // RiskManagementSettingStore = RiskManagementSettingStore;
  IsmsRiskSettingStore = ISMSRiskSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  Id: number;
  todayDate: any = new Date();
  remainingDate: any = 0;
  selectedIndex = null;
  deleteEventSubscription: any;
  updateEventSubscription: any;
  updateRiskTreatment: boolean = false;
  updateForm: FormGroup;
  percentage = [];

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null
  }
  riskDetailObject = {
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

  deleteObject = {
    id: null,
    position: null,
    type: '',
    title:'',
    subtitle: ''
  };
  updateObject = {
    id: null,
    risk_id: null
  };
  networkFailureSubscription: any;
  idleTimeoutSubscription: any;
  IsmsRisksStore = IsmsRisksStore;
  downloadMessage: string = 'downloading';
  openAll=false;

  constructor(private _riskTreatmentService: IsmsRiskTreatmentService,
    private _route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _ismsRiskSettingsService: IsmsRiskSettingsService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _risksService:IsmsRisksService) {
   
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.Id = params.id;
      this.getDetails();
    });
    this.reactionDisposer = autorun(() => {
      
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "update_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.openUpdateModal();
            }, 1000);
            break;
          case "edit_modal":
            this.editRiskTreatment();
            break;
          case "delete":
            this.deleteRiskTreatment();
            break;
            case "close_treatment":
              this.closeRiskTreatment();
              break;
            case "export_to_excel":
              this.exportRiskTreatmentInfo();
              break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }
    })

    this.historyPageChange(1);

    // this.getDetails();

    // setTimeout(() => {
    //   this.getCompletedChartAttendance();
    // }, 1000);
    this._ismsRiskSettingsService.getItems().subscribe(() => { this._utilityService.detectChanges(this._cdr) })

    setTimeout(() => {
      this.getremainingDateChartAttendance();
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.updateEventSubscription = this._eventEmitterService.ismsRiskTreatmentUpdateModal.subscribe(item => {
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

    this.updateForm = this._formBuilder.group({
      percentage: [null, Validators.required],
      risk_treatment_status_id: [null, Validators.required],
      amount_used: [''],
      comment: [''],
      documents: [[], ''],
    })
    // IsmsRiskTreatmentStore.treatment_id = this.Id;
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
  }


  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }

  }

  exportRiskTreatmentInfo(){
    this.openAll=true
setTimeout(() => {
  $(this.loaderPopUp.nativeElement).modal('show');
}, 100);
setTimeout(() => {
  let element: HTMLElement;
element = document.getElementById("risk-treatment");
let pthis = this;
htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
.then(function (dataUrl) {
  var reader = new FileReader();
    reader.readAsDataURL(dataUrl); 
    reader.onloadend = function() {
      var base64data = reader.result;
      // console.log(base64data);
      pthis.downloadPdf(base64data);
    }
  // SubMenuItemStore.exportClicked = false;
  // pthis.openAll=false;
  // pthis.closeLoaderPopUp();
});
}, 1000);

}

downloadPdf(file){
  this._imageService.getPdf(file).subscribe(res=>{
    SubMenuItemStore.exportClicked = false;
    this.openAll=false;
    this.closeLoaderPopUp();
  })
}


getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}


  closeLoaderPopUp(){
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  
  closeRiskTreatment() {
    this.deleteObject.id = IsmsRiskTreatmentStore.riskTreatmentDetails?.id;
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'treatment';
    this.deleteObject.subtitle = "close_risk_treatment"

    $(this.deletePopup.nativeElement).modal('show');
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

  getResponsiblePresent(id) {
    // console.log('inside');

    var pos = IsmsRisksStore.individualRiskDetails?.responsible_users?.findIndex(e => e.id == id);
    if (pos != -1)
      return true;
    else{

    
      if (IsmsRisksStore.individualRiskDetails?.risk_owner.id == id)
        return true;
      else{
        if (IsmsRiskTreatmentStore.riskTreatmentDetails?.responsible_user.id == id)
          return true
        else {
          var pos2 = IsmsRiskTreatmentStore.riskTreatmentDetails?.watchers?.findIndex(v => v.id == id);

          if (pos2 != -1) {
            return true;
          }
          else {
            if (IsmsRiskTreatmentStore.riskTreatmentDetails?.created_by?.id == id)
              return true
              else{
                if(IsmsRiskTreatmentStore.riskTreatmentDetails?.risk?.created_by.id==id)
                return true;
                else
                return false;
              }
          }
        }
      }
      }

    // else
    //   return false;


  }

  getDetails() {
    if(!IsmsRisksStore.riskId || !IsmsRisksStore.individual_risk_loaded){
      this._riskTreatmentService.getItems(false,'risk_treatment_ids='+this.Id,false).subscribe(resp=>{
        if(resp['data'][0]?.risk_id){
          IsmsRisksStore.riskId=resp['data'][0]?.risk_id;
          this._risksService.getItem(resp['data'][0].risk_id).subscribe(res=>{
            this.getTreatmentDetails();
            this.historyPageChange(1);
            this._utilityService.detectChanges(this._cdr);
          })
          
        }
        
      })
    }
    else{
      this.getTreatmentDetails();
    }
  
    
   
  }

  getTreatmentDetails(){
    this._riskTreatmentService.getItem(this.Id, '?risk_id=' + IsmsRisksStore.riskId).subscribe(res => {
      this.setSubmenu(res);
      this._utilityService.detectChanges(this._cdr);
     
      if(res['process_details'] && res['process_details']?.length>0)
      this.selectedIndex = res['process_details'][0]?.process.id;
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
    });
  }

  setSubmenu(res){
    if (res['risk_treatment_status']?.type == 'closed' || res['risk_treatment_status']?.type == 'resolved') {
      if(IsmsRisksStore.isProperEditUser()){

        if(res['risk_treatment_status']?.type != 'closed'){
          if(this.getResponsiblePresent(AuthStore.user.id)){
            let subMenuItems = [
              { activityName: 'UPDATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'edit_modal' } },
              { activityName: 'CREATE_ISMS_RISK_TREATMENT_UPDATE', submenuItem: { type: 'update_modal' } },
              { activityName: 'CLOSE_ISMS_RISK_TREATMENT', submenuItem: { type: 'close_treatment' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
  
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
      
            ]
            this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
          else{
            let subMenuItems = [
              { activityName: 'UPDATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'edit_modal' } },
              { activityName: 'CREATE_ISMS_RISK_TREATMENT_UPDATE', submenuItem: { type: 'update_modal' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
      
            ]
            this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
          
        }
        else{
          let subMenuItems = [

            { activityName: null, submenuItem: { type: 'export_to_excel' } },

            { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
    
          ]
          this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
        }

       

      }
      else{
        let subMenuItems = [
          { activityName: null, submenuItem: { type: 'export_to_excel' } },
          { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
  
        ]
        this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);

      }
     
      //  }
    
    }
    else{
      // if (res['risk_treatment_status']?.type != 'resolved') {
        if (this.getResponsiblePresent(AuthStore.user?.id)) {
          if(IsmsRisksStore.isProperEditUser()){
            let subMenuItems = [
              { activityName: 'CREATE_ISMS_RISK_TREATMENT_UPDATE', submenuItem: { type: 'update_modal' } },
              { activityName: 'UPDATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'edit_modal' } },
              { activityName: 'DELETE_ISMS_RISK_TREATMENT', submenuItem: { type: 'delete' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
  
            ]
             this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
          else{
            let subMenuItems = [
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
  
            ]
             this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
          
        }
        else {
          if(IsmsRisksStore.isProperEditUser()){
            let subMenuItems = [
              { activityName: 'CREATE_ISMS_RISK_TREATMENT_UPDATE', submenuItem: { type: 'update_modal' } },
              { activityName: 'UPDATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'edit_modal' } },
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
  
            ]
            this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
          else{
            let subMenuItems = [
              { activityName: null, submenuItem: { type: 'export_to_excel' } },
              { activityName: null, submenuItem: { type: 'close', path: "/isms/isms-risk-treatments" } },
  
            ]
            this._helperService.checkSubMenuItemPermissions(3600, subMenuItems);
          }
         
        }
      // }
      // else {
      //   // if(this.getResponsiblePresent(AuthStore.user?.id)){
      //     if(IsmsRisksStore.isProperEditUser()){
      //       let subMenuItems = [
      //         { activityName: 'CREATE_ISMS_RISK_TREATMENT_UPDATE', submenuItem: { type: 'update_modal' } },
      //         { activityName: 'UPDATE_ISMS_RISK_TREATMENT', submenuItem: { type: 'edit_modal' } },
      //         { activityName: null, submenuItem: { type: 'export_to_excel' } },
      //         { activityName: 'CLOSE_ISMS_RISK_TREATMENT', submenuItem: { type: 'close_treatment' } },
    
      //         { activityName: null, submenuItem: { type: 'close', path: "/risk-management/risk-treatments" } },
    
      //       ]
      //       this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      //     }
      //     else{
      //       let subMenuItems = [
      //         { activityName: null, submenuItem: { type: 'export_to_excel' } },
    
      //         { activityName: null, submenuItem: { type: 'close', path: "/risk-management/risk-treatments" } },
    
      //       ]
      //       this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      //     }
        

      // }
      

    }
  }

  getDays(day1) {
    let dt = new Date();
    return Math.round(this._helperService.daysFromDate(day1, dt));
  }


  getPopupDetails(userDetails?) {
    let user;
    if (userDetails != null)
      user = userDetails;
    else
      user = IsmsRiskTreatmentStore?.riskTreatmentDetails?.responsible_user;

    this.userDetailObject.first_name = user.first_name ? user.first_name : null;
    this.userDetailObject.last_name = user.last_name ? user.last_name : null;
    this.userDetailObject.designation = user.designation ? user.designation : null;
    this.userDetailObject.image_token = user.image.token ? user.image.token : null;
    this.userDetailObject.email = user.email ? user.email : null;
    this.userDetailObject.mobile = user.mobile ? user.mobile : null;
    this.userDetailObject.id = user.id ? user.id : null;
    this.userDetailObject.department = user.department?.title ? user.department?.title : null;
    this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
    return this.userDetailObject;
  }

  getRiskPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if (user) {
      this.riskDetailObject.first_name = user.first_name;
      this.riskDetailObject.last_name = user.last_name;
      this.riskDetailObject.designation = user.designation;
      this.riskDetailObject.image_token = user.image.token;
      this.riskDetailObject.email = user.email;
      this.riskDetailObject.mobile = user.mobile;
      this.riskDetailObject.id = user.id;
      this.riskDetailObject.department = user.department ? user.department : null;
      this.riskDetailObject.status_id = user.status.id ? user.status.id : 1;
      return this.riskDetailObject;
    }
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  collapseControls(index) {
    if (this.selectedIndex == index)
      this.selectedIndex = null;
    else
      this.selectedIndex = index;
  }

  /**
 * changing the number of days in to month and years
 * @param days -number of days
 */
  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }

  getCompletedChartAttendance() {

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    //create chart
    let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    //Normal axis
    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(100);
    axis.renderer.inside = false;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.disabled = false
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 10;
    axis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
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
    range0.axisFill.fill = colorSet.getIndex(0);

    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    //Label
    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 20;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "50%";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 50;

    hand.events.on("propertychanged", function (ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      axis2.invalidate();
    });

    setInterval(function () {
      let value = IsmsRiskTreatmentStore?.riskTreatmentDetails?.percentage;// set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }

  getremainingDateChartAttendance() {

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate: any = new Date(IsmsRiskTreatmentStore?.riskTreatmentDetails?.start_date);
    const targetDate: any = new Date(IsmsRiskTreatmentStore?.riskTreatmentDetails?.target_date);
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
    // Themes end

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        category: "Days",
        value1: IsmsRiskTreatmentStore?.riskTreatmentDetails?.total_days - IsmsRiskTreatmentStore?.riskTreatmentDetails?.days_remaining,
        value2: IsmsRiskTreatmentStore?.riskTreatmentDetails?.days_remaining,
      }
    ];

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    // chart.legend = new am4charts.Legend();

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


    // chart.scrollbarX = new am4core.Scrollbar();

    // chart.hiddenState.properties.radius = am4core.percent(0);


    // chart.logo.disabled = true;

  }

  openUpdateModal() {
    this.updateRiskTreatment = true;
    this.updateObject.id = this.Id;
    this.updateObject.risk_id = IsmsRiskTreatmentStore.riskTreatmentDetails.risk.id;
    this._utilityService.detectChanges(this._cdr);
    this._riskTreatmentService.getItem(this.Id, '?risk_id=' + IsmsRiskTreatmentStore.riskTreatmentDetails.risk.id).subscribe(res => {
      if (IsmsRiskTreatmentStore.individualTreatmentLoaded) {
        // this._renderer2.setStyle(this.formModal.nativeElement);
        this._utilityService.detectChanges(this._cdr);
        setTimeout(() => {
          $(this.formModal.nativeElement).modal('show');
        }, 50);
      }
    });
  }

  // openUpdateModal(){
  //   for(let i=1;i<=100;i++){
  //     this.percentage.push(i);
  //   }
  //   this._risktreatmentStatusService.getItems().subscribe(res=>{
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  //   this._riskTreatmentService.getUpdateData(IsmsRiskTreatmentStore.riskTreatmentDetails.id).subscribe(res=>{
  //     if(res['data'].length>0){
  //       this.updateForm.patchValue({
  //         percentage:res['data'][0].percentage,
  //         risk_treatment_status_id:res['data'][0].risk_treatment_status_id,
  //         amount_used:res['data'][0].amount_used,
  //         comment:res['data'][0].treatment_title
  //       })
  //     }
  //     this._utilityService.detectChanges(this._cdr);
  //   })
  //   $(this.formModal.nativeElement).modal('show');
  // }

  closeFormModal() {
    // this.getDetails();
    this._utilityService.detectChanges(this._cdr);
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    $(this.formModal.nativeElement).modal('hide');
  }

  editRiskTreatment() {
    this._riskTreatmentService.getItem(this.Id, '?risk_id=' + IsmsRiskTreatmentStore.riskTreatmentDetails.risk.id).subscribe(() => {
      IsmsRiskTreatmentStore.setEditFlag();
      this.IsmsRiskTreatmentStore.isRiskTreatmentPlan = true;
      this.router.navigateByUrl('/isms/isms-risk-treatments/edit-isms-risk-treatment-plan');
    })
  }

  deleteRiskTreatment() {
    this.deleteObject.id = this.Id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = "delete_risk_treatment"
    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
  }

  historyPageChange(newPage: number = null) {
    
    if (newPage) IsmsRiskTreatmentStore.setHistoryCurrentPage(newPage);
    this._riskTreatmentService.getUpdateData(this.Id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);

    })
  }

  
 

  delete(status) {
    if (status && this.deleteObject.id) {
      let sub;
      if(this.deleteObject.type=='Confirm' && this.deleteObject.title=='treatment'){
        this._riskTreatmentService.closeTreatment(this.deleteObject.id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
          this._riskTreatmentService.getItems().subscribe();
          // this._riskTreatmentService.getItem(this.deleteObject.id);
          this.clearDeleteObject();
        })
      }
      else{
        this._riskTreatmentService.delete(this.deleteObject.id).subscribe(resp => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
            if (IsmsRiskTreatmentStore.currentPage > 1) {
              IsmsRiskTreatmentStore.currentPage = Math.ceil(IsmsRiskTreatmentStore.totalItems / 15);
            }
          }, 500);
          this.clearDeleteObject();
          this.router.navigateByUrl('/isms/isms-risk-treatments');
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {

            this._utilityService.showErrorMessage(err.error.message, 'Error :');
          }
        });
      }
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
  }

  getControlLength(control) {
    let count = 0;
    if (control?.length > 0) {
      for (let i of control) {
        if (i.control && i.control != null) {
          count++;
          return true;
        }

      }
      if (count == 0) {
        return false;
      }
    }
    else
      return false;

  }

  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.updateEventSubscription.unsubscribe();
    IsmsRiskTreatmentStore.unsetHistoryDetails();
    IsmsRiskTreatmentStore.treatment_id = null;
    IsmsRiskTreatmentStore.individualTreatmentLoaded = false;
  }
}
