import { ChangeDetectorRef, Component, Input, OnInit,HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MockDrillResponseServiceMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-response-service-store';
import { MockDrillResponseServiceService } from 'src/app/core/services/masters/mock-drill/mock-drill-response-service/mock-drill-response-service.service';

@Component({
  selector: 'app-mock-drill-response-service-model',
  templateUrl: './mock-drill-response-service-model.component.html',
  styleUrls: ['./mock-drill-response-service-model.component.scss']
})
export class MockDrillResponseServiceModelComponent implements OnInit {

  @Input('source') MockDrillResponseServiceSource: any;
  MockDrillResponseServiceMasterStore = MockDrillResponseServiceMasterStore;
  LanguageSettingsStore = LanguageSettingsStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  selectedLanguageId = null;
  mockDrillTypeId = null;
  formNgModal = [];

  constructor(
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _mockDrillResponseService: MockDrillResponseServiceService,
    private _utilityService: UtilityService
  ) { }


  ngOnInit(): void {
    this.initializeFormNgModal();
    if (this.MockDrillResponseServiceSource) {
      if (this.MockDrillResponseServiceSource.hasOwnProperty('values') && this.MockDrillResponseServiceSource.values) {
        this.setEditValue();
        this.mockDrillTypeId = this.MockDrillResponseServiceSource.values.id;
      }
    }
  }
  ngDoCheck() {
    if (!this.selectedLanguageId) {
      this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
      this._utilityService.detectChanges(this._cdr);
    }
  }
  initializeFormNgModal() {
    for (let i of LanguageSettingsStore.activeLanguages) {
      this.formNgModal.push({ language_id: i.id, language_title: i.title, title: '', id: '', error: null });
    }
    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  }

  setEditValue() {
    if (this.MockDrillResponseServiceSource.values.languages && this.MockDrillResponseServiceSource.values.languages.length > 0) {
      for (let i of this.formNgModal) {
        i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
        i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.mock_drill_response_service_id : '';
      }
      this._utilityService.detectChanges(this._cdr);
    }
  }
  getValuesForEdit(id: number) {
    let languageValues = this.MockDrillResponseServiceSource.values.languages.find(e => e.id == id);
    return languageValues;
  }
  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.mockDrillTypeId = null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissMockDrillResponseServiceModel();
  }

  resetForm() {
    for (let i of this.formNgModal) {
      i.id = '';
      i.title = '';
      i.error = null;
    }
    this.formErrors = null;
    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
    AppStore.disableLoading();
  }

  // clicking language
  clickLanguage(id) {
    this.selectedLanguageId = id;
  }

  checkFormValid() {
    var formData = this.getDataPresent();
    if (formData.length > 1) return true;
    else return false;
  }

  getDataPresent() {
    let stringifyData = JSON.stringify(this.formNgModal);
    let data = JSON.parse(stringifyData);
    for (var i = 0; i < data.length; i++) {
      if ((!data[i].title || data[i].title.trim() == '')) {
        data.splice(i, 1);
        i--;

      }
    }
    return data;
  }
  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    var saveData = this.createSaveData();
    if (saveData.languages.length) {
      let save;
      //console.log(saveData);
      AppStore.enableLoading();
      if (this.mockDrillTypeId) {
        save = this._mockDrillResponseService.updateItem(this.mockDrillTypeId, saveData);
      } else {
        save = this._mockDrillResponseService.saveItem(saveData);
      }

      save.subscribe((res: any) => {
        if (!this.mockDrillTypeId) {
          this.resetForm();
        }
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
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }
  createSaveData() {
    var returnData = {
      languages: []
    }
    var formData = this.getDataPresent();
    for (let i of formData) {
      delete i.language_title;
      delete i.error;
      if (!this.MockDrillResponseServiceSource.values)
        delete i.id;
    }
    returnData.languages = formData;
    return returnData;
  }

  processFormErrors() {
    var formData = this.getDataPresent();
    var errors = this.formErrors.errors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (key.includes('languages') && key.includes('title')) {
          let keyValueSplit = key.split('.');
          let errorPosition = keyValueSplit[1];
          let languageId = formData[errorPosition].language_id;
          var formModalPosition = this.formNgModal.findIndex(e => e.language_id == languageId);
          this.formNgModal[formModalPosition].error = errors[key];
          this.clickLanguage(this.formNgModal[formModalPosition].language_id);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }

  clearFormNgModalError() {
    for (let i of this.formNgModal) {
      i.error = null;
    }
  }

}
