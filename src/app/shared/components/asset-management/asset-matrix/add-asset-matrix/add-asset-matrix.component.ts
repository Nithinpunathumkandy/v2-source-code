import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetMatrixService } from 'src/app/core/services/asset-management/asset-matrix/asset-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetCalculationMethodService } from 'src/app/core/services/masters/asset-management/asset-calculation-method/asset-calculation-method.service';
import { AssetCategoryService } from 'src/app/core/services/masters/asset-management/asset-category/asset-category.service';
import { AssetMatrixCategoriesService } from 'src/app/core/services/masters/asset-management/asset-matrix-categories/asset-matrix-categories.service';
import { AssetOptionValuesService } from 'src/app/core/services/masters/asset-management/asset-option-values/asset-option-values.service';
import { AssetRatingsService } from 'src/app/core/services/masters/asset-management/asset-ratings/asset-ratings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { AssetCalculationMethodMasterStore } from 'src/app/stores/masters/asset-management/asset-calculation-method';
import { AssetCategoryStore } from 'src/app/stores/masters/asset-management/asset-category-store';
import { AssetMatrixCategoriesMasterStore } from 'src/app/stores/masters/asset-management/asset-matrix-categories';
import { AssetOptionValuesMasterStore } from 'src/app/stores/masters/asset-management/asset-option-values-store';
import { AssetRatingsMasterStore } from 'src/app/stores/masters/asset-management/asset-ratings-store';
declare var $: any;
@Component({
  selector: 'app-add-asset-matrix',
  templateUrl: './add-asset-matrix.component.html',
  styleUrls: ['./add-asset-matrix.component.scss']
})
export class AddAssetMatrixComponent implements OnInit {
  @Input ('source') AssetMatrixSource:any;
  @ViewChild('matrixCategoryModal') matrixCategoryModal:ElementRef;
  @ViewChild('categoryModal') categoryModal:ElementRef;
  
  form:FormGroup;
  AppStore = AppStore;
  AssetCategoryStore = AssetCategoryStore;
  AssetMatrixCategoriesMasterStore = AssetMatrixCategoriesMasterStore;
  AssetCalculationMethodMasterStore = AssetCalculationMethodMasterStore;
  AssetOptionValuesMasterStore = AssetOptionValuesMasterStore;
  AssetRatingMasterStore = AssetRatingsMasterStore;
  AssetMatrixStore = AssetMatrixStore;
  formErrors = null;
  ratingArray=[];
  saveData:any=null;
  
  assetMatrixCategoriesObject = {
    type: null,
  }

  assetCategoryObject = {
    type: null,
  }

  AssetMatrixCategoriesModalSubscription:any;
  assetCategorySubscriptionEvent:any;
  toOverlapped = [];
  fromOverlapped = [];
  overlapped = [];

  constructor(private _eventEmitterService:EventEmitterService,
    private _formBuilder:FormBuilder,
    private _helperService:HelperServiceService,
    private _assetCategoryService:AssetCategoryService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _assetMatrixCategoryService:AssetMatrixCategoriesService,
    private _assetCalculationMethodService:AssetCalculationMethodService,
    private _assetMatrixService:AssetMatrixService,
    private _assetOptionValuesService:AssetOptionValuesService,
    private _assetRatingsService:AssetRatingsService,
    private _renderer2:Renderer2,
    private _router:Router) { }

