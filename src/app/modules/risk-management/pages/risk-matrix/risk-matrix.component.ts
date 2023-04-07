import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { LikelihoodService } from 'src/app/core/services/risk-management/risk-configuration/likelihood/likelihood.service';
import { RiskScoreService } from 'src/app/core/services/risk-management/risk-configuration/risk-score/risk-score.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
import { RiskMatrixCalculationMethodService } from 'src/app/core/services/masters/risk-management/risk-matrix-calculation-method/risk-matrix-calculation-method.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Component({
	selector: 'app-risk-matrix',
	templateUrl: './risk-matrix.component.html',
	styleUrls: ['./risk-matrix.component.scss']
})
export class RiskMatrixComponent implements OnInit {
	ImpactStore = ImpactStore;
	LikelihoodStore = LikelihoodStore;
	RiskScoreStore = RiskScoreStore;
	AppStore = AppStore;
	RiskRatingMasterStore = RiskRatingMasterStore;
	AuthStore = AuthStore;
	OrganizationModulesStore = OrganizationModulesStore;
	RiskImpactGuidelineMasterStore = RiskImpactGuidelineMasterStore;
	RisksStore = RisksStore;
	activeTab = '';


	constructor(private _router: Router,
		private _riskScoreService: RiskScoreService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _impactService: ImpactService,
		private _likelihoodService: LikelihoodService,
		private _riskRatingService: RiskRatingService,
		private _riskImpactGuidelineService: RiskImpactGuidelineService,
		private _riskMatrixCalculationMethodService:RiskMatrixCalculationMethodService) { }

	ngOnInit(): void {
		ImpactStore.orderBy = "asc";
		ImpactStore.orderItem = "score";
		LikelihoodStore.orderItem = "score";
		AppStore.showDiscussion = false;
		NoDataItemStore.setNoDataItems({ title: "no_matrix_configuration_data" });

		this.getCalculationMethod();

		this._impactService.getItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
		this._riskScoreService.getItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

		this._likelihoodService.getItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
		this._riskRatingService.getItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
		this.getRiskImpactGuidlines();
	}

	getRiskImpactGuidlines(){
		this._riskImpactGuidelineService.getRiskImpactGuidelines().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	gotoConfiguration() {
		this._router.navigateByUrl('risk-management/risk-configuration');
	}

	setActiveTab(type) {
		if (this.activeTab == type) {
			this.activeTab = '';
		}
		else {
			this.activeTab = type;
		}
	}

	getFormatedValue(seperator, items) {
		if(items){
			var result = items.map(function (val) {
				return val;
			}).join(seperator);
			return result;
		}
		
	}

	getCalculationMethod(){
		this._riskMatrixCalculationMethodService.getItems(false,'is_active=true').subscribe(res=>{
		  this._utilityService.detectChanges(this._cdr);
		  let pos = res['data'].findIndex(e=>e.is_selected);
		  if(pos>-1)
		  RisksStore.calculationMethod = res['data'][pos];
	   
		})
	  }

}
