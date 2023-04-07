import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RootCauseCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-categories/root-cause-categories.service';
import { RootCauseSubCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service';
import { MsauditFindingsRcaService } from 'src/app/core/services/ms-audit-management/findings-rca/msaudit-findings-rca.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RootCauseCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-categories-store';
import { RootCauseSubCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-sub-categories-store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
declare var $: any;
@Component({
  selector: 'app-add-root-cause-analysis-findings',
  templateUrl: './add-root-cause-analysis-findings.component.html',
  styleUrls: ['./add-root-cause-analysis-findings.component.scss']
})
export class AddRootCauseAnalysisFindingsComponent implements OnInit {

  @ViewChild('rootCauseCategoryformModal', { static: true }) rootCauseCategoryformModal: ElementRef;
  @ViewChild('rootCauseSubCategoryformModal', { static: true }) rootCauseSubCategoryformModal: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @Input('source') RCASource: any;

  AppStore = AppStore;
  RootCauseCategoryMasterStore = RootCauseCategoryMasterStore;
  RootCauseSubCategoryMasterStore = RootCauseSubCategoryMasterStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  rootCauseCtaegoryObject = {
    component: 'Internal-Audit'
  };

  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'common_cancel_subtitle',
    type: 'Cancel'
  };

  rootCauseSubCategoryObject = {
    component: 'Internal-Audit'
  };
  rcaForm: FormGroup;
  formErrors: any;
  whyValue: number = null;
  cancelEventSubscription : any;
  rootCauseCategorySubscriptionEvent: any = null;
  rootCauseSubCategorySubscriptionEvent: any = null;
  constructor( private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _msAuditFindingsRcaService: MsauditFindingsRcaService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _rootCauseCategoryService: RootCauseCategoriesService,
    private _rootCauseSubCategoryService: RootCauseSubCategoriesService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {


    // Form Object to add Control Category

  this.rcaForm = this._formBuilder.group({
    id: [''],
    why: [''],
    root_cause_sub_category_id:[null,[Validators.required]],
    root_cause_category_id:[null,[Validators.required]],
    description:['',[Validators.required]]
  });

  
  this.resetForm();
    //for open 

    // for closing the child modal
    this.rootCauseCategorySubscriptionEvent = this._eventEmitterService.rootCauseCategoryControl.subscribe(res => {
      this.closeRootCauseCategoryFormModal();
    })

    // for closing the modal
    this.rootCauseSubCategorySubscriptionEvent = this._eventEmitterService.rootCauseSubCategoryControl.subscribe(res => {
      this.closecloseRootCauseSubCategoryFormModalModal();
    })

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })
   // setting form values from source
   if(this.RCASource.type=='Edit'){
    this.setFormValues();
  } else {
    this.whyValue = AuditNonConfirmityStore.rcaDataLength + 1;
  }

    this.getRootCauseCategory();
  
  }

   ngDoCheck(){
    if (this.RCASource && this.RCASource.hasOwnProperty('values') && this.RCASource.values && !this.rcaForm.value.id)
      this.setFormValues();
  }


  setFormValues(){
    
    if (this.RCASource.hasOwnProperty('values') && this.RCASource.values) {
      this.rcaForm.setValue({
        id: this.RCASource.values.id,
        root_cause_category_id: parseInt(this.RCASource.values.root_cause_category_id),
        root_cause_sub_category_id: parseInt(this.RCASource.values.root_cause_sub_category_id),
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

    $(this.rootCauseCategoryformModal.nativeElement).modal('hide');

    if (RootCauseCategoryMasterStore.lastInsertedId) {
      this.rcaForm.patchValue({ root_cause_category_id: RootCauseCategoryMasterStore.lastInsertedId });
    }

  }

  closecloseRootCauseSubCategoryFormModalModal(){
    $(this.rootCauseSubCategoryformModal.nativeElement).modal('hide');

    if (RootCauseSubCategoryMasterStore.lastInsertedId) {
      this.rcaForm.patchValue({ root_cause_sub_category_id: RootCauseSubCategoryMasterStore.lastInsertedId });
    }
  }

  addRootCauseCategory() {
    setTimeout(() => {
      $(this.rootCauseCategoryformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    }, 500);
  }


  addRootCauseSubCategory() {
    setTimeout(() => {
      $(this.rootCauseSubCategoryformModal.nativeElement).modal('show');
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

  cancelByUser(status) {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
    if(status)
    {
      this.closeFormModal();
    }
    
  }
  

  confirmCancel() {

    $(this.cancelPopup.nativeElement).modal('show');
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
    AuditNonConfirmityStore.rcaDataLength = null;
    this.whyValue = null;
    this.resetForm();
    this._eventEmitterService.dismissIaRcaAddModal();
  }

  // function for add & update
  save(close: boolean = false) {
   if(!this.rcaForm.value.id)
    this.rcaForm.patchValue({
      why: "why" + this.whyValue
    })
    this.formErrors = null;
    if (this.rcaForm.value && this.whyValue <= 5) {
      let save;
      AppStore.enableLoading();
      if(this.rcaForm.value.id){
        save = this._msAuditFindingsRcaService.updateItem(AuditNonConfirmityStore.msAuditNonConfirmityId, this.rcaForm.value.id, this.rcaForm.value,this.RCASource.values.why);
      } else {
      save = this._msAuditFindingsRcaService.saveItem(AuditNonConfirmityStore.msAuditNonConfirmityId, this.rcaForm.value,this.whyValue);}
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
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  ngOnDestroy(){
    this.rootCauseCategorySubscriptionEvent.unsubscribe();
    this.rootCauseSubCategorySubscriptionEvent.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
  }

}
