import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmAuditCategoryService } from 'src/app/core/services/masters/audit-management/am-audit-category/am-audit-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AmAuditCategoryMasterStore } from 'src/app/stores/masters/audit-management/am-audit-category-store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';

@Component({
  selector: 'app-am-audit-category-modal',
  templateUrl: './am-audit-category-modal.component.html',
  styleUrls: ['./am-audit-category-modal.component.scss']
})
export class AmAuditCategoryModalComponent implements OnInit {

  @Input('source') AmDocumentTypeSource: any;
  

  AmAuditCategoryMasterStore = AmAuditCategoryMasterStore;
  LanguageSettingsStore=LanguageSettingsStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  selectedLanguageId = null;
  amDocumentTypeId = null;
  formNgModal = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _amAuditCategoryService: AmAuditCategoryService,

    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {    
    this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['']
  });
  this.resetForm();
  
  // Checking if Source has Values and Setting Form Value

  if (this.AmDocumentTypeSource) {
    this.setFormValues();
  }
}
ngDoCheck() {
  if (this.AmDocumentTypeSource && this.AmDocumentTypeSource.hasOwnProperty('values') && this.AmDocumentTypeSource.values && !this.form.value.id)
    this.setFormValues();
}

setFormValues() {
  if (this.AmDocumentTypeSource.hasOwnProperty('values') && this.AmDocumentTypeSource.values) {
    let { id, title, description } = this.AmDocumentTypeSource.values
    this.form.setValue({
      id: id,
      title: title,
      description: description
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

getDescriptionLength() {
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex, "");
  return result.length;
}

// for closing the modal
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissAmAuditCategoryControlModal();
}


save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._amAuditCategoryService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._amAuditCategoryService.saveItem(this.form.value);
    }

    save.subscribe((res: any) => {
      this.AmAuditCategoryMasterStore.lastInsertedId = res.id
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
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
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
getButtonText(text) {
  return this._helperService.translateToUserLanguage(text);
}

}