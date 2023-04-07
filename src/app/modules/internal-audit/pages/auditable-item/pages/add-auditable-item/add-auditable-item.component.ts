import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { IReactionDisposer, autorun } from "mobx";
import { AppStore } from "src/app/stores/app.store";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ControlCategoryService } from 'src/app/core/services/masters/bpm/control-category/control-category.service';
import { AuditableItemCategoryService } from 'src/app/core/services/masters/internal-audit/auditable-item-category/auditable-item-category.service';
import { AuditableItemTypeService } from 'src/app/core/services/masters/internal-audit/auditable-item-type/auditable-item-type.service';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditCheckListService } from 'src/app/core/services/masters/internal-audit/audit-check-list/audit-check-list.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { AuditableItemService } from 'src/app/core/services/internal-audit/auditable-item/auditable-item.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';
import { AuditItemTypeMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-type';
import { AuditItemCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-item-category-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { ControlCategoryMasterStore } from 'src/app/stores/masters/bpm/control-category.master.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ControlStore } from 'src/app/stores/bpm/controls/controls.store';
import { ControlsService } from 'src/app/core/services/bpm/controls/controls.service';
import { InternalAuditFileService } from 'src/app/core/services/masters/internal-audit/file-service/internal-audit-file.service';
import { RiskRating } from 'src/app/core/models/masters/external-audit/risk-rating';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { Subscription } from 'rxjs';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';

declare var $: any;
@Component({
	selector: 'app-add-auditable-item',
	templateUrl: './add-auditable-item.component.html',
	styleUrls: ['./add-auditable-item.component.scss']
})
export class AddAuditableItemComponent implements OnInit, OnDestroy {
	@ViewChild("formSteps") formSteps: ElementRef;
	@ViewChild("navigationBar") navigationBar: ElementRef;
	@ViewChild('cancelPopup') cancelPopup: ElementRef;
	@ViewChild('plainDev') plainDev: ElementRef;
	@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('controlPopup') controlPopup: ElementRef;
	@ViewChild('checklistPopup') checklistPopup: ElementRef;
	@ViewChild('auditableItemCategoryAddPopup') auditableItemCategoryAddPopup: ElementRef;
	@ViewChild('newControl') newControl: ElementRef;
	@ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
	@ViewChild('checklistNewPopup', { static: true }) checklistNewPopup: ElementRef;

	formObject = {
		0: [
			'title',
			'auditable_item_category_id',
			'auditable_item_type_id',
			'sub_section_ids',
			'section_ids',
			'organization_ids',
			'division_ids',
			'department_ids'
		],
		1: [
			'control_ids'
		],
		2: [
			'checklist_ids'
		]
	}


	form: FormGroup;
	formErrors: any;
	currentTab = 0;
	nextButtonText = "Next";
	previousButtonText = "Previous";
	openModelPopup: boolean = false;

	checkListArray = [];

	confirmationObject = {
		title: 'Cancel?',
		subtitle: 'This action cannot be undone',
		type: 'Cancel'
	};

	checklistObject = {
		component: 'Master',
		values: null,
		type: null
	};

	newChecklistObject = {
		component: 'Master',
		values: null,
		type: null
	};

	controlObject = {
		type: null
	}

	Risk_Title;
	AppStore = AppStore;
	SubMenuItemStore = SubMenuItemStore;
	reactionDisposer: IReactionDisposer;
	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	fileUploadPopupStore = fileUploadPopupStore;

	selectedIndex = null;

	AuditableItemMasterStore = AuditableItemMasterStore;
	DivisionMasterStore = DivisionMasterStore;
	SubsidiaryStore = SubsidiaryStore;
	SectionMasterStore = SectionMasterStore;
	SubSectionMasterStore = SubSectionMasterStore;
	AuditCheckListMasterStore = AuditCheckListMasterStore;
	AuditItemTypeMasterStore = AuditItemTypeMasterStore;
	AuditItemCategoryMasterStore = AuditItemCategoryMasterStore;
	RiskRatingMasterStore = RiskRatingMasterStore;
	DepartmentMasterStore = DepartmentMasterStore;
	ControlCategoryMasterStore = ControlCategoryMasterStore;
	ControlStore = ControlStore;
	MsTypeStore = MsTypeStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	fileUploadsArray = []; // for multiple file uploads

	cancelEventSubscription: any;
	addcontrolsEvent: any;
	addCheckListEvent: any;
	checklistChildEvent: any;
	auditItemcontrolCategSubscriptionEvent: any = null;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	addNewControlEvent: any;
	newChecklistAddEvent:Subscription
	addNewControlPopUpFocusEvent: any;
	organisationChangesModalSubscription: any = null;
	fileUploadPreviewSubscription: any = null;
	fileUploadPopupSubscriptionEvent: any = null;
	newcontrolObject = {
		values: null,
		page: 'add-risk',
		type: null
	}
	AuthStore = AuthStore;

	controlsEmptyList = "Could not find any controls(s) attached to the auditable item.";
	checklistEmptyList = "Could not find any checklist(s) attached to the auditable item.";
	constructor(

		private _imageService: ImageServiceService,
		private _eventEmitterService: EventEmitterService,
		private _router: Router,
		private _renderer2: Renderer2,
		private _cdr: ChangeDetectorRef,
		private _internalAuditFileService: InternalAuditFileService,
		private _utilityService: UtilityService,
		public _controlCategService: ControlCategoryService,
		private _auditableItemCategoryService: AuditableItemCategoryService,
		private _auditableItemTypesService: AuditableItemTypeService,
		private _riskRatingService: RiskRatingService,
		private _auditCheckListService: AuditCheckListService,
		private _subSectionService: SubSectionService,
		private _sectionService: SectionService,
		private _subsiadiaryService: SubsidiaryService,
		private _divisionService: DivisionService,
		private _departmentService: DepartmentService,
		private _auditableItemService: AuditableItemService,
		private _helperService: HelperServiceService,
		private _msTypeService: MstypesService,
		private _controlService: ControlsService,
		private _formBuilder: FormBuilder,
		private _documentFileService: DocumentFileService,
		private _fileUploadPopupService: FileUploadPopupService,
	) { }

	ngOnInit(): void {
		AppStore.showDiscussion = false;
		AppStore.disableLoading();
		OrganizationalSettingsStore.showBranch = false;
		setTimeout(() => {
			this.enableScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, 50);

		this.reactionDisposer = autorun(() => {
			if (SubMenuItemStore.clikedSubMenuItem) {
				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			setTimeout(() => {
				this.form.pristine;
			}, 250);
		});
		// setting submenu items
		SubMenuItemStore.setSubMenuItems([
			{ type: 'close', path: '../' }

		]);


		setTimeout(() => {

			this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');

		}, 1000);

		SubMenuItemStore.setNoUserTab(true);
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
		SubMenuItemStore.setSubMenuItems([{ type: "close", path: AppStore.previousUrl }]);
		// scroll event
		window.addEventListener("scroll", this.scrollEvent, true);

		// event calling for cancel pop up using delete popup
		this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.cancelByUser(item);
		})

		// add control event subscription

		this.addcontrolsEvent = this._eventEmitterService.auditableItemcontrolAddModalControl.subscribe(element => {

			this.closeModal();

		})

		// for closing the modal
		this.auditItemcontrolCategSubscriptionEvent = this._eventEmitterService.auditItemControl.subscribe(res => {
			this.closeAuditItemCategoryFormModal();
		})

		// add checklist event

		this.addCheckListEvent = this._eventEmitterService.addCheckListModal.subscribe(res => {
			this.closeChecklistModal();
		})

		this.addNewControlEvent = this._eventEmitterService.addNewControlEvent.subscribe(res => {
			this.closeControlNewPopUp();
		})

		this.addNewControlPopUpFocusEvent = this._eventEmitterService.addNewControlFocusEvent.subscribe(res => {
			this.addNewControlFocus();
		})

		this.checklistChildEvent = this._eventEmitterService.newChecklistAddModal.subscribe(res => {
			this.setStyle();
		})
		this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			if (!status) {
				this.changeZIndex();
			}
		})

		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			if (!status) {
				this.changeZIndex();
			}
		})

		this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
			(res) => {
				this.closeOrganizationModal();
			}
		);

		this.fileUploadPreviewSubscription = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {

			this._renderer2.setStyle(this.newControl.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.newControl.nativeElement, 'overflow', 'auto');

		})

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

		this.newChecklistAddEvent = this._eventEmitterService.newChecklistAddModal.subscribe(res => {
			this.closeNewCheckList();
		  })

		// form elements

		this.form = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required]],
			auditable_item_category_id: [null, [Validators.required]],
			auditable_item_type_id: [null, [Validators.required]],
			risk_rating_id: [null, ''],
			checklist_ids: [],
			sub_section_ids: [],
			section_ids: [],
			organization_ids: ['', [Validators.required]],
			division_ids: [],
			description: [''],
			department_ids: ['', [Validators.required]],
			control_ids: [],
			ms_type_organization_ids: [],
			documents: ['']
		});

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.form.controls['division_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.form.controls['section_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.form.controls['sub_section_ids'].setValidators(Validators.required);

		// In case of edit
		if (this._router.url.indexOf('edit-auditable-item') != -1) {
			AuditableItemMasterStore.clearDocumentDetails();
			if (AuditableItemMasterStore.auditableItemDetails)
				this.setAuditableItemDataForEdit();
			else
				this._router.navigateByUrl('/internal-audit/auditable-items');
		} else {
			this.setInitialOrganizationLevels();
		}



		// loading data initially

		this.getAuditableItemCategory();
		this.getAuditableItemType();
		this.getCheckList();
		this.getOrganization();
		this.getRiskRating();
		this.getControls();
		this.getMsType();

		// for showing initial tab

		setTimeout(() => {
			this.showTab(this.currentTab);
		}, 100);
	}

	// calling required datas for form

	organisationChanges() {
		this.openModelPopup = true;
		this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	closeOrganizationModal(data?) {
		if (data) {
			this.form.patchValue({
				division_ids: data.division_ids ? data.division_ids : [],
				department_ids: data.department_ids ? data.department_ids : [],
				section_ids: data.section_ids ? data.section_ids : [],
				sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
				organization_ids: data.organization_ids ? data.organization_ids : []
			})
		}
		this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
		this.openModelPopup = false;
		this._utilityService.detectChanges(this._cdr);
	}

	// getting organization
	getOrganization() {
		this._subsiadiaryService.getAllItems(false).subscribe((res: any) => {
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.form.patchValue({ organization_ids: [res.data[0]] });
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}


	setInitialOrganizationLevels() {
		this.form.patchValue({
			division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
			department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
			section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
			sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : []
		});
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this.form.patchValue({ organization_ids: [AuthStore.user?.organization] });
		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
		this.searchDepartment({ term: this.form.value.department_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
		this._utilityService.detectChanges(this._cdr);
	}


	// searching for controls
	searchControls(e) {
		this._controlCategService.getItems(false, '&q=' + e.term).subscribe((res) => {
			this._utilityService.detectChanges(this._cdr);
		});

	}
	// serach for ms type
	searchMsType(e) {
		this._msTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	// for getting ms type
	getMsType() {
		this._msTypeService.getItems(true).subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})

	}
	// for getting controls
	getControls() {
		this._controlCategService.getItems().subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})

	}



	// for getting audit checklist
	getCheckList() {
		this._auditCheckListService.getItems().subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})

	}
	// for searching audit check list
	searchCheckList(e) {
		this._auditCheckListService.getItems(false, '&q=' + e.term).subscribe((res) => {
			this._utilityService.detectChanges(this._cdr);
		});

	}


	// for getting audit risk rating
	getRiskRating() {

		this._riskRatingService.getAllItems().subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})

	}



	// for searching auditable item type
	searchAuditableItemType(e) {

		this._auditableItemTypesService.getAllItems(false, '&q=' + e.term).subscribe((res) => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	// for getting auditable item type
	getAuditableItemType() {
		this._auditableItemTypesService.getAllItems().subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})


	}
	// for searching auditable item category
	searchAuditableItemCategory(e, patchValue: boolean = false) {
		this._auditableItemCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
			if (patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
						this.form.patchValue({ auditable_item_category_id: i });
						break;
					}
				}
				AuditItemCategoryMasterStore.lastInsertedId = null;
			}
			this._utilityService.detectChanges(this._cdr);
		});

	}

	// for getting auditable item category
	getAuditableItemCategory() {
		this._auditableItemCategoryService.getItems().subscribe(res => {

			this._utilityService.detectChanges(this._cdr);
		})

	}

	handleDropDownClear(type) {
		switch (type) {
			case 'organization_id': this.form.controls['division_ids'].reset();
				this.form.controls['department_ids'].reset();
				this.form.controls['section_ids'].reset();
				this.form.controls['sub_section_ids'].reset();

				break;
			case 'division_id': this.form.controls['department_ids'].reset();
				this.form.controls['section_ids'].reset();
				this.form.controls['sub_section_ids'].reset();

				break;
			case 'department_id': this.form.controls['section_ids'].reset();
				this.form.controls['sub_section_ids'].reset();

				break;
			case 'section_id': this.form.controls['sub_section_ids'].reset();

				break;
			default: '';
				break;
		}
	}

	handleDropDownItemClear(event, type) {
		switch (type) {
			case 'organization_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
				this.checkDivision(event.value.id, type);
				this.checkDepartment(event.value.id, type);
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
					this.checkSection(event.value.id, type);
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
					this.checkSubSection(event.value.id, type);

				break;
			case 'division_id': this.checkDepartment(event.value.id, type);

				break;
			case 'department_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
				this.checkSection(event.value.id, type);

				break;
			case 'section_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
				this.checkSubSection(event.value.id, type);

				break;

			default: '';
				break;
		}
	}

	checkDivision(organizationId: number, type: string) {
		let divisionValue: [] = this.form.value.division_ids;
		for (var i = 0; i < divisionValue?.length; i++) {
			let divOrganizationId = divisionValue[i][type];
			if (organizationId == divOrganizationId) {
				divisionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['division_ids'].setValue(divisionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkDepartment(divisionId: number, type: string) {
		let departmentValue: [] = this.form.value.department_ids;
		for (var i = 0; i < departmentValue?.length; i++) {
			let deptDivisionId = departmentValue[i][type];
			if (divisionId == deptDivisionId) {
				if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
				departmentValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['department_ids'].setValue(departmentValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkSection(departmentId: number, type: string) {
		let sectionValue: [] = this.form.value.section_ids;
		for (var i = 0; i < sectionValue?.length; i++) {
			let sectionDepartmentId = sectionValue[i][type];
			if (departmentId == sectionDepartmentId) {
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
				sectionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['section_ids'].setValue(sectionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkSubSection(sectionId: number, type: string) {
		let subSectionValue: [] = this.form.value.sub_section_ids;
		for (var i = 0; i < subSectionValue?.length; i++) {
			let subSectionSectionId = subSectionValue[i][type];
			if (sectionId == subSectionSectionId) {
				subSectionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['sub_section_ids'].setValue(subSectionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	subsidiariesChange() {
		if (this.form.value.organization_ids.length == 0) {
			this.form.controls['division_ids'].reset();
			this.form.controls['department_ids'].reset();
			this.form.controls['section_ids'].reset();
			this.form.controls['sub_section_ids'].reset();
		}
	}


	// geting department
	getDepartment() {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}


			this._departmentService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			DepartmentMasterStore.setAllDepartment([]);
		}
	}
	// for searching the department

	searchDepartment(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}


			this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}

	// for getting  division

	getDivision() {
		let params = '';
		if (this.form.value.organization_ids) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.value.organization_ids);

			this._divisionService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			DivisionMasterStore.setAllDivision([]);
		}

	}


	// getting section
	getSection() {

		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}


			this._sectionService.getItems(false, params).subscribe(res => {

				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			SectionMasterStore.setAllSection([]);
		}
	}

	// getting sub section
	getSubSection() {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			if (this.form.get('section_ids').value) {
				if (params)
					params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
				else
					params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
			}


			this._subSectionService.getItems(false, params).subscribe(res => {

				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			SubSectionMasterStore.setAllSubSection([]);
		}

	}


	// search sub section

	searchSubSection(e) {

		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			if (this.form.get('section_ids').value) {
				if (params)
					params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
				else
					params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
			}

			this._subSectionService.getItems(false, '&q=' + e.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}



	// for searching the Section

	searchSection(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			this._sectionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}

	// seraching division

	searchDivision(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);

			this._divisionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}


	// for searching organization

	searchOrganization(event) {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}

	}




	// scrollbar function
	checkForFileUploadsScrollbar() {

		if (AuditableItemMasterStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}


	// addCheckList() {
	//   //  checking array for already added question if not this function will push data else not
	//   if (!this.checkListArray.some((item) => item.id == this.form.value.checklist_ids.id)) {
	//     this.checkListArray.push(this.form.value.checklist_ids);
	//     this.form.value.checklist_ids = [];
	//   } else {
	//     this._utilityService.showErrorMessage('Error!', 'Checklist Already Added');
	//   }
	// }

	closeModal() {
		this.controlObject.type = null;
		this._renderer2.removeClass(this.controlPopup.nativeElement, 'show')
		document.body.classList.remove('modal-open')
		this._renderer2.setStyle(this.controlPopup.nativeElement, 'display', 'none');
		// this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
		this._renderer2.setAttribute(this.controlPopup.nativeElement, 'aria-hidden', 'true');
		$('.modal-backdrop').remove();

		setTimeout(() => {
			this._renderer2.removeClass(this.controlPopup.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 200);

	}

	closeChecklistModal() {
		this.checklistObject.type = null;
		this._renderer2.removeClass(this.checklistPopup.nativeElement, 'show')
		document.body.classList.remove('modal-open')
		this._renderer2.setStyle(this.checklistPopup.nativeElement, 'display', 'none');
		// this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
		this._renderer2.setAttribute(this.checklistPopup.nativeElement, 'aria-hidden', 'true');
		$('.modal-backdrop').remove();

		setTimeout(() => {
			this._renderer2.removeClass(this.checklistPopup.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 200);
	}

	addControls() {
		this.controlObject.type = 'Add';
		$('.modal-backdrop').add();
		document.body.classList.add('modal-open')
		this._renderer2.setStyle(this.controlPopup.nativeElement, 'display', 'block');
		// this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
		this._renderer2.removeAttribute(this.controlPopup.nativeElement, 'aria-hidden');

		setTimeout(() => {
			this._renderer2.addClass(this.controlPopup.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 100);
	}

	addCheckList() {
		this.checklistObject.type = 'auditableItem';
		$('.modal-backdrop').add();
		document.body.classList.add('modal-open')
		this._renderer2.setStyle(this.checklistPopup.nativeElement, 'display', 'block');
		// this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
		this._renderer2.removeAttribute(this.checklistPopup.nativeElement, 'aria-hidden');

		setTimeout(() => {
			this._renderer2.addClass(this.checklistPopup.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 100);

	}

	addNewCheckList() {
		this.newChecklistObject.type = 'add';
		setTimeout(() => {
		  $(this.checklistNewPopup.nativeElement).modal('show');
		  this._renderer2.setStyle(this.checklistNewPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
		}, 500);
	  }
	
	closeNewCheckList() {
		this.newChecklistObject.type = null;
		$(this.checklistNewPopup.nativeElement).modal('hide');
		if(AuditCheckListMasterStore.lastInsertedId){
			this._auditCheckListService.getItems(false, '&q=' + AuditCheckListMasterStore.lastInsertedId).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
				if (res.data.length > 0) {
					for (let i of res.data) {
						if (i.id == AuditCheckListMasterStore.lastInsertedId) {
							AuditableItemMasterStore?.checklistToDisplay.push(i);
							break;
						}
					}
					AuditCheckListMasterStore.setLastInsertedId(null);
				}
			  });
		}
		this._utilityService.detectChanges(this._cdr);		
	}

	addAuditableItemCategory() {
		setTimeout(() => {
			$(this.auditableItemCategoryAddPopup.nativeElement).modal('show');
			this._renderer2.setStyle(this.auditableItemCategoryAddPopup.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
		}, 500);
	}

	closeAuditItemCategoryFormModal() {
		$(this.auditableItemCategoryAddPopup.nativeElement).modal('hide');

		if (AuditItemCategoryMasterStore.lastInsertedId) {
			// this.form.patchValue({ auditable_item_category_id: AuditItemCategoryMasterStore.lastInsertedId });
			this.searchAuditableItemCategory({ term: AuditItemCategoryMasterStore.lastInsertedId }, true);
			// AuditItemCategoryMasterStore.lastInsertedId = null;
		}
	}

	addNewControl() {
		this.clearCommonFilePopupDocuments();
		this.newcontrolObject.type = 'New';
		$('.modal-backdrop').add();
		document.body.classList.add('modal-open')
		this._renderer2.setStyle(this.newControl.nativeElement, 'display', 'block');
		// this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
		this._renderer2.removeAttribute(this.newControl.nativeElement, 'aria-hidden');

		setTimeout(() => {
			this._renderer2.addClass(this.newControl.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		}, 100);

	}

	addNewControlFocus() {
		this._renderer2.setStyle(this.newControl.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.newControl.nativeElement, 'overflow', 'auto');
	}


	closeControlNewPopUp() {
		setTimeout(() => {
			this.controlObject.type = null;
			$(this.newControl.nativeElement).modal('hide');
			this._renderer2.setStyle(this.newControl.nativeElement, 'display', 'none');
			if (ControlStore.lastInsertedId) {
				this._controlService.getAllItems(false, '&q=' + ControlStore.lastInsertedId).subscribe(res => {
					if (res.data.length > 0) {
						for (let i of res.data) {
							if (i.id == ControlStore.lastInsertedId) {
								AuditableItemMasterStore?.controlsToDisplay.push(i);
								break;
							}
						}
						ControlStore.setLastInsertedId(null);
					}
				})
			}
			this._utilityService.detectChanges(this._cdr);
		}, 100);
		// this.newcontrolObject.type = null;
		// $('.modal-backdrop').add();
		// document.body.classList.add('modal-open')
		// this._renderer2.setStyle(this.newControl.nativeElement, 'display', 'none');
		// this._renderer2.removeAttribute(this.newControl.nativeElement, 'aria-hidden');

		// setTimeout(() => {
		//   this._renderer2.addClass(this.newControl.nativeElement, 'show')
		//   this._utilityService.detectChanges(this._cdr)
		// }, 100);
	}

	setStyle() {
		this._renderer2.setStyle(this.checklistPopup.nativeElement, 'z-index', 999999);
		this._renderer2.setStyle(this.checklistPopup.nativeElement, 'overflow', 'auto');
	}

	changeZIndex() {
		if ($(this.checklistPopup.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.checklistPopup.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.checklistPopup.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.controlPopup.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.controlPopup.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.controlPopup.nativeElement, 'overflow', 'auto');
		}
		else if ($(this.newControl.nativeElement).hasClass('show')) {
			this._renderer2.setStyle(this.newControl.nativeElement, 'z-index', 999999);
			this._renderer2.setStyle(this.newControl.nativeElement, 'overflow', 'auto');
		}
	}


	// scroll event
	scrollEvent = (event: any): void => {
		if (event.target.documentElement) {
			const number = event.target.documentElement.scrollTop;
			if (number > 50) {
				this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
				this._renderer2.addClass(this.formSteps.nativeElement, 'small');
				this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
			}
			else {
				this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
				this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
				this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
			}
		}
	};

	checkAcceptFileTypes(type) {
		return this._imageService.getAcceptFileTypes(type);
	}

	// file change function

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

	// imageblob function
	createImageFromBlob(image: Blob, imageDetails, type) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			var logo_url = reader.result;

			imageDetails['preview'] = logo_url;
			if (imageDetails != null)
				this._auditableItemService.setDocumentDetails(imageDetails, type);
			this.checkForFileUploadsScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, false);

		if (image) {
			reader.readAsDataURL(image);
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



	// extension check function
	checkExtension(ext, extType) {

		return this._imageService.checkFileExtensions(ext, extType)

	}

	// checkAcceptFileTypes(type){
	//   return this._imageService.getAcceptFileTypes(type); 
	// }


	/**
	 * removing document file from the selected list
	 * @param token -image token
	 */
	removeDocument(token) {
		AuditableItemMasterStore.unsetDocumentDetails(token);
		this.checkForFileUploadsScrollbar();
		this._utilityService.detectChanges(this._cdr);
	}

	//edit function

	setAuditableItemDataForEdit() {
		this.checkListArray = [];

		var auditableItem = AuditableItemMasterStore.auditableItemDetails;
		this.clearCommonFilePopupDocuments();
		if (auditableItem.documents.length > 0) {
			this.setDocuments(auditableItem.documents);
		}
		// for (let i of auditableItem.documents) {
		//   let docurl = this._internalAuditFileService.getThumbnailPreview('auditable-item', i.token);
		//   let docDetails = {
		//     created_at: i.created_at,
		//     created_by: i.created_by,
		//     updated_at: i.updated_at,
		//     updated_by: i.updated_by,
		//     name: i.title,
		//     ext: i.ext,
		//     size: i.size,
		//     url: i.url,
		//     thumbnail_url: i.url,
		//     token: i.token,
		//     preview: docurl,
		//     id: i.id

		//   };
		//   this._auditableItemService.setDocumentDetails(docDetails, docurl);
		//   setTimeout(() => {
		//     this.checkForFileUploadsScrollbar();
		//   }, 200);

		// }

		// Setting the format similar to while adding chekclist from popup to show

		let checklist = [];

		for (let i of auditableItem.checklists) {

			var objs = {
				id: i.id, title: i.title
			}
			checklist.push(objs)
		}

		this.checklistEdiValue(checklist)


		// Setting the format similar to while adding control from popup to show Category Properly in Accordion.
		let controls = []

		for (let element of auditableItem.controls) {

			var obj = {
				id: element.id, reference_code: element.reference_code, title: element?.title, control_category_title: element.control_category?.title,
				control_type_title: element?.control_type?.title
			}
			controls.push(obj)
		}

		this.controlsEditValue(controls);

		// patch form values for edit

		this.form.patchValue({

			id: auditableItem.id ? auditableItem.id : '',
			title: auditableItem.title ? auditableItem.title : '',
			description: auditableItem.description ? auditableItem.description : '',
			auditable_item_category_id: auditableItem.auditable_item_category ? auditableItem.auditable_item_category : null,
			auditable_item_type_id: auditableItem.auditable_item_type ? auditableItem.auditable_item_type : '',
			risk_rating_id: auditableItem.risk_rating ? auditableItem.risk_rating.id : null,
			sub_section_ids: auditableItem.sub_sections ? this.getEditValue(auditableItem.sub_sections) : [],
			section_ids: auditableItem.sections ? this.getEditValue(auditableItem.sections) : [],
			organization_ids: auditableItem.organizations ? this.getEditValue(auditableItem.organizations) : [],
			division_ids: auditableItem.divisions ? this.getEditValue(auditableItem.divisions) : [],
			department_ids: auditableItem.departments ? this.getEditValue(auditableItem.departments) : [],
			ms_type_organization_ids: auditableItem.ms_type_organizations ? this.getEditMsTypeValue(auditableItem.ms_type_organizations) : [],
			documents: []


		})

		this._utilityService.detectChanges(this._cdr);

	}

	// Set Control
	controlsEditValue(auditable_item_controls) {
		this._auditableItemService.selectRequiredControls(auditable_item_controls);
	}

	// set checklist
	checklistEdiValue(auditable_item_checklist) {
		this._auditableItemService.selectRequiredCheckList(auditable_item_checklist);
	}



	// Returns Values as Array for multiple select case
	getEditValue(field) {
		var returnValue = [];
		for (let i of field) {
			returnValue.push(i);
		}
		return returnValue;

	}

	getEditMsTypeValue(fields) {
		var returnValues = [];
		for (let i of fields) {
			returnValues.push(i.id);
		}
		return returnValues;
	}



	// Check any upload process is going on
	checkFileIsUploading() {
		return this._helperService.checkFileisUploaded(this.fileUploadsArray);
	}


	// Mutli Form

	nextPrev(n) {
		// This function will figure out which tab to display
		var x: any = document.getElementsByClassName("tab");
		// Exit the function if any field in the current tab is invalid:

		// if (n == 1 && !validateForm()) return false;

		if (document.getElementsByClassName("step")[this.currentTab]) {
			document.getElementsByClassName("step")[this.currentTab].className +=
				" finish";
		}

		// Hide the current tab:
		x[this.currentTab].style.display = "none";
		// Increase or decrease the current tab by 1:
		this.currentTab = this.currentTab + n;

		// if you have reached the end of the form...
		if (this.currentTab >= x.length) {
			// ... the form gets submitted:
			this.currentTab =
				this.currentTab > 0 ? this.currentTab - n : this.currentTab;
			x[this.currentTab].style.display = "block";
			this.submitAuditableItemForm();
			return false;
		}
		// Otherwise, display the correct tab:
		this.showTab(this.currentTab);
	}

	showTab(n) {
		// This function will display the specified tab of the form...
		var x: any = document.getElementsByClassName("tab");
		if (x[n]) x[n].style.display = "block";
		//... and fix the Previous/Next buttons:
		if (n == 0) {
			if (document.getElementById("prevBtn"))
				document.getElementById("prevBtn").style.display = "none";
		} else {
			if (document.getElementById("prevBtn"))
				document.getElementById("prevBtn").style.display = "inline";
		}

		if (n == x.length - 1) {

			if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
			// document.getElementById("nextBtn").innerHTML = "Save";
		} else {
			this.getValues();
			if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
			//document.getElementById("nextBtn").innerHTML = "Next";
		}
		//... and run a function that will display the correct step indicator:
		this.fixStepIndicator(n);
	}

	fixStepIndicator(n) {
		// This function removes the "active" class of all steps...
		var i,
			x = document.getElementsByClassName("step");
		for (i = 0; i < x.length; i++) {
			x[i].className = x[i].className.replace(" active", "");
		}
		//... and adds the "active" class on the current step:
		if (x[n]) x[n].className += " active";
	}

	// Setting Intial Tab

	setIntialTab() {
		var x: any = document.getElementsByClassName("tab");

		for (let i = 0; i < x.length; i++) {
			if (i == 0) x[i].style.display = "block";
			else x[i].style.display = "none";
		}
	}

	checkFormObject(tabNumber?: number) {
		var setValid = true;
		if (!tabNumber) {
			if (this.formObject.hasOwnProperty(this.currentTab)) {
				for (let i of this.formObject[this.currentTab]) {
					if (!this.form.controls[i].valid) {
						setValid = false;
						break;
					}
				}
			}
		}
		else {
			for (var i = 0; i < tabNumber; i++) {
				if (this.formObject.hasOwnProperty(i)) {
					for (let k of this.formObject[i]) {
						if (!this.form.controls[k].valid) {
							setValid = false;
							break;
						}
					}
				}
			}
		}
		return setValid;
	}


	changeStep(step) {
		if (step > this.currentTab && this.checkFormObject(step)) {
			let dif = step - this.currentTab;
			this.nextPrev(dif)
		}
		else if (step < this.currentTab) {
			let dif = this.currentTab - step;
			this.nextPrev(-dif);
		}
	}


	getValues() {
		const risk: RiskRating = RiskRatingMasterStore.getRiskRatingById(this.form.value.risk_rating_id);
		RiskRatingMasterStore.setSingleRiskRating(risk);
		return risk;

	}


	// Setting Accordion for Controls

	getControlDetails(id: number, index: number) {
		this.ControlStore.unsetControlDetails();
		if (this.selectedIndex == index)
			this.selectedIndex = null;
		else
			this.selectedIndex = index;
		this._controlService.getItemById(id).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		})
		this._utilityService.detectChanges(this._cdr);

	}


	// processing datas for save
	processDataForSave() {
		let saveData = {
			title: this.form.value.title ? this.form.value.title : '',
			description: this.form.value.description ? this.form.value.description : '',
			// documents: AuditableItemMasterStore.docDetails,
			auditable_item_category_id: this.form.value.auditable_item_category_id ? this.form.value.auditable_item_category_id.id : '',
			risk_rating_id: this.form.value.risk_rating_id ? this.form.value.risk_rating_id : '',
			checklist_ids: [],
			sub_section_ids: [],
			section_ids: [],
			organization_ids: [],
			division_ids: [],
			department_ids: [],
			control_ids: [],
			auditable_item_type_id: this.form.value.auditable_item_type_id ? this.form.value.auditable_item_type_id.id : '',
			ms_type_organization_ids: []
		};

		if (this.form.value.id) {
			console.log('in form id');
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
		} else{
			console.log('in form no id');
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}

		if (this.form.value.organization_ids) {
			this.form.value.organization_ids.forEach(element => {
				saveData.organization_ids.push(element.id);
			});
		}
		if (this.form.value.ms_type_organization_ids) {
			this.form.value.ms_type_organization_ids.forEach(items => {

				saveData.ms_type_organization_ids.push(items);
			});
		}

		if (this.form.value.division_ids) {
			this.form.value.division_ids.forEach(element => {
				saveData.division_ids.push(element.id);
			});
		}

		if (this.form.value.division_ids) {
			this.form.value.division_ids.forEach(element => {
				saveData.division_ids.push(element.id);
			});
		}

		if (this.form.value.department_ids) {
			this.form.value.department_ids.forEach(element => {
				saveData.department_ids.push(element.id);
			});

		}

		if (this.form.value.section_ids) {
			this.form.value.section_ids.forEach(element => {
				saveData.section_ids.push(element.id);
			});
		}

		if (this.form.value.sub_section_ids) {
			this.form.value.sub_section_ids.forEach(element => {
				saveData.sub_section_ids.push(element.id);
			});
		}

		var checkListIdArray = [];

		this.AuditableItemMasterStore.checklistToDisplay.forEach(element => {
			checkListIdArray.push(element.id);
			saveData.checklist_ids = checkListIdArray;
		});

		if (this.form.value.auditable_item_type_id) {
			saveData.auditable_item_type_id = this.form.value.auditable_item_type_id.id;
		}

		if (this.form.value.auditable_item_type_id) {
			saveData.auditable_item_type_id = this.form.value.auditable_item_type_id.id;
		}

		var controlsArray = [];
		this.AuditableItemMasterStore.controlsToDisplay.forEach(element => {
			controlsArray.push(element.id);
			saveData.control_ids = controlsArray;

		});

		return saveData;


	}

	// form submit function
	submitAuditableItemForm() {

		let save;

		AppStore.enableLoading();
		this.nextButtonText = "Loading...";
		this.previousButtonText = "Loading...";

		if (this.form.value.id) {
			save = this._auditableItemService.updateItem(this.form.value.id, this.processDataForSave());
		} else {

			save = this._auditableItemService.saveItem(this.processDataForSave());
		}
		save.subscribe((res: any) => {
			this.resetForm();
			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);
			this._router.navigateByUrl("/internal-audit/auditable-items/" + res.id);
		}, (err: HttpErrorResponse) => {
			if (err.status == 422) {
				this.formErrors = err.error.errors;
				this.processFormErrors();
			}
			this.currentTab = 0;
			this.nextButtonText = "Next";
			this.previousButtonText = "Previous";
			this.setIntialTab();
			this.showTab(this.currentTab);

			AppStore.disableLoading();
			this._utilityService.detectChanges(this._cdr);


		});

	}

	processFormErrors() {
		// console.log(this.formErrors);
		var errors = this.formErrors;

		for (var key in errors) {
			if (errors.hasOwnProperty(key)) {

				if (key.startsWith('organization_ids.')) {
					let keyValueSplit = key.split('.');
					let errorPosition = parseInt(keyValueSplit[1]);
					this.formErrors['organization_ids'] = this.formErrors['organization_ids'] ? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
				}
				if (key.startsWith('division_ids.')) {
					let keyValueSplit = key.split('.');
					let errorPosition = parseInt(keyValueSplit[1]);
					this.formErrors['division_ids'] = this.formErrors['division_ids'] ? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
				}
				if (key.startsWith('department_ids.')) {
					let keyValueSplit = key.split('.');
					let errorPosition = parseInt(keyValueSplit[1]);
					this.formErrors['department_ids'] = this.formErrors['department_ids'] ? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
				}
				if (key.startsWith('section_ids.')) {
					let keyValueSplit = key.split('.');
					let errorPosition = parseInt(keyValueSplit[1]);
					this.formErrors['section_ids'] = this.formErrors['section_ids'] ? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
				}
				if (key.startsWith('sub_section_ids.')) {
					let keyValueSplit = key.split('.');
					let errorPosition = parseInt(keyValueSplit[1]);
					this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids'] ? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1) : errors[key] + (errorPosition + 1);
				}

			}
		}
		this._utilityService.detectChanges(this._cdr);
	}

	// delete controls from list
	deleteControl(controls) {
		var index = AuditableItemMasterStore.controlsToDisplay.indexOf(controls);
		AuditableItemMasterStore.controlsToDisplay.splice(index, 1);
		this._utilityService.showSuccessMessage('Success!', 'control_removed_from_the_auditable_item.');
	}

	// delete checklist from list
	deleteChecklist(checklist) {
		var index = AuditableItemMasterStore.checklistToDisplay.indexOf(checklist);
		AuditableItemMasterStore.checklistToDisplay.splice(index, 1);
	    this._utilityService.showSuccessMessage('Success!', 'checklist_removed_from_the_auditable_item');
	}

	resetForm() {
		this.form.reset();
		this.form.pristine;
		this.fileUploadsArray = [];
		this.formErrors = null;
	}

	cancelByUser(status) {
		if (status) {

			this._router.navigateByUrl('/internal-audit/auditable-items');

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

	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}


	// *Common  File Upload/Attach Modal Functions Starts Here

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}
	setDocuments(documents) {
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {

					if (innerElement.is_latest) {
						console.log('in kh push audit');
						khDocuments.push({
							...innerElement,
							title:element?.kh_document.title,
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
					var purl = this._internalAuditFileService.getThumbnailPreview('auditable-item', element.token)
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

	createImageUrl(type, token) {
		if (type == 'document-version')
			return this._documentFileService.getThumbnailPreview(type, token);
		// else
		// return this._organizationFileService.getThumbnailPreview(type,token);

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

	// *Common  File Upload/Attach Modal Functions Ends Here



	ngOnDestroy() {

		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
		window.addEventListener('scroll', this.scrollEvent, null);
		$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		this.checkListArray = [];
		this.newChecklistAddEvent.unsubscribe()
		this.addcontrolsEvent.unsubscribe();
		this.cancelEventSubscription.unsubscribe();
		this.addCheckListEvent.unsubscribe();
		this.checklistChildEvent.unsubscribe();
		this.auditItemcontrolCategSubscriptionEvent.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this.addNewControlEvent.unsubscribe();
		this.addNewControlPopUpFocusEvent.unsubscribe();
		//document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}


}
