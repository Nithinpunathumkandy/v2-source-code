import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectBudgetService } from 'src/app/core/services/project-monitoring/project-budget/project-budget.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-change-request-budget-modal',
  templateUrl: './change-request-budget-modal.component.html',
  styleUrls: ['./change-request-budget-modal.component.scss']
})
export class ChangeRequestBudgetModalComponent implements OnInit {
  @Input('source') BudgetSource: any;
  
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  Budgetstore = BudgetStore;
	AppStore = AppStore;
	form: FormGroup;
	formErrors: any;
  selectedId: any = null;
  constructor(private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService,
    private _projectService : ProjectMonitoringService,
    private _projectBudgetService : ProjectBudgetService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
			amount : [null,[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      year : [null,[Validators.required]],
    });
      if(this.BudgetSource.type =="Edit"){
        this.editData()
      }
  }

  editData(){
    this.form.patchValue({
     amount: this.BudgetSource.value.amount ? this.BudgetSource.value.amount : null,
     year : this.BudgetSource.value.year ?this.BudgetSource.value.year : null,
   })
  }
 
  processSaveData() {
   let saveData = {
     amount : 0,
     year : this.form.value.year ? this.form.value.year : null,
     newAmount : this.form.value.amount ? this.form.value.amount : null,
     type :  ''
   }
   return saveData;
 }
 generateArrayOfYears(){
   let max=new Date("2025-10-20").getFullYear();
   let min= max-10; 
   let years= [];
   for (let i = min; i<=max; i++){
     if(ProjectChangeRequestStore.budgets.length > 0){
       let pos = ProjectChangeRequestStore.budgets.findIndex(e=>e.year == i)
       if(pos == -1){
        years.push(i)
       }
     }else {
      years.push(i)

     }
   }

   return years;
 }

 save(close: boolean = false) {
   this.formErrors = null;
   if (this.form.valid) {
     let save;
     AppStore.enableLoading();
     if (this.BudgetSource.type == "Edit" || this.selectedId ) {
       let id = this.selectedId ? this.selectedId : this.BudgetSource.value.id
     } else {
       ProjectChangeRequestStore.setBudgets(this.processSaveData())
     }
    //  save.subscribe((res: any) => {
       if (!this.form.value.id) {
         this.resetForm();
       }
       AppStore.disableLoading();
       setTimeout(() => {
         this._utilityService.detectChanges(this._cdr);
       }, 500); 
       if (close) this.cancel();
    //  }, (err: HttpErrorResponse) => {
    //    if (err.status == 422) {
    //      this.formErrors = err.error.errors;
    //    }
    //    else if (err.status == 500 || err.status == 403) {
    //      this.cancel();
    //    }
    //    AppStore.disableLoading();
    //    this._utilityService.detectChanges(this._cdr);
    //  });
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
   }else{
     this.form.patchValue({
       amount : null
     })
   }
 }

 resetForm() {
   this.form.reset();
   this.formErrors = null;
   this.selectedId == null
   AppStore.disableLoading();

 }

 cancel(){
   this._eventEmitterService.dismissChangeReqProjectBudgetModal();
  }

getButtonText(text) {
 return this._helperService.translateToUserLanguage(text);
}

}
