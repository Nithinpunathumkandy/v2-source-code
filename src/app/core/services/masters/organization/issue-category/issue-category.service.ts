import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssueCategory,IssueCategoryPaginationResponse } from '../../../../models/masters/organization/issue-category';
import { IssueCategoryMasterStore } from 'src/app/stores/masters/organization/issue-category-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IssueCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
    
    getItems(getAll: boolean = false, additionalParams?: string, status:boolean = false): Observable<IssueCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IssueCategoryMasterStore.currentPage}`;
        if (IssueCategoryMasterStore.orderBy) params += `&order_by=${IssueCategoryMasterStore.orderItem}&order=${IssueCategoryMasterStore.orderBy}`;
      }
      else{
        this.getAllItems();
      }
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(IssueCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+IssueCategoryMasterStore.searchText;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<IssueCategoryPaginationResponse>('/issue-categories' + (params ? params : '')).pipe(
        map((res: IssueCategoryPaginationResponse) => {
          IssueCategoryMasterStore.setIssueCategories(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<IssueCategory[]>{
      return this._http.get<IssueCategory[]>('/issue-categories?is_all=true').pipe(
        map((res: IssueCategory[]) => {
          IssueCategoryMasterStore.setAllIssueCategories(res);
          return res;
        })
      );
    }

  
  getItem(id: number): Observable<IssueCategory> {
    return this._http.get<IssueCategory>('/issue-categories/' + id).pipe(
      map((res: IssueCategory) => {
        IssueCategoryMasterStore.updateIssueCategory(res)
        return res;
      })
    );
  }

  updateItem(id, item: IssueCategory): Observable<any> {
    return this._http.put('/issue-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  

  saveItem(item: IssueCategory,setLastInsertedId: boolean = false) {
    return this._http.post('/issue-categories', item).pipe(
      map((res:any )=> {
        if(setLastInsertedId) IssueCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/issue-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/issue-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_category')+".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/issue-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )

  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/issue-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/issue-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/issue-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/issue-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IssueCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortIssueCategoryList(type:string, text:string) {
    if (!IssueCategoryMasterStore.orderBy) {
      IssueCategoryMasterStore.orderBy = 'asc';
      IssueCategoryMasterStore.orderItem = type;
    }
    else{
      if (IssueCategoryMasterStore.orderItem == type) {
        if(IssueCategoryMasterStore.orderBy == 'asc') IssueCategoryMasterStore.orderBy = 'desc';
        else IssueCategoryMasterStore.orderBy = 'asc'
      }
      else{
        IssueCategoryMasterStore.orderBy = 'asc';
        IssueCategoryMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


}
