import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { IsmsImpactStore } from 'src/app/stores/isms/isms-risk-configuration/isms-impact.store';
import { IsmsLikelihoodStore } from 'src/app/stores/isms/isms-risk-configuration/isms-likelihood.store';
import { IsmsRiskScoreStore } from 'src/app/stores/isms/isms-risk-configuration/isms-risk-score.store';
import { IsmsRiskRatingMasterStore } from 'src/app/stores/masters/Isms/isms-risk-rating-master-store';
import { IsmsRiskScoreService } from 'src/app/core/services/isms/isms-risk-configuration/isms-risk-score/isms-risk-score.service';
import { IsmsImpactService } from 'src/app/core/services/isms/isms-risk-configuration/isms-impact/isms-impact.service';
import { IsmsLikelihoodService } from 'src/app/core/services/isms/isms-risk-configuration/isms-likelihood/isms-likelihood.service';
import { IsmsRiskRatingService } from 'src/app/core/services/masters/Isms/isms-risk-rating/isms-risk-rating.service';
import { IsmsRiskMatrixCalculationMethodService } from 'src/app/core/services/masters/Isms/isms-risk-matrix-calculation-method/isms-risk-matrix-calculation-method.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskImpactGuidelineMasterStore } from 'src/app/stores/masters/isms/isms-risk-impact-guideline-store';
import { IsmsRiskImpactGuidelineService } from 'src/app/core/services/masters/isms/isms-risk-impact-guiedeline/isms-risk-impact-guideline.service';

@Component({
  selector: 'app-isms-risk-matrix',
  templateUrl: './isms-risk-matrix.component.html',
  styleUrls: ['./isms-risk-matrix.component.scss']
})
export class IsmsRiskMatrixComponent implements OnInit {
  ImpactStore = IsmsImpactStore;
  LikelihoodStore = IsmsLikelihoodStore;
  IsmsRiskScoreStore = IsmsRiskScoreStore;
  AppStore = AppStore;
  RiskRatingMasterStore = IsmsRiskRatingMasterStore;
  AuthStore = AuthStore;
  OrganizationModulesStore = OrganizationModulesStore;
  activeTab='';
  IsmsRisksStore = IsmsRisksStore;
  IsmsRiskImpactGuidelineMasterStore = IsmsRiskImpactGuidelineMasterStore
  // scoreArray=[];
  

  constructor(private _router:Router,
    private _riskMatrixCalculationMethodService:IsmsRiskMatrixCalculationMethodService,
    private _riskScoreService:IsmsRiskScoreService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _impactService:IsmsImpactService,
    private _likelihoodService:IsmsLikelihoodService,
    private _riskRatingService:IsmsRiskRatingService,
		private _IsmsRiskImpactGuidelineService: IsmsRiskImpactGuidelineService,) { }

  ngOnInit(): void {
    this.ImpactStore.orderBy = "asc";
    this.ImpactStore.orderItem="isms_risk_matrix_impacts.score";
    this.LikelihoodStore.orderBy = "asc";
    this.LikelihoodStore.orderItem = "isms_risk_matrix_likelihoods.score";
    AppStore.showDiscussion = false;
    NoDataItemStore.setNoDataItems({ title: "no_matrix_configuration_data"});
    
    this._impactService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskScoreService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

    this._likelihoodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this._riskRatingService.getItems().subscribe(res=>{
      // for(let i of IsmsImpactStore?.impactDetails){
      //   for(let j of IsmsLikelihoodStore.likelihoodDetails){
      //     let pos= this.scoreArray.findIndex(e=>e==i.score*j.score);
      //     if(pos==-1)
      //     this.scoreArray.push(i.score*j.score);
      //   }
      // }
      // this.scoreArray.sort((a, b) => a - b);
      this._utilityService.detectChanges(this._cdr);
    })
    this.getCalculationMethod();
    this.getIsmsRiskImpactGuidlines();
   
  }
  getIsmsRiskImpactGuidlines(){
		this._IsmsRiskImpactGuidelineService.getIsmsRiskImpactGuidelines().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
    console.log(IsmsRiskImpactGuidelineMasterStore?.IsmsRiskRatingImpactGuideline);
    
	}

  gotoConfiguration(){
    this._router.navigateByUrl('isms/isms-risk-configuration');
  }

  setActiveTab(type){
    if(this.activeTab==type){
      this.activeTab='';
    }
    else{
      this.activeTab=type;
    }
  }

    getFormatedValue(seperator,items){
    var result = items.map(function(val) {
      return val;
    }).join(seperator);
    return result;
  }

  getCalculationMethod(){
    this._riskMatrixCalculationMethodService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      for(let i of res['data']){
        if(i.is_selected){
          IsmsRisksStore.calculationMethod = i;
        }
      }
      // this.calculationMethod=res['data'][0].id;
    })
  
  }

}
