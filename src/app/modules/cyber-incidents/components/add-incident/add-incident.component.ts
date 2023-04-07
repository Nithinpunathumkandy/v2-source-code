import { Component, OnInit, Input, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CyberIncidentClassificationMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-classification-store';
import { CyberIncidentClassificationService } from 'src/app/core/services/masters/cyber-incident/cyber-incident-classification/cyber-incident-classification.service';
import { CyberIncidentStatusMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-status-store';
import { CyberIncidentService } from 'src/app/core/services/cyber-incident/cyber-incident.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.scss']
})
export class AddIncidentComponent implements OnInit {

  @Input('source') Source: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  AppStore = AppStore;
  UsersStore = UsersStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  CyberIncidentClassificationMasterStore=CyberIncidentClassificationMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  CyberIncidentStatusMasterStore=CyberIncidentStatusMasterStore;
  AssetRegisterStore = AssetRegisterStore;
  CyberIncidentStore=CyberIncidentStore;
  openModelPopup: boolean = false;
  AuthStore=AuthStore;
  formErrors: any;
  form: FormGroup;
  impactList = [];
  fileUploadPopupSubscriptionEvent: any;
  organisationChangesModalSubscription: any = null;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _fileUploadPopupService: FileUploadPopupService,
    private _documentFileService: DocumentFileService,
    private _cyberIncidentClassificationService: CyberIncidentClassificationService,
    private _cyberIncidentService:CyberIncidentService,
    private _assetRegisterService: AssetRegisterService,
    private _router: Router,
    //private _cyberIncidentStatusService: CyberIncidentStatusService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    })
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    if(this.Source.type=='Edit')
    {
      this.setEditValues();
    }
    else
    {
      this.setInitialOrganizationLevels();
    }
    this.getAssests()
  }
  setEditValues()
  {
    this.form.patchValue({
      id:this.Source.values.id,
      title:this.Source.values.title,
      technical_description:this.Source.values.details_of_the_incident,
      occured_date:new Date(this.Source.values.occurred),
      detected_date:new Date(this.Source.values.detected),
      information_involved:this.Source.values.asset,
      classification:this.Source.values.cyber_incident_classification.id,
      repoting_user_id:this.Source.values.reporting_user,
      organization_ids: this.Source.values.organizations,
      division_ids: this.Source.values.divisions,
      department_ids: this.Source.values.departments,
      section_ids: this.Source.values.sections,
      sub_section_ids: this.Source.values.sub_sections,

    })
    this.getCyberClassification({term:this.Source.values.cyber_incident_classification.id})
    if(this.Source.values.cyber_incident_impacts.length)
    {
      for(let i of this.Source.values.cyber_incident_impacts)
      {
        this.impactList.push({id:i.id,title:i.title})
      }
    }
    if(this.Source.values.documents.length)
    {
      this.setDocuments(this.Source.values.documents);
    }
  }
  initForm() {
    this.form = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(500)]],
      technical_description: [''],
      impact: [''],
      occured_date: [null, [Validators.required]],
      detected_date: [null,[Validators.required]],
      information_involved:[[],[Validators.required]],
      classification:[null,[Validators.required]],
      repoting_user_id: [[], [Validators.required]],
      organization_ids: [[], []],
      division_ids: [[]],
      department_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
    });
  }

  closeFormModal() {
    this.form.reset();
    this.formErrors = null;
    this.unsetFields();
    this._eventEmitterService.dismissCyberIncidentAddModal();
  }

  setInitialOrganizationLevels() {
    this.form.patchValue({
      section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
      organization_ids: AuthStore?.user?.organization ? [AuthStore?.user?.organization] : [],
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
    });
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
      if(JSON.stringify(data.department_ids)!=JSON.stringify(this.form.value.department_ids))
      {
        this.form.patchValue({
          repoting_user_id:[]
        })
      }
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids: data.department_ids ? data.department_ids : [],
        section_ids: data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : [],
      })
    }
    //console.log(this.form.value.department_ids)
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  clear(type) {
    if (type == 'start_date') {
      this.form.patchValue({
        start_date: null
      })
    }
    else {
      this.form.patchValue({
        end_date: null
      })
    }

  }

  getCyberClassification(event?) {
    let params='';
    if(event)params='?q='+event.term
    this._cyberIncidentClassificationService.getItems(false,params,false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getAssests(event?) {
    let params='';
    if(event)
    {
      params='?q='+event.term;
    }
    this._assetRegisterService.getItems(false,params).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
   
  }

  addImpact() {
    if (this.form.value.impact) {
      this.impactList.push({title:this.form.value.impact,is_new:true});
    }
    this.form.patchValue({
      impact: null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeImpact(index) {
    if(!this.impactList[index].id)
    {
      this.impactList.splice(index, 1);
    }
    else{
      this.impactList[index].is_delete=true;
    }
    
  }

  getUsers() {
    let params:any;
     params=`?department_ids=${this.form.value.department_ids.length ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id]}`;
     console.log(params)
    this._usersService.getAllItems(params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {
    let params:any;
    params=`?department_ids=${this.form.value.department_ids.length ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id]}`;
    this._usersService.searchUsers(params+'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
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
      if (search) isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  //   **************** File Upload Area  Start ********************************
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
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

  setDocuments(documents) {
    let khDocuments = [];
    documents.forEach(element => {

      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {

          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title: element?.kh_document.title,
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
        var purl = this._cyberIncidentService.getThumbnailPreview('cyber_incident', element.token)
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

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
    // return this._organizationFileService.getThumbnailPreview(type,token);

  }


  removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }
  //   **************** File Upload Area  End ********************************
  processSaveData() {
    let saveData={};
    if(this.Source.type=='Add')
    {
      saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    }
    else
    {
      saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    }
    saveData['occurred'] = this._helperService.passSaveFormatDate(this.form.value.occured_date);
    saveData['detected'] = this._helperService.passSaveFormatDate(this.form.value.detected_date);
    saveData['reporting_user_ids']= this.form.value.repoting_user_id.length?this.getById(this.form.value.repoting_user_id):[],
    saveData['asset_ids']=this.form.value.information_involved.length?this.getById(this.form.value.information_involved):[]
    saveData['cyber_incident_classification_id'] = this.form.value.classification;
    saveData['cyber_incident_impacts']=this.impactList.length?this.impactList:[],
    saveData['title']=this.form.value.title,
    saveData['details_of_the_incident']=this.form.value.technical_description,
    saveData['division_ids'] = this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids, 'id') : [AuthStore.user?.division.id];
    saveData['department_ids'] = this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids, 'id') : [AuthStore.user?.department.id];
    saveData['section_ids'] = this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids, 'id') : [AuthStore.user?.section.id];
    saveData['sub_section_ids'] = this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids, 'id') : [AuthStore.user?.sub_section.id];
    return saveData;
  }

  getById(data)
  {
    let item=[];
    for(let i of data)
    {
      item.push(i.id);
    }
    return item;
  }

  unsetFields()
  {
    this.impactList=[];
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  save(close: boolean = false) {
    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._cyberIncidentService.updateItem(this.form.value.id, this.processSaveData());
    } else {
      save = this._cyberIncidentService.saveItem(this.processSaveData());
    }
    save.subscribe((res: any) => {
      CyberIncidentStore.lastInsertedId = res['id'];
      AppStore.disableLoading();
      // this._utilityService.detectChanges(this._cdr);
      if (!this.form.value.id) {
        this.form.reset();
        this.unsetFields();
      }
      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        // this._utilityService.detectChanges(this._cdr);
        if (close) {
          this.closeFormModal();
          this._router.navigateByUrl('/cyber-incident/cyber-incidents/'+CyberIncidentStore.lastInsertedId);
         // this._router.navigateByUrl('/business-assessments/maturity-models/'+MaturityModalStore.lastInsertedId)
        }
        
      }, 300);

    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

}
