import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditableItemMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-store';
import { HttpEventType, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuditableItemService } from 'src/app/core/services/masters/internal-audit/auditable-item/auditable-item.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SubsidiaryService } from "src/app/core/services/organization/business_profile/subsidiary/subsidiary.service";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { AuditCheckListService } from 'src/app/core/services/masters/internal-audit/audit-check-list/audit-check-list.service';
import { AuditCheckListMasterStore } from 'src/app/stores/masters/internal-audit/audit-check-list-store';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';
import { RiskRatingService } from 'src/app/core/services/masters/external-audit/risk-rating/risk-rating.service';
import { AuditItemTypeMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-type';
import { AuditableItemTypeService } from 'src/app/core/services/masters/internal-audit/auditable-item-type/auditable-item-type.service';
import { AuditItemCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-item-category-store';
import { AuditableItemCategoryService } from 'src/app/core/services/masters/internal-audit/auditable-item-category/auditable-item-category.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';

@Component({
  selector: 'app-auditable-item-modal',
  templateUrl: './auditable-item-modal.component.html',
  styleUrls: ['./auditable-item-modal.component.scss']
})
export class AuditableItemModalComponent implements OnInit {
  @Input('source') AuditableItemSource: any;

  AuditableItemMasterStore = AuditableItemMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  AuditCheckListMasterStore = AuditCheckListMasterStore;
  AuditItemTypeMasterStore = AuditItemTypeMasterStore;
  AuditItemCategoryMasterStore = AuditItemCategoryMasterStore;
  RiskRatingStore = RiskRatingMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;
  MsTypeStore = MsTypeStore;

  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;

  fileUploadsArray: any = []; // Display Mutitle File Loaders

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
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
    private _msTypeService: MstypesService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    // form elements

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      auditable_item_category_id: [''],
      auditable_item_type_id: [''],
      risk_rating_id: [''],
      checklist_ids: [],
      sub_section_ids: [],
      section_ids: [],
      organization_ids: [],
      division_ids: [],
      description: [''],
      department_ids: [],
      control_ids:[],
      ms_type_organization_ids:[],
      documents: ['']
    });

    // initial form reseting
    this.resetForm();

    // loading data initially
    
    this.getAuditableItemCategory();
    this.getAuditableItemType();
    this.getCheckList();
    this.getOrganization();
    this.getRiskRating();
    this.getControls();
    this.getMsType();

    // Checking if Source has Values and Setting Form Value

    if (this.AuditableItemSource) {
      this.setFormValues();
    }



  }

  ngDoCheck(){
    if (this.AuditableItemSource && this.AuditableItemSource.hasOwnProperty('values') && this.AuditableItemSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.AuditableItemSource.hasOwnProperty('values') && this.AuditableItemSource.values) {
      this.form.setValue({
        id: this.AuditableItemSource.values.id,
        description: this.AuditableItemSource.values.description,
        title: this.AuditableItemSource.values.title,
        auditable_item_category_id: this.AuditableItemSource.values.auditable_item_category_id,
        auditable_item_type_id: this.AuditableItemSource.values.auditable_item_type_id,
        risk_rating_id: this.AuditableItemSource.values.risk_rating_id,
        checklist_ids: this.AuditableItemSource.values.checklist_ids,
        sub_section_ids: this.AuditableItemSource.values.sub_section_ids,
        section_ids: this.AuditableItemSource.values.section_ids,
        organization_ids: this.AuditableItemSource.values.organization_ids,
        division_ids: this.AuditableItemSource.values.division_ids,
        department_ids: this.AuditableItemSource.values.department_ids,
        control_ids: this.AuditableItemSource.values.control_ids,
        ms_type_organization_ids: this.AuditableItemSource.values.ms_type_organization_ids,
        documents: ''
      })
      this.searchDivision({term: this.form.get('division_ids').value});
      this.searchAuditableItemCategory({term: this.form.get('auditable_item_category_id').value});
      this.searchAuditableItemType({term: this.form.get('auditable_item_type_id').value});
      this.searchCheckList({term: this.form.get('checklist_ids').value});
      this.searchControls({term: this.form.get('control_ids').value});
      this.searchSection({term: this.form.get('section_ids').value});
      this.searchDepartment({term: this.form.get('department_ids').value});
      this.searchMsType({term: this.form.get('ms_type_organization_ids').value});
      this.searchOrganization({term: this.form.get('organization_ids').value});
      this.searchRiskRating({term: this.form.get('risk_rating_id').value});
      this.searchSubSection({term: this.form.get('sub_section_ids').value});
    }
  }



  // event change

  eventChange(type){

    switch(type){

      case 'organization':
        this.form.controls["division_ids"].reset();
        DivisionMasterStore.setAllDivision([]);
        this.getDevision();
        break;

      case 'division':
        this.form.controls["department_ids"].reset();
        DepartmentMasterStore.setAllDepartment([]);
        this.getDepartment();
       break;

       case 'department':
         this.form.controls["section_ids"].reset();
         SectionMasterStore.setAllSection([]);
         this.getSection();
       
       case 'section':
         this.form.controls["sub_section_ids"].reset();
         SubSectionMasterStore.setAllSubSection([]);
         this.getSubSection();  
     
         default:
        break; 
    }

  }

 // geting department
  getDepartment() {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }


    this._departmentService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }else {
    DepartmentMasterStore.setAllDepartment([]);
  }
  }
  // for searching the department

  searchDepartment(event) {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }


    this._departmentService.getItems(false, '&q=' + event.term+params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  }

  // for getting  division

  getDevision() {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;

    this._divisionService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }else{
    DivisionMasterStore.setAllDivision([]);
  }

  }

  // getting organization
  getOrganization() {
    this._subsiadiaryService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }



