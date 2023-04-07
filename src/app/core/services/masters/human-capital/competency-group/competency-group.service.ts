import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CompetencyGroup,CompetencyGroupPaginationResponse } from '../../../../models/masters/human-capital/competency-group';
import { map } from 'rxjs/operators';
import { CompetencyGroupMasterStore } from 'src/app/stores/masters/human-capital/competency-group-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class CompetencyGroupService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string,status:boolean=false): Observable<CompetencyGroupPaginationResponse> {

    let params = '';
    if (!getAll) {
      params = `?page=${CompetencyGroupMasterStore.currentPage}`;
      if (CompetencyGroupMasterStore.orderBy) params += `&order_by=${CompetencyGroupMasterStore.orderItem}&order=${CompetencyGroupMasterStore.orderBy}`;
    }

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(CompetencyGroupMasterStore.searchText) params += (params ? '&q=' : '?q=')+CompetencyGroupMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<CompetencyGroupPaginationResponse>('/competency-groups' + (params ? params : '')).pipe(
      map((res: CompetencyGroupPaginationResponse) => {
        CompetencyGroupMasterStore.setCompetencyGroups(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<CompetencyGroup> {
    return this._http.get<CompetencyGroup>('/competency-groups/' + id).pipe(
      map((res: CompetencyGroup) => {
        CompetencyGroupMasterStore.updateCompetencyGroup(res)
        return res;
      })
    );
  }

  updateItem(id, item: CompetencyGroup): Observable<any> {
    return this._http.put('/competency-groups/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: CompetencyGroup) {
    return this._http.post('/competency-groups', item).pipe(
      map(res => {
        CompetencyGroupMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/competency-groups/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency_group_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/competency-groups/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency_group')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/competency-groups/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/competency-groups/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/competency-groups/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/competency-groups/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/competency-groups/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            CompetencyGroupMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortCompetencyGroupList(type:string, text:string) {
    if (!CompetencyGroupMasterStore.orderBy) {
      CompetencyGroupMasterStore.orderBy = 'asc';
      CompetencyGroupMasterStore.orderItem = type;
    }
    else{
      if (CompetencyGroupMasterStore.orderItem == type) {
        if(CompetencyGroupMasterStore.orderBy == 'asc') CompetencyGroupMasterStore.orderBy = 'desc';
        else CompetencyGroupMasterStore.orderBy = 'asc'
      }
      else{
        CompetencyGroupMasterStore.orderBy = 'asc';
        CompetencyGroupMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
