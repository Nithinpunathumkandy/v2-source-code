import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { IncidentDamageSeverityMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-severity-store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentDamageSeverityService } from 'src/app/core/services/masters/incident-management/incident-damage-severity/incident-damage-severity.service';
import { IncidentDamageSeverity } from 'src/app/core/models/masters/incident-management/incident-damage-severity';
declare var $: any;

@Component({
	selector: 'app-incident-damage-severity',
	templateUrl: './incident-damage-severity.component.html',
	styleUrls: ['./incident-damage-severity.component.scss']
})
export class IncidentDamageSeverityComponent implements OnInit {

	@ViewChild('formModal', { static: true }) formModal: ElementRef;
	@ViewChild('titleInput') titleInput: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	SubMenuItemStore = SubMenuItemStore;
	IncidentDamageSeverityMasterStore = IncidentDamageSeverityMasterStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_incident_damage_severity_message';

	incidentDamageSeverityObject = {
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

	incidentDamageSeveritySubscriptionEvent: any = null;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	popupControlIncidentDamageSeverityEventSubscription: any;

	constructor(
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _incidentDamageSeverityService: IncidentDamageSeverityService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2
	) { }

	ngOnInit(): void {

		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_incident_damage_severity' });
		this.reactionDisposer = autorun(() => {
			var subMenuItems = [
				{ activityName: 'INCIDENT_DAMAGE_SEVERITY_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_INCIDENT_DAMAGE_SEVERITY', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_INCIDENT_DAMAGE_SEVERITY_TEMPLATE', submenuItem: { type: 'template' } },
				{ activityName: 'EXPORT_INCIDENT_DAMAGE_SEVERITY', submenuItem: { type: 'export_to_excel' } },
				{ activityName: 'SHARE_INCIDENT_DAMAGE_SEVERITY', submenuItem: { type: 'share' } },
				{ activityName: 'IMPORT_INCIDENT_DAMAGE_SEVERITY', submenuItem: { type: 'import' } },
				{ activityName: null, submenuItem: { type: 'close', path: 'incident-management' } },
			]
			if (!AuthStore.getActivityPermission(1100, 'CREATE_INCIDENT_DAMAGE_SEVERITY')) {
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
						this._incidentDamageSeverityService.generateTemplate();
						break;
					case "export_to_excel":
						this._incidentDamageSeverityService.exportToExcel();
						break;
					case "search":
						IncidentDamageSeverityMasterStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						break;
					case "share":
						ShareItemStore.setTitle('share_incident_damage_severiry_title');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_incident_damage_severiry');
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
				this._incidentDamageSeverityService.shareData(ShareItemStore.shareData).subscribe(res => {
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
				this._incidentDamageSeverityService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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
		this.popupControlIncidentDamageSeverityEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.incidentDamageSeveritySubscriptionEvent = this._eventEmitterService.incidentDamageSeverityModalControl.subscribe(res => {
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

		// IncidentDamageSeverityMasterStore.setOrderBy('asc');
		this.pageChange(1);
	}

	addNewItem() {
		this.incidentDamageSeverityObject.type = 'Add';
		this.incidentDamageSeverityObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}
	pageChange(newPage: number = null) {
		if (newPage) IncidentDamageSeverityMasterStore.setCurrentPage(newPage);
		this._incidentDamageSeverityService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}
	// for opening modal
	openFormModal() {

		setTimeout(() => {
			$(this.formModal.nativeElement).modal('show');
		}, 100);
	}
	// for close modal
	closeFormModal() {
		$(this.formModal.nativeElement).modal('hide');
		this.incidentDamageSeverityObject.type = null;
	}
	getIncidentDamageSeverity(id: number) {
		const incidentDamageSeverity: IncidentDamageSeverity = IncidentDamageSeverityMasterStore.getIncidentDamageSeverityId(id);
		//set form value
		this.incidentDamageSeverityObject.values = {
			id: incidentDamageSeverity.id,
			title: incidentDamageSeverity.title,
			description: incidentDamageSeverity.description,
		}
		this.incidentDamageSeverityObject.type = 'Edit';
		this.openFormModal();
	}
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteIncidentDamageSeverity(status)
				break;

			case 'Activate': this.activateIncidentDamageSeverity(status)
				break;

			case 'Deactivate': this.deactivateIncidentDamageSeverity(status)
				break;

		}

	}
	// delete function call
	deleteIncidentDamageSeverity(status: boolean) {
		if (status && this.popupObject.id) {
			this._incidentDamageSeverityService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && IncidentDamageSeverityMasterStore.getIncidentDamageSeverityId(this.popupObject.id).status_id == AppStore.activeStatusId) {
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

	activateIncidentDamageSeverity(status: boolean) {
		if (status && this.popupObject.id) {

			this._incidentDamageSeverityService.activate(this.popupObject.id).subscribe(resp => {
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

	deactivateIncidentDamageSeverity(status: boolean) {
		if (status && this.popupObject.id) {

			this._incidentDamageSeverityService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate Incident Damage Severity?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Incident Damage Severity?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Incident Damage Severity?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}
	// for sorting
	sortTitle(type: string) {
		// ExternalAuditTypesMasterStore.setCurrentPage(1);
		this._incidentDamageSeverityService.sortIncidentDamageSeveritylList(type, SubMenuItemStore.searchText);
		this.pageChange();
	}
	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.incidentDamageSeveritySubscriptionEvent.unsubscribe();
		this.popupControlIncidentDamageSeverityEventSubscription.unsubscribe();
		IncidentDamageSeverityMasterStore.searchText = '';
		IncidentDamageSeverityMasterStore.currentPage = 1 ;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
	}
}
