import { Component, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AppStore } from 'src/app/stores/app.store';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';

declare var $: any;
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-auditable-item-details',
	templateUrl: './auditable-item-details.component.html',
	styleUrls: ['./auditable-item-details.component.scss']
})
export class AuditableItemDetailsComponent implements OnInit, OnDestroy {
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild("filePreviewModal") filePreviewModal: ElementRef;

	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuditableItemMasterStore = AuditableItemMasterStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	ControlStore = ControlStore;
	ProcessStore = ProcessStore;
	SubMenuItemStore = SubMenuItemStore;
	reactionDisposer: IReactionDisposer;
	AppStore = AppStore;
	AuthStore = AuthStore;
	selectedIndex = null;


	previewObject = {
		preview_url: null,
		file_details: null,
		uploaded_user: null,
		created_at: "",
		component: "",
		componentId: null,
	};

	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};

	auditId: number;

	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	popupControlAuditableEventSubscription: any;
	previewFocusSubscription: any;
	constructor(private _cdr: ChangeDetectorRef,
		private _auditableItemService: AuditableItemService,
		private _router: Router,
		private _sanitizer: DomSanitizer,
		private _eventEmitterService: EventEmitterService,
		private _imageService: ImageServiceService,
		private route: ActivatedRoute,
		private _internalAuditFileService: InternalAuditFileService,
		private _controlService: ControlsService,
		private _utilityService: UtilityService,
		private _renderer2: Renderer2,
		private _helperService: HelperServiceService,
		private _documentFileService: DocumentFileService,) { }

	ngOnInit(): void {

		AppStore.showDiscussion = false;
		this.reactionDisposer = autorun(() => {
			this.statusCheck();


			// var subMenuItems = [
			// 	{activityName: 'UPDATE_AUDITABLE_ITEM', submenuItem: {type: 'edit_modal'}},
			// 	{activityName: 'DELETE_AUDITABLE_ITEM', submenuItem: {type: 'delete'}},
			// 	{activityName: null, submenuItem: {type: 'close',path:'../'}}
			//   ]

			//   this._helperService.checkSubMenuItemPermissions(600, subMenuItems);

			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "edit_modal":
						this.gotoEditPage();
						break;

					case "delete":
						this.delete(AuditableItemMasterStore.auditableItemDetails.id);
						break;

					case "deactivate":
						this.deactivate(AuditableItemMasterStore.auditableItemDetails.id);
						break;

					case "activate":
						this.activate(AuditableItemMasterStore.auditableItemDetails.id);
						break;


					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
		})

		this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			if (!status && $(this.filePreviewModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
			}
		})

		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			if (!status && $(this.filePreviewModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
			}
		})

		// for deleting/activating/deactivating using delete modal
		this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		this.previewFocusSubscription = this._eventEmitterService.previewFocus.subscribe(res => {
			this.setPreviewFocus();
		})

		// setting submenu items
		// SubMenuItemStore.setSubMenuItems([
		// 	{ type: 'edit_modal' },
		// 	{ type: 'delete' },
		// 	{ type: 'close', path: '../' }
		// ]);

		SubMenuItemStore.setNoUserTab(true);
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		let id: number;
		this.route.params.subscribe(params => {
			id = +params['id']; // (+) converts string 'id' to a number
			this.auditId = id;
			this.getAuditableItem(id);
		});

	}

	statusCheck() {
		var subMenuItems = [
			{activityName: 'UPDATE_AUDITABLE_ITEM', submenuItem: {type: 'edit_modal'}},
			{activityName: 'DELETE_AUDITABLE_ITEM', submenuItem: {type: 'delete'}},
			{activityName: null, submenuItem: {type: 'close',path:'../'}}
		  ]
		  
		if (AuditableItemMasterStore.individualLoaded && AuditableItemMasterStore.auditableItemDetails.status.id == 1) {

			// SubMenuItemStore.setSubMenuItems([
			// 	{ type: 'edit_modal' },
			// 	{ type: 'delete' },
			// 	{ type: 'deactivate' },
			// 	{ type: 'close', path: '../' }
			// ]);
			subMenuItems.push(
                { activityName: 'DEACTIVATE_AUDITABLE_ITEM', submenuItem: { type: 'deactivate' } },
              )
		} else {
			// SubMenuItemStore.setSubMenuItems([
			// 	{ type: 'edit_modal' },
			// 	{ type: 'delete' },
			// 	{ type: 'activate' },
			// 	{ type: 'close', path: '../' }
			// ]);
			subMenuItems.push(
                { activityName: 'ACTIVATE_AUDITABLE_ITEM', submenuItem: { type: 'activate' } },
              )
		}
		this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
	}

	getAuditableItem(id) {
		this._auditableItemService.getItem(id).subscribe(res => {

			this.statusCheck();
			this._utilityService.detectChanges(this._cdr);

		});
	}

	gotoEditPage() {

		this._auditableItemService
			.getItem(AuditableItemMasterStore.auditableItemDetails.id)
			.subscribe((res) => {
				this._router.navigateByUrl('/internal-audit/auditable-items/edit-auditable-item');
				this._utilityService.detectChanges(this._cdr);
			});
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

	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteAuditableItem(status)
				break;

			case 'Activate': this.activateAuditableItem(status)
				break;

			case 'Deactivate': this.deactivateAuditableItem(status)
				break;

		}

	}

	// delete function call
	deleteAuditableItem(status: boolean) {

		if (status && this.popupObject.id) {
			this._auditableItemService.delete(this.popupObject.id).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
				this._router.navigateByUrl('/internal-audit/auditable-items');
				// this.closeConfirmationPopup();
				this.clearPopupObject();
			}, (error => {
				setTimeout(() => {
					if (error.status == 405) {
						this.deactivate(this.popupObject.id);
						this._utilityService.detectChanges(this._cdr);
					}
				}, 500);
			}))
		} else {
			this.closeConfirmationPopup();
			this.clearPopupObject();
		}
		setTimeout(() => {
			this.closeConfirmationPopup();
		}, 100);
	}

	activateAuditableItem(status: boolean) {

		if (status && this.popupObject.id) {
			this._auditableItemService.activate(this.popupObject.id).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
				this.closeConfirmationPopup();
				this.getAuditableItem(this.auditId);
				this.clearPopupObject();
			})

		}else{
			this.clearPopupObject();
			this.closeConfirmationPopup();
		}
	}

	setPreviewFocus() {
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
	}

	deactivateAuditableItem(status: boolean) {

		if (status && this.popupObject.id) {
			this._auditableItemService.deactivate(this.popupObject.id).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
				this.getAuditableItem(this.auditId);
				this.closeConfirmationPopup();
				this.clearPopupObject();
			})

		}else{
			this.clearPopupObject();
			this.closeConfirmationPopup();
		}
	}




	closeConfirmationPopup() {
		$(this.confirmationPopUp.nativeElement).modal('hide');
		this._utilityService.detectChanges(this._cdr);
	}

	// for popup object clearing
	clearPopupObject() {
		this.popupObject.id = null;
		this.popupObject.title = '';
		this.popupObject.subtitle = '';
		this.popupObject.type = '';

	}

	// for activate 
	activate(id: number) {
		this.popupObject.id = id;
		this.popupObject.title = 'Activate Auditable Item?';
		this.popupObject.subtitle = 'activate_auditable_item_subtitle';
		this.popupObject.type = 'Activate';
		this._utilityService.detectChanges(this._cdr);
		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Auditable Item?';
		this.popupObject.subtitle = 'deactivate_auditable_item_subtitle';
		this.popupObject.type = 'Deactivate';
		this._utilityService.detectChanges(this._cdr);
		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Auditable Item?';
		this.popupObject.subtitle = 'delete_adutibale_item';
		this.popupObject.type = '';
		this._utilityService.detectChanges(this._cdr);
		$(this.confirmationPopUp.nativeElement).modal('show');

	}



	// Setting Accordion for Controls

	getControlDetails(id: number, index: number) {

		this.ControlStore.unsetControlDetails();
		// this.AuditableItemMasterStore.setControlAccordionForDetails(index);
		if (this.selectedIndex == index)
			this.selectedIndex = null;
		else
			this.selectedIndex = index;
		this._controlService.getItemById(id).subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})
		this._utilityService.detectChanges(this._cdr);


	}

	// // Returns default image
	// getDefaultImage(type) {
	//   return this._imageService.getDefaultImageUrl(type);
	// }

	// createPreviewUrl(type, token) {
	//   return this._imageService.getThumbnailPreview(type, token)
	// }


	// // Returns image url according to type and token
	// createImageUrl(type, token) {
	//   return this._internalAuditFileService.getThumbnailPreview(type, token);
	// }



	// for downloading files
	downloadAuditableItemDocument(type, auditableItem, auditableItemDocument) {

		event.stopPropagation();
		switch (type) {
			case "downloadAuditableItemDocument":
				this._internalAuditFileService.downloadFile(
					"auditable-item",
					auditableItem.id,
					auditableItemDocument.id,
					null,
					auditableItemDocument.name,
					auditableItemDocument
				);
				break;

		}

	}

	// preview modal open function
	// openPreviewModal(type, filePreview, auditableItemDocument, auditableItem) {
	//   switch (type) {
	//     case "viewDocument":
	//       this.previewObject.component = "auditable-item";
	//       break;
	//     default:
	//       break;
	//   }

	//   let previewItem = null;
	//   if (filePreview) {
	//     previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
	//     this.previewObject.preview_url = previewItem;
	//     this.previewObject.file_details = auditableItemDocument;
	//     if (type == "viewDocument") {
	//       this.previewObject.componentId = auditableItem.id;
	//     } else {
	//       this.previewObject.componentId = auditableItem.id;
	//     }

	//     this.previewObject.uploaded_user =
	//     auditableItem.updated_by.length > 0 ? auditableItem.updated_by : auditableItem.created_by;
	//     this.previewObject.created_at = auditableItem.created_at;
	//     $(this.filePreviewModal.nativeElement).modal("show");
	//     this._utilityService.detectChanges(this._cdr);
	//   }
	// }



	// *// Closes from preview
	//   closePreviewModal(event) {
	//   $(this.filePreviewModal.nativeElement).modal("hide");
	//   this.previewObject.preview_url = "";
	//   this.previewObject.uploaded_user = null;
	//   this.previewObject.created_at = "";
	//   this.previewObject.file_details = null;
	//   this.previewObject.componentId = null;
	// }

	// for file preview

	viewAuditDocument(type, auditableItem, auditableItemDocument) {


		switch (type) {
			case "viewDocument":
				this._internalAuditFileService
					.getFilePreview("auditable-item", auditableItem.id, auditableItemDocument.id)
					.subscribe((res) => {
						var resp: any = this._utilityService.getDownLoadLink(
							res,
							auditableItem.name
						);
						this.openPreviewModal(type, resp, auditableItemDocument, auditableItem);
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

	// extension check function
	// checkExtension(ext, extType) {

	//   return this._imageService.checkFileExtensions(ext, extType)

	// }

	getTimezoneFormatted(time) {
		return this._helperService.timeZoneFormatted(time);
	}


	// Common File Upload Details Page Function Starts Here

	openPreviewModal(type, filePreview, documentFiles, document) {
		this.previewObject.component = type


		let previewItem = null;
		if (filePreview) {
			previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
			this.previewObject.preview_url = previewItem;
			this.previewObject.file_details = documentFiles;
			this.previewObject.componentId = document.id;


			this.previewObject.uploaded_user =
				document.updated_by ? document.updated_by : document.created_by;
			this.previewObject.created_at = document.created_at;
			$(this.filePreviewModal.nativeElement).modal("show");
			this._utilityService.detectChanges(this._cdr);
		}
	}

	*// Closes from preview
		closePreviewModal(event) {
		$(this.filePreviewModal.nativeElement).modal("hide");
		this.previewObject.preview_url = "";
		this.previewObject.uploaded_user = null;
		this.previewObject.created_at = "";
		this.previewObject.file_details = null;
		this.previewObject.componentId = null;
	}

	downloadDocumentFile(type, document, docs?) {
		event.stopPropagation();
		switch (type) {
			case "auditable-item":
				this._internalAuditFileService.downloadFile(
					type,
					document.auditable_item_id,
					document.id,
					null,
					document.title,
					document
				);
				break;
			case "document-version":
				this._documentFileService.downloadFile(
					type,
					document.document_id,
					docs.id,
					null,
					document.title,
					docs
				);
				break;
		}
	}

	viewDocument(type, documents, documentFile) {
		switch (type) {
			case "auditable-item":
				this._internalAuditFileService
					.getFilePreview(type, documents.auditable_item_id, documentFile.id)
					.subscribe((res) => {
						var resp: any = this._utilityService.getDownLoadLink(
							res,
							documents.title
						);
						this.openPreviewModal(type, resp, documentFile, documents);
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

			case "document-version":
				this._documentFileService
					.getFilePreview(type, documents.document_id, documentFile.id)
					.subscribe((res) => {
						var resp: any = this._utilityService.getDownLoadLink(
							res,
							documents.title
						);
						this.openPreviewModal(type, resp, documentFile, documents);
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


	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	createPreviewUrl(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}


	// Returns image url according to type and token
	createImageUrl(type, token) {
		if (type == 'auditable-item')
			return this._internalAuditFileService.getThumbnailPreview(type, token);
		else
			return this._documentFileService.getThumbnailPreview(type, token);

	}

	// extension check function
	checkExtension(ext, extType) {

		return this._imageService.checkFileExtensions(ext, extType)

	}



	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}
	// Common FIle Upload Details Page Function Ends Here

	ngOnDestroy() {
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.popupControlAuditableEventSubscription.unsubscribe();
		AuditableItemMasterStore.individualLoaded = false;
		this.previewFocusSubscription.unsubscribe();
	}
}
