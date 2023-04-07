import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { MockDrillChecksMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-checks-store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MockDrillChecksService } from 'src/app/core/services/masters/mock-drill/mock-drill-checks/mock-drill-checks.service';
@Component({
  selector: 'app-mock-drill-checks-model',
  templateUrl: './mock-drill-checks-model.component.html',
  styleUrls: ['./mock-drill-checks-model.component.scss']
})
export class MockDrillChecksModelComponent implements OnInit {
  @Input('source') MockDrillChecksSource: any;

  MockDrillChecksMasterStore = MockDrillChecksMasterStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  mockDrillChecksId = null;
  formNgModal = [];

  constructor(
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _mockDrillChecksService: MockDrillChecksService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.initializeFormNgModal();
    if (this.MockDrillChecksSource) {
      if (this.MockDrillChecksSource.hasOwnProperty('values') && this.MockDrillChecksSource.values) {
        this.setEditValue();
        this.mockDrillChecksId = this.MockDrillChecksSource.values.id;
      }
    }
  }
  // Initialize FormNgModal
  initializeFormNgModal() {
    this.formNgModal.push({ question: '', answer: '', id: '', error: null });
  }
  // Set Edit Values 
  setEditValue() {
    for (let i of this.formNgModal) {
      i.question = this.MockDrillChecksSource.values.question;
      i.answer = this.MockDrillChecksSource.values.answer;
      i.id = this.MockDrillChecksSource.values.id
    }
    this._utilityService.detectChanges(this._cdr);
  }
  // cancel modal
  cancel() {
    this.closeFormModal();
  }
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.mockDrillChecksId = null;
    this._eventEmitterService.dismissMockDrillChecksModel();
  }
  // Reset Form
  resetForm() {
    for (let i of this.formNgModal) {
      i.id = '';
      i.question = '';
      i.answer = '';
      i.error = null;
    }
    this.formErrors = null;
    AppStore.disableLoading();
  }
  checkFormValid() {
    var formData = this.getDataPresent();
    if (formData.length > 0) return true;
    else return false;
  }
  // Validate & Get Data
  getDataPresent() {
    let stringifyData = JSON.stringify(this.formNgModal);
    let data = JSON.parse(stringifyData);
    for (var i = 0; i < data.length; i++) {
      if ((!data[i].question || data[i].question.trim() == '' || !data[i].answer || data[i].answer.trim() == '')) {
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
  // Save Checks
  save(close: boolean = false) {
    this.formErrors = null;
    this.clearFormNgModalError();
    let save;
    var saveData = this.createSaveData();
    AppStore.enableLoading();
    if (this.mockDrillChecksId) {
      save = this._mockDrillChecksService.updateItem(this.mockDrillChecksId, { question: saveData.question, answer: saveData.answer });
    } else {

      save = this._mockDrillChecksService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      if (!this.mockDrillChecksId) {
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
        // this.processFormErrors();
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    });
  }
  createSaveData() {
    var formData = this.getDataPresent();
    for (let i of formData) {
      delete i.error;
      if (!this.MockDrillChecksSource.values)
        delete i.id;
    }
    return formData[0];
  }


  clearFormNgModalError() {
    for (let i of this.formNgModal) {
      i.error = null;
    }
  }
}
