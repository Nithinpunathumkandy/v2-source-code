import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-add-event-budget',
  templateUrl: './add-event-budget.component.html',
  styleUrls: ['./add-event-budget.component.scss']
})
export class AddEventBudgetComponent implements OnInit {

  @Input('source') BudgetSource: any;
  
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  Budgetstore = BudgetStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  selectedId: any = null;

  constructor(
    private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _eventBudgetService : EventBudgetService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			amount : [null,[Validators.required,Validators.pattern(/^[0-9]+([,.][0-9]+)?$/)]],
      year : [null,[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      comments : [''],
      actual_amount : [''],
      closure_comments : [''],
    });
      if(this.BudgetSource.type =="Edit" || this.BudgetSource.type =="Edit from closure"){
        this.editData()
      }
    }

  editData(){
     this.form.patchValue({
      amount: this.BudgetSource.value.amount ? this.BudgetSource.value.amount : null,
      year : this.BudgetSource.value.year ?this.BudgetSource.value.year : null,
      comments : this.BudgetSource.value.comments ?this.BudgetSource.value.comments : null,
      actual_amount : this.BudgetSource.value.actual_amount ?this.BudgetSource.value.actual_amount : null,
      closure_comments : this.BudgetSource.value.closure_comments ?this.BudgetSource.value.closure_comments : null,
    })
   }
  
   processSaveData() {
    let saveData = {
      amount : this.form.value.amount ? this.form.value.amount : null,
      year : this.form.value.year ? this.form.value.year : null,
      comments : this.form.value.comments ? this.form.value.comments : null,
      actual_amount : this.form.value.actual_amount ? this.form.value.actual_amount : null,
      closure_comments : this.form.value.closure_comments ? this.form.value.closure_comments : null,
    }
    
    return saveData;
  }

  generateArrayOfYears(){
    let max= new Date().getFullYear()
    let min= max - 9; 
    let years= [];
    for (let i = max; i >= min; i--){
      years.push(i)
    }
    return years;
  }

  getBudgetsList(){
    this._eventBudgetService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

// getting description count
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.remarks.replace(regex,"");
  return result.length;
 }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.BudgetSource.type == "Edit" || this.selectedId || this.BudgetSource.type == "Edit from closure") {
        let id = this.selectedId ? this.selectedId : this.BudgetSource.value.id
        save = this._eventBudgetService.updateBudget(this.processSaveData(), id);
      } else {
        save = this._eventBudgetService.saveBudget(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (this.BudgetSource.type == "Add") {
          this.resetForm();
        }
        this.getBudgetsList()
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
  clearYear(){
    this.form.patchValue({
      amount : null
    })
  }
  changeYear(event){
    this.selectedId = null

    if(BudgetStore.allItems.length > 0){
      let pos = BudgetStore.allItems.findIndex(e=>e.year == event)
      if(pos != -1){
        this.selectedId = BudgetStore.allItems[pos].id
        this.form.patchValue({
          amount : BudgetStore.allItems[pos].amount
        })
      }
    else{
      this.form.patchValue({
        amount : null
      })
    }
  }
  }

  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.selectedId == null
    AppStore.disableLoading();

  }

  cancel(){
    this._eventEmitterService.dismissEventBudgetModal();
   }

getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}
  

}
