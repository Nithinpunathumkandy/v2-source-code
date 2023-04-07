import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetencyGroupService } from 'src/app/core/services/masters/human-capital/competency-group/competency-group.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-competency-group-modal',
  templateUrl: './competency-group-modal.component.html',
  styleUrls: ['./competency-group-modal.component.scss']
})
export class CompetencyGroupModalComponent implements OnInit {

  @Input('source') CompetencyGroupSource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  constructor(private _formBuilder: FormBuilder,
    private _helperService: HelperServiceService,
    private _competencyGroupService: CompetencyGroupService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.CompetencyGroupSource) {
      this.setFormValues();
    }
  }

  ngDoCheck(){
    if (this.CompetencyGroupSource && this.CompetencyGroupSource.hasOwnProperty('values') && this.CompetencyGroupSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.CompetencyGroupSource.hasOwnProperty('values') && this.CompetencyGroupSource.values) {
      let { id, title } = this.CompetencyGroupSource.values
      this.form.setValue({
        id: id,
        title: title
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
    this._eventEmitterService.dismissHumanCapitalCompetencyGroupControlModal();

  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._competencyGroupService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._competencyGroupService.saveItem(this.form.value);
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
