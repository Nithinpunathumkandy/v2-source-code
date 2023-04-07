import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventLessonLearnedService } from 'src/app/core/services/event-monitoring/event-lesson-learned/event-lesson-learned.service';

@Component({
  selector: 'app-add-lesson-learned',
  templateUrl: './add-lesson-learned.component.html',
  styleUrls: ['./add-lesson-learned.component.scss']
})
export class AddLessonLearnedComponent implements OnInit {

  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore
  UsersStore = UsersStore

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _lessonLearnedService: EventLessonLearnedService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      recommendation: [''],
      is_further_action_required: ["Yes"],
    });
    if (this.source?.type == 'Edit') {      
      this.setFormValues()
    }else{
      this.form.patchValue({        
        is_further_action_required: "1",
      })
    }
  }

  setFormValues() {
    this.form.patchValue({
      id: this.source?.values?.id,
      title: this.source?.values?.title,
      description: this.source?.values?.description,
      recommendation: this.source?.values?.recommendation,
      is_further_action_required: this.source?.values?.is_further_action_required.toString(),
    })
  }

  getSaveData() {
    let saveData = {
      id: this.form.value?.id ? this.form.value.id : null,
      is_further_action_required: this.form.value.is_further_action_required == "1" ? 1 : 0,
      title: this.form.value?.title ? this.form.value?.title : '',
      description: this.form.value?.description ? this.form.value?.description : '',
      recommendation: this.form.value?.recommendation ? this.form.value?.recommendation : '',
    }
    return saveData
  }

  save(close: boolean = false) {
    console.log(this.form.value)
    AppStore.enableLoading();
    let save;
    if (this.form.value.id) {
      save = this._lessonLearnedService.updateItem(this.form.value.id, this.getSaveData());
    }
    else {
      save = this._lessonLearnedService.saveItem(this.getSaveData());
    }
    save.subscribe(res => {
      AppStore.disableLoading();
      this.resetForm();
      if (close) this.cancel();
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    AppStore.disableLoading();
    this._eventEmitterService.dismissLessonLearnedModal();
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

}
