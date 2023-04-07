import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KHReportStore } from 'src/app/stores/knowledge-hub/kh-report/kh-report-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { KhReportDetailsService } from 'src/app/core/services/knowledge-hub/kh-report/kh-report-details.service';

declare var $: any;
@Component({
  selector: 'app-kh-count-list',
  templateUrl: './kh-count-list.component.html',
  styleUrls: ['./kh-count-list.component.scss']
})
export class KhCountListComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  KHReportStore = KHReportStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  id: string;
  riskcountType: string;
  reactionDisposer: IReactionDisposer;
  filterDateObject: { startDate: string, endDate: string };

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null

  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _khReportDetailsService: KhReportDetailsService,
  ) {
    this._route.params.subscribe(params => {
      this.id = params.id;
      this.riskcountType = params.riskcountType;
    });
  }

  ngOnInit(): void {

    if (!KHReportStore.selectedReportObject)
      this._router.navigateByUrl('/knowledge-hub/reports');
    else {
      if (!SubMenuItemStore.datefilterValue) SubMenuItemStore.datefilterValue = 'year';
      this.filterDateObject = this._helperService.getStartEndDate(SubMenuItemStore.datefilterValue);

      NoDataItemStore.setNoDataItems({ title: "common_no_kh_title" });
      this.BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
      if (SubMenuItemStore.DatefilterValue != '') {
        if(SubMenuItemStore.DatefilterValue != 'custom')
          this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
        else {
          this.filterDateObject = SubMenuItemStore.filterDateObject;
          this.pageChange(1);
        }
        // this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
      }
      this.reactionDisposer = autorun(() => {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'datefilter' } },
          { activityName: this.KHReportStore.selectedReportObject.activityname, submenuItem: { type: 'export_to_excel' } },
          { activityName: null, submenuItem: { type: 'close', path: `/knowledge-hub/reports/${this.riskcountType}` } },
        ]
        this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
        if (SubMenuItemStore.clikedSubMenuItem) {
          switch (SubMenuItemStore.clikedSubMenuItem.type) {
            case "export_to_excel":
              let params = '';
              if (this.filterDateObject.startDate) {
                params = `?from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
              }
              this._khReportDetailsService.exportToExcel(this.KHReportStore.selectedReportObject, params);
              break;
            default:
              break;
          }
          if (SubMenuItemStore.clikedSubMenuItem.type != 'export_to_excel') {
            this.processDateFilterSelected(SubMenuItemStore.DatefilterValue);
          }
          // Don't forget to unset clicked item immediately after using it
          SubMenuItemStore.unSetClickedSubMenuItem();
          
        }
      })
    }
  }

  getPopupDetails(user) {
    // event.stopPropagation();
    this.userDetailObject.id = user.created_by_id;
    this.userDetailObject.first_name = user.created_by_first_name;
    this.userDetailObject.last_name = user.created_by_last_name;
    this.userDetailObject.designation = user.created_by_designation_title;
    this.userDetailObject.image_token = user.created_by_image_token;
    this.userDetailObject.email = user.created_by_email;
    this.userDetailObject.mobile = user.created_by_mobile;
    this.userDetailObject.department = user.created_by_department ? user.created_by_department : null;
    this.userDetailObject.status_id = user.created_by_status_id ? user.created_by_status_id : 1;

    return this.userDetailObject;
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // selecting type of date range need to apply on the filtering of the data
  processDateFilterSelected(dateType: any): void {
    if (dateType === "custom") {

      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else {
      this.filterDateObject = this._helperService.getStartEndDate(dateType);
      KHReportStore.khRisktlistmakeEmpty();
      this.pageChange(1);
    }
  }

  // for moving to each risk when we click on them
  getRisk(id: any): void {
    this._router.navigateByUrl(`knowledge-hub/documents/${id}`);
  }

  // output from custom-date-popup recieved here
  passDates(dateObject): any {
    KHReportStore.khRisktlistmakeEmpty();
    this.filterDateObject = dateObject;
    SubMenuItemStore.filterDateObject = dateObject;
    this.pageChange(1);
  }

  // setting pagination
  pageChange(newPage: number = null) {
    let params = null;
    if (this.filterDateObject.startDate) {
      params = `&from=${this.filterDateObject.startDate}&to=${this.filterDateObject.endDate}`;
    }
    if (newPage) KHReportStore.setCurrentPage(newPage);
    this._khReportDetailsService.getKHItemsDetails(this.id, this.KHReportStore.selectedReportObject, params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }

}
