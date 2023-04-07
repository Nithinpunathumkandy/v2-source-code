import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Subscription } from 'rxjs';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-program-list',
  templateUrl: './mock-drill-program-list.component.html',
  styleUrls: ['./mock-drill-program-list.component.scss']
})
export class MockDrillProgramListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  MockDrillProgramStore = MockDrillProgramStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  mailConfirmationData = 'share_mock_drill_program_message';
  deleteObject = {
    type: '',
    title: 'are_you_sure_want_to_delete_this_mock_drill_program',
    subtitle: 'are_you_sure_want_to_delete_this_mock_drill_program',
    id: null,
    all: false
  };
  filterSubscription: Subscription = null;
  popupControlMockDrillEventSubscription: any;
  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _mockDrillProgramService: MockDrillProgramService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    RightSidebarLayoutStore.filterPageTag = 'mock_drills';
    RightSidebarLayoutStore.showFilter = true;
    MockDrillProgramStore.unsetIndividualMockDrillProgram();
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'mock_drill_type_ids'
    ]);
    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.MockDrillProgramStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange();
    });
    if (!AuthStore.getActivityPermission(100, 'CREATE_MOCK_DRILL_PROGRAM')) {
      NoDataItemStore.deleteObject('subtitle');
      NoDataItemStore.deleteObject('buttonText');
    }
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_mock_drill_program' });
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MOCK_DRILL_PROGRAM_LIST', submenuItem: { type: 'search' } },
        { activityName: 'MOCK_DRILL_PROGRAM_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_MOCK_DRILL_PROGRAM', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_MOCK_DRILL_PROGRAM_ TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_MOCK_DRILL_PROGRAM', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_MOCK_DRILL_PROGRAM', submenuItem: { type: 'import' } },
        { activityName: 'SHARE_MOCK_DRILL_PROGRAM', submenuItem: { type: 'share' } },
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
            this._mockDrillProgramService.exportToExcel();
            break;
          case "search":
            MockDrillProgramStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "template":
            this._mockDrillProgramService.generateTemplate();
            break;
          case "share":
            ShareItemStore.setTitle('share_mock_drill_program');
            ShareItemStore.formErrors = {};
            break;
          case "refresh":
            MockDrillProgramStore.unsetMockDrillProgram();
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_mock_drill_program');
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
        this._mockDrillProgramService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._mockDrillProgramService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

  // Redirect Page to Add New Mock Drill Program
  addnewMockDrill() {
    MockDrillProgramStore.mock_drill_program_id = null;
    this._router.navigateByUrl('mock-drill/mock-drill-programs/add');
  }

  // Edit Mock Drill Program
  editMockDrill(id) {
    MockDrillProgramStore.setMockDrillProgramId(id);
    this._mockDrillProgramService.getItem(id).subscribe(res => {
      this._router.navigateByUrl('mock-drill/mock-drill-programs/edit');
    });
  }
  // Mock Drill Program Details
  mockDrillProgramDetails(id) {
    this._router.navigateByUrl('mock-drill/mock-drill-programs/' + id);
  }
  // Page Change
  pageChange(newPage: number = null) {
    if (newPage) MockDrillProgramStore.setCurrentPage(newPage);
    this._mockDrillProgramService.getItems(false, '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // Sorting
  setSort(type) {
    this._mockDrillProgramService.sortMockDrillProgramList(type);
    this.pageChange();
  }

  // Modal Control
  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
    }
  }
  // Delete MOck Drill Program
  delete(status) {
    if (status && this.deleteObject.id) {
      this._mockDrillProgramService.delete(this.deleteObject.id).subscribe(res => {
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
  //Delete Mock Drill
  deleteMockDrill(val) {
    this.deleteObject.id = val.id;
    this.deleteObject.all = false;
    this.deleteObject.type = '';
    this.deleteObject.title = 'are_you_sure_want_to_delete_this_mock_drill_program';
    this.deleteObject.subtitle = 'are_you_sure_want_to_delete_this_mock_drill_program';
    $(this.deletePopup.nativeElement).modal('show');
  }

  closeConfirmationPopup() {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    MockDrillProgramStore.searchText = null;
    SubMenuItemStore.searchText = '';
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlMockDrillEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    RightSidebarLayoutStore.showFilter = false;
    // this.filterSubscription.unsubscribe();
  }
}
