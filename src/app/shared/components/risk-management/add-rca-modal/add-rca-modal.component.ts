import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RootCauseCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-categories-store';
import { RootCauseSubCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-sub-categories-store';
import { RootCauseAnalysisService } from 'src/app/core/services/internal-audit/audit-findings/root-cause-analysis/root-cause-analysis.service';
import { RootCauseCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-categories/root-cause-categories.service';
import { RootCauseSubCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service';
import { AppStore } from 'src/app/stores/app.store';
import { RCAStore } from 'src/app/stores/risk-management/risks/rca-risk.store';
import { RootCauseAnalysis } from 'src/app/core/models/risk-management/risks/root-cause-analyses';
import { RootCauseAnalysesService } from 'src/app/core/services/risk-management/risks/root-cause-analyses/root-cause-analyses.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsRootCauseAnalysisService } from 'src/app/core/services/isms/isms-risks/isms-root-cause-analysis/isms-root-cause-analysis.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';
import { AmAuditFindingRcaService } from 'src/app/core/services/audit-management/am-audit-finding/am-audit-finding-rca/am-audit-finding-rca.service';

@Component({
  selector: 'app-add-rca-modal',
  templateUrl: './add-rca-modal.component.html',
  styleUrls: ['./add-rca-modal.component.scss']
})
export class AddRcaModalComponent implements OnInit {

  @ViewChild('rootCauseCategoryformModal', { static: true }) rootCauseCategoryformModal: ElementRef;
  @ViewChild('rootCauseSubCategoryformModal', { static: true }) rootCauseSubCategoryformModal: ElementRef;
  @Input('source') RCASource: any;

  rootCauseCtaegoryObject = {
    component: 'Internal-Audit'
  }

  rootCauseSubCategoryObject = {
    component: 'Internal-Audit'
  }

  rcaForm: FormGroup;
  formErrors: any;
  whyValue: number = null;

  rootCauseCategorySubscriptionEvent: any = null;
  rootCauseSubCategorySubscriptionEvent: any = null;

  AppStore = AppStore;
  AuthStore = AuthStore;
  RCAStore = RCAStore;
  RootCauseCategoryMasterStore = RootCauseCategoryMasterStore;
  RootCauseSubCategoryMasterStore = RootCauseSubCategoryMasterStore;

  constructor(
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _utilityService: UtilityService,
    private _rootCauseCategoryService: RootCauseCategoriesService,
    private _rootCauseSubCategoryService: RootCauseSubCategoriesService,
    private _rootCauseAnalysesService:RootCauseAnalysesService,
    private _ismsRootCauseAnalysesService:IsmsRootCauseAnalysisService,
    private _amFindingRcaServie:AmAuditFindingRcaService
  ) { }

  ngOnInit(): void {

    this.rcaForm = this._formBuilder.group({
      id: [''],
      why: [''],
      root_cause_sub_category_id: [null],
      root_cause_category_id: [null, [Validators.required]],
      description: ['', [Validators.required]]
    });

    // for closing the child modal
    this.rootCauseCategorySubscriptionEvent = this._eventEmitterService.rootCauseCategoryControl.subscribe(res => {
      this.closeRootCauseCategoryFormModal();
    })

    // for closing the modal
    this.rootCauseSubCategorySubscriptionEvent = this._eventEmitterService.rootCauseSubCategoryControl.subscribe(res => {
      this.closecloseRootCauseSubCategoryFormModalModal();
    })


    this.resetForm();

    if(this.RCASource.type=='Edit'){
      this.setFormValues();
    } else {
      if(this.RCASource.component=='isms')
        this.whyValue = IsmsRisksStore.rcaDataLength + 1;
      else
        this.whyValue = RisksStore.rcaDataLength + 1;
    }
  

  }


  setFormValues(){

    if (this.RCASource.hasOwnProperty('values') && this.RCASource.values) {
      this.rcaForm.setValue({
        id: this.RCASource.values.id,
        root_cause_category_id: this.RCASource.values.root_cause_category_id,
        root_cause_sub_category_id: this.RCASource.values.root_cause_sub_category_id,
        why:this.RCASource.values.why,
        description: this.RCASource.values.description
      })
      this.getRootCauseCategory();
      this.getRootCauseSubCategory();
    }
  }

  getRootCauseCategory() {
    this._rootCauseCategoryService.getItems(false, '&status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  // for closing the child modal
  closeRootCauseCategoryFormModal() {

    ($(this.rootCauseCategoryformModal.nativeElement)as any).modal('hide');

    if (RootCauseCategoryMasterStore.lastInsertedId) {
      this.rcaForm.patchValue({ root_cause_category_id: RootCauseCategoryMasterStore.lastInsertedId });
    }

  }

  closecloseRootCauseSubCategoryFormModalModal(){
    ($(this.rootCauseSubCategoryformModal.nativeElement)as any).modal('hide');

    if (RootCauseSubCategoryMasterStore.lastInsertedId) {
      this.rcaForm.patchValue({ root_cause_sub_category_id: RootCauseSubCategoryMasterStore.lastInsertedId });
    }
  }

  addRootCauseCategory() {
    setTimeout(() => {
      ($(this.rootCauseCategoryformModal.nativeElement)as any).modal('show');
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }


  addRootCauseSubCategory() {
    setTimeout(() => {
      ($(this.rootCauseSubCategoryformModal.nativeElement)as any).modal('show');
      this._renderer2.setStyle(this.rootCauseSubCategoryformModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }

  getRootCauseSubCategory() {
    let params = '';
    if (this.rcaForm.get('root_cause_category_id').value) {
      params = params + `&root_cause_category_ids=${this.rcaForm.get('root_cause_category_id').value}`;
      this._rootCauseSubCategoryService.getItems(false, params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  eventChange(type) {

    switch (type) {

      case 'root_cause_category':
        this.rcaForm.controls["root_cause_sub_category_id"].reset();
        RootCauseSubCategoryMasterStore.setAllRootCauseSubCategory([]);
        this.getRootCauseSubCategory();
        break;

      default:
        break;
    }

  }

  // for resetting the form
  resetForm() {
    // resetting respective form values to the null state for keeping findings id 
    this.rcaForm.patchValue({
      description: '',
      root_cause_category_id: null,
      root_cause_sub_category_id: null,
    })
    this.rcaForm.pristine;
    this.formErrors = null;
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  searchRootCauseCategory(event) {
    this._rootCauseCategoryService.getItems(false, '&q=' + event.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchRootCauseSubCategory(event) {
    let params = '';
    if (this.rcaForm.get('root_cause_category_id').value) {
      if (this.rcaForm.get('root_cause_category_id').value)
        params = params + `&root_cause_category_ids=${this.rcaForm.get('root_cause_category_id').value}`;
      this._rootCauseSubCategoryService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }


  // for closing the modal
  closeFormModal() {
     RisksStore.rcaDataLength = null;
    this.whyValue = null;
    this.resetForm();
    this._eventEmitterService.dismissRiskRcaModal();
  }

  // function for add & update
  save(close: boolean = false) {
    console.log(this.whyValue);
    
   if(!this.rcaForm.value.id)
    this.rcaForm.patchValue({
      why: "why" + this.whyValue
    })
    this.formErrors = null;
    if (this.rcaForm.value && this.whyValue <= 5) {
      let save;
      AppStore.enableLoading();
      if(this.rcaForm.value.id){
        if(this.RCASource.component && this.RCASource.component=='am-audit')
        save = this._amFindingRcaServie.updateItem(AmAuditFindingStore.auditFindingId, this.rcaForm.value.id, this.rcaForm.value);
        
        else if(this.RCASource.component && this.RCASource.component=='isms')
        save = this._ismsRootCauseAnalysesService.updateItem(IsmsRisksStore.riskId, this.rcaForm.value.id, this.rcaForm.value);
        else
        save = this._rootCauseAnalysesService.updateItem(RisksStore.riskId, this.rcaForm.value.id, this.rcaForm.value);
      } else {
        if(this.RCASource.component && this.RCASource.component=='am-audit')
        save = this._amFindingRcaServie.saveItem(AmAuditFindingStore.auditFindingId, IsmsRisksStore.riskId, this.rcaForm.value);
       
        else if(this.RCASource.component && this.RCASource.component=='isms')
        save = this._ismsRootCauseAnalysesService.saveItem(IsmsRisksStore.riskId, IsmsRisksStore.riskId, this.rcaForm.value);
        else
      save = this._rootCauseAnalysesService.saveItem(RisksStore.riskId, RisksStore.riskId, this.rcaForm.value);}
      save.subscribe((res: any) => {
        this.whyValue++;
        if(this.whyValue>5){
          this.cancel();
        }
        if(!this.rcaForm.value.id){
        this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    } else {
      this._utilityService.showErrorMessage('', 'No More Entries Allowed');
      this.closeFormModal();
    }
  }

  ngOnDestroy(){
    this.rootCauseCategorySubscriptionEvent.unsubscribe();
    this.rootCauseSubCategorySubscriptionEvent.unsubscribe();
  }

}
