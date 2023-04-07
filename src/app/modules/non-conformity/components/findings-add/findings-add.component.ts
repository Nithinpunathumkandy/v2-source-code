import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
declare var $: any;

@Component({
  selector: 'app-findings-add',
  templateUrl: './findings-add.component.html',
  styleUrls: ['./findings-add.component.scss']
})
export class FindingsAddComponent implements OnInit {
  @Input('source') FindingsSource: any
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('addFindingsCategory') addFindingsCategory: ElementRef;


  FindingsStore = FindingsStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditFindingCategoryMasterStore = AuditFindingCategoryMasterStore
  fileUploadPopupStore = fileUploadPopupStore;
  openModelPopup: boolean = false;
  SuppliersMasterStore = SuppliersMasterStore;

  auditFindingCategorySubscriptionEvent: any = null;
  organisationChangesModalSubscription: any = null;
  fileUploadPopupSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  AuthStore = AuthStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;

  auditFindingCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  constructor(
    private _findingsService: FindingsService,
    private _departmentService: DepartmentService,
    private _auditFindingCategoriesService: AuditFindingCategoriesService,
    private _riskRatingService: RiskRatingService,
    private _sectionService: SectionService,
    private _renderer2: Renderer2,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _supplierService: SuppliersService
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category
    OrganizationalSettingsStore.isMultiple = true;
    OrganizationalSettingsStore.showBranch = false;
    this.form = this._formBuilder.group({
      id: [''],
      risk_rating_id: [null, Validators.required],
      title: ['', Validators.required],
      description: [''],
      evidence: [''],
      recommendation: [''],
      finding_category_id: [null, Validators.required],
      supplier_id: [null],
      organization_ids: [[], Validators.required],
      department_ids: [[]],
      branch_ids: [[]],
      division_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      documents: [[]],

    });
    SuppliersMasterStore.setCurrentPage(1);
    // restingForm on initial load
    // this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.FindingsSource.type == 'Edit') {
      this.setFormValues()
    }
    else {
      this.setInitialOrganizationLevels();
    }

    // if (this.FindingsSource) {
    //   this.setFormValues();

    // }

    // this.controlSupplierSubscriptionEvent = this._eventEmitterService.supplier.subscribe(res => {
    // 	this.closeSupplierFormModal();
    // })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      this.changeZindex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      this.changeZindex();
    })
    // for closing the modal
    this.auditFindingCategorySubscriptionEvent = this._eventEmitterService.auditFindingCategoryControl.subscribe(res => {
      this.closeFindingCategory();
    })

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.getDepartment();
    this.getRiskRating();
    this.getFindingCategory();
    // this.getSuppliersList();
  }

  changeZindex() {
    if (!status && $(this.addFindingsCategory.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'overflow', 'auto');
    }
  }


  ngDoCheck() {
    if (this.FindingsSource && this.FindingsSource.hasOwnProperty('values') && this.FindingsSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setInitialOrganizationLevels() {
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      section_ids: AuthStore?.user?.section ? [AuthStore?.user?.section] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
      organization_ids: AuthStore.user?.organization ? [AuthStore.user?.organization] : [],
      branch_ids:AuthStore.user?.branch ? [AuthStore.user?.branch] : []
    });
    this._utilityService.detectChanges(this._cdr);

  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if (data) {
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids: data.department_ids ? data.department_ids : [],
        section_ids: data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : [],
        branch_ids: data.branch_ids ? data.branch_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues() {
    if (this.FindingsSource.hasOwnProperty('values') && this.FindingsSource.values) {
      let { id, supplier_id, finding_category_id, supplier, documents, finding_category, sections, risk_rating, organizations, departments, sub_sections, divisions, title, description, evidence, recommendation } = this.FindingsSource.values
      this.form.patchValue({
        id: id,
        finding_category_id: finding_category.id,
        supplier_id: supplier?.id,
        risk_rating_id: risk_rating.id,
        title: title,
        description: description,
        evidence: evidence,
        recommendation: recommendation,
        department_ids: departments,
        division_ids: divisions,
        organization_ids: organizations,
        sub_section_ids: sub_sections,
        section_ids: sections,
        // branch_ids:branch_ids
        // documents: documents
      })
      this.searchFindingCategory({ term: finding_category_id });
      this.searchSupplier({ term: supplier?.id });
    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.clearFIleUploadPopupData();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  FindingsCategoryAdd() {
    this.auditFindingCategoryObject.type = "add";
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.addFindingsCategory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFindingCategory() {
    $(this.addFindingsCategory.nativeElement).modal('hide');
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();
    if (AuditFindingCategoryMasterStore.lastInsertedId) {
      // this.form.patchValue({ compliance_section_ids: AuditFindingCategoryMasterStore.lastInsertedId });
      this.searchFindingCategory({ term: AuditFindingCategoryMasterStore.lastInsertedId }, true);
    }
    // AuditFindingCategoryMasterStore.lastInsertedId = null
    this._utilityService.detectChanges(this._cdr);
    // ComplianceAreaMasterStore.lastInsertedId = null;
  }



  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();

  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissFindingsListModal();
  }

  //Department dropdown
  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getSection() {
    this._sectionService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //FindingCategory dropdown
  getFindingCategory() {
    this._auditFindingCategoriesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //Supplier dropdown
  getSupplier() {
    this._supplierService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchFindingCategory(e, patchValue:boolean=false) {
    this._auditFindingCategoriesService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ finding_category_id: i.id });
          break;
        }
      }
      AuditFindingCategoryMasterStore.lastInsertedId = null
    }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSupplier(e, patchValue:boolean=false) {
    this._supplierService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ supplier_id: i.id });
          break;
        }
      }
      SuppliersMasterStore.lastInsertedId = null
    }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for getting audit risk rating
  getRiskRating() {

    this._riskRatingService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // document upload
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
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
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }
  
  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }
  // createImageUrl(type, token) {
  //   return this._documentFileService.getThumbnailPreview(type, token);
  // }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._findingsService.getThumbnailPreview(type, token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  createSaveData() {
    let saveData = this.form.value;
    saveData['organization_ids'] = this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids, 'id') : [AuthStore.user?.organization.id];
    saveData['division_ids'] = this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.division.id];
    saveData['department_ids'] = this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id];
    saveData['section_ids'] = this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.section.id];
    saveData['sub_section_ids'] = this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id];
    return saveData;
  }

  processDataForSave() {
    let saveParam = {
      ...this.createSaveData(),
      documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
    }
    return saveParam;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._findingsService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        // save = this._findingsService.saveItem(this.processDataForSave());
        let saveParam = {
          ...this.createSaveData(),
          documents: this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
        }
        
        save = this._findingsService.saveItem(saveParam)
      }

      save.subscribe((res: any) => {
        this.FindingsStore.lastInsertedId = res.id
        
        if (!this.form.value.id) {
          this.resetForm();
          this.setInitialOrganizationLevels();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
        this._router.navigateByUrl(
          "/non-conformity/findings/" + FindingsStore.lastInsertedId)
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  close() {

    this.closeFormModal();
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  
  ngOnDestroy() {
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditFindingCategorySubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();


  }

}















