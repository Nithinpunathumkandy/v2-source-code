import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssueType,IssueTypePaginationResponse } from '../../../../models/masters/organization/issue-type';
import { IssueTypeMasterStore } from 'src/app/stores/masters/organization/issue-type-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IssueTypeService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<IssueTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IssueTypeMasterStore.currentPage}`;
        if (IssueTypeMasterStore.orderBy) params += `&order_by=${IssueTypeMasterStore.orderItem}&order=${IssueTypeMasterStore.orderBy}`;
      }
      else{
        this.getAllItems();
      }
      if(additionalParams) {
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(IssueTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+IssueTypeMasterStore.searchText;
      return this._http.get<IssueTypePaginationResponse>('/issue-types' + (params ? params : '')).pipe(
        map((res: IssueTypePaginationResponse) => {
          IssueTypeMasterStore.setIssueTypes(res);
          return res;
        })
      );
    }
  
    getAllItems(params?: string): Observable<IssueType[]> {
      return this._http.get<IssueType[]>('/issue-types?is_all=true').pipe(
        map((res: IssueType[]) => {
          
          IssueTypeMasterStore.setAllIssueTypes(res);
          return res;
        })
      );
  }


  getItem(id: number): Observable<IssueType> {
    return this._http.get<IssueType>('/issue-types/' + id).pipe(
      map((res: IssueType) => {
        IssueTypeMasterStore.updateIssueType(res)
        return res;
      })
    );
  }

  updateItem(id, item: IssueType): Observable<any> {
    return this._http.put('/issue-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: IssueType,setLastInserted: boolean = false) {
    return this._http.post('/issue-types', item).pipe(
      map((res:any) => {
        if(setLastInserted) IssueTypeMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('Success!','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/issue-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/issue-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_type')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('issue-types/share',data).pipe(
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
    return this._http.post('/issue-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/issue-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/issue-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/issue-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IssueTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortIssuetypeList(type:string, text:string) {
    if (!IssueTypeMasterStore.orderBy) {
      IssueTypeMasterStore.orderBy = 'asc';
      IssueTypeMasterStore.orderItem = type;
    }
    else{
      if (IssueTypeMasterStore.orderItem == type) {
        if(IssueTypeMasterStore.orderBy == 'asc') IssueTypeMasterStore.orderBy = 'desc';
        else IssueTypeMasterStore.orderBy = 'asc'
      }
      else{
        IssueTypeMasterStore.orderBy = 'asc';
        IssueTypeMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


  
}
