import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DesignationGrade,DesignationGradePaginationResponse } from '../../../../models/masters/human-capital/designation-grade';
import { map } from 'rxjs/operators';
import { DesignationGradeMasterStore } from 'src/app/stores/masters/human-capital/designation-grade-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationGradeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string,status:boolean=false): Observable<DesignationGradePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DesignationGradeMasterStore.currentPage}`;
      if (DesignationGradeMasterStore.orderBy) params += `&order_by=${DesignationGradeMasterStore.orderItem}&order=${DesignationGradeMasterStore.orderBy}`;
    }
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }

    if(DesignationGradeMasterStore.searchText) params += (params ? '&q=' : '?q=')+DesignationGradeMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<DesignationGradePaginationResponse>('/designation-grades' + (params ? params : '')).pipe(
      map((res: DesignationGradePaginationResponse) => {
        DesignationGradeMasterStore.setDesignationGrades(res);
        return res;
      })
    );
  }
  
  getItem(id: number): Observable<DesignationGrade> {
    return this._http.get<DesignationGrade>('/designation-grades/' + id).pipe(
      map((res: DesignationGrade) => {
        DesignationGradeMasterStore.updateDesignationGrade(res)
        return res;
      })
    );
  }

  updateItem(id, item: DesignationGrade): Observable<any> {
    return this._http.put('/designation-grades/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: DesignationGrade) {
    return this._http.post('/designation-grades', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/designation-grades/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_grade_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/designation-grades/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_grade')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/designation-grades/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/designation-grades/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/designation-grades/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/designation-grades/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/designation-grades/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            DesignationGradeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortDesignationGradeList(type:string, text:string) {
    if (!DesignationGradeMasterStore.orderBy) {
      DesignationGradeMasterStore.orderBy = 'asc';
      DesignationGradeMasterStore.orderItem = type;
    }
    else{
      if (DesignationGradeMasterStore.orderItem == type) {
        if(DesignationGradeMasterStore.orderBy == 'asc') DesignationGradeMasterStore.orderBy = 'desc';
        else DesignationGradeMasterStore.orderBy = 'asc'
      }
      else{
        DesignationGradeMasterStore.orderBy = 'asc';
        DesignationGradeMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }

  
}
