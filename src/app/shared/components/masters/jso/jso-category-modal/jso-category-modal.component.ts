import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { JsoCategoryMasterStore } from "src/app/stores/masters/jso/jso-category-master-store";
import { JsoCategoryService } from "src/app/core/services/masters/jso/jso-category/jso-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-jso-category-modal',
  templateUrl: './jso-category-modal.component.html',
  styleUrls: ['./jso-category-modal.component.scss']
})
export class JsoCategoryModalComponent implements OnInit {

  @Input ('source') JsoCategorySource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  JsoCategoryMasterStore = JsoCategoryMasterStore;

  constructor(
    private _formBuilder: FormBuilder, public _jsoCategoryService: JsoCategoryService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService
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

  if (this.JsoCategorySource) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.JsoCategorySource && this.JsoCategorySource.hasOwnProperty('values') && this.JsoCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.JsoCategorySource.hasOwnProperty('values') && this.JsoCategorySource.values) {
      let { id, title ,description} = this.JsoCategorySource.values
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
    this._eventEmitterService.dismissjsoCategoryModal();
   
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
        save = this._jsoCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._jsoCategoryService.saveItem(this.form.value,true);
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
  
  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

}
