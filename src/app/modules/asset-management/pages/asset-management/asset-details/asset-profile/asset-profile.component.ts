import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetCriticalityService } from 'src/app/core/services/asset-management/asset-register/asset-criticality/asset-criticality.service';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetCriticalityStore } from 'src/app/stores/asset-management/asset-register/asset-criticality-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetManagementSettingStore } from 'src/app/stores/settings/asset-settings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
declare var $: any;


@Component({
	selector: 'app-asset-profile',
	templateUrl: './asset-profile.component.html',
	styleUrls: ['./asset-profile.component.scss']
})
export class AssetProfileComponent implements OnInit {
	@ViewChild("filePreviewModal") filePreviewModal: ElementRef;
	@ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;

	duration_table = []

	AppStore = AppStore;
	AssetRegisterStore = AssetRegisterStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	AssetCriticalityStore = AssetCriticalityStore;
	OrganizationModulesStore = OrganizationModulesStore;
	AssetManagementSettingStore = AssetManagementSettingStore;

	id: number;
	// individualAssetDetails: any;
	reactionDisposer: IReactionDisposer;
	deleteEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	previewFocusSubscription: any;
	popupControlAuditableEventSubscription: any;

	previewObject = {
		preview_url: null,
		file_details: null,
		uploaded_user: null,
		created_at: "",
		component: "",
		componentId: null,
	};

	popupObject = {
		type: "",
		title: "",
		id: null,
		subtitle: "",
	};

	constructor(
		private _assetRegisterService: AssetRegisterService,
		private _imageService: ImageServiceService,
		private _router: Router,
		private _route: ActivatedRoute,
		private _utilityService: UtilityService,
		private _sanitizer: DomSanitizer,
		private _cdr: ChangeDetectorRef,
		private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
		private _assetCriticalityService: AssetCriticalityService,
		private _documentFileService: DocumentFileService,
		private _renderer2: Renderer2,
	) {
		this._route.params.subscribe(params => {
			this.id = params.id;
			AssetRegisterStore.assetId = params.id;
		});
	}

	ngOnInit(): void {
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		var subMenuItems = [
				{ activityName: 'UPDATE_ASSET', submenuItem: { type: 'edit_modal' } },
				{ activityName: 'DELETE_ASSET', submenuItem: { type: 'delete' } },
				{ activityName: null, submenuItem: { type: 'close', path: "/asset-management/assets" } },
				
			]
			
			
		this.reactionDisposer = autorun(() => {
			
			this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "edit_modal":
						this.editAsset();
						break;
					case "delete":
						this.delete();
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
		})

		this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
			(item) => {
				this.modalControl(item);
			}
		);

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

		this.popupControlAuditableEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		this.previewFocusSubscription = this._eventEmitterService.previewFocus.subscribe(res => {
			this.setPreviewFocus();
		})

		// this.setCustodianTitle();

		if (AssetRegisterStore.individual_asset_loaded) {
			this.getCriticalityData();
			this.depreciation();
		}

