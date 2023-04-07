import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { AuthStore } from 'src/app/stores/auth.store';
import { MdlService } from 'src/app/core/services/knowledge-hub/mdl/mdl.service';
import { DocumentReviewFrequenciesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-review-frequencies-store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentReviewFrequenciesService } from 'src/app/core/services/masters/knowledge-hub/document-review-frequencies/document-review-frequencies.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';

declare var $: any;

@Component({
  selector: 'app-master-add',
  templateUrl: './master-add.component.html',
  styleUrls: ['./master-add.component.scss']
})
export class MasterAddComponent implements OnInit {


  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("documentTypesModal") documentTypesModal: ElementRef;
  @Input('source') MasterDocumentSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  form: FormGroup;
  formErrors: any;

  fileUploadsArray = []; 
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore=AppStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  DocumentReviewFrequenciesMasterStore = DocumentReviewFrequenciesMasterStore
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  BranchesStore = BranchesStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MasterListDocumentStore=MasterListDocumentStore;
  openModelPopup: boolean = false;
  openDocumentTypePopup:boolean=false;
  fileUploadPopupSubscriptionEvent: any = null;
    documentTypeEventSubscription: any = null;
  organisationChangesModalSubscription: any = null;
  todayDate: { year: number; month: any; day: number; };

  months = [
    { title: 'Jan', id: 1 },
    { title: 'Feb', id: 2 },
    { title: 'Mar', id: 3 },
    { title: 'Apr', id: 4 },
    { title: 'May', id: 5 },
    { title: 'Jun', id: 6 },
    { title: 'Jul', id: 7 },
    { title: 'Aug', id: 8 },
    { title: 'Sep', id: 9 },
    { title: 'Oct', id: 10 },
    { title: 'Nov', id: 11 },
    { title: 'Dec', id: 12 }
];

  constructor(
    private _renderer2: Renderer2,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _imageService:ImageServiceService,
    private _documentTypeService: DocumentTypesService,
    private _mdlService:MdlService,
    private _usersService: UsersService,
    private _documentReviewFrequenciesService:DocumentReviewFrequenciesService,
    private _subSectionService:SubSectionService,
    private _divisionService:DivisionService,
    private _departmentService:DepartmentService,
    private _sectionService:SectionService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      document:[''],
      version:[''],
      reference_code:[''],
      document_type_id:['',[Validators.required]],
      description:[''],
      document_review_frequency_id:[''],
      review_user_ids:[''],
      organization_ids: [[]],
      division_ids: [[]],
      department_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
      issue_date:[null]
      // branch_ids:[[]],
    });

    this.resetForm();



    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.documentTypeEventSubscription = this._eventEmitterService.documentTypesControl.subscribe(
      (res) => {
        this.closeDocumentTypeModal();
      }
    );

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );


    this.getDocumentTypes();
      this.getDocumentReview();
      // Checking if Source has Values and Setting Form Value

if (this.MasterDocumentSource?.type=='Edit') {
  this.setFormValues(); 
}else{
  this.setInitialOrganizationLevels();
}

