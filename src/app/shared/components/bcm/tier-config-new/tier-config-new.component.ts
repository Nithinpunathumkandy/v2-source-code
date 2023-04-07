import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';

@Component({
  selector: 'app-tier-config-new',
  templateUrl: './tier-config-new.component.html',
  styleUrls: ['./tier-config-new.component.scss']
})
export class TierConfigNewComponent implements OnInit {

  @Input('source') source: any;

  BiaMatrixStore = BiaMatrixStore;
  AppStore = AppStore;
  form: FormGroup;
  formErrors: any;
  sampleArray=[{title:"1-7"},{title:"8-16"}]
  is_English: boolean=true;
  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      tier_name:[''],
      bia_scale:[''],
    })
    this.resetForm();
  }

  saveTierConfig(close:boolean=false){
    BiaMatrixStore.settierConfig(this.form.value)
    console.log("tier",BiaMatrixStore.tierConfig)
    if(close)this.closemsModal()
  }

  tabChange(status:boolean){
    this.is_English = status
    this.resetForm()
  }

  closemsModal(){
    this.resetForm();
    setTimeout(() => {
      this._eventEmitterService.dismissTierConfigModal()
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

}
