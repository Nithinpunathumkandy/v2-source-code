import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
// import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { KeyriskindicatorsService } from 'src/app/core/services/masters/risk-management/key-risk-indicators/keyriskindicators.service';
import { KeyRiskIndicatorsMasterStore } from 'src/app/stores/masters/risk-management/key-risk-indicators-master-store';
import { UnitStore } from 'src/app/stores/general/unit.store';
import { UnitService } from 'src/app/core/services/general/unit/unit.service';
import { ImpactAnalysisService } from 'src/app/core/services/risk-management/risks/impact-analysis/impact-analysis.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { ImpactAnalysisCategoriesService } from 'src/app/core/services/masters/risk-management/impact-analysis-categories/impact-analysis-categories.service';
import { ImpactCategoryMasterStore } from 'src/app/stores/masters/risk-management/impact-analysis-category-store';
import { ImpactService } from 'src/app/core/services/risk-management/risk-configuration/impact/impact.service';
import { ImpactStore } from 'src/app/stores/risk-management/risk-configuration/impact.store';
import { IsmsImpactAnalysisService } from 'src/app/core/services/isms/isms-risks/isms-impact-analysis/isms-impact-analysis.service';
import { IsmsImpactService } from 'src/app/core/services/isms/isms-risk-configuration/isms-impact/isms-impact.service';
import { IsmsImpactStore } from 'src/app/stores/isms/isms-risk-configuration/isms-impact.store';
import { AmAuditFindingIaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-ia/am-audit-finding-ia.service';
import { AmFindingIAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ia.store';
declare var $: any;
@Component({
  selector: 'app-risk-impact-analysis-modal',
  templateUrl: './risk-impact-analysis-modal.component.html',
  styleUrls: ['./risk-impact-analysis-modal.component.scss']
})
export class RiskImpactAnalysisModalComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @Input('source') impactAnalysisSource: any;
  @Input('impactCategoryId') impactCategory: any;
  
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  ImpactCategoryMasterStore = ImpactCategoryMasterStore;

  impactCategoryMasterObject = {
    component: 'Master',
    values: null,
    type: null
  };

  impactAnalysNgModal = [];

  // ImpactAnalysisSubscriptionEvent: any;
  unitModalSubscriptionEvent: any;
  KeyRiskIndicatorsMasterStore = KeyRiskIndicatorsMasterStore;
  UnitStore = UnitStore;
  ImpactStore = ImpactStore;
  IsmsImpactStore = IsmsImpactStore;
  AmFindingIAStore = AmFindingIAStore;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  ImpactAnalysisCategorySubscriptionEvent: any;


  constructor(
    private _formBuilder: FormBuilder, 
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _impactAnalysisCategoryService: ImpactAnalysisCategoriesService,
    private _ImpactAnalysisService: KeyriskindicatorsService,
    private _unitService: UnitService,
    private _impactAnalysisService: ImpactAnalysisService,
    private _ismsImpactAnalysisService: IsmsImpactAnalysisService,
    private _renderer2: Renderer2,
    private _impactService:ImpactService,
    private _ismsImpactService:IsmsImpactService,
    private _amFindingImpactService:AmAuditFindingIaService
  ) { }

  ngOnInit(): void {
    console.log(RisksStore.riskId);
    console.log(this.impactAnalysisSource);

    // this.form = this._formBuilder.group({
    //   risk_impact_analysis_category_id: [null],
    //   money_profit: [null],
    //   money_loss: [null],
    //   time_profit: [null],
    //   time_loss: [null],
    //   count_profit: [null],
    //   count_loss: [null]

    // });
    // this.resetForm()
    if(this.impactCategory){
      console.log(this.impactCategory);
      // this.getImpactAnalysisCategory();
      this._impactAnalysisCategoryService.getItems(false).subscribe(res => {
        // this.setCategory(this.impactCategory)
        this.createImpactModal(res.data);
        this._utilityService.detectChanges(this._cdr);
      })
      // this.setCategory(this.impactCategory);
    }
    else{
      this.getImpactAnalysisCategory();
    }
    if (this.impactAnalysisSource.hasOwnProperty('values') && this.impactAnalysisSource.values != null ) {
      this.assignValuesToNgModal(this.impactAnalysisSource);
    }
   
    // if (this.impactAnalysisSource) {
    //   // this.setFormValues();
    // }
    this.ImpactAnalysisCategorySubscriptionEvent = this._eventEmitterService.impactCategory.subscribe(res => {
      this.closeImpactAnalysisCategoryModal();
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
  }

  createImpactModal(impactAnalysisCategory) {
    for(let i of impactAnalysisCategory){
      let obj =  {
              "risk_impact_analysis_category_title": i.title,
              "risk_impact_analysis_category_id" : i.id,
              "finding_impact_analysis_category_id":i.id,
              "risk_impact":false,
              "risk_matrix_impact_id":null,
              "money" : 0,
              "time" : 0,
              "performance" : 0
          }
      this.impactAnalysNgModal.push(obj);
      }
      console.log(this.impactAnalysNgModal);
  }



  assignValuesToNgModal(impactAnalysisSource) {
    for(let i of impactAnalysisSource.values){
      let obj =  {
              "risk_impact_analysis_category_title": i.risk_impact_analysis_category_title? i.risk_impact_analysis_category_title:i.finding_impact_analysis_category_title,
              "risk_impact_analysis_category_id" : i.risk_impact_analysis_category_id?i.risk_impact_analysis_category_id:i.finding_impact_analysis_category_id,
              "finding_impact_analysis_category_id":i.risk_impact_analysis_category_id?i.risk_impact_analysis_category_id:i.finding_impact_analysis_category_id,
              "risk_impact": i.risk_impact? i.risk_impact : false ,
              "risk_matrix_impact_id":i.risk_matrix_impact_id ? i.risk_matrix_impact_id : null,
              "money" : i.money ? i.money : 0,
              "time" : i.time ? i.time : 0,
              "performance" : i.performance ? i.performance : 0
          }
      this.impactAnalysNgModal.push(obj);
      }
      this._utilityService.detectChanges(this._cdr);
      console.log(this.impactAnalysNgModal);
  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }

  }


  addNewItem() {
    this.impactCategoryMasterObject.type = 'Add';
    this.impactCategoryMasterObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openImpactAnalysisModal();
  }


  openImpactAnalysisModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement) as any).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus

    }, 50);
  }


  closeImpactAnalysisCategoryModal() {
    if (ImpactCategoryMasterStore.lastInsertedId) {
      this.form.patchValue({ risk_impact_analysis_category_id: ImpactCategoryMasterStore.lastInsertedId,
        finding_impact_analysis_category_id: ImpactCategoryMasterStore.lastInsertedId});
      this.searchImpactAnalysisCategory({ term: this.form.value.risk_impact_analysis_category_id })
    }
    ($(this.formModal.nativeElement) as any).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99'); // For Modal to Get Focus

    this.impactCategoryMasterObject.type = null;
  }

  // setCategory(id) {
  //   this.form.patchValue({
  //     risk_impact_analysis_category_id: id
  //   })
  //   this._impactAnalysisService.getItem(id).subscribe(res=>{
  //     this.form.patchValue({
  //       money_profit:res['money']>0?res['money']:0,
  //       money_loss:res['money']<0?res['money']:0,
  //       time_profit:res['time']>0?res['time']:0,
  //       time_loss:res['time']<0?res['time']:0,
  //       count_profit:res['profit']>0?res['profit']:0,
  //       count_loss:res['profit']<0?res['profit']:0,

  //     })
  //     this._utilityService.detectChanges(this._cdr);
  //   })

  // }

  // getProcessedValues() {
  //   let saveData = {
  //     risk_impact_analysis_category_id: this.form.value.risk_impact_analysis_category_id,
  //     money: this.form.value.money_profit > 0 ? this.form.value.money_profit : this.form.value.money_loss<0?this.form.value.money_loss:0-this.form.value.money_loss,
  //     time: this.form.value.time_profit > 0 ? this.form.value.time_profit : parseInt(this.form.value.time_loss)<0?this.form.value.time_loss:0-parseInt(this.form.value.time_loss),
  //     count: this.form.value.count_profit > 0 ? this.form.value.count_profit : parseInt(this.form.value.count_loss)<0?this.form.value.count_loss:0-parseInt(this.form.value.count_loss)
  //   }
  //   return saveData;
  // }


  // getProcessedVal() {
    
  // }

  // getItem() {
  //   this._ImpactAnalysisService.getItems().subscribe((res) => {
  //     setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  save(close: boolean = false) {
    let save;
    let saveData = { impact_analysis_details: this.impactAnalysNgModal }
    this.formErrors = null;
    // if (this.form.value) {
      AppStore.enableLoading();
      console.log(this.impactAnalysNgModal)
      if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='am-audit'){
        save =this._amFindingImpactService.saveItem(saveData);
      }
      else if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='isms'){
        save =this._ismsImpactAnalysisService.saveItem(saveData);
      }
      else{
        save = this._impactAnalysisService.saveItem(saveData);
      }
      save.subscribe((res: any) => {
          console.log(res)

          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
            console.log(this.formErrors);
            console.log(err.error.errors);
            this.processFormErrors();
          }
          else if (err.status == 500 || err.status == 403) {
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);

        });
    // }
  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.endsWith('risk_impact')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['risk_impact'] = this.formErrors['risk_impact']? 
          this.formErrors['risk_impact'] + errors[key] + '('+(errorPosition + 1)+')'
          : errors[key]+ (errorPosition + 1);
        }
        if(key.endsWith('risk_matrix_impact_id')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['risk_matrix_impact_id'] = this.formErrors['risk_matrix_impact_id']? 
          this.formErrors['risk_matrix_impact_id'] + errors[key] + (errorPosition + 1): 
          errors[key]+ (errorPosition + 1);
        }
        if(key.endsWith('money')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['money'] = this.formErrors['money']? 
          this.formErrors['money'] + errors[key] + (errorPosition + 1): 
          errors[key]+ (errorPosition + 1);
        }
        if(key.endsWith('time')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['time'] = this.formErrors['time']? this.formErrors['time'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
        if(key.endsWith('performance')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['performance'] = this.formErrors['performance']? 
          this.formErrors['performance'] + errors[key] + (errorPosition + 1): 
          errors[key]+ (errorPosition + 1);
          console.log(this.formErrors);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }


  // setValue(type,value){
  //   console.log(type)
  //   switch(type){
  //     case 'money':
  //       if(value=='profit' && this.form.value.money_profit>0){
  //         this.form.patchValue({
  //           money_loss:0
  //         })
         
  //       }
  //       else if(value=='loss' && this.form.value.money_loss){
  //         this.form.patchValue({
  //           money_profit:0
  //         })
         
  //       }
  //     break;
  //     case 'time':
  //       if(value=='profit' && this.form.value.time_profit>0){
  //         this.form.patchValue({
  //           time_loss:0
  //         })
         
  //       }
  //       else if(value=='loss' && this.form.value.time_loss){
  //         this.form.patchValue({
  //           time_profit:0
  //         })
         
  //       }
  //       break;
  //       case 'count':
  //         if(value=='profit' && this.form.value.count_profit>0){
  //           this.form.patchValue({
  //             count_loss:0
  //           })
           
  //         }
  //         else if(value=='loss' && this.form.value.count_loss){
  //           this.form.patchValue({
  //             count_profit:0
  //           })
           
      
  //         }
  //         break;
        
  //   }
  //   this._utilityService.detectChanges(this._cdr);
  // }

  // setFormValues() {

  //   if (this.impactAnalysisSource.hasOwnProperty('values') && this.impactAnalysisSource.values) {
  //     let { risk_impact_analysis_category_id, money, time, count } = this.impactAnalysisSource.values
  //     this.form.patchValue({

  //       risk_impact_analysis_category_id: risk_impact_analysis_category_id,
  //       money_profit: money > 0 ? money : 0,
  //       money_loss: money < 0 ? money : 0,
  //       time_profit: time > 0 ? time : 0,
  //       time_loss: time < 0 ? time : 0,
  //       count_profit: count > 0 ? count : 0,
  //       count_loss: count < 0 ? count : 0

  //     })

  //     this.searchImpactAnalysisCategory({ term: this.form.value.risk_impact_analysis_category_id });


  //   }


  // }

  getRiskMatrixImpact() {
    // if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='am-audit'){
    //   this._amFindingImpactService.getItems().subscribe(res=>{
    //     this._utilityService.detectChanges(this._cdr);
    //   });
    // }
    // else
     if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='isms'){
      this._ismsImpactService.getItems().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this._impactService.getItems().subscribe();
    }
   
  }

  searchRiskMatrixImpact(searchTerm: any) {
    if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='am-audit'){
      this._amFindingImpactService.getItems(false,'&q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else if(this.impactAnalysisSource.component && this.impactAnalysisSource.component=='isms'){
      this._ismsImpactService.getItems(false,'&q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this._impactService.getItems(false,'&q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    }); 
    }
   
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissRiskImpactAnalysisModal();
  }

  resetForm() {
    this.impactAnalysNgModal = [];
    // this.form.reset();
    // this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getImpactAnalysisCategory() {
    this._impactAnalysisCategoryService.getItems(false).subscribe(res => {
      // this.setCategory(res['data'][0]?.id)
      if (this.impactAnalysNgModal.length == 0)
      this.createImpactModal(res.data)
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchImpactAnalysisCategory(e, patchValue: boolean = false) {
    this._impactAnalysisCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  ngOnDestroy() {
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    // this.ImpactAnalysisSubscriptionEvent.unsubscribe();
    // this.unitModalSubscriptionEvent.unsubscribe();
  }

}
