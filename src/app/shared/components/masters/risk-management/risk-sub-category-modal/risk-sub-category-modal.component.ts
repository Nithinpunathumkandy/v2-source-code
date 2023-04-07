import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RiskCategoryService } from 'src/app/core/services/masters/risk-management/risk-category/risk-category.service';
import { RiskSubCategoryService } from 'src/app/core/services/masters/risk-management/risk-sub-category/risk-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { RiskCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-category-store';

@Component({
  selector: 'app-risk-sub-category-modal',
  templateUrl: './risk-sub-category-modal.component.html',
  styleUrls: ['./risk-sub-category-modal.component.scss']
})
export class RiskSubCategoryModalComponent implements OnInit {

  @Input('source') RiskSubCategorySource: any;
  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  RiskCategoryMasterStore = RiskCategoryMasterStore;
  constructor(private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _riskSubCategoryService: RiskSubCategoryService,
    private _riskCategories:RiskCategoryService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    console.log("RiskSubCategorySource",this.RiskSubCategorySource);
    this.form = this._formBuilder.group({
      id: [null],
      risk_category_id: [null],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    this.resetForm();
    this.RiskCategories();

    if (this.RiskSubCategorySource) {
      this.setFormValues();
    }
  }

  ngDoCheck(){
    if (this.RiskSubCategorySource && this.RiskSubCategorySource.hasOwnProperty('values') && this.RiskSubCategorySource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.RiskSubCategorySource.hasOwnProperty('values') && this.RiskSubCategorySource.values){
      let { id,risk_category_id, title, description} = this.RiskSubCategorySource.values
      this.searchRiskCategory({term: risk_category_id});
      this.form.setValue({
        id: id,
        risk_category_id:risk_category_id,
        title: title,
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
  // close modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissRiskSubCategoryControlModal();
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
        save = this._riskSubCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._riskSubCategoryService.saveItem(this.form.value);
      }
  
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          setTimeout(()=>{
            this.closeFormModal();
          },500)
        }
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


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.closeFormModal();

    }

  }

  //getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

searchRiskCategory(event){
  this._riskSubCategoryService.getItems(false,'&q='+event.term).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })
}

  RiskCategories() {
    this._riskCategories.getItems().subscribe(() => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

}
