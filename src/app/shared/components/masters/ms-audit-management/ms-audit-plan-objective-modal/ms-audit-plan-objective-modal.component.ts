import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditPlanObjectiveService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-plan-objective/ms-audit-plan-objective.service';

@Component({
  selector: 'app-ms-audit-plan-objective-modal',
  templateUrl: './ms-audit-plan-objective-modal.component.html',
  styleUrls: ['./ms-audit-plan-objective-modal.component.scss']
})
export class MsAuditPlanObjectiveModalComponent implements OnInit {


  @Input('source') MsAuditPlanObjectiveSource: any;

  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _msAuditPlanObjectiveService: MsAuditPlanObjectiveService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
    this.resetForm();
    // Checking if Source has Values and Setting Form Value
    if (this.MsAuditPlanObjectiveSource) {
      this.setFormValues();
    }
  }

  ngDoCheck() {
    if (this.MsAuditPlanObjectiveSource && this.MsAuditPlanObjectiveSource.hasOwnProperty('values') && this.MsAuditPlanObjectiveSource.values && !this.form.value.id)
      this.setFormValues();
  }

  // Set Form Values
  setFormValues() {
    if (this.MsAuditPlanObjectiveSource.hasOwnProperty('values') && this.MsAuditPlanObjectiveSource.values) {
      let { id, title, description } = this.MsAuditPlanObjectiveSource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description
      })

    }
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal(id?) {
    this.resetForm();
    this._eventEmitterService.dismissMsAuditPlanObjectiveModal(id);
  }

  //Save / Update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._msAuditPlanObjectiveService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._msAuditPlanObjectiveService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(res.id);
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
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancel();

    }

  }


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
}
