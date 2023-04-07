import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserDocumentTypeMasterStore } from 'src/app/stores/masters/human-capital/user-document-type-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JobMasterStore } from 'src/app/stores/masters/human-capital/job-master.store';
import { Job,JobPaginationResponse } from 'src/app/core/models/masters/human-capital/user-job';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?: string,status:boolean=false): Observable<JobPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JobMasterStore.currentPage}`;
      if (JobMasterStore.orderBy) params += `&order_by=${JobMasterStore.orderItem}&order=${JobMasterStore.orderBy}`;
    }
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(JobMasterStore.searchText) params += (params ? '&q=' : '?q=')+JobMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<JobPaginationResponse>('/jds' + (params ? params : '')).pipe(
      map((res: JobPaginationResponse) => {
        JobMasterStore.setJobs(res);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jds/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('job_description_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/jds/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('job_description')+".xlsx");
      }
    )
  }

  setDocumentDetails(imageDetails,url){
    JobMasterStore.setDocumentDetails(imageDetails,url);
  }

  

  updateItem(id, item: Job): Observable<any> {
    return this._http.put('/jds/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/jds', item).pipe(
      map(res => {
        JobMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/jds/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            JobMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/jds/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/jds/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  getIndividualJob(id: number): Observable<Job> {
    return this._http.get<Job>('/jds/' + id).pipe(
      map((res: Job) => {
        JobMasterStore.setIndividualJobDetails(res);
        return res;
      })
    );
  }

  searchItem(params){
    return this.getItems(false,params ? params : '').pipe(
      map((res: JobPaginationResponse) => {
        JobMasterStore.setJobs(res);
        return res;
      })
    );
  }

  shareData(data){
    return this._http.post('/jds/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/jds/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortUserJdList(type:string, text:string) {
    if (!JobMasterStore.orderBy) {
      JobMasterStore.orderBy = 'asc';
      JobMasterStore.orderItem = type;
    }
    else{
      if (JobMasterStore.orderItem == type) {
        if(JobMasterStore.orderBy == 'asc') JobMasterStore.orderBy = 'desc';
        else JobMasterStore.orderBy = 'asc'
      }
      else{
        JobMasterStore.orderBy = 'asc';
        JobMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getItems(false,null,true).subscribe();
  else
  this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
