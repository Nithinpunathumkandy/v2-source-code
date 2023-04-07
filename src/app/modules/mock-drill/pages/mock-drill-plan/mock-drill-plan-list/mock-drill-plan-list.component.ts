import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { MockDrillPlanStore } from 'src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store';
import { MockDrillPlanService } from 'src/app/core/services/mock-drill/mock-drill-plan/mock-drill-plan.service';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-mock-drill-plan-list',
  templateUrl: './mock-drill-plan-list.component.html',
  styleUrls: ['./mock-drill-plan-list.component.scss']
})
export class MockDrillPlanListComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  MockDrillPlanStore = MockDrillPlanStore;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  popupControlMockDrillPlanEventSubscription: any;
  mailConfirmationData = 'share_mock_drill_plan_message';
  deleteObject = {
    type: '',
    title: 'are_you_sure_want_to_delete_this_mock_drill_plan',
    subtitle: 'are_you_sure_want_to_delete_this_mock_drill_plan',
    id: null,
    all: false
  };
  filterSubscription: Subscription = null;
  constructor(private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _mockDrillPlanService: MockDrillPlanService,
    private _usersService: UsersService,
    private _organizationFileService: OrganizationfileService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RightSidebarLayoutStore.filterPageTag = 'mock_drills';
    RightSidebarLayoutStore.showFilter = true;
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'mock_drill_plan_ids',
      'mock_drill_status_ids',
      'mock_drill_type_ids'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MockDrillPlanStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });
    if (!AuthStore.getActivityPermission(100, 'CREATE_MOCK_DRILL_PLAN')) {
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_mock_drill_plan' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_PLAN_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_MOCK_DRILL_PLAN', submenuItem: { type: 'new_modal' } },
        { activityName: 'MOCK_DRILL_PLAN_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'EXPORT_MOCK_DRILL_PLAN', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'GENERATE_MOCK_DRILL_PLAN_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'SHARE_MOCK_DRILL_PLAN', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_MOCK_DRILL_PLAN', submenuItem: { type: 'import' } },
      ];
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addnewMockDrillPlan();
            }, 1000);
            break;
          case "export_to_excel":
            this._mockDrillPlanService.exportToExcel();
            break;
          case "search":
            MockDrillPlanStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._mockDrillPlanService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_mock_drill_plan');
            ShareItemStore.formErrors = {};
            break;
          case "refresh":
            MockDrillPlanStore.unsetMockDrillPlan();
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_mock_drill_plan');
            ImportItemStore.setImportFlag(true);
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addnewMockDrillPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._mockDrillPlanService.shareData(ShareItemStore.shareData).subscribe(res => {
          ShareItemStore.unsetShareData();
          ShareItemStore.setTitle('');
          ShareItemStore.unsetData();
          $('.modal-backdrop').remove();
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            $(this.mailConfirmationPopup.nativeElement).modal('show');
          }, 200);
        }, (error) => {
          if (error.status == 422) {
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
          console.log(error);
        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._mockDrillPlanService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    });
    MockDrillPlanStore.unsetMockDrillPlanId();
    MockDrillPlanStore.unsetIndividualMockDrillPlan();
    this.popupControlMockDrillPlanEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    SubMenuItemStore.searchText = '';
    this.pageChange(1);
  }
  // Sorting
  setSort(type) {
    this._mockDrillPlanService.sortMockDrillPlanList(type);
    this.pageChange();
  }
  // Modal Control
  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
    }
  }
  // Delete MOck Drill Plan
  delete(status) {
    if (status && this.deleteObject.id) {
      this._mockDrillPlanService.delete(this.deleteObject.id).subscribe(res => {
        this.closeConfirmationPopup();
        this.clearDeleteObject();
        this._utilityService.detectChanges(this._cdr);
      }, (error => {
        this.closeConfirmationPopup();
        this.clearDeleteObject();
      }))
    }
    else {
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }
  deletePlan(val) {
    this.deleteObject.id = val.id;
    this.deleteObject.all = false;
    this.deleteObject.type = '';
    this.deleteObject.title = 'are_you_sure_want_to_delete_this_mock_drill_plan';
    this.deleteObject.subtitle = 'are_you_sure_want_to_delete_this_mock_drill_plan';
    $(this.deletePopup.nativeElement).modal('show');
  }
  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
  }
  // Get all users
  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // Redirect Page to Add New Mock Drill
  addnewMockDrillPlan() {
    this._router.navigateByUrl('mock-drill/mock-drill-plans/new');
  }
  // Edit Mock Drill Plan
  editMockDrillPlan(id) {
    MockDrillPlanStore.setMockDrillPlanId(id);
    this._mockDrillPlanService.getItem(id).subscribe(res => {
      this._router.navigateByUrl('mock-drill/mock-drill-plans/edit');
    });
  }
  mockDrillDetails(id) {
    this._router.navigateByUrl('mock-drill/mock-drill-plans/' + id);
  }
  pageChange(newPage: number = null) {
    if (newPage) MockDrillPlanStore.setCurrentPage(newPage);
    let parms = "&used_plan_id";
    this._mockDrillPlanService.getItems(false, parms).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // Returns Image Url according to token

  createImageUrl(token) {
    return this._organizationFileService.getThumbnailPreview('user-profile-picture', token, 160, 262);
  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MockDrillPlanStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlMockDrillPlanEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
  }

}
