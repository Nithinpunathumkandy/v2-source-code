import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { QuickRiskAssessmentReportsService } from "src/app/core/services/risk-management/reports/quick-risk-assessment-reports/quick-risk-assessment-reports.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { QuickRiskAssessmentReportStore } from "src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { autorun, IReactionDisposer } from "mobx";
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { IndividualQuickRiskDetail, QuickRiskReportList } from "src/app/core/models/risk-management/reports/quick-risk-assesment-report";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
declare var $: any;

@Component({
  selector: "app-quick-risk-assesment-report",
  templateUrl: "./quick-risk-assesment-report.component.html",
  styleUrls: ["./quick-risk-assesment-report.component.scss"],
})
export class QuickRiskAssesmentReportComponent implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("titleInput") titleInput: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  @ViewChild("mailConfirmationPopup") mailConfirmationPopup: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  QuickRiskAssessmentReportStore = QuickRiskAssessmentReportStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  deleteEventSubscription: any;
  quickRiskItemModalSubscription: any = null;
  reactionDisposer: IReactionDisposer;
  
  quickRiskItemObject = {
    id: null,
    values: null,
    type: null,
  };
  
  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };


  constructor(
    private _quickRiskAssessmentReportServive: QuickRiskAssessmentReportsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmeitterService: EventEmitterService,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
  ) {}
  /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof QuickRiskAssesmentReportComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!",
      subtitle: 'Add an item if there is any. To add, simply tap the button below.', 
      buttonText: 'New Quick Risk Assessment Register Item'});
     if(NoDataItemStore.clikedNoDataItem){
       this.addNewItem();
      //  console.log('working')
      NoDataItemStore.unSetClickedNoDataItem();
    }
    });
    this.getItems(1);
    this.deleteEventSubscription = this._eventEmeitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );
    this.quickRiskItemModalSubscription = this._eventEmeitterService.quickRiskAddReportModal.subscribe(
      (res) => {
        this.closeFormModal();
      }
    );
  }

  getItems(newPage: number = null) {
    if (newPage) QuickRiskAssessmentReportStore.setCurrentPage(newPage);
    this._quickRiskAssessmentReportServive
      .getItems(false, "")
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  setQuickAssessmentSort(type, callList: boolean = true) {
    this._quickRiskAssessmentReportServive.sortQuickReportList(type, callList);
  }

   /**
   * @description
   * this method is used for getting the router params
   *
   * @memberof QuickRiskAssesmentReportComponent
   */
  getDetails(id) {
    QuickRiskAssessmentReportStore.id = id;
    this._router.navigateByUrl(
      "/risk-management/reports/pdf-report/quick-risk-assesment/" + id
    );
  }


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "Delete Quick Risk Summary?";
    this.popupObject.subtitle = "Delete Quick Risk Summary";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }
  deleteExecutive(status: boolean) {
    if (status && this.popupObject.id) {
      this._quickRiskAssessmentReportServive
        .deleteItem(this.popupObject.id)
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

  getQuickRiskSummary(id: number) {
    event.stopPropagation();
    const quickSummary: QuickRiskReportList = QuickRiskAssessmentReportStore.getQuickRiskById(
      id
    );
    // console.log(quickSummary.id);
   
    //set form value
    this.quickRiskItemObject.values = {
      id: quickSummary.id,
      date: this._helperService.processDate(quickSummary.date, 'split'),
      division_id: quickSummary.division_id,
      department_id: quickSummary.department_id,
    };
    this.quickRiskItemObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  addNewItem() {
    this.quickRiskItemObject.type = "Add";
    this.quickRiskItemObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openPopup() {
    this.addNewItem();
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this.quickRiskItemObject.type = null;
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
    }, 100);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteExecutive(status);
        break;
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof QuickRiskAssesmentReportComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    this.deleteEventSubscription.unsubscribe();
    this.quickRiskItemModalSubscription.unsubscribe();
    QuickRiskAssessmentReportStore.searchText=null;
  }
}
