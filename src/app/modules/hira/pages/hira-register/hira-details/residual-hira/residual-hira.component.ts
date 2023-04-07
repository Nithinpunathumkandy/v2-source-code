import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlEfficiencyMeasuresService } from 'src/app/core/services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service';
// import { RiskMatrixRatingLevelsService } from 'src/app/core/services/masters/risk-management/risk-matrix-rating-levels/risk-matrix-rating-levels.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { HiraAssessmentService } from 'src/app/core/services/hira/hira/hira-assessment/hira-assessment.service';
import { ImpactService } from 'src/app/core/services/hira/hira-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/hira/hira-configuration/likelihood/likelihood.service';
import { HiraScoreService } from 'src/app/core/services/hira/hira-configuration/hira-score/hira-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ControlEfficiencyMeasuresMasterStore } from 'src/app/stores/masters/risk-management/control-efficiency-measures-store';
import { RiskMatrixRatingLevelsMasterStore } from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { RiskAssessmentStore } from 'src/app/stores/hira/hira/hira-assessment.store';
import { ImpactStore } from 'src/app/stores/hira/hira-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/hira/hira-configuration/likelihood.store';
import { HiraScoreStore } from 'src/app/stores/hira/hira-configuration/hira-score';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { ResidualHiraService } from 'src/app/core/services/hira/hira/residual-hira/residual-hira.service';
import { ResidualRiskStore } from 'src/app/stores/hira/hira/residual-hira.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { RiskManagementSettingStore } from 'src/app/stores/settings/risk-management-settings.store';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RiskTreatmentService } from 'src/app/core/services/risk-management/risks/risk-treatment/risk-treatment.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import * as htmlToImage from 'html-to-image';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
declare var $: any;

@Component({
  selector: 'app-residual-hira',
  templateUrl: './residual-hira.component.html',
  styleUrls: ['./residual-hira.component.scss']
})
export class ResidualHiraComponent implements OnInit {

  @ViewChild('performPopup') performPopup: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  formErrors = null;
  ImpactStore = ImpactStore;
  LikelihoodStore = LikelihoodStore;
  HiraScoreStore = HiraScoreStore;
  AppStore = AppStore;
  activeImpact = null;
  activeLikelihood = null;
  emptyMessage="control_efficiency_empty";
  ControlEfficiencyMeasuresMasterStore = ControlEfficiencyMeasuresMasterStore;
  activeControlEfficiency = [];
  activeProcess = null;
  RiskAssessmentStore = RiskAssessmentStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskMatrixRatingLevelsMasterStore = RiskMatrixRatingLevelsMasterStore;
  reactionDisposer: IReactionDisposer;
  RisksStore = RisksStore;
  ResidualRiskStore = ResidualRiskStore;
  RiskImpactGuidelineMasterStore = RiskImpactGuidelineMasterStore
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
  filterdOptions = [];
  
