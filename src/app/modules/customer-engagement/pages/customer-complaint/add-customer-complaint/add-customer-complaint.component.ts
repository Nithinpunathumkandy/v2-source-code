import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { CustomerCompliantTypeService } from 'src/app/core/services/masters/customer-engagement/customer-compliant-type/customer-compliant-type.service';
import { CustomerTypeMasterStore } from 'src/app/stores/masters/customer-engagement/customer-compliant-type-store';
import { OrganizationCustomersService } from 'src/app/core/services/organization/business_profile/organization-customers/organization-customers.service';
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { Router } from '@angular/router';
import { CustomerComplaintSourceMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-source-store';
import { CustomerComplaintSourceService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-source/customer-complaint-source.service';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { CustomerEngagementFileServiceService } from 'src/app/core/services/customer-satisfaction/customer-engagement-file-service/customer-engagement-file-service.service';

declare var $:any;
@Component({
  selector: 'app-add-customer-complaint',
  templateUrl: './add-customer-complaint.component.html',
  styleUrls: ['./add-customer-complaint.component.scss']
})
export class AddCustomerComplaintComponent implements OnInit {
  @Input('source') customerComplaintObjectSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('addCustomer') addCustomer: ElementRef; 
  @ViewChild('addComplianceSource') addComplianceSource: ElementRef;

  form: FormGroup;
  formErrors: any;
  fileUploadsArray = []; // for multiple file uploads
  non_conformity = [
    { title: "Yes", type: "yes",id: 1},
    { title: "No", type: "no", id: 2}
  ]

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CustomerComplaintStore = CustomerComplaintStore;
  CustomerTypeMasterStore = CustomerTypeMasterStore;
  BusinessCustomersStore = BusinessCustomersStore;
  CustomerComplaintSourceMasterStore = CustomerComplaintSourceMasterStore;
  UsersStore = UsersStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  controlCustomerComplaintSourceSubscriptionEvent:any =null;
  customersSubscriptionEvent:any = null;
  fileUploadPopupSubscriptionEvent: any = null;
  openModelPopup: boolean 
  organisationChangesModalSubscription: any = null;

  openComplianceSource : boolean = false;

  customerComplaintSourceObject = {
		component: 'Master',
		values: null,
		type: null
	};

  customerObject = {
		values: null,
		type: null
	};

  todayDate: any = new Date();
  currentDate : any;
  constructor(
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _fileUploadPopupService: FileUploadPopupService,
    private _userService:UsersService,
    private _imageService:ImageServiceService,
    private _customerTypeService: CustomerCompliantTypeService,
    private _organizationCustomerService: OrganizationCustomersService,
    private _customerComplaintService: CustomerComplaintService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _eventEmeitterService: EventEmitterService,
    private _router: Router,
    private _customerComplaintSourceService: CustomerComplaintSourceService,
    private _fileService: CustomerEngagementFileServiceService
  ) { }

  ngOnInit(): void {
    OrganizationalSettingsStore.isMultiple = false;
    OrganizationalSettingsStore.showBranch = true;
    this.form = this._formBuilder.group({
      id: [''],
      customer_complaint_type_id:[[],[Validators.required]],
      title:['',[Validators.required]],
      organization_ids: [null, [Validators.required]],
      division_ids: [[]],
      department_ids: [[], [Validators.required]],
      section_ids: [[]],
      customer_complaint_source_id: [null,[Validators.required]],
      sub_section_ids: [[]],
      branch_ids:[[]],
      responsible_user_id: [[], [Validators.required]],  
      is_non_conformity:[null],
      description: [''],
      receiving_date: ['',[Validators.required]],
      customer_id: [[],[Validators.required]],
      documents : [],
    });
    
    
    this.resetForm();
    if (this.customerComplaintObjectSource.type == 'Edit') {
      this.setFormValues()
    }
    else{
      this.form.patchValue({
        receiving_date: this._helperService.getTodaysDateObject(),
      })
      this.setInitialOrganizationLevels();
    }

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.organisationChangesModalSubscription = this._eventEmeitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );

    // for closing the modal
		this.controlCustomerComplaintSourceSubscriptionEvent = this._eventEmitterService.CustomerComplaintSource.subscribe(res => {
			this.closeComplianceSourceAddModal();
		})

    this.customersSubscriptionEvent = this._eventEmitterService.customers.subscribe((res:any)=>{
      this.closeCustomerAddModal();
      // this._router.navigateByUrl('/customer-engagement/customer/' + res?.id); //navigate|customers
    })

    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
      this.form.controls['division_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
      this.form.controls['section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
      this.form.controls['sub_section_ids'].setValidators(Validators.required);
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
      this.form.controls['branch_ids'].setValidators(Validators.required);
  }

  ngDoCheck(){
    if (this.customerComplaintObjectSource && this.customerComplaintObjectSource.hasOwnProperty('values') && this.customerComplaintObjectSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){   
    this.formErrors = null;
    this.resetForm();
    this.form.patchValue({  
      id: this.customerComplaintObjectSource.values.id,
      title: this.customerComplaintObjectSource.values.title ? this.customerComplaintObjectSource.values.title : '',
      customer_id: this.customerComplaintObjectSource.values.customer?.id ? this.customerComplaintObjectSource.values.customer?.id : '',
      customer_complaint_type_id: this.customerComplaintObjectSource.values.customer_complaint_type?.id ? this.customerComplaintObjectSource.values.customer_complaint_type?.id : '',
      customer_complaint_source_id: this.customerComplaintObjectSource.values.customer_complaint_source_id ? this.customerComplaintObjectSource.values.customer_complaint_source_id : '',
      responsible_user_id: this.customerComplaintObjectSource.values.responsible_user_id ? this.customerComplaintObjectSource.values.responsible_user_id : '',
      is_non_conformity: this.customerComplaintObjectSource.values.is_non_conformity==1 ? 'yes' : 'no',
      receiving_date: this.customerComplaintObjectSource.values.receiving_date? this._helperService.processDate(this.customerComplaintObjectSource.values.receiving_date, 'split'):'',
      description: this.customerComplaintObjectSource.values.description? this.customerComplaintObjectSource.values.description : '',
      organization_ids:this.customerComplaintObjectSource.values.organization ? this.customerComplaintObjectSource.values.organization : null,
      division_ids:this.customerComplaintObjectSource.values.division ? this.customerComplaintObjectSource.values.division : null,
      department_ids:this.customerComplaintObjectSource.values.department ? this.customerComplaintObjectSource.values.department : null,
      section_ids:this.customerComplaintObjectSource.values.section ? this.customerComplaintObjectSource.values.section : null,
      sub_section_ids:this.customerComplaintObjectSource.values.sub_section ? this.customerComplaintObjectSource.values.sub_section : null,
      branch_ids:this.customerComplaintObjectSource.values.branch ? this.customerComplaintObjectSource.values.branch : null, 
    })
    if (this.customerComplaintObjectSource.values.documents.length > 0) {
      this.setDocuments(this.customerComplaintObjectSource.values.documents);
    }
    this.searchCustomerType({ term: this.customerComplaintObjectSource.values.customer_complaint_type?.id});
    this.searchCustomer({term: this.customerComplaintObjectSource.values.customer?.id })
    this._utilityService.detectChanges(this._cdr);
  }

  setDocuments(documents) { 
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document?.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
  
        });
      }
      else {
        if (element && element.token) {
          var purl = this._fileService.getThumbnailPreview('customer-complaint-document', element.token);
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

  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      branch_ids: AuthStore?.user?.branch ? AuthStore?.user?.branch : null,
      division_ids: AuthStore?.user?.division ? AuthStore?.user?.division : null,
      department_ids:AuthStore?.user?.department ? AuthStore?.user?.department : null,
      section_ids:AuthStore?.user?.section ? AuthStore?.user?.section : null,
      sub_section_ids: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section :  null,
      organization_ids: AuthStore.user?.organization ? AuthStore.user?.organization : null
    });
    this._utilityService.detectChanges(this._cdr);
  }

   // Returns todays date for ngbDate Pickeer
   getTodaysDateObject(){ 
    return this._helperService.getTodaysDateObject();
  }

  getCustomer(){
    this._organizationCustomerService.getItems(false,null,true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCustomer(e,patchValue:boolean=false){
    this._organizationCustomerService.getItems(false,'q=' + e.term).subscribe(res => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ customer_id: i.id });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getComplianceSource() {
    this._customerComplaintSourceService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getCustomerType(){
    this._customerTypeService.getItems(false,null,true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchCustomerType(e) {
    this._customerTypeService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchComplianceSource(e,patchValue:boolean=false) {
    this._customerComplaintSourceService.getItems(false,'&q=' + e.term).subscribe(res => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ customer_complaint_source_id: i });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

// getting Responsible user
getResponsibleUsers() {
  this._userService.getAllItems().subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  });
}

// search users
searchUsers(e) {
  this._userService.searchUsers('?q=' + e.term).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
}

customSearchFn(term: string, item: any) {
  term = term.toLowerCase();
  // Creating and array of space saperated term and removinf the empty values using filter
  let splitTerm = term.split(' ').filter(t => t);
  let isWordThere = [];
  // Pushing True/False if match is found
  splitTerm.forEach(arr_term => {
    item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
    let search = item['searchLabel'].toLowerCase();
    if(search) isWordThere.push(search.indexOf(arr_term) != -1);
  });

  const all_words = (this_word) => this_word;
  // Every method will return true if all values are true in isWordThere.
  return isWordThere.every(all_words);
}
 

createImagePreview(type,token){
  return this._imageService.getThumbnailPreview(type,token)
}
// Returns default image url
getDefaultImage() {
  return this._imageService.getDefaultImageUrl('user-logo');
}

getStringsFormatted(stringArray,characterLength,seperator){
  return this._helperService.getFormattedName(stringArray,characterLength,seperator);
}


// extension check function
checkExtension(ext, extType) {
  return this._imageService.checkFileExtensions(ext, extType)
}

clearFIleUploadPopupData() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearSystemFiles();
}

  // cancel modal
cancel() {
  this.closeFormModal();
}

// for closing the modal
closeFormModal() {
  this._eventEmitterService.dismissCustomerComplaintModal();
  this.resetForm();
}

// for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  this.clearFIleUploadPopupData();
  AppStore.disableLoading();
}

processDataForSave() {
  let saveData = {
    id: this.form.value.id ? this.form.value.id : '',
    title: this.form.value.title ? this.form.value.title : '',
    customer_complaint_type_id: this.form.value.customer_complaint_type_id ? this.form.value.customer_complaint_type_id: null,
    responsible_user_id: this.form.value.responsible_user_id ? this.form.value.responsible_user_id.id : null,
    customer_complaint_source_id: this.form.value.customer_complaint_source_id ? this.form.value.customer_complaint_source_id.id : null,
    description: this.form.value.description? this.form.value.description : '',
    receiving_date: this.form.value.receiving_date ? this._helperService.processDate(this.form.value.receiving_date, 'join') : '',
    customer_id:this.form.value.customer_id ? this.form.value.customer_id : null,
    organization_id:this.form.value.organization_ids ? this.form.value.organization_ids.id : null,
    division_id:this.form.value.division_ids ? this.form.value.division_ids.id : null,
    department_id:this.form.value.department_ids ? this.form.value.department_ids.id : null,
    section_id:this.form.value.section_ids ? this.form.value.section_ids.id : null,
    sub_section_id:this.form.value.sub_section_ids ? this.form.value.sub_section_ids.id : null, 
    branch_id:this.form.value.branch_ids ? this.form.value.branch_ids.id : null,  
    is_non_conformity: this.form.value.is_non_conformity=='yes' ? true : false
  };
  if(this.form.value.id){
    saveData['documents']=this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile)
  }else
   saveData['documents']=this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
  if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    delete saveData.division_id;
  if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    delete saveData.section_id;
  if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    delete saveData.sub_section_id;
  if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch)
    delete saveData.branch_id;
  return saveData;
}

  // * File Upload/Attach Modal
  openFileUploadModal() {
    setTimeout(() => {
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

  createImageUrl(type, token) {
    if(type=='document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    else
      return this._fileService.getThumbnailPreview(type,token);
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._customerComplaintService.updateCustomerComplaint(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        save = this._customerComplaintService.saveCustomerComplaint(this.processDataForSave());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
          CustomerComplaintStore.clearDocumentDetails();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close){
          this.closeFormModal();
          CustomerComplaintStore.clearDocumentDetails();
          this._router.navigateByUrl('/customer-engagement/complaint/'+ res.id +'/info');
        } 
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this.processFormErrors();
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

processFormErrors(){
  var errors = this.formErrors;
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      if(key.startsWith('customer_complaint_type_id.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['customer_complaint_type_id'] = this.formErrors['customer_complaint_type_id']? this.formErrors['customer_complaint_type_id'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('customer_id.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['customer_id'] = this.formErrors['customer_id']? this.formErrors['customer_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('is_non_conformity.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['is_non_conformity'] = this.formErrors['is_non_conformity']? this.formErrors['is_non_conformity'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('organization_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['organization_ids'] = this.formErrors['organization_ids']? this.formErrors['organization_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('branch_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['branch_ids'] = this.formErrors['branch_ids']? this.formErrors['branch_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
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


organisationChanges() {
  OrganizationalSettingsStore.isMultiple = false;
  this.openModelPopup = true;
  this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

closeModal(data?) {
  if(data){
    this.form.patchValue({
      branch_ids: data.branch_ids ? data.branch_ids : [],
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

customerAdd(){
  this.customerObject.type = 'Add';
  this._renderer2.addClass(this.addCustomer.nativeElement,'show');
  this._renderer2.setStyle(this.addCustomer.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.addCustomer.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

closeCustomerAddModal(){
  this.customerObject.type = null;
  this._renderer2.removeClass(this.addCustomer.nativeElement,'show');
  this._renderer2.setStyle(this.addCustomer.nativeElement,'z-index','9999');
  this._renderer2.setStyle(this.addCustomer.nativeElement,'display','none');
  if (CustomersStore.lastInsertedCustomers) {
    this.searchCustomer({term: CustomersStore.lastInsertedCustomers},true);
  }
  CustomersStore.lastInsertedCustomers = null;

}

complianceSourceAdd(){
  this.openComplianceSource = true;
  this.customerComplaintSourceObject.type = 'Add';
  this._renderer2.addClass(this.addComplianceSource.nativeElement,'show');
  this._renderer2.setStyle(this.addComplianceSource.nativeElement,'z-index','99999');
  this._renderer2.setStyle(this.addComplianceSource.nativeElement,'display','block');
  this._utilityService.detectChanges(this._cdr);
}

closeComplianceSourceAddModal(){
  this.openComplianceSource = false;
  this.customerComplaintSourceObject.type = null;
  this._renderer2.removeClass(this.addComplianceSource.nativeElement,'show');
  this._renderer2.setStyle(this.addComplianceSource.nativeElement,'z-index','9999');
  this._renderer2.setStyle(this.addComplianceSource.nativeElement,'display','none');
  if (CustomerComplaintSourceMasterStore.lastInsertedId) {
    this.searchComplianceSource({term: CustomerComplaintSourceMasterStore.lastInsertedId},true);
  }
  CustomerComplaintSourceMasterStore.lastInsertedId = null;

}

getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

 /**
   * Deletes a brochure
   * @param token Token of brochure
   */
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

  ngOnDestroy(){
    this.organisationChangesModalSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.customersSubscriptionEvent.unsubscribe();
    this.controlCustomerComplaintSourceSubscriptionEvent.unsubscribe();
  }
}
