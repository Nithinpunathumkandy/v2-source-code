import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Competency, CompetencyPaginationResponse } from '../../../../models/masters/human-capital/competency';
import { map } from 'rxjs/operators';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string,status:boolean=false): Observable<CompetencyPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CompetencyMasterStore.currentPage}`;
      if (CompetencyMasterStore.orderBy) params += `&order_by=${CompetencyMasterStore.orderItem}&order=${CompetencyMasterStore.orderBy}`;
    }

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(CompetencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+CompetencyMasterStore.searchText;
    if(status) params += (params? '&':'?')+'status=all';
    return this._http.get<CompetencyPaginationResponse>('/competencies' + (params ? params : '')).pipe(
      map((res: CompetencyPaginationResponse) => {
        CompetencyMasterStore.setCompetencies(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<Competency> {
    return this._http.get<Competency>('/competencies/' + id).pipe(
      map((res: Competency) => {
        CompetencyMasterStore.updateCompetency(res)
        return res;
      })
    );
  }

  updateItem(id, item: Competency): Observable<any> {
    return this._http.put('/competencies/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/competencies', item).pipe(
      map(res => {
        CompetencyMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/competencies/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/competencies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/competencies/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/competencies/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/competencies/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/competencies/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/competencies/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            CompetencyMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortCompetencyList(type:string, text:string) {
    if (!CompetencyMasterStore.orderBy) {
      CompetencyMasterStore.orderBy = 'asc';
      CompetencyMasterStore.orderItem = type;
    }
    else{
      if (CompetencyMasterStore.orderItem == type) {
        if(CompetencyMasterStore.orderBy == 'asc') CompetencyMasterStore.orderBy = 'desc';
        else CompetencyMasterStore.orderBy = 'asc'
      }
      else{
        CompetencyMasterStore.orderBy = 'asc';
        CompetencyMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
