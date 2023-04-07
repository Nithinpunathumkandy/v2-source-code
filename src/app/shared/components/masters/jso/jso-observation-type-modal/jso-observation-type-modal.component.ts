import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { JsoObservationTypeService } from 'src/app/core/services/masters/jso/jso-observation-type/jso-observation-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { JsoObservationTypeMasterStore } from 'src/app/stores/masters/jso/jso-observation-type-store';

@Component({
  selector: 'app-jso-observation-type-modal',
  templateUrl: './jso-observation-type-modal.component.html',
  styleUrls: ['./jso-observation-type-modal.component.scss']
})
export class JsoObservationTypeModalComponent implements OnInit {
  @Input ('source') JsoObservationTypeSource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  AppStore = AppStore;
  JsoObservationTypeMasterStore = JsoObservationTypeMasterStore;

  constructor(
    private _formBuilder: FormBuilder, public _jsoObservationTypeService: JsoObservationTypeService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService
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

  if (this.JsoObservationTypeSource) {
    this.setFormValues();
  }
  }
  ngDoCheck(){
    if (this.JsoObservationTypeSource && this.JsoObservationTypeSource.hasOwnProperty('values') && this.JsoObservationTypeSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.JsoObservationTypeSource.hasOwnProperty('values') && this.JsoObservationTypeSource.values) {
      let { id, title ,description} = this.JsoObservationTypeSource.values
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
    this._eventEmitterService.dismissjsoObservationTypeModal();
   
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
        save = this._jsoObservationTypeService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._jsoObservationTypeService.saveItem(this.form.value);
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
