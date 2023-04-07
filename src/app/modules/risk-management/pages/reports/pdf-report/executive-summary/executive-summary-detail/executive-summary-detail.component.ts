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
import {executiveSummaryReportDetail,
} from "src/app/core/models/risk-management/reports/executive-summary-report";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { ExecutiveSummaryReportsService } from "src/app/core/services/risk-management/reports/executive-summary-reports/executive-summary-reports.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { ExecutiveReportStore } from "src/app/stores/risk-management/reports/executive-summary/executive-summary-store";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
declare var $: any;
@Component({
  selector: "app-executive-summary-detail",
  templateUrl: "./executive-summary-detail.component.html",
  styleUrls: ["./executive-summary-detail.component.scss"],
})
export class ExecutiveSummeryDetailComponent implements OnInit, OnDestroy {
  @ViewChild("formModal", { static: true }) formModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
  
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  ExecutiveSummaryStore = ExecutiveReportStore;
  executiveSummaryModalSubscription: any = null;
  deleteEventSubscription: any;
  selectedIndex: number = 0;

  executiveObject = {
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

  Id: number;

  constructor(
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _route: ActivatedRoute,
    private _executiveSummaryReportService: ExecutiveSummaryReportsService,
    private _eventEmeitterService: EventEmitterService,
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
   * @memberof ExecutiveSummeryDetailComponent
   */
  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      ExecutiveReportStore.id = params.id;  
      this.Id = params.id;
      this.getItem();
    });
    AppStore.showDiscussion = false;
    setTimeout(() => {
		 
		  this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
		  window.addEventListener('scroll', this.scrollEvent, true);
		  this._utilityService.detectChanges(this._cdr);
	
		}, 250);

    ExecutiveReportStore.unsetExcecutiveSummaryDetails();
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_EXECUTIVE_SUMMARY_REPORT_DETAIL', submenuItem: { type: "new_modal" } },
        { activityName: 'EXPORT_EXECUTIVE_SUMMARY_REPORT', submenuItem: { type: "download" } },
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
            this._executiveSummaryReportService.exportToPdf(this.Id);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    // this.getItem();
    this.executiveSummaryModalSubscription = this._eventEmeitterService.executiveSummaryModal.subscribe(
      (res) => {
        this.closeFormModal();
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
    switch (this.popupObject.type) {
      case "":
        this.deleteExecutive(status);
        break;
    }
  }

  deleteExecutive(status: boolean) {
    if (status && this.popupObject.id) {
      this._executiveSummaryReportService
        .deleteExecutiveItem(ExecutiveReportStore.id, this.popupObject.id)
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
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';
  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
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


  getExecuteSummary(id: number) {
    const executeSummary: executiveSummaryReportDetail = ExecutiveReportStore.getExecutiveSymmaryDetailedById(
      id
    );
    //set form value
    this.executiveObject.values = {
      id: executeSummary.id,
      title: executeSummary.title,
      description: executeSummary.description,
      order: executeSummary.order
    };
    this.executiveObject.type = "Edit";
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  getItem() {
    this._executiveSummaryReportService.getItem(this.Id).subscribe((res) => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100);
      this._utilityService.detectChanges(this._cdr);
    });
  }

  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "delete_executive_summary";
    this.popupObject.subtitle = "common_delete_subtitle";

    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  addNewItem() {
    this.executiveObject.type = "Add";
    this.executiveObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
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
    this.executiveObject.type = null;
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
   * @memberof ExecutiveSummeryDetailComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.executiveSummaryModalSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    this.ExecutiveSummaryStore.unsetExcecutiveSummaryDetails();
  }
}
