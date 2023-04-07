import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ProcessAccessibility } from 'src/app/core/models/masters/bpm/process-accessibility';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProcessAccessibilityService } from 'src/app/core/services/masters/bpm/process-accessibility/process-accessibility.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProcessAccessibilityMasterStore } from 'src/app/stores/masters/bpm/process-accesibility.store';

declare var $: any;

@Component({
  selector: 'app-process-accessibility',
  templateUrl: './process-accessibility.component.html',
  styleUrls: ['./process-accessibility.component.scss']
})
export class ProcessAccessibilityComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	ProcessAccessibilityMasterStore = ProcessAccessibilityMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_process_accessibility_message';

	processAccessibilityObject = {
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


	controlProcessAccessibilitySubscriptionEvent: any = null;
	popupControlProcessAccessibilityEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;

	constructor(
		private _processAccessibilityService: ProcessAccessibilityService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

  ngOnInit(): void {
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_process_accessibility' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'PROCESS_ACCESSIBILITY_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_PROCESS_ACCESSIBILITY', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_PROCESS_ACCESSIBILITY_TEMPLATE', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_PROCESS_ACCESSIBILITY', submenuItem: { type: 'export_to_excel' } },
				// { activityName: 'SHARE_PROCESS_ACCESSIBILITY', submenuItem: { type: 'share' } },
				{ activityName: 'IMPORT_PROCESS_ACCESSIBILITY', submenuItem: { type: 'import' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'bpm' } },
			]
			if (!AuthStore.getActivityPermission(100, 'CREATE_PROCESS_ACCESSIBILITY')) {
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
						this._processAccessibilityService.generateTemplate();
						break;
					case "export_to_excel":
						this._processAccessibilityService.exportToExcel();
						break;
					case "search":
						ProcessAccessibilityMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchSlaCategory(SubMenuItemStore.searchText);
						break;
					case "share":
						ShareItemStore.setTitle('share_process_accessibilities');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_process_accessibilities');
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
				this._processAccessibilityService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._processAccessibilityService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlProcessAccessibilityEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlProcessAccessibilitySubscriptionEvent = this._eventEmitterService.processAccessibility.subscribe(res => {
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
		this.processAccessibilityObject.type = 'Add';
		this.processAccessibilityObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) ProcessAccessibilityMasterStore.setCurrentPage(newPage);
		this._processAccessibilityService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}



	openFormModal() {
		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 50);
	}

	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.processAccessibilityObject.type = null;
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getProcessAccessibility(id: number) {
		const processAccessibility: ProcessAccessibility = ProcessAccessibilityMasterStore.getProcessAccessibilityById(id);
		//set form value
		this.processAccessibilityObject.values = {
			id: processAccessibility.id,
			title: processAccessibility.title,
			description: processAccessibility.description
		}
		this.processAccessibilityObject.type = 'Edit';
		this.openFormModal();
	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteProcessAccessibility(status)
				break;

			case 'Activate': this.activateProcessAccessibility(status)
				break;

			case 'Deactivate': this.deactivateProcessAccessibility(status)
				break;

		}

	}



	// delete function call
	deleteProcessAccessibility(status: boolean) {
		if (status && this.popupObject.id) {
			this._processAccessibilityService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && ProcessAccessibilityMasterStore.getProcessAccessibilityById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

	activateProcessAccessibility(status: boolean) {
		if (status && this.popupObject.id) {

			this._processAccessibilityService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateProcessAccessibility(status: boolean) {
		if (status && this.popupObject.id) {

			this._processAccessibilityService.deactivate(this.popupObject.id).subscribe(resp => {
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
		event.stopPropagation();
		this.popupObject.type = 'Activate';
		this.popupObject.id = id;
		this.popupObject.title = 'Activate Process Accessibility?';
		this.popupObject.subtitle = 'are_you_sure_activate';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Process Accessibility?';
		this.popupObject.subtitle = 'are_you_sure_deactivate';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Process Accessibility?';
		this.popupObject.subtitle = 'are_you_sure_delete';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}


	// for sorting
	sortTitle(type: string) {
		// ProcessAccessibilityMasterStore.setCurrentPage(1);
		this._processAccessibilityService.sortProcessAccessibilityList(type, null);
		this.pageChange();
	}
	// Sub-Menu Search 
	searchProcessAccessibility(term: string) {
		this._processAccessibilityService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.controlProcessAccessibilitySubscriptionEvent.unsubscribe();
		this.popupControlProcessAccessibilityEventSubscription.unsubscribe();
		ProcessAccessibilityMasterStore.searchText = '';
		ProcessAccessibilityMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}
