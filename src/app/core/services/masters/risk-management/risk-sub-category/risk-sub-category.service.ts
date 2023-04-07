import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualRiskSubCategory, RiskSubCategory, RiskSubCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-sub-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskSubCategoryMasterStore } from 'src/app/stores/masters/risk-management/risk-sub-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskSubCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskSubCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${RiskSubCategoryMasterStore.currentPage}`;
      if (RiskSubCategoryMasterStore.orderBy) params += `&order_by=${RiskSubCategoryMasterStore.orderItem}&order=${RiskSubCategoryMasterStore.orderBy}`;
    }
    if(RiskSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskSubCategoryMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<RiskSubCategoryPaginationResponse>('/risk-sub-categories' + (params ? params : '')).pipe(
      map((res: RiskSubCategoryPaginationResponse) => {
        RiskSubCategoryMasterStore.setRiskSubCategory(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<RiskSubCategory[]> {
    return this._http.get<RiskSubCategory[]>('/risk-sub-categories').pipe((
      map((res:RiskSubCategory[])=>{
        RiskSubCategoryMasterStore.setAllRiskSubCategory(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<IndividualRiskSubCategory> {
    return this._http.get<IndividualRiskSubCategory>('/risk-sub-categories/'+id).pipe((
      map((res:IndividualRiskSubCategory)=>{
        RiskSubCategoryMasterStore.setIndividualRiskSubCategory(res);
        return res;
      })
    ))
  }

  exportToExcel() {
    this._http.get('/risk-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_sub_categories')+".xlsx");
      }
    )
  }

  saveItem(item) {
    return this._http.post('/risk-sub-categories', item).pipe(
      map((res:any )=> {
        RiskSubCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'risk_sub_category_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/risk-sub-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_sub_category_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/risk-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_sub_category_template')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/risk-sub-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/risk-sub-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','risk_sub_categories_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortRiskSubCategoryList(type:string, text:string) {
    if (!RiskSubCategoryMasterStore.orderBy) {
      RiskSubCategoryMasterStore.orderBy = 'asc';
      RiskSubCategoryMasterStore.orderItem = type;
    }
    else{
      if (RiskSubCategoryMasterStore.orderItem == type) {
        if(RiskSubCategoryMasterStore.orderBy == 'asc') RiskSubCategoryMasterStore.orderBy = 'desc';
        else RiskSubCategoryMasterStore.orderBy = 'asc'
      }
      else{
        RiskSubCategoryMasterStore.orderBy = 'asc';
        RiskSubCategoryMasterStore.orderItem = type;
      }
    }
  }

  delete(id: number) {
    return this._http.delete('/risk-sub-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_sub_category_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            RiskSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/risk-sub-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_sub_category_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/risk-sub-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_sub_category_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

}
