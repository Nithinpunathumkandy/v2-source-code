import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { FindingImpactAnalysisCategory,FindingImpactAnalysisCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/finding-impact-analysis-category';
import{FindingImpactAnalysisCategoryMasterStore} from 'src/app/stores/masters/internal-audit/finding-impact-analysis-category-store';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class FindingImpactAnalysisCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, is_all:boolean = false): Observable<FindingImpactAnalysisCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${FindingImpactAnalysisCategoryMasterStore.currentPage}`;
        if (FindingImpactAnalysisCategoryMasterStore.orderBy) params += `&order_by=${FindingImpactAnalysisCategoryMasterStore.orderItem}&order=${FindingImpactAnalysisCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(FindingImpactAnalysisCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+FindingImpactAnalysisCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<FindingImpactAnalysisCategoryPaginationResponse>('/finding-impact-analysis-categories' + (params ? params : '')).pipe(
        map((res: FindingImpactAnalysisCategoryPaginationResponse) => {
          FindingImpactAnalysisCategoryMasterStore.setFindingImpactAnalysisCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<FindingImpactAnalysisCategory[]> {
      return this._http.get<FindingImpactAnalysisCategory[]>('/finding-impact-analysis-categories').pipe((
        map((res:FindingImpactAnalysisCategory[])=>{
          FindingImpactAnalysisCategoryMasterStore.setAllFindingImpactAnalysisCategory(res);
          return res;
        })
      ))
    }

    saveItem(item: FindingImpactAnalysisCategory) {
      return this._http.post('/finding-impact-analysis-categories', item).pipe(
        map((res:any )=> {
           FindingImpactAnalysisCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: FindingImpactAnalysisCategory): Observable<any> {
      return this._http.put('/finding-impact-analysis-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/finding-impact-analysis-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              FindingImpactAnalysisCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/finding-impact-analysis-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/finding-impact-analysis-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/finding-impact-analysis-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_impacts_analysis_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/finding-impact-analysis-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_impacts_analysis_category')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/finding-impact-analysis-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/finding-impact-analysis-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortFindingImpactAnalysisCategorylList(type:string, text:string) {
      if (!FindingImpactAnalysisCategoryMasterStore.orderBy) {
        FindingImpactAnalysisCategoryMasterStore.orderBy = 'asc';
        FindingImpactAnalysisCategoryMasterStore.orderItem = type;
      }
      else{
        if (FindingImpactAnalysisCategoryMasterStore.orderItem == type) {
          if(FindingImpactAnalysisCategoryMasterStore.orderBy == 'asc') FindingImpactAnalysisCategoryMasterStore.orderBy = 'desc';
          else FindingImpactAnalysisCategoryMasterStore.orderBy = 'asc'
        }
        else{
          FindingImpactAnalysisCategoryMasterStore.orderBy = 'asc';
          FindingImpactAnalysisCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }

}


