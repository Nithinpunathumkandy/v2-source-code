import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventRiskAssessmentService } from 'src/app/core/services/event-monitoring/event-risk-assessment/event-risk-assessment.service';
import { EventRiskResidualService } from 'src/app/core/services/event-monitoring/event-risk-residual/event-risk-residual.service';
import { RiskTreatmentService } from 'src/app/core/services/event-monitoring/risk-treatment/risk-treatment.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventResidualRiskStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-residual-risk.store';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { RiskMatrixRatingLevelsMasterStore } from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import * as htmlToImage from 'html-to-image';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";

declare var $: any;

@Component({
  selector: 'app-residual-risk',
  templateUrl: './residual-risk.component.html',
  styleUrls: ['./residual-risk.component.scss']
})
export class ResidualRiskComponent implements OnInit {

  @ViewChild('performPopup') performPopup: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;

  formErrors = null;
  ImpactStore = ImpactStore;
  LikelihoodStore = LikelihoodStore;
  AppStore = AppStore;
  activeImpact = null;
  activeLikelihood = null;
  activeControlEfficiency = [];
  activeProcess = null;
  EventRiskAssessmentStore = EventRiskAssessmentStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskMatrixRatingLevelsMasterStore = RiskMatrixRatingLevelsMasterStore;
  reactionDisposer: IReactionDisposer;
  EventResidualRiskStore = EventResidualRiskStore;
  openAll=false;

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

  cancelObject = {
        type: '',
        title: '',
        subtitle: ''
        };

  AuthStore = AuthStore;
  cancelEventSubscription:any;
  impactJustification = '';
  popup=false;
  likelihoodJustification = '';
  SubMenuItemStore = SubMenuItemStore;
  RiskManagementSettingStore = RiskManagementSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;

  processEmptyList="control_mapping_empty_for_analysis";
  controlEmptyList = "control_empty_message";
  controlEfficiencyList = "control_efficiency_empty";
  downloadMessage: string = 'downloading';
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

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

  riskAssessmentObject = {
    component: 'risk_treatment',
    values: null,
    type: null
  };
  
