import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RiskControlPlanService } from 'src/app/core/services/masters/risk-management/risk-control-plan/risk-control-plan.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-risk-control-plan-modal',
  templateUrl: './risk-control-plan-modal.component.html',
  styleUrls: ['./risk-control-plan-modal.component.scss']
})
export class RiskControlPlanModalComponent implements OnInit {

  @Input('source') RiskControlPlanSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;

  formNgModal = [];
  selectedLanguageId = null;
  riskControlPlanId = null;
  is_treatment=0;


  constructor(private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _riskControlPlanService: RiskControlPlanService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.initializeFormNgModal();

    if (this.RiskControlPlanSource) {

      if (this.RiskControlPlanSource.hasOwnProperty('values') && this.RiskControlPlanSource.values) {
        this.setEditValue();
        this.riskControlPlanId = this.RiskControlPlanSource.values.id;

      } 
    }
  }

  ngDoCheck(){
    if(!this.selectedLanguageId){
      this.clickLanguage(LanguageSettingsStore.languages[0].id);
      this._utilityService.detectChanges(this._cdr);
    }
  }

  initializeFormNgModal(){
    for(let i of LanguageSettingsStore.languages){
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', description: '', id: '', error: null});
    }

    this.clickLanguage(LanguageSettingsStore.languages[0].id);
  }

   // for resetting the form
resetForm() {
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.description = '';
    
    i.error = null;
  }
  this.is_treatment=0;
  this.formErrors = null;
  this.clickLanguage(LanguageSettingsStore.languages[0].id);
  AppStore.disableLoading();
}
// cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}

 // getting description count
 getDescriptionLength(description){
  var regex = /(<([^>]+)>)/ig;
  var result = description.replace(regex,"");
  return result.length;
}

// clicking language
clickLanguage(id)
{
  this.selectedLanguageId = id;
  
}

 // for closing the modal
 closeFormModal() {
  this.resetForm();
  this.riskControlPlanId= null;
  this.selectedLanguageId = null;
  this._eventEmitterService.dismissRiskControlPlanControlModal();
}
save(close: boolean = false) {
  this.formErrors = null;
  this.clearFormNgModalError();
  var saveData = this.createSaveData();
  if (saveData.languages.length) {
    let save;
    AppStore.enableLoading();
    if (this.riskControlPlanId) {
      save = this._riskControlPlanService.updateItem(this.riskControlPlanId, saveData);
    } else {
      save = this._riskControlPlanService.saveItem(saveData);
    }

    save.subscribe((res: any) => {
       if(!this.riskControlPlanId){
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
      languages: [],
      is_treatment:this.is_treatment
    }
    var formData = this.getDataPresent();
    for(let i of formData){
      delete i.language_title;
      delete i.error;
      if(!this.RiskControlPlanSource.values)
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
    if(this.RiskControlPlanSource.values.languages.length > 0){
      for(let i of this.formNgModal){
        i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
        i.description = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.description : '';
         i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_category_id : '';
      }
      
    }
    this.is_treatment = this.RiskControlPlanSource.values.is_treatment?1 : 0;
    this._utilityService.detectChanges(this._cdr);
  }

  setTreatment(event){
    if(event.target.checked){
      this.is_treatment=1;
    }
    else
    this.is_treatment=0;
   
  }

  getValuesForEdit(id: number){
    let languageValues = this.RiskControlPlanSource.values.languages.find(e=> e.id == id);
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
