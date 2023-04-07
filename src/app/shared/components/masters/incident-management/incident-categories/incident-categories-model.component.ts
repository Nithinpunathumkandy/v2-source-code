import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentCategoriesMasterStore } from "src/app/stores/masters/incident-management/incident-categories-master-store";
import { IncidentCategoriesService } from "src/app/core/services/masters/incident-management/incident-categories/incident-categories.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { IReactionDisposer, autorun } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-incident-categories-model',
  templateUrl: './incident-categories-model.component.html',
  styleUrls: ['./incident-categories-model.component.scss']
})
export class IncidentCategoriesModelComponent implements OnInit {

  @Input ('source') IncidentCategoriesSource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  IncidentCategoriesMasterStore = IncidentCategoriesMasterStore;

  constructor(
    private _formBuilder: FormBuilder, public _incidentCategoriesService: IncidentCategoriesService,
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

  if (this.IncidentCategoriesSource) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.IncidentCategoriesSource && this.IncidentCategoriesSource.hasOwnProperty('values') && this.IncidentCategoriesSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.IncidentCategoriesSource.hasOwnProperty('values') && this.IncidentCategoriesSource.values) {
      let { id, title ,description} = this.IncidentCategoriesSource.values
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
    this._eventEmitterService.dismissincidentcategoriesModal();
   
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
        save = this._incidentCategoriesService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._incidentCategoriesService.saveItem(this.form.value,true);
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
