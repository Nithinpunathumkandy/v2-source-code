import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from "src/app/stores/app.store";
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { HttpErrorResponse } from "@angular/common/http";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-quick-risk-assesment-report-modal",
  templateUrl: "./quick-risk-assesment-report-modal.component.html",
  styleUrls: ["./quick-risk-assesment-report-modal.component.scss"],
})
export class QuickRiskAssesmentReportModalComponent
  implements OnInit, OnDestroy {
  @Input("source") quickRiskItemReportSource: any;
  quickRiskForm: FormGroup;
  formErrors: any;

  quickRiskAssessmentReportType: number = null;

  QuickRiskStore = QuickRiskAssessmentReportStore;
  RisksStore = RisksStore;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;

  constructor(
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _divisionService: DivisionService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _departmentService: DepartmentService,
    private _eventEmitterService: EventEmitterService,
    private _quickRiskReportSummary: QuickRiskAssessmentReportsService
  ) {}

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof QuickRiskAssesmentReportModalComponent
   */
  ngOnInit() {
    this.buildForm();
  }

  ngDoCheck() {
    if (
      this.quickRiskItemReportSource &&
      this.quickRiskItemReportSource.hasOwnProperty("values") &&
      this.quickRiskItemReportSource.values &&
      !this.quickRiskForm.value.id
    )
      this.setFormValues();
  }

  setFormValues() {
    if (
      this.quickRiskItemReportSource.hasOwnProperty("values") &&
      this.quickRiskItemReportSource.values
    ) {
      let { id, date, division_id, department_id } = this.quickRiskItemReportSource.values;
      this.quickRiskForm.setValue({
        id: id,
        date: date,
        division_id: division_id,
        department_id: department_id
      });
      this.getDivision();
      this.getDepartment();
      this._utilityService.detectChanges(this._cdr);
    }

  }

  buildForm() {
    this.quickRiskForm = this._formBuilder.group({
      id: [null],
      date: [null, [Validators.required]],
      division_id: [null, [Validators.required]],
      department_id: [null],
    });
  }

  searchDivision(e) {
    if (this.quickRiskForm.value) {
      this._divisionService.getItems(false, "&q=" + e.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getDepartment() {
    if (this.quickRiskForm.value) {
      var params = "";
      params =
        "&division_ids=" +
        (this.quickRiskForm.value.division_id
          ? this.quickRiskForm.value.division_id
          : "");
      this._departmentService.getItems(false, params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision() {
    if (this.quickRiskForm.value) {
      this._divisionService.getItems(false).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  searchDepartment(e) {
    if (this.quickRiskForm.value) {
      this._departmentService
        .getItems(false,"&division_ids=" + "&q=" + e.term)
        .subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });
    }
  }


  clear(type) {
    if (type == "date") {
      this.quickRiskForm.patchValue({
        date: null,
      });
    }
  }

  saveQuickRiskItem(close: boolean = false) {
    let save;
    let saveData;
    AppStore.enableLoading();
    saveData = {
      id: this.quickRiskAssessmentReportType
        ? this.quickRiskAssessmentReportType
        : null,
      date: this._helperService.processDate(
        this.quickRiskForm.value.date ? this.quickRiskForm.value.date : null,
        'join'
      ),
      division_id: this.quickRiskForm.value.division_id
        ? this.quickRiskForm.value.division_id
        : null,
      department_id: this.quickRiskForm.value.department_id
        ? this.quickRiskForm.value.department_id
        : null,
    };
    // console.log(saveData);
    if (this.quickRiskForm.value.id) {
      this.QuickRiskStore = this.quickRiskForm.value.id;
    save = this._quickRiskReportSummary.updateItem(
      this.quickRiskForm.value.id,
      saveData);
    } else {
      delete this.quickRiskForm.value.id;
      save = this._quickRiskReportSummary.saveItem(saveData);
    }
    // if (this.formObject.type == 'Edit')
    save.subscribe(
      (res: any) => {
        QuickRiskAssessmentReportStore.id = res.id;
        this._router.navigateByUrl(
          "/risk-management/reports/pdf-report/quick-risk-assesment/" + QuickRiskAssessmentReportStore.id
        );
        this.closeFormModal();
        AppStore.disableLoading();

        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.quickRiskAssessmentReportType = null;
          this.quickRiskForm.reset();
          if (close) {
            this.closeFormModal();
            this.quickRiskAssessmentReportType = null;
            this.quickRiskForm.reset();
          }
        }, 300);
      },
      (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 404) {
          AppStore.disableLoading();
          this.quickRiskAssessmentReportType = null;
          this.quickRiskForm.reset();
          this.closeFormModal();
        } else {
          this._utilityService.showErrorMessage(
            "Error",
            "Something Went Wrong Try Again Later"
          );
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    );
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.quickRiskForm.reset();
    this.quickRiskForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dissmissQuickRiskAddReportModal();
  }


  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof QuickRiskAssesmentReportModalComponent
   */
  ngOnDestroy() {}
}
