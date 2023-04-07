import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { TestAndExerciseTypes } from 'src/app/core/models/masters/bcm/test-and-exercise-types';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseCommunicationsService } from 'src/app/core/services/masters/bcm/test-and-exercise-communications/test-and-exercise-communications.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TestAndExerciseCommunicationsMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-communications.store';
declare var $: any;

@Component({
  selector: 'app-test-and-exercise-communications',
  templateUrl: './test-and-exercise-communications.component.html'
})
export class TestAndExerciseCommunicationsComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_test_and_exercise_communications_message';
  TestAndExerciseCommunicationsMasterStore = TestAndExerciseCommunicationsMasterStore;

  testAndExerciseCommunicationsObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  testAndExerciseCommunicationsEventSubsceiption: any = null;
  popUptestAndExerciseCommunicationsEventSubsceiption: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  constructor(

    private _testAndExerciseCommunicationsService: TestAndExerciseCommunicationsService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2

  ) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof TestAndExerciseCommunicationsComponent
   */
  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', 
    buttonText: 'new_test-and-exercise-communications' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'TEST_AND_EXERCISE_PLAN_COMMUNICATION_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_TEST_AND_EXERCISE_PLAN_COMMUNICATION', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_TEST_AND_EXERCISE_PLAN_COMMUNICATION', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_TEST_AND_EXERCISE_PLAN_COMMUNICATION', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_TEST_AND_EXERCISE_PLAN_COMMUNICATION', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_TEST_AND_EXERCISE_PLAN_COMMUNICATION', submenuItem: { type: 'import' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_TEST_AND_EXERCISE_PLAN_COMMUNICATION')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._testAndExerciseCommunicationsService.generateTemplate();
            break;
          case "export_to_excel":
            this._testAndExerciseCommunicationsService.exportToExcel();
            break;
          case "search":
            TestAndExerciseCommunicationsMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_test_and_exercise_communications');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_test_and_exercise_communications');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (ShareItemStore.shareData) {
        this._testAndExerciseCommunicationsService.shareData(ShareItemStore.shareData).subscribe(res => {
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
        this._testAndExerciseCommunicationsService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    })

    // for deleting/activating/deactivating using delete modal
    this.popUptestAndExerciseCommunicationsEventSubsceiption = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.testAndExerciseCommunicationsEventSubsceiption = this._eventEmitterService.testAndExerciseTypes.subscribe(res => {
      this.closeFormModal();
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
  addNewItem() {
    this.testAndExerciseCommunicationsObject.type = 'Add';
    this.testAndExerciseCommunicationsObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  pageChange(newPage: number = null) {
    if (newPage) TestAndExerciseCommunicationsMasterStore.setCurrentPage(newPage);
    this._testAndExerciseCommunicationsService.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.testAndExerciseCommunicationsObject.type = null;
  }
  getTestAndExerciseTypes(id: number) {
    const TestAndExerciseTypes: TestAndExerciseTypes = TestAndExerciseCommunicationsMasterStore.getTestAndExerciseCommunicationsById(id);
    //set form value
    this.testAndExerciseCommunicationsObject.values = {
      id: TestAndExerciseTypes.id,
      title: TestAndExerciseTypes.title
    }
    this.testAndExerciseCommunicationsObject.type = 'Edit';
    this.openFormModal();
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteTestAndExerciseTypes(status)
        break;

      case 'Activate': this.activateTestAndExerciseCommunications(status)
        break;

      case 'Deactivate': this.deactivateTestAndExerciseCommunications(status)
        break;

    }

  }

  // delete function call
  deleteTestAndExerciseTypes(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseCommunicationsService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && TestAndExerciseCommunicationsMasterStore.getTestAndExerciseCommunicationsById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
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
  activateTestAndExerciseCommunications(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseCommunicationsService.activate(this.popupObject.id).subscribe(resp => {
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
  deactivateTestAndExerciseCommunications(status: boolean) {
    if (status && this.popupObject.id) {
      this._testAndExerciseCommunicationsService.deactivate(this.popupObject.id).subscribe(resp => {
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
    this.popupObject.title = 'Test And Exercise Communications?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Test And Exercise Communications?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for delete
  delete(id: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Test And Exercise Communications?';
    this.popupObject.subtitle = 'common_delete_subtitle';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  // for sorting
  sortTitle(type: string) {
    this._testAndExerciseCommunicationsService.sortTestAndExerciseCommunicationsList(type, null);
    this.pageChange();
  }


   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof TestAndExerciseCommunicationsComponent
   */
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.testAndExerciseCommunicationsEventSubsceiption.unsubscribe();
    this.popUptestAndExerciseCommunicationsEventSubsceiption.unsubscribe();
    TestAndExerciseCommunicationsMasterStore.searchText = '';
    TestAndExerciseCommunicationsMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

}
