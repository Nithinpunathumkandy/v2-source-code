import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { AmAuditFindingService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { AuditFindingCategoryMasterStore } from 'src/app/stores/masters/internal-audit/audit-finding-categories-store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AmAuditService } from 'src/app/core/services/audit-management/am-audit/am-audit.service';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { AmAuditTestPlanService } from 'src/app/core/services/audit-management/am-audit/am-audit-test-plan/am-audit-test-plan.service';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { RiskRatingService } from 'src/app/core/services/masters/risk-management/risk-rating/risk-rating.service';
import { RiskRatingMasterStore } from 'src/app/stores/masters/risk-management/risk-rating-store';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-am-audit-finding-modal',
  templateUrl: './am-audit-finding-modal.component.html',
  styleUrls: ['./am-audit-finding-modal.component.scss']
})
export class AmAuditFindingModalComponent implements OnInit {

  @Input('source') FindingsSource: any
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild('addFindingsCategory') addFindingsCategory: ElementRef;


  AmAuditFindingStore = AmAuditFindingStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentStore = DepartmentMasterStore;
  RiskRatingMasterStore = RiskRatingMasterStore;
  AuditFindingCategoryMasterStore = AuditFindingCategoryMasterStore
  fileUploadPopupStore = fileUploadPopupStore;
  AmAuditTestPlanStore = AmAuditTestPlanStore;
  
  AmAuditFieldWorkStore = AmAuditFieldWorkStore;
  openModelPopup: boolean = false;

  auditFindingCategorySubscriptionEvent: any = null;
  organisationChangesModalSubscription: any = null;
  fileUploadPopupSubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  AuthStore = AuthStore;
  AppStore = AppStore;
  AmAuditsStore = AmAuditsStore;
  form: FormGroup;
  formErrors: any;

  auditFindingCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };
  riskList = [];
  ratingList:any = [];

  constructor(
    private _findingsService: AmAuditFindingService,
    private _departmentService: DepartmentService,
    private _auditFindingCategoriesService: AuditFindingCategoriesService,
    private _sectionService: SectionService,
    private _renderer2: Renderer2,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,
    private _auditManagementService: AuditManagementService,
    private _amAuditService: AmAuditService,
    private _amAuditTestPlanService: AmAuditTestPlanService,
    private _riskRatingService:RiskRatingService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category
    this.form = this._formBuilder.group({
      id: [''],
      am_audit_id: [null, Validators.required],
      am_audit_test_plan_id: [null, Validators.required],
      risk_rating_id: [null, Validators.required],
      title: ['', Validators.required],
      description: [''],
      remarks: [''],
      finding_risks: [[]],
      recommendation: [''],
      department_response: [''],
     
      documents: [[]],

    });

    // restingForm on initial load

    // Checking if Source has Values and Setting Form Value
    if (this.FindingsSource.type == 'Edit') {
      this.setFormValues()
    }
    else {
      this.form.patchValue({
        am_audit_id:AmAuditFieldWorkStore.auditFieldWorkId?AmAuditFieldWorkStore.auditFieldWorkId:null,
        am_audit_test_plan_id:AmAuditTestPlanStore.auditTestPlanId?AmAuditTestPlanStore.auditTestPlanId:null
      })
      // this.setInitialOrganizationLevels();
    }


    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      this.changeZindex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      this.changeZindex();
    })
    // for closing the modal
    this.auditFindingCategorySubscriptionEvent = this._eventEmitterService.auditFindingCategoryControl.subscribe(res => {
      this.closeFindingCategory();
    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.getDepartment();
    this.getRiskRating();

  }

  changeZindex() {
    if (!status && $(this.addFindingsCategory.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'overflow', 'auto');
    }
  }


  ngDoCheck() {
    if (this.FindingsSource && this.FindingsSource.hasOwnProperty('values') && this.FindingsSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.FindingsSource.hasOwnProperty('values') && this.FindingsSource.values) {
      let { id,am_audit_id,am_audit_test_plan_id,finding_risk_rating_id ,title, description, recommendation, department_response,remarks,finding_risks,documents } = this.FindingsSource.values
      this.form.patchValue({
        id: id,
        am_audit_id:am_audit_id,
        am_audit_test_plan_id:AmAuditTestPlanStore.auditTestPlanId?AmAuditTestPlanStore.auditTestPlanId:am_audit_test_plan_id,
        risk_rating_id: finding_risk_rating_id?.id,
        title: title,
        description: description,
        recommendation: recommendation,
        department_response: department_response,
        remarks: remarks,
      

      })

      for(let i of finding_risks){
        this.riskList.push(i.title?i.title:i)
      }
      this.searchAudit({term:this.form.value.am_audit_id});
      // this.searchTestPlan({term:this.form.value.am_audit_test_plan_id});
      this._amAuditTestPlanService.getItems(false, 'q=' + this.form.value.am_audit_test_plan_id+'&am_audit_ids='+this.form.value.am_audit_id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
      this.searchRiskRating({term:this.form.value.risk_rating_id})
      // this.searchFindingCategory({ term: finding_category_id });
    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.clearFIleUploadPopupData();
    this.riskList = [];
    this.form.patchValue({
      am_audit_id:AmAuditFieldWorkStore.auditFieldWorkId?AmAuditFieldWorkStore.auditFieldWorkId:null,
      am_audit_test_plan_id:AmAuditTestPlanStore.auditTestPlanId?AmAuditTestPlanStore.auditTestPlanId:null
    })
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  FindingsCategoryAdd() {
    this.auditFindingCategoryObject.type = "add";
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.addFindingsCategory.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFindingCategory() {
    $(this.addFindingsCategory.nativeElement).modal('hide');
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.addFindingsCategory.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();
    if (AuditFindingCategoryMasterStore.lastInsertedId) {
      this.searchFindingCategory({ term: AuditFindingCategoryMasterStore.lastInsertedId }, true);
    }
    this._utilityService.detectChanges(this._cdr);
  }



  // cancel modal
  cancel() {
    this.closeFormModal();

  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAmAuditFindingModal();
  }

  //Department dropdown
  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getSection() {
    this._sectionService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  //FindingCategory dropdown
  getFindingCategory() {
    this._auditFindingCategoriesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchFindingCategory(e, patchValue: boolean = false) {
    this._auditFindingCategoriesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if (patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ finding_category_id: i.id });
            break;
          }
        }
        AuditFindingCategoryMasterStore.lastInsertedId = null
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }


  // document upload
  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
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
    else
      return this._auditManagementService.getThumbnailPreview(type, token);
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }



  processRiskArray(){
    let riskArray = [];
    for(let risk of this.riskList){
      riskArray.push({title:risk});
    }
    return riskArray;
  }

  processDataForSave() {
    let saveParam = {
      am_audit_id: this.form.value.am_audit_id,
      am_audit_test_plan_id: this.form.value.am_audit_test_plan_id,
      risk_rating_id:this.form.value.risk_rating_id,
      finding_risks:this.processRiskArray(),
      title:this.form.value.title,
      description:this.form.value.description,
      remarks:this.form.value.remarks,
      recommendation:this.form.value.recommendation,
      department_response:this.form.value.department_response,
       documents: this.form.value.id?this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile):this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
    }
    return saveParam;
  }

  getIds(data){
    let dataArray=[];
    for(let i of data){
      dataArray.push(i.id)
    }
    return dataArray;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._findingsService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
   

        save = this._findingsService.saveItem(this.processDataForSave())
      }

      save.subscribe((res: any) => {
        this.AmAuditFindingStore.lastInsertedId = res.id

        if (!this.form.value.id) {
          this.resetForm();
          
          // this.setInitialOrganizationLevels();
        }
        else{
          this.clearEditFiles();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.closeFormModal();
          if(this.FindingsSource.component!='audit-test-plan')
          this._router.navigateByUrl('/audit-management/am-audit-field-works/'+ AmAuditFieldWorkStore.auditFieldWorkId +'/am-audit-findings/'+res.id);
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

  clearEditFiles(){
    fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  close() {

    this.closeFormModal();
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  addRisk() {
    this.formErrors = null;
    if (this.form.value.finding_risks) {
      let pos=this.riskList.findIndex(e=>e==this.form.value.finding_risks);
      if(pos!=-1)
      this.formErrors={'finding_risks':'Title already taken'};
      else
      this.riskList.push(this.form.value.finding_risks);
      
    }
    this.form.patchValue({
      finding_risks: null
    })
    this._utilityService.detectChanges(this._cdr);
  }

  removeRisk(index) {
    this.riskList.splice(index, 1);
  }

  getAudit() {
    this._amAuditService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchAudit(e) {
    this._amAuditService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTestPlan() {
    if(this.form.value.am_audit_id){
      this._amAuditTestPlanService.getItems(false,'am_audit_ids='+this.form.value.am_audit_id+'&is_completed=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
   
  }

  searchTestPlan(e) {
    if(this.form.value.am_audit_id){
    this._amAuditTestPlanService.getItems(false, 'q=' + e.term+'&am_audit_ids='+this.form.value.am_audit_id+'&is_completed=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  getRiskRating(){
    this.ratingList = [];
    this._riskRatingService.getItems().subscribe(res=>{
      for(let i of res['data']){
        if(i.type=='low' || i.type=='medium' || i.type=='high'){
          if(i.type=='low')
            i.label='green';
          else if(i.type=='medium')
          i.label='yellow';
          else
          i.label='red';
          this.ratingList.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRiskRating(e){
    this.ratingList = [];
    this._riskRatingService.getItems(false, 'q=' + e.term).subscribe(res=>{
      for(let i of res['data']){
        if(i.type=='low' || i.type=='medium' || i.type=='high'){
          if(i.type=='low')
          i.label='green';
        else if(i.type=='medium')
        i.label='yellow';
        else
        i.label='red'
          this.ratingList.push(i);
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }



  ngOnDestroy() {
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.auditFindingCategorySubscriptionEvent.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();


  }
}
