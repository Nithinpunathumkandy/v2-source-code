import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { CustomerComplaintSource } from 'src/app/core/models/masters/customer-engagement/customer-complaint-source';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerComplaintSourceService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-source/customer-complaint-source.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CustomerComplaintSourceMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-source-store';
declare var $: any;

@Component({
  selector: 'app-customer-complaint-source',
  templateUrl: './customer-complaint-source.component.html',
  styleUrls: ['./customer-complaint-source.component.scss']
})
export class CustomerComplaintSourceComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	CustomerComplaintSourceMasterStore = CustomerComplaintSourceMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_customer_complaint_source_message';

	customerComplaintSourceObject = {
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


	controlCustomerComplaintSourceSubscriptionEvent: any = null;
	popupControlCustomerComplaintSourceEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;

	constructor(
		private _customerComplaintSourceService: CustomerComplaintSourceService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

  ngOnInit(): void {
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_customer_complaint_source' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'CUSTOMER_COMPLAINT_SOURCE_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_CUSTOMER_COMPLAINT_SOURCE', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_CUSTOMER_COMPLAINT_SOURCE', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_CUSTOMER_COMPLAINT_SOURCE', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'SHARE_CUSTOMER_COMPLAINT_SOURCE', submenuItem: { type: 'share' } },
				{ activityName: 'IMPORT_CUSTOMER_COMPLAINT_SOURCE', submenuItem: { type: 'import' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'customer-engagement' } },
			]
			if (!AuthStore.getActivityPermission(100, 'CREATE_CUSTOMER_COMPLAINT_SOURCE')) {
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
						this._customerComplaintSourceService.generateTemplate();
						break;
					case "export_to_excel":
						this._customerComplaintSourceService.exportToExcel();
						break;
					case "search":
						CustomerComplaintSourceMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchCustomerComplaintSource(SubMenuItemStore.searchText);
						break;
					case "share":
						ShareItemStore.setTitle('share_customer_complaint_source');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_customer_complaint_source');
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
				this._customerComplaintSourceService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._customerComplaintSourceService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlCustomerComplaintSourceEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlCustomerComplaintSourceSubscriptionEvent = this._eventEmitterService.CustomerComplaintSource.subscribe(res => {
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
		this.customerComplaintSourceObject.type = 'Add';
		this.customerComplaintSourceObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) CustomerComplaintSourceMasterStore.setCurrentPage(newPage);
		this._customerComplaintSourceService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}



	openFormModal() {
		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 50);
	}

	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.customerComplaintSourceObject.type = null;
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getCustomerComplaintSource(id: number) {
		const CustomerComplaintSource: CustomerComplaintSource = CustomerComplaintSourceMasterStore.getCustomerComplaintSourceById(id);
		//set form value
		this.customerComplaintSourceObject.values = {
			id: CustomerComplaintSource.id,
			title: CustomerComplaintSource.title,
			// description: CustomerComplaintSource.description
		}
		this.customerComplaintSourceObject.type = 'Edit';
		this.openFormModal();
	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteCustomerComplaintSource(status)
				break;

			case 'Activate': this.activateCustomerComplaintSource(status)
				break;

			case 'Deactivate': this.deactivateCustomerComplaintSource(status)
				break;

		}

	}



	// delete function call
	deleteCustomerComplaintSource(status: boolean) {
		if (status && this.popupObject.id) {
			this._customerComplaintSourceService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && CustomerComplaintSourceMasterStore.getCustomerComplaintSourceById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

	activateCustomerComplaintSource(status: boolean) {
		if (status && this.popupObject.id) {

			this._customerComplaintSourceService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateCustomerComplaintSource(status: boolean) {
		if (status && this.popupObject.id) {

			this._customerComplaintSourceService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate Customer Complaint Source?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Customer Complaint Source?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Customer Complaint Source?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}


	// for sorting
	sortTitle(type: string) {
		// CustomerComplaintSourceMasterStore.setCurrentPage(1);
		this._customerComplaintSourceService.sortCustomerComplaintSourceList(type, null);
		this.pageChange();
	}
	// Sub-Menu Search 
	searchCustomerComplaintSource(term: string) {
		this._customerComplaintSourceService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.controlCustomerComplaintSourceSubscriptionEvent.unsubscribe();
		this.popupControlCustomerComplaintSourceEventSubscription.unsubscribe();
		CustomerComplaintSourceMasterStore.searchText = '';
		CustomerComplaintSourceMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}
