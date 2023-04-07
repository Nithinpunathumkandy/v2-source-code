import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AmAuditableItemService } from 'src/app/core/services/audit-management/am-audit-plan/am-auditable-item/am-auditable-item.service';
import { AmAuditableItemStore } from 'src/app/stores/audit-management/am-audit-plan/am-auditable-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAnnualAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AnnualPlanFrequencyItemMasterStore } from 'src/app/stores/masters/audit-management/annual-audit-plan-frequency-item-store';
import { AnnualAuditPlanFrequencyItemService } from 'src/app/core/services/masters/audit-management/annual-audit-plan-frequency-item/annual-audit-plan-frequency-item.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
declare var $: any;
@Component({
  selector: 'app-am-annual-audit-plan-modal',
  templateUrl: './am-annual-audit-plan-modal.component.html',
  styleUrls: ['./am-annual-audit-plan-modal.component.scss']
})
export class AmAnnualAuditPlanModalComponent implements OnInit {
  @Input('source') auditPlanSource: any;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;

  formErrors = null;
  form: FormGroup;
  AmAuditableItemStore = AmAuditableItemStore;
  DepartmentStore = DepartmentMasterStore;
  UsersStore = UsersStore;
  AnnualPlanFrequencyItemMasterStore = AnnualPlanFrequencyItemMasterStore;
  AmAuditPlanStore = AmAuditPlansStore;
  AppStore = AppStore;
  cancelEventSubscription: any;


  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };
  planStartDate = null;
  planEndDate = null;
  minDate = null;
  maxDate = null;


  constructor(private _auditableItemService: AmAuditableItemService,
    private _formBuilder: FormBuilder,
    private _departmentService: DepartmentService,
    private _usersService: UsersService,
    private _annualPlanFrequencyService: AnnualAuditPlanFrequencyItemService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _annualAuditPlanService: AmAnnualAuditPlanService,
    private _eventEmitterService: EventEmitterService,
    private _auditPlanService: AmAuditPlanService
  ) { }

  ngOnInit(): void {
    AnnualPlanFrequencyItemMasterStore.unsetsetAllAnnualPlanFrequencyItem();
    this.form = this._formBuilder.group({
      id: [null],
      am_annual_plan_id: [null],
      am_annual_plan_auditable_item_id: [null, [Validators.required]],
      am_annual_plan_frequency_item_id: [null, [Validators.required]],
      audit_manager_id: [null, [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      hours: [''],
      user_ids: [[], [Validators.required]],
      department_ids: [null, [Validators.required]]
    })
    if (this.auditPlanSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancel(item);
    })

    this.planStartDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.start_date, 'split');
    this.planEndDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.end_date, 'split');


  }


  getAnnualAuditPlan(id) {
    this._annualAuditPlanService.getItem(id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  clearFrequency() {
    this.form.patchValue({
      am_annual_plan_frequency_item_id: null,
      start_date: '',
      end_date: '',
      hours: ''
    })
  }


  getAuditableItems() {

    this._auditableItemService.getAuditableItems(false, 'is_not_exist=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchAuditableItems(e) {
    this._auditableItemService.getAuditableItems(false, 'q=' + e.term + '&is_not_exist=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  getAuditfrequency() {
    if (this.form.value?.id) {
      this._annualPlanFrequencyService.getItems(false, 'am_annual_plan_auditable_item_ids=' + this.form.value.am_annual_plan_auditable_item_id + '&am_individual_audit_plan_ids=' + this.form.value?.id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    }
    else {
      this._annualPlanFrequencyService.getItems(false, 'am_annual_plan_auditable_item_ids=' + this.form.value.am_annual_plan_auditable_item_id + '&is_not_exist=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    }

  }

  searchAuditFrequency(e) {
    if (this.form.value?.id) {
      this._annualPlanFrequencyService.getItems(false, 'q=' + e.term + '&am_annual_plan_auditable_item_ids=' + this.form.value.am_annual_plan_auditable_item_id + '&am_individual_audit_plan_ids=' + this.form.value?.id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    }
    else {
      this._annualPlanFrequencyService.getItems(false, 'q=' + e.term + '&am_annual_plan_auditable_item_ids=' + this.form.value.am_annual_plan_auditable_item_id + '&is_not_exist=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    }
  }


  formatCalendar() {
    let res
    let pos = AnnualPlanFrequencyItemMasterStore.allItems.findIndex(e => e.id == this.form.value.am_annual_plan_frequency_item_id);
    if (pos != -1) {
      res = AnnualPlanFrequencyItemMasterStore.allItems[pos].type;
    }
    this.planStartDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.start_date, 'split');
    this.planEndDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.end_date, 'split');


    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
   this.minDate = null;
    this.maxDate = null;
    this.form.patchValue({
      start_date:null,
      end_date:null
    })

    let planStart = this.planStartDate;
    let planEnd = this.planEndDate;
    planStart.month = planStart.month - 1;
    planEnd.month = planEnd.month - 1;
    // let today = new Date()
    var year = this.planStartDate.year;
    var year2 = this.planEndDate.year;
    switch (res) {
      case 'y': this.form.patchValue({
        start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
        end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
      })
        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'h1':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 0, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 5, 30)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {
            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;

      case 'h2':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 6, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 11, 31)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'q1':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 2, 31)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 0, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 2, 31)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 2, 31)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'q2':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 3, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 3, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 3, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 5, 30)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 3, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'q3':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 8, 30)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 6, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 8, 30)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 8, 30)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'q4':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 9, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
            })
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 9, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 9, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 11, 31)), 'split') : this.planEndDate
              })
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime())) {

            this.form.patchValue({
              start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 9, 1)), 'split') : this.planStartDate,
              end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
            })
          }
        }

        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;
      case 'jan':
      case 'feb':
      case 'mar':
      case 'apr':
      case 'may':
      case 'jun':
      case 'jul':
      case 'aug':
      case 'sep':
      case 'oct':
      case 'nov':
      case 'dec':
        let pos = months.findIndex(e => e == res);
        if (pos != -1) {
          // let days = new Date(year, pos, 0).getDate();
          let days = new Date(year, pos + 1, 0).getDate();
          let days2 = new Date(year2, pos + 1, 0).getDate();
          if (year != year2) {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, days)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, days)), 'split') : this.planEndDate
              })
            }
            else {
              if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, pos, 1)).getTime())) {

                this.form.patchValue({
                  start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, pos, 1)), 'split') : this.planStartDate,
                  end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, pos, days2)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, pos, days2)), 'split') : this.planEndDate
                })
              }
            }
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime())) {

              this.form.patchValue({
                start_date: (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, 1)), 'split') : this.planStartDate,
                end_date: (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, days)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, days)), 'split') : this.planEndDate
              })
            }
          }

        }
        this.minDate = this.form.value.start_date;
        this.maxDate = this.form.value.end_date;
        break;

    }
  }

  getMinMaxDate() {
    this.planStartDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.start_date, 'split');
    this.planEndDate = this._helperService.processDate(AmAuditPlansStore.individualAuditPlanDetails?.end_date, 'split');

    let res
    console.log(AnnualPlanFrequencyItemMasterStore.allItems);
    let pos = AnnualPlanFrequencyItemMasterStore.allItems.findIndex(e => e.id == this.form.value.am_annual_plan_frequency_item_id);
    if (pos != -1) {
      res = AnnualPlanFrequencyItemMasterStore.allItems[pos].type;
    }
    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    // let today = new Date()
    let planStart = this.planStartDate;
    let planEnd = this.planEndDate;
    planStart.month = planStart.month - 1;
    planEnd.month = planEnd.month - 1;
    // let today = new Date()
    var year = this.planStartDate.year;
    var year2 = this.planEndDate.year;
    switch (res) {
      case 'y':

        this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
          this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate

        break;
      case 'h1':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {
            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 0, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 5, 30)), 'split') : this.planEndDate
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {
            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
          }
        }

        break;

      case 'h2':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 6, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 11, 31)), 'split') : this.planEndDate
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
          }
        }
        break;
      case 'q1':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 2, 31)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 0, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 2, 31)), 'split') : this.planEndDate
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 0, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 0, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 0, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 2, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 2, 31)), 'split') : this.planEndDate
          }
        }

        break;
      case 'q2':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 3, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 3, 1)).getTime())) {
              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 3, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 5, 30)), 'split') : this.planEndDate
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 3, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime())) {

            this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 3, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 3, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 5, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 5, 30)), 'split') : this.planEndDate
          }
        }
        break;
      case 'q3':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 8, 30)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime())) {

                this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 6, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 8, 30)), 'split') : this.planEndDate

            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 6, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 6, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 6, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 8, 30)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 8, 30)), 'split') : this.planEndDate
          }
        }

        break;
      case 'q4':
        if (year != year2) {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 9, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 9, 1)).getTime())) {

                this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 9, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, 11, 31)), 'split') : this.planEndDate
            }
          }
        }
        else {
          if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 9, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime())) {

              this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, 9, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 9, 1)), 'split') : this.planStartDate,
              this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, 11, 31)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, 11, 31)), 'split') : this.planEndDate
          }
        }

        break;
      case 'jan':
      case 'feb':
      case 'mar':
      case 'apr':
      case 'may':
      case 'jun':
      case 'jul':
      case 'aug':
      case 'sep':
      case 'oct':
      case 'nov':
      case 'dec':
        let pos = months.findIndex(e => e == res);
        if (pos != -1) {
          // let days = new Date(year, pos, 0).getDate();
          let days = new Date(year, pos + 1, 0).getDate();
          let days2 = new Date(year2, pos + 1, 0).getDate();
          if (year != year2) {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime())) {

                this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, days)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, days)), 'split') : this.planEndDate

            }
            else {
              if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, pos, 1)).getTime())) {

                  this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year2, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, pos, 1)), 'split') : this.planStartDate,
                  this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year2, pos, days2)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year2, pos, days2)), 'split') : this.planEndDate
              }
            }
          }
          else {
            if (((new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, 1)).getTime()) && ((new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime())) {

                this.minDate = (new Date(planStart.year, planStart.month, planStart.day)).getTime() <= (new Date(year, pos, 1)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, 1)), 'split') : this.planStartDate,
                this.maxDate = (new Date(planEnd.year, planEnd.month, planEnd.day)).getTime() >= (new Date(year, pos, days)).getTime() ? this._helperService.processDate(this._helperService.passSaveFormatDate(new Date(year, pos, days)), 'split') : this.planEndDate
            }
          }

        }
        break;

    }
  }


  clear(type) {
    if (type == 'start_date') {
      this.form.patchValue({
        start_date: null
      })
    }
    else {
      this.form.patchValue({
        target_date: null
      })
    }
  }


  /**
  * Search Department
  * @param e e.term - character to search
  */
  searchDepartment(e) {

    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  // Get Department
  getDepartment() {

    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getUsers() {
    var params = '?page=1&is_auditor=true';

    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUsers(e) {
    let params = '?page=1&is_auditor=true';

    if (params) params = params + '&q=' + e.term;
    else params = '?q=' + e.term;
    this._usersService.searchUsers(params ? params : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getTypes(types) {
    let type = [];
    for (let i of types) {
      type.push(i.id);
    }
    return type;
  }




  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }


  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  getSaveData() {
    let saveData = {
      am_annual_plan_id: this.AmAuditPlanStore.auditPlanId,
      am_annual_plan_auditable_item_id: this.form.value.am_annual_plan_auditable_item_id,
      am_annual_plan_frequency_item_id: this.form.value.am_annual_plan_frequency_item_id,
      audit_manager_id: this.form.value.audit_manager_id?.id,
      start_date: this._helperService.processDate(this.form.value.start_date, 'join'),
      end_date: this._helperService.processDate(this.form.value.end_date, 'join'),
      hours: this.form.value.hours,
      user_ids: this.getTypes(this.form.value.user_ids),
      department_ids: [this.form.value.department_ids]
    }
    return saveData;
  }

  save(close: boolean = false) {

    this.formErrors = null;
    AppStore.enableLoading();
    let save;
    if (!this.form.value.id)
      save = this._annualAuditPlanService.saveItem(this.getSaveData());
    else
      save = this._annualAuditPlanService.updateItem(this.form.value.id, this.getSaveData());

    save.subscribe((res: any) => {

      AppStore.disableLoading();
      if (!this.form.value.id) {
        this.form.reset();
      }
      this.getAnnualAuditPlan(res['id']);
      this._auditPlanService.getItem(AmAuditPlansStore.individualAuditPlanDetails?.id).subscribe(resp => {
        this._utilityService.detectChanges(this._cdr);


      });
      this._utilityService.detectChanges(this._cdr)
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
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
    this.deleteObject.type = 'Cancel';
    this.deleteObject.subtitle = 'am_annual_audit_plan_cancel_confirm';

    setTimeout(() => {
      $(this.cancelPopup?.nativeElement).modal('show');
    }, 100);

  }


  closeFormModal() {
    this.clearItems();
    this._eventEmitterService.dismissAuditManagementAnnualAuditPlanAddModal();
  }
  clearItems() {
    this.form.reset();
    this.formErrors = null;
  }



  setFormValues() {
    if (this.auditPlanSource.hasOwnProperty('values') && this.auditPlanSource.values) {
      let { id, am_annual_plan_id, am_annual_plan_auditable_item_id, am_annual_plan_frequency_item_id,
        audit_manager_id, start_date, end_date, hours, user_ids, department_ids } = this.auditPlanSource.values
      this.form.patchValue({
        id: id,
        am_annual_plan_id: am_annual_plan_id,
        am_annual_plan_auditable_item_id: am_annual_plan_auditable_item_id?.id,
        am_annual_plan_frequency_item_id: am_annual_plan_frequency_item_id?.id,
        audit_manager_id: audit_manager_id,
        start_date: start_date,
        end_date: end_date,
        hours: hours,
        user_ids: user_ids,
        department_ids: department_ids[0]?.id
      })

      this._auditableItemService.getAuditableItems(false, 'am_annual_plan_auditable_item_ids=' + am_annual_plan_auditable_item_id?.id).subscribe();
      this._annualPlanFrequencyService.getItems(false, 'am_annual_plan_frequency_ids=' + AmAuditPlansStore?.individualAuditPlanDetails?.am_annual_plan_frequency?.id).subscribe(res => {
        this.getMinMaxDate();
      });
    }

    this.getDepartment();
    this.getUsers();
  }




  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
  }

}
