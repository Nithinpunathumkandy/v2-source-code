import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditFindingCategoriesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-finding-categories/ms-audit-finding-categories.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MsAuditFindingCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-categories-store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';

@Component({
  selector: 'app-ms-audit-finding-categories-modal',
  templateUrl: './ms-audit-finding-categories-modal.component.html',
  styleUrls: ['./ms-audit-finding-categories-modal.component.scss']
})
export class MsAuditFindingCategoriesModalComponent implements OnInit {

  @Input('source') MsAuditFindingCategorySource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;
  MsAuditFindingCategoryMasterStore = MsAuditFindingCategoryMasterStore;

  formNgModal = [];
  selectedLanguageId = null;
  msAuditFindingCategoryId = null;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _msAuditFindingCategoriesService: MsAuditFindingCategoriesService,
    ) { }

  ngOnInit(): void {
  
    this.initializeFormNgModal();

    if (this.MsAuditFindingCategorySource) {

      if (this.MsAuditFindingCategorySource.hasOwnProperty('values') && this.MsAuditFindingCategorySource.values) {
        this.setEditValue();
        this.msAuditFindingCategoryId = this.MsAuditFindingCategorySource.values.id;

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
      this.formNgModal.push({language_id: i.id, language_title: i.title, title: '', id: '', error: null});
    }

    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal(id?) {
    this.resetForm();
    this.msAuditFindingCategoryId= null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissmsAuditFindingCategoryModal(id);
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
      if (this.msAuditFindingCategoryId) {
        save = this._msAuditFindingCategoriesService.updateItem(this.msAuditFindingCategoryId, saveData);
      } else {
        save = this._msAuditFindingCategoriesService.saveItem(saveData);
      }
  
      save.subscribe((res: any) => {
         if(!this.msAuditFindingCategoryId){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(res.id);
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
        languages: []
      }
      var formData = this.getDataPresent();
      for(let i of formData){
        delete i.language_title;
        delete i.error;
        if(!this.MsAuditFindingCategorySource?.values)
          delete i.id;
      }
      returnData.languages = formData;
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
        if((!data[i].title || data[i].title=='' )){
          data.splice(i,1);
          i--;
         
        }
      }
      return data;
    }
    
    setEditValue(){
      if(this.MsAuditFindingCategorySource.values.languages && this.MsAuditFindingCategorySource.values.languages.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.event_type_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
    }
    
    getValuesForEdit(id: number){
      let languageValues = this.MsAuditFindingCategorySource.values.languages.find(e=> e.id == id);
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