  riskAssessmentModalSubscription: any;

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _impactService: ImpactService,
    private _likelihoodService: LikelihoodService,
    private _riskScoreService: RiskScoreService,
    private _riskAssessmentService: EventRiskAssessmentService,
    private _riskRatingService: RiskRatingService,
    private _renderer2: Renderer2,
    private _residualRiskService: EventRiskResidualService,
    private _eventEmitterService:EventEmitterService,
    private _riskManagementSettingsService:RiskManagementSettingsService,
    private _riskTreatmentService:RiskTreatmentService,
    private _imageService:ImageServiceService) { }

  ngOnInit(): void {
    ImpactStore.orderBy = "desc";
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (!EventRiskAssessmentStore.eventRiskDetails) {
      this._router.navigateByUrl('/event-risks/' + EventRiskAssessmentStore.selectedId);
    }
    
    this.reactionDisposer = autorun(() => {
      if(EventRiskAssessmentStore.eventRiskDetails && EventRiskAssessmentStore.eventRiskDetails?.risk_status?.type=='closed'){
        NoDataItemStore.setNoDataItems({title: "risk_closed"});
        this._utilityService.detectChanges(this._cdr);
      }
      else if(EventRiskAssessmentStore.detailsLoaded && !EventRiskAssessmentStore.eventRiskDetails.is_analysis_performed){
        NoDataItemStore.setNoDataItems({title: "assessment_empty_message"});
        this._utilityService.detectChanges(this._cdr);
      }
      else if(EventRiskAssessmentStore.detailsLoaded && EventRiskAssessmentStore.eventRiskDetails.is_analysis_performed && !EventRiskAssessmentStore.eventRiskDetails?.is_residual_analysis_performed){
        this._riskTreatmentService.getItems(false,'',true).subscribe(res=>{
          if(res['data'].length>0){
            const pos= res['data'].findIndex(e=>e.type!='new')
            if(pos!=-1){
              if(EventRiskAssessmentStore.isProperEditUser)
              {
                NoDataItemStore.setNoDataItems({title: "residual_empty_title", subtitle: 'residual_empty_subtitle',buttonText: 'perform_now'});
              this._utilityService.detectChanges(this._cdr);
              }
              else
              {
                NoDataItemStore.setNoDataItems({title: "residual_empty_title"});
              this._utilityService.detectChanges(this._cdr);
              }
            }else{
              NoDataItemStore.setNoDataItems({title: "treatment_empty_title"});
              this._utilityService.detectChanges(this._cdr);
            }
          }else{
            NoDataItemStore.setNoDataItems({title: "treatment_empty_title"});
            this._utilityService.detectChanges(this._cdr);
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
      var subMenuItems;
      if(EventRiskAssessmentStore.detailsLoaded && EventRiskAssessmentStore.eventRiskDetails?.risk_status?.type=='closed'){
        subMenuItems = [{activityName: null, submenuItem: {type: 'close',path:'../'}},]
        this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      }
      else if(EventRiskAssessmentStore.detailsLoaded && EventRiskAssessmentStore.eventRiskDetails?.is_analysis_performed && !EventRiskAssessmentStore.eventRiskDetails?.is_residual_analysis_performed){
        this._riskTreatmentService.getItems(false,'',true).subscribe(res=>{
          if(res['data'].length>0){
            var pos2= res['data'].findIndex(e=>e.type!='new')
          }
          if (res['data'].length > 0 && pos2 != -1) {
            if (EventRiskAssessmentStore.isProperEditUser) {
              subMenuItems = [
                // { activityName: null, submenuItem: { type: 'export_to_excel' } },

                { activityName: null, submenuItem: { type: 'close', path: '../' } },
                { activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: { type: 'edit_modal' } },

              ]
              this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
            }
            else {
              subMenuItems = [
                // { activityName: null, submenuItem: { type: 'export_to_excel' } },

                { activityName: null, submenuItem: { type: 'close', path: '../' } },

              ]
              this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
            }
          } else {
              subMenuItems = [
                { activityName: null, submenuItem: { type: 'close', path: '../' } },
              ]
              this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
            }
          
          this._utilityService.detectChanges(this._cdr);
        })
      }
      else if (EventRiskAssessmentStore.detailsLoaded && EventRiskAssessmentStore.eventRiskDetails?.is_analysis_performed && EventRiskAssessmentStore.eventRiskDetails?.is_residual_analysis_performed) {
        if (EventRiskAssessmentStore.eventRiskDetails?.is_corporate) {
          if (EventRiskAssessmentStore.isProperEditUser) {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },

              { activityName: null, submenuItem: { type: 'close', path: '../' } },
              { activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: { type: 'edit_modal' } },

            ]
            this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
          }
          else {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },

              { activityName: null, submenuItem: { type: 'close', path: '../' } },

            ]
            this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
          }

        }
        else {
          if (EventRiskAssessmentStore.isProperEditUser) {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },

              { activityName: null, submenuItem: { type: 'close', path: '../' } },
              { activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: { type: 'edit_modal' } },

            ]
            this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
          }
          else {
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel' } },

              { activityName: null, submenuItem: { type: 'close', path: '../' } },

            ]
            this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
          }

        }
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        if (EventRiskAssessmentStore.eventRiskDetails?.is_corporate) {
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },

            { activityName: null, submenuItem: { type: 'close', path: '../' } },
            // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},

          ]
          this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
        }
        else {
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel' } },

            { activityName: null, submenuItem: { type: 'close', path: '../' } },
            // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},

          ]
          this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
        }
        this._utilityService.detectChanges(this._cdr);
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {
              this.riskAssessmentObject.type = 'Edit'
              this.openPopup();
            }, 1000);
            break;
            case "export_to_excel":
            this.exportResidualRisk();
              break;

          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.riskAssessmentObject.type = 'Add'
        this.openPopup();
         NoDataItemStore.unSetClickedNoDataItem();
       }
    })
    AppStore.showDiscussion = false;
    this._riskManagementSettingsService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

      if(EventRiskAssessmentStore.eventRiskDetails?.is_analysis_performed==1){
        this.getRiskAssesment()
      }
      
      ImpactStore.orderBy = "desc";
      LikelihoodStore.orderBy = "desc";
      ImpactStore.orderItem="score";
      LikelihoodStore.orderItem = "score";
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeImpact == null)
        this.activeImpact = res['data'][0];
    })

    this._residualRiskService.getItem().subscribe(res => {
      if(res['risk_residual_analysis']){
        this.activeImpact = res['risk_residual_analysis'].impact;
          this.activeLikelihood = res['risk_residual_analysis'].likelihood;
          if(res['risk_residual_analysis'].process_details?.length>0){
            // this.activeProcess = res['risk_residual_analysis'].process_details[0]?.id;
          }
        
      }
      this._utilityService.detectChanges(this._cdr);
    })

    if(EventRiskAssessmentStore.detailsLoaded && EventRiskAssessmentStore.eventRiskDetails.is_residual_analysis_performed){
      this._residualRiskService.getChartDetails().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

   

    this._riskScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeLikelihood == null)
        this.activeLikelihood = res['data'][0];
    })

    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      // this.closeCancel(item);
    })

    if (!(EventRiskAssessmentStore.eventRiskDetails) && EventRiskAssessmentStore.selectedId) {

      this._router.navigateByUrl('/event-risks/' + EventRiskAssessmentStore.selectedId);
    }
    this.riskAssessmentModalSubscription = this._eventEmitterService.eventRiskAssessmentModal.subscribe(item => {
      this.closeFormModal()
      this.getResidualRisk()
      this._residualRiskService.getChartDetails().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
      setTimeout(() => {
        this.getCompletedPercentageChart();
        this.getRiskVariation();
        this._utilityService.detectChanges(this._cdr);
      },4000);
      this._utilityService.detectChanges(this._cdr);
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })

    setTimeout(() => {
      this.getCompletedPercentageChart();
      this.getRiskVariation();
      this._utilityService.detectChanges(this._cdr);
    },2000);
  }

  openPopup() {
    this._utilityService.detectChanges(this._cdr);
    this.openPerformPopup();
  }

  openPerformPopup(){
   setTimeout(() => {
    $(this.performPopup.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
   }, 250);

 }

  closeFormModal() {
    this.getResidualRisk()
    this.getRiskAssesment()
    setTimeout(() => {
      this.riskAssessmentObject.type = null;
      this.riskAssessmentObject.values = null;
      $(this.performPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  getRiskAssesment(){
    this._riskAssessmentService.getItem(EventRiskAssessmentStore.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getResidualRisk(){
    this._residualRiskService.getItem().subscribe(res => {
      if(res['risk_residual_analysis']){
        this.activeImpact = res['risk_residual_analysis'].impact;
          this.activeLikelihood = res['risk_residual_analysis'].likelihood;
          if(res['risk_residual_analysis'].process_details?.length>0){
            // this.activeProcess = res['risk_residual_analysis'].process_details[0]?.id;
          }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

 getScorePercentage(data,control?) {
   let scoreSum = 0;
   let count=0;
   if(control){
     if(data.length>0){
       for (let i of data) {
         count++;
         if (i.pivot?.updated_control_efficiency_measure_score) {
           scoreSum = scoreSum + i.pivot?.updated_control_efficiency_measure_score;
         }
         else {
           scoreSum = scoreSum + i.activeControlEfficiency?.score;
         }
       }
       return Math.round(scoreSum/count);
     }
     else{
       return 0;
     }
   }
   else{
     if(data.controls?.length>0){
       for (let i of data.controls) {
         count++;
         if (i.efficiency?.score) {
           scoreSum = scoreSum + i.efficiency.score;
         }
         else {
           scoreSum = scoreSum + i.activeControlEfficiency?.score;
         }
       }
       return Math.round(scoreSum/count);
     }
     else{
       return 0;
     }
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

 setActiveProcess(id) {
   if (this.activeProcess == id) {
     this.activeProcess = null;
   }
   else
     this.activeProcess = id;
 }

 confirmCancel() {
  this.cancelObject.type = 'Cancel';
  this.cancelObject.title = 'Cancel residual assessment Creation?';
  this.cancelObject.subtitle = 'analysis_cancel_confirmation';
  $(this.cancelPopup.nativeElement).modal('show');
}


clearCancelObject() {
  this.cancelObject.title = '';
  this.cancelObject.subtitle = '';

}

 getPopupDetails(user) {
   // $('.modal-backdrop').remove();
   this.userDetailObject.first_name = user.first_name;
   this.userDetailObject.last_name = user.last_name;
   this.userDetailObject.designation = user.designation;
   this.userDetailObject.image_token = user.image.token;
   this.userDetailObject.email = user.email;
   this.userDetailObject.mobile = user.mobile;
   this.userDetailObject.id = user.id;
   this.userDetailObject.department = user.department?.title ? user.department?.title : null;
   this.userDetailObject.status_id = user.status_id ? user.status_id : 1;
   return this.userDetailObject;
 }

 getFormatedValue(seperator,items){
   var result = items.map(function(val) {
     return val;
   }).join(seperator);
   return result;
 }

 getRiskClass(type) {
   // let classType = null;
   let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
   for (let rating of RiskRatingMasterStore.allItems) {
     var pos=rating.risk_rating_values?.findIndex(e=>e==totalScore);
     if(pos!=-1){
       if(type)
       return rating.title;
       else
       return rating.label;
     }
     // if (totalScore >= rating.score_from && totalScore <= rating.score_to) {
     //   if (type)
     //     return rating.title;
     //   else
     //     return rating.label
     // }
   }
 }

 getProcessControlLength(data) {
   let controlCount = 0;
   if (data && data?.length > 0) {
     for (let i of data) {
       if (i.controls?.length > 0) {
         controlCount++;
       }
     }
     if (controlCount == 0)
       return true;
     else
       return false;
   }
   else
     return false;
 }



 getScoreClass(rating) {
   let classType = null;
   let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
   var pos=rating.risk_rating_values?.findIndex(e=>e==totalScore);
   if(pos!=-1){
     return rating.label;
   }
 }

  exportResidualRisk() {
    this.openAll = true
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('show');
    }, 100);
    setTimeout(() => {


      let element: HTMLElement;
      element = document.getElementById("risk");
      let pthis = this;
      htmlToImage.toBlob(element, { quality: 0.95, backgroundColor: '#fff', imagePlaceholder: '/assets/images/user-demo2.png' })
        .then(function (dataUrl) {
          var reader = new FileReader();
          reader.readAsDataURL(dataUrl);
          reader.onloadend = function () {
            var base64data = reader.result;
            pthis.downloadPdf(base64data);
          }
        });
    }, 1000);
  }

  downloadPdf(file) {
    this._imageService.getPdf(file).subscribe(res => {
      SubMenuItemStore.exportClicked = false;
      this.openAll = false;
      this.closeLoaderPopUp();
    })
  }
  closeLoaderPopUp() {
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
  }

  getAnalysisScoreClass(ratingScore) {
    for (let i of RiskRatingMasterStore.allItems) {
      var pos=i.risk_rating_values?.findIndex(e=>e==ratingScore)
      if(pos!=-1){
        return i.label;
      }
    }
  }

  getOwnerPopupDetails(user) {
    // $('.modal-backdrop').remove();
    if(user){
      this.ownerDetailObject.first_name = user.first_name;
      this.ownerDetailObject.last_name = user.last_name;
      this.ownerDetailObject.designation = user.designation?user.designation:user.designation_title;
      this.ownerDetailObject.image_token = user.image?.token?user.image?.token:user.image_token;
      this.ownerDetailObject.email = user.email;
      this.ownerDetailObject.mobile = user.mobile;
      this.ownerDetailObject.id = user.id;
      this.ownerDetailObject.department = user.department?.title ? user.department?.title : null;
      this.ownerDetailObject.status_id = user.status_id ? user.status_id : 1;
      return this.ownerDetailObject;
    }
   
  }


  openProcess(id){

    this._residualRiskService.getItemByProcess(id).subscribe(res=>{

      this.setActiveProcess(id);
      this._utilityService.detectChanges(this._cdr);
    })
  }
  setActiveImpact(impact) {
    this.activeImpact = impact;
  }

  setActiveLikelihood(likelihood) {
    this.activeLikelihood = likelihood;
  }

  getRiskVariation() {

    am4core.addLicense("CH199714744");
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [{
      "country": "",
      "value1": 0,
      "value2": EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score > EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual.risk_analysis?.score : 0 : EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score,
      "value3": EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score < EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual.residual_analysis?.score : 0 : EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score : 0
    }];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 40;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.CurvedColumnSeries());
    series.dataFields.categoryX = "country";

    series.dataFields.valueY = "value1";
    // series.tooltipText = "{valueY.value}(Risk Analysis)"
    series.columns.template.strokeOpacity = 0;
    series.clustered = false;
    // series.hiddenState.properties.visible = true; // this is added in case legend is used and first series is hidden.

    let series2 = chart.series.push(new am4charts.CurvedColumnSeries());
    series2.dataFields.categoryX = "country";

    series2.dataFields.valueY = "value2";
    series2.tooltipText = EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score > EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score ? "{valueY.value}(Risk Analysis)" : "{valueY.value}(Residual Analysis)";
    series2.columns.template.strokeOpacity = 0;
    series2.clustered = false;
    series2.fill = am4core.color(EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score > EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.color_code : EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.color_code);


    let series3 = chart.series.push(new am4charts.CurvedColumnSeries());
    series3.dataFields.categoryX = "country";

    series3.dataFields.valueY = "value3";
    series3.tooltipText = EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score < EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score ? "{valueY.value}(Residual analysis)" : "{valueY.value}(Risk analysis)";
    series3.columns.template.strokeOpacity = 0;
    series3.clustered = false;
    series3.fill = am4core.color(EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score < EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.score ? EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.color_code : EventResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.color_code);


    chart.cursor = new am4charts.XYCursor();
    chart.cursor.maxTooltipDistance = 0;

    chart.scrollbarX = new am4core.Scrollbar();


    series.dataItems.template.adapter.add("width", (width, target) => {
      return am4core.percent(target.valueY / valueAxis.max * 100);
    })

    series2.dataItems.template.adapter.add("width", (width, target) => {
      return am4core.percent(target.valueY / valueAxis.max * 100);
    })

    series3.dataItems.template.adapter.add("width", (width, target) => {
      return am4core.percent(target.valueY / valueAxis.max * 100);
    })
  }

  getCompletedPercentageChart(){

    am4core.addLicense("CH199714744");
    // Themes begin
    am4core.useTheme(am4themes_animated);

    //create chart
    let chart = am4core.create("gaugechartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    //Normal axis
    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 365;
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

    let axis2 =  chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 365;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 182;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    let range1 = axis2.axisRanges.create();
    range1.value = 182;
    range1.endValue = 365;
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
    label.text = "182";

    //hand
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 182;

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      axis2.invalidate();
    });

    setInterval(function() {
      let value = EventResidualRiskStore?.chartDetails?.mitigation_cycle_time;// set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }

  changeZIndex(){
    if($(this.performPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.performPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.performPopup.nativeElement,'overflow','auto');
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    NoDataItemStore.unsetNoDataItems();
    if(this.reactionDisposer)this.reactionDisposer();
    //BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.riskAssessmentModalSubscription.unsubscribe()
    EventResidualRiskStore.unsetResidualDetails()
  }

}
