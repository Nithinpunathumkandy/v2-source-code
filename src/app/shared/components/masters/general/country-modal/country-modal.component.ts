import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CountryService } from 'src/app/core/services/masters/general/country/country.service';
import { RegionMasterStore } from 'src/app/stores/masters/general/region-store';
import { RegionService } from 'src/app/core/services/masters/general/region/region.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss']
})
export class CountryModalComponent implements OnInit {
  @Input('source') CountrySource: any;
  AppStore = AppStore;
  RegionMasterStore = RegionMasterStore;
  countryAddForm: FormGroup;
  formErrors: any;
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService, private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _regionService: RegionService,
    private _countryService: CountryService) { }

  ngOnInit(): void {

    // Form Object to add Control Category

    this.countryAddForm = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      region_id: ['', [Validators.required]]
    });

    // restingForm on initial load
    this.resetForm();

    // getting region data
    this.getRegion();


    // Checking if Source has Values and Setting Form Value

    if (this.CountrySource) {
      this.setFormValues();
    }

  }

  ngDoCheck(){
    if (this.CountrySource && this.CountrySource.hasOwnProperty('values') && this.CountrySource.values && !this.countryAddForm.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.CountrySource.hasOwnProperty('values') && this.CountrySource.values) {
      let { id, title, region_id } = this.CountrySource.values
      this.countryAddForm.setValue({
        id: id,
        title: title,
        region_id: parseInt(region_id)
      })
    }
  }

  getRegion() {
    this._regionService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRegion(e) {
    this._regionService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // for resetting the form
  resetForm() {
    this.countryAddForm.reset();
    this.countryAddForm.pristine;
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
    this._eventEmitterService.dismissCountryControlModal();
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.countryAddForm.value) {
      let save;
      AppStore.enableLoading();

      if (this.countryAddForm.value.id) {
        save = this._countryService.updateItem(this.countryAddForm.value.id, this.countryAddForm.value);
      } else {
        delete this.countryAddForm.value.id
        save = this._countryService.saveItem(this.countryAddForm.value);
      }

      save.subscribe((res: any) => {
        if (!this.countryAddForm.value.id) {
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
