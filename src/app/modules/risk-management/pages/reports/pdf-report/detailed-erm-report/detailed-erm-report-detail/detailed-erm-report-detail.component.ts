import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { autorun, IReactionDisposer } from "mobx";
import { ErmDetailedrisk, riskTreatment } from "src/app/core/models/risk-management/reports/ermDetailreport";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ErmDetailsReportsService } from "src/app/core/services/risk-management/reports/erm-deatils-reports/erm-deatils-reports.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { ErmDetailsStore } from "src/app/stores/risk-management/reports/erm-details/erm-details-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;
@Component({
  selector: "app-detailed-erm-report-detail",
  templateUrl: "./detailed-erm-report-detail.component.html",
  styleUrls: ["./detailed-erm-report-detail.component.scss"],
})
export class DetailedErmReportDetailComponent implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("treatmentFormModal", { static: true }) treatmentFormModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  ErmDetailsStore = ErmDetailsStore;
  reactionDisposer: IReactionDisposer;
  Id: number;
  editErmDetailRiskModalSubscription: any = null;
  editErmDetailRiskTreatmentModalSubscription: any = null;
  deleteEventSubscription: any;

  editErmDetailRiskObject = {
    id: null,
    values: null,
    type: null,
  };

  editErmDetailRiskTreatmentObject = {
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

  constructor(
    private _helperService: HelperServiceService,
    private _route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _ermDetailedReportService: ErmDetailsReportsService,
    private _cdr: ChangeDetectorRef,
    private _eventEmeitterService: EventEmitterService,
    private _renderer2:Renderer2
  ) {
   
  }

  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof DetailedErmReportDetailComponent
   */
  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      ErmDetailsStore.id = params.id;
      this.Id = params.id;
      this.getItem();
    });
    AppStore.showDiscussion = false;
    setTimeout(() => {
		 
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  window.addEventListener('scroll', this.scrollEvent, true);
		  this._utilityService.detectChanges(this._cdr);
	
		}, 250);

    ErmDetailsStore.unsetERMDetails();
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        // { activityName: null, submenuItem: { type: "new_modal" } },
        { activityName: 'EXPORT_DETAILED_ERM_REPORT', submenuItem: { type: "download" } },
        { activityName: null, submenuItem: { type: "close", path: "../" } },
      ];
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "new_modal":
          //   setTimeout(() => {}, 1000);
          //   break;
          case "download":
            this._ermDetailedReportService.exportToPdf(this.Id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    // this.getItem();
    this.editErmDetailRiskModalSubscription = this._eventEmeitterService.editErmDetailRiskModal.subscribe(
      (res) => {
        this.closeFormModal();
        this.getItem();
      }
    );
    this.editErmDetailRiskTreatmentModalSubscription = this._eventEmeitterService.editErmDetailRiskTreatmentModal.subscribe(
      (res) => {
        this.closeTreatmentFormModal();
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

  getItem() {
    this._ermDetailedReportService.getItem(this.Id).subscribe((res) => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this.editErmDetailRiskObject.type = null;
    this.editErmDetailRiskTreatmentObject.type = null;
  }

  closeTreatmentFormModal() {
    $(this.treatmentFormModal.nativeElement).modal("hide");
    this.editErmDetailRiskTreatmentObject.type = null;
  }

  // addNewItem() {
  //   this.editErmDetailRiskTreatmentObject.type = "Add";
  //   this.editErmDetailRiskTreatmentObject.values = null; // for clearing the value
  //   this._utilityService.detectChanges(this._cdr);
  //   this.openTreatmentFormModal();
  // }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
    }, 100);
  }

  openTreatmentFormModal() {
    setTimeout(() => {
      $(this.treatmentFormModal.nativeElement).modal("show");
    }, 100);
  }

  // openPopup() {
  //   this.addNewItem();
  // }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteRiskItem(status);
        break;
        case "Treatment":
          this.deleteTreatmentItem(status);
          break;  
    }
  }

  deleteRisk(id: number) {
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.category = '';
    this.popupObject.title = "delete_erm_reports";
    this.popupObject.subtitle = "common_delete_subtitle";
    // this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteRiskItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._ermDetailedReportService
        .deleteErmDetailRisk(ErmDetailsStore.id, this.popupObject.id)
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

  deleteTreatment(id: number) {
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.category = 'Treatment'
    this.popupObject.title = "delete_erm_reports";
    this.popupObject.subtitle = "common_delete_subtitle";
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  deleteTreatmentItem(status: boolean) {
    if (status && this.popupObject.id) {
      this._ermDetailedReportService
        .deleteErmDetailRiskTreatment(ErmDetailsStore.id, this.popupObject.id)
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


  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getERmSummary(id: number) {
    const executeSummary: ErmDetailedrisk = ErmDetailsStore.getIndidualDetailRiskById(
      id
    );
    //set form value
    this.editErmDetailRiskObject.values = {
      id: executeSummary.id,
      title: executeSummary.title,
      description: executeSummary.description,
      observation: executeSummary.observation,
      risk_matrix_likelihood_id: executeSummary.risk_matrix_likelihood_id,
      score: executeSummary.score,
      risk_rating_id: executeSummary.risk_rating_id,
      risk_status_id: executeSummary.risk_status_id,
      risk_owner_id: executeSummary.risk_owner,
      risk_category_id: executeSummary.risk_category_id,
      risk_impacts: executeSummary.detailed_erm_report_risk_impacts,
      risk_causes: executeSummary.detailed_erm_report_risk_causes,
      risk_area_ids: executeSummary.risk_areas,
      risk_matrix_impact_id: executeSummary.risk_matrix_impact_id,
    };
    this.editErmDetailRiskObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }



  getERmRiskTreatmentSummary(id: number, pos: number) {
    const TreatmentSummary: riskTreatment = ErmDetailsStore.getIndidualDetailRiskTreatmentById(
      id, pos
    );
    //set form value
    this.editErmDetailRiskTreatmentObject.values = {
      id: TreatmentSummary.id,
      title: TreatmentSummary.title,
      dependency: TreatmentSummary.dependency,
      target_date: TreatmentSummary.target_date,
      responsible_user_id: TreatmentSummary.responsible_user,
      risk_treatment_status_id: TreatmentSummary.risk_treatment_status_id
    };
    this.editErmDetailRiskTreatmentObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openTreatmentFormModal();
  }


  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof DetailedErmReportDetailComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.editErmDetailRiskModalSubscription.unsubscribe();
    this.editErmDetailRiskTreatmentModalSubscription.unsubscribe();
    this.ErmDetailsStore.unsetIndividulaErmDetailReport();
    this.deleteEventSubscription.unsubscribe();
  }
}
