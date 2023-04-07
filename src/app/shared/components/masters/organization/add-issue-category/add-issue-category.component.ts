import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, EventEmitter, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueCategoryService } from 'src/app/core/services/masters/organization/issue-category/issue-category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { string } from '@amcharts/amcharts4/core';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-issue-category',
  templateUrl: './add-issue-category.component.html',
  styleUrls: ['./add-issue-category.component.scss']
})
export class AddIssueCategoryComponent implements OnInit {
  @Input('source') IssueCategorySource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  color = '#ffffff';
  constructor(private _formBuilder: FormBuilder,
    private _issueCategoryService: IssueCategoryService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      color_code:[''],
      label:['']
    });

         // restingForm on initial load
         this.resetForm();

         // Checking if Source has Values and Setting Form Value
    
      if (this.IssueCategorySource) {
        this.setFormValues();
      }

  }

  ngDoCheck(){
    if (this.IssueCategorySource && this.IssueCategorySource.hasOwnProperty('values') && this.IssueCategorySource.values && !this.form.value.id) {
      this.setFormValues();
    }
  }

  setFormValues(){
    if (this.IssueCategorySource.hasOwnProperty('values') && this.IssueCategorySource.values) {
      let { id, title, color_code, label} = this.IssueCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        color_code:color_code,
        label:label
      })
      this.color = color_code;
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

// getting description count

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}

// for closing the modal
closeFormModal(){
  this.resetForm();
  this._eventEmitterService.dismissIssueCategoryModal();
 
}

save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();
    this.form.patchValue({
      color_code:this.color ? this.color : '' })

    if (this.form.value.id) {
      save = this._issueCategoryService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._issueCategoryService.saveItem(this.form.value,true);
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

ngOnDestroy(){
  this.resetForm;
  this.color = '';
}
 
}
