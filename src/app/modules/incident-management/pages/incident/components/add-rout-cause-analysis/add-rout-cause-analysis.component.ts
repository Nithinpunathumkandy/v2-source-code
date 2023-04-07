import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { IncidentRootCauseService } from 'src/app/core/services/masters/incident-management/incident-root-cause/incident-root-cause.service';
import { RootCauseCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-categories/root-cause-categories.service';
import { RootCauseSubCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentRootCauseMasterStore } from 'src/app/stores/masters/incident-management/incident-root-cause-master-store';
import { RootCauseCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-categories-store';
import { RootCauseSubCategoryMasterStore } from 'src/app/stores/masters/internal-audit/root-cause-sub-categories-store';
import { AppStore } from "src/app/stores/app.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
declare var $: any;

@Component({
  selector: 'app-add-rout-cause-analysis',
  templateUrl: './add-rout-cause-analysis.component.html',
  styleUrls: ['./add-rout-cause-analysis.component.scss']
})
export class AddRoutCauseAnalysisComponent implements OnInit {
  @Input ('source') addOrEdit: any;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('rootCauseCategoryformModal', { static: true }) rootCauseCategoryformModal: ElementRef;

  AppStore = AppStore;
  IncidentStore = IncidentStore;
  IncidentRootCauseMasterStore = IncidentRootCauseMasterStore;
  RootCauseCategoryStore = RootCauseCategoryMasterStore;
  RootCauseSubCategoryStore = RootCauseSubCategoryMasterStore;
  rootCauseCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };
  rootCauseSubCategoryObject = {
    component: 'Master',
    values: null,
    type: null,
    categoryId: null
  };
  rootCauseCategory: number = null;
  rootCauseSubCategory: number = null;
  form: FormGroup;
  formErrors: any;
  rootCauseCategorySubscriptionEvent: any;
  rootCauseSubCategorySubscriptionEvent: any;
  why: any;

  constructor(private _incidentServices : IncidentService, private _renderer2: Renderer2,
    private _utilityService: UtilityService, private  _cdr: ChangeDetectorRef,
    private  _eventEmitterService: EventEmitterService, private _incidentRootCauseService: IncidentRootCauseService,
    private _formBuilder: FormBuilder,private _rootCauseCategoryService: RootCauseCategoriesService,
    private _rootCauseSubCategoryService: RootCauseSubCategoriesService, private _helperService: HelperServiceService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      root_cause_category_id: [null,[Validators.required]],
      root_cause_sub_category_id : [null],
      why : '',
      description : ['',[Validators.required]]
    })

      // for closing the modal
      this.rootCauseCategorySubscriptionEvent = this._eventEmitterService.rootCauseCategoryControl.subscribe(res => {
        this.closeFormModal();
      })

      
    // for closing the modal
    this.rootCauseSubCategorySubscriptionEvent = this._eventEmitterService.rootCauseSubCategoryControl.subscribe(res => {
      this.closeFormModalSub();
    })

    if(this.addOrEdit == "edit"){
      this.setDataForEdit();
    }else{
      this.setWhyValue()

    }
  }

  setWhyValue(){
    this.why = IncidentStore.rootCauseTotalCount + 1;
    this._utilityService.detectChanges(this._cdr);

  }

  setDataForEdit(){
    // var root_cause_category_id = {
    //   title : IncidentStore.rootCaseEditData.root_cause_category,
    //   id : IncidentStore.rootCaseEditData.root_cause_category_id 
    // }
    // var root_cause_sub_category_id = {
    //   title : IncidentStore.rootCaseEditData.root_cause_sub_category,
    //   id : IncidentStore.rootCaseEditData.root_cause_sub_category_id 
    // }
    this.form.patchValue({
      root_cause_category_id : IncidentStore.rootCaseEditData.root_cause_category_id,
      root_cause_sub_category_id : IncidentStore.rootCaseEditData.root_cause_sub_category_id ,
      description : IncidentStore.rootCaseEditData.description,
    })
    this.rootCauseCategory = IncidentStore.rootCaseEditData.root_cause_category_id;
    this.rootCauseSubCategory = IncidentStore.rootCaseEditData.root_cause_sub_category_id;
    this.searchRootCause({term: this.rootCauseCategory});
    this.searchRootCauseSubCategory({term: this.rootCauseSubCategory});
  }

  cancel(){
    this.rootCauseCategory = null;
    this.rootCauseSubCategory = null;
    this.form.reset();
    this._eventEmitterService.dismissrootCauseModalControl();
  }

  ngModalChange(type){
    if(type == 'root-cause-category'){
      this.form.patchValue({root_cause_category_id: this.rootCauseCategory});
    }
    if(type == 'root-cause-sub-category'){
      this.form.patchValue({root_cause_sub_category_id: this.rootCauseSubCategory});
    }
  }

  getRootCause() {
    // let  rootCauseCategoryId 
    // let getAll 
    // if(this.form.value.root_cause_category_id){
    //   rootCauseCategoryId = this.form.value.root_cause_category_id.id
    //   getAll = true

    // }else{
    //   rootCauseCategoryId = null;
    //   getAll = false

    // }
    this._rootCauseCategoryService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchRootCause(e,patchValue:boolean = false){
    this._rootCauseCategoryService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.rootCauseCategory = i.id;
             this.form.patchValue({ root_cause_category_id: i.id });
            break;
          }
        }
        RootCauseCategoryMasterStore.lastInsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getRootCauseSubCategory(){
    let params =''
    if(this.form.get('root_cause_category_id').value){
       params = '&root_cause_category_ids=' + this.form.get('root_cause_category_id').value;
    this._rootCauseSubCategoryService.getItems(false,params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  searchRootCauseSubCategory(e,patchValue:boolean = false){
    let params = '';
    if(this.form.get('root_cause_category_id').value){
      params = '&root_cause_category_ids=' + this.form.get('root_cause_category_id').value;
      this._rootCauseSubCategoryService.getItems(false, '&q=' + e.term+params).subscribe((res) => {
        if(patchValue){
          for(let i of res.data){
            if(i.id == e.term){
              this.rootCauseSubCategory = i.id;
              this.form.patchValue({ root_cause_sub_category_id: i.id });
              break;
            }
          }
          RootCauseSubCategoryMasterStore.lastInsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  processData(){
    let why 
    
    if(this.addOrEdit == "edit"){
      why = IncidentStore.rootCaseEditData.why
      // this.why = why
    }else{
      why = 'why'+ this.why
      // this.why = why

    }
    let saveData = {
      root_cause_category_id: this.form.value.root_cause_category_id ? this.form.value.root_cause_category_id : '',
      root_cause_sub_category_id: this.form.value.root_cause_sub_category_id ? this.form.value.root_cause_sub_category_id : '',
      why: why,
      description: this.form.value.description ? this.form.value.description : '',
    }

    return saveData;
  }

  saveOtherWitnessUserDetails(close: boolean = false){
    if (this.addOrEdit == "edit" || this.why <= 5 ) {
    let save 
    let id  
    AppStore.enableLoading();
    if(this.addOrEdit == "edit"){
    id = IncidentStore.rootCaseEditData.id
     save = this._incidentServices.updateRootCauseAnalysis(id,this.processData())
    }else{
     save = this._incidentServices.saveRootCauseAnalysis(this.processData())
    }
    save.subscribe(res=>{
      this.why++;
        if(this.why>5 || this.addOrEdit == "edit"){
          this.cancel();
        }
        if(this.addOrEdit != 'edit'){
        this.resetForm();}
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
       this._incidentServices.rootCauseAnalysis().subscribe();
    this.form.reset();
    if(close) this.closeModal()
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      } else if(err.status == 500 || err.status == 403){
        this.cancel();
      }
      this._utilityService.detectChanges(this._cdr);

    })
  }else{
    this._utilityService.showErrorMessage('', 'No More Entries Allowed');
    this.closeModal();
  }
  }

  resetForm(){
    this.form.patchValue({
      description: '',
      root_cause_category_id: null,
      root_cause_sub_category_id: null,
    })
    this.form.pristine;
    this.formErrors = null;
    this.rootCauseCategory = null;
    this.rootCauseSubCategory = null;
  }
  closeModal() {
    // RisksStore.rcaDataLength = null;
   this.why = null;
   this.form.reset()
   this.cancel()
 }
  

  openFormModal() {
    this.rootCauseCategoryObject.type = 'Add';
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._utilityService.detectChanges(this._cdr)
    }, 50);
  }
  // for close modal
  closeFormModal() {
    this._renderer2.removeClass(this.formModal.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      this._renderer2.setAttribute(this.formModal.nativeElement, 'aria-hidden', 'true');
    $(this.formModal.nativeElement).modal('hide');
    this.searchRootCause({term : RootCauseCategoryMasterStore.lastInsertedId},true)
    this.rootCauseCategoryObject.type = null;
    this._utilityService.detectChanges(this._cdr);

  }

    // for opening modal
    openFormModalSub() {
      this.rootCauseSubCategoryObject.type = 'Add';
      this.rootCauseSubCategoryObject.categoryId = this.form.value.root_cause_category_id;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement, 'display', 'block');
        this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.rootCauseCategoryformModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        $(this.rootCauseCategoryformModal.nativeElement).modal('show')

      }, 50);
    }
    // for close modal
    closeFormModalSub() {
      this._renderer2.removeClass(this.rootCauseCategoryformModal.nativeElement, 'show')
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement, 'display', 'none');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      this._renderer2.setAttribute(this.rootCauseCategoryformModal.nativeElement, 'aria-hidden', 'true');
      $(this.rootCauseCategoryformModal.nativeElement).modal('hide');
      this.searchRootCauseSubCategory({term : RootCauseSubCategoryMasterStore.lastInsertedId},true)

      this.rootCauseSubCategoryObject.type = null;
    }
    
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

    ngOnDestroy() {
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      this.rootCauseSubCategorySubscriptionEvent.unsubscribe();
      this.rootCauseCategorySubscriptionEvent.unsubscribe();


    }


}
