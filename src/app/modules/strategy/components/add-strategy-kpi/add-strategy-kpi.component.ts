import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service'
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store';
import { StrategyKpiDataTypesService } from 'src/app/core/services/masters/strategy/strategy-kpi-data-types/strategy-kpi-data-types.service';
import { StrategyKpiDataTypesMasterStore } from 'src/app/stores/masters/strategy/strategy-kpi-data-types-store';
import { KpiCalculationTypesService } from 'src/app/core/services/masters/strategy/kpi-calculation-types/kpi-calculation-types.service';
import { KpiCalculationTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-calculation-type.store';
import { StrategyInitiativeReviewFrequencyService } from 'src/app/core/services/masters/strategy/strategy-initiative-review-frequencies/strategy-initiative-review-frequencies.service';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { StrategyInitiativeReviewFrequencyMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import * as moment from 'moment';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { AggregationTypesService } from 'src/app/core/services/masters/strategy/aggregation-types/aggregation-types.service';
import { AggregationTypesMasterStore } from 'src/app/stores/masters/strategy/aggregation-types.store';

@Component({
  selector: 'app-add-strategy-kpi',
  templateUrl: './add-strategy-kpi.component.html',
  styleUrls: ['./add-strategy-kpi.component.scss']
})
export class AddStrategyKpiComponent implements OnInit {
  @Input('source') StrategyKpiSource: any;
  @ViewChild('kpiMasterModal') kpiMasterModal: ElementRef;
  kpiMasterSubscription: any;
  strategyKpiForm: FormGroup
  kpiObject = {
    type: null,
    values: null
  }
  UnitMasterStore = UnitMasterStore
  StrategyInitiativeReviewFrequencyMasterStore = StrategyInitiativeReviewFrequencyMasterStore
  UsersStore =UsersStore;
  AppStore = AppStore
  KpiMasterStore = KpiMasterStore;
  StrategyStore = StrategyStore;
  StrategyKpiDataTypesMasterStore = StrategyKpiDataTypesMasterStore;
  KpiCalculationTypesMasterStore = KpiCalculationTypesMasterStore;
  AggregationTypesMasterStore = AggregationTypesMasterStore;
  variable: any = null;
  variableArray: any[] = [];
  dummy_array = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)', 'k)', 'l)', 'm)', 'n)', 'o)', 'p)', 'q)', 'r)', 's)', 't)', 'u)', 'v)', 'w)', 'x)', 'y)', 'z)'];
  formErrors: any;
  dataInputArray: any[] = [];
  input= { 
    title  :null  
   };
  selectedFreequency: any = 1;
  constructor(private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService, private _imageService: ImageServiceService,
    private _usersService: UsersService,private _service : StrategyService,private _kpiService: KpiService,
    private _strategyKpiDataTypesService: StrategyKpiDataTypesService, private _kpiCalculationTypesService: KpiCalculationTypesService,
    private _strategyInitiativeReviewFrequencyService: StrategyInitiativeReviewFrequencyService,
    private _unitService: UnitService,private _aggregationTypesService: AggregationTypesService ) { }

  ngOnInit(): void {
    this.kpiMasterSubscription = this._eventEmitterService.userKpiControl.subscribe(res=>{
      this.closeKpiMasters();
    })
    this.strategyKpiForm=this._formBuilder.group({
      kpi_id: [null, [Validators.required]],
      description: '',
      aggregation_type_id: [null, [Validators.required]],
      formula: '',
      kpi_owner_id: [null, [Validators.required]],
      kpi_calculation_type_id: [null, [Validators.required]],
      minimum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maximum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      user_ids: [null, [Validators.required]],
      // review_user: [null, [Validators.required]],
      strategy_kpi_data_type_id: [null],
      review_user_ids:[[]],
      target : [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      strategy_review_frequency_id:[null,[Validators.required]],
      target_unit_id : [null,[Validators.required]],
      strategy_profile_objective_id : null

    })
    if(this.StrategyKpiSource.type == 'Edit'){
      this.setEditData()
    }
    this.getKpis();
    this.getDataType();
    this.getActualValue();
    this.getUsers();
    this.getAggrigationType()
    this.openFrequncy()
    this.openTargetUnit()
    this.getReviewUser();
  }

  cancel(){
    this._eventEmitterService.dismissStrategyKpiModal();
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 

  getReviewUser(){

  }

  changeSelectedKpi(){
    this.strategyKpiForm.patchValue({
      description : this.strategyKpiForm.value.kpi_id.description ? this.strategyKpiForm.value.kpi_id.description : ''
    })
  }

  setEditData(){
    if(this.StrategyKpiSource.value){
      // this.searchKpis({term :this.StrategyKpiSource.value.kpi })

      this.strategyKpiForm.patchValue({
      kpi_id: this.StrategyKpiSource.value.kpi ? this.StrategyKpiSource.value.kpi : [],
      description:this.StrategyKpiSource.value.description ?this.StrategyKpiSource.value.description : '',
      aggregation_type_id: this.StrategyKpiSource.value.aggregation_type ? this.StrategyKpiSource.value.aggregation_type.id : [],
      formula: this.StrategyKpiSource.value.formula ? this.StrategyKpiSource.value.formula: '',
      kpi_owner_id: this.StrategyKpiSource.value.kpi_owner ? this.StrategyKpiSource.value.kpi_owner: [],
      kpi_calculation_type_id: this.StrategyKpiSource.value.kpi_calculation_type ? this.StrategyKpiSource.value.kpi_calculation_type.id: [],
      minimum: this.StrategyKpiSource.value.minimum ? this.StrategyKpiSource.value.minimum: '',
      maximum:  this.StrategyKpiSource.value.maximum ?  this.StrategyKpiSource.value.maximum: '',
      user_ids: this.StrategyKpiSource.value.responsible_users ? this.StrategyKpiSource.value.responsible_users: [],
      review_user_ids: this.StrategyKpiSource.value.review_users ? this.StrategyKpiSource.value.review_users : [],
      // strategy_profile_objective_kpi_data_inputs : this.dataInputArray,
      strategy_kpi_data_type_id: this.StrategyKpiSource.value.strategy_kpi_data_type ? this.StrategyKpiSource.value.strategy_kpi_data_type.id: [],
      target : this.StrategyKpiSource.value.target ? this.StrategyKpiSource.value.target: '',
      strategy_review_frequency_id : this.StrategyKpiSource.value.strategy_review_frequencies ? this.StrategyKpiSource.value.strategy_review_frequencies.id : [],
      target_unit_id : this.StrategyKpiSource.value.target_unit_id.id ? this.StrategyKpiSource.value.target_unit_id.id : [],
      strategy_profile_objective_id : this.StrategyKpiSource.value.strategy_profile_objective ? this.StrategyKpiSource.value.strategy_profile_objective.id : null
      })
      let inputData
      this.StrategyKpiSource.value.strategy_profile_objective_kpi_data_inputs.map(data=>{
        this.variableArray.push(data.title)
        inputData = {
          title : data.title
        }
        this.dataInputArray.push(inputData)
        
      })
      if(this.StrategyKpiSource.value.strategy_review_frequencies){
        this.changeFreequency(this.StrategyKpiSource.value.strategy_review_frequencies.id)
      }
      if(this.StrategyKpiSource.value.strategy_profile_objective){
        StrategyStore.setObjectiveStartDate(this.StrategyKpiSource.value.strategy_profile_objective?.start_date);
        StrategyStore.setObjectiveEndDate(this.StrategyKpiSource.value.strategy_profile_objective?.end_date);
      }
    }
    
    this._utilityService.detectChanges(this._cdr);

  }

  addVariable(){
    
    if(this.variable){
      if(this.dataInputArray.length == 0){
         let input = {
          title : this.variable
        }
        this.dataInputArray.push(input)

      }else{
        this.dataInputArray.map(data=>{
          let input = {
            title : this.variable
          }
          this.dataInputArray.push(input)
        })
      }
       this.variableArray.push(this.variable);
    } 
    this.variable = null;
    this._utilityService.detectChanges(this._cdr);
  }

  removeVariable(pos){
    this.variableArray.splice(pos,1);
    if(this.dataInputArray.length > 0){
      this.dataInputArray.splice(pos,1)
    }
    this.strategyKpiForm.patchValue({
      formula : null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  openKpiMasters(){
    this.kpiObject.type = 'Add';
    this._renderer2.addClass(this.kpiMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMasterModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.kpiMasterModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.kpiMasterModal.nativeElement,'z-index',99999);
  }

  closeKpiMasters(){
    this.kpiObject.type = null;
    this._renderer2.removeClass(this.kpiMasterModal.nativeElement,'show');
    this._renderer2.setStyle(this.kpiMasterModal.nativeElement,'display','none');
    this._renderer2.setStyle(this.kpiMasterModal.nativeElement,'z-index',9999);
    this.searchKpis({term : KpiMasterStore.lastInsertedId},true)
  }

  getUsers() {
    let params = ''
    this._usersService.getAllItems(params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  searchUsers(searchTerm: any) {
    this._usersService.getAllItems('?q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
  }

  addDataInputs(){
    let inputData = {
      title : this.variableArray 
    }
    return inputData;
  }

  proccessData(){
    let saveData ={
      kpi_id: this.strategyKpiForm.value.kpi_id.id,
      description: this.strategyKpiForm.value.description ? this.strategyKpiForm.value.description : '',
      aggregation_type_id: this.strategyKpiForm.value.aggregation_type_id ? this.strategyKpiForm.value.aggregation_type_id : [],
      formula: this.strategyKpiForm.value.formula ? this.strategyKpiForm.value.formula: '',
      kpi_owner_id: this.strategyKpiForm.value.kpi_owner_id ? this.strategyKpiForm.value.kpi_owner_id.id: [],
      kpi_calculation_type_id: this.strategyKpiForm.value.kpi_calculation_type_id ? this.strategyKpiForm.value.kpi_calculation_type_id: [],
      minimum: this.strategyKpiForm.value.minimum ? this.strategyKpiForm.value.minimum: '',
      maximum: this.strategyKpiForm.value.maximum ? this.strategyKpiForm.value.maximum: '',
      user_ids: this.strategyKpiForm.value.user_ids ? this._helperService.getArrayProcessed(this.strategyKpiForm.value.user_ids,'id'): [],
      // review_user: [null, [Validators.required]],
      review_user_ids:this.strategyKpiForm.value.review_user_ids ? this._helperService.getArrayProcessed(this.strategyKpiForm.value.review_user_ids,'id') : [],
      strategy_profile_objective_kpi_data_inputs : this.dataInputArray,
      strategy_kpi_data_type_id: this.strategyKpiForm.value.strategy_kpi_data_type_id ? this.strategyKpiForm.value.strategy_kpi_data_type_id: [],
      target : this.strategyKpiForm.value.target ? this.strategyKpiForm.value.target: '',
      strategy_review_frequency_id : this.strategyKpiForm.value.strategy_review_frequency_id ? this.strategyKpiForm.value.strategy_review_frequency_id : [],
      target_unit_id : this.strategyKpiForm.value.target_unit_id ? this.strategyKpiForm.value.target_unit_id  : [],
      review_frequencies : this.getDates().length > 0 ? this.getDates() : [],
      strategy_profile_objective_id : this.strategyKpiForm.value.strategy_profile_objective_id ? this.strategyKpiForm.value.strategy_profile_objective_id : StrategyStore.objectiveId
    }
    return saveData
  }

  save(close: boolean = false){
    let save 
    AppStore.enableLoading();
    if(this.StrategyKpiSource.type == "Edit"){
      save = this._service.updateKpi(this.proccessData(),this.StrategyKpiSource.value.id)
    }else{
      save = this._service.addKpi(this.proccessData())
    }
    save.subscribe(res=>{
      this.resetForm();
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
         this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });
  }

  getKpis(){
    this._kpiService.getKpis(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchKpis(e,patchValue:boolean = false){
    this._kpiService.getKpis(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.strategyKpiForm.patchValue({ kpi_id: i,target:i.target, target_unit_id:i.unit_id});           
            this.changeSelectedKpi()
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getActualValue(){
    this._kpiCalculationTypesService.getItems(false,'&is_strategy_management=1',true).subscribe(() => setTimeout(() => 
    this._utilityService.detectChanges(this._cdr), 100));
      
  }

  getDataType(){
    this._strategyKpiDataTypesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openTargetUnit(){
    this._unitService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  openFrequncy(){
    this._strategyInitiativeReviewFrequencyService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  openAggregationType(){
    
  }

  changeFreequency(event){
   if(event==1){
     this.selectedFreequency = 1
   }else if(event==2){
    this.selectedFreequency = 4
   }else if(event==3){
    this.selectedFreequency = 6
   }else if(event==4){
    this.selectedFreequency = 12
   }
  }

  getDates(){
    var startDate = moment(StrategyStore.objectiveStartDate)
    var endDate = moment(StrategyStore.objectiveEndDate);
    
    var result = [];
    
    if (endDate.isBefore(startDate)) {
        throw "End date must be greated than start date."
    }      
    
    while (startDate.isBefore(endDate)) {
        result.push(startDate.format("YYYY-MM-DD"));
        startDate.add(this.selectedFreequency, 'month');
    }

    return result
}

dataTypeChange(event){
  if(event == 1){
    this.strategyKpiForm.patchValue({
      aggregation_type_id : 2
    })
  }else if(event == 2){
    this.strategyKpiForm.patchValue({
      aggregation_type_id : 1
    })
  }

}

getAggrigationType(){
  this._aggregationTypesService.getItems(false,null,true).subscribe(() => 
  setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}







  resetForm(){
    this.strategyKpiForm.reset();
    this.variableArray = [];
    this.variable = null;
  }

}
