import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssueDomain,IssueDomainPaginationResponse } from '../../../../models/masters/organization/issue-domain';
import { IssueDomainMasterStore } from 'src/app/stores/masters/organization/issue-domain-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IssueDomainService {
  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IssueDomainPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IssueDomainMasterStore.currentPage}`;
        if (IssueDomainMasterStore.orderBy) params += `&order_by=${IssueDomainMasterStore.orderItem}&order=${IssueDomainMasterStore.orderBy}`;
      }
      else{
        this.getAllItems();
      }
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(IssueDomainMasterStore.searchText) params += (params ? '&q=' : '?q=')+IssueDomainMasterStore.searchText;
      return this._http.get<IssueDomainPaginationResponse>('/issue-domains' + (params ? params : '')).pipe(
        map((res: IssueDomainPaginationResponse) => {
          IssueDomainMasterStore.setIssueDomains(res);
          return res;
        })
      );
    }


  getAllItems(): Observable<IssueDomain[]> {
    return this._http.get<IssueDomain[]>('/issue-domains?is_all=true').pipe(
      map((res: IssueDomain[]) => {
        
        IssueDomainMasterStore.setAllIssueDomains(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IssueDomain> {
    return this._http.get<IssueDomain>('/issue-domains/' + id).pipe(
      map((res: IssueDomain) => {
        IssueDomainMasterStore.updateIssueDomain(res)
        return res;
      })
    );
  }

  updateItem(id, item: IssueDomain): Observable<any> {
    return this._http.put('/issue-domains/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: IssueDomain,setLastInsertedId:boolean = false) {
    return this._http.post('/issue-domains', item).pipe(
      map((res:any) => {
        if(setLastInsertedId) IssueDomainMasterStore.setlastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/issue-domains/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_domain_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/issue-domains/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('issue_domain')+".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/issue-domains/share',data).pipe(
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
    return this._http.post('/issue-domains/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/issue-domains/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/issue-domains/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/issue-domains/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IssueDomainMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        
        return res;
      })
    );
  }
  
  sortIssueDomainList(type:string, text:string) {
    if (!IssueDomainMasterStore.orderBy) {
      IssueDomainMasterStore.orderBy = 'asc';
      IssueDomainMasterStore.orderItem = type;
    }
    else{
      if (IssueDomainMasterStore.orderItem == type) {
        if(IssueDomainMasterStore.orderBy == 'asc') IssueDomainMasterStore.orderBy = 'desc';
        else IssueDomainMasterStore.orderBy = 'asc'
      }
      else{
        IssueDomainMasterStore.orderBy = 'asc';
        IssueDomainMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


  
}
