import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { EventMaturityMatrixParameterMasterStore } from "src/app/stores/masters/event-monitoring/event-maturity-matrix-parameter-store";
import { EventMatrixTypeMasterStore } from "src/app/stores/masters/event-monitoring/event-maturity-matrix-types-store";
import { EventMaturityMatrixRangesMaster } from "src/app/stores/masters/event-monitoring/event-maturity-matrix-ranges.store";
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MaturityMatrixRangesService } from 'src/app/core/services/masters/event-monitoring/maturity-matrix-ranges/maturity-matrix-ranges.service';
import { MaturityMatrixTypesService } from 'src/app/core/services/masters/event-monitoring/maturity-matrix-types/maturity-matrix-types.service';
import { EventMaturityMatrixParameterService } from 'src/app/core/services/masters/event-monitoring/event-maturity-matrix-parameter/event-maturity-matrix-parameter.service';


@Component({
  selector: 'app-event-maturity-matrix-parameter-modal',
  templateUrl: './event-maturity-matrix-parameter-modal.component.html',
  styleUrls: ['./event-maturity-matrix-parameter-modal.component.scss']
})
export class EventMaturityMatrixParameterModalComponent implements OnInit {

  @Input('source') EventMaturityMatrixParameterSource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;
  EventMaturityMatrixParameterMasterStore = EventMaturityMatrixParameterMasterStore;
  EventMaturityMatrixTypeMasterStore = EventMatrixTypeMasterStore;
  EventMaturityMatrixRangeMasterStore = EventMaturityMatrixRangesMaster

  formNgModal = [];
  selectedLanguageId = null;
  eventMaturityMatrixParameterId = null;
  eventMaturityMatrixTypeId =null;
  eventMaturityMatrixRangeId =null;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _eventMaturityMatrixTypeService: MaturityMatrixTypesService,
    private _eventMaturityMatrixRangeService: MaturityMatrixRangesService,
    private _eventMaturityMatrixParameterService: EventMaturityMatrixParameterService,) { }

  ngOnInit(): void {
  
    this.initializeFormNgModal();
    this.getEventMaturityMatrixType();
    this.getEventMaturityMatrixRange();

    if (this.EventMaturityMatrixParameterSource) {

      if (this.EventMaturityMatrixParameterSource.hasOwnProperty('values') && this.EventMaturityMatrixParameterSource.values) {
        this.setEditValue();
        //console.log(this.EventMaturityMatrixParameterSource.values)
        this.eventMaturityMatrixTypeId=this.EventMaturityMatrixParameterSource.values.event_maturity_matrix_type.id;
        this.eventMaturityMatrixRangeId=this.EventMaturityMatrixParameterSource.values.event_maturity_matrix_range.id;
        this.eventMaturityMatrixParameterId = this.EventMaturityMatrixParameterSource.values.id;

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
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  }
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.eventMaturityMatrixParameterId= null;
    this.eventMaturityMatrixTypeId =null;
    this.eventMaturityMatrixRangeId =null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissEventMaturityMatrixParameterModal();
  }
  
  resetForm() {
    for(let i of this.formNgModal){
      i.id = '';
      i.title = '';
      i.error = null;
    }
    this.formErrors = null;
    this.eventMaturityMatrixTypeId =null;
    this.eventMaturityMatrixRangeId =null;
    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
    AppStore.disableLoading();
  }
  
  // clicking language
  clickLanguage(id)
  {
    this.selectedLanguageId = id;
    
  }
  searchMaturityMatrixType(e){
    var params = '';
    this._eventMaturityMatrixTypeService.getItems(null,'&q='+e.term+params,false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchMaturityMatrixRange(e)
  {
    var params = '';
    this._eventMaturityMatrixRangeService.getItems(null,'&q='+e.term+params,false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }
  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    var saveData = this.createSaveData();
    if (saveData.languages.length) {
      let save;
      console.log(saveData);
      AppStore.enableLoading();
      if (this.eventMaturityMatrixParameterId) {
        save = this._eventMaturityMatrixParameterService.updateItem(this.eventMaturityMatrixParameterId, saveData);
      } else {
        save = this._eventMaturityMatrixParameterService.saveItem(saveData);
      }
  
      save.subscribe((res: any) => {
         if(!this.eventMaturityMatrixParameterId){
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
        event_maturity_matrix_type_id:this.eventMaturityMatrixTypeId,
        event_maturity_matrix_range_id:this.eventMaturityMatrixRangeId,
        languages: []
      }
      var formData = this.getDataPresent();
      for(let i of formData){
        delete i.language_title;
        delete i.error;
        if(!this.EventMaturityMatrixParameterSource.values)
          delete i.id;
      }
      returnData.languages = formData;
    return returnData;
    }

    getEventMaturityMatrixType() {
      this._eventMaturityMatrixTypeService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
  
  
    }

    getEventMaturityMatrixRange() {
      this._eventMaturityMatrixRangeService.getItems().subscribe(res => {
  
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
      this.eventMaturityMatrixTypeId=this.EventMaturityMatrixParameterSource.values.event_maturity_matrix_type.id;
      this.eventMaturityMatrixRangeId=this.EventMaturityMatrixParameterSource.values.event_maturity_matrix_range.id;
      if(this.EventMaturityMatrixParameterSource.values.languages.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_category_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
    }
    
    getValuesForEdit(id: number){
      let languageValues = this.EventMaturityMatrixParameterSource.values.languages.find(e=> e.id == id);
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
