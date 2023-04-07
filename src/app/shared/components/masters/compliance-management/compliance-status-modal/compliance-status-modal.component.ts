import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ComplianceStatusService } from 'src/app/core/services/masters/compliance-management/compliance-status/compliance-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';

@Component({
  selector: 'app-compliance-status-modal',
  templateUrl: './compliance-status-modal.component.html',
  styleUrls: ['./compliance-status-modal.component.scss']
})
export class ComplianceStatusModalComponent implements OnInit {
  @Input('source') ComplianceStatusSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;

  formNgModal = [];
  selectedLanguageId = null;
  type : string;
  statusId = null;
  constructor(private _cdr:ChangeDetectorRef,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService,
              private _complianceStatusService:ComplianceStatusService,
              private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
    this.initializeFormNgModal();


    if (this.ComplianceStatusSource) {

      if (this.ComplianceStatusSource.hasOwnProperty('values') && this.ComplianceStatusSource.values) {
        // this.setEditValue();
        this.statusId = this.ComplianceStatusSource.values.id;
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
    this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', error: null});
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
  this.statusId= null;
  this.selectedLanguageId = null;
  this._eventEmitterService.dismissComplianceStatusControlModal();
}

resetForm() {
  this.type = '';
  for(let i of this.formNgModal){
    i.id = '';
    i.title = '';
    // i.description = '';
    i.error = null;
  }
  this.formErrors = null;
  this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  AppStore.disableLoading();
}

 // getting description count
//  getDescriptionLength(description){
//   var regex = /(<([^>]+)>)/ig;
//   var result = description.replace(regex,"");
//   return result.length;
// }

// clicking language
clickLanguage(id)
{
  this.selectedLanguageId = id;
  
}

save(close: boolean = false) {
  this.formErrors = null;
  this.clearFormNgModalError();
  var saveData = this.createSaveData();
  if (saveData.compliance_status_language.length) {
    let save;
    console.log(saveData);
    AppStore.enableLoading();
    if (this.statusId) {
      // save = this._complianceStatusService.updateItem(this.statusId, saveData);
    } else {
      save = this._complianceStatusService.saveItem(saveData);
    }

    save.subscribe((res: any) => {
       if(!this.statusId){
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
      type: this.type,
      compliance_status_language: []
    }
    var formData = this.getDataPresent();
    for(let i of formData){
      delete i.language_title;
      delete i.error;
      if(!this.ComplianceStatusSource.values)
        delete i.id;
    }
    returnData.compliance_status_language = formData;
    return returnData;
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
      if(!data[i].title || data[i].title=='' ) {
        data.splice(i,1);
        i--;
       
      }
    }
    return data;
  }

  processFormErrors(){
    var formData = this.getDataPresent();
    var errors = this.formErrors.errors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
          if(key.includes('compliance_status_language') && key.includes('title')){
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
// || (!data[i].description || data[i].description=='')