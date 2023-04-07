import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmAnnualAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-annual-auditable-item/am-annual-audit-plan.service';
import { AmAuditPlanService } from 'src/app/core/services/audit-management/am-audit-plan/am-audit-plan.service';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-am-audit-modal',
  templateUrl: './am-audit-modal.component.html',
  styleUrls: ['./am-audit-modal.component.scss']
})
export class AmAuditModalComponent implements OnInit {
  @Input('source') auditSource: any;

  @ViewChild('cancelPopup') cancelPopup: ElementRef;

  @ViewChild('userPopup') userPopup: ElementRef;
  form: FormGroup;
  cancelEventSubscription: any;
  formErrors = null;
  AppStore = AppStore;
  userDetails;
  AmAuditsStore = AmAuditsStore;
  AmAnnualAuditPlansStore = AmAnnualAuditPlansStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AmAuditPlansStore = AmAuditPlansStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'am_audit_cancel_confirmation',
    type: 'Cancel'
  };
  methodologyList = [];
  planStartDate = null;
  planEndDate = null;
  minDate = null;
  maxDate = null;
  userPopupEventSubscription: any;
  constructor(private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _amAuditService: AmAuditService,
    private _amAnnualAuditPlanService: AmAnnualAuditPlanService,
    private _amAuditPlanService: AmAuditPlanService,
    private _router: Router,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      am_audit_plan_id: [null],
      am_individual_audit_plan_id: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      description: [''],
      objective: [''],
      criteria: [''],
      scope: [''],
      out_of_scope: [''],
      am_audit_methodologies: [[]]
    });
    this.AmAnnualAuditPlansStore.unsetIndiviudalAnnualAuditPlanDetails();
    if (this.auditSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancel(item);
    })

    this.userPopupEventSubscription = this._eventEmitterService.userPopupModal.subscribe(item => {
      this.closeModal();
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
    if (this.auditSource && this.auditSource.hasOwnProperty('values') && this.auditSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
    this.clearItems();
    this._eventEmitterService.dismissAuditManagementAuditAddModal();
  }

  clearItems() {
    this.form.reset();
    this.formErrors = null;
  }


  setFormValues() {
    if (this.auditSource.hasOwnProperty('values') && this.auditSource.values) {
      let { id, am_individual_audit_plan_id, start_date, end_date, description, objective, criteria, scope, out_of_scope, am_audit_methodologies } = this.auditSource.values
      this.form.patchValue({
        id: id,
        am_audit_plan_id: am_individual_audit_plan_id?.am_annual_plan_id,
        am_individual_audit_plan_id: am_individual_audit_plan_id?.id,
        start_date: start_date,
        end_date: end_date,
        description: description,
        objective: objective,
        criteria: criteria,
        scope: scope,
        out_of_scope: out_of_scope,
        // am_audit_methodologies: am_audit_methodologies

      })
      this.methodologyList = this._helperService.getArrayProcessed(am_audit_methodologies, 'title');
      this.searchAuditPlan({ term: am_individual_audit_plan_id?.am_annual_plan_id });
      this.getIndividualAuditPlan('am_individual_audit_plan_ids=' + am_individual_audit_plan_id?.id,true);
      this.getIndividualAuditDetails(false);
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
        end_date: null
      })
    }
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  processMethodologyArray() {
    let methodologyArray = [];
    for (let risk of this.methodologyList) {
      methodologyArray.push({ title: risk });
    }
    return methodologyArray;
  }

  getSaveData() {
    let saveData = {
      am_individual_audit_plan_id: this.form.value.am_individual_audit_plan_id,
      start_date: this._helperService.processDate(this.form.value.start_date, 'join'),
      end_date: this._helperService.processDate(this.form.value.end_date, 'join'),
      description: this.form.value.description,
      objective: this.form.value.objective,
      criteria: this.form.value.criteria,
      scope: this.form.value.scope,
      out_of_scope: this.form.value.out_of_scope,
      am_audit_methodologies: this.processMethodologyArray()
    }
    return saveData;
  }

  startAudit(close: boolean = false) {

    this.formErrors = null;
    AppStore.enableLoading();
    let save;
    if (this.form.value.id) {
      save = this._amAuditService.updateItem(this.form.value.id, this.getSaveData());
    } else {
      //delete this.form.value.id
      save = this._amAuditService.saveItem(this.getSaveData());
    }

    save.subscribe((res: any) => {
      AppStore.disableLoading();
      if (!this.form.value.id) {
        this.clearItems();
      }

      // this.closeFormModal();
      this._utilityService.detectChanges(this._cdr)
      if (close) {
        this.closeFormModal();
        this._router.navigateByUrl('/audit-management/am-audits/' + res['id'])
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

  getIndividualAuditPlan(params?,edit:boolean=false) {

    if (this.form.value.am_audit_plan_id) {
      params = params ? params + '&am_annual_plan_ids=' + this.form.value.am_audit_plan_id : 'am_annual_plan_ids=' + this.form.value.am_audit_plan_id;
    }
    params = params ? params + '&is_approved=true&am_audit_manager=true' : 'is_approved=true&am_audit_manager=true';
    if(!edit){
      params=params+'&is_not_audited=true';
    }
    this._amAnnualAuditPlanService.getItems(false, (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchIndividualAuditPlan(e) {
    let params = '&is_approved=true&am_audit_manager=true&is_not_audited=true';
    if (this.form.value.am_audit_plan_id) {
      params = params + '&am_annual_plan_ids=' + this.form.value.am_audit_plan_id;
    }
    // params=params?params+'&is_approved=true&audit_manager=true':'is_approved=true&audit_manager=true';
    this._amAnnualAuditPlanService.getItems(false, 'q=' + e.term + params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getIndividualAuditDetails(patch: boolean = true) {
    if (this.form.value.am_individual_audit_plan_id) {
      this._amAnnualAuditPlanService.getItem(this.form.value.am_individual_audit_plan_id).subscribe(res => {
        this.planStartDate = this._helperService.processDate(res['start_date'], 'split');
        this.planEndDate = this._helperService.processDate(res['end_date'], 'split');

        if (patch)
          this.formatCalendar(res);
        this._utilityService.detectChanges(this._cdr);

      })

    }

  }

  formatCalendar(res) {
    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let planStart = this.planStartDate;
    let planEnd = this.planEndDate;
    planStart.month = planStart.month - 1;
    planEnd.month = planEnd.month - 1;
    var year = this.planStartDate.year;
    var year2 = this.planEndDate.year;

    switch (res['am_annual_plan_frequency_item']?.type) {

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



  getManagerPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    this.userDetails = userDetial;
    this.openUserPopup();

    // return userDetial;
  }

  getAuditorPopupDetails(users) {
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name ? users?.first_name : '';
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
    this.userDetails = userDetial;
    this.openUserPopup();
    // return userDetial;
  }
  getArrayFormattedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }


  addMethodology() {
    this.formErrors=null;
    if (this.form.value.am_audit_methodologies) {
      let pos=this.methodologyList.findIndex(e=>e==this.form.value.am_audit_methodologies);
      if(pos!=-1)
      this.formErrors={'am_audit_methodologies':'Title already taken'}
      else
      this.methodologyList.push(this.form.value.am_audit_methodologies);
     
    }
    this.form.patchValue({
      am_audit_methodologies: null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeMethodology(index) {
    this.methodologyList.splice(index, 1);
  }

  getAuditPlan() {
    this._amAuditPlanService.getItems(false, 'is_approved=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditPlan(e) {
    this._amAuditPlanService.getItems(false, 'q=' + e.term + '&is_approved=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  openUserPopup() {
    $(this.userPopup.nativeElement).modal('show');
  }

  closeModal() {
    this.userDetails = null;
    $(this.userPopup.nativeElement).modal('hide');
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }


  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
    AmAnnualAuditPlansStore.unsetIndiviudalAnnualAuditPlanDetails();
  }



}
