import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BCMDashboardStore } from 'src/app/stores/bcm/bcm-dashboard/bcm-dashboard-store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-test-and-exercise-list',
  templateUrl: './test-and-exercise-list.component.html',
  styleUrls: ['./test-and-exercise-list.component.scss']
})
export class TestAndExerciseListComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  TestAndExerciseStore = TestAndExerciseStore
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  mailConfirmationData = 'share_bcp_message';
  testObject = {
    component: 'test_and_exrecise',
    values: null,
    type: null
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  bcpModalSubscription: any = null;
  popupControlSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  exerciseModalSubscription: any;
  filterSubscription: Subscription = null;
  
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _testAndExerciseService: TestAndExerciseService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.TestAndExerciseStore.loaded = false;
      this.pageChange(1);
    })

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_test_exercise' });
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'TEST_AND_EXERCISE_LIST', submenuItem: { type: 'search' } },
        { activityName: 'TEST_AND_EXERCISE_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_TEST_AND_EXERCISE', submenuItem: { type: 'new_modal' } },
        // { activityName: null, submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_TEST_AND_EXERCISE', submenuItem: { type: 'export_to_excel' } },
        // {activityName: null, submenuItem: {type: 'import'}},
      ]
      this._helperService.checkSubMenuItemPermissions(2800, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addNewTest();
            break;
          case "search":
            TestAndExerciseStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            TestAndExerciseStore.unsetTreatmentList();
            this.pageChange(1);
            break;
          case "template":
            this._testAndExerciseService.generateTemplate();
            break;
          case "export_to_excel":
            this._testAndExerciseService.exportToExcel();
            break;
          case "import":
            ImportItemStore.setTitle('import_division');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewTest();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        // this._bcpService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
        //   ImportItemStore.unsetFileDetails();
        //   ImportItemStore.setTitle('');
        //   ImportItemStore.setImportFlag(false);
        //   $('.modal-backdrop').remove();
        //   this._utilityService.detectChanges(this._cdr);
        // },(error)=>{
        //   if(error.status == 422){
        //     ImportItemStore.processFormErrors(error.error.errors);
        //   }
        //   else if(error.status == 500 || error.status == 403){
        //     ImportItemStore.unsetFileDetails();
        //     ImportItemStore.setImportFlag(false);
        //     $('.modal-backdrop').remove();
        //   }
        //   this._utilityService.detectChanges(this._cdr);
        // })
      }
    })
    this.exerciseModalSubscription = this._eventEmitterService.exerciseAddModal.subscribe(item => {
      this.closeFormModal();
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteBcp(item);
    })
    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status && $(this.formModal.nativeElement).hasClass('show')) {
        this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
        this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      }
    })
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);
    
  RightSidebarLayoutStore.filterPageTag = 'bcm_test_and_excercise';
  this._rightSidebarFilterService.setFiltersForCurrentPage([
    'organization_ids',
    'division_ids',
    'department_ids',
    'section_ids',
    'sub_section_ids',
    'bcm_ids',
    'test_and_exercise_status_ids',
    'test_and_exercise_type_ids',
    'test_and_exercise_lead_user_ids',
    'bcm_ids'
  ]);
    this.pageChange(1)
  }

  pageChange(newPage: number = null) {
    if (newPage) TestAndExerciseStore.setCurrentPage(newPage);
    var additionalParams=''
    if (BCMDashboardStore.dashboardParameter) {
      additionalParams = BCMDashboardStore.dashboardParameter
    }
    this._testAndExerciseService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  redirectToDetailsPage(id){
    TestAndExerciseStore.selectedId = id
    this._router.navigateByUrl('bcm/test-and-exercises/'+TestAndExerciseStore.selectedId);
  }

  addNewTest() {
    this.testObject.type = 'Add';
    this.testObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFormModal() {
    this.testObject.type = null;
    this.testObject.values = null;
    setTimeout(() => {
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.formModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  gotoBcpDetails(id: number) {
    this._router.navigateByUrl('bcm/business-continuity-plan/' + id);
  }

  editBcp(id: number) {
    event.stopPropagation();
    this._testAndExerciseService.getItem(id).subscribe(res=>{
      this.testObject.type = 'Edit';
      this.testObject.values = res;
      this.openFormModal();
    })
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  deleteBcp(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  deleteConfirm(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  setSort(type) {
    this._testAndExerciseService.sortRiskTreatmentList(type);
    this.pageChange();
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  ngOnDestroy() {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.exerciseModalSubscription.unsubscribe()
    // this.bcpModalSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.popupControlSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
  }

}
