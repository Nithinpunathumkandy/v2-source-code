import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventInfluence } from 'src/app/core/models/masters/event-monitoring/event-influence';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventInfluenceService } from 'src/app/core/services/masters/event-monitoring/event-influence/event-influence.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { EventInfluenceMasterStore } from 'src/app/stores/masters/event-monitoring/event-influence-store';

declare var $: any;

@Component({
  selector: 'app-event-influence',
  templateUrl: './event-influence.component.html',
  styleUrls: ['./event-influence.component.scss']
})
export class EventInfluenceComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	EventInfluenceMasterStore = EventInfluenceMasterStore;
	SubMenuItemStore = SubMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_event_influence_message';

	eventInfluenceObject = {
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


	controlEventInfluenceSubscriptionEvent: any = null;
	popupControlEventInfluenceEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
  
	constructor(
		private _eventInfluenceService: EventInfluenceService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

  ngOnInit(): void {
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_event_influence' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = this.getSubmenu()
			if (!AuthStore.getActivityPermission(100, 'CREATE_EVENT_INFLUENCE')) {
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
					// case "template":
					// 	this._eventInfluenceService.generateTemplate();
					// 	break;
					// case "export_to_excel":
					// 	this._eventInfluenceService.exportToExcel();
					// 	break;
					case "search":
						EventInfluenceMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchSlaCategory(SubMenuItemStore.searchText);
						break;
					// case "share":
					// 	ShareItemStore.setTitle('share_event_influences');
					// 	ShareItemStore.formErrors = {};
					// 	break;
					// case "import":
					// 	ImportItemStore.setTitle('import_event_influences');
					// 	ImportItemStore.setImportFlag(true);
					// 	break;
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
				this._eventInfluenceService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._eventInfluenceService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlEventInfluenceEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlEventInfluenceSubscriptionEvent = this._eventEmitterService.eventInfluence.subscribe(res => {
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
		this.eventInfluenceObject.type = 'Add';
		this.eventInfluenceObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) EventInfluenceMasterStore.setCurrentPage(newPage);
		this._eventInfluenceService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}



	openFormModal() {
		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 50);
	}

	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.eventInfluenceObject.type = null;
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getEventInfluence(id: number) {
		const eventInfluence: EventInfluence = EventInfluenceMasterStore.getEventInfluenceById(id);
		//set form value
		this.eventInfluenceObject.values = {
			id: eventInfluence.id,
			title: eventInfluence.title,
      order:eventInfluence.order,
			description: eventInfluence.description
		}
		this.eventInfluenceObject.type = 'Edit';
		this.openFormModal();
	}


	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteEventInfluence(status)
				break;

			case 'Activate': this.activateEventInfluence(status)
				break;

			case 'Deactivate': this.deactivateEventInfluence(status)
				break;

		}

	}



	// delete function call
	deleteEventInfluence(status: boolean) {
		if (status && this.popupObject.id) {
			this._eventInfluenceService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && EventInfluenceMasterStore.getEventInfluenceById(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

	getSubmenu(){
		var subMenuItems =[

            { activityName: 'EVENT_INFLUENCE_LIST', submenuItem: { type: 'search' } },

            //{ activityName: 'CREATE_EVENT_INFLUENCE', submenuItem: { type: 'new_modal' } },              

            { activityName: null, submenuItem: { type: 'close', path: 'event-monitoring' } },

        ]

        if(EventInfluenceMasterStore.EventInfluence.length <6){

            subMenuItems.splice(0, 1, { activityName: 'CREATE_EVENT_INFLUENCE', submenuItem: { type: 'new_modal' } },)

        }      

        return subMenuItems
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

	activateEventInfluence(status: boolean) {
		if (status && this.popupObject.id) {

			this._eventInfluenceService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateEventInfluence(status: boolean) {
		if (status && this.popupObject.id) {

			this._eventInfluenceService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate Event Influence?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Event Influence?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Event Influence?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}


	// for sorting
	sortTitle(type: string) {
		// EventInfluenceMasterStore.setCurrentPage(1);
		this._eventInfluenceService.sortEventInfluenceList(type, null);
		this.pageChange();
	}
	// Sub-Menu Search 
	searchEventInfluence(term: string) {
		this._eventInfluenceService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.controlEventInfluenceSubscriptionEvent.unsubscribe();
		this.popupControlEventInfluenceEventSubscription.unsubscribe();
		EventInfluenceMasterStore.searchText = '';
		EventInfluenceMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}

}
