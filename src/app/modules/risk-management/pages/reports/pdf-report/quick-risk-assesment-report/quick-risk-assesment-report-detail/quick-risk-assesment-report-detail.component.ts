import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { autorun, IReactionDisposer } from "mobx";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;
@Component({
  selector: "app-quick-risk-assesment-report-detail",
  templateUrl: "./quick-risk-assesment-report-detail.component.html",
  styleUrls: ["./quick-risk-assesment-report-detail.component.scss"],
})
export class QuickRiskAssesmentReportDetailComponent
  implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("addProcessformModal", { static: true }) addProcessformModal: ElementRef;
  @ViewChild("addObservationformModal", { static: true }) addObservationformModal: ElementRef;
  @ViewChild("addRiskMitigationformModal", { static: true }) addRiskMitigationformModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  QuickRiskAssessmentReportStore = QuickRiskAssessmentReportStore;
  quickRiskSummaryModalSubscription: any = null;
  quickRiskAddProcessSummaryModalSubscription: any = null;
  quickRiskAddObervationModalSubscription: any = null;
  quickRiskMitigationModalSubscription: any = null;
  deleteEventSubscription: any;
  selectedIndex: number = 0;

  quickRiskObject = {
    id: null,
    values: null,
    type: null,
  };

  addSummaryObject = {
    id: null,
    values: null,
    type: null,
  }

  addObservationObject = {
    id: null,
    values: null,
    type: null,
  }

  addRiskMitigationObject = {
    id: null,
    values: null,
    type: null,
  }

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
    category: ""
  };
  Id: number;

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _route: ActivatedRoute,
    private _eventEmeitterService: EventEmitterService,
    private _quickRiskAssessmentReportService: QuickRiskAssessmentReportsService,
    private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2:Renderer2
  ) {
    
  }

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof QuickRiskAssesmentReportDetailComponent
   */
  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      QuickRiskAssessmentReportStore.id = params.id;
       this.Id = params.id;
       this.getItem();
    });
    AppStore.showDiscussion = false;
    setTimeout(() => {
		 
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  window.addEventListener('scroll', this.scrollEvent, true);
		  this._utilityService.detectChanges(this._cdr);
	
		}, 250);
    QuickRiskAssessmentReportStore.unsetQuickRiskReportDetails();
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        // { activityName: null, submenuItem: { type: "new_modal" } },
        { activityName: 'EXPORT_QUICK_RISK_ASSESSMENT_REPORT', submenuItem: { type: "download" } },
        { activityName: null, submenuItem: { type: "close", path: "../" } },
      ];
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "download":
            this._quickRiskAssessmentReportService.exportToPdf(this.Id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    // this.getItem();
    this.quickRiskSummaryModalSubscription = this._eventEmeitterService.quickRiskAssessmentModal.subscribe(
      (res) => {
        this.closeFormModal();
        this.getItem();
      }
    );
    this.quickRiskAddProcessSummaryModalSubscription = this._eventEmeitterService.quickRiskAddProcessAssessmentModal.subscribe(
      (res) => {
        this.closeAddProcessFormModal();
        this.getItem();
      }
    );
    this.quickRiskAddObervationModalSubscription = this._eventEmeitterService.quickRiskAddObservationProcessAssessmentModal.subscribe(
      (res) => {
        this.closeAddObservationFormModal();
        this.getItem();
      }
    );
    this.quickRiskMitigationModalSubscription = this._eventEmeitterService.quickRiskAddMitigation.subscribe(
      (res) => {
        this.closeAddRiskMitigationFormModal();
        this.getItem();
      }
    );
    this.deleteEventSubscription = this._eventEmeitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );
  }

  scrollEvent = (event: any): void => {

		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
		  this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
		}
		else {
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
		}
	  }

  modalControl(status: boolean) {
    switch (this.popupObject.category) {
      case "":
        this.deleteExecutive(status);
        break;
        case "Summary":
          this.deleteSummaryItem(status);
          break;         
        case "Observation":
          this.deleteObservationItem(status);
          break;
        case "Action Plan":
          this.deleteActionPlan(status);
          break;
    }
  }

  deleteActionPlan(status:boolean){
    if (status && this.popupObject.id) {
      this._quickRiskAssessmentReportService
        .deleteQuickRiskTreatmentItem(
          QuickRiskAssessmentReportStore.id,
          QuickRiskAssessmentReportStore.reportId,
          this.popupObject.id
        )
        .subscribe(
          (resp) => {
            this.getItem();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopUp();
            this.clearPopupObject();
          }
        );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  deleteExecutive(status: boolean) {
    if (status && this.popupObject.id) {
      this._quickRiskAssessmentReportService
        .deleteQuickRiskItem(
          QuickRiskAssessmentReportStore.id,
          this.popupObject.id
        )
        .subscribe(
          (resp) => {
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopUp();
            this.clearPopupObject();
          }
        );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.category = "";
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }


  getQuickRiskSummary(item: any) {
    this.quickRiskObject.values = {
      id: item.id,
      title: item.title,
      description: item.description,
    };
    this.quickRiskObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  getQuickRiskAddSummary(row: any) {
    this.addSummaryObject.values = {
      id: row.id,
      title: row.title,
      description: row.description,
      risk_category_id: row.risk_category_id,
      risk_score: row.risk_score,
      risk_owner_id: row.risk_owner
    };
    this.addSummaryObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.QuickRiskAssessmentReportStore.id = this.Id,
    this.openAddProcessFormModal();
  }

  getQuickRiskObservation(row: any) {
    // console.log(row);
    if(row.quick_risk_assessment_report_risk_observation){
      this.addObservationObject.values = {
        id: row.quick_risk_assessment_report_risk_observation?.id,
        observation: row.quick_risk_assessment_report_risk_observation?.observation,
        risk_matrix_likelihood_id: row.quick_risk_assessment_report_risk_observation?.risk_matrix_likelihood_id,
        // risk_score: row?.quick_risk_assessment_report_risk_observation?.risk_score,
        risk_rating_id: row?.quick_risk_assessment_report_risk_observation?.risk_rating_id,
        risk_matrix_impact_id: row?.quick_risk_assessment_report_risk_observation?.risk_matrix_impact_id,
        risk_impacts: row?.quick_risk_assessment_report_risk_observation?.risk_impacts,
        risk_causes: row?.quick_risk_assessment_report_risk_observation?.risk_causes,
        risk_area_ids: row?.quick_risk_assessment_report_risk_observation?.risk_areas,
      };
      this.addObservationObject.type = "Edit";
      this._utilityService.detectChanges(this._cdr);
      this.QuickRiskAssessmentReportStore.reportId = row.id;
      this.openAddObservationFormModal();
    } else {
      this.addObservationObject.type = "Add";
      this.addObservationObject.values = null;
      this.QuickRiskAssessmentReportStore.reportId = row.id;
      this.openAddObservationFormModal();
    }
  }

  getQuickRiskMitigation(row,item: any) {
    // console.log(row)
    this.addRiskMitigationObject.values = {
      id: item?.id,
      title: item?.title,
      target_date: this._helperService.processDate(item?.target_date, 'split'),
      // score: item?.score,
      risk_treatment_owner_id: item?.risk_treatment_owner,
      summary_title:row.id
    };
    this.addRiskMitigationObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.QuickRiskAssessmentReportStore.reportId = row.id;
    this.openAddRiskMitigationFormModal();
  }


  getItem() {
    this._quickRiskAssessmentReportService.getItem(this.Id).subscribe((res) => {
      res.quick_risk_assessment_report_risks.find(repId => {
        repId.id;
        this.QuickRiskAssessmentReportStore.reportId = repId.id;
        // console.log(repId.id);
      });
      // console.log(this.QuickRiskAssessmentReportStore.quickAssessmentDetailsReports)
      // console.log(res);
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
      QuickRiskAssessmentReportStore.setIndividualQuickAssessmentReport;
      this._utilityService.detectChanges(this._cdr);
    });
  }

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.category = '';
    this.popupObject.id = id;
    this.popupObject.title = "Delete Quick Risk Summary Report?";
    this.popupObject.subtitle = "common_delete_subtitle";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteSummary(row: any) {
    event.stopPropagation();
    this.popupObject.id = row.id;
    this.popupObject.type=''
    this.popupObject.category = 'Summary'
    this.popupObject.title = "Delete Quick Risk Summary Report?";
    this.popupObject.subtitle = "common_delete_subtitle";
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteQuickRiskMitigation(item: any){
    this.popupObject.id = item.id;
    this.popupObject.type=''
    this.popupObject.category = 'Action Plan'
    this.popupObject.subtitle = "common_delete_subtitle";
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteSummaryItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._quickRiskAssessmentReportService
        .deleteQuickRiskSummaryItem(
          QuickRiskAssessmentReportStore.id,
          this.popupObject.id
        )
        .subscribe(
          (resp) => {
            this.getItem();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopUp();
            this.clearPopupObject();
          }
        );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  deleteObservation(row: any) {
    event.stopPropagation();
    this.popupObject.id = row?.quick_risk_assessment_report_risk_observation?.id;
    this.popupObject.type='';
    this.popupObject.category = "Observation";
    this.popupObject.title = "Delete Quick Risk Summary Report?";
    this.popupObject.subtitle = "common_delete_subtitle";
    QuickRiskAssessmentReportStore.reportId = row.id;
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteObservationItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._quickRiskAssessmentReportService
        .deleteQuickRiskObservationItem(
          QuickRiskAssessmentReportStore.id,
          QuickRiskAssessmentReportStore.reportId,
          this.popupObject.id
        )
        .subscribe(
          (resp) => {
            this.getItem();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            this.closeConfirmationPopUp();
            this.clearPopupObject();
          }
        );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  addNewItem() {
    this.quickRiskObject.type = "Add";
    this.quickRiskObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  addNewProcess() {
    this.addSummaryObject.type = "Add";
    this.addSummaryObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openAddProcessFormModal();
  }

  addNewObservation() {
    this.addObservationObject.type = "Add";
    this.addObservationObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openAddObservationFormModal();
  }

  addNewRiskMitigation() {
    this.addRiskMitigationObject.type = "Add";
    this.addRiskMitigationObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openAddRiskMitigationFormModal();
  }

  openAddObservationFormModal() {
    setTimeout(() => {
      $(this.addObservationformModal.nativeElement).modal("show");
    }, 100);
  }

  openAddProcessFormModal() {
    setTimeout(() => {
      $(this.addProcessformModal.nativeElement).modal("show");
    }, 100);
  }

  openAddRiskMitigationFormModal() {
    setTimeout(() => {
      $(this.addRiskMitigationformModal.nativeElement).modal("show");
    }, 100);
  }


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
    }, 100);
  }

  openPopUp() {
    this.addNewItem();
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this.quickRiskObject.type = null;
  }

  closeAddProcessFormModal() {
    $(this.addProcessformModal.nativeElement).modal("hide");
    this.addSummaryObject.type = null;
  }

  closeAddObservationFormModal() {
    $(this.addObservationformModal.nativeElement).modal("hide");
    this.addObservationObject.type = null;
  }

  closeAddRiskMitigationFormModal() {
    $(this.addRiskMitigationformModal.nativeElement).modal("hide");
    this.addRiskMitigationObject.type = null;
  }

  openModal(type, id) {
    let reptId : any = [];
    QuickRiskAssessmentReportStore?.quickAssessmentDetailsReports?.quick_risk_assessment_report_risks.find(repId => {
        repId.id;
        reptId =  repId.id;
        // console.log(repId.id);
      });
    this.QuickRiskAssessmentReportStore.reportId = reptId;
    switch (type) {
      case 'summary':
        this.addNewProcess()
        break;
        case 'observation':
        this.addNewObservation()
        break;
        case 'action_plan':
        this.addNewRiskMitigation()
        break;
    
      default:
        break;
    }
  }
  selectedIndexChange(index) {
    if (this.selectedIndex == index) this.selectedIndex = null;
    else this.selectedIndex = index;
  }

  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof QuickRiskAssesmentReportDetailComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.quickRiskSummaryModalSubscription.unsubscribe();
    this.QuickRiskAssessmentReportStore.unsetQuickRiskReportDetails();
  }
}
