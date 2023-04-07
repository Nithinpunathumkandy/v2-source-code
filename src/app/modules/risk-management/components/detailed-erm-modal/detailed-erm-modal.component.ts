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
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { ErmDetailsReportsService } from "src/app/core/services/risk-management/reports/erm-deatils-reports/erm-deatils-reports.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErmDetailsStore } from "src/app/stores/risk-management/reports/erm-details/erm-details-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-detailed-erm-modal",
  templateUrl: "./detailed-erm-modal.component.html",
  styleUrls: ["./detailed-erm-modal.component.scss"],
})
export class DetailedErmModalComponent implements OnInit, OnDestroy {
  @Input("source") ErmDetailSource: any;
  ermDetailForm: FormGroup;
  formErrors: any;

  ermDetailReportType: number = null;

  ErmDetailStore = ErmDetailsStore;
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
    private _ermDetailReportServuce: ErmDetailsReportsService,
    private _eventEmitterService: EventEmitterService,
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
      this.ErmDetailSource &&
      this.ErmDetailSource.hasOwnProperty("values") &&
      this.ErmDetailSource.values &&
      !this.ermDetailForm.value.id
    )
      this.setFormValues();
  }

  setFormValues() {
    if (
      this.ErmDetailSource.hasOwnProperty("values") &&
      this.ErmDetailSource.values
    ) {
      let { id, start_date, end_date, division_id, department_id } = this.ErmDetailSource.values;
      this.ermDetailForm.setValue({
        id: id,
        start_date: start_date,
        end_date: end_date,
        division_id: division_id,
        department_id: department_id
      });
      this.getDivision();
      this.getDepartment();
      this._utilityService.detectChanges(this._cdr);
    }
  }


  buildForm() {
    this.ermDetailForm = this._formBuilder.group({
      id: [null],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      division_id: [null, [Validators.required]],
      department_id: [null],
    });
  }

  searchDivision(e) {
    if (this.ermDetailForm.value) {
      this._divisionService.getItems(false, "&q=" + e.term).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getDepartment() {
    if (this.ermDetailForm.value) {
      var params = "";
      params =
        "&division_ids=" +
        (this.ermDetailForm.value.division_id
          ? this.ermDetailForm.value.division_id
          : "");
      this._departmentService.getItems(false, params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision() {
    if (this.ermDetailForm.value) {
      this._divisionService.getItems(false).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    } else {
      this.DivisionStore.setAllDivision([]);
    }
  }

  searchDepartment(e) {
    if (this.ermDetailForm.value) {
      this._departmentService
        .getItems(false,"&division_ids=" + "&q=" + e.term)
        .subscribe((res) => {
          this._utilityService.detectChanges(this._cdr);
        });
    }
  }


  clear(type) {
    if (type == "start_date") {
      this.ermDetailForm.patchValue({
        start_date: null,
      });
    } else {
      this.ermDetailForm.patchValue({
        target_date: null,
      });
    }
  }

  saveErm(close: boolean = false) {
    let save;
    let saveData;
    AppStore.enableLoading();
    saveData = {
      id: this.ermDetailReportType ? this.ermDetailReportType : null,
      start_date: this._helperService.processDate(
        this.ermDetailForm.value.start_date
          ? this.ermDetailForm.value.start_date
          : null,
        'join'
      ),
      end_date: this._helperService.processDate(
        this.ermDetailForm.value.end_date
          ? this.ermDetailForm.value.end_date
          : null,
        'join'
      ),
      division_id: this.ermDetailForm.value.division_id
        ? this.ermDetailForm.value.division_id
        : null,
      department_id: this.ermDetailForm.value.department_id
        ? this.ermDetailForm.value.department_id
        : null,
    };
    // console.log(saveData);

    if (this.ermDetailForm.value.id) {
      this.ErmDetailStore.id = this.ermDetailForm.value.id;
      save = this._ermDetailReportServuce.updateItem(
        this.ermDetailForm.value.id,
        saveData
      );
    } else {
      delete this.ermDetailForm.value.id;
      save = this._ermDetailReportServuce.saveItem(saveData);
    }
 
    save.subscribe(
      (res: any) => {
        ErmDetailsStore.id = res.id;
        this._router.navigateByUrl(
          "/risk-management/reports/pdf-report/detailed-erm-report/" + ErmDetailsStore.id
        );
        this.closeFormModal()
        AppStore.disableLoading();

        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.ermDetailReportType = null;
          this.ermDetailForm.reset();
          if (close) {
            this.closeFormModal();
            this.ermDetailReportType = null;
            this.ermDetailForm.reset();
          }
        }, 300);
      },
      (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 404) {
          AppStore.disableLoading();
          this.ermDetailReportType = null;
          this.ermDetailForm.reset();
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

  resetForm() {
    this.ermDetailForm.reset();
    this.ermDetailForm.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissErmDetailsModal();
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }



  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof DetailedErmModalComponent
   */
  ngOnDestroy() {}
}
