import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { LanguageSettingsStore } from 'src/app/stores/settings/language-settings.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MockDrillEvacuationRoleMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-evacuation-role-store';
import { MockDrillEvacuationRoleService } from 'src/app/core/services/masters/mock-drill/mock-drill-evacuation-role/mock-drill-evacuation-role.service';
@Component({
  selector: 'app-mock-drill-evacuation-role-model',
  templateUrl: './mock-drill-evacuation-role-model.component.html',
  styleUrls: ['./mock-drill-evacuation-role-model.component.scss']
})
export class MockDrillEvacuationRoleModelComponent implements OnInit {

  @Input('source') MockDrillEvacuationRoleSource: any;
  MockDrillEvacuationRoleMasterStore = MockDrillEvacuationRoleMasterStore;
  LanguageSettingsStore = LanguageSettingsStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  selectedLanguageId = null;
  mockDrillEvacuationRoleId = null;
  formNgModal = [];

  constructor(
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _mockDrillEvacuationRole: MockDrillEvacuationRoleService,
    private _utilityService: UtilityService
  ) { }


  ngOnInit(): void {
    this.initializeFormNgModal();
    if (this.MockDrillEvacuationRoleSource) {
      if (this.MockDrillEvacuationRoleSource.hasOwnProperty('values') && this.MockDrillEvacuationRoleSource.values) {
        this.setEditValue();
        this.mockDrillEvacuationRoleId = this.MockDrillEvacuationRoleSource.values.id;
      }
    }
  }
  ngDoCheck() {
    if (!this.selectedLanguageId) {
      this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
      this._utilityService.detectChanges(this._cdr);
    }
  }
  // Initialize FormNgModal
  initializeFormNgModal() {
    for (let i of LanguageSettingsStore.activeLanguages) {
      this.formNgModal.push({ language_id: i.id, language_title: i.title, title: '', id: '', error: null });
    }
    this.clickLanguage(LanguageSettingsStore.activeLanguages[0].id);
  }
  // Set Edit Value Data
  setEditValue() {
    if (this.MockDrillEvacuationRoleSource.values.languages && this.MockDrillEvacuationRoleSource.values.languages.length > 0) {
      for (let i of this.formNgModal) {
        i.title = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.title : '';
        i.id = this.getValuesForEdit(i.language_id) ? this.getValuesForEdit(i.language_id).pivot.mock_drill_evacuation_role_id : '';
      }
      this._utilityService.detectChanges(this._cdr);
    }
  }
  getValuesForEdit(id: number) {
    let languageValues = this.MockDrillEvacuationRoleSource.values.languages.find(e => e.id == id);
    return languageValues;
  }
  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.mockDrillEvacuationRoleId = null;
    this.selectedLanguageId = null;
    this._eventEmitterService.dismissMockDrillEvacuationRoleModel();
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
      if (this.mockDrillEvacuationRoleId) {
        save = this._mockDrillEvacuationRole.updateItem(this.mockDrillEvacuationRoleId, saveData);
      } else {
        save = this._mockDrillEvacuationRole.saveItem(saveData);
      }

      save.subscribe((res: any) => {
        if (!this.mockDrillEvacuationRoleId) {
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
      if (!this.MockDrillEvacuationRoleSource.values)
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