	public rm_risk_description:string='rm_risk_description'	
	public risk_causes:string='risk_causes'

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _impactService: ImpactService,
    private _likelihoodService: LikelihoodService,
    private _hiraScoreService: HiraScoreService,
    private _controlEfficiencyMeasureService: ControlEfficiencyMeasuresService,
    private _hiraAssessmentService: HiraAssessmentService,
    private _riskRatingService: RiskRatingService,
    private _renderer2: Renderer2,
    private _residualHiraService: ResidualHiraService,
    private _eventEmitterService:EventEmitterService,
    private _riskManagementSettingsService:RiskManagementSettingsService,
    private _riskTreatmentService:RiskTreatmentService,
    private _riskImpactGuidelineService:RiskImpactGuidelineService,
    private _imageService:ImageServiceService) { }

  ngOnInit(): void {
    ImpactStore.orderBy = "desc";
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if (!RisksStore.individualRiskDetails) {
      this._router.navigateByUrl('/risk-management/risks/' + RisksStore.riskId);
    }

    if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails?.risk_status?.type=='closed'){
      NoDataItemStore.setNoDataItems({title: "", subtitle: "risk_closed"});
    
    }


    else if(RisksStore.individual_risk_loaded && !RisksStore.individualRiskDetails.is_analysis_performed){
      NoDataItemStore.setNoDataItems({title: "", subtitle: "assessment_empty_message"});
    
    }
    else if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails?.is_analysis_performed && !RisksStore.individualRiskDetails?.is_residual_analysis_performed){
    
      this._riskTreatmentService.getItems(false,'',true).subscribe(res=>{
        if(res['data'].length>0){
          
          const pos= res['data'].findIndex(e=>e.type!='new')
          if(pos!=-1){
            if(RisksStore.isProperEditUser)
            NoDataItemStore.setNoDataItems({title: "residual_empty_title", subtitle: 'residual_empty_subtitle',buttonText: 'perform_now'});
            else
            NoDataItemStore.setNoDataItems({title: "",subtitle: "residual_empty_title"});
            
          }
          else{
            NoDataItemStore.setNoDataItems({title: "",subtitle: "treatment_empty_title"});
      
          }
          // || RisksStore.individualRiskDetails?.risk_control_plan?.id==1 || RisksStore.individualRiskDetails?.risk_control_plan?.id==4
          
        }
        else{
          NoDataItemStore.setNoDataItems({title: "", subtitle: "treatment_empty_title"});
    
        }
        this._utilityService.detectChanges(this._cdr);
      })
      
    }

    this.reactionDisposer = autorun(() => {
      var subMenuItems;
      if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails?.risk_status?.type=='closed'){
        if(RisksStore.individualRiskDetails?.is_corporate){
          subMenuItems = [
    
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
            
          ]
        }
        else{
        subMenuItems = [
    
          {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
        
        ]
      }
      }
      else if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails?.is_analysis_performed && !RisksStore.individualRiskDetails?.is_residual_analysis_performed){
        this._riskTreatmentService.getItems(false,'',true).subscribe(res=>{
          if(res['data'].length>0){
            var pos2= res['data'].findIndex(e=>e.type!='new')
          }
          
        
          if(res['data'].length>0 && pos2!=-1){
            if(RisksStore.individualRiskDetails?.is_corporate){
              if(RisksStore.isProperEditUser){
                subMenuItems = [
                  // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                
                  {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
                  {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
          
                ]
              }
              else{
                subMenuItems = [
                  // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                
                  {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
          
                ]
              }
              
            }
            else{
              if(RisksStore.isProperEditUser){
                subMenuItems = [
                  // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                  
                  {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
                  {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
          
                ]
              }
              else{
                subMenuItems = [
                  // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                  
                  {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
          
                ]
              }
            
          }
          }
          else{
            if(RisksStore.individualRiskDetails?.is_corporate){
              subMenuItems = [
                // { activityName: null, submenuItem: { type: 'export_to_excel'} },
              
                {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
                // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
        
              ]
            }
            else{
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel'} },
              
              {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
              // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
      
            ]
          }
          }
          this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
          this._utilityService.detectChanges(this._cdr);
        })
        
      }
      else if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails?.is_analysis_performed && RisksStore.individualRiskDetails?.is_residual_analysis_performed){
        if(RisksStore.individualRiskDetails?.is_corporate){
          if(RisksStore.isProperEditUser){
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                
              {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
              {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
      
            ]
          }
          else{
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                
              {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
      
            ]
          }
          
        }
        else{
          if(RisksStore.isProperEditUser){
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                  
              {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
              {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
      
            ]
          }
          else{
            subMenuItems = [
              // { activityName: null, submenuItem: { type: 'export_to_excel'} },
                  
              {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
      
            ]
          }
        
      }
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      else{
        if(RisksStore.individualRiskDetails?.is_corporate){
          subMenuItems = [
            // { activityName: null, submenuItem: { type: 'export_to_excel'} },
              
            {activityName: null, submenuItem: {type: 'close',path:'/risk-management/corporate-risks'}},
            // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
    
          ]
        }
        else{
        subMenuItems = [
          // { activityName: null, submenuItem: { type: 'export_to_excel'} },
              
          {activityName: null, submenuItem: {type: 'close',path:'/risk-management/risks'}},
          // {activityName: 'CREATE_RISK_RESIDUAL_ANALYSIS', submenuItem: {type: 'edit_modal'}},
  
        ]
      }
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        this._utilityService.detectChanges(this._cdr);
      }
      
    

      
      if (SubMenuItemStore.clikedSubMenuItem) {
        //submenu selection
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            setTimeout(() => {

              // this._utilityService.detectChanges(this._cdr);
              this.openPopup();
              // RisksStore.setEditFlag();
              // this._router.navigateByUrl('/risk-management/risks/edit-risk');
            }, 1000);
            break;
            case "export_to_excel":
            this.exportResidualRisk();
              break;

          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();


      }
      
      
      
      if(NoDataItemStore.clikedNoDataItem){
        this.openPopup();
  
          NoDataItemStore.unSetClickedNoDataItem();
        }
      })

      AppStore.showDiscussion = false;

      
    this._riskManagementSettingsService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

      if(RisksStore?.individualRiskDetails?.is_analysis_performed==1){
        this._hiraAssessmentService.getItem().subscribe(res => {
  
          // this.activeImpact = res['risk_analysis'].impact;
          // this.activeLikelihood = res['risk_analysis'].likelihood;
    
          this._utilityService.detectChanges(this._cdr);
        })
      }
      
      ImpactStore.orderBy = "desc";
    LikelihoodStore.orderBy = "desc";
    ImpactStore.orderItem="score";
    LikelihoodStore.orderItem = "score";
    ControlEfficiencyMeasuresMasterStore.orderItem="score";
    ControlEfficiencyMeasuresMasterStore.orderBy = "desc";


    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeImpact == null)
        this.activeImpact = res['data'][0];
    })

    this._residualHiraService.getItem().subscribe(res => {
      if(res['risk_residual_analysis']){
        this.activeImpact = res['risk_residual_analysis'].impact;
          this.activeLikelihood = res['risk_residual_analysis'].likelihood;
          this.impactJustification = res['risk_residual_analysis'].impact_justification;
          this.likelihoodJustification = res['risk_residual_analysis'].likelihood_justification;
          if(res['risk_residual_analysis'].process_details?.length>0){
            // this.activeProcess = res['risk_residual_analysis'].process_details[0]?.id;
          }
          this.setActiveImpact(this.activeImpact)
      }
      this._utilityService.detectChanges(this._cdr);
    })

    if(RisksStore.individual_risk_loaded && RisksStore.individualRiskDetails.is_residual_analysis_performed){
      this._residualHiraService.getChartDetails().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    

    this._hiraScoreService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeLikelihood == null)
        this.activeLikelihood = res['data'][0];
    })

    this.getControlEfficiencyData();

    this._riskRatingService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeCancel(item);
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
      this.getControlEfficiencyComparison();

      this._utilityService.detectChanges(this._cdr);
    },2000);

    // NoDataItemStore.setNoDataItems({title: "process_empty_list_message"});
    this.getRiskImpactGuideline()
    this.callLabelFn()
  }

  callLabelFn(){
    if(RisksStore.individualRiskDetails?.risk_classification?.is_risk==1){
      this.rm_risk_description='rm_risk_description'      
      this.risk_causes='risk_causes'
    }else{
      this.rm_risk_description='description'      
      this.risk_causes='causes'
    }
  }

  getRiskImpactGuideline(){
    this._riskImpactGuidelineService.getRiskImpactGuidelines().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeZIndex(){
    if($(this.performPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.performPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.performPopup.nativeElement,'overflow','auto');
    }
  }

  controlLength(process) {
    let count = 0
    if (process && process.length > 0) {
      for (let i of process) {
        if (i.controls && i.controls.length > 0) {
          count++;
          return count;

        }
        
      }
      return count;
    }
    else {
      return count;
    }
  }

  getControlEfficiencyData(){
    this._controlEfficiencyMeasureService.getItems().subscribe(res => {
      if(!(RisksStore?.individualRiskDetails?.is_residual_analysis_performed == 1)){
        for(let i of ResidualRiskStore.residualRiskDetails?.risk_processes){
          if (i.controls?.length > 0) {
            for (let j of i.controls) {
              
              j['efficiency'] = res['data'][0];
            }
          }
        }

        for(let j of ResidualRiskStore.residualRiskDetails?.risk_controls){
          // if (i.controls?.length > 0) {
            // for (let j of i.controls) {
              j['pivot'].updated_control_efficiency_measure_id = res['data'][0]?.id;
              j['pivot'].updated_control_efficiency_measure_title = res['data'][0]?.control_efficiency_measure_title;
              j['pivot'].updated_control_efficiency_measure_score = res['data'][0]?.score;
            // }
          // }
        }
      }
      else{
        for(let i of ResidualRiskStore.residualRiskDetails?.risk_processes){
          if (i.controls?.length > 0) {
            for (let j of i.controls) {
              if(!j.efficiency==null || j.efficiency==null){
                j['efficiency'] = res['data'][0];
              }
              
            }
          }
        }
        for(let j of ResidualRiskStore.residualRiskDetails?.risk_controls){
          if(j.pivot?.updated_control_efficiency_measure_id==null){
            j['pivot'].updated_control_efficiency_measure_id = res['data'][0]?.id;
            j['pivot'].updated_control_efficiency_measure_title = res['data'][0]?.control_efficiency_measure_title;
            j['pivot'].updated_control_efficiency_measure_score = res['data'][0]?.score;
          
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);

    })
  }


  ngAfterViewChecked(){
      // <script>
    //step-form-small starts
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function (event) {
      current_fs = $(this).parent();
      next_fs = $(this).parent().next();
      current_fs.hide(100);
      next_fs.show(100);
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    })

    $(".previous").click(function (event) {
      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();
      current_fs.hide(100);
      previous_fs.show(100);
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    })
    

    // $(".next").click(function (event) {
    //   event.stopPropagation();
    //   event.preventDefault();

    //   if (animating) return false;
    //   animating = true;

    //   current_fs = $(this).parent();
    //   next_fs = $(this).parent().next();

    //   //activate next step on progressbar using the index of next_fs
    //   $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //   //show the next fieldset
    //   next_fs.show();
    //   next_fs.css({
    //     'display':'block'
    //   })
    //   //hide the current fieldset with style
    //   current_fs.animate({
    //     opacity: 0
    //   }, {
    //     step: function (now, mx) {
    //       //as the opacity of current_fs reduces to 0 - stored in "now"
    //       //1. scale current_fs down to 80%
    //       scale = 1 - (1 - now) * 0.2;
    //       //2. bring next_fs from the right(50%)
    //       left = (now * 50) + "%";
    //       //3. increase opacity of next_fs to 1 as it moves in
    //       opacity = 1 - now;
    //       current_fs.css({
    //         'transform': 'scale(' + scale + ')'
    //       });
    //       next_fs.css({
    //         'left': left,
    //         'opacity': opacity
    //       });
    //     },
    //     duration: 500,
    //     complete: function () {
    //       if(current_fs.css('opacity')==0){
    //         current_fs.hide();
    //       }
          
    //       animating = false;
    //     },
    //     //this comes from the custom easing plugin
    //     easing: 'easeOutQuint'
    //   });
    // });

    // $(".previous").click(function (event) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   if (animating) return false;
    //   animating = true;

    //   current_fs = $(this).parent();
    //   previous_fs = $(this).parent().prev();

    //   //de-activate current step on progressbar
    //   $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    //   //show the previous fieldset
    //   previous_fs.show();
      
    //   previous_fs.css({
    //     'display':'block'
    //   })
    //   //hide the current fieldset with style
    //   current_fs.animate({
    //     opacity: 0
    //   }, {
    //     step: function (now, mx) {
    //       //as the opacity of current_fs reduces to 0 - stored in "now"
    //       //1. scale previous_fs from 80% to 100%
    //       scale = 0.8 + (1 - now) * 0.2;
    //       //2. take current_fs to the right(50%) - from 0%
    //       left = ((1 - now) * 50) + "%";
    //       //3. increase opacity of previous_fs to 1 as it moves in
    //       opacity = 1 - now;
    //       current_fs.css({
    //         'left': left
    //       });
    //       previous_fs.css({
    //         'transform': 'scale(' + scale + ')',
    //         'opacity': opacity
    //       });
    //     },
    //     duration: 500,
    //     complete: function () {
    //       if(current_fs.css('opacity')==0){
    //         current_fs.hide();
    //       }
    //       animating = false;
    //     },
    //     //this comes from the custom easing plugin
    //     easing: 'easeOutQuint'
    //   });
    // });

    $(".submit").click(function () {
      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev().prev().prev().prev().prev();
      current_fs.hide(100);
      previous_fs.show(100);
      return false;
    })

  }

  exportResidualRisk(){
    this.openAll=true
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
    reader.onloadend = function() {
      var base64data = reader.result;
      // console.log(base64data);
      pthis.downloadPdf(base64data);
    }
  // var link = document.createElement('a');
  // link.download = `risk-analysis.jpeg`;
  // link.href = dataUrl;
  // link.click();
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
  closeLoaderPopUp(){
    setTimeout(() => {
      $(this.loaderPopUp.nativeElement).modal('hide');
    }, 250);
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
      let value = ResidualRiskStore?.chartDetails?.mitigation_cycle_time;// set store values
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);

    chart.hiddenState.properties.radius = am4core.percent(0);
    // chart.logo.disabled = true;
  }
  
  
  
  getRiskVariation(){
    
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
  "value2": ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score>ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual.risk_analysis.score:0:ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score,
  "value3": ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score<ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual.residual_analysis.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual.residual_analysis.score:0:ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score:0
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
series2.tooltipText =  ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score>ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score?"{valueY.value}(Risk Analysis)":"{valueY.value}(Residual Analysis)";
series2.columns.template.strokeOpacity = 0;
series2.clustered = false;
series2.fill = am4core.color(ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score>ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.color_code:ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.color_code);


let series3 = chart.series.push(new am4charts.CurvedColumnSeries());
series3.dataFields.categoryX = "country";

series3.dataFields.valueY = "value3";
series3.tooltipText = ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score<ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score?"{valueY.value}(Residual analysis)":"{valueY.value}(Risk analysis)";
series3.columns.template.strokeOpacity = 0;
series3.clustered = false;
series3.fill = am4core.color(ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.score<ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis.score?ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.residual_analysis?.color_code:ResidualRiskStore?.chartDetails?.risk_analysis_vs_residual?.risk_analysis?.color_code);


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

// series.columns.template.events.on("parentset", function(event){
//   event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;
// })

// series2.columns.template.events.on("parentset", function(event){
//   event.target.parent = series.columnsContainer;
//   event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;  
// })

// series3.columns.template.events.on("parentset", function(event){
//   event.target.parent = series.columnsContainer;
//   event.target.zIndex = valueAxis.max - event.target.dataItem.valueY;  
// })


    // Themes begin
    // am4core.useTheme(am4themes_animated);



  }

  

  getControlEfficiencyComparison(){
    am4core.addLicense("CH199714744");
    
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
// Themes end



let chart = am4core.create('controlChartdiv', am4charts.XYChart)
chart.colors.step = 2;

chart.legend = new am4charts.Legend()
chart.legend.position = 'top'
chart.legend.paddingBottom = 20
chart.legend.labels.template.maxWidth = 95

let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
xAxis.dataFields.category = 'category'
xAxis.renderer.cellStartLocation = 0.1
xAxis.renderer.cellEndLocation = 0.9
xAxis.renderer.grid.template.location = 0;

let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
yAxis.min = 0;

function createSeries(value, name) {
    let series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.valueY = value
    series.dataFields.categoryX = 'category'
    series.name = name

    series.events.on("hidden", arrangeColumns);
    series.events.on("shown", arrangeColumns);

    let bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.interactionsEnabled = false
    bullet.dy = 30;
    bullet.label.text = '{valueY}'
    bullet.label.fill = am4core.color('#ffffff')
    // chart.colors.list = [am4core.color('red'),am4core.color('green')];

    return series;
}

chart.data = [
    {
        category: 'Place #1',
        first: ResidualRiskStore?.chartDetails?.control_efficiency.old,
        second: ResidualRiskStore?.chartDetails?.control_efficiency.new,
        third:0
        
    },
    
]


// createSeries('first', 'The First');
// createSeries('second', 'The Second');
// createSeries('third', 'The Third');

function arrangeColumns() {

    let series = chart.series.getIndex(0);

    let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
    if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
            let middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each(function(series) {
                if (!series.isHidden && !series.isHiding) {
                    series.dummyData = newIndex;
                    newIndex++;
                }
                else {
                    series.dummyData = chart.series.indexOf(series);
                }
            })
            let visibleCount = newIndex;
            let newMiddle = visibleCount / 2;

            chart.series.each(function(series) {
                let trueIndex = chart.series.indexOf(series);
                let newIndex = series.dummyData;

                let dx = (newIndex - trueIndex + middle - newMiddle) * delta

                series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
        }
    }
}

  }


  getAnalysisScoreClass(ratingScore) {
    for (let i of RiskRatingMasterStore.allItems) {
      var pos=i.risk_rating_values?.findIndex(e=>e==ratingScore)
      if(pos!=-1){
        return i.label;
      }
      // if (ratingScore >= i.score_from && ratingScore <= i.score_to) {
      //   return i.label;
      // }
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

    this._residualHiraService.getItemByProcess(id).subscribe(res=>{

      this.setActiveProcess(id);
      this._utilityService.detectChanges(this._cdr);
    })
  }



  setActiveImpact(impact) {    
    this.activeImpact = impact;    
    this.filterdOptions = RiskImpactGuidelineMasterStore?.RiskRatingImpactGuideline.filter(function(item){
      return item.id==impact.id
    });    
  }

  setActiveLikelihood(likelihood) {
    this.activeLikelihood = likelihood;
  }

  getRiskControls() {
    let riskData = []
    // if(RiskAssessmentStore?.riskAssessmentDetails?.risk_processes){
      for (let i of ResidualRiskStore.residualRiskDetails?.risk_processes) {
        if(!i.controls || i.controls?.length==0){
          riskData.push({process_id:i.process?.process_id,control_id:null,id:i.process?.id})
        }
        else{
          for (let j of i.controls) {
            if(j.control.control?.id){
              riskData.push({ id:j.control?.id,process_id: i.process?.process_id, control_id: j.control?.control.id, control_efficiency_measure_id: j.efficiency?.id });
          
            }
            else{
              riskData.push({ id:j.control?.id,process_id: i.process?.process_id, control_id: j.control?.control_id, control_efficiency_measure_id: j.efficiency?.id });
          
            }
              }
        }
        
      }
      return riskData;
    // }
  }

  getControlArray(){
    let controlData=[];
    for (let i of ResidualRiskStore.residualRiskDetails?.risk_controls) {
      

          controlData.push({control_id: i.id,control_efficiency_measure_id: i.pivot?.updated_control_efficiency_measure_id })
      
    }
    
    return controlData;
  
  }

  submitResidualRisk() {
    AppStore.enableLoading();
    this.formErrors = null;
    let saveData = {
      risk_matrix_impact_id: this.activeImpact.id,
      risk_matrix_likelihood_id: this.activeLikelihood.id,
      risk_controls: this.getRiskControls(),
      controls:this.getControlArray(),
      impact_justification:this.impactJustification,
      likelihood_justification:this.likelihoodJustification
    }

    this._residualHiraService.updateItem(saveData).subscribe(res => {

      AppStore.disableLoading();
      this._residualHiraService.getChartDetails().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })

      setTimeout(() => {
        this.getCompletedPercentageChart();
        this.getRiskVariation();
        this.getControlEfficiencyComparison();
  
        this._utilityService.detectChanges(this._cdr);
      },2000);
  
      this._utilityService.detectChanges(this._cdr);
      this.closePerformPopup();
      // setTimeout(() => {
      // this._router.navigateByUrl('risk-management/risks/' + RisksStore.riskId + '/risk-assessment');
      //}, 100);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        // this.showTab(1);

        this.formErrors = err.error.errors;
        
      }
      else if(err.status == 500 || err.status==403){
        this.closePerformPopup();
        
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  openPopup(){
    // this.popup = true;
    this.getRiskImpactGuideline();
    this.getControlEfficiencyData();
    this._utilityService.detectChanges(this._cdr);
    this.openPerformPopup();
  }

  openPerformPopup(){
    
    
      this._utilityService.detectChanges(this._cdr);
    this._renderer2.setStyle(this.performPopup.nativeElement,'z-index',999999);
    this._renderer2.setStyle(this.performPopup.nativeElement,'overflow','auto');
    setTimeout(() => {
      $(this.performPopup.nativeElement).modal('show');
      this.popup = true;
      // NoDataItemStore.setNoDataItems({title: "Looks like we don't have controls to display here"});
    }, 250);

  }

  closePerformPopup(){
    this.popup = false;
    this.activeProcess = null;
    // NoDataItemStore.setNoDataItems({title: "Looks like we don't have assessment performed to display here", subtitle: 'To perform assessment, Simply tab the button below',buttonText: 'Perform Now'});
    this._utilityService.detectChanges(this._cdr);
    $(this.performPopup.nativeElement).modal('hide');
    this._renderer2.setStyle(this.performPopup.nativeElement,'z-index',0);
    this._renderer2.setStyle(this.performPopup.nativeElement,'overflow','none');
  }
  setActiveControlEfficiency(measure, processIndex, controlIndex?,control?) {
    if(control){
      if (ResidualRiskStore.residualRiskDetails.risk_controls[controlIndex]) {
        ResidualRiskStore.residualRiskDetails.risk_controls[controlIndex].pivot.updated_control_efficiency_measure_id = measure.id;
        ResidualRiskStore.residualRiskDetails.risk_controls[controlIndex].pivot.updated_control_efficiency_measure_title = measure.control_efficiency_measure_title;
        ResidualRiskStore.residualRiskDetails.risk_controls[controlIndex].pivot.updated_control_efficiency_measure_score = measure.score;
      }
    }
    else{
      if (ResidualRiskStore.residualRiskDetails.risk_processes[processIndex].controls[controlIndex]) {
        ResidualRiskStore.residualRiskDetails.risk_processes[processIndex].controls[controlIndex].efficiency = measure;
      
    }
      }
    // else {
      // ResidualRiskStore.residualRiskDetails.risk_processes[processIndex].controls[controlIndex]['activeControlEfficiency'] = measure;

    // }
    this._utilityService.detectChanges(this._cdr);
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
    if(items){
      var result = items.map(function(val) {
        return val;
      }).join(seperator);
      return result;
    }
    
  }

  getRiskClass(type) {
                                                            
    let totalScore=0;
    if(RisksStore.calculationMethod?.is_addition)
    totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_multiplication)
    totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_division){
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score / this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score/this.activeImpact?.score;
    }
    else{
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score - this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score-this.activeImpact?.score;
    }

    // let classType = null;
    // let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
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
                                                            
    let totalScore=0;
    if(RisksStore.calculationMethod?.is_addition)
    totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_multiplication)
    totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    else if(RisksStore.calculationMethod?.is_division){
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score / this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score/this.activeImpact?.score;
    }
    else{
      if(this.activeImpact?.score > this.activeLikelihood?.score)
      totalScore = this.activeImpact?.score - this.activeLikelihood?.score;
      else
      totalScore =this.activeLikelihood?.score-this.activeImpact?.score;
    }

    // let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    var pos=rating.risk_rating_values?.findIndex(e=>e==totalScore);
    if(pos!=-1){
      return rating.label;
    }
  }

  getControlEfficiencyAverage() {
    let scoreTotal = 0;
    let count = 0
    // if (ResidualRiskStore.residualRiskDetails?.risk_processes) {
      for (let i of ResidualRiskStore.residualRiskDetails?.risk_processes) {
        if(i.controls?.length>0){
          for (let j of i.controls) {
            if(j.efficiency?.score>0){
              scoreTotal = scoreTotal + j.efficiency?.score;
              count++;
            }
            
          }
        }
        
      }

      for (let i of ResidualRiskStore.residualRiskDetails?.risk_controls) {
        // if(i.controls?.length>0){
          // for (let j of i.controls) {
            if(i.pivot?.updated_control_efficiency_measure_score>0){
              scoreTotal = scoreTotal + i.pivot?.updated_control_efficiency_measure_score;
              count++;
            }
            
          // }
        // }
        
      }
    // }
    

    return Math.round(scoreTotal / count);
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

  closeCancel(status) {
    
    $(this.cancelPopup.nativeElement).modal('hide');
    if (status) {
      AppStore.disableLoading();
      this.clearCancelObject();
      // NoDataItemStore.unsetNoDataItems(); 
      // NoDataItemStore.setNoDataItems({ title: "Looks like we don't have residual analysis performed to display here", subtitle: 'To perform assessment, Simply tab the button below', buttonText: 'Perform Now' });
      this._utilityService.detectChanges(this._cdr);
      this.closePerformPopup();
      
    }
    else {
      this.clearCancelObject();
    }
    // setTimeout(() => {
    
    // }, 250);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    NoDataItemStore.unsetNoDataItems();
    if(this.reactionDisposer)this.reactionDisposer();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    RiskAssessmentStore.unsetAssessmentDetails();
    
  }

}
