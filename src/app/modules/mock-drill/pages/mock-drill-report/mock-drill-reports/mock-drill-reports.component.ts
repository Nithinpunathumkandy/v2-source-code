import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MockDrillReportService } from 'src/app/core/services/mock-drill/mock-drill-report/mock-drill-report.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillReportStore } from 'src/app/stores/mock-drill/mock-drill-report/mock-drill-report-store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-reports',
  templateUrl: './mock-drill-reports.component.html',
  styleUrls: ['./mock-drill-reports.component.scss']
})
export class MockDrillReportsComponent implements OnInit {
  MockDrillStore = MockDrillStore;
  MockDrillReportStore = MockDrillReportStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  downloadMessage: string = 'export_mock_drill';
  reactionDisposer: IReactionDisposer;
  @ViewChild('loaderPopUp') loaderPopUp: ElementRef;
  constructor(private _router: Router, private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _mockDrillReportService: MockDrillReportService,
    private _organizationFileService: OrganizationfileService, private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: '' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_REPORT_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MOCK_DRILL_REPORT_LIST', submenuItem: { type: 'refresh' } }
      ];
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addnewMockDrill();
            }, 1000);
            break;
          case "search":
            MockDrillReportStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            MockDrillReportStore.unsetMockDrill();
            this.pageChange(1);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addnewMockDrill();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.pageChange(1);
  }
  // Redirect Page to Add New Mock Drill
  addnewMockDrill() {
    MockDrillReportStore.mock_drill_id = null;
    this._router.navigateByUrl('mock-drill/mock-drills/new');
  }

  pageChange(newPage: number = null) {
    if (newPage) MockDrillReportStore.setCurrentPage(newPage);
    let parms = ''
    this._mockDrillReportService.getItems(false, parms).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // Sorting
  setSort(type) {
    this._mockDrillReportService.sortMockDrillList(type);
    this.pageChange();
  }
  // Returns Image Url according to token

  createImageUrl(token) {
    return this._organizationFileService.getThumbnailPreview('user-profile-picture', token, 160, 262);
  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  exportToPdf(id) {
    setTimeout(() => { $(this.loaderPopUp.nativeElement).modal('show'); }, 100);
    this._mockDrillReportService.exportToPdf(id).subscribe(res => {
      setTimeout(() => { $(this.loaderPopUp.nativeElement).modal('hide'); }, 100);
    });
  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }
}
