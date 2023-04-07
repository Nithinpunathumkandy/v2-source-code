import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentSubCategoryService } from 'src/app/core/services/masters/incident-management/incident-sub-category/incident-sub-category.service';
import { IncidentCategoriesService } from 'src/app/core/services/masters/incident-management/incident-categories/incident-categories.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentCategoriesMasterStore } from 'src/app/stores/masters/incident-management/incident-categories-master-store';
import { IncidentSubCategoryMasterStore } from 'src/app/stores/masters/incident-management/incident-sub-category-master-store';


@Component({
  selector: 'app-incident-sub-category-model',
  templateUrl: './incident-sub-category-model.component.html',
  styleUrls: ['./incident-sub-category-model.component.scss']
})
export class IncidentSubCategoryModelComponent implements OnInit {
  @Input('categoryId') incidentCategoryId: number;
  @Input('source') IncidentSubCategorySource: any;

  incident_category_id:number;
  AppStore = AppStore;
  UsersStore = UsersStore;
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;
  form: FormGroup;
  formErrors: any;
  incidentCatId: number = null;

  constructor(
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _incidentSubCategoryService: IncidentSubCategoryService,
    private _incidentCategoriesService: IncidentCategoriesService,
    private _userService: UsersService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {

    
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      incident_category_id: ['',[Validators.required]]
    });


    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.IncidentSubCategorySource) {
      this.setFormValues();
    }
  }
  ngDoCheck(){
    if (this.IncidentSubCategorySource && this.IncidentSubCategorySource.hasOwnProperty('values') && this.IncidentSubCategorySource.values && !this.form.value.id)
      this.setFormValues();
    if(typeof(this.IncidentSubCategorySource) == 'number' && !this.form.value.incident_category_id){
      this.form.patchValue({incident_category_id: this.IncidentSubCategorySource});
      this.searchIncidentCategory({term: this.IncidentSubCategorySource});
    }
    
  }

  setFormValues(){
    if (this.IncidentSubCategorySource.hasOwnProperty('values') && this.IncidentSubCategorySource.values) {
      let { id, title, incident_category_id } = this.IncidentSubCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        incident_category_id: incident_category_id
      })
    }
  }

  getIncidentCategories() {
    this._incidentCategoriesService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
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
    this._eventEmitterService.dismissincidentsubcategoryModal();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._incidentSubCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._incidentSubCategoryService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        IncidentSubCategoryMasterStore.setLastInsertedId(res.id);
        if (!this.form.value.id) {
          this.resetForm();
        }
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

  searchIncidentCategory(e){
    this._incidentCategoriesService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
