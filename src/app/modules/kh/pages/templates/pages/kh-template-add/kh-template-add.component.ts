import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DivisionService } from "src/app/core/services/masters/organization/division/division.service";
import { SectionService } from "src/app/core/services/masters/organization/section/section.service";
import { SubSectionService } from "src/app/core/services/masters/organization/sub-section/sub-section.service";
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { DivisionMasterStore } from "src/app/stores/masters/organization/division-store";
import { SectionMasterStore } from "src/app/stores/masters/organization/section-store";
import { SubSectionMasterStore } from "src/app/stores/masters/organization/sub-section-store";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { KnTemplatesService } from 'src/app/core/services/knowledge-hub/templates/kn-templates.service';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from "mobx";
import { DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { KhFileServiceService } from 'src/app/core/services/knowledge-hub/templates/kh-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
declare var $: any;

@Component({
  selector: 'app-kh-template-add',
  templateUrl: './kh-template-add.component.html',
  styleUrls: ['./kh-template-add.component.scss']
})
export class KhTemplateAddComponent implements OnInit {

  @ViewChild("formModal") formModal: ElementRef;
  @ViewChild('documentTypesModal') documentTypesModal: ElementRef;
  @Input ('source') TemplateSource:any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;

  templateForm: FormGroup;
  formErrors: any;
  displayForm: any = null;
  saveData: any = null;
  openModelPopup: boolean = false;

  modalSubscriptionEvent: any
  templateId: number;
  dataParams: any;
  documentFiles: any;
  
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  fileUploadPopupStore = fileUploadPopupStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  TemplateStore = TemplateStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  reactionDisposer: IReactionDisposer;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  KHSettingStore=KHSettingStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DocumentTypeEventSubscription: any;
  organisationChangesModalSubscription: any = null;
  fileUploadPopupSubscriptionEvent: any = null;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _khTemplateService: KnTemplatesService,
    private _documentTypeService: DocumentTypesService,
    private _router: Router,
    private _fileUploadPopupService: FileUploadPopupService,
    private _khFileServiceService:KhFileServiceService,
    private _documentFileService: DocumentFileService,
    private _KhSettingsService:KhSettingsService
  ) { }

  ngOnInit(): void {

    AppStore.disableLoading();
    AppStore.showDiscussion = false;

    this.getKHSettings()

    // Form Intialization
    this.templateForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: [""],
      document_type_ids: [null,Validators.required],
      organization_ids: [null],
      section_ids: [null],
      sub_section_ids: [null],
      division_ids: [null],
      department_ids: [null,Validators.required],
      name: [""],
      ext: [""],
      mime_type: [''],
      size: [''],
      url: [''],
      thumbnail_url: [''],
      token: [''],
    });

    this.getSubsidiary()
    this.getDocumentTypes()

    // this.resetForm();

    if (this.TemplateSource) {      
      if (this.TemplateSource.hasOwnProperty('values') && this.TemplateSource.values) {
     

        let { id, title, description, document_type_ids, organization_ids, section_ids, sub_section_ids, division_ids, department_ids } = this.TemplateSource.values
        
        this.templateForm.setValue({
          id: id,
          title: title?title:'',
          description: description?description:'',
          document_type_ids: document_type_ids?document_type_ids:'',
          organization_ids: organization_ids?organization_ids:'',
          section_ids: section_ids ? section_ids : '',
          sub_section_ids: sub_section_ids ? sub_section_ids: '',
          division_ids: division_ids ? division_ids : '',
          department_ids: department_ids ? department_ids : '',
          name: '',
          ext: '',
          mime_type: '',
          size: '',
          url: '',  
          thumbnail_url: '',
          token:'',
        }) 
        // this.setDocuments(this.TemplateSource?.values?.documents)
        }
        else{
          this.setInitialOrganizationLevels();
        }
    }
    
    this.modalSubscriptionEvent = this._eventEmitterService.commonModal.subscribe((res:any) => {
      if (res == 'save') {
        // this._router.navigateByUrl("/knowledge-hub/template/" + this.templateId);
      }
    })

    
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeOrganizationModal();
      }
    );

    this.DocumentTypeEventSubscription = this._eventEmitterService.documentTypesControl.subscribe(res => {
      this.closeDocumentTypeModal()
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

  }


// Checking Whether Document Type is Internal or External


getKHSettings(){
  this._KhSettingsService.getItems().subscribe()
}

  // checkSettingsPermission(){
  //   if(KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.type=='internal')
  //   this.enableFile
  // }


  
  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }



  closeOrganizationModal(data?) {
    if(data){
      this.templateForm.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids:data.department_ids ? data.department_ids : [],
        section_ids:data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

//Getting subsidiary 
  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings.is_subsidiary){
        this.templateForm.patchValue({organization_ids:[res.data[0]]});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

//Auto populating data based on user loggedin
  setInitialOrganizationLevels(){
    this.templateForm.patchValue({
      division_ids: [AuthStore?.user?.division],
      department_ids:[AuthStore?.user?.department],
      section_ids:[AuthStore?.user?.section],
      sub_section_ids: [AuthStore?.user?.sub_section]
    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this.templateForm.patchValue({ organization_ids: [AuthStore.user?.organization]});
    }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.templateForm.value.division_ids});
    this.searchDepartment({term: this.templateForm.value.department_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.templateForm.value.section_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.templateForm.value.sub_section_ids});
    this._utilityService.detectChanges(this._cdr);
     
  }
  
  // getSubsidiary() {
  //   this._subsidiaryService
  //     .getAllItems(false)
  //     .subscribe((res) => {
  //       this._utilityService.detectChanges(this._cdr);
  //     });
  // }

  getDepartment(){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      this._departmentService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DepartmentStore.setAllDepartment([]);
    }
  }

  getDivision(){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.DivisionStore.setAllDivision([]);
    }
  }


  getSection(){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.templateForm.get('department_ids').value)
      this._sectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SectionStore.setAllSection([]);
    }
  }

  getDocumentTypes() {
    this._documentTypeService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  getSubSection(){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.templateForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.templateForm.get('section_ids').value)
      this._subSectionService.getItems(false,params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    else{
      this.SubSectionStore.setAllSubSection([]);
    }
  }

  searchDocTypes(e,patchValue:boolean = false){
    this._documentTypeService.getItems(false,'q='+e.term).subscribe((res: DocumentTypesPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_types = this.templateForm.value.document_type_ids ? this.templateForm.value.document_type_ids : [];
            document_types.push(i);
            this.templateForm.patchValue({document_type_ids:document_types});
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

  searchDepartment(e){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  
  searchDivision(e){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      let parameters = this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value);
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchSection(e){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.templateForm.get('department_ids').value)
      this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e){
    if(this.templateForm.get('organization_ids').value && this.templateForm.get('organization_ids').value.length > 0){
      var params = '';
      params = '&organization_ids='+this._helperService.createParameterFromArray(this.templateForm.get('organization_ids').value)
      +'&division_ids='+this._helperService.createParameterFromArray(this.templateForm.get('division_ids').value)
      +'&department_ids='+this._helperService.createParameterFromArray(this.templateForm.get('department_ids').value)
      +'&section_ids='+this._helperService.createParameterFromArray(this.templateForm.get('section_ids').value)
      this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }




 
  onFileChange(event, type: string) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(
        selectedFiles,
        type
      ); // Assign Files to Multiple File Uploads Array
      Array.prototype.forEach.call(temporaryFiles, (elem) => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append("file", file);
          var typeParams = type == "logo" ? "?type=logo" : "?type=support-file";
          this._imageService
            .uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
            .subscribe(
              (res: HttpEvent<any>) => {
                let uploadEvent: any = res;
                switch (uploadEvent.type) {
                  case HttpEventType.UploadProgress:
                    // Compute and show the % done;
                    if (uploadEvent.loaded) {
                      let upProgress = Math.round(
                        (100 * uploadEvent.loaded) / uploadEvent.total
                      );
                      this.assignFileUploadProgress(upProgress, file);
                    }
                    this._utilityService.detectChanges(this._cdr);
                    break;
                  case HttpEventType.Response:
                    //return event;
                    let temp: any = uploadEvent["body"];
                    temp["is_new"] = true;
                    this.assignFileUploadProgress(null, file, true);
                    this._imageService
                      .getPreviewUrl(temp.thumbnail_url)
                      .subscribe(
                        (prew) => {
                          //Generate preview url using thumbnail url returns blob
                          this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                        },
                        (error) => {
                          this.assignFileUploadProgress(null, file, true);
                          this._utilityService.detectChanges(this._cdr);
                        }
                      );
                }
              },
              (error) => {
                this._utilityService.showErrorMessage(
                  "Failed",
                  "Sorry file upload failed"
                );
                this.assignFileUploadProgress(null, file, true);
                this._utilityService.detectChanges(this._cdr);
              }
            );
        } else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  checkAcceptFileTypes(type) {
		return this._imageService.getAcceptFileTypes(type);
	}

  /**
   *
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(
      files,
      type,
      this.fileUploadsArray
    );
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  /**
   *
   * @param progress File Upload Progress
   * @param file Selected File
   * @param success Boolean value whether file upload success
   */
  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(
      progress,
      file,
      success,
      temporaryFileUploadsArray
    );
  }

  createImageFromBlob(image: Blob, fileDetails, type) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        var logo_url = reader.result;
        fileDetails["preview"] = logo_url;
        if (fileDetails != null) {
          this._khTemplateService.setTemplateFile(fileDetails, logo_url, type);
        }
        this._utilityService.detectChanges(this._cdr);
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  /**
   * Deletes a Document
   * @param token Token of Document
   */
  removeBrochure(token) {
    TemplateStore.unsetTemplateFiles("support-file", token);
    this._utilityService.detectChanges(this._cdr);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  // ******** File Upload Ends  Here ************


  // Form Save

  save(close: boolean = false) {
    if (this.templateForm.value) {

      this.displayForm = this.templateForm.value;
      this.createTemplate()

      let save;
      AppStore.enableLoading();

    
      if (this.templateForm.value.id) {

        let templateId = this.templateForm.value.id
        this.setData()
        save = this._khTemplateService.updateItem(templateId,this.dataParams);
      } else {
        // this.setData('save')
        save = this._khTemplateService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          this.templateId=res.id
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) {
            this.closeFormModal('save');
            this._router.navigateByUrl('knowledge-hub/template/' + res['id']);
          }
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
            this.processFormErrors();
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
  formValidationCheck(){

    // Checking if Setting Type is External/Internal then setting Validation Accordingly.

    if(KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.type=='external')
    {
      if(!TemplateStore.getTemplateFiles ||this.templateForm.invalid || AppStore.loading)
      return true
      else
      return false
    }
    else 
    {
      if( this.templateForm.invalid || AppStore.loading)
      return true
      else
      return false
    }
  }


  createTemplate() {

    this.documentFiles = TemplateStore.getTemplateFiles
     
    this.saveData = {

      "id": this.displayForm.id ? this.displayForm.id : '',
      "title": this.displayForm.title ? this.displayForm.title : '',
      "description": this.displayForm.description ? this.displayForm.description : '',
      "document_type_ids":[],
      "organization_ids":[],
      "section_ids":[],
      "sub_section_ids":[],
      "division_ids": [],
      "department_ids": [],
      "name": this.documentFiles?this.documentFiles.name:null,
      "ext": this.documentFiles?this.documentFiles.ext:null,
      "mime_type": this.documentFiles?this.documentFiles.mime_type:null,
      "size": this.documentFiles?this.documentFiles.size:null,
      "url": this.documentFiles?this.documentFiles.url:null,
      "thumbnail_url": this.documentFiles?this.documentFiles.thumbnail_url:null,
      "token":this.documentFiles?this.documentFiles.token:null,
      "knowledge_hub_setting_type_ids":KHSettingStore.khSettingsItems?.knowledge_hub_setting_type?.id

    }


    if (this.displayForm.document_type_ids && this.displayForm.document_type_ids.length > 0) {
      this.saveData.document_type_ids = this._helperService.getArrayProcessed(this.displayForm.document_type_ids, 'id');
    }
    else {
      this.saveData.document_type_ids = [];
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

      // if(this.displayForm.id){
      //   this.saveData['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
      // }else
      //  this.saveData['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
  
      return this.saveData;

  }

  setData() {
    let data = this.saveData
    delete data.id
 
      if (this.documentFiles == null) {
        this.dataParams = {
          ...data
        }
      }

      if (this.documentFiles!=null && this.documentFiles.is_deleted)
      {
        this.dataParams = {
          ...data,
          document_id:this.documentFiles.id,
          is_deleted: true
        }
      }
      if (this.documentFiles!=null && this.documentFiles.is_new)
      {
        this.dataParams = {
          ...data,
          is_new: true
        }
      }
      if (this.documentFiles && this.documentFiles.is_deleted == null && this.documentFiles.is_new == null) {
        this.dataParams = {
          ...data
        }
      }
  

    

  }

  
  processFormErrors(){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {

        if (key.startsWith('document_type_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['document_type_ids'] = this.formErrors['document_type_ids']? this.formErrors['document_type_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
      
           if(key.startsWith('organization_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('division_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['division_ids'] = this.formErrors['division_ids']? this.formErrors['division_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('department_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['department_ids'] = this.formErrors['department_ids']? this.formErrors['department_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['section_ids'] = this.formErrors['section_ids']? this.formErrors['section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
          if(key.startsWith('sub_section_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['sub_section_ids'] = this.formErrors['sub_section_ids']? this.formErrors['sub_section_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }

      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

   // Open Document Type  Modal

   addDocumentType(){

    $(this.documentTypesModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }
  
  // Close Document Type Modal
  closeDocumentTypeModal() {
   
    if(DocumentTypeMasterStore.lastInsertedId){
      this.searchDocTypes({term: DocumentTypeMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      // IssueListStore.issue_domain_form_modal = false;
      $(this.documentTypesModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  
  }

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type) {
    AppStore.disableLoading();
    this.resetForm();
    this._eventEmitterService.dismissCommonModal(type)
  }

  resetForm() {
    this.TemplateStore.clearTemplateFiles();
    this.templateForm.reset();
    this.templateForm.pristine;
    this.formErrors = null;
    this.fileUploadsArray = [];
  }

     //getting button name by language
     getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setDocuments(documents){
    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._khFileServiceService.getThumbnailPreview('document-template-document', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  // *Common  File Upload/Attach Modal Functions Starts Here
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();      
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
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);
    
  }
  enableScrollbar() {
    if (fileUploadPopupStore?.displayFiles?.length >= 3) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
      //$(this.previewUploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
      //$(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  // *Common  File Upload/Attach Modal Functions Ends Here

  ngOnDestroy() {
    this.modalSubscriptionEvent.unsubscribe()
    this.DocumentTypeEventSubscription.unsubscribe()
    this.clearCommonFilePopupDocuments();
  }

}
