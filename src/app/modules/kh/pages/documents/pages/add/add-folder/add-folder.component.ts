import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentAccessTypeService } from 'src/app/core/services/masters/knowledge-hub/document-access-type/document-access-type.service';
import { DocumentAccessTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-access-type-store';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DesignationPaginationResponse } from 'src/app/core/models/masters/human-capital/designation';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';

declare var $: any;

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {

  @ViewChild('designationFormModal', { static: true }) designationFormModal: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;




  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  AppStore = AppStore;
  DoccumentAccessTypeStore = DocumentAccessTypeMasterStore;
  UsersStore = UsersStore;
  DocumentsStore = DocumentsStore;
  DesignationMasterStore=DesignationMasterStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  folderForm: FormGroup;
  folderFormErros :any;
  Users: any = [];
  displayForm: any = null;
  saveData: any = null;
  selectedAccessType: number = null;
  isShared: boolean = false;
  openDesignationPopup:boolean=false;

  designationModalSubscription: any;



  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _documentAccessTypeService: DocumentAccessTypeService,
    private _documentsService: DocumentsService,
    private _userService: UsersService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _designationService: DesignationService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    AppStore.showDiscussion = true;

    this.folderForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      document_id:[""],
      document_access_type_id:[null,[Validators.required]],
      organization_ids: [null],
      section_ids: [null],
      sub_section_ids: [null],
      division_ids: [null],
      department_ids: [null],
      designation_ids:[null],
      user_ids:[""]
    });


    this.getDocumentAccessTypes()

    this.designationModalSubscription = this._eventEmitterService.designationControl.subscribe(res=>{
      this.closeDesignationForm();
    })
    
  //  * Checking for parent data status 
  if(DocumentsStore.parentDataStatus)
      this.setParentAccessData()
    else
      this.selectAccessType(1)
    
  }


  // Custom Search Function

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
 


  // * Setting Parent Access Data.

  setParentAccessData() {
    
    // ! Private == 1 || Public == 2 || Shared == 3

    let accessData=DocumentsStore.ParentData.accessData;

    this.selectAccessType(DocumentsStore.ParentData.accessId)
    if (DocumentsStore.ParentData.accessId == 3) {
      this.folderForm.patchValue({
        organization_ids: accessData.org_ids,
        section_ids:accessData.section_ids,
        sub_section_ids:accessData.sub_section_ids,
        division_ids:accessData.division_ids,
        department_ids:accessData.department_ids,
        designation_ids:accessData.designation_ids,
        user_ids:accessData.user_ids
      })
    }

  }

  addValidation(id){
    if(id==3){      
      this.folderForm.controls["organization_ids"].setValidators(Validators.required);
      this.folderForm.controls["organization_ids"].updateValueAndValidity();
    }else{
      this.folderForm.controls["organization_ids"].clearValidators();
      this.folderForm.controls["organization_ids"].updateValueAndValidity();
    }
  }

  // * Selecting Access Type 

  selectAccessType(accessTypeId) {

    this.folderForm.patchValue({
      document_access_type_id:accessTypeId
    })

    if (accessTypeId != 3) {
      this.isShared = false;
      this.folderForm.controls['organization_ids'].reset()
      this.folderForm.controls['section_ids'].reset()
      this.folderForm.controls['sub_section_ids'].reset()
      this.folderForm.controls['division_ids'].reset()
      this.folderForm.controls['department_ids'].reset()
      this.folderForm.controls['user_ids'].reset()
      this.folderForm.controls['designation_ids'].reset()
    } else
    this.isShared = true;
    this.selectedAccessType = accessTypeId
    
  }

  // * Finding Selected Access Type to set the Style

  findSelectedAccessType(accessTypeId) {
    
    if (accessTypeId == this.selectedAccessType)
      return true;
  }

  // * Setting Class Name Based on thier type

  setAccessCLass(accessType) {
  
    var className = ''
    
    if(accessType.is_private==1)
      return className = 'fas fa-lock'
    if (accessType.is_shared == 1)
      return className = 'fas fa-share';
    if (accessType.is_public == 1)
      return className = 'fas fa-globe-americas'
      
    
  }

  // * Sub Form(Master) of Designation
  
  openDesignationForm() {
    this.openDesignationPopup=true;
    this.folderFormErros = null;
    AppStore.disableLoading();
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    $(this.designationFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // * Master Designation Form  Close

  closeDesignationForm() {
    this.openDesignationPopup=false;
    $(this.designationFormModal.nativeElement).modal('hide');
    if (DesignationMasterStore.lastInsertedId) {
      this.folderForm.patchValue({
        designation_ids: [DesignationMasterStore.lastInsertedId]
      })
      const index: number = this.DesignationMasterStore.designations.findIndex(e => e.id == DesignationMasterStore.lastInsertedId);
      this._designationService.searchDesignation('q=' + DesignationMasterStore.lastInsertedId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        DesignationMasterStore.lastInsertedId = null;
      })

    }

  }

  // * Get Data and Search Function Starts Here 

  getSubsidiary() {
    this._subsidiaryService
      .getAllItems(false)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getDepartment(){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      this._departmentService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision(){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DivisionStore.setAllDivision([]);
    }
  }

  getDesignation() {
    this._designationService.getItems(false,'access_all=true&is_full_list=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSection(){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.folderForm.get('department_ids').value)
      this._sectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SectionStore.setAllSection([]);
    }
  }

  getSubSection(){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.folderForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.folderForm.get('section_ids').value)
      this._subSectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  
  getUsers() {

    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

    getDocumentAccessTypes() {
    
    this._documentAccessTypeService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })

  }

   // Searchig In Form Drop Down

   searchUers(e) {

    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchDocumentType(e) {
    this._documentAccessTypeService.searchDocumentAccessTypes('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchDesignation(e, patchValue: boolean = false) {
    this._designationService.getItems(false,'q=' + e.term).subscribe((res: DesignationPaginationResponse) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            let document_designations = this.folderForm.value.designation_ids ? this.folderForm.value.designation_ids : [];
            document_designations.push(i);
            this.folderForm.patchValue({ designation_ids: document_designations });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  

  searchSubsidiary(e) {
    this._subsidiaryService
      .searchSubsidiary("?q=" + e.term)
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  searchDivision(e){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  
  searchDepartment(e){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchSection(e){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.folderForm.get('department_ids').value)
      this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e){
    if(this.folderForm.get('organization_ids').value && this.folderForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.folderForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.folderForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.folderForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.folderForm.get('section_ids').value)
      this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  // * Get Data and Search Function Ends Here 

  // Returns image url according to type and token
  createImageUrl(type,token){
      return this._documentFileService.getThumbnailPreview(type,token);
  }

  // Returns default image url
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
  //getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

  // *  Save Function

  save(close: boolean = false) {
    if (this.folderForm.value) {
      let save;
      this.displayForm=this.folderForm.value
      this.createFolderData()
      AppStore.enableLoading();

      save = this._documentsService.addFolder(this.saveData);
  
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal('save');
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.folderFormErros = err.error.errors;
          } else {
            this._utilityService.showErrorMessage(
              "Error!",
              "Something went wrong. Please try again."
            );
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  // * Creating Save Data

  createFolderData() {
    
    this.saveData = {
      "title": this.displayForm.title ? this.displayForm.title : '',
      "document_access_type_id": this.selectedAccessType?this.selectedAccessType:null,
      "organization_ids":[],
      "section_ids":[],
      "sub_section_ids":[],
      "division_ids": [],
      "department_ids": [],
      "designation_ids": [],
      "document_id":DocumentsStore.documentId?DocumentsStore.documentId:null,
    }

    if(this.displayForm.designation_ids && this.displayForm.designation_ids.length > 0){
      this.saveData.designation_ids = this._helperService.getArrayProcessed(this.displayForm.designation_ids,'id');
    }
    else{
      this.saveData.designation_ids = [];
    }
    if(this.displayForm.user_ids && this.displayForm.user_ids.length > 0){
      this.saveData.user_ids = this._helperService.getArrayProcessed(this.displayForm.user_ids,'id');
    }
    else{
      this.saveData.user_ids = [];
    }
    if (this.displayForm.organization_ids && this.displayForm.organization_ids.length > 0) {
      this.saveData.organization_ids = this._helperService.getArrayProcessed(this.displayForm.organization_ids, 'id');
    }
    else {
      this.saveData.organization_ids = [];
    }
      if(this.displayForm.section_ids && this.displayForm.section_ids.length > 0){
        this.saveData.section_ids = this._helperService.getArrayProcessed(this.displayForm.section_ids,'id');
      }
      else{
        this.saveData.section_ids = [];
      }
      if(this.displayForm.sub_section_ids && this.displayForm.sub_section_ids.length > 0){
        this.saveData.sub_section_ids = this._helperService.getArrayProcessed(this.displayForm.sub_section_ids,'id');
      }
      else{
        this.saveData.sub_section_ids = [];
      }
      if(this.displayForm.division_ids && this.displayForm.division_ids.length > 0){
        this.saveData.division_ids = this._helperService.getArrayProcessed(this.displayForm.division_ids,'id');
      }
      else{
        this.saveData.division_ids = [];
      }
      if(this.displayForm.department_ids && this.displayForm.department_ids.length > 0){
        this.saveData.department_ids = this._helperService.getArrayProcessed(this.displayForm.department_ids,'id');
      }
      else{
        this.saveData.department_ids = [];
      }

  }

// * Setting Access Type

  setAccessType(id) {
    if (id != 3) {
      this.isShared = false;
      this.folderForm.controls['organization_ids'].reset()
      this.folderForm.controls['section_ids'].reset()
      this.folderForm.controls['sub_section_ids'].reset()
      this.folderForm.controls['division_ids'].reset()
      this.folderForm.controls['department_ids'].reset()
      this.folderForm.controls['user_ids'].reset()
      this.folderForm.controls['designation_ids'].reset()
    } else
      this.isShared = true;
      this.selectedAccessType = id

  }

  // * Cancel Form

  cancel() {
    this.closeFormModal('cancel');
  }

  // * Close Form

  closeFormModal(type) {
    this.resetForm();
    this._eventEmitterService.dismissCommonModal(type)
  }

  // * Reset Form

  resetForm() {
    this.folderForm.reset();
    this.folderForm.pristine;
    this.folderFormErros = null;
    this.selectAccessType(1)
  }



ngOnDestroy(){
  this.designationModalSubscription.unsubscribe();
}
 

}
