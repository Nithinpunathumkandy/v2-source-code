import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetLocationService } from 'src/app/core/services/masters/asset-management/asset-location/asset-location.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetLocationStore } from 'src/app/stores/masters/asset-management/asset-location-store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';

@Component({
  selector: 'app-asset-location-modal',
  templateUrl: './asset-location-modal.component.html',
  styleUrls: ['./asset-location-modal.component.scss']
})
export class AssetLocationModalComponent implements OnInit {
  @Input('source') AssetLocationSource: any;

  AppStore = AppStore;
  LocationMasterStore = LocationMasterStore;
  form: FormGroup;
  formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _assetLocationService: AssetLocationService,
    private _locationService: LocationService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      location_id: ['',[Validators.required]],
      description: ['']
    });


    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.AssetLocationSource) {
      this.setFormValues();
    }
    // if(this.AssetLocationSource && this.AssetLocationSource.component == 'assetLocation')
		// this.patchAssetLocationValue();
  }

  ngDoCheck(){
    if (this.AssetLocationSource && this.AssetLocationSource.hasOwnProperty('values') && this.AssetLocationSource.values && !this.form.value.id)
      this.setFormValues();
    // if(typeof(this.AssetLocationSource) == 'number' && !this.form.value.location_id){
    //   this.form.patchValue({location_id: this.AssetLocationSource});
    //   this.searchLocation({term: this.AssetLocationSource});
    // }
    
  }

  setFormValues(){
    if (this.AssetLocationSource.hasOwnProperty('values') && this.AssetLocationSource.values) {
      let { id, title, location_id, description } = this.AssetLocationSource.values
      this.form.patchValue({
        id: id,
        title: title,
        location_id: location_id,
        description: description
      })
      this.searchLocation({term: location_id})
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // patchAssetLocationValue(){
	// 	this.form.patchValue({
	// 		location_id: this.AssetLocationSource?.location_id
	// 	});
	// 	this.getLocation();
	// 	this._utilityService.detectChanges(this._cdr);
	// }

  getLocation() {
    this._locationService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
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
  
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAssetLocationControl();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._assetLocationService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._assetLocationService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        AssetLocationStore.setLastInsertedId(res.id);
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

  searchLocation(e){
    this._locationService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
