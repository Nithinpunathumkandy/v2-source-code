import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectCostCategoryService } from 'src/app/core/services/masters/project-management/project-cost-category/project-cost-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-cost-category-modal',
  templateUrl: './project-cost-category-modal.component.html',
  styleUrls: ['./project-cost-category-modal.component.scss']
})
export class ProjectCostCategoryModalComponent implements OnInit {

  @Input('source') ProjectCostCategory: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  
  constructor(private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _projectCostCategoryService: ProjectCostCategoryService,
    private _utilityService: UtilityService) { }


  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      can_delete: [Boolean],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
  if (this.ProjectCostCategory) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.ProjectCostCategory && this.ProjectCostCategory.hasOwnProperty('values') && this.ProjectCostCategory.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.ProjectCostCategory.hasOwnProperty('values') && this.ProjectCostCategory.values) {
      let { id, title, description,can_delete} = this.ProjectCostCategory.values
      this.form.setValue({
        id: id,
        title: title,
        can_delete: can_delete,
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
    this._eventEmitterService.dismissProjectCostCategoryControlModal();
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._projectCostCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        if(!this.form.value.can_delete)this.form.patchValue({can_delete:0});
        save = this._projectCostCategoryService.saveItem(this.form.value);
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
