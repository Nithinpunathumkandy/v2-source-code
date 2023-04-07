import { ChangeDetectorRef, Component, OnInit, Renderer2,Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductDetails } from 'src/app/core/models/organization/business_profile/business-products';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { ProductCategoryService } from 'src/app/core/services/masters/organization/product-category/product-category.service';
import { OrganizationproductsService } from 'src/app/core/services/organization/business_profile/products/organizationproducts.service';
import { OrganizationfileService } from 'src/app/core/services/organization/organization-file/organizationfile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BusinessProductsStore } from "src/app/stores/organization/business_profile/business-products.store";
import { BusinessProjectsStore } from 'src/app/stores/organization/business_profile/business-projects.store';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  @Input('removeselected') removeselected:boolean = false;
  @Input('productModalTitle')productModalTitle: any;
  @Input('title') title:boolean=false;
  
  BusinessProductsStore = BusinessProductsStore;
  AppStore = AppStore;
  selectedProducts:ProductDetails[]=[];
  selectProduct=[]
  searchText=null;
  emptyProduct="no_products"

  constructor(
    private _utilityService: UtilityService, private _organizationFileService: OrganizationfileService,
    private _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _formBuilder: FormBuilder, private _orgProductsService: OrganizationproductsService,
     private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
     private _sanitizer: DomSanitizer, private _helperService: HelperServiceService,
     private _rightSidebarFilterService: RightSidebarFilterService, private _productCategoryService: ProductCategoryService
  ) { }

  ngOnInit(): void {
    this.selectProduct=BusinessProductsStore.selectedProductList;
    this.pageChange();
  }

  pageChange(newPage: number = null){
    let params='';
    if(this.removeselected){
      params='exclude='+BusinessProductsStore.selectedProductList;
    }
    if (newPage) BusinessProductsStore.setCurrentPage(newPage);
    this._orgProductsService.getAllItems(false,(params?params:'')).subscribe(res=>{
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr);
      }, 100);
    });
  }

  searchProduct(e){
    let params='';
    if(this.removeselected){
      params='&exclude='+BusinessProductsStore.selectedProductList;
    }
    BusinessProductsStore.setCurrentPage(1);
     this._orgProductsService.getAllItems(false,`&q=${this.searchText}`+(params?params:'')).subscribe(res =>{
       this._utilityService.detectChanges(this._cdr);
     })
  }

  selectAllProducts(event){
    //console.log(BusinessProductsStore.selectedProductList);
    
    //  if(event.target.checked){
    //    this.selectedProducts=BusinessProductsStore.selectedProductList;
    //  }else{
    //    this.selectedProducts=[];
    //  }
   //}
   if (event.target.checked) {
     for(let i of BusinessProductsStore.productDetails){
       var pos = this.selectProduct.findIndex(e => e.id == i.id);
       if (pos == -1){
         this.selectProduct.push(i);}          
     }
   } else {
     for(let i of BusinessProductsStore.productDetails){
       var pos = this.selectProduct.findIndex(e => e.id == i.id);
       if (pos != -1){
         this.selectProduct.splice(pos,1);}    
     }
   }
}


  productPresent(id){
    //console.log(id);
    
    if(this.selectProduct.length==0){
      this.selectProduct=BusinessProductsStore.selectedProductList;
    }
    var pos = this.selectProduct.findIndex(e=>e.id ==id);
    if(pos > -1)
        return true;
    else
        return false;
  }

  productSelected(products){
    console.log(products);
    console.log(this.selectProduct);
    
    
    var pos = this.selectProduct.findIndex(e=>e.id == products.id);
    console.log(pos);
    
    if(pos != -1){
      this.selectProduct.splice(pos,1);
    }
        
    else{
      this.selectProduct.push(products);
    }
        
  }

   //getting button name by language
   getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close: boolean=false){
    AppStore.enableLoading();
    
    BusinessProductsStore.saveSelected=true
    this._orgProductsService.selectRequiredProducts(this.selectProduct)
    AppStore.disableLoading();
    let title = this.productModalTitle?.component?this.productModalTitle?.component:'item'
    if(this.selectProduct.length > 0) 
    this._utilityService.showSuccessMessage('product_selected','Selected products are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!')
    if(close)this.cancel();
  }

  cancel(){
    if(BusinessProductsStore.saveSelected){
      this._eventEmitterService.dismissProductModal();
      this.searchText=null;
    }
    else{
      this.selectProduct=[];
      BusinessProductsStore.saveSelected=false
      this._eventEmitterService.dismissProductModal();
      this.searchText=null
    }
 
  }

  clear(){
    this.searchText=null;
    this.pageChange(1);
  }

}
