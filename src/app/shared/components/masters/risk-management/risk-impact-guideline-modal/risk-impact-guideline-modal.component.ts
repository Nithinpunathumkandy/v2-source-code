import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskImpactGuidelineService } from 'src/app/core/services/masters/risk-management/risk-impact-guideline/risk-impact-guideline.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskImpactGuidelineMasterStore } from 'src/app/stores/masters/risk-management/risk-impact-guideline-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';

@Component({
  selector: 'app-risk-impact-guideline-modal',
  templateUrl: './risk-impact-guideline-modal.component.html',
  styleUrls: ['./risk-impact-guideline-modal.component.scss']
})
export class RiskImpactGuidelineModalComponent implements OnInit {

	@Input('source') RiskImpactGuidelineSource: any;

	RiskImpactGuidelineMasterStore = RiskImpactGuidelineMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  RiskCategoryMasterStore = RiskCategoryMasterStore;
  ImpactStore = ImpactStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
	constructor(
		private _riskImpactGuidelineService: RiskImpactGuidelineService,
    private _riskRatingService: RiskRatingService,
    private _riskCategoryService:RiskCategoryService,
		private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
		private _impactService: ImpactService
	) { }

	ngOnInit(): void {
		// Form Object to add Control Category

		this.form = this._formBuilder.group({
			id: [''],
			description: ['', [Validators.required]],
			risk_matrix_impact_id:['', [Validators.required]],
      risk_category_id:['', [Validators.required]],
		});

		// restingForm on initial load
		this.resetForm();

		// Checking if Source has Values and Setting Form Value

		if (this.RiskImpactGuidelineSource) {
			this.setFormValues();
		}
    this.getRiskImpact();
    this.getCategory();
	}
	ngDoCheck() {
		if (this.RiskImpactGuidelineSource && this.RiskImpactGuidelineSource.hasOwnProperty('values') && this.RiskImpactGuidelineSource.values && !this.form.value.id)
			this.setFormValues();
	}

	setFormValues() {
		if (this.RiskImpactGuidelineSource.hasOwnProperty('values') && this.RiskImpactGuidelineSource.values) {
			let { id, risk_matrix_impact_id,risk_category_id, description } = this.RiskImpactGuidelineSource.values
			this.form.setValue({
				id: id,
				risk_matrix_impact_id: risk_matrix_impact_id,
        risk_category_id:risk_category_id,
				description: description
			})
		}
	}

  getRiskImpact() {
    this._impactService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRiskCategory(e,patchValue:boolean=false){
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRiskImpact(e,patchValue:boolean=false) {
	this._impactService.getItems(false, 'q=' + e.term).subscribe(res => {
		this._utilityService.detectChanges(this._cdr);
	  })
  }

  getCategory(){
    this._riskCategoryService.getItems(false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

	// for resetting the form
	resetForm() {
		this.form.reset();
		this.form.pristine;
		this.formErrors = null;
		AppStore.disableLoading();
	}


	// cancel modal
	cancel() {
		// FormErrorStore.setErrors(null);
		this.closeFormModal();


	}
	// getting description count

	getDescriptionLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.form.value.description.replace(regex, "");
		return result.length;
	}

	// for closing the modal
	closeFormModal() {
		this.resetForm();
		this._eventEmitterService.dismissRiskImpactGuidelineControlModal();
	}


	save(close: boolean = false) {
		this.formErrors = null;
		if (this.form.value) {
			let save;
			AppStore.enableLoading();

			if (this.form.value.id) {
				save = this._riskImpactGuidelineService.updateItem(this.form.value.id, this.form.value);
			} else {
				delete this.form.value.id
				save = this._riskImpactGuidelineService.saveItem(this.form.value);
			}

			save.subscribe((res: any) => {
				this.RiskImpactGuidelineMasterStore.lastInsertedId = res.id
				if (!this.form.value.id) {
					this.resetForm();
				}
				AppStore.disableLoading();
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				if (close) this.closeFormModal();
			}, (err: HttpErrorResponse) => {
				if (err.status == 422) {
					this.formErrors = err.error.errors;
				}
				else if (err.status == 500 || err.status == 403) {
					this.closeFormModal();
				}
				AppStore.disableLoading();
				this._utilityService.detectChanges(this._cdr);

			});
		}
	}

	@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

		if(event.key == 'Escape' || event.code == 'Escape'){     
	
			this.cancel();
	
		}
	
	  }

	//getting button name by language
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}
