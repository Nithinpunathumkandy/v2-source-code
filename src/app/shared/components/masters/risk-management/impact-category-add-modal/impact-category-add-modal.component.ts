import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImpactAnalysisCategoriesService } from 'src/app/core/services/masters/risk-management/impact-analysis-categories/impact-analysis-categories.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-impact-category-add-modal',
  templateUrl: './impact-category-add-modal.component.html',
  styleUrls: ['./impact-category-add-modal.component.scss']
})
export class ImpactCategoryAddModalComponent implements OnInit {

 
  @Input('source') ImpactCategorySource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
 
  constructor(private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _impactCategoryService: ImpactAnalysisCategoriesService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.ImpactCategorySource) {
      this.setFormValues();
    }

  }

  ngDoCheck(){
    if (this.ImpactCategorySource && this.ImpactCategorySource.hasOwnProperty('values') && this.ImpactCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.ImpactCategorySource.hasOwnProperty('values') && this.ImpactCategorySource.values){
      let { id, title, description} = this.ImpactCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        description:description
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
    this._eventEmitterService.dismissImpactCategoryControlModal();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._impactCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._impactCategoryService.saveItem(this.form.value);
      }
  
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          setTimeout(()=>{
            this.closeFormModal();
          },500)
        }
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
