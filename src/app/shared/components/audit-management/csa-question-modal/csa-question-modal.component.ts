import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmAuditTestPlanService } from 'src/app/core/services/audit-management/am-audit/am-audit-test-plan/am-audit-test-plan.service';
import { AmCsaAssessmentService } from 'src/app/core/services/audit-management/am-csa/am-csa-assessment.service';
import { AmCsaService } from 'src/app/core/services/audit-management/am-csa/am-csa.service';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;

@Component({
  selector: 'app-csa-question-modal',
  templateUrl: './csa-question-modal.component.html',
  styleUrls: ['./csa-question-modal.component.scss']
})
export class CsaQuestionModalComponent implements OnInit {

  @Input('source') CSASource: any
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  AuthStore = AuthStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  fileUploadPopupSubscriptionEvent: any;
  selectedMsTypePos: any = 0;
  selectedTypeIndex:any = 0;
  selectedIndex: any = null;
  msTypeList = [];
  emptyTier = 'No data found';
  otherQuestions = [];

  constructor(private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _departmentService: DepartmentService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _csaAssessmentService:AmCsaAssessmentService,
    private _amAuditTestPlanService:AmAuditTestPlanService,
    private _csaService:AmCsaService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      question: ['', Validators.required],
      // document_version_content_id: [null],
    });

    // restingForm on initial load

    // Checking if Source has Values and Setting Form Value
    if (this.CSASource.type == 'Edit') {
      this.setFormValues()
    }
    this.getMsDocumentVersionsList(1);

  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  searchDepartment(e) {

    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  
  setFormValues() {
    if (this.CSASource.hasOwnProperty('values') && this.CSASource.values) {
      // this.form.patchValue({
      //   id:this.CSASource.
      // })
      // let { id, question, document_version_content_id } = this.CSASource.values
      this.setSeleCtedDocumentsVersions();
    }

    
  }
  setSeleCtedDocumentsVersions(){
    let documentVersionData = this.CSASource.values.document_version_contents ? this.CSASource.values.document_version_contents : []
    if (documentVersionData.length > 0){
      for(let data of documentVersionData){
        let id=data.id;
        if(data.document_version_content_id!=null){
          if(data.question){
            data['title'] = data.question;
            data['doc_id'] = id;
            data['id'] = data.document_version_content_id;
           
          }
          this.changeDocumetVersion(data);
          AmAuditTestPlanStore.checkSelectedStatus(data);
          this._utilityService.detectChanges(this._cdr)
        }
        else{
          this.otherQuestions.push({id:data.id,title:data.question})
        }
      
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }



  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAmCSAQuestionModal();
  }

  // for resetting the form
  resetForm() {
    this.form.reset();

    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

 

  processDataForSave() {
    let questionArray=[];
    for(let i of AmAuditTestPlanStore.selectedDocuments){
        questionArray.push({
          id:i.doc_id,
          question: i.title,
          document_version_content_id: i.id,
        })
    }
    for(let i of this.otherQuestions){
      questionArray.push({
        id:i.id,
        document_version_content_id:null,
        question:i.title
      })
    }
    return {questions:questionArray};
  }





  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      // if (this.CSASource.type=='Edit') {
      //   save = this._csaAssessmentService.updateItem(this.form.value.id, this.processDataForSave());
      // } else {
      //   delete this.form.value.id


        save = this._csaAssessmentService.saveItem(this.processDataForSave())
      // }

      save.subscribe((res: any) => {

        if (!this.form.value.id) {
          this.resetForm();
        }
        this._csaService.getItem(AmCSAStore.csaId).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.closeFormModal();
        }
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


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  
  getMsDocumentVersionsList(newPage: number = null){
    // this.currentTab = 'ms-type';
    if (newPage) AmAuditTestPlanStore.setMsCurrentPage(newPage);
    let params = ''
    params = '?is_ms_type=true&private&root=true&is_not_master_document_list'
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


  isMsTypeSelected(id) {
    let pos = this.msTypeList.findIndex(e => e == id);
    if (pos != -1) {
      return true
    }
    else
      return false;
  }

  addQuestion(){
    this.formErrors = null;
   let pos= this.otherQuestions.findIndex(e=>e.title==this.form.value.question);
   if(pos!=-1){
     this.formErrors={question:'Question already taken'};
   }
   else{
     this.otherQuestions.push({id:null,title:this.form.value.question});
   }
   this.form.patchValue({
     question:null
   })
  }

  removeQuestion(index){
    this.otherQuestions.splice(index,1);
  }

  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent?.unsubscribe();
    AmAuditTestPlanStore.unsetVersionContents();
    AmAuditTestPlanStore.unsetSelectedDocuments()


  }


}
