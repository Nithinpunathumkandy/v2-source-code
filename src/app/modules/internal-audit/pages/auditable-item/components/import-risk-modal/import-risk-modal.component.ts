import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskClassificationService } from 'src/app/core/services/masters/risk-management/risk-classification/risk-classification.service';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { RisksService } from 'src/app/core/services/risk-management/risks/risks.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskClassificationMasterStore } from 'src/app/stores/masters/risk-management/risk-classification-store';
import { RiskControlPlanMasterStore } from 'src/app/stores/masters/risk-management/risk-control-plan-store';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';


@Component({
  selector: 'app-import-risk-modal',
  templateUrl: './import-risk-modal.component.html',
  styleUrls: ['./import-risk-modal.component.scss']
})
export class ImportRiskModalComponent implements OnInit {
  @Input('source') CommonImportRiskSource: any;

  RisksStore= RisksStore;
  AppStore = AppStore;
  RiskClassificationMasterStore = RiskClassificationMasterStore;
  RiskCategoryMasterStore = RiskCategoryMasterStore;
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  risk_control_plan_id;
  risk_classification_id;
  risk_category_id;
  riskRatingId;
  riskArray = [];
  formErrors: any;

  form: FormGroup;
  searchTerm;
  allRisks:boolean = false;

  importRiskEmptyList = "No Risks To Show";
  constructor(private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _riskrclassificationService: RiskClassificationService,
    private _riskcategoryService: RiskCategoryService,
    private _riskcontrolplanService: RiskControlPlanService,
    private _router:Router,
    private _helperService: HelperServiceService,
    private _auditProgramService: AuditProgramService,
    private _riskRatingService: RiskRatingService,
    private _auditableItemSerice: AuditableItemService,
    private _cdr: ChangeDetectorRef,
    private _riskService: RisksService) { }

  ngOnInit(): void {
    this.form = new FormGroup({});
    // calling risk apis

    this.pageChange(1);

    // calling other requiered apis for ngselect in order to do filtering

    this.getRiskCategory();
    this.getRiskControlPlan();
    this.getRiskClassification();
    this.getRiskRating();
  }

