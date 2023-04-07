import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectCategoryService } from 'src/app/core/services/masters/project-management/project-category/project-category.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-category-modal',
  templateUrl: './project-category-modal.component.html',
  styleUrls: ['./project-category-modal.component.scss']
})
export class ProjectCategoryModalComponent implements OnInit {

  @Input('source') ProjectCategory: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  
  constructor(private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _projectCategoryService: ProjectCategoryService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
  if (this.ProjectCategory) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.ProjectCategory && this.ProjectCategory.hasOwnProperty('values') && this.ProjectCategory.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.ProjectCategory.hasOwnProperty('values') && this.ProjectCategory.values) {
      let { id, title, description} = this.ProjectCategory.values
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
  closeFormModal(id?) {
    this.resetForm();
    this._eventEmitterService.dismissProjectCategoryControlModal(id);
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._projectCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._projectCategoryService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(res?.id);
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
