import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseActionPlanStatusService } from 'src/app/core/services/masters/bcm/test-and-exercise-action-plan-status/test-and-exercise-action-plan-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TestAndExerciseActionPlanStatusMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-action-plan-status.store';

declare var $: any;

@Component({
  selector: 'app-test-and-exercise-action-plan-status',
  templateUrl: './test-and-exercise-action-plan-status.component.html',
  styleUrls: ['./test-and-exercise-action-plan-status.component.scss']
})
export class TestAndExerciseActionPlanStatusComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  TestAndExerciseActionPlanStatusMasterStore = TestAndExerciseActionPlanStatusMasterStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popUptestAndExerciseActionPlanStatusEventSubsceiption: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _testAndExerciseActionPlanStatusService: TestAndExerciseActionPlanStatusService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }


  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'TEST_AND_EXERCISE_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' } },
        { activityName: 'EXPORT_TEST_AND_EXERCISE_ACTION_PLAN_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._testAndExerciseActionPlanStatusService.exportToExcel();
            break;
          case "search":
            TestAndExerciseActionPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })

    // for activating/deactivating using delete modal
    this.popUptestAndExerciseActionPlanStatusEventSubsceiption = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
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
    this.pageChange(1);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  pageChange(newPage: number = null) {
    if (newPage) TestAndExerciseActionPlanStatusMasterStore.setCurrentPage(newPage);
    this._testAndExerciseActionPlanStatusService.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case 'Activate': this.activateTestAndExerciseActionPlanStatus(status)
        break;

      case 'Deactivate': this.deactivateTestAndExerciseActionPlanStatus(status)
        break;
    }

  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  activateTestAndExerciseActionPlanStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseActionPlanStatusService.activate(this.popupObject.id).subscribe(resp => {
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

  // calling deactivate function
  deactivateTestAndExerciseActionPlanStatus(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseActionPlanStatusService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate
  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Test And Exercise Action Plan Status?';
    this.popupObject.subtitle = 'common_activate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Test And Exercise Action Plan Status?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for sorting
  sortTitle(type: string) {
    this._testAndExerciseActionPlanStatusService.sortTestAndExerciseActionPlanStatus(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.popUptestAndExerciseActionPlanStatusEventSubsceiption.unsubscribe();
    TestAndExerciseActionPlanStatusMasterStore.searchText = '';
    TestAndExerciseActionPlanStatusMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
