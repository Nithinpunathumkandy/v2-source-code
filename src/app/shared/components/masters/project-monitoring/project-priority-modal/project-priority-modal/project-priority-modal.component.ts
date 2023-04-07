import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";

import { ProjectPriorityMasterStore } from "src/app/stores/masters/project-monitoring/project-priority-store";
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectPriorityService } from 'src/app/core/services/masters/project-monitoring/project-priority/project-priority.service';

@Component({
  selector: 'app-project-priority-modal',
  templateUrl: './project-priority-modal.component.html',
  styleUrls: ['./project-priority-modal.component.scss']
})
export class ProjectPriorityModalComponent implements OnInit {

  @Input('source') ProjectPrioritySource: any;
  AppStore = AppStore;
  formErrors: any;
  LanguageSettingsStore=LanguageSettingsStore;
  ProjectPriorityMasterStore = ProjectPriorityMasterStore;

  formNgModal = [];
  selectedLanguageId = null;
  projectPriorityId = null;
  scoreId =null;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _projectPriorityService: ProjectPriorityService,) { }

  ngOnInit(): void {
  
    this.initializeFormNgModal();

    if (this.ProjectPrioritySource) {

      if (this.ProjectPrioritySource.hasOwnProperty('values') && this.ProjectPrioritySource.values) {
        this.setEditValue();
        this.scoreId=this.ProjectPrioritySource.values.score;
        this.projectPriorityId = this.ProjectPrioritySource.values.id;

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
    this.projectPriorityId= null;
    this.scoreId =null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissProjectPriorityModal();
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
    if (saveData.languages.length) {
      let save;
      console.log(saveData);
      AppStore.enableLoading();
      if (this.projectPriorityId) {
        save = this._projectPriorityService.updateItem(this.projectPriorityId, saveData);
      } else {
        save = this._projectPriorityService.saveItem(saveData);
      }
  
      save.subscribe((res: any) => {
         if(!this.projectPriorityId){
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
        score:this.scoreId,
        languages: []
      }
      var formData = this.getDataPresent();
      for(let i of formData){
        delete i.language_title;
        delete i.error;
        if(!this.ProjectPrioritySource.values)
          delete i.id;
      }
      returnData.languages = formData;
    return returnData;
    }
    checkFormValid(){
      var formData = this.getDataPresent();
      if(formData.length > 0 && this.scoreId)  return true;
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
      this.scoreId=this.ProjectPrioritySource.values.score;
      if(this.ProjectPrioritySource.values.languages.length > 0){
        for(let i of this.formNgModal){
          i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
          i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.risk_category_id : '';
        }
        this._utilityService.detectChanges(this._cdr);
      }
    }
    
    getValuesForEdit(id: number){
      let languageValues = this.ProjectPrioritySource.values.languages.find(e=> e.id == id);
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
