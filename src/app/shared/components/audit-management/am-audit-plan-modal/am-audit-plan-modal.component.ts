import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAuditCategoryService } from 'src/app/core/services/masters/audit-management/am-audit-category/am-audit-category.service';
import { AnnualPlanFrequencyService } from 'src/app/core/services/masters/audit-management/annual-plan-frequency/annual-plan-frequency.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditCategoryMasterStore } from 'src/app/stores/masters/audit-management/am-audit-category-store';
import { AnnualPlanFrequencyMasterStore } from 'src/app/stores/masters/audit-management/annual-plan-frequency-store';
declare var $: any;
@Component({
  selector: 'app-am-audit-plan-modal',
  templateUrl: './am-audit-plan-modal.component.html',
  styleUrls: ['./am-audit-plan-modal.component.scss']
})
export class AmAuditPlanModalComponent implements OnInit {
  @Input('source') auditPlanSource: any;

  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  form: FormGroup;
  cancelEventSubscription: any;
  formErrors = null;
  AmAuditCategoryMasterStore = AmAuditCategoryMasterStore;
  AnnualPlanFrequencyMasterStore = AnnualPlanFrequencyMasterStore;
  AppStore = AppStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'Are you sure you want to cancel?',
    type: 'Cancel'
  };

  constructor(private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _amAuditCategoryService: AmAuditCategoryService,
    private _amAnnualPlanFrequencyService: AnnualPlanFrequencyService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _amAuditPlanService: AmAuditPlanService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      am_audit_category_id: [null, [Validators.required]],
      am_annual_plan_frequency_id: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
    });
    if (this.auditPlanSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancel(item);
    })
  }

  cancel(status) {
    if (status) {
      this.closeFormModal();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  confirmCancel() {

    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }


  ngDoCheck() {
    if (this.auditPlanSource && this.auditPlanSource.hasOwnProperty('values') && this.auditPlanSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
    this.clearItems();
    this._eventEmitterService.dismissAuditManagementAuditPlanAddModal();
  }
  clearItems() {
    this.form.reset();
    this.formErrors = null;
  }




  setFormValues() {
    if (this.auditPlanSource.hasOwnProperty('values') && this.auditPlanSource.values) {
      let { id, am_audit_category_id, am_annual_plan_frequency_id, start_date, end_date } = this.auditPlanSource.values
      this.form.patchValue({
        id: id,
        am_audit_category_id: am_audit_category_id?.id,
        am_annual_plan_frequency_id: am_annual_plan_frequency_id?.id,
        start_date: start_date,
        end_date: end_date
      })
      if (this.form.value.am_audit_category_id)
        this.searchAuditCategory({ term: this.form.value.am_audit_category_id });
      if (this.form.value.am_annual_plan_frequency_id)
        this.searchAnnualPlan({ term: this.form.value.am_annual_plan_frequency_id });
    }
  }

  getAuditCategory() {
    this._amAuditCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditCategory(event) {
    this._amAuditCategoryService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getAnnualPlan() {
    this._amAnnualPlanFrequencyService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAnnualPlan(event) {
    this._amAnnualPlanFrequencyService.getItems(false, 'q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  clear(type) {
    if (type == 'start_date') {
      this.form.patchValue({
        start_date: null
      })
    }
    else {
      this.form.patchValue({
        end_date: null
      })
    }
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getSaveData() {
    let saveData = {
      am_audit_category_id: this.form.value.am_audit_category_id,
      am_annual_plan_frequency_id: this.form.value.am_annual_plan_frequency_id,
      start_date: this._helperService.processDate(this.form.value.start_date, 'join'),
      end_date: this._helperService.processDate(this.form.value.end_date, 'join'),
    }
    return saveData;
  }

  save(close: boolean = false) {

    this.formErrors = null;
    AppStore.enableLoading();
    let save;
    if (this.form.value.id) {
      save = this._amAuditPlanService.updateItem(this.form.value.id, this.getSaveData());
    } else {
      save = this._amAuditPlanService.saveItem(this.getSaveData());
    }

    save.subscribe((res: any) => {
      AppStore.disableLoading();
      if (!this.form.value.id) {
        this.clearItems();
      }

      this._utilityService.detectChanges(this._cdr)
      if (close) {
        this.closeFormModal();
        this._router.navigateByUrl('/audit-management/am-audit-plans/' + res['id'])
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        // this.processFormErrors();
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
    AnnualPlanFrequencyMasterStore.unsetAllAnnualPlanFrequency();
  }



}
