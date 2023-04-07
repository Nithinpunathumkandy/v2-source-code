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
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { ExecutiveSummaryReportsService } from "src/app/core/services/risk-management/reports/executive-summary-reports/executive-summary-reports.service";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { autorun, IReactionDisposer } from "mobx";
import { ExecutiveReportList, IndividualExecutiveDetail } from "src/app/core/models/risk-management/reports/executive-summary-report";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
declare var $: any;
@Component({
  selector: "app-executive-summary",
  templateUrl: "./executive-summary.component.html",
  styleUrls: ["./executive-summary.component.scss"],
})
export class ExecutiveSummeryComponent implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };

  executiveItemObject = {
    id: null,
    values: null,
    type: null,
  };

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  deleteEventSubscription: any;
  ExecutiveReportStore = ExecutiveReportStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  exeutiveItemModalSubscription: any = null;
  reactionDisposer: IReactionDisposer;
  
  constructor(
    private executiveSummaryService: ExecutiveSummaryReportsService,
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
   * @memberof ExecutiveSummeryComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!",
      subtitle: 'Add an item if there is any. To add, simply tap the button below.', 
      buttonText: 'New Executive Summary Register Item'});
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
    this.exeutiveItemModalSubscription = this._eventEmeitterService.executiveAddReportModal.subscribe(
      (res) => {
        this.closeFormModal();
      }
    );
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteExecutive(status);
        break;
    }
  }

  getItems(newPage: number = null) {
    if (newPage) ExecutiveReportStore.setCurrentPage(newPage);
    this.executiveSummaryService
      .getItems(false, "")
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  setErmSort(type, callList: boolean = true) {
    this.executiveSummaryService.sortExecutiveReportList(type, callList);
  }

   /**
   * @description
   * this method is used for getting the router params
   *
   * @memberof ExecutiveSummeryComponent
   */
  getDetails(id) {
    ExecutiveReportStore.id = id;
    this._router.navigateByUrl("/risk-management/reports/pdf-report/" + id);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  addNewItem() {
    this.executiveItemObject.type = "Add";
    this.executiveItemObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openPopUp() {
    this.addNewItem();
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this.executiveItemObject.type = null;
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
    }, 100);
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "delete_executive_summary";
    this.popupObject.subtitle = "delete_executive_summary";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  getExecutiveSummary(id: number) {
    event.stopPropagation();
    const ermSummary: ExecutiveReportList = ExecutiveReportStore.getExecuteSummaryById(
      id
    );
    // console.log(ermSummary.id);
   
    //set form value
    this.executiveItemObject.values = {
      id: ermSummary.id,
      date: this._helperService.processDate(ermSummary.date, 'split'),
      division_id: ermSummary.division_id,
      department_id: ermSummary.department_id,
    };
    this.executiveItemObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  deleteExecutive(status: boolean) {
    if (status && this.popupObject.id) {
      this.executiveSummaryService.deleteItem(this.popupObject.id).subscribe(
        (resp) => {
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },
      );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
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
   * @memberof ExecutiveSummeryComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    this.deleteEventSubscription.unsubscribe();
    this.exeutiveItemModalSubscription.unsubscribe();
    ExecutiveReportStore.searchText=null;
  }
}
