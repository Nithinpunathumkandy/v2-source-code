import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentTypeService } from 'src/app/core/services/masters/incident-management/incident-type/incident-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-incident-type-modal',
  templateUrl: './incident-type-modal.component.html',
  styleUrls: ['./incident-type-modal.component.scss']
})
export class IncidentTypeModalComponent implements OnInit {
  @Input('source') IncidentTypeSource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  constructor(private _formBuilder:FormBuilder,
              private _cdr:ChangeDetectorRef,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService,
              private _incidentTypeService:IncidentTypeService,
              private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
    });

    
  this.resetForm();


  // Checking if Source has Values and Setting Form Value

  if (this.IncidentTypeSource) {
    this.setFormValues();
  }

  }
  ngDoCheck(){
    if (this.IncidentTypeSource && this.IncidentTypeSource.hasOwnProperty('values') && this.IncidentTypeSource.values && !this.form.value.id)
      this.setFormValues();
  }
  
  setFormValues(){
    if (this.IncidentTypeSource.hasOwnProperty('values') && this.IncidentTypeSource.values) {
      let { id, title, description } = this.IncidentTypeSource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description,
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

// for closing the modal
closeFormModal() {
  this.resetForm();
 this._eventEmitterService.dismissIncidentTypeModalControl();
}
// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._incidentTypeService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._incidentTypeService.saveItem(this.form.value);
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
