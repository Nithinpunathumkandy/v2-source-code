import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { SlaCategoryService } from 'src/app/core/services/masters/compliance-management/sla-category/sla-category.service';
import { IReactionDisposer, autorun } from 'mobx';
import { SlaCategoryMasterStore } from 'src/app/stores/masters/compliance-management/sla-category-store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SlaCategory } from 'src/app/core/models/masters/compliance-management/sla-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;

@Component({
	selector: 'app-sla-category',
	templateUrl: './sla-category.component.html',
	styleUrls: ['./sla-category.component.scss']
})
export class SlaCategoryComponent implements OnInit, OnDestroy {
	@ViewChild('formModal', { static: true }) formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	SlaCategoryMasterStore = SlaCategoryMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_sla_category_message';

	slaCategoryObject = {
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


	controlSlaCategorySubscriptionEvent: any = null;
	popupControlSlaCategoryEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;

	constructor(
		private _slaCategoryService: SlaCategoryService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

	ngOnInit(): void {
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_sla_category' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'SLA_CATEGORY_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_SLA_CATEGORY', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_SLA_CATEGORY', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_SLA_CATEGORY', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'SHARE_SLA_CATEGORY', submenuItem: { type: 'share' } },
				{ activityName: 'IMPORT_SLA_CATEGORY', submenuItem: { type: 'import' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'compliance-management' } },
			]
			if (!AuthStore.getActivityPermission(100, 'CREATE_SLA_CATEGORY')) {
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
						this._slaCategoryService.generateTemplate();
						break;
					case "export_to_excel":
						this._slaCategoryService.exportToExcel();
						break;
					case "search":
						SlaCategoryMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchSlaCategory(SubMenuItemStore.searchText);
						break;
					case "share":
						ShareItemStore.setTitle('share_sla_category_title');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_sla_category');
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
				this._slaCategoryService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._slaCategoryService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlSlaCategoryEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlSlaCategorySubscriptionEvent = this._eventEmitterService.slaCategory.subscribe(res => {
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
		this.slaCategoryObject.type = 'Add';
		this.slaCategoryObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) SlaCategoryMasterStore.setCurrentPage(newPage);
		this._slaCategoryService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}



	openFormModal() {
		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 50);
	}

	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.slaCategoryObject.type = null;
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getSlaCategory(id: number) {
		const slaCategory: SlaCategory = SlaCategoryMasterStore.getSlaCategoryById(id);
		//set form value
		this.slaCategoryObject.values = {
			id: slaCategory.id,
			title: slaCategory.title,
			description: slaCategory.description
		}
		this.slaCategoryObject.type = 'Edit';
		this.openFormModal();
	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteSlaCategory(status)
				break;

			case 'Activate': this.activateSlaCategory(status)
				break;

			case 'Deactivate': this.deactivateSlaCategory(status)
				break;

		}

	}



	// delete function call
	deleteSlaCategory(status: boolean) {
		if (status && this.popupObject.id) {
			this._slaCategoryService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && SlaCategoryMasterStore.getSlaCategoryById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

	activateSlaCategory(status: boolean) {
		if (status && this.popupObject.id) {

			this._slaCategoryService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateSlaCategory(status: boolean) {
		if (status && this.popupObject.id) {

			this._slaCategoryService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate Sla Category?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Sla Category?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Sla Category?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}


	// for sorting
	sortTitle(type: string) {
		// SlaCategoryMasterStore.setCurrentPage(1);
		this._slaCategoryService.sortSlaCategorylList(type, null);
		this.pageChange();
	}
	// Sub-Menu Search 
	searchSlaCategory(term: string) {
		this._slaCategoryService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.controlSlaCategorySubscriptionEvent.unsubscribe();
		this.popupControlSlaCategoryEventSubscription.unsubscribe();
		SlaCategoryMasterStore.searchText = '';
		SlaCategoryMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}
