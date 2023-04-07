import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ChangeDetectorRef } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { DocumentAccessTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-access-type-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DocumentAccessTypeService } from 'src/app/core/services/masters/knowledge-hub/document-access-type/document-access-type.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { DesignationPaginationResponse } from 'src/app/core/models/masters/human-capital/designation';
import { DocumentStatusService } from 'src/app/core/services/masters/knowledge-hub/document-status/document-status.service';
import { DocumentStatusMasterStore } from 'src/app/stores/masters/knowledge-hub/document-status-store';


declare var $: any;

@Component({
  selector: 'app-quick-upload',
  templateUrl: './quick-upload.component.html',
  styleUrls: ['./quick-upload.component.scss']
})
export class QuickUploadComponent implements OnInit {


  @ViewChild('designationFormModal', { static: true }) designationFormModal: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild("uploadArea", { static: false }) uploadArea: ElementRef;

    // Form Variables
    quickUploadForm: FormGroup;
    FormErrors: any;

    // File Upload Variables
  fileUploadProgress = 0; 
  quickUploadFiles: any = [];
  processedDocumentStatusArray = [];
  saveData: any = null;
  displayForm: any = null;
  selectedAccessType: number = null;
  isShared: boolean = false;
  openDesignationModal:boolean=false;

