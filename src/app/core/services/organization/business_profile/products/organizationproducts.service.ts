import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Products, ProductCategories, ProductDetails, ProductsPaginatedResponse } from "src/app/core/models/organization/business_profile/business-products";
import { BusinessProductsStore } from 'src/app/stores/organization/business_profile/business-products.store';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class OrganizationproductsService {

  constructor(private _utilityService: UtilityService, private _http: HttpClient,
     private _imageService: ImageServiceService) { }

  getAllItems(getAll:boolean = false,additionalParams?: string): Observable<ProductsPaginatedResponse> {
    let params: string = '';
    if (!getAll) {
      params = `?page=${BusinessProductsStore.currentPage}`;
    }
    if(additionalParams){
      if(params) params = params + `&${additionalParams}`;
      else params = `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this.getItems(params).pipe(
      map((res: ProductsPaginatedResponse) => {
        res.data.forEach((prod, index) => {
          prod['view_more'] = false;
          prod['catelogues'] = [];
          let product_catalogue_ext = prod.product_catalogue_ext ? prod.product_catalogue_ext.split(',') : []
          let product_catalogue_size = prod.product_catalogue_size ? prod.product_catalogue_size.split(',') : []
          let product_catalogue_thumbnail_url = prod.product_catalogue_thumbnail_url ? prod.product_catalogue_thumbnail_url.split(',') : []
          let product_catalogue_title = prod.product_catalogue_title ? prod.product_catalogue_title.split(',') : []
          let product_catalogue_token = prod.product_catalogue_token ? prod.product_catalogue_token.split(',') : []
          let product_catalogue_url = prod.product_catalogue_url ? prod.product_catalogue_url.split(',') : []
          let product_catalogue_id = prod.product_catalogue_id ? prod.product_catalogue_id.split(',') : []
          for(let i = 0; i < product_catalogue_title.length; i++){
            let obj = {id: product_catalogue_id[i], title: product_catalogue_title[i], url: product_catalogue_url[i], token: product_catalogue_token[i], size: product_catalogue_size[i], ext: product_catalogue_ext[i]};
            prod['catelogues'].push(obj);
          }
        });
        BusinessProductsStore.setProductDetails(res);
        return res;
      })
    );
  }
  
  getItems(params?: string): Observable<ProductsPaginatedResponse> {
    return this._http.get<ProductsPaginatedResponse>('/products' + (params ? params : ''));
  }

  saveItem(item: Products) {
    return this._http.post('/products', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deleteItem(id: number) {
    return this._http.delete('/products/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems().subscribe(resp=>{
          if(resp.from == null && resp.current_page > 1){
            BusinessProductsStore.setCurrentPage(resp.current_page - 1);
            this.getAllItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  updateItem(id, item: Products): Observable<any> {
    return this._http.put('/products/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  getItem(id):Observable<ProductDetails>{
    return this._http.get('/products/' + id).pipe(
      map((res:ProductDetails) => {
        BusinessProductsStore.setSelectedProductDetails(res);
        return res;
      })
    );
  }

  /*------------------------------------------ Product Categories --------------------------------------*/

  // Get Request
  getCategoryItems(params?: string): Observable<ProductCategories[]> {
    return this._http.get<ProductCategories[]>('/product-categories' + (params ? params : ''));
  }

  // Get Product Category List
  getProductCategories(params?: string): Observable<ProductCategories[]> {
    return this.getCategoryItems(params).pipe(
      map((res: ProductCategories[]) => {
        BusinessProductsStore.setProductCategoryDetails(res['data']);
        return res;
      })
    );
  }

  // Post Request - Save Product Category
  saveCategory(item){
    return this._http.post('/product-categories', item).pipe(
      map((res: any) => {
        if(res.id) BusinessProductsStore.setLastInsertedProductCategoryId(res.id)
        this._utilityService.showSuccessMessage('success', 'product_category_created');
        this.getProductCategories().subscribe();
        return res;
      })
    );
  }

  /*-------------------------------------------------------------------------------------------------------*/

  // Sets Thumbnail Details
  setImageDetails(imageDetails,url,type){
    BusinessProductsStore.setFileDetails(imageDetails,url,type);
  }

  // Returns Thumbnail Details
  getSelectedImageDetails(type){
    return BusinessProductsStore.getFileDetailsByType(type);
  }

  // getImageDetails(type){
  //   return BusinessProductsStore.getFileDetailsByType(type);
  // }

  // setSelectedImageDetails(imageDetails,type){
  //   BusinessProductsStore.setSelectedImageDetails(imageDetails,type);
  // }

  // createImageFromBlob(image: Blob,imageDetails) {
  //   return new Promise(resolve=>{
  //     let reader = new FileReader();
  //     reader.addEventListener("load", () => {
  //       var logo_url = reader.result;
  //       resolve(logo_url);
  //     }, false);
 
  //     if (image) {
  //       reader.readAsDataURL(image);
  //     }
  //   })
  // }
  
  // downloadBrochure(id,filename){
  //   this._http.get('/products/'+ id +'/catelogue-download', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, filename);
  //     }
  //   )
  // }

  getBrochures(){
    return BusinessProductsStore.getBrochureDetails;
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/products/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('product_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    let params ='';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/products/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('products')+'.xlsx');
      }
    )
  }

  selectRequiredProducts(product){
    BusinessProductsStore.addSelectedProduct(product);
  }

}
