import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { autorun, IReactionDisposer } from "mobx";
import { ErmReportList } from "src/app/core/models/risk-management/reports/ermDetailreport";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { ErmDetailsReportsService } from "src/app/core/services/risk-management/reports/erm-deatils-reports/erm-deatils-reports.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { NoDataItemStore } from "src/app/stores/general/no-data-item.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { ErmDetailsStore } from "src/app/stores/risk-management/reports/erm-details/erm-details-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;
@Component({
  selector: "app-detailed-erm-report",
  templateUrl: "./detailed-erm-report.component.html",
  styleUrls: ["./detailed-erm-report.component.scss"],
})
export class DetailedErmReportComponent implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  ErmDetailsStore = ErmDetailsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  ermDetModalSubscription: any = null;
  deleteEventSubscription: any;
  reactionDisposer: IReactionDisposer;

  ermDetObject = {
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
    private _ermDetailedReportService: ErmDetailsReportsService,
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
   * @memberof DetailedErmReportComponent
   */
  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!",
      subtitle: 'Add an item if there is any. To add, simply tap the button below.', 
      buttonText: 'New Erm Detail Register Item'});
      NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!", subtitle: 'Add an item if there is any. To add, simply tap the button below.', buttonText: 'New Erm Detail Register Item'});
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewItem();
       NoDataItemStore.unSetClickedNoDataItem();
     }
    });

    this.getItems(1);
    this.deleteEventSubscription = this._eventEmeitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );
    this.ermDetModalSubscription = this._eventEmeitterService.ermDetailsModal.subscribe(
      (res) => {
        this.closeFormModal();
      }
    );
  }

  addNewItem() {
    this.ermDetObject.type = "Add";
    this.ermDetObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openPopUp() {
    this.addNewItem();
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal("hide");
    this.ermDetObject.type = null;
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal("show");
    }, 100);
  }

  getItems(newPage: number = null) {
    if (newPage) ErmDetailsStore.setCurrentPage(newPage);
    this._ermDetailedReportService
      .getItems(false, "")
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  setErmSort(type, callList: boolean = true) {
    this._ermDetailedReportService.sortErmReportList(type, callList);
  }

   /**
   * @description
   * this method is used for getting the router params
   *
   * @memberof DetailedErmReportComponent
   */
  getDetails(id) {
      ErmDetailsStore.id = id;
      this._router.navigateByUrl(
        "/risk-management/reports/pdf-report/detailed-erm-report/" + id
      );
  }


  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token);
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case "":
        this.deleteErmDetail(status);
        break;
    }
  }

  getErmDetailSummary(id: number) {
    event.stopPropagation();
    const ermSummary: ErmReportList = ErmDetailsStore.getErmDetailById(
      id
    );
    //set form value
    this.ermDetObject.values = {
      id: ermSummary.id,
      start_date: this._helperService.processDate(ermSummary.start_date,'split'), 
      end_date: this._helperService.processDate(ermSummary.end_date,'split'),
      division_id: ermSummary.division_id,
      department_id: ermSummary.department_id,
    };
    this.ermDetObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  deleteErmDetail(status: boolean) {
    if (status && this.popupObject.id) {
      this._ermDetailedReportService.deleteItem(this.popupObject.id).subscribe(
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


  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "delete_erm_detail";
    this.popupObject.subtitle = "delete_erm_detail";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof DetailedErmReportComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    NoDataItemStore.unsetNoDataItems();
    this.deleteEventSubscription.unsubscribe();
    this.ermDetModalSubscription.unsubscribe();
    ErmDetailsStore.searchText=null;
    SubMenuItemStore.searchText = '';
  }
}
