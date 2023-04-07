import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BiaCategoryService } from 'src/app/core/services/bcm/bia-category/bia-category.service';
import { BcmRiskAssessmentService } from 'src/app/core/services/bcm/risk-assessment/bcm-risk-assessment.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { BcmResidualRiskStore } from 'src/app/stores/bcm/risk-assessment/bcm-residual-risk.store';
import { BcmResidualRisksService } from 'src/app/core/services/bcm/bcm-residual-risks/bcm-residual-risks.service';
import { RiskManagementSettingsService } from 'src/app/core/services/settings/organization_settings/risk-management-settings/risk-management-settings.service';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  selector: 'app-bcm-risk-assessment-modal',
  templateUrl: './bcm-risk-assessment-modal.component.html',
  styleUrls: ['./bcm-risk-assessment-modal.component.scss']
})
export class BcmRiskAssessmentModalComponent implements OnInit {

  @Input('source') bcpSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  ImpactStore = ImpactStore;
  LikelihoodStore = LikelihoodStore;
  BiaCategoryStore = BiaCategoryStore;
  BcmResidualRiskStore = BcmResidualRiskStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  BcmRiskAssessmentStore = BcmRiskAssessmentStore

  currentTab = 0;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
  activeImpact = null;
  activeLikelihood = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  categoryItems = []
  comments = ''
  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  };
  impactJustification = '';
  likelihoodJustification = '';
  filterdOptions = [];
  cancelEventSubscription: any;
  reactionDisposer: any;
  formErrors = null;

  public rm_risk_description:string='rm_risk_description'	
	public risk_causes:string='risk_causes'
  downloadMessage: string = 'downloading';
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

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService, private _bcmRiskAssessmentService: BcmRiskAssessmentService,
    private _helperService: HelperServiceService, private _biaCategoryService: BiaCategoryService,
    private _utilityService: UtilityService, private _http: HttpClient, private _likelihoodService: LikelihoodService,
    private _renderer2: Renderer2, private _router: Router, private _impactService: ImpactService,
    private _riskManagementSettingsService: RiskManagementSettingsService,private _riskImpactGuidelineService:RiskImpactGuidelineService,
    private _residualRiskService: BcmResidualRisksService,) { }

  ngOnInit(): void {

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.organisationChangeFormModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.organisationChangeFormModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'overflow', 'auto');
      }
    })

    setTimeout(() => {
      this.showTab(this.currentTab);
      this._utilityService.detectChanges(this._cdr);
    }, 250);
    // <script>
    //step-form-small starts
    // var current_fs, next_fs, previous_fs; //fieldsets
    // var left, opacity, scale; //fieldset properties which we will animate
    // var animating; //flag to prevent quick multi-click glitches

    // $(".next").click(function () {
    //   if (animating) return false;
    //   animating = true;

    //   current_fs = $(this).parent();
    //   next_fs = $(this).parent().next();

    //   //activate next step on progressbar using the index of next_fs
    //   $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //   //show the next fieldset
    //   next_fs.show();
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
    //       current_fs.hide();
    //       animating = false;
    //     },
    //     //this comes from the custom easing plugin
    //     easing: 'easeOutQuint'
    //   });
    // });

    // $(".previous").click(function () {
    //   if (animating) return false;
    //   animating = true;

    //   current_fs = $(this).parent();
    //   previous_fs = $(this).parent().prev();

    //   //de-activate current step on progressbar
    //   $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //   //show the previous fieldset
    //   previous_fs.show();
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
    //       current_fs.hide();
    //       animating = false;
    //     },
    //     //this comes from the custom easing plugin
    //     easing: 'easeOutQuint'
    //   });
    // });

    // $(".submit").click(function () {
    //   return false;
    // })
    this._riskManagementSettingsService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
    if (BcmRiskAssessmentStore?.bcmRiskDetails?.is_analysis_performed == 1) {
      this._bcmRiskAssessmentService.getRiskAssessment(BcmRiskAssessmentStore.selectedId).subscribe(res => {

        this.activeImpact = res['risk_analysis'].impact;
        this.activeLikelihood = res['risk_analysis'].likelihood;
        this.impactJustification = res['risk_analysis'].impact_justification;
        this.likelihoodJustification = res['risk_analysis'].likelihood_justification;
        // if (res['risk_analysis'].process_details && res['risk_analysis'].process_details?.length>0) {
        //   this.openProcess(res['risk_analysis'].process_details[0]?.id)
        // }

        this.setActiveImpact(this.activeImpact)
        this._utilityService.detectChanges(this._cdr);
      })
    }
    ImpactStore.orderBy = "desc";
    LikelihoodStore.orderBy = "desc";
    ImpactStore.orderItem = "score";
    LikelihoodStore.orderItem = "score";
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeImpact == null)
        this.activeImpact = res['data'][0];
        this.setActiveImpact(this.activeImpact)

    })

    this._likelihoodService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      if (this.activeLikelihood == null)
        this.activeLikelihood = res['data'][0];
    })
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.closeCancel(item);
    })
    this.getRiskImpactGuideline();
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
   $(".submit").click(function () {
    return false;
  })

  }

  getRiskImpactGuideline(){
    this._riskImpactGuidelineService.getRiskImpactGuidelines().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getFormatedValue(seperator, items) {
    var result = items.map(function (val) {
      return val;
    }).join(seperator);
    return result;
  }

  getScoreClass(rating) {
    // if(rating.risk_rating_values){
    //   let classType = null;
    //   let totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    //   var pos = rating.risk_rating_values?.findIndex(e => e == total);
    //   if (pos != -1) {
    //     return rating.label
    //   }
    // }
    // else return '';

    if(rating.risk_rating_values){
      let classType = null;
                                                             
    let totalScore=0;
    if(BcmRiskAssessmentStore.calculationMethod?.is_addition)
    totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
    else if(BcmRiskAssessmentStore.calculationMethod?.is_multiplication)
    totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
    else if(BcmRiskAssessmentStore.calculationMethod?.is_division){
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
      var pos = rating.risk_rating_values?.findIndex(e => e == totalScore);
      if (pos != -1) {
        return rating.label
      }
    }
    else return '';
  }

  getOwnerPopupDetails(user) {
    if (user) {
      this.ownerDetailObject.first_name = user.first_name;
      this.ownerDetailObject.last_name = user.last_name;
      this.ownerDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.ownerDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.ownerDetailObject.email = user.email;
      this.ownerDetailObject.mobile = user.mobile;
      this.ownerDetailObject.id = user.id;
      this.ownerDetailObject.department = user.department?.title ? user.department?.title : null;
      this.ownerDetailObject.status_id = user.status_id ? user.status_id : 1;
      return this.ownerDetailObject;
    }

  }

  // callLabelFn(){
  //   if(BcmRiskAssessmentStore.individualRiskDetails?.risk_classification?.is_risk==1){
  //     this.rm_risk_description='rm_risk_description'      
  //     this.risk_causes='risk_causes'
  //   }else{
  //     this.rm_risk_description='description'      
  //     this.risk_causes='causes'
  //   }
  // }

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

  getRiskClass(type) {
    // for (let rating of RiskRatingMasterStore.allItems) {
    //   var pos = rating.risk_rating_values?.findIndex(e => e == total);
    //   if (pos != -1) {
    //     if (type)
    //       return rating.title;
    //     else
    //       return rating.label;
    //   }
    // }
      // let classType = null;
      // ({{?activeImpact.score+activeLikelihood.score:BcmRiskAssessmentStore.calculationMethod?.is_multiplication?activeImpact.score*activeLikelihood.score:BcmRiskAssessmentStore.calculationMethod?.is_substraction?activeImpact.score>activeLikelihood.score?activeImpact.score-activeLikelihood.score:activeLikelihood.score-activeImpact.score:activeLikelihood.score>activeImpact.score?activeLikelihood.score/activeImpact.score:activeImpact.score/activeLikelihood.score}})
                                                            
      let totalScore=0;
      if(BcmRiskAssessmentStore.calculationMethod?.is_addition)
      totalScore = this.activeImpact?.score + this.activeLikelihood?.score;
      else if(BcmRiskAssessmentStore.calculationMethod?.is_multiplication)
      totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
      else if(BcmRiskAssessmentStore.calculationMethod?.is_division){
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
  
     
      // if(BcmRiskAssessmentStore.calculationMethod?.is_addition)
      // totalScore = this.activeImpact?.score * this.activeLikelihood?.score;
      for (let rating of RiskRatingMasterStore.allItems) {
        var pos = rating.risk_rating_values?.findIndex(e => e == totalScore);
        if (pos != -1) {
          if (type)
            return rating.title;
          else
            return rating.label;
        }
      }
    
  }

  returnHighestExposure(type:boolean=true){
    if(ImpactStore.impactDetails && ImpactStore.loaded){
      var score = null //ImpactStore.impactDetails[0]?.score
      var likelihood = LikelihoodStore.likelihoodDetails[0]?.score
      var total = null //ImpactStore.impactDetails[0]?.score*LikelihoodStore.likelihoodDetails[0]?.score
      var title = null //ImpactStore.impactDetails[0]?.risk_matrix_impact_title
      
      for (let i = 0; i < this.categoryItems.length; i++) {
        const element = this.categoryItems[i];
        var pos = ImpactStore.impactDetails.findIndex(e=>e.id==element.risk_matrix_impact_id)
        var pos1 = LikelihoodStore.likelihoodDetails.findIndex(e=>e.id==element.risk_matrix_likelihood_id)
        if(score<ImpactStore.impactDetails[pos]?.score){
          score = ImpactStore.impactDetails[pos]?.score
          title = ImpactStore.impactDetails[pos]?.risk_matrix_impact_title
        }
        if(total<(ImpactStore.impactDetails[pos]?.score*LikelihoodStore.likelihoodDetails[pos1]?.score)){
          total = ImpactStore.impactDetails[pos]?.score*LikelihoodStore.likelihoodDetails[pos1]?.score
        }
      }
      return total
    }
  }

  returnExposureText(category,type){
    
    if(type=='category'){
      var pos = BiaCategoryStore.BiaCategoryDetails.findIndex(e=>e.id==category.bia_impact_category_id)
      return BiaCategoryStore.BiaCategoryDetails[pos]?.title
    }
    if(type=='impact'){
      var pos = ImpactStore.impactDetails.findIndex(e=>e.id==category.risk_matrix_impact_id)
      return ImpactStore.impactDetails[pos]?.risk_matrix_impact_title
    }
    if(type=='impact_count'){
      var pos = ImpactStore.impactDetails.findIndex(e=>e.id==category.risk_matrix_impact_id)
      return ImpactStore.impactDetails[pos]?.score
    }
    if(type=='likelihood_count'){
      var pos = LikelihoodStore.likelihoodDetails.findIndex(e=>e.id==category.risk_matrix_impact_id)
      return LikelihoodStore.likelihoodDetails[pos]?.score
    }
    if(type=='total'){
      var pos1 = ImpactStore.impactDetails.findIndex(e=>e.id==category.risk_matrix_impact_id)
      var pos = LikelihoodStore.likelihoodDetails.findIndex(e=>e.id==category.risk_matrix_likelihood_id)
      var total = ImpactStore.impactDetails[pos1]?.score*LikelihoodStore.likelihoodDetails[pos]?.score
      return total
    }
  }

  setInitialOptionValue(){
    BiaCategoryStore.BiaCategoryDetails.forEach(res=>{
      var obj = new Object
      obj['bia_impact_category_id'] = res.id;
      obj['risk_matrix_impact_id'] = ImpactStore.impactDetails[0].id
      obj['risk_matrix_likelihood_id'] = LikelihoodStore.likelihoodDetails[0].id
      this.categoryItems.push(obj)
    })
  }

  setCategoryValues(){
    this.categoryItems = []
    if(this.bcpSource.component=='risk_treatment'){
      if(BcmResidualRiskStore.residualRiskDetails.risk_residual_analysis){
        this.comments = BcmResidualRiskStore.residualRiskDetails.risk_residual_analysis.comments
        BcmResidualRiskStore.residualRiskDetails.risk_residual_analysis.risk_impact_category_analyses.forEach(res=>{
          var obj = new Object
          obj['bia_impact_category_id'] = res.bia_impact_category_id;
          obj['risk_matrix_impact_id'] = res.risk_matrix_impact_id
          obj['risk_matrix_likelihood_id'] = res.risk_matrix_likelihood_id
          this.categoryItems.push(obj)
        })
      }else{
        this.setInitialOptionValue()
      }
    }else{
      if(BcmRiskAssessmentStore.bcmRiskAnalysis.risk_analysis){
        this.comments = BcmRiskAssessmentStore.bcmRiskAnalysis.risk_analysis.comments
        BcmRiskAssessmentStore.bcmRiskAnalysis.risk_analysis.risk_impact_category_analyses.forEach(res=>{
          var obj = new Object
          obj['bia_impact_category_id'] = res.bia_impact_category_id;
          obj['risk_matrix_impact_id'] = res.risk_matrix_impact_id
          obj['risk_matrix_likelihood_id'] = res.risk_matrix_likelihood_id
          this.categoryItems.push(obj)
        })
      }else{
        this.setInitialOptionValue()
      }
    }
  }

  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'Cancel assessment Creation?';
    this.cancelObject.subtitle = 'assessment_cancel_confirmation';
    $(this.cancelPopup.nativeElement).modal('show');
  }

  getAssessment(newPage: number = null) {
    if(this.bcpSource.component=='risk_treatment'){
      this._residualRiskService.getItem().subscribe(res=>{
        this.setCategoryValues()
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this._bcmRiskAssessmentService.getRiskAssessment(BcmRiskAssessmentStore.selectedId).subscribe(res=>{
        this.setCategoryValues()
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  savePerformAssessment(){
    AppStore.enableLoading();
    this.formErrors = null;
    let saveData = {
      risk_matrix_impact_id: this.activeImpact.id,
      risk_matrix_likelihood_id: this.activeLikelihood.id,
      impact_justification: this.impactJustification,
      likelihood_justification: this.likelihoodJustification
    }
   
    if(this.bcpSource.component=='risk_treatment'){
      this._residualRiskService.updateItem(saveData).subscribe(res=>{
        AppStore.disableLoading();
        this.cancel();
        this._utilityService.detectChanges(this._cdr);
      }, 
      (err: HttpErrorResponse) => {
        this.cancel();
        AppStore.disableLoading();
        if (err.status == 422) {
          this.showTab(1);
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
  
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }else{
      this._bcmRiskAssessmentService.saveRiskAssessment(BcmRiskAssessmentStore.selectedId,saveData).subscribe(res=>{
        AppStore.disableLoading();
        this.cancel();
        this._utilityService.detectChanges(this._cdr);
      }, 
      (err: HttpErrorResponse) => {
        this.cancel();
        AppStore.disableLoading();
        if (err.status == 422) {
          this.showTab(1);
  
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
  
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
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
      NoDataItemStore.unsetNoDataItems();
      NoDataItemStore.setNoDataItems({ title: "assessment_empty_message", subtitle: 'assessment_subtitle', buttonText: 'perform_now' });
      this._utilityService.detectChanges(this._cdr);
      this.cancel()
    }
    else {
      this.clearCancelObject();
    }
  }

  setActiveImpact(impact) {
    this.activeImpact = impact;
    this.filterdOptions = RiskImpactGuidelineMasterStore?.RiskRatingImpactGuideline.filter(function(item){
      return item.id==impact.id
    });
    // if(this.categoryItems && this.categoryItems.length!=0){
    //   var pos = this.categoryItems.findIndex(e=>e.bia_impact_category_id==cat_id)
    //   if(pos!=-1){
    //     this.categoryItems[pos]['risk_matrix_impact_id'] = impact.id
    //   }else{
    //     var obj = new Object
    //     obj['bia_impact_category_id'] = cat_id;
    //     obj['risk_matrix_impact_id'] = impact.id
    //     this.categoryItems.push(obj)
    //   }
    // }else{
    //   var obj = new Object
    //   obj['bia_impact_category_id'] = cat_id;
    //   obj['risk_matrix_impact_id'] = impact.id
    //   this.categoryItems.push(obj)
    // }
  }

  setActiveLikelihood(likelihood) {
    this.activeLikelihood = likelihood;
    // if(this.categoryItems && this.categoryItems.length!=0){
    //   var pos = this.categoryItems.findIndex(e=>e.bia_impact_category_id==cat_id)
    //   if(pos!=-1){
    //     this.categoryItems[pos]['risk_matrix_likelihood_id'] = likelihood.id
    //   }else{
    //     var obj = new Object
    //     obj['bia_impact_category_id'] = cat_id;
    //     obj['risk_matrix_likelihood_id'] = likelihood.id
    //     this.categoryItems.push(obj)
    //   }
    // }else{
    //   var obj = new Object
    //   obj['bia_impact_category_id'] = cat_id;
    //   obj['risk_matrix_likelihood_id'] = likelihood.id
    //   this.categoryItems.push(obj)
    // }
  }

  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }


    // Hide the current tab:
    // x[this.currentTab]?.style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      // x[this.currentTab].style.display = "block";
      // this.submitForm();

      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }


  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn")) document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      // this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getBiaCategory(newPage: number = null) {
    this._biaCategoryService.getItems(false,'first_rating_only=true',true).subscribe(res=>{
      
      this._utilityService.detectChanges(this._cdr);
    })

  }

  cancel(){
    this.currentTab = 0;
    this.categoryItems = [];
    this._eventEmitterService.dismissbcmRiskAssessmentModal();
  }

  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();

  }

}
