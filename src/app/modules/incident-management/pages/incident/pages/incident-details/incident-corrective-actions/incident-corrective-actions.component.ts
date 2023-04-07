import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { IncidentCorrectiveActionService } from 'src/app/core/services/incident-management/incident-corrective-action/incident-corrective-action.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;

@Component({
	selector: 'app-incident-corrective-actions',
	templateUrl: './incident-corrective-actions.component.html',
	styleUrls: ['./incident-corrective-actions.component.scss']
})
export class IncidentCorrectiveActionsComponent implements OnInit {
	@ViewChild('navBar') navBar: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild("filePreviewModal") filePreviewModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('formModal', { static: true }) formModal: ElementRef;
	reactionDisposer: IReactionDisposer;
	IncidentCorrectiveActionStore = IncidentCorrectiveActionStore;
	IncidentStore = IncidentStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	SubMenuItemStore = SubMenuItemStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	fileUploadPopupStore = fileUploadPopupStore;
	AuthStore = AuthStore;
	AppStore = AppStore
	remainingDaysAre: number = 0;
	Totaldays: number = 0;
	todayDate: any = new Date();
	subscription: any;
	currectiveActionId: any;
	initialId: any;
	fileUploadPopupSubscriptionEvent: any = null;
	modalEventSubscription: any;
	popupControlEventSubscription: any;

	incidentCorrectiveActionObject = {
		type: null,
		values: null,
	}

