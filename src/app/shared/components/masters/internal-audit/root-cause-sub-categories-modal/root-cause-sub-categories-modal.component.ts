import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootCauseSubCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-sub-categories/root-cause-sub-categories.service';
import{RootCauseCategoryMasterStore} from 'src/app/stores/masters/internal-audit/root-cause-categories-store';
import { RootCauseCategoriesService } from 'src/app/core/services/masters/internal-audit/root-cause-categories/root-cause-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
declare var $: any;
@Component({
  selector: 'app-root-cause-sub-categories-modal',
  templateUrl: './root-cause-sub-categories-modal.component.html',
  styleUrls: ['./root-cause-sub-categories-modal.component.scss']
})
export class RootCauseSubCategoriesModalComponent implements OnInit, OnDestroy {
  @ViewChild('titleInput', { static: true }) titleInput: ElementRef;
  @ViewChild('rootCauseCategoryformModal', { static: true  }) rootCauseCategoryformModal: ElementRef;
  @Input('source') RootCauseSubCategorySource: any;
  
  AppStore = AppStore;
  AuthStore = AuthStore;
  RootCauseCategoryMasterStore = RootCauseCategoryMasterStore;
  rootCauseForm: FormGroup;
  formErrors: any;
  rootCauseCtaegoryObject= {
    component: 'Internal-Audit'
  }

  rootCauseCategorySubscriptionEvent: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _rootCauseSubCategoryService: RootCauseSubCategoriesService,
    private _rootCauseCategoryService: RootCauseCategoriesService) { }

  ngOnInit(): void {

 // Form Object to add Control Category

  this.rootCauseForm = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    root_cause_category_id:['']
  });

 // setting autofocus
 setTimeout(() => this.titleInput.nativeElement.focus(), 150);

   // restingForm on initial load
   this.resetForm();

  //for open 

  this.getRootCauseCategory();

  // Checking if Source has Values and Setting Form Value

  if (this.RootCauseSubCategorySource) {
    this.setFormValues();
  }

  // for closing the child modal
  this.rootCauseCategorySubscriptionEvent = this._eventEmitterService.rootCauseCategoryControl.subscribe(res => {
    this.closeRootCauseSubCategoryFormModal();
  })
  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
    if(!status && $(this.rootCauseCategoryformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index',9999999);
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'overflow','auto');
    }
  })

  this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
    if(!status && $(this.rootCauseCategoryformModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index',9999999);
      this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'overflow','auto');
    }
  })

}

ngDoCheck(){
  if (this.RootCauseSubCategorySource && this.RootCauseSubCategorySource.hasOwnProperty('values') && this.RootCauseSubCategorySource.values && !this.rootCauseForm.value.id)
    this.setFormValues();
  if(this.RootCauseSubCategorySource && this.RootCauseSubCategorySource.hasOwnProperty('categoryId') && !this.rootCauseForm.value.root_cause_category_id){
    this.rootCauseForm.patchValue({root_cause_category_id: this.RootCauseSubCategorySource.categoryId});
    this.searchRootCauseCategory({term: this.RootCauseSubCategorySource.categoryId});
  }
}

setFormValues(){
  if (this.RootCauseSubCategorySource.hasOwnProperty('values') && this.RootCauseSubCategorySource.values) {
    let { id, title ,root_cause_category_id} = this.RootCauseSubCategorySource.values
    this.rootCauseForm.setValue({
      id: id,
      title: title,
      root_cause_category_id: parseInt(root_cause_category_id)
    })
  }
}


getRootCauseCategory(){
  this._rootCauseCategoryService.getItems(false).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  });
  
}

// for resetting the form
resetForm() {
  this.rootCauseForm.reset();
  this.rootCauseForm.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();


}
searchRootCauseCategory(event,patchValue:boolean = false){
  this._rootCauseCategoryService.getItems(false,'&q='+event.term).subscribe((res)=>{
    if(res.data.length > 0 && patchValue){
      for(let i of res.data){
        if(i.id == event.term){
          let root_cause_category_id = this.rootCauseForm.value.root_cause_category_id;
          this.rootCauseForm.patchValue({root_cause_category_id});
          break;
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  });
}


// for closing the modal
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissRootCauseSubCategoryControlModal();
  this._eventEmitterService.dismissRcaRootCauseSubChildModal();
  
 
}

// for closing the child modal
closeRootCauseSubCategoryFormModal(){
  
    $(this.rootCauseCategoryformModal.nativeElement).modal('hide');
   
    if (RootCauseCategoryMasterStore.lastInsertedId) {
      this.rootCauseForm.patchValue({ root_cause_category_id: RootCauseCategoryMasterStore.lastInsertedId });
      this.getRootCauseCategory()
    }
    
}

addRootCauseCategory(){
  setTimeout(() => {
    $(this.rootCauseCategoryformModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.rootCauseCategoryformModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
  }, 500);
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.rootCauseForm.value) {
    let save;
    AppStore.enableLoading();

    if (this.rootCauseForm.value.id) {
      save = this._rootCauseSubCategoryService.updateItem(this.rootCauseForm.value.id, this.rootCauseForm.value);
    } else {
      delete this.rootCauseForm.value.id
      save = this._rootCauseSubCategoryService.saveItem(this.rootCauseForm.value);
    }

    save.subscribe((res: any) => {
       if(!this.rootCauseForm.value.id){
       this.resetForm();}
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
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

 ngOnDestroy() {
    this.rootCauseCategorySubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
 }

 @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}


//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}

