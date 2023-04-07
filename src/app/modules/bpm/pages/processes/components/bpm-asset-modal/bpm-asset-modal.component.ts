import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMappingService } from 'src/app/core/services/asset-management/asset-register/asset-mapping/asset-mapping.service';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { AssetTypesService } from 'src/app/core/services/masters/asset-management/asset-types/asset-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';
import { AssetTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-types-master.store';

@Component({
  selector: 'app-bpm-asset-modal',
  templateUrl: './bpm-asset-modal.component.html',
  styleUrls: ['./bpm-asset-modal.component.scss']
})
export class BpmAssetModalComponent implements OnInit {
  @Input('source') assetSource: any;
  AssetTypesMasterStore = AssetTypesMasterStore;
  AssetCategoryStore = AssetCategoryStore;
  AssetRegisterStore = AssetRegisterStore
  form: FormGroup;
  formErrors: any;
  isAlreadyExist: boolean;
  assetExist:boolean = false;


  constructor(private _assetCategoryService: AssetCategoryService,
    private _assetTypesService: AssetTypesService,
    private _utilityService: UtilityService,private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,private _assetRegisterService: AssetRegisterService,
    private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      asset_category_id:[null],
      asset_type:[null],
      asset_id:[null,[Validators.required]],
      description:[''],
    })
    this.getTypesList()
    this.getAssetMapping()
    if(this.assetSource.hasOwnProperty('values') && this.assetSource.values){
      let {asset_type,description}=this.assetSource.values
      this.form.patchValue({
        asset_type:asset_type,
        asset_id:this.assetSource.values,
        description:description
      })
    }
  }

  getTypesList(){
    this._assetTypesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getCategoryList(){
    this._assetCategoryService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  changeCategory(){
   this.getAssetMapping(this.form.value.asset_type.id)
  }

  closeCategory(){
    this.form.patchValue({
      asset_type :  null
    })
  }

  changeAsset(){
    this.isAlreadyExist = false;
  }

  getAssetMapping(id?) {
    let params = `&asset_type_ids=${id?id:''}`
    this._assetRegisterService.getItems(false,(params?params:'')).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchAssets(e){
    this._assetRegisterService.getItems(false,('&q='+e.term)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchCategory(e){
    this._assetCategoryService.getItems(false,('&q='+e.term)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchAssestTypes(e){
    this._assetTypesService.getItems(false,('&q='+e.term)).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }
  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i);
    }
    return returnValues;
  }

  

  addAssets(close:boolean=false){
    // let saveData = {
    //   asset_id : this.form.value.asset_id ? this.form.value.asset_id : null,
    //   description : this.form.value.description ? this.form.value.description : ''
    // }
    let asset_type
    if(this.form.value.asset_type){
      asset_type = {
        title : this.form.value.asset_type.title,
        id:this.form.value.asset_type.id,
  
      }
    }
    let obj = {
      title : this.form.value.asset_id.title,
      id :  this.form.value.asset_id.id,
      asset_type : asset_type ? asset_type :  '',
      description : this.form.value.description ? this.form.value.description : ''
    }
    if(this.assetSource.type != "app"){
      let pos = AdvanceProcessStore.assets.findIndex(e=>e.id == this.assetSource.values.id)
      if(pos != -1){
        AdvanceProcessStore.assets.splice(pos,1)
        AdvanceProcessStore.setAssets(obj)
      }
      
    }else {
      let pos = AdvanceProcessStore.assets.findIndex(e=>e.id == this.form.value.asset_id.id)
       if(pos != -1){
         this.isAlreadyExist = true
       }else{
        AdvanceProcessStore.setAssets(obj)
       }

    }
    this.resetForm()
    if(close && !this.isAlreadyExist)this.closeModal()
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  closeModal(){
  this._eventEmitterService.dismissBpmAssetModal()
  }



}
