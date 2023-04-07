import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RiskSourceService } from 'src/app/core/services/masters/risk-management/risk-source/risk-source.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-risk-source-modal',
  templateUrl: './risk-source-modal.component.html',
  styleUrls: ['./risk-source-modal.component.scss']
})
export class RiskSourceModalComponent implements OnInit {

  @Input('source') RiskSourceSource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  color: any;

  constructor(private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _riskSourceService: RiskSourceService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
     
     this.form = this._formBuilder.group({
      id: [''],
      color_code:[''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value
  if (this.RiskSourceSource) {
    this.setFormValues();
  }
  }

  ngDoCheck(){
    if (this.RiskSourceSource && this.RiskSourceSource.hasOwnProperty('values') && this.RiskSourceSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.RiskSourceSource.hasOwnProperty('values') && this.RiskSourceSource.values) {
      let { id,color_code, title, description} = this.RiskSourceSource.values
      this.form.setValue({
        id: id,
        color_code:color_code,
        title: title,
        description:description
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
  this._utilityService.detectChanges(this._cdr);
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
    this._eventEmitterService.dismissRiskSourceControlModal();
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      this.form.patchValue({
        color_code:this.color ? this.color : ''
      })
      if (this.form.value.id) {
        save = this._riskSourceService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._riskSourceService.saveItem(this.form.value);
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
