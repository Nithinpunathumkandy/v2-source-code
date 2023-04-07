import {HttpErrorResponse} from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IReactionDisposer } from 'mobx';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { AmAuditPreliminaryReportsService } from 'src/app/core/services/audit-management/am-audit-preliminary-reports/am-audit-preliminary-reports.service';
declare var $: any;

@Component({
  selector: 'app-am-report-update-modal',
  templateUrl: './am-report-update-modal.component.html',
  styleUrls: ['./am-report-update-modal.component.scss']
})
export class AmReportUpdateModalComponent implements OnInit {
  @Input('source') reportObject: any

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  formErrors = null;
  AppStore = AppStore;
  AuthStore = AuthStore;

  UsersStore = UsersStore;

  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',

      '|',

      'bulletedList',
      'numberedList',

    ],
    language: 'id',

  };

  public Editor;
  // public Config;

  constructor(private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _preliminaryReportService: AmAuditPreliminaryReportsService) {
    this.Editor = myCkEditor;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  ngOnInit(): void {

    this.form = this._formBuilder.group({
      description: ['', [Validators.required]]
    })

    // if (this.reportObject?.type == 'Edit') {
      this.setFormValues();
    // }

  }
  setFormValues() {
    if (this.reportObject?.hasOwnProperty('values') && this.reportObject?.values) {
      this.form.patchValue({
        description: this.reportObject.values
      })
    }
  }

  closeFormModal() {
    this._eventEmitterService.dismissAmReportUpdateModal();
  }

  saveRequest(close: boolean = false) {
    this.formErrors = null;
    let save;
    AppStore.enableLoading();
    if(this.reportObject.component=='preliminary')
    save = this._preliminaryReportService.updateItem(this.reportObject.audit_id, this.reportObject.report_id, this.reportObject.content_id, this.form.value);
    else if(this.reportObject.component=='draft')
    
    save = this._preliminaryReportService.updateItem(this.reportObject.audit_id, this.reportObject.report_id, this.reportObject.content_id, this.form.value);
    else
    save = this._preliminaryReportService.updateItem(this.reportObject.audit_id, this.reportObject.report_id, this.reportObject.content_id, this.form.value);
   
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr)
      if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    });

  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy() {

  }

}
