import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { EventEquipmentMasterStore } from "src/app/stores/masters/event-monitoring/event-equipment-store";
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventEquipmentService } from 'src/app/core/services/masters/event-monitoring/event-equipment/event-equipment.service';

@Component({
  selector: 'app-event-equipment-modal',
  templateUrl: './event-equipment-modal.component.html',
  styleUrls: ['./event-equipment-modal.component.scss']
})
export class EventEquipmentModalComponent implements OnInit {

  @Input('source') EventEquipmentSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;
  EventEquipmentMasterStore = EventEquipmentMasterStore;

  formNgModal = [];
  selectedLanguageId = null;
  eventEquipmentId = null;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _eventEquipmentService: EventEquipmentService,) { }

  ngOnInit(): void {
  
    this.initializeFormNgModal();

    if (this.EventEquipmentSource) {

      if (this.EventEquipmentSource.hasOwnProperty('values') && this.EventEquipmentSource.values) {
        this.setEditValue();
        this.eventEquipmentId = this.EventEquipmentSource.values.id;

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
  closeFormModal() {
    this.resetForm();
    this.eventEquipmentId= null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissEventEquipmentModal();
  }
  
  resetForm() {
    for(let i of this.formNgModal){
      i.id = '';
      i.title = '';
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
      if (this.eventEquipmentId) {
        save = this._eventEquipmentService.updateItem(this.eventEquipmentId, saveData);
      } else {
        save = this._eventEquipmentService.saveItem(saveData);
      }
  
      save.subscribe((res: any) => {
         if(!this.eventEquipmentId){
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
        languages: []
      }
      var formData = this.getDataPresent();
      for(let i of formData){
        delete i.language_title;
        delete i.error;
        if(!this.EventEquipmentSource.values)
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
      let statusCount = 0;
      for(var i = 0; i < data.length; i++){
        if((!data[i].title || data[i].title=='' )){
          // data.splice(i,1);
          // i--;
          statusCount++
         
        }
      }
      if (statusCount==data.length){
        return []
      }
      else {
        return data
      }
      return data;
    }
    
    setEditValue(){
      if(this.EventEquipmentSource.values.languages && this.EventEquipmentSource.values.languages.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.event_equipment_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
    }
    
    getValuesForEdit(id: number){
      let languageValues = this.EventEquipmentSource.values.languages.find(e=> e.id == id);
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
