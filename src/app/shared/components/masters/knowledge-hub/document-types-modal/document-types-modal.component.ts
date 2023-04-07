import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-document-types-modal',
  templateUrl: './document-types-modal.component.html',
  styleUrls: ['./document-types-modal.component.scss']
})
export class DocumentTypesModalComponent implements OnInit {
  @Input('source') DocumentTypesSource: any;

  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _documentTypesService: DocumentTypesService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {

    // Form Object to add Control Category
  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    is_important:false,
    description: ['']
  });






  // Checking if Source has Values and Setting Form Value

  if (this.DocumentTypesSource) {
    this.setFormValues();
  }

}

ngDoCheck(){
  if (this.DocumentTypesSource && this.DocumentTypesSource.hasOwnProperty('values') && this.DocumentTypesSource.values && !this.form.value.id)
    this.setFormValues();
}

setFormValues(){
  if (this.DocumentTypesSource.hasOwnProperty('values') && this.DocumentTypesSource.values) {
    let { id, title,is_important,description } = this.DocumentTypesSource.values
    this.form.setValue({
      id: id,
      title: title,
      is_important:is_important,
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

// for closing the modal
closeFormModal() {
  this.resetForm();
  this._eventEmitterService.dismissKnowledgeHubDocumentTypeControlModal();
  this._eventEmitterService.setModalStyle();
}

ngOnDestroy(){
  this.resetForm();
}

// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._documentTypesService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      let saveData={
        ...this.form.value,
        is_important:this.form.value.is_important?this.form.value.is_important:false
      }
      save = this._documentTypesService.saveItem(saveData);
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



