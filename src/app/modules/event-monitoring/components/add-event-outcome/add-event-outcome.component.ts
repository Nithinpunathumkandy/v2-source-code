import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { EventsService } from 'src/app/core/services/event-monitoring/events/events.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-add-event-outcome',
  templateUrl: './add-event-outcome.component.html',
  styleUrls: ['./add-event-outcome.component.scss']
})
export class AddEventOutcomeComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  EventsStore = EventsStore;
  AppStore = AppStore;
  selectedId: any = null;
  @Input('source') expectedOutcome: any;
  constructor(
    private _eventEmitterService: EventEmitterService,private _formBuilder: FormBuilder, private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _eventsService : EventsService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      title: ['',[Validators.required]],
    });
    if(this.expectedOutcome?.type=='Edit'){
      this.setFormValues();
    }
  }

  cancel() {
    this.form.reset();
    this._eventEmitterService.dismissEventOutcomesModalControl();
    this._utilityService.detectChanges(this._cdr)
  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  processData(){
    let saveData = {
      title: this.form.value.title ? this.form.value.title : '',
    }
    return saveData;
  }

  saveEventOutcome(close:boolean = false){
    this.formErrors = null;
    if (this.form.value) {
    let save;
    AppStore.enableLoading();
    
    if (this.form.value.id || this.expectedOutcome.type == "Edit") {
      let id = this.selectedId ? this.selectedId : this.expectedOutcome.values.id
      save = this._eventsService.updateOutcome(id, this.processData());
    } else {
      save = this._eventsService.saveOutcome(this.processData());
    }
    save.subscribe((res: any) => {
      if (!this.form.value.id) {
        this.resetForm();
      }
      AppStore.disableLoading();
      setTimeout(() => {
        if (close) {this.closeFormModal()};
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      // if (close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.closeFormModal();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  closeFormModal() {

    this.resetForm();
    this._eventEmitterService.dismissEventOutcomesModalControl();

  }

  setFormValues() {
    if (this.expectedOutcome.values) {
      let { title, description, id } = this.expectedOutcome.values
      this.form.patchValue({
        title: title,
        description: description,
        id: id
      })
      

    }
  }
}
