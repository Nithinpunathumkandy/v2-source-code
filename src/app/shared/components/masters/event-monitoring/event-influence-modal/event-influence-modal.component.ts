import { order } from '@amcharts/amcharts4/.internal/core/utils/Number';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventInfluenceService } from 'src/app/core/services/masters/event-monitoring/event-influence/event-influence.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventInfluenceMasterStore } from 'src/app/stores/masters/event-monitoring/event-influence-store';

@Component({
  selector: 'app-event-influence-modal',
  templateUrl: './event-influence-modal.component.html',
  styleUrls: ['./event-influence-modal.component.scss']
})
export class EventInfluenceModalComponent implements OnInit {

  @Input('source') EventInfluenceSource: any;

  EventInfluenceMasterStore = EventInfluenceMasterStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  Order: string[] = [];
  constructor(
    private _eventInfluenceServiceService: EventInfluenceService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      order: ['', [Validators.required]],
      description: ['']
    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.EventInfluenceSource) {
      this.setFormValues();
    }

    this.setPercentageData();
  }

  setPercentageData() {
    for (let i = 0; i <= 6; i++) {
      this.Order.push(i +'');
      
    }
  }

  ngDoCheck() {
    if (this.EventInfluenceSource && this.EventInfluenceSource.hasOwnProperty('values') && this.EventInfluenceSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.EventInfluenceSource.hasOwnProperty('values') && this.EventInfluenceSource.values) {
      let { id, title, order, description } = this.EventInfluenceSource.values
      this.form.setValue({
        id: id,
        title: title,
        order: order,
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
    // FormErrorStore.setErrors(null);
    this.closeFormModal();


  }
  // getting description count

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissEventInfluenceControlModal();
  }


  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._eventInfluenceServiceService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._eventInfluenceServiceService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        this.EventInfluenceMasterStore.lastInsertedId = res.id
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
