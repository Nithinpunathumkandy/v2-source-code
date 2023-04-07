import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HttpErrorResponse } from "@angular/common/http";

import { AppStore } from "src/app/stores/app.store";
import { RiskRatingService } from "src/app/core/services/masters/risk-management/risk-rating/risk-rating.service";
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import { RiskRatingMasterStore } from "src/app/stores/masters/risk-management/risk-rating-store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { RiskRatingPaginationResponse } from "src/app/core/models/masters/risk-management/risk-rating";
import { RisksStore } from "src/app/stores/risk-management/risks/risks.store";
import { RiskStatusMasterStore } from "src/app/stores/masters/risk-management/risk-status-store";
import { RiskAreaService } from "src/app/core/services/masters/risk-management/risk-area/risk-area.service";
import { RiskAreaPaginationResponse } from "src/app/core/models/masters/risk-management/risk-area";
import { RiskAreaMasterStore } from "src/app/stores/masters/risk-management/risk-area-store";
import { RiskControlPlanMasterStore } from "src/app/stores/masters/risk-management/risk-control-plan-store";
import { RiskControlPlanService } from "src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import { QuickRiskReportsPaginationResponse } from "src/app/core/models/risk-management/reports/quick-risk-assesment-report";

@Component({
  selector: "app-risk-mitigation-modal",
  templateUrl: "./risk-mitigation-modal.component.html",
  styleUrls: ["./risk-mitigation-modal.component.scss"],
})
export class RiskMitigationModalComponent implements OnInit, OnDestroy {
  @Input("source") ExecutiveAddSummarySource: any;
  mitgationRiskForm: FormGroup;
  mitgationRiskFormError: any;
  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  ExecutiveStore = ExecutiveReportStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  UsersStore = UsersStore;
  RisksStore = RisksStore;
  RiskStatusMasterStore = RiskStatusMasterStore;
  RiskAreaStore = RiskAreaMasterStore;
  RiskControlPlanMasterStore = RiskControlPlanMasterStore;
  QuickRiskStore = QuickRiskAssessmentReportStore;
  


  config = {
    toolbar: [
      { name: "document", items: ["Source", "-", "Preview"] },
      { name: "clipboard", items: ["Undo", "Redo", "Cut", "Copy", "Paste"] },
      {
        name: "basicstyles",
        items: ["Bold", "Italic", "Strike", "-", "RemoveFormat"],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      "/",
      {
        name: "insert",
        items: ["Image", "Table", "HorizontalRule", "SpecialChar"],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
        ],
      },
      { name: "styles", items: ["Format", "Font", "FontSize"] },
      { name: "tools", items: ["Maximize"] },
      { name: "about", items: ["About"] },
    ],
  };

  constructor(
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    public _controlCategService: ControlCategoryService,
    private _quickRiskReportService: QuickRiskAssessmentReportsService,
    private _eventEmitterService: EventEmitterService,
    private _riskRatingService: RiskRatingService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _riskAreaService: RiskAreaService,
  ) {}

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof RiskMitigationModalComponent
   */
  ngOnInit(): void {
    // Form Object to add Control Category

    this.mitgationRiskForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      // score: [null, [Validators.required]],
      risk_treatment_owner_id: ['', [Validators.required]], 
      target_date: ['', [Validators.required]], 
      summary_title: ['']
    });

    this.resetForm();
    this.setFormValues();
  }

  ngDoCheck() {
    if (
      this.ExecutiveAddSummarySource &&
      this.ExecutiveAddSummarySource.hasOwnProperty("values") &&
      this.ExecutiveAddSummarySource.values &&
      !this.mitgationRiskForm.value.id
    ){
      this.setFormValues();
    }
  }

  setFormValues() {
    if (
      this.ExecutiveAddSummarySource.hasOwnProperty("values") &&
      this.ExecutiveAddSummarySource.values
    ) {
      let { id, title, target_date, score, risk_treatment_owner_id, summary_title } = this.ExecutiveAddSummarySource.values;
      // console.log(this.ExecutiveAddSummarySource.values)
      this.mitgationRiskForm.setValue({
        id: id,
        title: title,
        target_date: target_date,
        // score: score ? score : null ,
        risk_treatment_owner_id: risk_treatment_owner_id,
        summary_title: summary_title
      });
    }
  }

  searchRiskRating(e, patchValue: boolean = false) {
    this._riskRatingService.getItems(false, 'q=' + e.term).subscribe((res: RiskRatingPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.mitgationRiskForm.patchValue({ risk_rating_id: i });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getRiskRating() {
    this._riskRatingService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUers(e) {   
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }


  searchSummaryTitle(e) {
    this._quickRiskReportService.getItems(false, 'q=' + e.term).subscribe((res: QuickRiskReportsPaginationResponse) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  getSummaryTitle() {
    this._quickRiskReportService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  clear(type) {
    if (type == "target_date") {
      this.mitgationRiskForm.patchValue({
        target_date: null,
      });
    }
  }

  createSaveData() {
    let saveData = this.mitgationRiskForm.value;
    saveData['target_date'] = this._helperService.processDate(
      this.mitgationRiskForm.value.target_date
        ? this.mitgationRiskForm.value.target_date
        : null,
      'join'
    )
    saveData['risk_treatment_owner_id'] = this.mitgationRiskForm.value.risk_treatment_owner_id ?
    this.mitgationRiskForm.value.risk_treatment_owner_id.id : null;
    return saveData;
  }



  saveRiskMitigation(close: boolean = false) {
    // console.log(this.mitgationRiskForm.value.summary_title)
    // console.log(this.mitgationRiskForm.value.summary_title.id)
    this.mitgationRiskFormError = null;
    if (this.mitgationRiskForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.mitgationRiskForm.value.id) {
        save = this._quickRiskReportService.udpdateQuickRiskTreatmentItem(
          this.QuickRiskStore.id,
          this.mitgationRiskForm.value.summary_title,
          this.mitgationRiskForm.value.id,
          this.createSaveData()
        );
      } else {
        delete this.mitgationRiskForm.value.id;
        // console.log(this.mitgationRiskForm.value);
        // console.log(this.ExecutiveStore.id);

        save = this._quickRiskReportService.saveQuickRiskTreatmentItem(
          this.QuickRiskStore.id,
          this.mitgationRiskForm.value.summary_title,
          this.createSaveData()
        );
      }
      save.subscribe(
        (res: any) => {
          if (!this.mitgationRiskForm.value.id) {
            this.resetForm();
          }
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        },
        (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.mitgationRiskFormError = err.error.errors;
          } else if (err.status == 500 || err.status == 403 || err.status == 404) {
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  cancel() {
    this.closeFormModal();
  }


  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/gi;
    var result = this.mitgationRiskForm.value.description.replace(regex, "");
    return result.length;
  }

  resetForm() {
    this.mitgationRiskForm.reset();
    this.mitgationRiskForm.markAsPristine();
    this.mitgationRiskFormError = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
    let id = ExecutiveReportStore.id;
    // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissQuickRiskAddMitigationModal();
    // this._executiveSummaryReportService.getItem(id);
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
   * @memberof RiskMitigationModalComponent
   */
  ngOnDestroy() {}
}
