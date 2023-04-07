import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectRiskService } from 'src/app/core/services/project-monitoring/project-risk/project-risk.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { RiskStore } from 'src/app/stores/project-monitoring/project-risk-store';

@Component({
  selector: 'app-add-project-risk',
  templateUrl: './add-project-risk.component.html',
  styleUrls: ['./add-project-risk.component.scss']
})
export class AddProjectRiskComponent implements OnInit {
  @Input('source') RiskSource: any;

  RiskStore = RiskStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  RiskRatingMasterStore= RiskRatingMasterStore;

  constructor(
    private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _projectService : ProjectMonitoringService,
    private _projectRiskService : ProjectRiskService,
    private _riskRatingService: RiskRatingService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			risk_rating_id : null,
      risk_resolving_plan : null,
			title: ['', [Validators.required, Validators.maxLength(255)]],
    });
      if(this.RiskSource.type =="Edit"){
        this.editData()
      }
      this.getRiskRating()
    }

  getRiskRating(){
    this._riskRatingService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  editData(){
     let risk_rating = {
       title : this.RiskSource.value.risk_rating_title,
       color_code : this.RiskSource.value.color_code,
       id : this.RiskSource.value.risk_rating_id
     }
     this.form.patchValue({
      title: this.RiskSource.value.title ? this.RiskSource.value.title : null,
      risk_rating_id : this.RiskSource.value.risk_rating_id ? this.RiskSource.value.risk_rating_id : null,
      risk_resolving_plan : this.RiskSource.value.risk_resolving_plan ?this.RiskSource.value.risk_resolving_plan : null,

    })
   }
  
   processSaveData() {
    let saveData = {
      title : this.form.value.title ? this.form.value.title : null,
      risk_rating_id : this.form.value.risk_rating_id ? this.form.value.risk_rating_id : null,
      risk_resolving_plan : this.form.value.risk_resolving_plan ?this.form.value.risk_resolving_plan : null,
    }
    
    return saveData;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.RiskSource.type == "Edit") {
        save = this._projectRiskService.updateRisk(this.processSaveData(), this.RiskSource.value.id);
      } else {
        save = this._projectRiskService.saveRisk(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.formErrors = null;
  }

  cancel(){
    this._eventEmitterService.dismissProjectRiskModal();
   }

getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}
  

}
