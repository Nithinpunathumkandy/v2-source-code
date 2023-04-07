import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectBudgetService } from 'src/app/core/services/project-monitoring/project-budget/project-budget.service';
import { ProjectMilestoneService } from 'src/app/core/services/project-monitoring/project-milestone.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-project-payment-add',
  templateUrl: './project-payment-add.component.html',
  styleUrls: ['./project-payment-add.component.scss']
})
export class ProjectPaymentAddComponent implements OnInit {
  @Input('source') paymentSource: any;
  form: FormGroup;
  formErrors: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ProjectMonitoringStore = ProjectMonitoringStore;
  ProjectMilestoneStore = ProjectMilestoneStore
  AppStore = AppStore
  BudgetStore = BudgetStore
  amount : any = 0;
  balanceAmount: number = 0.00;
  is_budgetExceed: boolean = false;
  total: any;
  is_alreadyAdded: boolean = false;
   selectedId : any = null
  totalBudget: number;
  constructor( private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,    
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _projectService : ProjectMonitoringService,
    private _projectBudgetService : ProjectBudgetService,
    private _projectMilestoneService : ProjectMilestoneService
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: null,
      project_milestone_id: [null,[Validators.required]],
      payment_id : null,
      year: [null,[Validators.required]],
      q1 : [0,[Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      q2 : [0,[Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      q3 : [0,[Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      q4 : [0,[Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      total : ['',[Validators.required,Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      
    })



    if(this.paymentSource.type == "Edit"){
      this.editData()
    }
    this.getMileStone()
  }

  generateArrayOfYears(){
    let max=new Date("2025-10-20").getFullYear();
    let min= max-10; 
    let years= [];
    for (let i = min; i<=max; i++){
      years.push(i)
    }
    return years;
  }

  setQuaterValidation(){
    // if(this.form.value.q1 == ''&& 
    //   this.form.value.q2 == ''&&
    //   this.form.value.q3 == ''&&
    //   this.form.value.q4 == ''
    //   ){
    //     this.is_quater = false
    //   }else{
    //     this.is_quater = true
    //   }
    //   this._utilityService.detectChanges(this._cdr);
  }

  editData(){
    this.form.patchValue({
      project_milestone_id  : this.paymentSource.value.project_milestone_id ? this.paymentSource.value.project_milestone_id : null,
      year : this.paymentSource.value.year ? this.paymentSource.value.year : null,
      q1 : this.paymentSource.value.q1 ? this.paymentSource.value.q1 : null,
      q2 : this.paymentSource.value.q2 ? this.paymentSource.value.q2 : null,
      q3 : this.paymentSource.value.q3 ? this.paymentSource.value.q3 : null,
      q4 : this.paymentSource.value.q4 ? this.paymentSource.value.q4 : null,
      total : this.paymentSource.value.total ? this.paymentSource.value.total : null,
      payment_id : this.form.value.payment_id ? this.form.value.payment_id : null,
    })
    this.selectedId = this.paymentSource.value.id
    this.changeYear(this.paymentSource.value.year)
  }

  getBudget(){
    this._projectBudgetService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMileStone(){
    this._projectMilestoneService.getMilestons().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPaymentsList(){
    this._projectBudgetService.getPaymentList().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  clearMilestone(){
    this.getMileStone()
    this.form.patchValue({
      q1 :  0 ,
      q2:  0 ,
      q3:  0,
      q4 :  0,
      total : null,
      year : null,

    })
    this.balanceAmount = 0.00
    this.amount = 0
    this.selectedId = null
    this.totalBudget = 0
    this.is_budgetExceed = false

  }

  changeYear(event){
    if(BudgetStore.payment.length > 0){
      this.totalBudget = 0
      // let pos = BudgetStore.payment.findIndex(e=>e.year == event)
      for(let data of BudgetStore.payment){
        if(data.year ==  event){
          this.totalBudget = this.totalBudget + Number(data.payment_total)
          this.form.patchValue({
           total : data.total,
        })
        if(data.project_milestone_id ==this.form.value.project_milestone_id ){
          this.form.patchValue({
            q1 : data.q1 ?  data.q1 : 0 ,
            q2: data.q2 ?  data.q2 : 0 ,
            q3: data.q3 ?  data.q3 : 0,
            q4 : data.q4 ?  data.q4 : 0
         })
        //  this.is_alreadyAdded = true
         this.selectedId = data.id
        }
        this.amount = Number(data.total) - this.totalBudget
        }
        else if(!this.form.value.total) {
          let pos1 = BudgetStore.allItems.findIndex(e=>e.year == event)
          if(pos1 != -1){
            this.amount = BudgetStore.allItems[pos1].amount
            this.form.patchValue({
             total : BudgetStore.allItems[pos1].amount, 
           })
          }
        }
      }
     
     
    }else{
      let pos1 = BudgetStore.allItems.findIndex(e=>e.year == event)
        if(pos1 != -1){
          this.amount = BudgetStore.allItems[pos1].amount
          this.form.patchValue({
           total : BudgetStore.allItems[pos1].amount, 
         })
        }
    }
       this.balanceAmount = this.amount
    // })
    
  }

  clearYear(){
    this.form.patchValue({
      q1 :  0 ,
      q2:  0 ,
      q3:  0,
      q4 :  0,
      total : null,
    })
    this.amount = 0
    this.balanceAmount = 0.00
    this.is_budgetExceed = false
    this.selectedId = null
    this.totalBudget = 0

  }

  // changeMilestone(){
  //   this.form.patchValue({
  //     q1 :  0 ,
  //     q2:  0 ,
  //     q3:  0,
  //     q4 :  0,
  //     total : null,
  //     year : null
  //   })
  //   this.amount = 0
  //   this.balanceAmount = 0.00
  //   this.is_budgetExceed = false
  //   this.selectedId = null
  // }

  changeAmountsValue(amount){
    let total
    let balanceTotal = 0
    this.setQuaterValidation()
    // this.balanceAmount = 0.00
    total = Number(this.form.value.q1) + Number(this.form.value.q2) + Number(this.form.value.q3) + Number(this.form.value.q4)
    if(BudgetStore.payment.length > 0){
      for(let data of BudgetStore.payment){
        if(data.id != this.selectedId && this.form.value.year == data.year){
          balanceTotal = Number(balanceTotal) + Number(data.payment_total) 
        }
      }
    }
     if(this.selectedId){
      this.balanceAmount = Number(this.form.value.total) - (Number(total) + balanceTotal);
      if( this.balanceAmount < 0 ){
        this.is_budgetExceed = true
      }else {
        this.is_budgetExceed = false
  
      }
     }else{
      this.balanceAmount = Number(this.amount) - Number(total);
      if( Number(this.amount) < Number(total) ){
        this.is_budgetExceed = true
      }else {
        this.is_budgetExceed = false
  
      }
     }
   
  }

  changeQ1(amt){
    this.balanceAmount = this.amount
   this.total = this.form.value.q1 + this.form.value.q2 + this.form.value.q3 + this.form.value.q4
   this.balanceAmount =  Number(this.amount) - this.total 
  }
  changeQ2(amt){
    this.total = this.form.value.q1 + this.form.value.q2 + this.form.value.q3 + this.form.value.q4
    this.balanceAmount =  Number(this.amount) - this.total 

  }
  changeQ3(amt){
    this.total = this.form.value.q1 + this.form.value.q2 + this.form.value.q3 + this.form.value.q4
    this.balanceAmount =  Number(this.amount) - this.total 

  }
  changeQ4(amt){
    this.total = this.form.value.q1 + this.form.value.q2 + this.form.value.q3 + this.form.value.q4
    this.balanceAmount =  Number(this.amount) - this.total 

  }
  


  processSaveData() {
    let saveData = {
      project_milestone_id  : this.form.value.project_milestone_id ? this.form.value.project_milestone_id : null,
      year : this.form.value.year ? this.form.value.year : null,
      q1 : this.form.value.q1 ? this.form.value.q1 : null,
      q2 : this.form.value.q2 ? this.form.value.q2 : null,
      q3 : this.form.value.q3 ? this.form.value.q3 : null,
      q4 : this.form.value.q4 ? this.form.value.q4 : null,
      total : this.form.value.total ? this.form.value.total : null,
      payment_id : this.form.value.payment_id ? this.form.value.payment_id : null,


    }
    
    return saveData;
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      
      AppStore.enableLoading();
      if (this.paymentSource.type=='Edit' || this.selectedId) {
        save = this._projectBudgetService.updatePayment(this.processSaveData(),this.selectedId);
      } else {
        delete this.form.value.id
        save = this._projectBudgetService.savePayment(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.getPaymentsList()
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

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.is_budgetExceed = null 
    this.amount = 0;
    this.balanceAmount = 0.00
    this.totalBudget = 0
  }
  cancel(){
    this._eventEmitterService.dismissStrategicPaymentModal();
   
  }

}
