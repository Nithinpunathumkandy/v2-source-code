import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskCategory,RiskCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-category';
import{RiskCategoryMasterStore} from 'src/app/stores/masters/risk-management/risk-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskCategoryMasterStore.currentPage}`;
        if (RiskCategoryMasterStore.orderBy) params += `&order_by=${RiskCategoryMasterStore.orderItem}&order=${RiskCategoryMasterStore.orderBy}`;
      }
      if(RiskCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskCategoryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskCategoryPaginationResponse>('/risk-categories' + (params ? params : '')).pipe(
        map((res: RiskCategoryPaginationResponse) => {
          RiskCategoryMasterStore.setRiskCategory(res);
          return res;
        })
      );
    }


    getAllItems(): Observable<RiskCategory[]> {
      return this._http.get<RiskCategory[]>('/risk-categories').pipe((
        map((res:RiskCategory[])=>{
          RiskCategoryMasterStore.setAllRiskCategory(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<RiskCategory> {
      return this._http.get<RiskCategory>('/risk-categories/'+id).pipe((
        map((res:RiskCategory)=>{
          RiskCategoryMasterStore.setIndividualRiskCategory(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-categories', item).pipe(
        map((res:any )=> {
          RiskCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'risk_category_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_category_updated');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_category')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/risk-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_category_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','risk_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }


    sortRiskCategoryList(type:string, text:string) {
      if (!RiskCategoryMasterStore.orderBy) {
        RiskCategoryMasterStore.orderBy = 'asc';
        RiskCategoryMasterStore.orderItem = type;
      }
      else{
        if (RiskCategoryMasterStore.orderItem == type) {
          if(RiskCategoryMasterStore.orderBy == 'asc') RiskCategoryMasterStore.orderBy = 'desc';
          else RiskCategoryMasterStore.orderBy = 'asc'
        }
        else{
          RiskCategoryMasterStore.orderBy = 'asc';
          RiskCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