  // pageChange event
  pageChange(newPage: number = null){
    RisksStore.unsetRiskDetails()
    let params = "";
    params= `auditable_item=true`;
    if (newPage) RisksStore.setCurrentPage(newPage);
    this._riskService
      .getItems(false,params)
      .subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
      

  }
   // for getting audit risk rating
   getRiskRating() {

    this._riskRatingService.getAllItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // getting risk category 
  getRiskCategory(){

    this._riskcategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting risk control plan
  getRiskControlPlan(){

    this._riskcontrolplanService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting risk classification
  getRiskClassification(){

    this._riskrclassificationService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // search of risk category
  searchRiskCategory(e){

    this._riskcategoryService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // search of risk classification
  searchRiskClassification(e){
    this._riskrclassificationService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // search of risk control plan
  searchRiskControlPlan(e){
    this._riskcontrolplanService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // sort function
  sortRisks(){


    var params = '';
    if (this.risk_category_id) {
      if (params)
        params = params + `risk_category_ids=${this.risk_category_id}&auditable_item=true`;
      else
        params = `risk_category_ids=${this.risk_category_id}&auditable_item=true`;
    }

    if (this.risk_classification_id) {
      if (params)
        params = params + `risk_classification_ids=${this.risk_classification_id}&auditable_item=true`;
      else
        params = `risk_classification_ids=${this.risk_classification_id}&auditable_item=true`;
    }

    if (this.risk_control_plan_id) {
      if (params)
        params = params + `risk_control_plan_ids=${this.risk_control_plan_id}&auditable_item=true`;
      else
        params = `risk_control_plan_ids=${this.risk_control_plan_id}&auditable_item=true`;
    }

    if (this.riskRatingId) {
      if (params)
        params = params + `risk_rating_ids=${this.riskRatingId}&auditable_item=true`;
      else
        params = `risk_rating_ids=${this.riskRatingId}&auditable_item=true`;
    }
     // go back to initial state when no filters applied
     if(this.risk_category_id==null&& this.risk_classification_id==null && this.risk_control_plan_id==null && this.riskRatingId==null){
      this.pageChange(1);
    } else {
    
    this._riskService.getItems(false, params).subscribe(res => {
      if(res.data.length == 0){
        this.importRiskEmptyList = "Your search did not match any risk. Please make sure you typed the risk name correctly, and then try again.";
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
   
  }


  // risk search function
  searchInRisk(){
    RisksStore.setCurrentPage(1);
    let params = "";
    params= `auditable_item=true`;

    if (this.searchTerm) {
    this._riskService
    .getItems(false,`q=${this.searchTerm}&`+params)
    .subscribe(res=>{
     if(res.data.length == 0){
       this.importRiskEmptyList = "Your search did not match any risk. Please make sure you typed the risk name correctly, and then try again.";
     }
      this._utilityService.detectChanges(this._cdr);
    })
      
  } else {
    this.pageChange();
  }
  }

  clearSearchBar(){
    this.searchTerm = '';
    this.pageChange();
  }

  checkSelectedStatus(id: number){
    var pos = this.riskArray.findIndex(e => e.id == id);
    if(pos != -1) return true;
    else return false;
  }



// checked risks push to an array called riskArray
  selectRisks(event,risk, index) {
    var pos = this.riskArray.findIndex(e=>e.id == risk.id);
    if(pos != -1)
        this.riskArray.splice(pos,1);
    else
        this.riskArray.push(risk);
  }


// check all checkbox function
  checkAll(event) {
     if (event.target.checked) {
      this.allRisks = true;
      for(let i of RisksStore.riskDetails){
        var pos = this.riskArray.findIndex(e => e.id == i.id);
        if (pos == -1){
          this.riskArray.push(i);}          
      }
    } else {
      this.allRisks = false;
      for(let i of RisksStore.riskDetails){
        var pos = this.riskArray.findIndex(e => e.id == i.id);
        if (pos != -1){
          this.riskArray.splice(pos,1);}    
      }
    }

  }

  // getSelectedRisks(){
  //   if (RisksStore.riskDetails.length>0){
  //   for (let i of RisksStore.riskDetails){
  //     if(i['is_enabled']==true){
  //       this.riskArray.push(i);} else {
  //         var pos = this.riskArray.findIndex(e => e.id == i.id);
  //         if (pos != -1)
  //           this.riskArray.splice(pos, 1);
      
  //       }
  //   }
  // }
  // }

  // processing data for save
  processSaveData(){
    var riskArray=[];
   
    if (this.riskArray.length>0){
      for (let i of this.riskArray){
        riskArray.push(i.id);
      }
      var items= {

        "risk_ids": riskArray
      }
     return items;
    }
  }

  // save function
  save(close: boolean = false){

   

    if(this.riskArray.length == 0){
      this._utilityService.showErrorMessage('Error!','Please Select One Risk Atleast');
    } else {

    this.formErrors = null;
    if (this.riskArray.length>0) {
      let save;
      AppStore.enableLoading();
      if(this.CommonImportRiskSource.type=='Risk'){

        save = this._auditProgramService.saveImportedRisk(this.CommonImportRiskSource.values.id,this.processSaveData())
      } else {
  
        save = this._auditableItemSerice.saveImportRisk(this.processSaveData());}
      
      save.subscribe((res: any) => {
       console.log(res)
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if(this.CommonImportRiskSource.type=='Risk'){
          this._router.navigateByUrl("/internal-audit/audit-programs/"+this.CommonImportRiskSource.values.id+"/auditable-items");
        } else {
        this._router.navigateByUrl("/internal-audit/auditable-items");}
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }
  }

// cancel function
  cancel() {
    this._eventEmitterService.dismissImportRiskModal();
    this._eventEmitterService.dismissNewImportRiskModal();
    this.riskArray = [];
    this.pageChange(1);// calling for redreshing the list
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
