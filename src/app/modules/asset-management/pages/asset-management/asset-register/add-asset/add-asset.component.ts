import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';
import { AssetSubCategoryStore } from 'src/app/stores/masters/asset-management/asset-sub-category-store';
import { AssetCategory, AssetCategoryPaginationResponse } from "src/app/core/models/masters/asset-management/asset-category";
import { AuthStore } from 'src/app/stores/auth.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { AssetSubCategoryService } from 'src/app/core/services/masters/asset-management/asset-sub-category/asset-sub-category.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { AssetLocationService } from 'src/app/core/services/masters/asset-management/asset-location/asset-location.service';
import { AssetSubCategory, AssetSubCategoryPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-sub-category';
import { AssetLocation, AssetLocationPaginationResponse, IndividualAssetLocation } from 'src/app/core/models/masters/asset-management/asset-location';
import { AssetLocationStore } from 'src/app/stores/masters/asset-management/asset-location-store';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { Suppliers, SuppliersPaginationResponse } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { Designation, DesignationPaginationResponse, DesignationCompetency } from 'src/app/core/models/masters/human-capital/designation';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { autorun, IReactionDisposer } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AssetInvestmentTypesService } from 'src/app/core/services/masters/asset-management/asset-investment-types/asset-investment-types.service';
import { AssetInvestmentTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-investment-types-store';
import { AssetTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-types-master.store';
import { AssetTypesService } from 'src/app/core/services/masters/asset-management/asset-types/asset-types.service';
import { AssetTypes, AssetTypesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-types';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import * as myCkEditor from 'src/assets/build/ckeditor';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AddUserService } from 'src/app/core/services/human-capital/user/add-user/add-user.service';
import { PhysicalConditionRankingsMasterStore } from 'src/app/stores/masters/asset-management/physical-condition-rankings-store';
import { PhysicalConditionRankingsService } from 'src/app/core/services/masters/asset-management/physical-condition-rankings/physical-condition-rankings.service';
import { PhysicalConditionRankings, PhysicalConditionRankingsPaginationResponse } from 'src/app/core/models/masters/asset-management/physical-condition-rankings';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { DomSanitizer } from '@angular/platform-browser';
import { title } from 'process';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { AssetManagementSettingsService } from 'src/app/core/services/settings/organization_settings/asset-management-settings/asset-management-settings.service';
import { AssetManagementSettingStore } from 'src/app/stores/settings/asset-settings-store';

declare var $: any;

@Component({
	selector: 'app-add-asset',
	templateUrl: './add-asset.component.html',
	styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {

	@ViewChild('cancelPopup') cancelPopup: ElementRef;
	@ViewChild('formSteps') formSteps: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('navigationBar') navigationBar: ElementRef;
	@ViewChild('assetCategoryModal') assetCategoryModal: ElementRef;
	@ViewChild('assetSubCategoryModal') assetSubCategoryModal: ElementRef;
	@ViewChild('assetLocationModal') assetLocationModal: ElementRef;
	@ViewChild('custodianModal') custodianModal: ElementRef;
	@ViewChild('supplierModal') supplierModal: ElementRef;
	@ViewChild('assetTypeModal') assetTypeModal: ElementRef;
	@ViewChild("filePreviewModal") filePreviewModal: ElementRef;
	@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;

	assetForm: FormGroup;
	reactionDisposer: IReactionDisposer;
	formErrors: any;
	asserCategorySubscription: any;
	asserSubCategorySubscription: any;
	asserLocationSubscription: any;
	supplierSubscription: any;
	custodianSubscription: any;
	cancelEventSubscription: any;
	asserTypeSubscription: any;
	organisationChangesModalSubscription: any;
	openModelPopup: boolean;

	AssetCategoryStore = AssetCategoryStore;
	PhysicalConditionRankingsStore = PhysicalConditionRankingsMasterStore
	SubMenuItemStore = SubMenuItemStore;
	AssetLocationStore = AssetLocationStore;
	AssetSubCategoryStore = AssetSubCategoryStore;
	UsersStore = UsersStore;
	AuthStore = AuthStore;
	AssetRegisterStore = AssetRegisterStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	MsTypeOrganizationStore = MsTypeStore;
	SubsidiaryStore = SubsidiaryStore;
	AppStore = AppStore;
	DivisionStore = DivisionMasterStore;
	SuppliersMasterStore = SuppliersMasterStore;
	DepartmentStore = DepartmentMasterStore;
	DesignationStore = DesignationMasterStore;
	SectionStore = SectionMasterStore;
	SubSectionStore = SubSectionMasterStore;
	AssetInvestmentTypesStore = AssetInvestmentTypesMasterStore;
	AssetManagementSettingStore = AssetManagementSettingStore; 
	AssetTypesMasterStore = AssetTypesMasterStore;
	fileUploadPopupStore = fileUploadPopupStore;
	fileUploadPopupSubscriptionEvent: any = null;

	currentTab = 0;
	is_save: boolean=false;
	// selectedSection = 'control';
	nextButtonText = 'next';
	previousButtonText = "previous";
	selectedCar: number;
	selectedCat: any;
	saveData: any = null;
	invesetmentType: any;
	public Editor;
	public Config;
	duration_table = [];
	assetDetails: any;
	msg= null;
	errtest =null;
	fileUploadsArray: any = []; // Display Mutitle File Loaders
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	// individualAssetDetails: any;

	cars = [
		{ id: 1, name: 'Volvo' },
		{ id: 2, name: 'Saab' },
		{ id: 3, name: 'Opel' },
		{ id: 4, name: 'Audi' },
	];



	confirmationObject = {
		title: 'Cancel?',
		subtitle: 'common_cancel_subtitle',
		type: 'Cancel'
	};

	assetCategoryObject = {
		component: 'Master',
		values: null,
		type: null
	};

	assetTypeObject = {
		component: 'Master',
		values: null,
		type: null
	};

	assetSubCategoryObject = {
		component: 'Master',
		values: null,
		type: null,
		category_id: null
	};

	assetLocationObject = {
		component: 'Master',
		values: null,
		type: null
	};

	custodianObject = {
		component: 'Master',
		values: null,
		type: null
	};

	supplierObject = {
		component: 'Master',
		values: null,
		type: null
	};

	OrganizationLevelObject = {
		component: 'asset',
		values: null,
		type: null
	};

	previewObject = {
		preview_url: null,
		file_details: null,
		uploaded_user: null,
		created_at: "",
		component: "",
		componentId: null,
	};

	formObject = {
		0: [
			'asset_type_id', 'asset_category_id', 'asset_sub_category_id', 'purchased_date', 'organization_id', 'division_id', 'ms_type_organization_ids', 'asset_location_ids', 'department_id', 'supplier_id', 'asset_investment_type_id', 'custodian_id', 'asset_owner_id','section_id', 'sub_section_id', 'physical_condition_ranking_id', 'title', 'lifetime_year', 'value', 'description','serial_number', 'lifetime_month', 'remarks', 'contains',
		],
		1: [
			'depreciation_duration', 'depreciation_percentage',

		],
		2: [
			'specification'
		],
		3: [
			'documents'
		]
	};

	config = {
		// toolbar: [
		//   { name: 'document', items: ['Source', '-', 'Preview'] },
		//   { name: 'clipboard', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
		//   { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
		//   { name: 'links', items: ['Link', 'Unlink', 'Anchor'] }, '/',
		//   { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
		//   { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
		//   { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
		//   { name: 'tools', items: ['Maximize'] },
		//   { name: 'about', items: ['About'] }
		// ]
		toolbar: [
			'undo',
			'redo',
			'|',
			'heading',

			'|',
			'bold',
			'italic',

			'|',
			'link',
			'imageUpload',
			'|',

			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'insertTable',
			'blockQuote',

		],
		language: 'id',
		image: {
			toolbar: [
				'imageTextAlternative',
				'imageStyle:full',
				'imageStyle:side'
			]
		}
	};

	constructor(
		private _renderer2: Renderer2,
		private _router: Router,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _assetCategoryService: AssetCategoryService,
		private _eventEmitterService: EventEmitterService,
		private _formBuilder: FormBuilder,
		private _assetRegisterService: AssetRegisterService,
		private _assetSubCategoryService: AssetSubCategoryService,
		private _helperService: HelperServiceService,
		private _subsidiaryService: SubsidiaryService,
		private _departmentService: DepartmentService,
		private _divisionService: DivisionService,
		private _sectionService: SectionService,
		private _subSectionService: SubSectionService,
		private _usersService: UsersService,
		private _msTypeOrganizationService: MstypesService,
		private _assetLocationService: AssetLocationService,
		private _suppliersService: SuppliersService,
		private _designationService: DesignationService,
		private _assetInvestmentTypesService: AssetInvestmentTypesService,
		private _assetTypesService: AssetTypesService,
		private _http: HttpClient,
		private _imageService: ImageServiceService,
		private _addUserService: AddUserService,
		private _physicalConditionRankingsService: PhysicalConditionRankingsService,
		private _sanitizer: DomSanitizer, private _documentFileService: DocumentFileService,
		private _fileUploadPopupService: FileUploadPopupService,
		private _humanCapitalService:HumanCapitalService,
		private _assetManagementSettingsService:AssetManagementSettingsService
	) {
		this.Editor = myCkEditor;
	}

	public onReady(editor: any) {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	ngOnInit(): void {
		// this.reactionDisposer = autorun(() => {
			// SubMenuItemStore.setSubMenuItems([
			// 	{ type: "close", path: "../" }
			// ]);

			// if (SubMenuItemStore.clikedSubMenuItem) {
			// 	switch (SubMenuItemStore.clikedSubMenuItem.type) {
			// 		case "close":
			// 			console.log('ente in close');
			// 			this.confirmCancel();
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// 	//Don't forget to unset clicked item immediately after using it
			// 	SubMenuItemStore.unSetClickedSubMenuItem();
			// }
		// })
		SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl ? AppStore.previousUrl : '/asset-management/assets' }]);
		this.getInvestmentType();
		// ClassicEditor
		// 	.create(document.querySelector('#specification'), {
		// 		extraPlugins: [MyUploadAdapter],

		// 		// ...
		// 	})
		// 	.catch(error => {
		// 		// console.log( error );
		// 	});
		setTimeout(() => {
			this.showTab(this.currentTab);
			this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', 'auto');
			window.addEventListener('scroll', this.scrollEvent, true);
			// window.addEventListener('click', this.clickEvent, false);
			this._utilityService.detectChanges(this._cdr);
		}, 250);


		this.assetForm = this._formBuilder.group({
			id: [null],
			title: [null, [Validators.required]],
			serial_number:[''],
			value: [null, [Validators.required]],
			description: [''],
			lifetime_month: [null],
			remarks: [''],
			specification: [''],
			contains: [''],
			depreciation_duration: [null],
			depreciation_percentage: [null],
			documents: [[]],
			asset_category_id: [null, [Validators.required]],
			asset_sub_category_id: [null],
			purchased_date: [null, [Validators.required]],
			organization_id: [null],
			ms_type_organization_ids: [null],
			department_id: [null],
			division_id: [null],
			asset_location_ids: [null, [Validators.required]],
			supplier_id: [null, [Validators.required]],
			asset_type_id: [null, [Validators.required]],
			asset_investment_type_id: [null, [Validators.required]],
			custodian_id: [null, [Validators.required]],
			asset_owner_id: [null, [Validators.required]],
			section_id: [null],
			sub_section_id: [null],
			physical_condition_ranking_id: [null, [Validators.required]],
			lifetime_year: [null, [Validators.required]],


		});

		this.asserCategorySubscription = this._eventEmitterService.AssetCategory.subscribe(item => {
			this.closeAssetCategoryModal();
		});
		this.asserSubCategorySubscription = this._eventEmitterService.AssetSubCategory.subscribe(item => {
			this.closeAssetSubCategoryModal();
		});
		this.asserLocationSubscription = this._eventEmitterService.AssetLocation.subscribe(item => {
			this.closeAssetLocationModal();
		});
		this.supplierSubscription = this._eventEmitterService.supplier.subscribe(item => {
			this.closeSupplierModal();
		});
		this.custodianSubscription = this._eventEmitterService.designationControl.subscribe(item => {
			this.closeCustodianModal();
		});
		this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancelByUser(item);
		})
		this.asserTypeSubscription = this._eventEmitterService.assetTypes.subscribe(item => {
			this.closeAssetTypeModal();
		});

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

		this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
			(res) => {
				this.closeModal(res);
			});

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

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.assetForm.controls['division_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.assetForm.controls['section_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.assetForm.controls['sub_section_id'].setValidators(Validators.required);
			if (OrganizationGeneralSettingsStore?.organizationSettings?.is_ms_type)
			this.assetForm.controls['ms_type_organization_ids'].setValidators(Validators.required);




		this.assetForm.patchValue({
			purchased_date: this._helperService.getTodaysDateObject()
		})


		if (AssetRegisterStore.editFlag && AssetRegisterStore.assetId) {
			AssetRegisterStore.unsetIndiviudalAssetDetails();
			AssetRegisterStore.clearDocumentDetails();
			this.setEditValues();
			this._utilityService.detectChanges(this._cdr);
		}
		else {
			AssetRegisterStore.unsetIndiviudalAssetDetails();
			AssetRegisterStore.clearDocumentDetails();
			if (AssetRegisterStore.addCorporate) {
				this.assetForm.patchValue({
					is_corporate: true
				})
			}
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.getPrimaryOrganization();
			}
			this.setInitialOrganizationLevels();
		}


	}



	getButtonText(text) {

		return this._helperService.translateToUserLanguage(text);
	}

	getMonthNumber() {
		this.errtest = null;
		if (this.assetForm.value.lifetime_month > 12 || this.assetForm.value.lifetime_month < 1) {
			this.errtest = "Only allow values between 1 to 12";
		}
	}

	getDepreciation() {
		let yr: any;
		let cost: any;
		this.duration_table = [];
		this.msg = null;
		this._utilityService.detectChanges(this._cdr);
		if (this.assetForm.value.depreciation_duration && this.assetForm.value.depreciation_percentage) {
			if(this.assetForm.value.depreciation_percentage <= 100 && this.assetForm.value.depreciation_percentage >= 0){
				var currenyYear = this.assetForm.value.purchased_date?.year;
				cost = this.assetForm.value.value;
				let annualDepriciation = Math.floor(cost * (this.assetForm.value.depreciation_percentage / 100));
				for (var i = 0; i <= this.assetForm.value.depreciation_duration; i++) {
					yr = currenyYear + i;
					const row = {
						year: yr,
						value: cost
					};
					this.duration_table.push(row);
					
					cost = cost - annualDepriciation>0?cost - annualDepriciation:0;
				}
			}
			else {
			
				this.msg = "Please enter values between 1 and 100";
			}
		}
		
		this._utilityService.detectChanges(this._cdr);

	}

	onFileChange(event, type: string) {
		var selectedFiles: any[] = event.target.files;
		if (selectedFiles.length > 0) {
			var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
			this.checkForFileUploadsScrollbar();
			Array.prototype.forEach.call(temporaryFiles, elem => {
				const file = elem;
				if (this._imageService.validateFile(file, type)) {
					const formData = new FormData();
					formData.append('file', file);
					var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
					this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
						.subscribe((res: HttpEvent<any>) => {
							let uploadEvent: any = res;
							switch (uploadEvent.type) {
								case HttpEventType.UploadProgress:
									// Compute and show the % done;
									if (uploadEvent.loaded) {
										let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
										this.assignFileUploadProgress(upProgress, file);
									}
									this._utilityService.detectChanges(this._cdr);
									break;
								case HttpEventType.Response:
									//return event;
									let temp: any = uploadEvent['body'];
									temp['is_new'] = true;
									this.assignFileUploadProgress(null, file, true);
									this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
										this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
									}, (error) => {
										this.assignFileUploadProgress(null, file, true);
										this._utilityService.detectChanges(this._cdr);
									})
							}
						}, (error) => {
							this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
							this.assignFileUploadProgress(null, file, true);
							this._utilityService.detectChanges(this._cdr);
						})
				}
				else {
					this.assignFileUploadProgress(null, file, true);
				}
			});
		}
	}

	/**
* 
* @param progress File Upload Progress
* @param file Selected File
* @param success Boolean value whether file upload success 
*/
	assignFileUploadProgress(progress, file, success = false) {

		let temporaryFileUploadsArray = this.fileUploadsArray;
		this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
	}

	createImageFromBlob(image: Blob, imageDetails, type) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			var logo_url = reader.result;

			imageDetails['preview'] = logo_url;
			if (imageDetails != null)
				this._assetRegisterService.setDocumentDetails(imageDetails, logo_url);
			this.checkForFileUploadsScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, false);

		if (image) {
			reader.readAsDataURL(image);
		}
	}

	/**
 * 
 * @param files Selected files array
 * @param type type of selected files - logo or brochure
 */
	addItemsToFileUploadProgressArray(files, type) {
		var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
		this.fileUploadsArray = result.fileUploadsArray;
		return result.files;
	}

	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType);
	}


	/**
	 * removing document file from the selected list
	 * @param token -image token
	 */
	removeDocument(token) {
		AssetRegisterStore.unsetDocumentDetails(token);
		this.checkForFileUploadsScrollbar();
		this._utilityService.detectChanges(this._cdr);
	}

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	getPrimaryOrganization() {
		this._subsidiaryService.getAllItems(false).subscribe(res => {
			if (!OrganizationLevelSettingsStore?.organizationLevelSettings?.is_subsidiary) {
				if (AssetRegisterStore.addCorporate) {
					this.assetForm.patchValue({ organization_id: [res['data'][0]] });

				}
				else {
					this.assetForm.patchValue({ organization_id: res['data'][0] });

				}
			}

			this._utilityService.detectChanges(this._cdr);
		});
	}

	setInitialOrganizationLevels() {
		let user = AuthStore.user
		user.first_name = user.name
		this.assetForm.patchValue({
			division_id: AuthStore?.user?.division ? AuthStore?.user?.division : null,
			department_id: AuthStore?.user?.department ? AuthStore?.user?.department : null,
			section_id: AuthStore?.user?.section ? AuthStore?.user?.section : null,
			sub_section_id: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section : null,
			organization_id: AuthStore.user?.organization ? AuthStore.user?.organization : null,
		});

		this._utilityService.detectChanges(this._cdr);
	}

	searchSubsidiary(e) {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		}
	}

	descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}

	MyCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			// Configure the URL to the upload script in your back-end here!
			return new MyUploadAdapter(loader, this._http);
		};
	}

	radioChangeHandler(e) {
		this.invesetmentType = e.target.value;
	}


	searchMsType(e) {
		this._msTypeOrganizationService.getItems(false, 'q=' + e.term).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

	closeModal(data?) {
		if (data) {
			this.assetForm.patchValue({
				division_id: data.division_ids ? data.division_ids : null,
				department_id: data.department_ids ? data.department_ids : null,
				section_id: data.section_ids ? data.section_ids : null,
				sub_section_id: data.sub_section_ids ? data.sub_section_ids : null,
				organization_id: data.organization_ids ? data.organization_ids : null,
			})
		}
		this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
		this.openModelPopup = false;
		this.OrganizationLevelObject.values = null;
		this._utilityService.detectChanges(this._cdr);
	}
	//   closeModal(data?) {
	// 	if(data){
	// 	  this.strategyForm.patchValue({
	// 		division_ids: data.division_ids ? data.division_ids : [],
	// 		department_ids:data.department_ids ? data.department_ids : [],
	// 		section_ids:data.section_ids ? data.section_ids : [],
	// 		sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
	// 		organization_ids: data.organization_ids ? data.organization_ids : []
	// 	  })
	// 	}
	// 	this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
	// 	this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
	// 	this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
	// 	this.openModelPopup = false;
	// 	this._utilityService.detectChanges(this._cdr);
	//   }

	organisationChanges() {

		OrganizationalSettingsStore.isMultiple = false;
		if (AssetRegisterStore.editFlag) {
			this.OrganizationLevelObject.values = {
				id: this.assetForm.value.id,
				organization_ids: this.assetForm.value.organization_id ? this.assetForm.value.organization_id : null,
				division_ids: this.assetForm.value.division_id ? this.assetForm.value.division_id : null,
				department_ids: this.assetForm.value.department_id ? this.assetForm.value.department_id : null,
				section_ids: this.assetForm.value.section_id ? this.assetForm.value.section_id : null,
				sub_section_ids: this.assetForm.value.sub_section_id ? this.assetForm.value.sub_section_id : null
			}
		}
		else{
			this.OrganizationLevelObject.values = {
				// id: this.assetForm.value.id,
				organization_ids: this.assetForm.value.organization_id ? this.assetForm.value.organization_id : AuthStore?.user?.organization,
				division_ids: this.assetForm.value.division_id ? this.assetForm.value.division_id : AuthStore?.user?.division,
				department_ids: this.assetForm.value.department_id ? this.assetForm.value.department_id : AuthStore?.user?.department,
				section_ids: this.assetForm.value.section_id ? this.assetForm.value.section_id : AuthStore?.user?.section,
				sub_section_ids: this.assetForm.value.sub_section_id ? this.assetForm.value.sub_section_id : AuthStore?.user?.sub_section
			}
		}
		this.openModelPopup = true;
		this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	searchCustodian(e, patchValue: boolean = false) {
		this._designationService.getItems(false, '&q=' + e.term).subscribe((res: DesignationPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.assetForm.patchValue({ custodian_id: i.id });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	getMsType(fetch: boolean = false) {
		this._msTypeOrganizationService.getItems(fetch).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	getCustodian() {
		this._designationService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	getSelectedValues() {
		// this.selectedSection='issue';
		this.setSaveData();
		// this.editRisk();
		if (this.assetForm.value.ms_type_organization_ids) {
			AssetRegisterStore.msTypes = [];
			for (let i of this.assetForm.value.ms_type_organization_ids) {
				const index = this.MsTypeOrganizationStore.msTypeDetails.findIndex(e => e.id == i);
				if (index > -1) {
					AssetRegisterStore.msTypes.push(this.MsTypeOrganizationStore.msTypeDetails[index]);
				}
			}
		}

		if (this.assetForm.value.asset_location_ids) {
			AssetRegisterStore.assetLocation = [];
			for (let i of this.assetForm.value.asset_location_ids) {
				const index = this.AssetLocationStore.allItems.findIndex(e => e.id == i);
				if (index > -1) {
					AssetRegisterStore.assetLocation.push(this.AssetLocationStore.allItems[index]);
				}
			}
		}
	}

	
	setSaveData() {
		let saveData = {
			lifetime_month: this.assetForm.value.lifetime_month,
			remarks: this.assetForm.value.remarks,
			specification: this.assetForm.value.specification,
			contains: this.assetForm.value.contains,
			depreciation_duration: this.assetForm.value.depreciation_duration,
			depreciation_percentage: this.assetForm.value.depreciation_percentage,
			// documents: [],
			title: this.assetForm.value.title,
			value: this.assetForm.value.value,
			serial_number: this.assetForm.value.serial_number,
			description: this.assetForm.value.description,
			lifetime_year: this.assetForm.value.lifetime_year,
			asset_category_id: this.getType('asset_category_id'),
			ms_type_organization_ids: this.assetForm.value.ms_type_organization_ids ? this.assetForm.value.ms_type_organization_ids : [],
			organization_id: this.getType('organization_id'),
			purchased_date: this.assetForm.value.purchased_date ? this._helperService.processDate(this.assetForm.value.purchased_date, 'join') : null,
			division_id: this.getType('division_id'),
			asset_sub_category_id: this.getType('asset_sub_category_id'),
			asset_location_ids: this.assetForm.value.asset_location_ids ? this.assetForm.value.asset_location_ids : [],
			department_id: this.getType('department_id'),
			supplier_id: this.getType('supplier_id'),
			asset_type_id: this.getType('asset_type_id'),
			asset_investment_type_id: this.assetForm.value.asset_investment_type_id ? this.assetForm.value.asset_investment_type_id : null,
			custodian_id: this.getType('custodian_id'),
			asset_owner_id:this.getType('asset_owner_id'),
			section_id: this.getType('section_id'),
			sub_section_id: this.getType('sub_section_id')?this.getType('sub_section_id'):AuthStore.user.sub_section?.id,
			physical_condition_ranking_id: this.getType('physical_condition_ranking_id'),
		}
		saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		return saveData;
	}



	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}


	setDepreciationSaveData() {

		let saveData = {
			depreciation_duration: this.assetForm.value.depreciation_duration,
			depreciation_percentage: this.assetForm.value.depreciation_percentage,
			asset_depreciations: this.duration_table ? this.duration_table : []
		}
		this._utilityService.detectChanges(this._cdr);
		return saveData;
	}

	setSpecificationSaveData() {
		let saveData = {
			specification: this.assetForm.value.specification,
		}
		this._utilityService.detectChanges(this._cdr);
		return saveData;
	}

	setDocumentationSaveData() {
		
		let saveData = {};
		// let saveData = {
		//  documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save'),
		// }
		if (AssetRegisterStore.assetId && AssetRegisterStore.individualAssetDetails.asset_documents.length == 0) {
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
		} else if(AssetRegisterStore.editFlag && AssetRegisterStore.individualAssetDetails.asset_documents.length > 0){
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
		}
		this._utilityService.detectChanges(this._cdr);
		return saveData;
	}

	removeBrochure(type,token) {
		fileUploadPopupStore.unsetFileDetails(type, token);
		this._utilityService.detectChanges(this._cdr);
	  }



	// setCustodianTitle() {
	// 	this.individualAssetDetails = AssetRegisterStore.getAssetRegisterById(AssetRegisterStore.assetId);
	// }

	getType(type_id) {
		if (typeof this.assetForm.value[type_id] !== "number" && typeof this.assetForm.value[type_id] !== "object" && AssetRegisterStore.individualAssetDetails) {
			return parseInt(AssetRegisterStore.individualAssetDetails[type_id.replace('_id', '')]?.id);
		}
		else if (typeof this.assetForm.value[type_id] === "object") {
			return parseInt(this.assetForm.value[type_id]?.id);
		}
		return this.assetForm.value[type_id];
	}

	getTypes(types) {
		let type = [];
		for (let i of types) {
			type.push(i.id);
		}
		return type;
	}

	setEditValues() {
		this._assetRegisterService.getItem(AssetRegisterStore.assetId).subscribe(res => {
			if (AssetRegisterStore.individual_asset_loaded) {
				var assetItem = AssetRegisterStore.individualAssetDetails;
				this.clearCommonFilePopupDocuments();
				if (assetItem?.asset_documents?.length > 0) {
					this.setDocuments(assetItem.asset_documents);
				}

				this.assetForm.patchValue({
					id: AssetRegisterStore.individualAssetDetails?.id,
					lifetime_month: AssetRegisterStore.individualAssetDetails?.lifetime_month ? AssetRegisterStore.individualAssetDetails.lifetime_month : null,
					remarks: AssetRegisterStore.individualAssetDetails?.remarks,
					specification: AssetRegisterStore.individualAssetDetails?.specification,
					contains: AssetRegisterStore.individualAssetDetails?.asset_contains,
					depreciation_duration: AssetRegisterStore.individualAssetDetails?.depreciation_duration,
					depreciation_percentage: AssetRegisterStore.individualAssetDetails?.depreciation_percentage,
					documents: [],
					title: AssetRegisterStore.individualAssetDetails?.title,
					value: AssetRegisterStore.individualAssetDetails?.asset_value,
					serial_number: AssetRegisterStore.individualAssetDetails?.serial_number?AssetRegisterStore.individualAssetDetails.serial_number:null,
					description: AssetRegisterStore.individualAssetDetails?.description,
					lifetime_year: AssetRegisterStore.individualAssetDetails?.lifetime_year,
					asset_sub_category_id: AssetRegisterStore.individualAssetDetails?.asset_sub_category ? AssetRegisterStore.individualAssetDetails.asset_sub_category.id : null,
					supplier_id: AssetRegisterStore.individualAssetDetails?.supplier ? AssetRegisterStore.individualAssetDetails.supplier.id : null,
					asset_type_id: AssetRegisterStore.individualAssetDetails?.asset_type ? AssetRegisterStore.individualAssetDetails.asset_type.id : null,
					asset_investment_type_id: AssetRegisterStore.individualAssetDetails?.asset_investment_type ? AssetRegisterStore.individualAssetDetails.asset_investment_type.id : null,
					custodian_id: AssetRegisterStore.individualAssetDetails?.custodian ? AssetRegisterStore.individualAssetDetails.custodian.id : null,
					asset_owner_id: AssetRegisterStore.individualAssetDetails?.asset_owner ? AssetRegisterStore.individualAssetDetails.asset_owner : null,
					physical_condition_ranking_id: AssetRegisterStore.individualAssetDetails?.physical_condition_ranking.id,
					asset_category_id: AssetRegisterStore.individualAssetDetails?.asset_category ? AssetRegisterStore.individualAssetDetails.asset_category.id : null,
					purchased_date: AssetRegisterStore.individualAssetDetails?.purchased_date ? this._helperService.processDate(AssetRegisterStore.individualAssetDetails.purchased_date, 'split') : null,
					section_id: AssetRegisterStore.individualAssetDetails?.section ? AssetRegisterStore.individualAssetDetails.section : null,
					sub_section_id: AssetRegisterStore.individualAssetDetails?.sub_section ? AssetRegisterStore.individualAssetDetails.sub_section : null,
					organization_id: AssetRegisterStore.individualAssetDetails?.organization ? AssetRegisterStore.individualAssetDetails.organization : null,
					division_id: AssetRegisterStore.individualAssetDetails?.division ? AssetRegisterStore.individualAssetDetails.division : null,
					department_id: AssetRegisterStore.individualAssetDetails?.department ? AssetRegisterStore.individualAssetDetails.department : null,
					ms_type_organization_ids: AssetRegisterStore.individualAssetDetails?.ms_type_organizations ? this.getEditMsTypeValue(AssetRegisterStore.individualAssetDetails.ms_type_organizations) : [],
					asset_location_ids: AssetRegisterStore.individualAssetDetails?.asset_locations ? this.getEditLocationValue(AssetRegisterStore.individualAssetDetails.asset_locations) : [],

				})
				this.getMsType();
				this.getAssetLocation();
				this.getDepreciation();
				this.searchCustodian({term:AssetRegisterStore.individualAssetDetails?.custodian.id});
				this.getPhysical();
				this.searchAssetCategory({term:AssetRegisterStore.individualAssetDetails?.asset_category?.id});
				this.searchSubAssetCategory({term:AssetRegisterStore.individualAssetDetails?.asset_sub_category?.id});
				this.searchSupplier({term:AssetRegisterStore.individualAssetDetails?.supplier?.id});
				this.searchAssetType({term:AssetRegisterStore.individualAssetDetails?.asset_type?.id});
				this._utilityService.detectChanges(this._cdr);

			}

		})

	}

	setDocuments(documents) {

		let khDocuments = [];
		documents.forEach(element => {
			if (element.document_id) {
				element?.kh_document?.versions?.forEach(innerElement => {

					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
							'is_kh_document': true
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement

						})
					}

				});
			}
			else {
				if (element && element.token) {
					var purl = this._assetRegisterService.getThumbnailPreview('asset-document', element.token)
					var lDetails = {
						created_at: element.created_at,
						created_by: element.created_by,
						updated_at: element.updated_at,
						updated_by: element.updated_by,
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						asset_id: element.asset_id,
						'is_kh_document': false,
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl);

			}

		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

		// if (AssetRegisterStore.individualAssetDetails.asset_documents && AssetRegisterStore.individualAssetDetails.asset_documents?.length > 0) {
		// 	for (let i of AssetRegisterStore.individualAssetDetails.asset_documents) {
		// 		let docurl = this._assetRegisterService.getThumbnailPreview('', i.token);
		// 		let docDetails = {
		// 			created_at: i.created_at,
		// 			created_by: i.created_by,
		// 			updated_at: i.updated_at,
		// 			updated_by: i.updated_by,
		// 			name: i.title,
		// 			ext: i.ext,
		// 			size: i.size,
		// 			url: i.url,
		// 			thumbnail_url: i.url,
		// 			token: i.token,
		// 			preview: docurl,
		// 			id: i.id,
		// 			asset_id: i.asset_id

		// 		};
		// 		this._assetRegisterService.setDocumentDetails(docDetails, docurl);
		// 	}

		// }
	}

	// Returns Values as Array for multiple select case
	// getEditValue(field) {
	// 	var returnValue = [];
	// 	for (let i of field) {
	// 		returnValue.push(i);
	// 	}
	// 	return returnValue;

	// }

	getEditMsTypeValue(fields) {
		var returnValues = [];
		for (let i of fields) {
			returnValues.push(i.id);
		}
		return returnValues;
	}

	getEditLocationValue(fields) {
		var returnValues = [];
		for (let i of fields) {
			returnValues.push(i.id);
		}
		return returnValues;
	}

	// scrollbar function
	checkForFileUploadsScrollbar() {

		if (AssetRegisterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

	setType(item, type?) {
	}

	cancelByUser(status) {
		if (status) {

			this._router.navigateByUrl('/asset-management/assets');

		}
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('hide');
		}, 250);
	}

	confirmCancel() {
		setTimeout(() => {
			$(this.cancelPopup.nativeElement).modal('show');
		}, 100);

	}

	scrollEvent = (event: any): void => {

		const number = event.target.documentElement?.scrollTop;
		if (number > 50) {
			this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', '45px');
			this._renderer2.addClass(this.formSteps?.nativeElement, 'small');
			this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
		}
		else {
			this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', 'auto');
			this._renderer2.removeClass(this.formSteps?.nativeElement, 'small');
			this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
		}
	}

	changeStep(step){
		if(step > this.currentTab && this.checkFormObject(step)){
		  let dif = step - this.currentTab;
		  this.nextPrev(dif)
		//   this.changetab(step);
		}
		else if(step < this.currentTab){
		  let dif = this.currentTab - step;
		  this.nextPrev(-dif);
		//   this.changetab(step);
		}  
	  }

	  changetab(step){
		if(step == 1){
		  this.submitForm();
		}
		else if(step == 2){
		  this.depreciationSubmitForm();
		}
		else if(step == 3){
		  this.specificationSubmitForm();
		}
		else if(step == 4){
			this.documentSubmitForm();
		}
	  }

	checkFormObject(tabNumber?:number){
		var setValid = true;
		if(!tabNumber){
		  if(this.formObject.hasOwnProperty(this.currentTab)){
			for(let i of this.formObject[this.currentTab]){
			  if(!this.assetForm.controls[i]?.valid){
				setValid = false;
				break;
			  }
			}
		  }
		}
		else{
		  for(var i = 0; i < tabNumber; i++){
			if(this.formObject.hasOwnProperty(i)){
			  for(let k of this.formObject[i]){
				if(!this.assetForm.controls[k]?.valid){
				  setValid = false;
				  break;
				}
			  }
			}
		  }
		}
		return setValid;
	  }

	nextPrev(n, status:boolean = false) {
		this.is_save = status;
		// This function will figure out which tab to display
		var x: any = document.getElementsByClassName("tab");
		// Exit the function if any field in the current tab is invalid:

		if (document.getElementsByClassName("step")[this.currentTab]) {
			document.getElementsByClassName("step")[this.currentTab].className += " finish";
		}


		// Hide the current tab:
		x[this.currentTab].style.display = "none";
		// Increase or decrease the current tab by 1:
		this.currentTab = this.currentTab + n;
		// }
		if (n != -1) {
			switch (this.currentTab) {

				case 1:
					this.submitForm();
					break;
				case 2:
					if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
					this.depreciationSubmitForm();
					else
					this.specificationSubmitForm();
					break;
				case 3:
					if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
					this.specificationSubmitForm();
					else
					this.documentSubmitForm();
					break;
				case 4:
					if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
					this.documentSubmitForm();
					else
					this.updateForm();
					break;
				case 5:
					if(AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)
					this.updateForm();
					break;
				default:
					break;
			}
		}

		// if you have reached the end of the assetForm...
		if (this.currentTab >= x.length) {
			// ... the assetForm gets submitted:
			this._assetRegisterService.showSubmitMsg();
			setTimeout(() => {
				this._router.navigateByUrl(`asset-management/assets/${AssetRegisterStore.assetId}`);
				this._utilityService.detectChanges(this._cdr);
			}, 100);
			this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;

			x[this.currentTab].style.display = "block";

			return false;
		}
		// Otherwise, display the correct tab:
		this.showTab(this.currentTab, this.is_save);
	}

	setNextReview() {

		var tempDate = new Date();
	}

	getArrayFormatedString(type, items) {
		return this._helperService.getArraySeperatedString(',', type, items);
	}

	submitForm() {
		AppStore.enableLoading();
		this.formErrors = null;

		let save;
		if (this.assetForm.value.id || AssetRegisterStore.assetId) {
			save = this._assetRegisterService.updateItem(this.assetForm.value.id ? this.assetForm.value.id : AssetRegisterStore.assetId, this.setSaveData());
			this._utilityService.detectChanges(this._cdr);
		}
		else {
			save = this._assetRegisterService.saveItem(this.setSaveData());
			this._utilityService.detectChanges(this._cdr);
		}
		// this.setCustodianTitle();

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	updateForm() {
		AppStore.enableLoading();
		this.formErrors = null;

		let save;

		save = this._assetRegisterService.getItem(AssetRegisterStore.assetId);
		this._utilityService.detectChanges(this._cdr);

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	round(number) {
		return Math.round(number);
	}

	depreciationSubmitForm() {
		this.setDepreciationSaveData()
		AppStore.enableLoading();
		this.formErrors = null;

		let save;

		save = this._assetRegisterService.saveDepreciations(AssetRegisterStore.assetId, this.setDepreciationSaveData());
		this._assetRegisterService.getItem(AssetRegisterStore.assetId);
		this._utilityService.detectChanges(this._cdr);
		// this.assetDetails = AssetRegisterStore.individualAssetDetails;

		// this.setCustodianTitle();

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	specificationSubmitForm() {

		AppStore.enableLoading();
		this.formErrors = null;

		let save;

		save = this._assetRegisterService.saveSpecifications(AssetRegisterStore.assetId, this.setSpecificationSaveData());
		save['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
		this._assetRegisterService.getItem(AssetRegisterStore.assetId);
		this._utilityService.detectChanges(this._cdr);
		// this.assetDetails = AssetRegisterStore.individualAssetDetails;
		// this.setCustodianTitle();

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	createImageUrl(type, token) {
		if (type == 'document-version')
			return this._documentFileService.getThumbnailPreview(type, token);
		else
		return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
		// else
		// return this._organizationFileService.getThumbnailPreview(type,token);

	}

	openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}
	closeFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = false;
			document.body.classList.remove('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
			this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
			setTimeout(() => {
				this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
				this._utilityService.detectChanges(this._cdr)
			}, 200);
		}, 100);
	}

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			$(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			$(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

	documentSubmitForm() {
		AppStore.enableLoading();
		this.formErrors = null;

		let save;
		save = this._assetRegisterService.saveDocuments(AssetRegisterStore.assetId, this.setDocumentationSaveData());
		this._assetRegisterService.getItem(AssetRegisterStore.assetId);
		AssetRegisterStore.clearDocumentDetails();
		this._utilityService.detectChanges(this._cdr);

		// this.setCustodianTitle();

		save.subscribe(res => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
		}, (err: HttpErrorResponse) => {
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.currentTab = 0;
				this.nextButtonText = "save_next";
				this.previousButtonText = "previous";

				this.setInitialTab();
				this.showTab(this.currentTab);
				this._utilityService.detectChanges(this._cdr);
			}
		})
	}

	resetForm() {
		this._utilityService.detectChanges(this._cdr);
		this.assetForm.reset();
		this.assetForm.pristine;
		this.fileUploadsArray = [];
		this.formErrors = null;
	}

	saveTabDetails(){
		if(this.currentTab == 0){
		  this.submitForm();
		}
		if(this.currentTab == 1 && AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation){
		  this.depreciationSubmitForm();
		  
		}
		if(this.currentTab == 2 || (this.currentTab == 1 && (!AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation))){
		  this.specificationSubmitForm();
		}   
		if(this.currentTab == 3 || (this.currentTab == 2 && (!AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation))){
			this.documentSubmitForm();
		}
		if(this.currentTab == 4 || (this.currentTab == 3 && (!AssetManagementSettingStore.assetManagementSettings?.is_asset_depreciation)))
		{
			this._assetRegisterService.showSubmitMsg();
		}
		// if(this.currentTab==4){
		  
		// }
	  }

	showTab(n, is_save:boolean=false) {
		// This function will display the specified tab of the assetForm...
		var x: any = document.getElementsByClassName("tab");
		if (x[n]) x[n].style.display = "block";
		//... and fix the Previous/Next buttons:
		if (n == 0) {
			if (document.getElementById("prevBtn"))
				document.getElementById("prevBtn").style.display = "none";
			if (document.getElementById("nextBtn")) this.nextButtonText = "save_next";
		} else {
			if (document.getElementById("prevBtn"))
				document.getElementById("prevBtn").style.display = "inline";
			if (document.getElementById("nextBtn")) this.nextButtonText = "save_next";
		}

		if (n == (x.length - 1)) {
			this.getSelectedValues();
			if (document.getElementById("nextBtn")) {
				this._utilityService.detectChanges(this._cdr);
				this.nextButtonText = "save";
			}
			if(document.getElementById("saveBtn")) {
				document.getElementById("saveBtn").style.display = "none";
			}
		}
		else {
			if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inline";
		}
		//... and run a function that will display the correct step indicator:
		this.fixStepIndicator(n)
	}
	

	setInitialTab() {
		var x: any = document.getElementsByClassName("tab");
		for (var i = 0; i < x.length; i++) {
			if (i == 0) x[i].style.display = "block";
			else x[i].style.display = "none";
		}
	}

	fixStepIndicator(n) {
		// This function removes the "active" class of all steps...
		var i, x = document.getElementsByClassName("step");
		for (i = 0; i < x.length; i++) {
			x[i].className = x[i].className.replace(" active", "");
		}
		//... and adds the "active" class on the current step:
		if (x[n]) x[n].className += " active";
	}

	clear(type) {
		if (type == 'purchased_date') {
			this.assetForm.patchValue({
				purchased_date: null
			})
		}
		// else {
		// 	this.assetForm.patchValue({
		// 		next_review_date: null
		// 	})
		// }

	}

	searchAssetCategory(e, patchValue: boolean = false) {
		if(this.assetForm.value.ms_type_organization_ids && OrganizationGeneralSettingsStore?.organizationSettings?.is_ms_type){
			let params="&ms_type_ids="+this.assetForm.value.ms_type_organization_ids;
			this._assetCategoryService.getItems(false, '&q=' + e.term+params).subscribe((res: AssetCategoryPaginationResponse) => {
				if (res.data.length > 0 && patchValue) {
					for (let i of res.data) {
						if (i.id == e.term) {
							this.assetForm.patchValue({ asset_category_id: i.id });
							break;
						}
					}
				}
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else{
			this._assetCategoryService.getItems(false, '&q=' + e.term).subscribe((res: AssetCategoryPaginationResponse) => {
				if (res.data.length > 0 && patchValue) {
					for (let i of res.data) {
						if (i.id == e.term) {
							this.assetForm.patchValue({ asset_category_id: i.id });
							break;
						}
					}
				}
				this._utilityService.detectChanges(this._cdr);
			});
		}
		
	}

	searchAssetType(e, patchValue: boolean = false) {
		this._assetTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
			if (patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.assetForm.patchValue({ asset_type_id: i.id });
						break;
					}
				}
				AssetTypesMasterStore.lastInsertedAssetTypes = null
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	searchSubAssetCategory(e, patchValue: boolean = false) {
		if (this.assetForm.value.asset_category_id) {
			this._assetSubCategoryService.getItems(false, '&q=' + e.term + '&asset_category_ids=' + this.assetForm.value.asset_category_id).subscribe((res: AssetSubCategoryPaginationResponse) => {
				if (res.data.length > 0 && patchValue) {
					for (let i of res.data) {
						if (i.id == e.term) {
							this.assetForm.patchValue({ asset_sub_category_id: i.id });
							break;
						}
					}
				}
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}

	searchAssetLocation(e, patchValue: boolean = false) {
		this._assetLocationService.getItems(false, '&q=' + e.term).subscribe((res: AssetLocationPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						let asset_location = this.assetForm.value.asset_location_ids ? this.assetForm.value.asset_location_ids : [];
						asset_location.push(i.id);
						this.assetForm.patchValue({ asset_location_ids: asset_location });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	searchSupplier(e, patchValue: boolean = false) {
		this._suppliersService.getItems(false, '&q=' + e.term).subscribe((res: SuppliersPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.assetForm.patchValue({ supplier_id: i.id });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	searchPhysical(e, patchValue: boolean = false) {
		this._physicalConditionRankingsService.getItems(false, '&q=' + e.term).subscribe((res: PhysicalConditionRankingsPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.assetForm.patchValue({ physical_condition_ranking_id: i });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

	getAssetCategory() {
		if (this.assetForm.value.ms_type_organization_ids && OrganizationGeneralSettingsStore?.organizationSettings?.is_ms_type) {
			let params="&ms_type_ids="+this.assetForm.value.ms_type_organization_ids;
		this._assetCategoryService.getItems(false,params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}
	else{
		this._assetCategoryService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}
	}

	getAssetType() {
		this._assetTypesService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	getAssetSubCategory() {
		if (this.assetForm.value.asset_category_id) {
			this._assetSubCategoryService.getItems(false, '&asset_category_ids=' + this.assetForm.value.asset_category_id).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		}

	}

	getInvestmentType() {
		this._assetInvestmentTypesService.getItems(false).subscribe(res => {
			this.assetForm.patchValue({
				asset_investment_type_id: res['data'][0].id
			})
			this._utilityService.detectChanges(this._cdr);
		})
	}

	getAssetLocation(fetch: boolean = false) {
		this._assetLocationService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})

	}

	getSupplier() {
		this._suppliersService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	getPhysical() {
		this._physicalConditionRankingsService.getItems(false).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}


	// viewAuditDocument(type, AssetRegisterStore.individualAssetDetails, AssetRegisterStore.individualAssetDetailsDocument) {


	// 	switch (type) {
	// 		case "viewDocument":
	// 			this._assetRegisterService
	// 				.getFilePreview("asset-item", AssetRegisterStore.assetId, AssetRegisterStore.individualAssetDetailsDocument.id)
	// 				.subscribe((res) => {
	// 					var resp: any = this._utilityService.getDownLoadLink(
	// 						res,
	// 						AssetRegisterStore.individualAssetDetails.name
	// 					);
	// 					this.openPreviewModal(type, resp, AssetRegisterStore.individualAssetDetailsDocument, AssetRegisterStore.individualAssetDetails);
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

	// openPreviewModal(type, filePreview, AssetRegisterStore.individualAssetDetailsDocument, AssetRegisterStore.individualAssetDetails) {
	// 	switch (type) {
	// 		case "viewDocument":
	// 			this.previewObject.component = "asset-item";
	// 			break;
	// 		default:
	// 			break;
	// 	}

	// 	let previewItem = null;
	// 	if (filePreview) {
	// 		previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
	// 		this.previewObject.preview_url = previewItem;
	// 		this.previewObject.file_details = AssetRegisterStore.individualAssetDetailsDocument;
	// 		if (type == "viewDocument") {
	// 			this.previewObject.componentId = AssetRegisterStore.individualAssetDetails.id;
	// 		} else {
	// 			this.previewObject.componentId = AssetRegisterStore.individualAssetDetails.id;
	// 		}

	// 		this.previewObject.uploaded_user =
	// 			AssetRegisterStore.individualAssetDetails.updated_by.length > 0 ? AssetRegisterStore.individualAssetDetails.updated_by : AssetRegisterStore.individualAssetDetails.created_by;
	// 		this.previewObject.created_at = AssetRegisterStore.individualAssetDetails.created_at;
	// 		$(this.filePreviewModal.nativeElement).modal("show");
	// 		this._utilityService.detectChanges(this._cdr);
	// 	}
	// }

	addAssetCategory() {
		this.assetCategoryObject.type = 'Add';
		this.assetCategoryObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.assetCategoryModal.nativeElement, 'show');
		this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	addAssetType() {
		this.assetTypeObject.type = 'Add';
		this.assetTypeObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.assetTypeModal.nativeElement, 'show');
		this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	addSubAssetCategory() {
		this.assetSubCategoryObject.type = 'Add';
		this.assetSubCategoryObject.values = null; // for clearing the value
		this.assetSubCategoryObject.category_id = this.assetForm.value.category_id;
		this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.assetSubCategoryModal.nativeElement, 'show');
		this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	addAssetLocation() {
		this.assetLocationObject.type = 'Add';
		this.assetLocationObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.assetLocationModal.nativeElement, 'show');
		this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	addCustodian() {
		this.custodianObject.type = 'Add';
		this.custodianObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.custodianModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.custodianModal.nativeElement, 'show');
		this._renderer2.setStyle(this.custodianModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	addSupplier() {
		this.supplierObject.type = 'Add';
		this.supplierObject.values = null; // for clearing the value
		this._renderer2.setStyle(this.supplierModal.nativeElement, 'z-index', 999999);
		this._renderer2.addClass(this.supplierModal.nativeElement, 'show');
		this._renderer2.setStyle(this.supplierModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeCustodianModal() {
		if (DesignationMasterStore.lastInsertedId) {
			this.searchCustodian({ term: DesignationMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.custodianObject.type = null;
			this._renderer2.setStyle(this.custodianModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.custodianModal.nativeElement, 'show');
			this._renderer2.setStyle(this.custodianModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	closeAssetLocationModal() {
		if (AssetLocationStore.lastInsertedId) {
			this.searchAssetLocation({ term: AssetLocationStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.assetLocationObject.type = null;
			this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.assetLocationModal.nativeElement, 'show');
			this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	closeSupplierModal() {
		if (SuppliersMasterStore.lastInsertedId) {
			this.searchSupplier({ term: SuppliersMasterStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.supplierObject.type = null;
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.supplierModal.nativeElement, 'show');
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	closeAssetSubCategoryModal() {
		if (AssetSubCategoryStore.lastInsertedId) {
			this.searchSubAssetCategory({ term: AssetSubCategoryStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.assetSubCategoryObject.type = null;
			this.assetSubCategoryObject.category_id = null;
			this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.assetSubCategoryModal.nativeElement, 'show');
			this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	closeAssetCategoryModal() {
		if (AssetCategoryStore.lastInsertedId) {
			this.searchAssetCategory({ term: AssetCategoryStore.lastInsertedId }, true);
		}
		setTimeout(() => {
			this.assetCategoryObject.type = null;
			this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.assetCategoryModal.nativeElement, 'show');
			this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);
	}

	closeAssetTypeModal() {
		if (AssetTypesMasterStore.lastInsertedAssetTypes) {
			this.searchAssetType({ term: AssetTypesMasterStore.lastInsertedAssetTypes }, true);
		}
		setTimeout(() => {
			this.assetTypeObject.type = null;
			this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'z-index', 99999);
			this._renderer2.removeClass(this.assetTypeModal.nativeElement, 'show');
			this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'display', 'none');
			$('.modal-backdrop').remove();

			this._utilityService.detectChanges(this._cdr);
		}, 100);


	}



	changeZIndex() {
		if ($(this.assetCategoryModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.assetCategoryModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.assetTypeModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.assetTypeModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.assetSubCategoryModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.assetSubCategoryModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.assetLocationModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.assetLocationModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.supplierModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.supplierModal.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.custodianModal.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.custodianModal.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.custodianModal.nativeElement, 'overflow', 'auto');
		}
	}

	getYearDifference() {
		let dt = new Date();
		return this._helperService.yearDifferenceFromDate(this.assetForm.value.purchased_date, dt)
	}

	
	getUsers() {
		if(this.assetForm.value.custodian_id){
			var params = '?page=1&designation_ids=' + this.assetForm.value.custodian_id;
			this._usersService.getAllItems(params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
	
		}
		
	}

	searchUers(e) {
		if(this.assetForm.value.custodian_id){
		
		let params = '';
		 params = '?designation_ids=' + this.assetForm.value.custodian_id;
		if (params) params = params + '&q=' + e.term;
		else params = '?q=' + e.term;
		this._usersService.searchUsers(params ? params : '').subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
	}

	}


	
	  getStringsFormatted(stringArray, characterLength, seperator) {
		return this._helperService.getFormattedName(stringArray, characterLength, seperator);
	  }

	  customSearchFn(term: string, item: any) {
		term = term.toLowerCase();
		// Creating and array of space saperated term and removinf the empty values using filter
		let splitTerm = term.split(' ').filter(t => t);
		let isWordThere = [];
		// Pushing True/False if match is found
		splitTerm.forEach(arr_term => {
		  item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
		  let search = item['searchLabel'].toLowerCase();
		  isWordThere.push(search.indexOf(arr_term) != -1);
		});
	
		const all_words = (this_word) => this_word;
		// Every method will return true if all values are true in isWordThere.
		return isWordThere.every(all_words);
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
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		NoDataItemStore.unsetNoDataItems();
		window.removeEventListener('scroll', this.scrollEvent);
		$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		this.cancelEventSubscription.unsubscribe();
		this.asserCategorySubscription.unsubscribe();
		this.asserTypeSubscription.unsubscribe();
		this.asserSubCategorySubscription.unsubscribe();
		this.asserLocationSubscription.unsubscribe();
		this.supplierSubscription.unsubscribe();
		this.custodianSubscription.unsubscribe();
		this.organisationChangesModalSubscription.unsubscribe();
		AssetRegisterStore.msTypes = [];
		this.resetForm();
		this.msg = null;
		// AssetRegisterStore.unsetDocumentDetails();
		// AssetRegisterStore.unsetIndiviudalAssetDetails();
		AssetRegisterStore.editFlag = false;
	}

}
