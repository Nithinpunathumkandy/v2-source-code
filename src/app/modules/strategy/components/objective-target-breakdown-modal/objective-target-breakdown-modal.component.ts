import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ObjectiveService } from 'src/app/core/services/masters/strategy/objective/objective.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-objective-target-breakdown-modal',
  templateUrl: './objective-target-breakdown-modal.component.html',
  styleUrls: ['./objective-target-breakdown-modal.component.scss']
})
export class ObjectiveTargetBreakdownModalComponent implements OnInit {

  objectiveTargetForm: FormGroup;
  StrategyStore = StrategyStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  formErrors : any ;
  inputError:boolean = false;
  inputIndex:any;
  AppStore = AppStore;
  reviewFrequency = [];
  pipe = new DatePipe('en-US');

  strategyModalObject = {
    type: null,
    value: null
  };
  
  constructor(private _service : StrategyService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.objectiveTargetForm=this._formBuilder.group({
      strategy_profile_objective_id:null,
      review_frequencies: [[]],
    });
    this.getObjective();
    this.getObjectiveTarget();
  }

  getObjective(){
    this._service.induvalObjectives(StrategyStore.objectiveId,StrategyStore.focusAreaId).subscribe(()=>this._utilityService.detectChanges(this._cdr));
  }
  getObjectiveTarget(){
    this._service.getObjectiveTargetBreakdown().subscribe(()=>{
      this.setInitialReviewFrequencies();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setInitialReviewFrequencies() {
    let revFreq = StrategyStore.getObjectiveTargetBreakdown?.strategy_profile_objective_review_frequency_targets;
    let revFrequency;
    for (let item of revFreq) {
      revFrequency = {
        id: item?.id,
        target: item.target,
        next_review_user_level: 1
      }
      this.reviewFrequency.push(revFrequency);
    }
  }

  save(){
    let save 
      save = this._service.updateObjectiveTargetBreakdown(this.objectiveTargetData());

      save.subscribe(res=>{
       this.cancel();
       AppStore.disableLoading();
      }, (err: HttpErrorResponse) => {
       if (err.status == 422) {
         this.formErrors = err.error.errors;}
         else if(err.status == 500 || err.status == 403){
          this.cancel();
         }
         AppStore.disableLoading();
         this._utilityService.detectChanges(this._cdr);
       
     })
  }

  cancel(){
    AppStore.disableLoading();
    this._eventEmitterService.dismissStrategyObjectiveModal();
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  objectiveTargetData(){

    let saveData = {
      strategy_profile_objective_id:StrategyStore.objectiveId,
      review_frequencies:this.reviewFrequency
    }
    return saveData;
  }

  reviewFrequencyChange(item,value,index){
    if(StrategyStore.getObjectiveTargetBreakdown?.aggregation_type_id == 2 && value > 100)
    this.inputError = true;
    else
    this.inputError = false;

    this.inputIndex = index;
    let revFrequency={
      id:item?.id,
      target:value ? value : '0',
      next_review_user_level: 1
    }
    for (let i = 0; i < this.reviewFrequency?.length; i++) {
      if (item?.id == this.reviewFrequency[i]?.id) {
        this.reviewFrequency.splice(i, 1);
      }
    }
    this.reviewFrequency.push(revFrequency);
  }

  previous(){
    AppStore.disableLoading();
    this._service.induvalObjectives(StrategyStore.objectiveId, null).subscribe(res => {
      this.strategyModalObject.value = res;
      this.strategyModalObject.type = "Edit"
      this._eventEmitterService.dismissObjectiveTargetBreakDownModalControl(this.strategyModalObject);
      this._utilityService.detectChanges(this._cdr);
    }) 
  }
}
