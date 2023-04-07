import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssueStatus,IssueStatusPaginationResponse } from '../../../../models/masters/organization/issue-status';
import { IssueStatusMasterStore } from 'src/app/stores/masters/organization/issue-status-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IssueStatusService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IssueStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IssueStatusMasterStore.currentPage}`;
        if (IssueStatusMasterStore.orderBy) params += `&order_by=${IssueStatusMasterStore.orderItem}&order=${IssueStatusMasterStore.orderBy}`;
      }
      else{
        this.getAllItems();
      }
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(IssueStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+IssueStatusMasterStore.searchText;
      return this._http.get<IssueStatusPaginationResponse>('/issue-statuses' + (params ? params : '')).pipe(
        map((res: IssueStatusPaginationResponse) => {
          IssueStatusMasterStore.setIssueStatuses(res);
          return res;
        })
      );
    }

  getAllItems(params?: string): Observable<IssueStatus[]> {
    return this._http.get<IssueStatus[]>('/issue-statuses?is_all=true').pipe(
      map((res: IssueStatus[]) => {
        
        IssueStatusMasterStore.setAllIssueStatuses(res);
        return res;
      })
    );
  }

 
 

  getItem(id: number): Observable<IssueStatus> {
    return this._http.get<IssueStatus>('/issue-statuses/' + id).pipe(
      map((res: IssueStatus) => {
        IssueStatusMasterStore.updateIssueStatus(res)
        return res;
      })
    );
  }

  updateItem(id, item: IssueStatus): Observable<any> {
    return this._http.put('/issue-statuses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: IssueStatus) {
    return this._http.post('/issue-statuses', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/issue-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_status_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/issue-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_status')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('issue-statuses/share',data).pipe(
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
    return this._http.post('/issue-statuses/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/issue-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','department_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/issue-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/issue-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IssueStatusMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortIssueStatusList(type:string, text:string) {
    if (!IssueStatusMasterStore.orderBy) {
      IssueStatusMasterStore.orderBy = 'asc';
      IssueStatusMasterStore.orderItem = type;
    }
    else{
      if (IssueStatusMasterStore.orderItem == type) {
        if(IssueStatusMasterStore.orderBy == 'asc') IssueStatusMasterStore.orderBy = 'desc';
        else IssueStatusMasterStore.orderBy = 'asc'
      }
      else{
        IssueStatusMasterStore.orderBy = 'asc';
        IssueStatusMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


  
}
