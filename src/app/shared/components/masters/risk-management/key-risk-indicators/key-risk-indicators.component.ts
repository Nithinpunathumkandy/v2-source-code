import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { KeyriskindicatorsService } from 'src/app/core/services/masters/risk-management/key-risk-indicators/keyriskindicators.service';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';

@Component({
  selector: 'app-key-risk-indicators',
  templateUrl: './key-risk-indicators.component.html',
  styleUrls: ['./key-risk-indicators.component.scss']
})
export class KeyRiskIndicatorsComponent implements OnInit {
  
  RiskCategoryMasterStore=RiskCategoryMasterStore;

  @Input('source') keyRiskSource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  UnitMasterStore = UnitMasterStore;

  constructor(
    private _formBuilder: FormBuilder,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService,
    private _riskCategoryService:RiskCategoryService,
    private _keyRiskIndicatorService:KeyriskindicatorsService,
    private _unitService: UnitService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      risk_category_id:[''],
      unit_id:['']
    });

    this.resetForm()
    if (this.keyRiskSource) {
      this.getUnit();
      this.getCategory();
      this.setFormValues();
    }
  }

  // getting description count

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}
  
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._keyRiskIndicatorService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._keyRiskIndicatorService.saveItem(this.form.value);
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
        let { id, title, description,risk_category_id,unit} = this.keyRiskSource.values
        this.form.patchValue({
          id: id,
          title: title,
          description:description,
          risk_category_id:risk_category_id,
          unit_id:unit
        })
  
      }
    }

  cancel(){
    this.closeFormModal();
  }
  
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismisskeyRiskIndicatorModal();
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

  
  getUnit() {
    this._unitService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchRiskCategory(e,patchValue:boolean=false){
    this._riskCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  searchRiskUnit(e) {
    this._unitService.searchItem('?q=' + e.term).subscribe(res => {
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
