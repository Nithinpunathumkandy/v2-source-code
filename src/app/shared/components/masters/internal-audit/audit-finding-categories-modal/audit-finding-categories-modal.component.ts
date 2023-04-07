import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditFindingCategoriesService } from 'src/app/core/services/masters/internal-audit/audit-finding-categories/audit-finding-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-audit-finding-categories-modal',
  templateUrl: './audit-finding-categories-modal.component.html',
  styleUrls: ['./audit-finding-categories-modal.component.scss']
})
export class AuditFindingCategoriesModalComponent implements OnInit {
  @Input('source') AuditFindingCategorySource: any;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  color: any;

  constructor( private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _auditFindingcategoryService: AuditFindingCategoriesService) { }

  ngOnInit(): void {


  // Form Object to add Control Category

  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    color_code:[''],
    label:[''],
    description: ['']
  });



   this.resetForm();


  // Checking if Source has Values and Setting Form Value

  if (this.AuditFindingCategorySource) {
    this.setFormValues();
  }

}

ngDoCheck(){
  if (this.AuditFindingCategorySource && this.AuditFindingCategorySource.hasOwnProperty('values') && this.AuditFindingCategorySource.values && !this.form.value.id)
    this.setFormValues();
}

setFormValues(){
  if (this.AuditFindingCategorySource.hasOwnProperty('values') && this.AuditFindingCategorySource.values) {
    let { id, title, description,color_code,label } = this.AuditFindingCategorySource.values
    this.form.patchValue({
      id: id,
      title: title,
      color_code: color_code,
      label:label,
      description: description
    })
    this.color = color_code;
  }
}

// for resetting the form
resetForm() {
  this.color = '';
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
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissAuditFindingCategoryControlModal();
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();
    this.form.patchValue({
      color_code:this.color ? this.color : ''
    })
    if (this.form.value.id) {
      save = this._auditFindingcategoryService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._auditFindingcategoryService.saveItem(this.form.value);
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