  designationModalSubscription: any;

  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  AppStore = AppStore;
  DocumentAccessTypeMasterStore = DocumentAccessTypeMasterStore;
  UsersStore = UsersStore;
  DesignationMasterStore=DesignationMasterStore
  DocumentsStore = DocumentsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DocumentStatusMasterStore = DocumentStatusMasterStore;

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
    private _userService: UsersService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _designationService: DesignationService,
    private _helperService: HelperServiceService,
    private _documentsService: DocumentsService,
    private _renderer2: Renderer2,
    private _documentStatusService: DocumentStatusService,
  ) { }

  ngOnInit(): void {

    this.quickUploadForm = this._formBuilder.group({
      document_id: null,
      documents: [""],
      document_access_type_id:[null,[Validators.required]],
      organization_ids: [null],
      section_ids: [null],
      sub_section_ids: [null],
      division_ids: [null],
      department_ids: [null],
      designation_ids:[null],
      user_ids: [""],
      document_status_id: null
      
    });

    this.getDocumentAccessTypes()
    this.getDocumentStatus()

    this.designationModalSubscription = this._eventEmitterService.designationControl.subscribe(res=>{
      this.closeDesignationForm();
    })

     //  * Checking for parent data status 
  if(DocumentsStore.parentDataStatus)
  this.setParentAccessData()
else
  this.selectAccessType(1)

  }


  
  // * Setting Parent Access Data.

  setParentAccessData() {
    
    // ! Private == 1 || Public == 2 || Shared == 3

    let accessData=DocumentsStore.ParentData.accessData;

    this.selectAccessType(DocumentsStore.ParentData.accessId)
    if (DocumentsStore.ParentData.accessId == 3) {
      this.quickUploadForm.patchValue({
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


  // * Selecting Access Type 

  selectAccessType(accessTypeId) {

    this.quickUploadForm.patchValue({
      document_access_type_id:accessTypeId
    })

    if (accessTypeId != 3) {
      this.isShared = false;
      this.quickUploadForm.controls['organization_ids'].reset()
      this.quickUploadForm.controls['section_ids'].reset()
      this.quickUploadForm.controls['sub_section_ids'].reset()
      this.quickUploadForm.controls['division_ids'].reset()
      this.quickUploadForm.controls['department_ids'].reset()
      this.quickUploadForm.controls['user_ids'].reset()
      this.quickUploadForm.controls['designation_ids'].reset()
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

  setAccessType(id) {
    if (id != 3) {
      this.isShared = false;
      this.quickUploadForm.controls['organization_ids'].reset()
      this.quickUploadForm.controls['section_ids'].reset()
      this.quickUploadForm.controls['sub_section_ids'].reset()
      this.quickUploadForm.controls['division_ids'].reset()
      this.quickUploadForm.controls['department_ids'].reset()
      this.quickUploadForm.controls['user_ids'].reset()
      this.quickUploadForm.controls['designation_ids'].reset()
    } else
      this.isShared = true;
      this.selectedAccessType = id

  }

  // * Sub Form(Master) of Designation
  
  openDesignationForm() {
    this.openDesignationModal=true;
    this.FormErrors = null;
    AppStore.disableLoading();
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    $(this.designationFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  // * Master Designation Form  Close

  closeDesignationForm() {
    this.openDesignationModal=false;
    $(this.designationFormModal.nativeElement).modal('hide');
    if (DesignationMasterStore.lastInsertedId) {
      this.quickUploadForm.patchValue({
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
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      this._departmentService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision(){
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value);
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
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('department_ids').value)
      this._sectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SectionStore.setAllSection([]);
    }
  }

  getSubSection(){
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('section_ids').value)
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

  getDocumentStatus() {
    this._documentStatusService.getAllItems().subscribe(res => {
      
      res.forEach(data => {     
        if (data.id == 1 || data.id == 7) {
          this.processedDocumentStatusArray.push(data)
          this.quickUploadForm.patchValue({
            document_status_id: 1
          })
          this._utilityService.detectChanges(this._cdr)
        }             
      })
      

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
            let document_designations = this.quickUploadForm.value.designation_ids ? this.quickUploadForm.value.designation_ids : [];
            document_designations.push(i);
            this.quickUploadForm.patchValue({ designation_ids: document_designations });
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
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  
  searchDepartment(e){
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchSection(e){
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('department_ids').value)
      this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e){
    if(this.quickUploadForm.get('organization_ids').value && this.quickUploadForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.quickUploadForm.get('section_ids').value)
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


  // *** File Upload Functions Starts Here ***


  checkFileStatus() {
    if (DocumentsStore.getSupportFile.length > 0)
      return false;
    else
      return true;
  }
  
  //To get file details when selected
  onFileChange(event,type:string){
  
    var selectedFiles:any[] =  event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles,elem=>{
        const file = elem;
        if(this._imageService.validateFile(file,type)){
          const formData = new FormData();
          formData.append('file',file);
          var typeParams  = (type == 'logo')?'?type=logo':'?type=support-file';
          this._imageService.uploadImageWithProgress(formData,typeParams) // Upload file to temporary storage
          .subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
           
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if(uploadEvent.loaded){
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress,file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null,file,true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew,temp,type); // Convert blob to base64 string
                },(error)=>{
                  this.assignFileUploadProgress(null,file,true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          },(error)=>{
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null,file,true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }
  }

      /**
 * 
 * @param files Selected files array
 * @param type type of selected files - logo or brochure
 */
addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.quickUploadFiles);
    this.quickUploadFiles = result.fileUploadsArray;
    return result.files;
    
}
  
createImageFromBlob(image: Blob, fileDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      fileDetails['preview'] = logo_url;
      if (fileDetails != null) {

        this._documentsService.setSupportFile(fileDetails,logo_url);
      }
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
  
    if (image) {
       reader.readAsDataURL(image);
    }
  

}
/**
 * Deletes a Document
 * @param token Token of Document
 */
removeBrochure(type,token) {
  DocumentsStore.unsetFileDetails(type, token);
  this._utilityService.detectChanges(this._cdr);
}

checkExtension(ext, extType) {
  var res = this._imageService.checkFileExtensions(ext, extType);
  return res;
}
  
      /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
 assignFileUploadProgress(progress, file, success = false) {
   
   let temporaryFileUploadsArray = this.quickUploadFiles;
    this.quickUploadFiles = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
 
 }

 checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
 }
  


  checkForFileUploadsScrollbar() {

    if(DocumentsStore.getSupportFile.length >= 5 || this.quickUploadFiles.length > 5){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    
  }

  // *** File Upload Functions Ends Here ***


  // ***Quick Upload Save 

      createDocument(){
        
    }

  
    saveFiles(close:boolean=false){
      this.FormErrors=null;
      if (DocumentsStore.getSupportFile && DocumentsStore.getSupportFile.length > 0) {

        this.displayForm=this.quickUploadForm.value
        this.createQuickUploadData()
        
        let save
        AppStore.enableLoading();
        save = this._documentsService.quickUpload(this.saveData)  
        
        save.subscribe(res => {

          this.resetForm()
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
            console.log(err)
          if (err.status == 422) {
            this.FormErrors = err.error.errors
            console.log(this.FormErrors)
            this._utilityService.detectChanges(this._cdr);
            AppStore.disableLoading();
          }
        });
      }
    }
  
  createQuickUploadData() {

    this.saveData = {
      "document_id": DocumentsStore.documentId ? DocumentsStore.documentId : null,
      "documents": DocumentsStore.getSupportFile ? DocumentsStore.getSupportFile : [],
      "document_access_type_id": this.selectedAccessType ? this.selectedAccessType : null,
      "document_status_id": this.displayForm.document_status_id ? this.displayForm.document_status_id : null,
      "organization_ids": [],
      "section_ids": [],
      "sub_section_ids": [],
      "division_ids": [],
      "department_ids": [],
      "designation_ids": [],
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
  
  resetForm() {
    DocumentsStore.clearSupportFiles();
    this.quickUploadFiles = [];
      this.checkForFileUploadsScrollbar();
      this.quickUploadForm.reset();
      this.quickUploadForm.pristine;
      this.FormErrors = null;
    }
  
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissQuickUpload()
    }

    getStringsFormatted(stringArray,characterLength,seperator){
      return this._helperService.getFormattedName(stringArray,characterLength,seperator);
    }

     //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    this.designationModalSubscription.unsubscribe()
  }

}
