import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoCategoryService } from 'src/app/core/services/masters/jso/jso-category/jso-category.service';
import { JsoSubCategoryService } from 'src/app/core/services/masters/jso/jso-sub-category/jso-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { JsoSubCategoryMasterStore } from 'src/app/stores/masters/jso/jso-sub-category-master-store';
import { JsoCategoryMasterStore } from "src/app/stores/masters/jso/jso-category-master-store";

@Component({
  selector: 'app-jso-sub-category-modal',
  templateUrl: './jso-sub-category-modal.component.html',
  styleUrls: ['./jso-sub-category-modal.component.scss']
})
export class JsoSubCategoryModalComponent implements OnInit {

  @Input ('source') JsoSubCategorySource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  JsoSubCategoryMasterStore = JsoSubCategoryMasterStore;
  JsoCategoryMasterStore = JsoCategoryMasterStore;

  constructor(
    private _formBuilder: FormBuilder, 
    public _jsoSubCategoryService: JsoSubCategoryService,
    private _jsoCategoryService:JsoCategoryService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, 
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {


    // Form Object 
   
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      jso_category_id: ['', [Validators.required]]
    });

        // restingForm on initial load
     this.resetForm();

     // Checking if Source has Values and Setting Form Value

  if (this.JsoSubCategorySource) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.JsoSubCategorySource && this.JsoSubCategorySource.hasOwnProperty('values') && this.JsoSubCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.JsoSubCategorySource.hasOwnProperty('values') && this.JsoSubCategorySource.values) {
      let { id, title ,description ,jso_category_id} = this.JsoSubCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description,
        jso_category_id: jso_category_id
      })
    }
  }
  jsoCategories(){
    this._jsoCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    
    }
    
    searchJsoCategory(event){
      this._jsoCategoryService.getItems(false,'&q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
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
    this._eventEmitterService.dismissjsoSubCategoryModal();
   
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
        save = this._jsoSubCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._jsoSubCategoryService.saveItem(this.form.value);
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
