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
import { ExecutiveSummaryReportsService } from "src/app/core/services/risk-management/reports/executive-summary-reports/executive-summary-reports.service";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-executive-summary-modal",
  templateUrl: "./executive-summary-modal.component.html",
  styleUrls: ["./executive-summary-modal.component.scss"],
})
export class ExecutiveSummaryModalComponent implements OnInit, OnDestroy {
  @Input("source") executiveItemReportSource: any;
  executiveForm: FormGroup;
  formErrors: any;

  executiveSummaryReportType: number = null;

  ExecutiveSummaryStore = ExecutiveReportStore;
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
    private _departmentService: DepartmentService,
    private _eventEmitterService: EventEmitterService,
    private _executiveSummaryReportServce: ExecutiveSummaryReportsService,
    private _router: Router,
  ) {}

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof DetailedErmModalComponent
   */
  ngOnInit() {
    this.buildForm();
    this.setFormValues();
  }

  ngDoCheck() {
    if (
      this.executiveItemReportSource &&
      this.executiveItemReportSource.hasOwnProperty("values") &&
      this.executiveItemReportSource.values &&
      !this.executiveForm.value.id
    )
      this.setFormValues();
  }

  setFormValues() {
    if (
      this.executiveItemReportSource.hasOwnProperty("values") &&
      this.executiveItemReportSource.values
    ) {
      let { id, date, division_id, department_id } = this.executiveItemReportSource.values;
      this.executiveForm.setValue({
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
    this.executiveForm = this._formBuilder.group({
      id: [null],
      date: [null, [Validators.required]],
      division_id: [null, [Validators.required]],
      department_id: [null],
    });
  }

  searchDivision(e) {
    if (this.executiveForm.value) {
      this._divisionService.getItems(false, "&q=" + e.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getDepartment() {
    if (this.executiveForm.value) {
      var params = "";
      params =
        "&division_ids=" +
        (this.executiveForm.value.division_id
          ? this.executiveForm.value.division_id
          : "");
      this._departmentService.getItems(false, params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision() {
    if (this.executiveForm.value) {
      this._divisionService.getItems(false).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  searchDepartment(e) {
    if (this.executiveForm.value) {
      this._departmentService
        .getItems(false,"&division_ids=" + "&q=" + e.term)
        .subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });
    }
  }


  clear(type) {
    if (type == "date") {
      this.executiveForm.patchValue({
        date: null,
      });
    }
  }

  saveExecutiveItem(close: boolean = false) {
    let save;
    let saveData;
    AppStore.enableLoading();
    saveData = {
      id: this.executiveSummaryReportType
        ? this.executiveSummaryReportType
        : null,
      date: this._helperService.processDate(
        this.executiveForm.value.date ? this.executiveForm.value.date : null,
        'join'
      ),
      division_id: this.executiveForm.value.division_id
        ? this.executiveForm.value.division_id
        : null,
      department_id: this.executiveForm.value.department_id
        ? this.executiveForm.value.department_id
        : null,
    };
    // console.log(saveData);
  if (this.executiveForm.value.id) {
    ExecutiveReportStore.id = this.executiveForm.value.id;
    save = this._executiveSummaryReportServce.updateItem(
      this.executiveForm.value.id,
      saveData
    );
  } else {
    delete this.executiveForm.value.id;
    save = this._executiveSummaryReportServce.saveItem(saveData);
  }
    save.subscribe(
      (res: any) => {
        ExecutiveReportStore.id = res.id;
        this._router.navigateByUrl(
          "/risk-management/reports/pdf-report/" + ExecutiveReportStore.id
        );
        this.closeFormModal();
        AppStore.disableLoading();

        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.executiveSummaryReportType = null;
          this.executiveForm.reset();
          if (close) {
            this.closeFormModal();
            this.executiveSummaryReportType = null;
            this.executiveForm.reset();
          }
        }, 300);
      },
      (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 404) {
          AppStore.disableLoading();
          this.executiveSummaryReportType = null;
          this.executiveForm.reset();
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
    this.executiveForm.reset();
    this.executiveForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dissmissExecutiveAddReportModal();
    // this._eventEmitterService.dismissControlAuditableItemChildModal();
  }


  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof ExecutiveSummaryModalComponent
   */
  ngOnDestroy() {}
}