// To set the Minimum date for datepicker.
var date=new Date()                
var monthName=this.months[date.getMonth()]    
this.todayDate = { year: date.getFullYear(), month: monthName.id, day:date.getDate() };    


  }


  setFormValues(){

    if (this.MasterDocumentSource.hasOwnProperty('values') && this.MasterDocumentSource.values) {
      this.form.patchValue({
        id: this.MasterDocumentSource.values.id,
        title: this.MasterDocumentSource.values.title,
        version:this.MasterDocumentSource.values.version,
        reference_code:this.MasterDocumentSource.values.reference_code,
        description: this.MasterDocumentSource.values.description,
        document_type_id:this.MasterDocumentSource.values.document_type,
        document:'',
        document_review_frequency_id:this.MasterDocumentSource?.values?.document_review_frequency_id?this.MasterDocumentSource.values.document_review_frequency_id:null,
        review_user_ids:this.MasterDocumentSource?.values?.review_user_ids?this.getEditValue(this.MasterDocumentSource.values.review_user_ids) : [],
        organization_ids:this.MasterDocumentSource?.values?.organizations ? this.getEditValue(this.MasterDocumentSource.values.organizations) : [],
        division_ids:this.MasterDocumentSource?.values?.divisions ? this.getEditValue(this.MasterDocumentSource.values.divisions) : [],
        department_ids:this.MasterDocumentSource?.values?.departments ? this.getEditValue(this.MasterDocumentSource.values.departments) : [],
        section_ids:this.MasterDocumentSource?.values?.sections ? this.getEditValue(this.MasterDocumentSource.values.sections) : [],
        sub_section_ids:this.MasterDocumentSource?.values?.sub_sections ? this.getEditValue(this.MasterDocumentSource.values.sub_sections) : [], 
        issue_date: this.MasterDocumentSource?.values?.issue_date? this._helperService.processDate(this.MasterDocumentSource.values.issue_date, 'split'):null,
        // branch_ids:this.MasterDocumentSource.values.branches ? this.getEditValue(this.MasterDocumentSource.values.branches) : [], 
      })
    }
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i);
    }
    return returnValues;
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids:AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : [],
      // branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_ids[0].id});
    this.searchDepartment({term: this.form.value.department_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({term: this.form.value.section_ids[0].id});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({term: this.form.value.sub_section_ids[0].id});
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({term: this.form.value.branch_ids[0]?.id});
    this._utilityService.detectChanges(this._cdr);
  } 

  searchDivision(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSection(e) {
    if (this.form.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
      this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }
  searchSubSection(e) {
    if (this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
      this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
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

  // searchBranches(e){
  //   if (this.form.get('organization_ids').value) {
  //     let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
  //     this._branchesService.getAllItems(false, '?organization_ids=' + parameters+ '&q=' + e.term).subscribe(res => {
  //       this._utilityService.detectChanges(this._cdr);
  //     });
  //   }
  //   else {
  //     BranchesStore.clearBranchList();  
  //   }
  // }

  searchDepartment(e) {
    if (this.form.get('organization_ids').value) {
      var params = '';
      params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
      this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }
  
  closeModal(data?) {
    if(data){
      this.form.patchValue({
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


  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._mdlService.updateDocument(this.form.value.id,this.setData());
      } else {
        save = this._mdlService.saveItem( this.setData());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
        MasterListDocumentStore.clearDocument();
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(res.id);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }

   setData(){

    var formData=this.form.value

    let saveParam = {
    
      title: formData.title ? formData.title : '',
      document_type_id:formData.document_type_id?formData.document_type_id.id:null,
      reference_code:formData.reference_code?formData.reference_code:'',
      description:formData.description?formData.description:'',
      document_review_frequency_id:formData.document_review_frequency_id?formData.document_review_frequency_id.id:null,
      review_user_ids:this.form.value.review_user_ids ? this._helperService.getArrayProcessed(this.form.value.review_user_ids ,'id') : '',
      organization_ids:this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids ,'id') : [AuthStore.user?.organization.id],
      division_ids:this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids ,'id') : [AuthStore.user?.division.id],
      department_ids:this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids ,'id') : [AuthStore.user?.department.id],
      section_ids:this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids ,'id') : [AuthStore.user?.section.id],
      issue_date: this.form.value.issue_date ? this._helperService.processDate(this.form.value.issue_date, 'join') : '',
      ...MasterListDocumentStore.docDetails,
      document_id:'',
      version:formData.version?formData.version:''
    }
    

    if(formData.id){

      delete saveParam.version,
      saveParam={
        ...saveParam,
        document_id:formData.id,
      }
    }
   else{

    delete saveParam.document_id

  
    }

    return saveParam

   }

   getDocumentTypes() {
    this._documentTypeService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


     // Searchig In Form Drop Down
  searchDocTypes(e,patchValue:boolean = false){
    this._documentTypeService.getItems(false,'q='+e.term).subscribe((res: DocumentTypesPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_types =  [];
            document_types.push(i);
            this.form.patchValue({ document_type_id: document_types[0] });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getResponsibleUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchResponsibleUsers(e) {
    this._usersService.searchUsers(`?q=${e.term}`).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDocumentReview() {    
    this._documentReviewFrequenciesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchDocumentReview(event) {    
    this._documentReviewFrequenciesService.getItems(false,'&q=' + event.term,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

    /**
   * Form for adding new user document type
   */
     addDocumentTypeModal() {
       
      // this.auditFindingCategoryObject.type = "add";
      this.openDocumentTypePopup=true;
      this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
      $(this.documentTypesModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr);
      // this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
      // this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
      // $(this.documentTypesModal.nativeElement).modal("show");
      // this._utilityService.detectChanges(this._cdr);
    }
  
    closeDocumentTypeModal() {
      $(this.documentTypesModal.nativeElement).modal('hide');
      this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
      this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
      $('.modal-backdrop').remove();
      this.openDocumentTypePopup=false;
      if (DocumentTypeMasterStore.lastInsertedId) {
        // this.form.patchValue({ compliance_section_ids: AuditFindingCategoryMasterStore.lastInsertedId });
        this.searchDocTypes({ term: DocumentTypeMasterStore.lastInsertedId }, true);
      }
      // AuditFindingCategoryMasterStore.lastInsertedId = null
      this._utilityService.detectChanges(this._cdr);
      // if(DocumentTypeMasterStore.lastInsertedId){
      //   this.searchDocTypes({term: DocumentTypeMasterStore.lastInsertedId},true);
      // }
      // setTimeout(() => {
      //   $(this.documentTypesModal.nativeElement).modal('hide');
      //   this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
      //   this._renderer2.setStyle(this.documentTypesModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
      //   $('.modal-backdrop').remove();
      //   $(this.documentTypesModal.nativeElement).modal('hide');
      //   this._utilityService.detectChanges(this._cdr);
      // }, 100);
    }


  // Document Upload Common Codes

  
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = true;
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = false;
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

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  deleteDocuments(doc) {
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
    this._utilityService.detectChanges(this._cdr);
  }


  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    // else
    // return this._msTypeService.getThumbnailPreview(type,token);
    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

    //getting button name by language
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }


  
onFileChange(event, type: string) {
  var selectedFiles: any[] = event.target.files;
  if (selectedFiles.length > 0) {
    var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
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
                $("#file").val('');
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
                  this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
                }, (error) => {
                  $("#file").val('');
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            this.assignFileUploadProgress(null, file, true);
            $("#file").val('');
            this._utilityService.detectChanges(this._cdr);
          })
      }
      else {
        $("#file").val('');
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
    imageDetails['preview_url'] = logo_url;
    if (imageDetails != null)
      this._mdlService.setDocument(imageDetails, type);
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

checkAcceptFileTypes(type){
  return this._imageService.getAcceptFileTypes(type); 
}

  // Check if logo is being uploaded
checkLogoIsUploading(){
  return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
}

getArrayFormatedString(items){
  return this._helperService.getArraySeperatedString(',','title',items);
}

removeDocument(token) {

  MasterListDocumentStore.unsetDocument(token);
  this._utilityService.detectChanges(this._cdr);
}

formValidationCheck(){

  if(MasterListDocumentStore.docDetails==null || MasterListDocumentStore.docDetails['is_deleted']==true)
    return true
  else
    return false
}


  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.clearFIleUploadPopupData();
    // MasterListDocumentStore.clearDocument();
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  
  // for closing the modal
  closeFormModal(documentId?){
    this.resetForm();
    this._eventEmitterService.dismissMasterListDocumentAddModal(documentId);
  }

  ngOnDestroy(){
   this.resetForm();
    MasterListDocumentStore.clearDocument();
  }

}
