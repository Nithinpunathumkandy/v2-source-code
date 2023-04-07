import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessRiskService } from 'src/app/core/services/bpm/process/process-risk/process-risk.service';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { AuditChecklistGroupService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-cheklist-group/ms-audit-cheklist-group.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';
import { MsAuditDocumetsVersionStore } from 'src/app/stores/ms-audit-management/ms-audit-documets-version/ms-audit-version-documents.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
import { MsAuditCategoryService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
declare var $: any;

@Component({
  selector: 'app-add-check-list',
  templateUrl: './add-check-list.component.html',
  styleUrls: ['./add-check-list.component.scss']
})
export class AddCheckListComponent implements OnInit {
  @Input('source') MsAuditCheckListSource: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('auditCategoryModal', { static: false }) auditCategoryModal: ElementRef;

  fileUploadPopupStore = fileUploadPopupStore;
  MsAuditDocumetsVersionStore = MsAuditDocumetsVersionStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ProcessStore = ProcessStore;
  AppStore = AppStore
  AuditChecklistGroupMasterStore = AuditChecklistGroupMasterStore;
  MsAuditCategoryMasterStore=MsAuditCategoryMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  LanguageSettingsStore=LanguageSettingsStore;
  MsAuditSchedulesStore=MsAuditSchedulesStore;
  form: FormGroup;
  formErrors: any;
  q = 1
  processList = [
    {id : 1, title: 'process1'},
    {id : 2, title: 'process2'}
  ]

  cheklistGroupObject = {
    component: 'Master',
    values: null,
    type: null
  };

  msAuditCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  formNgModal = [];
  selectedLanguageId = null;

  emptyTier = 'No data found'
  selectedIndex: any = null;
  selectedMsTypePos: any = 0;
  fileUploadPopupSubscriptionEvent: any;
  selectedDocuments: any=[];
  controlCheklistgroupSubscriptionEvent: any;
  config: { currentPage: number; itemsPerPage: number; };
  emptyMessage: any = 'No data found';
  msAuditCategorySubscriptionEvent:any;



  constructor(    
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _documentFileService: DocumentFileService,
    private _helperService: HelperServiceService,
    private _processService: ProcessService,
    private _msAuditCategoryService: MsAuditCategoryService,
    private _auditChecklistGroupService: AuditChecklistGroupService,
    private _msAuditCheckListService : MsAuditCheckListService,
    private _departmentService: DepartmentService,
    private _fileUploadPopupService: FileUploadPopupService) { 
      this.config = {
        currentPage: 1,
        itemsPerPage: 5
  };
    }

  ngOnInit(): void {
    this.initializeFormNgModal();
    this.form = this._formBuilder.group({
      id: [''],
      // title: ['', [Validators.required, Validators.maxLength(255)]],
      //title: [null,[Validators.required]],
      // question: ['',[Validators.required]],
      process: null,
      // checklist_group_id : [null,[Validators.required]],
      ms_audit_category_id:[null,[Validators.required]],
      department_ids:[[],[Validators.required]],
      image: null


    });

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.controlCheklistgroupSubscriptionEvent = this._eventEmitterService.msAuditCheklistGroup.subscribe(res => {
      this.closeFormModal();
    })

    this.msAuditCategorySubscriptionEvent = this._eventEmitterService.msAuditCategory.subscribe(res=>{
      this.closeAuditCategoryModal();
    })

    if(this.MsAuditCheckListSource.type == 'Edit' && this.MsAuditCheckListSource.component=='master-audit'){
      this.setEditData()
    }else
    {
      this.setData()
    }
    
    this.getCheckGroupList()
    this.getMsDocumentVersionsList();
    this.getProcess();
    
  }

  ngDoCheck(){
    if(!this.selectedLanguageId)
    {
      this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
      this._utilityService.detectChanges(this._cdr);
    }
      
  }

  setData(){
    if(this.MsAuditCheckListSource.component=='audit' ){
      this.searchChecklistGroup({term:'General'})
     
    }
    this.form.patchValue({
      ms_audit_category_id:this.MsAuditCheckListSource.values
    })
  }

  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  initializeFormNgModal(){
    for(let i of LanguageSettingsStore.activeLanguages){
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', id: '', error: null});
    }

    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  }

   // clicking language
   clickLanguage(id)
   {
     this.selectedLanguageId = id;
     
   }

  searchDepartment(event) {
    this._departmentService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getAuditCategory() {
    let params=''
    this._msAuditCategoryService.getItems(false,params,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getCheckGroupList(){
    this._auditChecklistGroupService.getItems(false, null, true).subscribe((res) => {
      // if(this.MsAuditCheckListSource.component=='audit'){
        let pos = AuditChecklistGroupMasterStore.auditChecklistGroup.findIndex(e=>e.title == 'General')
        // if(this.MsAuditCheckListSource.component=='master-audit' && pos != -1){
          
        // }
        if(this.MsAuditCheckListSource.component=='audit'){
          this.form.patchValue({
            //checklist_group_id :this.MsAuditCheckListSource,
            ms_audit_category_id:this.MsAuditCheckListSource?.values?.audit_plan_details?.ms_audit_program?.ms_audit_category_id,
            department_ids:this.getByIdObject(this.MsAuditCheckListSource?.values?.department)

          })
        }
        AuditChecklistGroupMasterStore.auditChecklistGroup.splice(pos,1) 
        this.searchAuditCategory({term:this.MsAuditCheckListSource?.values?.audit_plan_details?.ms_audit_program?.ms_audit_category_id},true)
      // }
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)

    });
    

  }

  getByIdObject(data)
  {
    let item=[];
    item.push(data);
    return item;
  }

  searchChecklistGroup(e,patchValue:boolean = false) {
    this._auditChecklistGroupService.getItems(false,'&q=' + e.term).subscribe(res => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ checklist_group_id: i.id });
            break;
          }
        }
      }
      let pos = AuditChecklistGroupMasterStore.auditChecklistGroup.findIndex(e=>e.title == 'General')
      // if(this.MsAuditCheckListSource.component=='master-audit' && pos != -1){
        
      // }
      AuditChecklistGroupMasterStore.auditChecklistGroup.splice(pos,1) 
      // if(this.MsAuditCheckListSource.component=='audit'){
      //   this.form.patchValue({
      //     checklist_group_id : AuditChecklistGroupMasterStore.auditChecklistGroup[pos].id
      //   })
      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAuditCategory(e,patchValue:boolean = false) {
    this._msAuditCategoryService.getItems(false,'&q=' + e.term).subscribe(res => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ ms_audit_category_id: i.id });
            break;
          }
        }
      }
      // let pos = MsAuditCategoryMasterStore.msAuditCategorys.findIndex(e=>e.title == 'General')
     
      //   this.form.patchValue({
      //     ms_audit_category_id : MsAuditCategoryMasterStore?.msAuditCategorys[pos]?.id
      //   })
  
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setEditData(){
   //console.log(this.MsAuditCheckListSource.values.ms_audit_category.language[0].pivot.ms_audit_category_id );
    if(this.MsAuditCheckListSource.values){
      //this.searchChecklistGroup({term :this.MsAuditCheckListSource?.values.checklist_group?.id ? this.MsAuditCheckListSource?.values.checklist_group?.id : ''})
      this.searchAuditCategory({term :this.MsAuditCheckListSource.values.ms_audit_category.language[0] ? this.MsAuditCheckListSource?.values.ms_audit_category?.language[0].pivot.ms_audit_category_id : ''},true)
      this.form.patchValue({
        id : this.MsAuditCheckListSource.values.id ? this.MsAuditCheckListSource.values.id : null,
        checklist_group_id: this.MsAuditCheckListSource.values.checklist_group ? this.MsAuditCheckListSource.values.checklist_group.id :null,
        //title: this.MsAuditCheckListSource.values.title ? this.MsAuditCheckListSource.values.title : '',
        process: this.MsAuditCheckListSource.values.processes ? this.MsAuditCheckListSource.values.processes[0]?.id :null,
        department_ids:this.MsAuditCheckListSource.values.departments ? this.MsAuditCheckListSource.values.departments :[],
        ms_audit_category_id:this.MsAuditCheckListSource.values.ms_audit_category.language[0].pivot.ms_audit_category_id ? this.MsAuditCheckListSource.values.ms_audit_category.language[0].pivot.ms_audit_category_id : null,
      })
      var checkListDocumentDetails = this.MsAuditCheckListSource.values.documents ? this.MsAuditCheckListSource.values.documents : [];
      if(checkListDocumentDetails.length > 0){
        this.setDocuments(checkListDocumentDetails)
      }
      if(this.MsAuditCheckListSource.values.title && this.MsAuditCheckListSource.values.title.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.event_type_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
     this.setSeleCtedDocumentsVersions()   
    }
    console.log(this.form.value.ms_audit_category_id);
    this._utilityService.detectChanges(this._cdr);
  }

  getValuesForEdit(id: number){
    let languageValues = this.MsAuditCheckListSource.values.title.find(e=> e.id == id);
    return languageValues;
  }
  setSeleCtedDocumentsVersions(){
    let documentVersionData = this.MsAuditCheckListSource.values.document_version_contents ? this.MsAuditCheckListSource.values.document_version_contents : []
    if (documentVersionData.length > 0){
      for(let data of documentVersionData){
        this.changeDocumetVersion(data);
        MsAuditDocumetsVersionStore.checkSelectedStatus(data)
      }
    }
   
  }
  setDocuments(documents){
    let khDocuments = [];

    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
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
          var purl = this._msAuditCheckListService.getThumbnailPreview('check-list', element.token)
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

  changeDocumetVersion(data){
     MsAuditDocumetsVersionStore.setSelectedDocuments(data);
     if(data?.children_content?.length > 0){
      data?.children_content.forEach(element => {
        if(element.children?.length > 0){
          element.children.forEach(innerElement => {
            MsAuditDocumetsVersionStore.setSelectedDocuments(innerElement)
            this.innerDataLoop(innerElement)
          });
        }
        MsAuditDocumetsVersionStore.setSelectedDocuments(element) 
       });
     }
  }

  innerDataLoop(element){
    if(element?.children?.length ){
      element.children.forEach(innerElement => {
        MsAuditDocumetsVersionStore.setSelectedDocuments(innerElement)
      });
    }
  }

  checkSelectedStatus(data) {
   this.MsAuditCheckListSource.checkSelectedStatus
   
  }

  selectedIndexChange(index){
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  selectedmsType(pos,id){
    this.selectedMsTypePos = pos;
    this.getMsDocumentVersionDetails(id)
    // ProjectMonitoringStore.setFocusAreaId(id)
    // this.getObjectives(this.selectedFocusAreaId);
    this._utilityService.detectChanges(this._cdr);
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

  // * File Upload/Attach Modal

  openFileUploadModal(id) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      fileUploadPopupStore.verificationId=id
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

    // this.clearFIleUploadPopupData()
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
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
      // return this._eventClosureService.getThumbnailPreview(type, token);

  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  getNoDataSource(type){

    let noDataSource = {

      noData: this.emptyMessage, border: false, imageAlign: type

    }

    return noDataSource;

  }

  getMsDocumentVersionsList(){
    let params = ''
    params = '?is_ms_type=true&is_not_master_document_list&is_all=true&is_standard=true'
    this._msAuditCheckListService.getMsDocumentVersionItems(true,params,true).subscribe(res=>{
      if(res.data){
        let version_id = res['data'][0]?.document_version_id;
        if(version_id)
        {
          this.getMsDocumentVersionDetails(version_id)
        }
        
      }
      else
      {
        let version_id = res[0]?.document_version_id
        if(version_id)
        {
          this.getMsDocumentVersionDetails(version_id)
        }
      }
      
      this._utilityService.detectChanges(this._cdr)
    })
  }

  // mstype document version details
  getMsDocumentVersionDetails(id){
    MsAuditDocumetsVersionStore.individualLoaded = false;
    this._msAuditCheckListService.getDocumentVersionContents(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }


//  to get process list
  getProcess(){
    this._processService.getAllItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

 //getting button name by language
 getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
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

processDataForSave(){
  let saveData = {
    //ms_audit_schedule_id : MsAuditSchedulesStore?.msAuditSchedulesId,
    //checklist_group_id : this.form.value.checklist_group_id ? this.form.value.checklist_group_id : '',
    ms_audit_category_id : this.form.value.ms_audit_category_id ? this.form.value.ms_audit_category_id : '',
    department_ids: this.form.value.department_ids ? this.getById(this.form.value.department_ids) : '',
    ///title : this.form.value.title ? this.form.value.title : '',
    // question:this.form.value.question ? this.form.value.question : '',
   // process_ids : this.form.value.process ? [this.form.value.process] : [],
    document_version_content_ids : MsAuditDocumetsVersionStore.selectedDocuments ? MsAuditDocumetsVersionStore.selectedDocuments : [],
    documents : [],
    languages:this.createSaveData().languages.length?this.createSaveData().languages:[]
  }
  
  // if(this.MsAuditCheckListSource.component=='master-audit'){
  //   delete saveData.ms_audit_schedule_id;
  // }
  if (this.MsAuditCheckListSource.type == 'Edit') {
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
  } else{
    saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    
  }
  return saveData
}

createSaveData(){
  var returnData = {
    languages: []
  }
  var formData = this.getDataPresent();
  for(let i of formData){
    delete i.language_title;
    delete i.error;
  }
  returnData.languages = formData;
return returnData;
}

save(close: boolean = false) {
  let save;
  AppStore.enableLoading();
  //console.log(this.processDataForSave())
  if (this.MsAuditCheckListSource.type == 'Edit') {
     save = this._msAuditCheckListService.updateCheckList(this.processDataForSave(),this.MsAuditCheckListSource.values.id);
  } else {
    // delete this.form.value.id
    save = this._msAuditCheckListService.saveCheckList(this.processDataForSave());
  }

  save.subscribe((res: any) => {
    if (this.MsAuditCheckListSource.type != 'Edit') {
      this.resetForm();
    }
    this.resetForm();
    AppStore.disableLoading();
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 500);
    this.getMsDocumentVersionsList();
    if (close){
      MsAuditDocumetsVersionStore.individualLoaded = false;
      this.cancel();
    } 
  }, (err: HttpErrorResponse) => {
    if (err.status == 422) {
      this.formErrors = err.error.errors;
      //this.processFormErrors();
    }
    else if (err.status == 500 || err.status == 403) {
      this.cancel();
    }
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);

  });

}

clearFormNgModalError(){
  for(let i of this.formNgModal){
    i.error = null;
  }
}

// processFormErrors(){
//   var formData = this.getDataPresent();
//   var errors = this.formErrors.errors;
//   for (var key in errors) {
//     if (errors.hasOwnProperty(key)) {
//         if(key.includes('languages') && key.includes('title')){
//           let keyValueSplit = key.split('.');
//           let errorPosition = keyValueSplit[1];
//           let languageId = formData[errorPosition].language_id;
//           var formModalPosition = this.formNgModal.findIndex(e=>e.language_id == languageId);
//           this.formNgModal[formModalPosition].error = errors[key];
//           this.clickLanguage(this.formNgModal[formModalPosition].language_id);
//         }
//     }
//   }
//   this._utilityService.detectChanges(this._cdr);
// }

cancel(){
  this.resetForm();
  this.selectedLanguageId = null;
  this._eventEmitterService.dismissAuditCheckListModal()
}

clearCommonFilePopupDocuments() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearUpdateFiles();
}

 // for resetting the form
 resetForm() {
  //this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  this.selectedIndex = null;
  this.selectedMsTypePos = 0;
  this.selectedDocuments = [];
  this.MsAuditDocumetsVersionStore.selectedDocuments = []
  this.clearCommonFilePopupDocuments();
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.error = null;
  }
  this.form.patchValue({
    id: [''],
    process: null,
   //ms_audit_category_id:[null,[Validators.required]],
    department_ids:[],
    image: null
  })
  this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  AppStore.disableLoading();

}

checkFormValid(){
  var formData = this.getDataPresent();
  if(formData.length > 0) return true;
  else return false;
}

getDataPresent(){
  let stringifyData = JSON.stringify(this.formNgModal);
  let data = JSON.parse(stringifyData);
  for(var i = 0; i < data.length; i++){
    if((!data[i].title || data[i].title=='' )){
      data.splice(i,1);
      i--;
     
    }
  }
  return data;
}

addNewItem() {
  this.cheklistGroupObject.type = 'Add';
  this.cheklistGroupObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openFormModal();
}

openFormModal(){
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
  $(this.formModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}
closeFormModal(){
  $(this.formModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
  $('.modal-backdrop').remove();
  this.cheklistGroupObject.type = null;
  this.searchChecklistGroup({term : AuditChecklistGroupMasterStore.lastInsertedId},true)

}

addNewAuditCategory()
{
  this.msAuditCategoryObject.type = 'Add';
  this.msAuditCategoryObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openFormAuditCategoryModal();
}
openFormAuditCategoryModal()
{
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
  $(this.auditCategoryModal.nativeElement).modal('show');
  this._utilityService.detectChanges(this._cdr);
}

closeAuditCategoryModal(){
  $(this.auditCategoryModal.nativeElement).modal('hide');
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
  $('.modal-backdrop').remove();
  this.msAuditCategoryObject.type = null;
  if(MsAuditCategoryMasterStore.lastInsertedId)
  {
    this.searchAuditCategory({term : MsAuditCategoryMasterStore.lastInsertedId},true)
  }
  

}

change(page){
  this.config.currentPage = page
}

getDescriptionLength() {
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.question.replace(regex, "");
  return 500-result.length;
}

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.clearCommonFilePopupDocuments();
    this.controlCheklistgroupSubscriptionEvent.unsubscribe();
    this.msAuditCategorySubscriptionEvent.unsubscribe();
    MsAuditDocumetsVersionStore.individualLoaded = false
  }

}
