import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { AssetSubCategoryService } from 'src/app/core/services/masters/asset-management/asset-sub-category/asset-sub-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';
import { AssetSubCategoryStore } from 'src/app/stores/masters/asset-management/asset-sub-category-store';

@Component({
  selector: 'app-asset-sub-category-modal',
  templateUrl: './asset-sub-category-modal.component.html',
  styleUrls: ['./asset-sub-category-modal.component.scss']
})
export class AssetSubCategoryModalComponent implements OnInit {
  @Input('source') AssetSubCategorySource: any;

  AppStore = AppStore;
  AssetCategoryStore = AssetCategoryStore;
  form: FormGroup;
  formErrors: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _assetSubCategoryService: AssetSubCategoryService,
    private _assetCategoriesService: AssetCategoryService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      asset_category_id: ['',[Validators.required]],
      description: ['']
    });


    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.AssetSubCategorySource) {
      this.setFormValues();
    }
  }
  ngDoCheck(){
    if (this.AssetSubCategorySource && ((this.AssetSubCategorySource.hasOwnProperty('values') && this.AssetSubCategorySource.values) || this.AssetSubCategorySource?.category_id) && !this.form.value.id)
      this.setFormValues();
    
  }

  setFormValues(){
    if (this.AssetSubCategorySource.hasOwnProperty('values') && this.AssetSubCategorySource.values) {
      let { id, title, asset_category_id, description } = this.AssetSubCategorySource.values
      this.form.setValue({
        id: id,
        title: title,
        asset_category_id: asset_category_id,
        description: description
      })
      this.searchAssetCategory({term: asset_category_id})
    }

    else if(this.AssetSubCategorySource?.category_id){
      this.form.patchValue({
        // id: id,
        // title: title,
        asset_category_id: this.AssetSubCategorySource?.category_id,
        // description: description
      })
      this.searchAssetCategory({term: this.AssetSubCategorySource?.category_id})
    }
  }

  getAssetCategories() {
    this._assetCategoriesService.getItems(false).subscribe(res => {
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
    this._eventEmitterService.dismissAssetSubCategoryControlModal();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._assetSubCategoryService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._assetSubCategoryService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        AssetSubCategoryStore.setLastInsertedId(res.id);
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

  searchAssetCategory(e){
    this._assetCategoriesService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

//getting button name by language
getButtonText(text){
  return this._helperService.translateToUserLanguage(text);
}

}
