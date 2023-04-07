import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlEfficiencyMeasuresService } from 'src/app/core/services/masters/risk-management/control-efficiency-measures/control-efficiency-measures.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { LanguageSettings } from 'src/app/core/models/settings/language-settings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-control-efficiency-measures-modal',
  templateUrl: './control-efficiency-measures-modal.component.html',
  styleUrls: ['./control-efficiency-measures-modal.component.scss']
})
export class ControlEfficiencyMeasuresModalComponent implements OnInit {

  @Input('source') ControlEfficiencyMeasuresSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;

  formNgModal = [];
  selectedLanguageId = null;
  controlEfficiencyMeasuresId = null;
  score:number;
  isNotAcceptable:boolean;

  // selectedLang:LanguageSettings[]=[]

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _controlEfficiencyMeasuresService: ControlEfficiencyMeasuresService,
    private _utilityService: UtilityService) { }

    ngOnInit(): void {
      this.initializeFormNgModal();
  
      if (this.ControlEfficiencyMeasuresSource) {
       
        if (this.ControlEfficiencyMeasuresSource.hasOwnProperty('values') && this.ControlEfficiencyMeasuresSource.values) {
          this.setEditValue();
          this.controlEfficiencyMeasuresId = this.ControlEfficiencyMeasuresSource.values.id;
          this.score=this.ControlEfficiencyMeasuresSource.values.score;
          this.isNotAcceptable=this.ControlEfficiencyMeasuresSource.values.is_not_applicable;
          this._utilityService.detectChanges(this._cdr);
  
        } 
      }
    }
  
    ngDoCheck(){
      if(!this.selectedLanguageId)
      {
        this.clickLanguage(LanguageSettingsStore.languages[0].id);
        this._utilityService.detectChanges(this._cdr);
      }
        
    }

    initializeFormNgModal(){
      for(let i of LanguageSettingsStore.languages){
        this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', id: '', error: null});
      }
  
      this.clickLanguage(LanguageSettingsStore.languages[0].id);
    }

    checkInputDirection(){     
      // for(let i of LanguageSettingsStore.languages){
        var index = this.LanguageSettingsStore.languages.findIndex(e=>e.id == this.selectedLanguageId);
        if(index){
          if(this.LanguageSettingsStore.languages[index].is_rtl) return true
          else return false;
        }else{
          return false;
        }
       
      // }
    }
  
     // for resetting the form
  resetForm() {
    for(let i of this.formNgModal){
      i.id = '';
      i.title = '';
      i.error = null;
    }
    this.formErrors = null;
    this.score=null;
    this.isNotAcceptable=null;
    this.clickLanguage(LanguageSettingsStore.languages[0].id);
    AppStore.disableLoading();
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }
  

  
  // clicking language
  clickLanguage(id)
  {
    this.selectedLanguageId = id;
    
  }
  
   // for closing the modal
   closeFormModal() {
    this.resetForm();
    this.controlEfficiencyMeasuresId= null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissControlEfficiencyMeasuresControlModal();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    var saveData = this.createSaveData();
    if (saveData.languages.length) {
      let save;
      AppStore.enableLoading();
      if (this.controlEfficiencyMeasuresId) {
        save = this._controlEfficiencyMeasuresService.updateItem(this.controlEfficiencyMeasuresId, saveData);
      } else {
        save = this._controlEfficiencyMeasuresService.saveItem(saveData);
      }
  
      save.subscribe((res: any) => {
         if(!this.controlEfficiencyMeasuresId){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error;
          this.processFormErrors();
        }
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
         
      });
    }
    }
  
    createSaveData(){
     
      var returnData = {
        score:this.score,
        is_not_applicable:this.isNotAcceptable ? 1:0,
        languages: []
      }
      var formData = this.getDataPresent();
      for(let i of formData){
        delete i.language_title;
        delete i.error;
        if(!this.ControlEfficiencyMeasuresSource.values)
          delete i.id;
      }
      returnData.languages = formData;
      return returnData;
    }
  
    getDataPresent(){
      let stringifyData = JSON.stringify(this.formNgModal);
      let data = JSON.parse(stringifyData);
      for(var i = 0; i < data.length; i++){
        if(!data[i].title || data[i].title == ''){
          data.splice(i,1);
          i--;
        }
      }
      return data;
    }
  
    setEditValue(){
      if(this.ControlEfficiencyMeasuresSource.values.languages.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.control_efficieny_measures_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
    }
  
    getValuesForEdit(id: number){
      let languageValues = this.ControlEfficiencyMeasuresSource.values.languages.find(e=> e.id == id);
      return languageValues;
    }
  
    checkFormValid(){
      var formData = this.getDataPresent();
      if(formData.length > 0) return true;
      else return false;
    }
  
    processFormErrors(){
      var formData = this.getDataPresent();
      var errors = this.formErrors.errors;
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
            if(key.includes('languages') && key.includes('title')){
              let keyValueSplit = key.split('.');
              let errorPosition = keyValueSplit[1];
              let languageId = formData[errorPosition].language_id;
              var formModalPosition = this.formNgModal.findIndex(e=>e.language_id == languageId);
              // this.formNgModal[formModalPosition].error = errors[key][0].includes('characters') ? 'Title may not be greater than 500 characters' : 'Title Already Taken';
              this.formNgModal[formModalPosition].error = errors[key];
              this.clickLanguage(this.formNgModal[formModalPosition].language_id);
            }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }
  
    clearFormNgModalError(){
      for(let i of this.formNgModal){
        i.error = null;
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
