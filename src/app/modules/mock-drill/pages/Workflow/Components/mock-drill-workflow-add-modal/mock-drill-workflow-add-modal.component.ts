import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillWorkflowService } from 'src/app/core/services/mock-drill/mock-drill-workflow/mock-drill-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MockDrillWorkflowStore } from 'src/app/stores/mock-drill/mock-drill-workflow/mock-drill-workflow-store';

@Component({
  selector: 'app-mock-drill-workflow-add-modal',
  templateUrl: './mock-drill-workflow-add-modal.component.html',
  styleUrls: ['./mock-drill-workflow-add-modal.component.scss']
})
export class MockDrillWorkflowAddModalComponent implements OnInit {

  @Input('source') WorkFlowSource: any;

  form: FormGroup;
  formErrors: any;
  mockDrillWorkflowSubHead
  AppStore = AppStore;
  moduleGroupId
  MockDrillWorkflowStore = MockDrillWorkflowStore;

  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _mockDrillWorkflowService: MockDrillWorkflowService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      module_id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
    this.resetForm()
    if (this.WorkFlowSource) {
      if (this.WorkFlowSource.module_id) {
        this.moduleGroupId = this.WorkFlowSource.module_id
      }

      if (this.WorkFlowSource.hasOwnProperty('values') && this.WorkFlowSource.values) {
        let { id, title, module_ids, description } = this.WorkFlowSource.values

        this.form.setValue({
          id: id,
          module_id: module_ids ? module_ids : '',
          title: title ? title : '',
          description: description ? description : ''
        })
        this.mockDrillWorkflowSubHead = description;
      }
    }
    this.getModuleData()
  }

  save(close: boolean = false) {
    let saveData = {
      "module_id": this.form.value.module_id ? this.form.value.module_id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      "description": this.mockDrillWorkflowSubHead ? this.mockDrillWorkflowSubHead : ''
    };
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._mockDrillWorkflowService.updateItem(this.form.value.id, saveData);
      } else {
        delete this.form.value.id
        save = this._mockDrillWorkflowService.saveItem(saveData);
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);

        if (close) this.close();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  getModuleData() {
    this._mockDrillWorkflowService.getModuleItems('?module_group_ids=' + this.moduleGroupId + '&is_workflow=true').subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  cancel() {
    this.close();
  }

  close() {
    this.resetForm();
    this._eventEmitterService.dismissWrmWorkflowAddModal()
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    this.mockDrillWorkflowSubHead = '';
    AppStore.disableLoading();
  }
}
