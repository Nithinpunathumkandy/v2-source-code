import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Component({
  selector: 'app-event-cr-budget',
  templateUrl: './event-cr-budget.component.html',
  styleUrls: ['./event-cr-budget.component.scss']
})
export class EventCrBudgetComponent implements OnInit {

  @Input('source') BudgetSource: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  Budgetstore = BudgetStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  selectedId: any = null;
  selectedYear:any=null;
  constructor(private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    //console.log(this.BudgetSource.type);
    this.form = this._formBuilder.group({
      amount: [null, [Validators.required, Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)]],
      year: [null, [Validators.required]],
    });
    if (this.BudgetSource.type == "Edit") {
      this.editData()
    }
  }

  editData() {
    this.form.patchValue({
      amount: this.BudgetSource.value.amount ? this.BudgetSource.value.amount : null,
      year: this.BudgetSource.value.year ? this.BudgetSource.value.year : null,
    })
  }

  processSaveData() {
    let saveData = {
      amount: 0,
      year: this.form.value.year ? this.form.value.year : null,
      newAmount: this.form.value.amount ? this.form.value.amount : null,
      type: '',
      status:'new'
    }
    return saveData;
  }

  generateArrayOfYears() {
    let max = new Date("2025-10-20").getFullYear();
    let min = max - 10;
    let years = [];
    for (let i = min; i <= max; i++) {
      if (EventChangeRequestStore.budgets.length > 0) {
        let pos = EventChangeRequestStore.budgets.findIndex(e => e.year == i)
        if (pos == -1 ||  (EventChangeRequestStore.budgets[pos].type=='deleted' && EventChangeRequestStore.budgets[pos].status=='existing')) {
          years.push(i)
        }
      } else {
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
      console.log(this.selectedId)
      if (this.BudgetSource.type == "Edit" || this.selectedYear) {
        //let id = this.form.value.year
        EventChangeRequestStore.updateExistingValue(this.form.value)
      } else {
        EventChangeRequestStore.setBudgets(this.processSaveData())
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
    }
  }

  clearYear() {
    this.form.patchValue({
      amount: null
    })
  }

  changeYear(event) {
    this.selectedYear = null
    //console.log(EventChangeRequestStore.budgets);
    if (EventChangeRequestStore.budgets.length > 0) {
      let pos = EventChangeRequestStore.budgets.findIndex(e => e.year == event)
      if (pos != -1) {
        //this.selectedId = EventChangeRequestStore.budgets[pos].id
        this.selectedYear=EventChangeRequestStore.budgets[pos].year
        this.form.patchValue({
          amount: EventChangeRequestStore.budgets[pos].amount
        })
      }
    } else {
      this.form.patchValue({
        amount: null
      })
    }
  }

  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.selectedId == null
    AppStore.disableLoading();

  }

  cancel() {
    this._eventEmitterService.dismissEventChangeReqBudgetModal();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
