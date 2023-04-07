import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmAuditTestPlanService } from 'src/app/core/services/audit-management/am-audit/am-audit-test-plan/am-audit-test-plan.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-am-audit-test-plan-modal',
  templateUrl: './am-audit-test-plan-modal.component.html',
  styleUrls: ['./am-audit-test-plan-modal.component.scss']
})
export class AmAuditTestPlanModalComponent implements OnInit {
  @Input('source') testPlanSource: any;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  form: FormGroup;
  cancelEventSubscription: any;
  formErrors = null;
  AppStore = AppStore;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'am_audit_test_plan_cancel_confirmation',
    type: 'Cancel'
  };
  controlList = [];
  riskList = [];
  objectiveList = [];
  msTypeList = [];
  controlDeleted = [];
  riskDeleted = [];
  objectiveDeleted = [];
  msTypeDeleted = [];
  currentTab = 'control';
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  selectedMsTypePos: any = 0;
  fileUploadPopupSubscriptionEvent: any;
  selectedTypeIndex:any = 0;
  selectedIndex: any = null;
  emptyTier = 'No data found';
  searchText;
  
  constructor(private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _amAuditTestPlanService: AmAuditTestPlanService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _renderer2: Renderer2) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [],
      am_audit_id: [''],
      title: [null, [Validators.required]],
      description: [''],
      control_ids: [[]],
      risk_ids: [[]],
      objective_ids: [[]],
      documents: [[]],

    });
    if (this.testPlanSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancel(item);
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    // this.setTestplanArray();

    this.getControls(1);
    // this.getRisks(1);
    // this.getStrategicObjectives(1);
  }

  setTestplanArray(){

  }

  cancel(status) {
    if (status) {
      this.closeFormModal();
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


  ngDoCheck() {
    if (this.testPlanSource && this.testPlanSource.hasOwnProperty('values') && this.testPlanSource.values && !this.form.value.id)
      this.setFormValues();
  }

  closeFormModal() {
    this.clearItems();
    this.currentTab = 'control';
    this._eventEmitterService.dismissAmAuditTestPlanModal();
  }

  clearItems() {
    this.form.reset();
    this.formErrors = null;
    this.objectiveList = [];
    this.riskList = [];
    this.controlList = [];
    AmAuditTestPlanStore.unsetAuditTestPlanDatas();
    AmAuditTestPlanStore.unsetSelectedDocuments();
    this.clearFIleUploadPopupData();
  }

  removeBrochure(type, token) {
    fileUploadPopupStore.unsetFileDetails(type, token);
    this._utilityService.detectChanges(this._cdr);
  }


  setFormValues() {
    if (this.testPlanSource.hasOwnProperty('values') && this.testPlanSource.values) {
      let { id, audit_plan_id, title, description, control_ids, risk_ids, objective_ids, documents } = this.testPlanSource.values
      this.form.patchValue({
        id: id,
        audit_plan_id: audit_plan_id,
        title: title,
        description: description,
        control_ids: control_ids,
        risk_ids: risk_ids,
        objective_ids: objective_ids,
        documents: documents,

      })
      this.riskList = this._helperService.getArrayProcessed(this.form.value.risk_ids,'id');
      this.controlList = this._helperService.getArrayProcessed(this.form.value.control_ids,'id');
      this.objectiveList = this._helperService.getArrayProcessed(this.form.value.objective_ids,'id');
      this.setSeleCtedDocumentsVersions();
    }
  }

  setSeleCtedDocumentsVersions(){
    let documentVersionData = this.testPlanSource.values.document_version_contents ? this.testPlanSource.values.document_version_contents : []
    if (documentVersionData.length > 0){
      for(let data of documentVersionData){
        this.changeDocumetVersion(data);
        AmAuditTestPlanStore.checkSelectedStatus(data)
      }
    }
  }
  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  getSaveData() {
    let saveData;
    if (this.form.value.id) {
      saveData = {
        am_audit_id: AmAuditsStore.auditId,
        description: this.form.value.description,
        title: this.form.value.title,
        risk_ids: this.getAuditableData(this.riskList),
        control_ids: this.getAuditableData(this.controlList),
        objective_ids: this.getAuditableData(this.objectiveList),
        document_version_content_ids : AmAuditTestPlanStore.selectedDocuments?this._helperService.getArrayProcessed(AmAuditTestPlanStore.selectedDocuments,'id') : [],
        documents: { ...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) }

      }
    }

    else {
      saveData = {
        am_audit_id: AmAuditsStore.auditId,
        description: this.form.value.description,
        title: this.form.value.title,
        risk_ids: this.getAuditableData(this.riskList),
        control_ids: this.getAuditableData(this.controlList),
        objective_ids: this.getAuditableData(this.objectiveList),
        document_version_content_ids : AmAuditTestPlanStore.selectedDocuments ? this._helperService.getArrayProcessed(AmAuditTestPlanStore.selectedDocuments,'id') : [],
        documents: { ...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save') }
      }
    }
    return saveData;
  }

  saveAuditTestPlan(close: boolean = false) {

    this.formErrors = null;
    AppStore.enableLoading();
    let save;
    if (this.form.value.id) {
      save = this._amAuditTestPlanService.updateItem(this.form.value.id, this.getSaveData());
    } else {
      save = this._amAuditTestPlanService.saveItem(this.getSaveData());
    }

    save.subscribe((res: any) => {
      AppStore.disableLoading();
      if (!this.form.value.id) {
        this.clearItems();
      }
      else{
        this.clearEditFiles();
      }
      this._utilityService.detectChanges(this._cdr)
      if (close) this.closeFormModal();
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


  clearEditFiles(){
    fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType);
  }




  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }


  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.singleFileUpload = false;
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

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }


  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
  }

  getControls(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'control';
    if (newPage) AmAuditTestPlanStore.setControlCurrentPage(newPage);
    this._amAuditTestPlanService.getControls().subscribe(res => {
      // if (res['data']?.length > 0) {
      //   for (let i of res['data']) {
      //     // if (i.is_selected) {
      //       let pos = this.controlList.findIndex(e => e == i.id);
      //       let pos2 = this.controlDeleted.findIndex(e => e == i.id);
      //       if (pos == -1 && pos2 == -1) {
      //         this.controlList.push(i.id);
      //       }
      //     // }


      //   }

      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRisks(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'risk';
    if (newPage) AmAuditTestPlanStore.setRiskCurrentPage(newPage);
    this._amAuditTestPlanService.getRisks().subscribe(res => {
      // if (res['data']?.length > 0) {
      //   for (let i of res['data']) {
      //     // if (i.is_selected) {
      //       let pos = this.riskList.findIndex(e => e == i.id);
      //       let pos2 = this.riskDeleted.findIndex(e => e == i.id);
      //       if (pos == -1 && pos2 == -1) {
      //         this.riskList.push(i.id);
      //       }
      //     // }
      //   }
      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStrategicObjectives(newPage: number = null) {
    this.searchText='';
    this.currentTab = 'objective';

    if (newPage) AmAuditTestPlanStore.setObjectiveCurrentPage(newPage);
    this._amAuditTestPlanService.getStrategicObjectives().subscribe(res => {
      // if (res['data']?.length > 0) {
        // for (let i of res['data']) {
          // if (i.is_selected) {
            // let pos = this.objectiveList.findIndex(e => e == i.id);
            // let pos2 = this.objectiveDeleted.findIndex(e => e == i.id);
            // if (pos == -1 && pos2 == -1) {
              // this.objectiveList.push(i.id);
            // }
          // }


        // }

      // }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMsDocumentVersionsList(newPage: number = null){
    this.searchText='';
    this.currentTab = 'ms-type';
    if (newPage) AmAuditTestPlanStore.setMsCurrentPage(newPage);
    let params = ''
    params = '?is_ms_type=true&root=true&is_not_master_document_list'
    this._amAuditTestPlanService.getDocumentVersionItems(true,params,true).subscribe(res=>{
      let version_id = res['data'][0].document_version_id
      this.getMsDocumentVersionDetails(version_id)
      this._utilityService.detectChanges(this._cdr)
    })
  }

  // mstype document version details
  getMsDocumentVersionDetails(id){
    AmAuditTestPlanStore.individualContentLoaded = false;
    this._amAuditTestPlanService.getDocumentVersionContents(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

   clear() {
    this.searchText = ''
    // this.pageChange(1);
  }
    searchItem(e) {
    let params = '';
    if(this.currentTab=='control'){
      AmAuditTestPlanStore.setControlCurrentPage(1);
      this._amAuditTestPlanService.getControls(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='risk'){
      AmAuditTestPlanStore.setRiskCurrentPage(1);
      this._amAuditTestPlanService.getRisks(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='ms-type'){
      AmAuditTestPlanStore.setMsCurrentPage(1);
      let params = ''
      params = '?is_ms_type=true&root=true&is_not_master_document_list&q='+this.searchText
      this._amAuditTestPlanService.getDocumentVersionItems(true,params,true).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    if(this.currentTab=='objective'){
      AmAuditTestPlanStore.setObjectiveCurrentPage(1);
    this._amAuditTestPlanService.getStrategicObjectives(false, `q=${this.searchText}` + (params ? params : '')).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }

  msTypeAccordianClick(index,version_id){
   
    if (this.selectedTypeIndex == index) {
      this.selectedTypeIndex = null;
      this._utilityService.detectChanges(this._cdr);
    }
    else {
      this.selectedTypeIndex = index;
      this.getMsDocumentVersionDetails(version_id)
      this._utilityService.detectChanges(this._cdr);
    }
  }

  selectedIndexChange(index){
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  changeDocumetVersion(data){
    AmAuditTestPlanStore.setSelectedDocuments(data) 
 }

  selectedmsType(pos,id){
    this.selectedMsTypePos = pos;
    this.getMsDocumentVersionDetails(id)
    this._utilityService.detectChanges(this._cdr);
  }



  addToControlList(id) {
    let pos = this.controlList.findIndex(e => e == id);
    if (pos != -1) {
      this.controlList.splice(pos, 1);
      this.controlDeleted.push(id);
    }


    else {
      this.controlList.push(id);
      let pos2 = this.controlDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.controlDeleted.splice(pos2, 1)
      }
    }
  }

  addToRiskList(id) {
    let pos = this.riskList.findIndex(e => e == id);
    if (pos != -1) {
      this.riskList.splice(pos, 1);
      this.riskDeleted.push(id);
    }

    else {
      this.riskList.push(id);
      let pos2 = this.riskDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.riskDeleted.splice(pos2, 1)
      }
    }
  }

  addToObjectiveList(id) {
    let pos = this.objectiveList.findIndex(e => e == id);
    if (pos != -1) {
      this.objectiveList.splice(pos, 1);
      this.objectiveDeleted.push(id);
    }

    else {
      this.objectiveList.push(id);
      let pos2 = this.objectiveDeleted.findIndex(e => e == id);
      if (pos2 != -1) {
        this.objectiveDeleted.splice(pos2, 1)
      }
    }
  }

  addToMsTypeList(id) {
    // let pos = this.objectiveList.findIndex(e => e == id);
    // if (pos != -1) {
    //   this.objectiveList.splice(pos, 1);
    //   this.objectiveDeleted.push(id);
    // }

    // else {
    //   this.objectiveList.push(id);
    //   let pos2 = this.objectiveDeleted.findIndex(e => e == id);
    //   if (pos2 != -1) {
    //     this.objectiveDeleted.splice(pos2, 1)
    //   }
    // }
  }

  isControlSelected(id) {
    let pos = this.controlList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isRiskSelected(id) {
    let pos = this.riskList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isObjectiveSelected(id) {
    let pos = this.objectiveList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  isMsTypeSelected(id) {
    let pos = this.msTypeList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  getAuditableData(data) {

    let dataArray = [];
    for (let i of data) {
      dataArray.push(i);
    }

    return data;

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

  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
    AmAuditTestPlanStore.unsetSelectedDocuments();
    this.riskList = [];
    this.controlList = [];
    this.objectiveList = [];
    this.searchText = null;
  }

}
