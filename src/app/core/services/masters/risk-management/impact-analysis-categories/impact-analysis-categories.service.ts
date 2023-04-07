import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImpactCategory,ImpactCategoryPaginationResponse } from 'src/app/core/models/masters/risk-management/impact-category';
import{ImpactCategoryMasterStore} from 'src/app/stores/masters/risk-management/impact-analysis-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImpactAnalysisCategoriesService {

  
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ImpactCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ImpactCategoryMasterStore.currentPage}`;
        if (ImpactCategoryMasterStore.orderBy) params += `&order_by=${ImpactCategoryMasterStore.orderItem}&order=${ImpactCategoryMasterStore.orderBy}`;
      }
      if(ImpactCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ImpactCategoryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ImpactCategoryPaginationResponse>('/risk-impact-analysis-categories' + (params ? params : '')).pipe(
        map((res: ImpactCategoryPaginationResponse) => {
          ImpactCategoryMasterStore.setImpactCategory(res);
          return res;
        })
      );
    }


    getAllItems(): Observable<ImpactCategory[]> {
      return this._http.get<ImpactCategory[]>('/risk-impact-analysis-categories').pipe((
        map((res:ImpactCategory[])=>{
          ImpactCategoryMasterStore.setAllImpactCategory(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<ImpactCategory> {
      return this._http.get<ImpactCategory>('/risk-impact-analysis-categories/'+id).pipe((
        map((res:ImpactCategory)=>{
          ImpactCategoryMasterStore.setIndividualImpactCategory(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-impact-analysis-categories', item).pipe(
        map((res:any )=> {
          ImpactCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'risk_impact_analysis_category_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-impact-analysis-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_impact_analysis_category_updated');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-impact-analysis-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_impact_analysis_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ImpactCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-impact-analysis-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_impact_analysis_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-impact-analysis-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_impact_analysis_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-impact-analysis-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_impact_analysis_categories')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/risk-impact-analysis-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_impact_analysis_category_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-impact-analysis-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-impact-analysis-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','risk_impact_analysis_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }


    sortImpactCategoryList(type:string, text:string) {
      if (!ImpactCategoryMasterStore.orderBy) {
        ImpactCategoryMasterStore.orderBy = 'asc';
        ImpactCategoryMasterStore.orderItem = type;
      }
      else{
        if (ImpactCategoryMasterStore.orderItem == type) {
          if(ImpactCategoryMasterStore.orderBy == 'asc') ImpactCategoryMasterStore.orderBy = 'desc';
          else ImpactCategoryMasterStore.orderBy = 'asc'
        }
        else{
          ImpactCategoryMasterStore.orderBy = 'asc';
          ImpactCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
