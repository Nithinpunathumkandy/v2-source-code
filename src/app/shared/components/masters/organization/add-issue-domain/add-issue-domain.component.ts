import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueDomainService } from 'src/app/core/services/masters/organization/issue-domain/issue-domain.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { IssueDomain } from 'src/app/core/models/masters/organization/issue-domain';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-issue-domain',
  templateUrl: './add-issue-domain.component.html',
  styleUrls: ['./add-issue-domain.component.scss']
})
export class AddIssueDomainComponent implements OnInit {
  @Input('source') IssueDomainSource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  constructor(private _formBuilder: FormBuilder,
    private _issueDomainService: IssueDomainService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

       // restingForm on initial load
       this.resetForm();

       // Checking if Source has Values and Setting Form Value
  
    if (this.IssueDomainSource) {
      this.setFormValues();
    }



  }

  ngDoCheck(){
    if (this.IssueDomainSource && this.IssueDomainSource.hasOwnProperty('values') && this.IssueDomainSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.IssueDomainSource.hasOwnProperty('values') && this.IssueDomainSource.values) {
      let { id, title} = this.IssueDomainSource.values
      this.form.setValue({
        id: id,
        title: title
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
closeFormModal(){
  this.resetForm();
  this._eventEmitterService.dismissIssueDomainModal();
 
}



save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._issueDomainService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._issueDomainService.saveItem(this.form.value,true);
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
