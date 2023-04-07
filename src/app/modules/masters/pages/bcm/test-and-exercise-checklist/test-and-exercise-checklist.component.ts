import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { TestAndExerciseChecklist } from 'src/app/core/models/masters/bcm/test-and-exercise-checklist';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseChecklistService } from 'src/app/core/services/masters/bcm/test-and-exercise-checklist/test-and-exercise-checklist.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TestAndExerciseChecklistMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-checklist.store';
declare var $: any;

@Component({
  selector: 'app-test-and-exercise-checklist',
  templateUrl: './test-and-exercise-checklist.component.html',
  styleUrls: ['./test-and-exercise-checklist.component.scss']
})
export class TestAndExerciseChecklistComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	TestAndExerciseChecklistMasterStore = TestAndExerciseChecklistMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_test_and_exercise_checklist_message';

	testAndExerciseChecklistObject = {
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


	controlTextAndExerciseChecklistSubscriptionEvent: any = null;
	popupControlTextAndExerciseChecklistEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;

	constructor(
		private _testAndExerciseChecklistService: TestAndExerciseChecklistService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

  ngOnInit(): void {
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_test_and_exercise_checklist' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'TEST_AND_EXERCISE_CHECKLIST_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_TEST_AND_EXERCISE_CHECKLIST', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_TEST_AND_EXERCISE_CHECKLIST', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_TEST_AND_EXERCISE_CHECKLIST', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'SHARE_TEST_AND_EXERCISE_CHECKLIST', submenuItem: { type: 'share' } },
				{ activityName: 'IMPORT_TEST_AND_EXERCISE_CHECKLIST', submenuItem: { type: 'import' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
			]
			if (!AuthStore.getActivityPermission(100, 'CREATE_TEST_AND_EXERCISE_CHECKLIST')) {
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
						this._testAndExerciseChecklistService.generateTemplate();
						break;
					case "export_to_excel":
						this._testAndExerciseChecklistService.exportToExcel();
						break;
					case "search":
						TestAndExerciseChecklistMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchSlaCategory(SubMenuItemStore.searchText);
						break;
					case "share":
						ShareItemStore.setTitle('share_test_and_exercise_checklist');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_test_and_exercise_checklist');
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
				this._testAndExerciseChecklistService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._testAndExerciseChecklistService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlTextAndExerciseChecklistEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlTextAndExerciseChecklistSubscriptionEvent = this._eventEmitterService.TestAndExerciseChecklist.subscribe(res => {
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
		this.testAndExerciseChecklistObject.type = 'Add';
		this.testAndExerciseChecklistObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) TestAndExerciseChecklistMasterStore.setCurrentPage(newPage);
		this._testAndExerciseChecklistService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}



	openFormModal() {
		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 50);
	}

	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.testAndExerciseChecklistObject.type = null;
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getTestAndExerciseChecklist(id: number) {
		const testAndExerciseChecklist: TestAndExerciseChecklist = TestAndExerciseChecklistMasterStore.getTestAndExerciseChecklistById(id);
		//set form value
		this.testAndExerciseChecklistObject.values = {
			id: testAndExerciseChecklist.id,
			title: testAndExerciseChecklist.title
		}
		this.testAndExerciseChecklistObject.type = 'Edit';
		this.openFormModal();
	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteTextAndExerciseChecklist(status)
				break;

			case 'Activate': this.activateTextAndExerciseChecklist(status)
				break;

			case 'Deactivate': this.deactivateTextAndExerciseChecklist(status)
				break;

		}

	}



	// delete function call
	deleteTextAndExerciseChecklist(status: boolean) {
		if (status && this.popupObject.id) {
			this._testAndExerciseChecklistService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && TestAndExerciseChecklistMasterStore.getTestAndExerciseChecklistById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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
		// this.popupObject.title = '';
		// this.popupObject.subtitle = '';
		// this.popupObject.type = '';

	}

	// calling activcate function

	activateTextAndExerciseChecklist(status: boolean) {
		if (status && this.popupObject.id) {

			this._testAndExerciseChecklistService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateTextAndExerciseChecklist(status: boolean) {
		if (status && this.popupObject.id) {

			this._testAndExerciseChecklistService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate Test And Exercise Recovery Levels?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Test And Exercise Recovery Levels?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Test And Exercise Recovery Levels?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}


	// for sorting
	sortTitle(type: string) {
		// TestAndExerciseChecklistMasterStore.setCurrentPage(1);
		this._testAndExerciseChecklistService.sortTestAndExerciseChecklistList(type, null);
		this.pageChange();
	}
	// Sub-Menu Search 
	searchTextAndExerciseChecklist(term: string) {
		this._testAndExerciseChecklistService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.controlTextAndExerciseChecklistSubscriptionEvent.unsubscribe();
		this.popupControlTextAndExerciseChecklistEventSubscription.unsubscribe();
		TestAndExerciseChecklistMasterStore.searchText = '';
		TestAndExerciseChecklistMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}
