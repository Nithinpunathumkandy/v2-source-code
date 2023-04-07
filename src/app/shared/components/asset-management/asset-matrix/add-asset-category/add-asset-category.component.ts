import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMatrixService } from 'src/app/core/services/asset-management/asset-matrix/asset-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';

@Component({
  selector: 'app-add-asset-category',
  templateUrl: './add-asset-category.component.html',
  styleUrls: ['./add-asset-category.component.scss']
})
export class AddAssetCategoryComponent implements OnInit {
  form:FormGroup;
  AppStore = AppStore;
  AssetMatrixStore = AssetMatrixStore;
  AssetCategoryStore = AssetCategoryStore;
  formErrors = null;
  constructor(private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _assetCategoryService:AssetCategoryService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _assetMatrixService:AssetMatrixService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {
    this.form=this._formBuilder.group({
      asset_category_ids: [[]],
    })

    this.setAssetCategories();
  }

  setAssetCategories(){
    this.form.patchValue({
      asset_category_ids:this.getCategories()
    })
    this.getAssetCategory();
  }


  getCategories(){
    let categoryList=[];
    for(let i of AssetMatrixStore.individualAssetMatrixDetails.asset_categories){
      categoryList.push(i.id);
    }
    return categoryList;
  }

  getAssetCategory(){
    this._assetCategoryService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  searchAssetCategory(event){
    this._assetCategoryService.getItems(false,'?q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }



  resetForm(){
    this.form.reset();
  }


  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissAssetCategoryFormModal();
    // Emitting Event To set the Style in Parent Component(MODAL)
    // this._eventEmitterService.setModalStyle();
  }


  getCategoryIds(){
    let data={
      asset_category_ids: this.getIds(this.form.value.asset_category_ids)
    }
    return data;
  }

  getIds(data){
    let catArray=[];
    for(let i of data){
      catArray.push(i.id);
    }
    return catArray;
  }

  
    
processFormErrors(){
  var errors = this.formErrors;
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      if(key.startsWith('asset_category_ids.')){
        let errordata = this.form.value.asset_category_ids;
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        let data;
       let pos =  AssetCategoryStore.allItems.findIndex(e=>e.id==errordata[errorPosition]);
       if(pos!=-1){
        data = AssetCategoryStore.allItems[pos].title;
       }
        console.log(keyValueSplit);
        let subdata = errors[key][0].split(errorPosition);

        this.formErrors['asset_category_ids'] =this.getButtonText('asset_category')+' '+data+''+subdata[1];

        // this.formErrors['asset_category_index'] = errorPosition;
        // console.log(this.formErrors.asset_category_index);
        // console.log(errors[key]);
      }
     
    }
  }
  this._utilityService.detectChanges(this._cdr);
}


  saveCategory(close:boolean = false){
    AppStore.enableLoading();
    this.formErrors = null;
    this._assetMatrixService.updateCategory(AssetMatrixStore.individualAssetMatrixDetails.id,this.form.value).subscribe(res=>{
      AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr)
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          this.processFormErrors();
        }
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });


  }

    
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

}