	previewObject = {
		incident_id: null,
		ca_id: null,
		file_details: null,
		component: '',
		preview_url: null,
		file_name: '',
		file_type: '',
		size: '',
		uploaded_user: null,
		created_at: null,
		componentId: null
	};

	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};
	filterSubscription: Subscription = null;
	constructor(private _utilityService: UtilityService,
		private _incidentCorrectiveActionService: IncidentCorrectiveActionService,
		private _cdr: ChangeDetectorRef,
		private _imageService: ImageServiceService,
		private _eventEmitterService: EventEmitterService,
		private _router: Router,
		private _sanitizer: DomSanitizer,
		private _fileUploadPopupService: FileUploadPopupService
		,
		private _documentFileService: DocumentFileService,
		private _helperService: HelperServiceService,
		private _renderer2: Renderer2,
		private _rightSidebarFilterService: RightSidebarFilterService,
		private _route: Router
	) { }

	ngOnInit(): void {
		RightSidebarLayoutStore.showFilter = true;
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_corrective_action' });
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		IncidentCorrectiveActionStore.unSetIncidentCorrectiveAction();
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
			this.IncidentCorrectiveActionStore.loaded = false;
			this._utilityService.detectChanges(this._cdr);
		})
		this.reactionDisposer = autorun(() => {
			var subMenuItems = [
				{ activityName: 'INCIDENT_CORRECTIVE_ACTION_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_INCIDENT_CORRECTIVE_ACTION', submenuItem: { type: 'new_modal' } },
				{ activityName: null, submenuItem: { type: 'close', path: '../incidents' } }
			]
			this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "new_modal":
						setTimeout(() => {
							this.addIncidentCorrectiveActionItem();
						}, 1000)
						break;
					// case "template":
					//   this._incidentCorrectiveActionService.generateTemplate();
					//   break;
					// case "export_to_excel":
					//   this._incidentCorrectiveActionService.exportToExcel();
					//   break;
					case "search":
						IncidentCorrectiveActionStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}

			if (NoDataItemStore.clikedNoDataItem) {
				this.addIncidentCorrectiveActionItem();
				NoDataItemStore.unSetClickedNoDataItem();
			}


		})



		this.modalEventSubscription = this._eventEmitterService.addIncidentCorrectiveAction.subscribe(res => {
			this.closeFormModal();
		});

		// for deleting/activating/deactivating using delete modal
		this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		this.subscription = this._incidentCorrectiveActionService.itemChange.subscribe(item => {
			this.getCorrectiveAction(item);
		})

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.changeZIndex();
		})

		RightSidebarLayoutStore.filterPageTag = 'incident_corrective';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
			'organization_ids',
			'division_ids',
			'department_ids',
			'section_ids',
			'sub_section_ids',
			'incident_ids',
			'incident_corrective_action_status_ids'
		]);

		IncidentCorrectiveActionStore.setSubMenuHide(true);
		this._utilityService.detectChanges(this._cdr);
		this.getDaysRemaining();
		this.getTotaldays();
		this.pageChange(1);
	}

	changeZIndex(){
		if($(this.formModal.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
		}
  	}

	getDaysRemaining() {

		let startDate = new Date(IncidentCorrectiveActionStore.correctiveActionDetails?.target_date);

		this.remainingDaysAre = Math.floor((startDate.getTime() - this.todayDate.getTime()) / 1000 / 60 / 60 / 24);
		if (this.remainingDaysAre >= 0)
			this.remainingDaysAre = this.remainingDaysAre + 1;
		else
			this.remainingDaysAre = 0;
		return this.remainingDaysAre;
	}

	getTotaldays() {
		let startDate = new Date(IncidentCorrectiveActionStore.correctiveActionDetails?.start_date);
		let targetDate = new Date(IncidentCorrectiveActionStore.correctiveActionDetails?.target_date);

		let days = Math.floor((targetDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
		this.Totaldays = Math.abs(days) + 1;
		return this.Totaldays;

	}

	getArrayFormatedString(type, items, languageSupport?) {
		let item = [];
		if (languageSupport) {
			for (let i of items) {
				for (let j of i.language) {
					item.push(j.pivot);
				}
			}
			items = item;
		}
		return this._helperService.getArraySeperatedString(',', type, items);
	}


	createImageUrl(type, token) {
		if (type == 'document-version') {
			return this._documentFileService.getThumbnailPreview(type, token)
		}
		else
			return this._incidentCorrectiveActionService.getThumbnailPreview(type, token);
	}

	viewAttachments(type, document, khDocuments?) {
		switch (type) {
			case "corrective-action-details":
				this._incidentCorrectiveActionService.getFilePreview(type, IncidentCorrectiveActionStore.correctiveActionDetails.id, document.id).subscribe(res => {
					var resp: any = this._utilityService.getDownLoadLink(res, document.title);
					this.openPreviewModal(type, resp, document, document);
				}), (error => {
					if (error.status == 403) {
						this._utilityService.showErrorMessage('Error', 'permission_denied');
					}
					else {
						this._utilityService.showErrorMessage('Error', 'unable_to_generate_preview');
					}
				});
				break;
			case "document-version":
				this._documentFileService.getFilePreview(type, document.document_id, khDocuments.id).subscribe((res) => {
					var resp: any = this._utilityService.getDownLoadLink(res, document.title);
					this.openPreviewModal(type, resp, khDocuments, document);
				}),
					(error) => {
						if (error.status == 403) {
							this._utilityService.showErrorMessage(
								"Error",
								"Permission Denied"
							);
						} else {
							this._utilityService.showErrorMessage(
								"Error",
								"Unable to generate Preview"
							);
						}
					};
				break;
		}
	}


	downloadDocument(type, document, docs?) {
		switch (type) {
			case "corrective-action-details":
				this._incidentCorrectiveActionService.downloadFile(type, IncidentCorrectiveActionStore.correctiveActionDetails.id, document.id,document.title,null,document);
				break;
			case "document-version":
				this._documentFileService.downloadFile(type, document.document_id, docs.id, null, document.title, docs);
				break;
		}
	}

	openPreviewModal(type, filePreview, itemDetails, document) {
		let uploaded_user = null;
		let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
		this.previewObject.component = type;
		this.previewObject.file_details = itemDetails;
		this.previewObject.componentId = document.id;
		this.previewObject.ca_id = document.incident_corrective_action_id;
		this.previewObject.incident_id = IncidentCorrectiveActionStore.correctiveActionDetails.incident.id;
		this.previewObject.preview_url = previewItem;
		this.previewObject.uploaded_user = IncidentCorrectiveActionStore.correctiveActionDetails.created_by ? IncidentCorrectiveActionStore.correctiveActionDetails.created_by : null;
		this.previewObject.created_at = document.created_at;
		$(this.filePreviewModal.nativeElement).modal('show');
		this._utilityService.detectChanges(this._cdr);
	}

	closePreviewModal($event?) {
		$(this.filePreviewModal.nativeElement).modal('hide');
		this.previewObject.file_name = null;
		this.previewObject.file_type = '';
		this.previewObject.preview_url = '';
	}

	// extension check function
	checkExtension(ext, extType) {

		return this._imageService.checkFileExtensions(ext, extType)

	}

	assignUserValues(user) {
		if (user) {
			var userInfoObject = {
				first_name: '',
				last_name: '',
				designation: '',
				image_token: '',
				mobile: null,
				email: '',
				id: null,
				department: '',
				status_id: null
			}

			userInfoObject.first_name = user?.first_name;
			userInfoObject.last_name = user?.last_name;
			userInfoObject.designation = user?.designation;
			userInfoObject.image_token = user?.image.token;
			userInfoObject.email = user?.email;
			userInfoObject.mobile = user?.mobile;
			userInfoObject.id = user?.id;
			userInfoObject.status_id = user?.status.id
			userInfoObject.department = user?.department;
			return userInfoObject;
		}
	}

	getCreatedByPopupDetails(users, created?: string) {
		let userDetial: any = {};
		userDetial['first_name'] = users?.first_name;
		userDetial['last_name'] = users?.last_name;
		userDetial['designation'] = users?.designation;
		userDetial['image_token'] = users?.image?.token;
		userDetial['email'] = users?.email;
		userDetial['mobile'] = users?.mobile;
		userDetial['id'] = users?.id;
		userDetial['department'] = users?.department;
		userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		userDetial['created_at'] = created ? created : null;
		return userDetial;
	}

	getTimezoneFormatted(time) {
		return this._helperService.timeZoneFormatted(time);
	}

	addIncidentCorrectiveActionItem() {
		this.clearCommonFilePopupDocuments();
		IncidentCorrectiveActionStore.setSubMenuHide(true);
		this.incidentCorrectiveActionObject.type = 'Add';
		this.incidentCorrectiveActionObject.values = null;
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
		this.pageChange();
	}

	pageChange(newPage: number = null, closeModal: boolean = false) {

		if (newPage) IncidentCorrectiveActionStore.setCurrentPage(newPage);
		this._incidentCorrectiveActionService.incidentCorrectiveActions().subscribe((res) => {
			if (res.data.length > 0 && IncidentCorrectiveActionStore.new_ca_id == null) {
				this.getCorrectiveAction(res.data[0].id);
			} if (res.data.length > 0 && IncidentCorrectiveActionStore.new_ca_id != null) {
				this.getCorrectiveAction(IncidentCorrectiveActionStore.new_ca_id);
			}
			this._utilityService.detectChanges(this._cdr);
		})
	}

	// call corrective action by id
	getCorrectiveAction(id: number) {
		IncidentCorrectiveActionStore.new_ca_id = null;
		this._incidentCorrectiveActionService.unsetSelectedItemDetails(); // Clear previous data from store
		this._incidentCorrectiveActionService.getItem(id).subscribe(res => {
			this.currectiveActionId = res.id;
			this._utilityService.detectChanges(this._cdr);
		})
		this._incidentCorrectiveActionService.setSelected(id);
	}

	labelDot(data) {
		let str = data;
		let color = "";
		const myArr = str.split("-");
		color = myArr[0];
		return color;
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
		let pageNumber = this.incidentCorrectiveActionObject.type == 'Add' ? IncidentCorrectiveActionStore.last_page : IncidentCorrectiveActionStore.currentPage;
		this.pageChange(pageNumber, true);
		this.incidentCorrectiveActionObject.type = null;
	}

	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}
	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	// for delete
	delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Corrective Action?';
		this.popupObject.subtitle = 'delete_corrective_action';
		this._utilityService.detectChanges(this._cdr);
		$(this.confirmationPopUp.nativeElement).modal('show');

	}

	// for popup object clearing
	clearPopupObject() {
		this.popupObject.id = null;
		this.popupObject.title = '';
		this.popupObject.subtitle = '';
		this.popupObject.type = '';

	}

	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteIncidentCorrectiveAction(status)
				break;
		}

	}

	// delete function call
	deleteIncidentCorrectiveAction(status: boolean) {
		if (status && this.popupObject.id) {
			this._incidentCorrectiveActionService.delete(this.popupObject.id).subscribe(resp => {

				// this._incidentCorrectiveActionService.incidentCorrectiveActions();
				this._incidentCorrectiveActionService.unsetSelectedItemDetails()
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.clearPopupObject();
				this.pageChange();
			});
		}
		else {
			this.clearPopupObject();
		}
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		}, 250);

	}

	//edit start
	editICAItem() {
		IncidentCorrectiveActionStore.setSubMenuHide(true);
		event.stopPropagation();
		IncidentCorrectiveActionStore.clearDocumentDetails(); // assigning values for edit
		const corrective_action = IncidentCorrectiveActionStore.correctiveActionDetails; // assigning values for edit
		setTimeout(() => {
			if (corrective_action.documents.length > 0) {
				this.setDocuments(corrective_action.documents)
			}
		}, 200);

		this.incidentCorrectiveActionObject.values = {
			id: corrective_action.id,
			title: corrective_action.title,
			responsible_user_id: corrective_action.responsible_user,
			watcher_ids:corrective_action.incident_corrective_action_watchers,
			description: corrective_action.description,
			incident_id: corrective_action.incident.id,
			start_date: this._helperService.processDate(corrective_action.start_date, 'split'),
			target_date: this._helperService.processDate(corrective_action.target_date, 'split'),
			budget: corrective_action.budget,
		}

		this.incidentCorrectiveActionObject.type = 'Edit';
		this.openFormModal();
	}

	setDocuments(documents) {
		this.clearCommonFilePopupDocuments();
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
							title:element?.kh_document.title,
							'is_kh_document': true
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement,
						})
					}
				});
			}
			else {
				if (element && element.token) {
					var purl = this._incidentCorrectiveActionService.getThumbnailPreview('corrective-action-details', element.token);
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
		// this.enableScrollbar();
	}

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		IncidentCorrectiveActionStore.searchText = null;
		this.modalEventSubscription.unsubscribe();
		this.popupControlEventSubscription.unsubscribe();
		this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
		SubMenuItemStore.searchText = '';
		this.subscription.unsubscribe();
		IncidentCorrectiveActionStore.unsetIndividualCorrectiveAction();
		IncidentCorrectiveActionStore.unSetIncidentCorrectiveAction();
		IncidentCorrectiveActionStore.unsetSelectedItemDetails();
	}

}
