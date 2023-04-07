import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { KeyriskindicatorsService } from 'src/app/core/services/masters/risk-management/key-risk-indicators/keyriskindicators.service';
import { KeyRiskIndicatorsMasterStore } from 'src/app/stores/masters/risk-management/key-risk-indicators-master-store';
import { UnitStore } from 'src/app/stores/general/unit.store';
import { UnitService } from 'src/app/core/services/general/unit/unit.service';
import { KriService } from 'src/app/core/services/risk-management/risks/kri/kri.service';
// import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IsmsKeyRiskIndicatorService } from 'src/app/core/services/isms/isms-risks/isms-key-risk-indicator/isms-key-risk-indicator.service';


declare var $: any;
@Component({
  selector: 'app-add-kri-modal',
  templateUrl: './add-kri-modal.component.html',
  styleUrls: ['./add-kri-modal.component.scss']
})
export class AddKriModalComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('unitFormModal') unitFormModal: ElementRef;
  RiskCategoryMasterStore=RiskCategoryMasterStore;

  @Input('source') keyRiskSource: any;
  @Input('riskCategory') riskCategory:any
  form: FormGroup;
  AppStore = AppStore;
  AuthStore = AuthStore;
  formErrors: any;
  
  keyRiskMasterObject = {
    component: 'Master',
    values: null,
    type: null
  };
  addUnitObject={
    component:'Risk',
    type:null
  }
  keyRiskIndicatorSubscriptionEvent:any;
  unitModalSubscriptionEvent:any;
  KeyRiskIndicatorsMasterStore = KeyRiskIndicatorsMasterStore;
  UnitStore = UnitStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;


  constructor(
    private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService,
    private _riskCategoryService:RiskCategoryService,
    private _keyRiskIndicatorService:KeyriskindicatorsService,
    private _unitService:UnitService,
    private _kriService:KriService,
    private _ismsKriService:IsmsKeyRiskIndicatorService,
    private _renderer2:Renderer2
  ) { }

  ngOnInit(): void {
    // console.log(RisksStore.riskId);

    this.form = this._formBuilder.group({
      id:[null],
      key_risk_indicator_id: [null],
      risk_category_id: [null],
      unit_id: [null],
      predicted_exposure:[''],
      actual_exposure:['']
    });

    this.resetForm()
    if (this.keyRiskSource || this.riskCategory) {
      this.getCategory();
      this.setFormValues();
    }
    this.keyRiskIndicatorSubscriptionEvent = this._eventEmitterService.keyRiskIndicator.subscribe(res => {
      this.closeKRIModal();
    })

        // closing child modal
        this.unitModalSubscriptionEvent = this._eventEmitterService.humanCapitalUnitControl.subscribe(res => {
          this.closeUnitFormModal();
        })

        this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
          if(!status){
            this.changeZIndex();
          }
        })
    
        this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
          if(!status){
            this.changeZIndex();
          }
        })
  }

    
  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    if($(this.unitFormModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.unitFormModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.unitFormModal.nativeElement,'overflow','auto');
    }
    
  }


addNewItem(){
  this.keyRiskMasterObject.type = 'Add';
  this.keyRiskMasterObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openKRIModal();
}


openKRIModal() {
  setTimeout(() => {
    ($(this.formModal.nativeElement)as any).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
    
  }, 50);
}
  

closeKRIModal() {
  if (KeyRiskIndicatorsMasterStore.lastInsertedId) {
    this.form.patchValue({ key_risk_indicator_id: KeyRiskIndicatorsMasterStore.lastInsertedId });
    this.getKRI()
  }
  ($(this.formModal.nativeElement)as any).modal('hide');
  this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99'); // For Modal to Get Focus
  
  this.keyRiskMasterObject.type = null;
}

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        if(this.keyRiskSource.component == 'isms'){
          save = this._ismsKriService.updateItem(this.form.value.id, this.form.value);
        }
        else
        save = this._kriService.updateItem(this.form.value.id, this.form.value);
      } else {
        if(this.keyRiskSource.component == 'isms'){
          save = this._ismsKriService.saveItem(this.form.value);
        }
        else
        save = this._kriService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
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
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
         
      });
    }
    }

    setFormValues(){
      
      if (this.keyRiskSource.hasOwnProperty('values') && this.keyRiskSource.values) {
        let { id, key_risk_indicator_id, risk_category_id,actual_exposure,predicted_exposure,unit_id} = this.keyRiskSource.values
        this.form.patchValue({
        id: id,
        key_risk_indicator_id: key_risk_indicator_id,
        risk_category_id:risk_category_id,
        actual_exposure:actual_exposure,
        predicted_exposure:predicted_exposure,
        unit_id:unit_id
        })
        this.searchUnit({term:this.form.value.unit_id});
        this.searchKRI({term:this.form.value.key_risk_indicator_id});
        
      
      }
      else if(this.riskCategory){
        this.form.patchValue({
          risk_category_id:this.riskCategory
        })
      }

      this.searchRiskCategory({term:this.form.value.risk_category_id});
  
    }

  cancel(){
    this.closeFormModal();
  }
  
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissKRIModal();
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  getCategory(){
    this._riskCategoryService.getItems(false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchRiskCategory(e,patchValue:boolean=false){
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  getKRI(){
    this._keyRiskIndicatorService.getItems(false).subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchKRI(e,patchValue:boolean=false){
    this._keyRiskIndicatorService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  setKriValues(id){
    const index: number = KeyRiskIndicatorsMasterStore.allItems.findIndex(e => e.id == id);
    if(index!=-1){
      this.form.patchValue({
        unit_id:KeyRiskIndicatorsMasterStore.allItems[index].unit_id
      })
      this.searchUnit({term:this.form.value.unit_id})
    }
  }

  getUnit(){
    this._unitService.getUnits().subscribe(res =>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchUnit(e,patchValue:boolean=false){
    this._unitService.getUnits('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  addNewUnit(){
    setTimeout(() => {
      $(this.unitFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.unitFormModal.nativeElement,'z-index','99999'); // For Modal to Get Focus
    }, 500);
  }

  closeUnitFormModal(){
    $(this.unitFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.unitFormModal.nativeElement,'z-index','99');
    if (UnitMasterStore.lastInsertedId) {
      this.form.patchValue({ unit_id: UnitMasterStore.lastInsertedId });
      this.getUnit()
    }
  }

  ngOnDestroy(){
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.keyRiskIndicatorSubscriptionEvent.unsubscribe();
    this.unitModalSubscriptionEvent.unsubscribe();
  }

}