// getting section
  getSection() {

    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }
      if(this.form.get('department_ids').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_ids').value}`;
        else
          params = `&department_ids=${this.form.get('department_ids').value}`;
      }


    this._sectionService.getItems(false,params).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })
  }else {
    SectionMasterStore.setAllSection([]);
  }
  }

  // getting sub section
  getSubSection() {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }
      if(this.form.get('department_ids').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_ids').value}`;
        else
          params = `&department_ids=${this.form.get('department_ids').value}`;
      }

      if(this.form.get('section_ids').value){
        if (params)
          params = params + `&section_ids=${this.form.get('section_ids').value}`;
        else
          params = `&section_ids=${this.form.get('section_ids').value}`;
      }


    this._subSectionService.getItems(false,params).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })
  } else {
    SubSectionMasterStore.setAllSubSection([]);
  }

  }
 // searching for controls
  searchControls(e){
    this._controlCategService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }
 // serach for ms type
  searchMsType(e){
    this._msTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // for getting ms type
  getMsType(){
    this._msTypeService.getItems(true).subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }
 // for getting controls
  getControls(){
    this._controlCategService.getItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // search sub section

  searchSubSection(e) {

    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }
      if(this.form.get('department_ids').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_ids').value}`;
        else
          params = `&department_ids=${this.form.get('department_ids').value}`;
      }

      if(this.form.get('section_ids').value){
        if (params)
          params = params + `&section_ids=${this.form.get('section_ids').value}`;
        else
          params = `&section_ids=${this.form.get('section_ids').value}`;
      }

    this._subSectionService.getItems(false, '&q=' + e.term+params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
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

 // for searching audit risk rating
  searchRiskRating(e) {

    this._riskRatingService.getAllItems(false, '&q=' + e.term).subscribe((res) => {
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
  searchAuditableItemCategory(e) {
    this._auditableItemCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // for getting auditable item category
  getAuditableItemCategory() {
    this._auditableItemCategoryService.getItems().subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })

  }

  // for searching the Section

  searchSection(event) {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;
      if(this.form.get('division_ids').value){
        if (params)
          params = params + `&division_ids=${this.form.get('division_ids').value}`;
        else
          params = `&division_ids=${this.form.get('division_ids').value}`;
      }
      if(this.form.get('department_ids').value){
        if (params)
          params = params + `&department_ids=${this.form.get('department_ids').value}`;
        else
          params = `&department_ids=${this.form.get('department_ids').value}`;
      }

    this._sectionService.getItems(false, '&q=' + event.term+params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  }

  // seraching division

  searchDivision(event) {
    let params='';
    if (this.form.get('organization_ids').value) {
      params = `&organization_ids=${this.form.get('organization_ids').value}`;

    this._divisionService.getItems(false, '&q=' + event.term+params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  }

  // for searching organization

  searchOrganization(event) {
    this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });


  }


  // file change function

  onFileChange(event, type: string) {


    var selectedFiles: any[] = event.target.files;


    if (selectedFiles.length > 0) {

      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {

          const formData = new FormData();
          formData.append('file', file);
          AuditableItemMasterStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';

          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
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
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  AuditableItemMasterStore.document_preview_available = false;




                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  AuditableItemMasterStore.document_preview_available = false;
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
        this._auditableItemService.setDocumentDetails(imageDetails,type);

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

   return this._imageService.checkFileExtensions(ext,extType)
    
  }


  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    AuditableItemMasterStore.unsetDocumentDetails(token);
    this._utilityService.detectChanges(this._cdr);
  }


  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.fileUploadsArray = [];
    this._eventEmitterService.dismissAUditableItemControlModal();

  }

  // save function
  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: AuditableItemMasterStore.docDetails
    })
    let save;
    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
    // console.log( this.form.value.kpiing_to);
    if (this.form.value.id) {
      save = this._auditableItemService.updateItem(this.form.value.id, this.form.value);
    } else {
     
       save = this._auditableItemService.saveItem(this.form.value);
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
        this.AuditableItemMasterStore.clearDocumentDetails();

      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      // this.KpiMasterStore.clearDocumentDetails();

      if (close) {
        this.closeFormModal();

      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      }
    });

  }

//getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
