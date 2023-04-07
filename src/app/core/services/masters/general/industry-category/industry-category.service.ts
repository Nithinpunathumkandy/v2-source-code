import { Injectable } from '@angular/core';
import { IndustryCategory,IndustryCategoryPaginationResponse } from 'src/app/core/models/masters/general/industry-category';
import { IndustryCategoryMasterStore} from 'src/app/stores/masters/general/industry-category-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IndustryCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IndustryCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IndustryCategoryMasterStore.currentPage}`;
        if (IndustryCategoryMasterStore.orderBy) params += `&order_by=industry_categories.title&order=${IndustryCategoryMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(IndustryCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+IndustryCategoryMasterStore.searchText;
      return this._http.get<IndustryCategoryPaginationResponse>('/industry-categories' + (params ? params : '')).pipe(
        map((res: IndustryCategoryPaginationResponse) => {
          IndustryCategoryMasterStore.setIndustryCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<IndustryCategory[]>{
      return this._http.get<IndustryCategory[]>('/industry-categories?is_all=true').pipe(
        map((res: IndustryCategory[]) => {
          
          IndustryCategoryMasterStore.setAllIndustryCategories(res);
          return res;
        })
      );
    }

    saveItem(item: IndustryCategory) {
      return this._http.post('/industry-categories', item).pipe(
        map((res:any )=> {
          IndustryCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: IndustryCategory): Observable<any> {
      return this._http.put('/industry-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/industry-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              IndustryCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/industry-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/industry-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/industry-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('industry_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/industry-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('industry_categories')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/industry-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortIndustryCategorylList(type:string, text:string) {
      if (!IndustryCategoryMasterStore.orderBy) {
        IndustryCategoryMasterStore.orderBy = 'asc';
        IndustryCategoryMasterStore.orderItem = type;
      }
      else{
        if (IndustryCategoryMasterStore.orderItem == type) {
          if(IndustryCategoryMasterStore.orderBy == 'asc') IndustryCategoryMasterStore.orderBy = 'desc';
          else IndustryCategoryMasterStore.orderBy = 'asc'
        }
        else{
          IndustryCategoryMasterStore.orderBy = 'asc';
          IndustryCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}