		else
			this.getAssetData();

	}

	setPreviewFocus() {
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.filePreviewModal.nativeElement, 'overflow', 'auto');
	}

	editAsset() {
		AssetRegisterStore.setAssetId(this.id);
		AssetRegisterStore.editFlag = true;
		this._router.navigateByUrl('asset-management/assets/edit-asset');
	}

	getAssetData() {
		if (AssetRegisterStore.assetId) {
			this._assetRegisterService.getItem(AssetRegisterStore.assetId).subscribe(res => {
				this._utilityService.detectChanges(this._cdr)
				this.depreciation();
				this.getCriticalityData();

			})
		}

	}

	getCriticalityData() {
		this._assetCriticalityService.getItem().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	deleteAsset(status: boolean) {
		if (status && this.popupObject.id) {
			this._assetRegisterService.deleteAsset(this.popupObject.id).subscribe(
				(resp) => {
					setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
					// this.closeConfirmationPopUp();
					// this.clearPopupObject();
					this._router.navigateByUrl('/asset-management/assets');
				}, 500);
				
				},
			);
			this.clearPopupObject();
		} else {
			
			this.clearPopupObject();
		}
		setTimeout(() => {
			this.closeConfirmationPopUp();
		  }, 250);
	}


	delete() {
		event.stopPropagation();
		this.popupObject.type = "";
		this.popupObject.id = this.id;
		this.popupObject.title = "Delete Asset?";
		this.popupObject.subtitle = "common_delete_subtitle";
		$(this.confirmationPopUp.nativeElement).modal("show");
	}

	closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal("hide");
		this._utilityService.detectChanges(this._cdr);
	}

	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case "":
				this.deleteAsset(status);
				break;
		}
	}

	clearPopupObject() {
		this.popupObject.id = null;
	}

	getYear(date) {
		return new Date(date).getFullYear();
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
		userDetial['created_at'] = created ? created : null;
		return userDetial;

	}

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}
	// extension check function
	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType)
	}

	createImageUrl(type, token) {
		if (type == 'asset-item')
			return this._assetRegisterService.getThumbnailPreview(type, token);
		else
			return this._documentFileService.getThumbnailPreview(type, token);
	}

	round(number) {
		return Math.round(number);
	}

	depreciation() {
		let yr: any;
		let cost: any;
		if (AssetRegisterStore.individualAssetDetails?.depreciation_duration && AssetRegisterStore.individualAssetDetails?.depreciation_percentage) {
			// var currenyYear = Number(AssetRegisterStore.individualAssetDetails?.purchased_date.split('-')[0]);
			var currentYear = new Date(AssetRegisterStore.individualAssetDetails?.purchased_date).getFullYear();
			cost = AssetRegisterStore.individualAssetDetails?.asset_value;
			let annualDepriciation = Math.floor(cost * (AssetRegisterStore.individualAssetDetails?.depreciation_percentage / 100));
				
			for (var i = 0; i <= AssetRegisterStore.individualAssetDetails?.depreciation_duration; i++) {
				yr = currentYear + i;
				const row = {
					year: yr,
					value: cost
				};
				this.duration_table.push(row);
				cost = cost - annualDepriciation>0?cost - annualDepriciation:0;
			}
		}
		this._utilityService.detectChanges(this._cdr);

	}



	getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

	// setCustodianTitle() {
	// 	this.individualAssetDetails = AssetRegisterStore.getAssetRegisterById(this.id);
	// }

	// viewAuditDocument(type, assetItem, assetItemDocument) {


	// 	switch (type) {
	// 		case "viewDocument":
	// 			this._assetRegisterService
	// 				.getFilePreview("asset-item", this.id, assetItemDocument.id)
	// 				.subscribe((res) => {
	// 					var resp: any = this._utilityService.getDownLoadLink(
	// 						res,
	// 						assetItem.name
	// 					);
	// 					this.openPreviewModal(type, resp, assetItemDocument, assetItem);
	// 				}),
	// 				(error) => {
	// 					if (error.status == 403) {
	// 						this._utilityService.showErrorMessage(
	// 							"Error",
	// 							"Permission Denied"
	// 						);
	// 					} else {
	// 						this._utilityService.showErrorMessage(
	// 							"Error",
	// 							"Unable to generate Preview"
	// 						);
	// 					}
	// 				};
	// 			break;
	// 	}
	// }

	viewDocument(type, documents, documentFile) {
		switch (type) {
			case "asset-item":
				this._assetRegisterService
					.getFilePreview(type, documents.asset_id, documentFile.id)
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

	// openPreviewModal(type, filePreview, assetItemDocument, assetItem) {
	// 	switch (type) {
	// 		case "viewDocument":
	// 			this.previewObject.component = "auditable-item";
	// 			break;
	// 		default:
	// 			break;
	// 	}

	// 	let previewItem = null;
	// 	if (filePreview) {
	// 		previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
	// 		this.previewObject.preview_url = previewItem;
	// 		this.previewObject.file_details = assetItemDocument;
	// 		if (type == "viewDocument") {
	// 			this.previewObject.componentId = assetItem.id;
	// 		} else {
	// 			this.previewObject.componentId = assetItem.id;
	// 		}

	// 		this.previewObject.uploaded_user =
	// 			assetItem.updated_by.length > 0 ? assetItem.updated_by : assetItem.created_by;
	// 		this.previewObject.created_at = assetItem.created_at;
	// 		$(this.filePreviewModal.nativeElement).modal("show");
	// 		this._utilityService.detectChanges(this._cdr);
	// 	}
	// }

	// Returns image url according to type and token

	// downloadAssetItemDocument(type, assetItem, assetItemDocument) {

	// 	event.stopPropagation();
	// 	switch (type) {
	// 		case "downloadAssetItemDocument":
	// 			this._assetRegisterService.downloadFile(
	// 				"asset-item",
	// 				assetItem.id,
	// 				assetItemDocument.id,
	// 				null,
	// 				assetItemDocument.name,
	// 				assetItemDocument
	// 			);
	// 			break;
	// 	}
	// }

	downloadDocumentFile(type, document, docs?) {
		event.stopPropagation();
		switch (type) {
			case "asset-item":
				this._assetRegisterService.downloadFile(
					type,
					document.asset_id,
					document.id,
					null,
					document.name,
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

	*// Closes from preview
		closePreviewModal(event) {
		$(this.filePreviewModal.nativeElement).modal("hide");
		this.previewObject.preview_url = "";
		this.previewObject.uploaded_user = null;
		this.previewObject.created_at = "";
		this.previewObject.file_details = null;
		this.previewObject.componentId = null;
	}
	getOwnerPopupDetails(users) {
		let userDetial: any = {};
		
		  userDetial['first_name'] = users?.first_name ? users?.first_name : users?.title? users?.title : '';
		  userDetial['last_name'] = users?.last_name;
		  userDetial['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
		  userDetial['image_token'] = users?.image?.token;
		  userDetial['email'] = users?.email;
		  userDetial['mobile'] = users?.mobile;
		  userDetial['id'] = users?.id;
		  userDetial['department'] = users?.department;
		  userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
		
		return userDetial;
	  }
	ngOnDestroy() {
		SubMenuItemStore.makeEmpty();
		this.deleteEventSubscription.unsubscribe();
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.popupControlAuditableEventSubscription.unsubscribe();
		this.previewFocusSubscription.unsubscribe();
		//   AssetRegisterStore.individual_asset_loaded=false;
		//   AssetRegisterStore.clearDocumentDetails();
		//   AssetRegisterStore.unsetIndiviudalAssetDetails();

	}
}
