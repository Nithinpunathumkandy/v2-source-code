import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue,IssuePaginationResponse } from '../../../../models/masters/organization/issue';
import { IssueMasterStore } from 'src/app/stores/masters/organization/issue-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IssuePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IssueMasterStore.currentPage}`;
        if (IssueMasterStore.orderBy) params += `&order_by=${IssueMasterStore.orderItem}&order=${IssueMasterStore.orderBy}`;
      }
      if(IssueMasterStore.searchText) params += (params ? '&q=' : '?q=')+IssueMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<IssuePaginationResponse>('/issues' + (params ? params : '')).pipe(
        map((res: IssuePaginationResponse) => {
          IssueMasterStore.setIssues(res);
          return res;
        })
      );
    }

  getItem(id: number): Observable<Issue> {
    return this._http.get<Issue>('/issues/' + id).pipe(
      map((res: Issue) => {
        IssueMasterStore.updateIssue(res)
        return res;
      })
    );
  }

  updateItem(id, item: Issue): Observable<any> {
    return this._http.put('/issues/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: Issue,setLastInserted: boolean = false) {
    return this._http.post('/issues', item).pipe(
      map((res:any) => {
        if(setLastInserted) IssueMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/issues/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/issues/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/issues/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/issues/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/issues/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IssueMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  shareData(data){
    return this._http.post('/issues/share',data).pipe(
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
    return this._http.post('/issues/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortIssueList(type:string, text:string) {
    if (!IssueMasterStore.orderBy) {
      IssueMasterStore.orderBy = 'asc';
      IssueMasterStore.orderItem = type;
    }
    else{
      if (IssueMasterStore.orderItem == type) {
        if(IssueMasterStore.orderBy == 'asc') IssueMasterStore.orderBy = 'desc';
        else IssueMasterStore.orderBy = 'asc'
      }
      else{
        IssueMasterStore.orderBy = 'asc';
        IssueMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems(false,null,true).subscribe();
  // else
  // this.getItems(false,`&q=${text}`,true).subscribe();
  }


}
