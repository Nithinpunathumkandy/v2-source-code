import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DesignationLevelService } from 'src/app/core/services/masters/human-capital/designation-level/designation-level.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-designation-level-modal',
  templateUrl: './designation-level-modal.component.html',
  styleUrls: ['./designation-level-modal.component.scss']
})
export class DesignationLevelModalComponent implements OnInit {
  @Input('source') DesignationLevelSource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;

  constructor(private _formBuilder: FormBuilder,
    private _designationLevelService: DesignationLevelService, private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      order: ['', [Validators.required]]
    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.DesignationLevelSource) {
      this.setFormValues();
    }
  }

  ngDoCheck(){
    if (this.DesignationLevelSource && this.DesignationLevelSource.hasOwnProperty('values') && this.DesignationLevelSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.DesignationLevelSource.hasOwnProperty('values') && this.DesignationLevelSource.values) {
      let { id, title, order } = this.DesignationLevelSource.values
      this.form.setValue({
        id: id,
        title: title,
        order: order
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
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }




  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissHumanCapitalDesignationlevelControlModal();

  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._designationLevelService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._designationLevelService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
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
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}

