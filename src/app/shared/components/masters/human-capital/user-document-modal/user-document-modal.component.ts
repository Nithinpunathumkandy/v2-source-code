import { Component, OnInit,ChangeDetectorRef, Input, HostListener } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserDocumentTypeService } from 'src/app/core/services/masters/human-capital/user-document-type/user-document-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';

import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';



@Component({
  selector: 'app-user-new-document-modal',
  templateUrl: './user-document-modal.component.html',
  styleUrls: ['./user-document-modal.component.scss']
})
export class UserDocumentModalComponent implements OnInit {
  @Input('source') UserDocumentSource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;

  constructor(private _userDocumentTypeService:UserDocumentTypeService,
    private _helperService: HelperServiceService,private _utilityService: UtilityService,
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

 

  ngOnInit() {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.UserDocumentSource) {
      this.setFormValues();
    }
  
  }

  ngDoCheck(){
    if (this.UserDocumentSource && this.UserDocumentSource.hasOwnProperty('values') && this.UserDocumentSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.UserDocumentSource.hasOwnProperty('values') && this.UserDocumentSource.values) {
      let { id, title } = this.UserDocumentSource.values
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
  
  
  
    // for closing the modal
    closeFormModal() {
      this.resetForm();
      this._eventEmitterService.dismissUserDocumentModal();
  
    }
  

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._userDocumentTypeService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._userDocumentTypeService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
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
