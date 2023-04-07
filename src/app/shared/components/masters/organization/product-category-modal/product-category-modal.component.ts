import { Component, OnInit, Input, ChangeDetectorRef,HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryService } from 'src/app/core/services/masters/organization/product-category/product-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-product-category-modal',
  templateUrl: './product-category-modal.component.html',
  styleUrls: ['./product-category-modal.component.scss']
})
export class ProductCategoryModalComponent implements OnInit {

  @Input('source') ProductCategorySource: any;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
    // Form Object to add product Category
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

     // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.ProductCategorySource) {
      this.setFormValues();
    }
  }

  ngDoCheck(){
    if(this.ProductCategorySource && this.ProductCategorySource.hasOwnProperty('values') && this.ProductCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.ProductCategorySource.hasOwnProperty('values') && this.ProductCategorySource.values) {
      let { id, title} = this.ProductCategorySource.values
      this.form.setValue({
        id: id,
        title: title
      })
    }
  }
  
  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissProductCategorymasterModal();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._productCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._productCategoryService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      });
    }
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
