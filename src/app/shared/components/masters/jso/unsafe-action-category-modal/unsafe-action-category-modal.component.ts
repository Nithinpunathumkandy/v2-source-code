import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UnsafeActionCategoryService } from 'src/app/core/services/masters/jso/unsafe-action-category/unsafe-action-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UnsafeActionCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-category-store';

@Component({
  selector: 'app-unsafe-action-category-modal',
  templateUrl: './unsafe-action-category-modal.component.html',
  styleUrls: ['./unsafe-action-category-modal.component.scss']
})
export class UnsafeActionCategoryModalComponent implements OnInit {

  @Input ('source') JsoUnsafeActionCategorySource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  UnsafeActionCategoryMasterStore = UnsafeActionCategoryMasterStore;

  constructor(
    private _formBuilder: FormBuilder, public _jsoUnsafeActionCategoryService: UnsafeActionCategoryService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {

    // Form Object to Add Ms type
   
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

        // restingForm on initial load
     this.resetForm();

     // Checking if Source has Values and Setting Form Value

  if (this.JsoUnsafeActionCategorySource) {
    this.setFormValues();
  }
  }
  ngDoCheck(){
    if (this.JsoUnsafeActionCategorySource && this.JsoUnsafeActionCategorySource.hasOwnProperty('values') && this.JsoUnsafeActionCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.JsoUnsafeActionCategorySource.hasOwnProperty('values') && this.JsoUnsafeActionCategorySource.values) {
      let { id, title ,description} = this.JsoUnsafeActionCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description
      })
    }
  }
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
  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissjsoUnsafeActionCategoryModal();
   
  }
  // getting description count
  
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._jsoUnsafeActionCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._jsoUnsafeActionCategoryService.saveItem(this.form.value,true);
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
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
