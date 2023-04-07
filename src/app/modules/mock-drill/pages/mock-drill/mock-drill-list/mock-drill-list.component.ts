import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { autorun, IReactionDisposer } from 'mobx';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-mock-drill-list',
  templateUrl: './mock-drill-list.component.html',
  styleUrls: ['./mock-drill-list.component.scss']
})
export class MockDrillListComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  MockDrillStore = MockDrillStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  popupControlMockDrillEventSubscription: any;
  mailConfirmationData = 'share_mock_drill_message';
  deleteObject = {
    type: '',
    title: 'are_you_sure_want_to_delete_this_mock_drill',
    subtitle: 'are_you_sure_want_to_delete_this_mock_drill',
    id: null,
    all: false
  };
  filterSubscription: Subscription = null;
  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _mockDrillService: MockDrillService,
    private _eventEmitterService: EventEmitterService,
    private _organizationFileService: OrganizationfileService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RightSidebarLayoutStore.filterPageTag = 'mock_drills';
    RightSidebarLayoutStore.showFilter = true;
    MockDrillStore.unsetIndividualMockDrill();
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'mock_drill_plan_ids',
      'mock_drill_status_ids',
      'mock_drill_type_ids',
      'incident_controller_ids'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MockDrillStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });
    if (!AuthStore.getActivityPermission(100, 'CREATE_MOCK_DRILL')) {
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_mock_drill' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MOCK_DRILL_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_MOCK_DRILL', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_MOCK_DRILL_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_MOCK_DRILL', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_MOCK_DRILL', submenuItem: { type: 'import' } },
        { activityName: 'SHARE_MOCK_DRILL', submenuItem: { type: 'share' } },
      ];
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addnewMockDrill();
            }, 1000);
            break;
          case "export_to_excel":
            this._mockDrillService.exportToExcel();
            break;
          case "search":
            MockDrillStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._mockDrillService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_mock_drill');
            ShareItemStore.formErrors = {};
            break;
          case "refresh":
            MockDrillStore.unsetMockDrill();
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_mock_drill');
            ImportItemStore.setImportFlag(true);
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addnewMockDrill();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._mockDrillService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._mockDrillService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
    this.popupControlMockDrillEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    SubMenuItemStore.searchText = '';
    this.pageChange(1);
  }
  // Redirect Page to Add New Mock Drill
  addnewMockDrill() {
    MockDrillStore.mock_drill_id = null;
    this._router.navigateByUrl('mock-drill/mock-drills/new');
  }
  // Edit Mock Drill 
  editMockDrill(id) {
    MockDrillStore.setMockDrillId(id);
    this._mockDrillService.getItem(id).subscribe(res => {
      this._router.navigateByUrl('mock-drill/mock-drills/edit');
    });
  }
  // Sorting
  setSort(type) {
    this._mockDrillService.sortMockDrillList(type);
    this.pageChange();
  }
  mockDrillDetails(id) {
    this._router.navigateByUrl('mock-drill/mock-drills/' + id);
  }
  pageChange(newPage: number = null) {
    if (newPage) MockDrillStore.setCurrentPage(newPage);
    let parms = ''
    this._mockDrillService.getItems(false, parms).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // Modal Control
  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
    }
  }
  // Delete MOck Drill 
  delete(status) {
    if (status && this.deleteObject.id) {
      this._mockDrillService.delete(this.deleteObject.id).subscribe(res => {
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
  deleteMockDrill(val) {
    this.deleteObject.id = val.id;
    this.deleteObject.all = false;
    this.deleteObject.type = '';
    this.deleteObject.title = 'are_you_sure_want_to_delete_this_mock_drill';
    this.deleteObject.subtitle = 'are_you_sure_want_to_delete_this_mock_drill';
    $(this.deletePopup.nativeElement).modal('show');
  }
  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
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
    MockDrillStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlMockDrillEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    this.filterSubscription.unsubscribe();
  }
}