  ngOnInit(): void {

    this.form=this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description:[''],
      asset_calculation_method_id:[null],
      asset_option_value_ids:[[]],
      asset_matrix_category_ids:[[],Validators.required],
      asset_category_ids:[[],Validators.required],
      asset_rating_scores:[[],Validators.required],

    })
    

    this.getCalculationMethods();
    this.getOptionValue();
    this.getAssetRating();
    if(this.AssetMatrixSource.type=='edit'){
      this.setFormValues();
    }

    this.AssetMatrixCategoriesModalSubscription = this._eventEmitterService.AssetMatrixCategories.subscribe(res => {
      this.closeMatrixCategory();
    })

    this.assetCategorySubscriptionEvent = this._eventEmitterService.AssetCategory.subscribe(res => {
      this.closeAssetCategory();
    })
  }

  setFormValues(){
    this._assetMatrixService.getItem(this.AssetMatrixSource.id).subscribe(res=>{
      this.form.patchValue({
        id: res['id'],
        title: res['title'],
        description:res['description'],
        asset_calculation_method_id:res['asset_calculation_method']?.id,
        asset_option_value_ids:this.getIds(res['asset_option_values']),
        asset_matrix_category_ids:this.getData(res['asset_matrix_categories'],'matrix'),
        asset_category_ids:this.getData(res['asset_categories']),
        asset_rating_scores:this.getData(res['asset_ratings']),
      })
      for(let i of res['asset_ratings']){
        this.ratingArray.push({asset_rating_id:i.asset_rating?.id,title:i.asset_rating?.language[0]?.pivot?.title,score_from:i.score_from,score_to:i.score_to,label:i.label})
        this._utilityService.detectChanges(this._cdr);
      }    
      this.ratingArray.reverse();
      this._utilityService.detectChanges(this._cdr);
    })
    
    
  }


  getData(data,type?){

    let dataArray = [];
    for(let i of data){
      if(type=='matrix'){
        i['title']=i.asset_matrix_category.title;
        i['id'] = i.asset_matrix_category?.id

      }
      
      dataArray.push(i);
    }
    return data;
  }



  resetForm(){
    this.form.reset();
  }

  
  closeFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissAssetMatrixFormModal();
    
    // Emitting Event To set the Style in Parent Component(MODAL)
    // this._eventEmitterService.setModalStyle();
  }

     //getting button name by language
     getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
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

    getMatrixCategory(){
      this._assetMatrixCategoryService.getItems().subscribe(res=>{
        this._utilityService.detectChanges(this._cdr)
      })
    }

    searchMatrixCategory(event){
      this._assetMatrixCategoryService.getItems(false,'?q='+event.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }

    getCalculationMethods(){
      this._assetCalculationMethodService.getItems().subscribe(res=>{
        if(this.AssetMatrixSource.type=='add'){
          this.form.patchValue({
            asset_calculation_method_id:res['data'][0].id
          })
        }
       
        this._utilityService.detectChanges(this._cdr);
      })
    }

    setCalculationMethod(id){
      this.form.patchValue({
        asset_calculation_method_id:id
      })
    }

    getOptionValue(){
      this._assetOptionValuesService.getItems().subscribe(res=>{
        if(this.AssetMatrixSource.type=='add'){
          this.form.patchValue({
            asset_option_value_ids:this.getIds(res['data'])
          })
        }
       
        this._utilityService.detectChanges(this._cdr)
      })
    }

    setOptionValue(id){
     let optionArray=this.form.value.asset_option_value_ids;
      let pos = optionArray.findIndex(e=>e == id);
      if(pos!=-1){
        optionArray.splice(pos,1)
        let pos2 = this.ratingArray.findIndex(e=>e.asset_rating_id == id);
        if(pos2!=-1)
          this.ratingArray.splice(pos2,1)
      }
        
      else{
        optionArray.push(id);
        let pos3 = AssetRatingsMasterStore.allItems.findIndex(e=>e.id == id);
        if(pos3!=-1)
        this.ratingArray.push({asset_rating_id:id,title:AssetRatingsMasterStore.allItems[pos3]?.title,label:AssetRatingsMasterStore.allItems[pos3]?.label,score_from:null,score_to:null})
        
      }
      
      this.form.patchValue({
        asset_option_value_ids:optionArray
      })
    }

    isOptionValuePresent(id){
      let opArray=this.form.value.asset_option_value_ids;
      let pos = opArray.findIndex(e=>e == id);
      if(pos!=-1)
      return true;
      else return false;
    }

    getAssetRating(){
      this._assetRatingsService.getItems().subscribe(res=>{
        if(this.AssetMatrixSource.type=='add'){
        for(let i=0;i<res['data']?.length;i++){
          this.fromOverlapped[i] = false;
          this.toOverlapped[i] = false;

          this.ratingArray.push({asset_rating_id:res['data'][i].id,title:res['data'][i].title,label:res['data'][i].label,score_from:null,score_to:null})
          
        }
        this.ratingArray.reverse();
      }
       
        this._utilityService.detectChanges(this._cdr)
      })
    }

    setLevelRange(event,id,type,index){
      // for(let i of this.ratingArray){
        let count = 0;
        let pos = this.ratingArray.findIndex(e=>e.asset_rating_id == id)
        if(pos!=-1){
          let pos3 = this.ratingArray.findIndex(e=>e.score_from == e.score_to)
          if(pos3!=-1)
          this.overlapped[index] = true
          if(type=='from'){
            for(let i=0;i<this.ratingArray.length;i++){
              if(i!=pos){
                // this.ratingArray[i].score_from==null
                if(((parseInt(this.ratingArray[i].score_from)<parseInt(event.target.value)) && (parseInt(this.ratingArray[i].score_to)>parseInt(event.target.value))) || (this.ratingArray[i].score_from==event.target.value) || (this.ratingArray[i].score_to==event.target.value)){
                  count++;
                

                }
               
              
              }
             
            }
            if(count==0){
              
                this.ratingArray[pos].score_from = event.target.value;
                this.fromOverlapped[index] = false;
                
            
            }
            else{
              this.fromOverlapped[index] = true;
            }
            
          }
          
        else{
          count=0;
          for(let i=0;i<this.ratingArray.length;i++){
            if(i!=pos){
              if(((parseInt(this.ratingArray[i].score_from)<parseInt(event.target.value)) && (parseInt(this.ratingArray[i].score_to)>parseInt(event.target.value))) || (this.ratingArray[i].score_from==event.target.value) || (this.ratingArray[i].score_to==event.target.value)){
                count++
              }

             
            }
           
          }

          if(count==0){
              
            this.ratingArray[pos].score_to = event.target.value;
            this.toOverlapped[index]=false;
            
        
        }
        else{
          this.toOverlapped[index] = true;
        }
        }
        
        }
       
      // }
        
    }

    isOverlapped(){
      let pos1 = this.fromOverlapped.findIndex(e=>e==true);
      let pos2 = this.toOverlapped.findIndex(t=>t==true);
      if(pos1!=-1 || pos2!=-1){
        return true;
      }
    }

    isPresentInRating(id){
      let pos2 = this.ratingArray.findIndex(e=>e.asset_rating_id == id);
      if(pos2!=-1)
        return true;
      else
        return false;
    }

    // getRating(id,type){
    //   let pos2 = this.ratingArray.findIndex(e=>e.asset_rating_id == id);
    //   if(pos2!=-1){
    //     if(type=='from')
    //       return this.ratingArray[pos2].score_from;
    //     else
    //       return this.ratingArray[pos2].score_to;
    //   }
        
    // }

    getIds(data){
      let dataArray=[];
      for(let i of data){
        dataArray.push(i.id);
      }
      return dataArray;
    }

    getMatrixCategories(data){
      let matrixArray=[];
      for(let cat of data){
        matrixArray.push({"asset_matrix_category_id":cat.id})
      }
      return matrixArray;
    }



    getSaveData(){
      this.saveData={
      title:this.form.value.title,
      description:this.form.value.description,
     asset_calculation_method_id:this.form.value.asset_calculation_method_id,
      asset_option_value_ids:this.form.value.asset_option_value_ids,
      asset_matrix_category_ids:this.getMatrixCategories(this.form.value.asset_matrix_category_ids),
      asset_category_ids:this.getIds(this.form.value.asset_category_ids),
      asset_rating_scores:this.processRatingArray(this.ratingArray),


      }
    
     
    }

    processRatingArray(data){
      let rating = [];
      for(let i of data){
        rating.push({asset_rating_id:i.asset_rating_id,score_from:i.score_from,score_to:i.score_to})
      }
      return rating;
    }


    save(close:boolean=false){
      this.getSaveData();
      this.formErrors = null;
      AppStore.enableLoading();
      let save;
      if (this.form.value.id) {
        save = this._assetMatrixService.updateItem(this.form.value.id, this.saveData);
      } else {
        //delete this.form.value.id
        save = this._assetMatrixService.saveItem(this.saveData);
      }
  
     save.subscribe((res:any)=>{
      AssetMatrixStore.assetMatrixId = res['id'];
       console.log(res,'res')
        AppStore.disableLoading();
        
        this._utilityService.detectChanges(this._cdr)
        if (close) {
          this.closeFormModal();
          this._router.navigateByUrl(`asset-management/asset-matrix/${res['id']}`);
        }
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

    
processFormErrors(){
  var errors = this.formErrors;
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      if(key.startsWith('asset_category_ids.')){
        let errordata = this.form.value.asset_category_ids;
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        console.log(keyValueSplit);
        let subdata = errors[key][0].split(errorPosition);

        this.formErrors['asset_category_ids'] =this.getButtonText('asset_category')+' '+errordata[errorPosition].title+''+subdata[1];

        // this.formErrors['asset_category_index'] = errorPosition;
        // console.log(this.formErrors.asset_category_index);
        // console.log(errors[key]);
      }
      if(key.startsWith('asset_rating_scores.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);

        this.formErrors['asset_rating_scores'] = 'Rating scores for all options required';
      }
      if(key.startsWith('asset_matrix_category_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['asset_matrix_category_ids'] = this.formErrors['asset_matrix_category_ids']? this.formErrors['asset_matrix_category_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
      }
      if(key.startsWith('asset_option_value_ids.')){
        let keyValueSplit = key.split('.');
        let errorPosition = parseInt(keyValueSplit[1]);
        this.formErrors['asset_option_value_ids'] = this.formErrors['asset_option_value_ids']? this.formErrors['asset_option_value_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
      }
     
     
    }
  }
  this._utilityService.detectChanges(this._cdr);
}

addMatrixCategory(){
  this.assetMatrixCategoriesObject.type = 'edit';
  this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'z-index', 9999999);
	this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'display', 'block');
    $(this.matrixCategoryModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
}

closeMatrixCategory(){
  if(AssetMatrixCategoriesMasterStore.lastInsertedId)
    this.setMatrixCategoryValue(AssetMatrixCategoriesMasterStore.lastInsertedId);
  
  this.assetMatrixCategoriesObject.type = null;
  this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'z-index', 9);
	this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'overflow', 'none');
  this._renderer2.setStyle(this.matrixCategoryModal.nativeElement, 'display', 'none');
  $(this.matrixCategoryModal.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}

setMatrixCategoryValue(id){
  // let matData = this.form.value.asset_matrix_category_ids;
  this._assetMatrixCategoryService.getItem(id).subscribe(res=>{
    let matData = this.form.value.asset_matrix_category_ids ? this.form.value.asset_matrix_category_ids  : [];
    matData.push(res);
    this.form.patchValue({
      asset_matrix_category_ids:matData
    })
  })
      

}


addAssetCategory(){
  this.assetCategoryObject.type = 'edit';
  this._renderer2.setStyle(this.categoryModal.nativeElement, 'z-index', 9999999);
	this._renderer2.setStyle(this.categoryModal.nativeElement, 'overflow', 'auto');
  this._renderer2.setStyle(this.categoryModal.nativeElement, 'display', 'block');
    $(this.categoryModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
}

closeAssetCategory(){
  if(AssetCategoryStore.lastInsertedId)
    this.setCategoryValue(AssetCategoryStore.lastInsertedId);
  
  this.assetCategoryObject.type = null;
  this._renderer2.setStyle(this.categoryModal.nativeElement, 'z-index', 9);
	this._renderer2.setStyle(this.categoryModal.nativeElement, 'overflow', 'none');
  this._renderer2.setStyle(this.categoryModal.nativeElement, 'display', 'none');
  $(this.categoryModal.nativeElement).modal('hide');
  this._utilityService.detectChanges(this._cdr);
}


setCategoryValue(id){
  // let matData = this.form.value.asset_matrix_category_ids;
  this._assetCategoryService.getItem(id).subscribe(res=>{
    let matData = this.form.value.asset_category_ids ? this.form.value.asset_category_ids  : [];
    matData.push(res);
    this.form.patchValue({
      asset_category_ids:matData
    })
  })
      

}


getDescriptionLength() {
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex, "");
  return result.length;
}

descriptionValueChange(event) {
  this._utilityService.detectChanges(this._cdr);
}

}
