import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { ProductCategory,ProductCategoryPaginationResponse } from 'src/app/core/models/masters/organization/product-category';
import { ProductCategoryMasterStore } from 'src/app/stores/masters/organization/product-category-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
    
    
  getItems(getAll: boolean = false, additionalParams?: string,status: boolean = false): Observable<ProductCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProductCategoryMasterStore.currentPage}`;
      if (ProductCategoryMasterStore.orderBy) params += `&order_by=${ProductCategoryMasterStore.orderItem}&order=${ProductCategoryMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    if(ProductCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProductCategoryMasterStore.searchText;
    return this._http.get<ProductCategoryPaginationResponse>('/product-categories' + (params ? params : '')).pipe(
      map((res: ProductCategoryPaginationResponse) => {

        ProductCategoryMasterStore.setProductCategory(res);
        return res;}
      ))
  }

  getAllItems():Observable<ProductCategory[]> {
    return this._http.get<ProductCategory[]>('/product-categories').pipe((
     map((res:ProductCategory[]) => {

      ProductCategoryMasterStore.setAllProductCategory(res);
      return res;
     }) 
    ))
  }

  saveItem(item:ProductCategory){
    return this._http.post('/product-categories', item).pipe((
      map((res:any)=>{
        ProductCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    ))
  }

  updateItem(id:number,item:ProductCategory): Observable<any> {
    return this._http.put('/product-categories/' + id,item).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    ))
  }

  delete(id:number){
    return this._http.delete('/product-categories/' + id).pipe((
      map((res:any)=>{
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProductCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    ))
  }

  activate(id: number) {
    return this._http.put('/product-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/product-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/product-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('product_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/product-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('product_category')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/product-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/product-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortProductCategoryList(type:string, text:string) {
    if (!ProductCategoryMasterStore.orderBy) {
      ProductCategoryMasterStore.orderBy = 'asc';
      ProductCategoryMasterStore.orderItem = type;
    }
    else{
      if (ProductCategoryMasterStore.orderItem == type) {
        if(ProductCategoryMasterStore.orderBy == 'asc') ProductCategoryMasterStore.orderBy = 'desc';
        else ProductCategoryMasterStore.orderBy = 'asc'
      }
      else{
        ProductCategoryMasterStore.orderBy = 'asc';
        ProductCategoryMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }
}


