import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { LanguageService } from 'src/app/core/services/settings/languages/language.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LabelService } from 'src/app/core/services/masters/general/label/label.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss']
})

export class LabelModalComponent implements OnInit {
  @Input('source') LabelSource: any;
  AppStore = AppStore;
  LanguageSettingsStore = LanguageSettingsStore;
  form: FormGroup;
  formErrors: any;
  labelKey: string;
  labels:{languageid: number, value: string, languageTitle: string}[] = [];

  constructor( private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _labelService: LabelService,
    private _eventEmitterService: EventEmitterService,
    private _languageService: LanguageService) { }

  ngOnInit(): void {

    // calling language api
    this.getLanguage();
    
    // Checking if Source has Values and Setting Form Value
    if (this.LabelSource) {
      this.setFormValues()
    }
  }

  ngDoCheck(){
    if(this.LabelSource.hasOwnProperty('values') && this.LabelSource.values && !this.LabelSource.values.id && this.labels.length == 0){
      this.setLabelLanguageNgModal();
    }
    else if(this.LabelSource.hasOwnProperty('values') && this.LabelSource.values && this.LabelSource.values.id && this.labels.length == 0){
      this.setLabelLanguageNgModal();
      this.setFormValues();
    }
  }

  setFormValues(){
    if (this.LabelSource.hasOwnProperty('values') && this.LabelSource.values) {
      this.labelKey = this.LabelSource.values.label_title;
      if(this.LanguageSettingsStore.activeLanguages.length > 0 && this.labels.length > 0 )
        this.setLabelValues();
      else
        this.getLanguage(true);
    }
  }

  getLanguage(setValue:boolean = false){
    if(!this.LanguageSettingsStore.activeLanguages){
      this._languageService.getItems().subscribe(res => {
        this.setLabelLanguageNgModal();
        if(setValue) this.setLabelValues();
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      this.setLabelLanguageNgModal();
    }
  }

  setLabelLanguageNgModal(){
    this.labels = [];
    for(let i of this.LanguageSettingsStore.activeLanguages){
      this.labels.push({languageid: i.id, value: '', languageTitle: i.title});
    }
  }

  setLabelValues(){
    for(let i of this.labels){
      for(let l of this.LabelSource.values.languages){
        if(i.languageid == l.id){
          i.value = l.pivot.title;
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }


// for resetting the form
resetForm(status) {
  this.labelKey = '';
  if(status){
    for(let i of this.labels){
      i.value = '';
    }
  }
  else this.labels = [];
  AppStore.disableLoading();
}

// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}

// for closing the modal
closeFormModal() {
  // this.resetForm();
  this.resetForm(false)
  this._eventEmitterService.dismissLabelModal();
  
}


// function for add & update
save(close: boolean = false) {
  this.formErrors = null;
  if (this.checkFormValid) {
    let save;
    AppStore.enableLoading();

    if (this.LabelSource.values != null) {
      save = this._labelService.updateItem(this.LabelSource.values.id, this.createPostData());
    } else {
      save = this._labelService.saveItem(this.createPostData());
    }

    save.subscribe((res: any) => {
      if(this.LabelSource.values == null){
        this.resetForm(true);
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
      else if(err.status == 500 || err.status == 403){
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }
 }

  createPostData(){
    var postData = {
      label: this.labelKey,
      label_languages:[]
    };
    for(let i of this.labels){
      let item = {language_id: i.languageid, title: i.value};
      if(item.title != '')
        postData.label_languages.push(item);
    }
    return postData;
  }

  checkFormValid(){
    var formValid = false;
    for(let i of this.labels){
      if(i.value && i.value != ''){
        formValid = true;
        break;
      }
    }
    return formValid;
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
