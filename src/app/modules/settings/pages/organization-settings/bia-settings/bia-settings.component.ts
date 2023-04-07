import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { BiaSettingStore } from 'src/app/stores/settings/bia-settings.store';

@Component({
  selector: 'app-bia-settings',
  templateUrl: './bia-settings.component.html',
  styleUrls: ['./bia-settings.component.scss']
})
export class BiaSettingsComponent implements OnInit {

  BiaForm:FormGroup;
  BiaSettingStore =BiaSettingStore;
  BiaRatingStore = BiaRatingStore
  AppStore = AppStore;
  AuthStore = AuthStore;
  buttonDisabled:boolean = true;
  formErrors: any;
  constructor(private _biaSettingService:BiaSettingsService,
    private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _biaRatingService:BiaRatingService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.biaRating();
    this.getItems();
    this.BiaForm = this._formBuilder.group({
      id: [null],
      is_impact_scenario:[null],
      is_impact_area: [null],
      recommended_rto_rating_id: [null,Validators.required],
      recommended_mtpd_rating_id: [null,Validators.required],
    })
  }

  getItems(){
    this._biaSettingService.getItems().subscribe(()=> this.setFormValues())
  }

  biaRating(newPage: number = null) {
    this._biaRatingService.getItems(false,null,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchBiaRating(e) {
    this._biaRatingService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setFormValues(){
    let biaSettingValue = BiaSettingStore?.BiaSettingsItems;
    this.BiaForm.setValue({
      id: biaSettingValue?.id,
      is_impact_scenario:biaSettingValue?.is_impact_scenario ? true : false,
      is_impact_area: biaSettingValue?.is_impact_area ? true : false,
      recommended_rto_rating_id: biaSettingValue?.recommended_rto_rating.id,
      recommended_mtpd_rating_id: biaSettingValue?.recommended_mtpd_rating.id ,
    })
  }

  submit(){
    this.formErrors = null
    if (this.BiaForm.value) {
      let save;
      AppStore.enableLoading();
      save = this._biaSettingService.updateItem(this.BiaForm.value);
      save.subscribe((res: any) => {
        this.buttonDisabled = true;
        this.getItems();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.buttonDisabled = true;
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  impactScenarioChange(event){
    if(!event.target.checked){
      this.BiaForm.patchValue({
        is_impact_area:event.target.checked
      })
    }
  }

  impactAreaChange(event){
    if(event.target.checked){
      this.BiaForm.patchValue({
        is_impact_scenario:event.target.checked
      })
    }
  }

}
