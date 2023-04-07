import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FaqService } from 'src/app/core/services/masters/general/faq/faq.service';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationModulesService } from "src/app/core/services/settings/organization-modules/organization-modules.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faq-modal',
  templateUrl: './faq-modal.component.html',
  styleUrls: ['./faq-modal.component.scss']
})
export class FaqModalComponent implements OnInit {
  @Input('source') FaqSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;
  OrganizationModulesStore=OrganizationModulesStore;

  formNgModal = [];
  selectedLanguageId = null;
  moduleGroupId =null;
  faqId = null;

  
  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _faqService: FaqService,
    private _organizationModuleService: OrganizationModulesService) { }

  ngOnInit(): void {
  
    this.initializeFormNgModal();
    this.getOrganizationModule();

    if (this.FaqSource) {

      if (this.FaqSource.hasOwnProperty('values') && this.FaqSource.values) {
        this.setEditValue();
        this.moduleGroupId=this.FaqSource.values.module_group.id;
        this.faqId = this.FaqSource.values.id;

      } 
    }
  }

  ngDoCheck(){
    if(!this.selectedLanguageId)
    {
      this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
      this._utilityService.detectChanges(this._cdr);
    }
      
  }

  initializeFormNgModal(){
    for(let i of LanguageSettingsStore.activeLanguages){
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', description: '', id: '', error: null});
    }

    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  }

  // cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}
// for closing the modal
closeFormModal() {
  this.resetForm();
  this.faqId= null;
  this.moduleGroupId =null;
  this.selectedLanguageId = null;
  this._eventEmitterService.dismissFaqControlModal();
}

resetForm() {
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    i.description = '';
    i.error = null;
  }
  this.formErrors = null;
  this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  AppStore.disableLoading();
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

save(close: boolean = false) {
  this.formErrors = null;
  this.clearFormNgModalError();
  var saveData = this.createSaveData();
  if (saveData.languages.length) {
    let save;
    console.log(saveData);
    AppStore.enableLoading();
    if (this.faqId) {
      save = this._faqService.updateItem(this.faqId, saveData);
    } else {
      save = this._faqService.saveItem(saveData);
    }

    save.subscribe((res: any) => {
       if(!this.faqId){
       this.resetForm();}
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error;
        //this.processFormErrors();
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
      module_group_id:this.moduleGroupId,
      languages: []
    }
    var formData = this.getDataPresent();
    for(let i of formData){
      delete i.language_title;
      delete i.error;
      if(!this.FaqSource.values)
        delete i.id;
    }
    returnData.languages = formData;
    return returnData;
  }

  getOrganizationModule() {
    this._organizationModuleService.getAllItems('?side_menu=true').subscribe(res => {

      this._utilityService.detectChanges(this._cdr);
    })


  }

checkFormValid(){
  var formData = this.getDataPresent();
  if(formData.length > 0) return true;
  else return false;
}

getDataPresent(){
  let stringifyData = JSON.stringify(this.formNgModal);
  let data = JSON.parse(stringifyData);
  for(var i = 0; i < data.length; i++){
    if((!data[i].title || data[i].title=='' ) || (!data[i].description || data[i].description=='')){
      data.splice(i,1);
      i--;
     
    }
  }
  return data;
}

setEditValue(){
  if(this.FaqSource.values.languages.length > 0){
    for(let i of this.formNgModal){
      i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
      i.description = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.description : '';
      i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_category_id : '';
    }
    this._utilityService.detectChanges(this._cdr);
  }
}

getValuesForEdit(id: number){
  let languageValues = this.FaqSource.values.languages.find(e=> e.id == id);
  return languageValues;
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
