import { Injectable } from '@angular/core';
import { ReportFrequency,ReportFrequencyPaginationResponse } from 'src/app/core/models/masters/human-capital/report-frequency';
import {ReportFrequencyMasterStore} from 'src/app/stores/masters/human-capital/report-frequency-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class ReportFrequencyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean=false): Observable<ReportFrequencyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ReportFrequencyMasterStore.currentPage}`;
        if (ReportFrequencyMasterStore.orderBy) params += `&order_by=${ReportFrequencyMasterStore.orderItem}&order=${ReportFrequencyMasterStore.orderBy}`;

      }
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
      }

      // if(additionalParams) params += additionalParams;
      if(ReportFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+ReportFrequencyMasterStore.searchText;
      if(status) params += (params? '&':'?q=')+'status=all';
      return this._http.get<ReportFrequencyPaginationResponse>('/report-frequencies' + (params ? params : '')).pipe(
        map((res: ReportFrequencyPaginationResponse) => {
          ReportFrequencyMasterStore.setReportFrequency(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<ReportFrequency[]>{
      return this._http.get<ReportFrequency[]>('/report-frequencies?is_all=true').pipe(
        map((res: ReportFrequency[]) => {
          
          ReportFrequencyMasterStore.setAllReportFrequencies(res);
          return res;
        })
      );
    }

    saveItem(item: ReportFrequency) {
      return this._http.post('/report-frequencies', item).pipe(
        map((res:any )=> {
          ReportFrequencyMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: ReportFrequency): Observable<any> {
      return this._http.put('/report-frequencies/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/report-frequencies/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ReportFrequencyMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/report-frequencies/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/report-frequencies/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/report-frequencies/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('report_frequency_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/report-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('report_frequencies')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/report-frequencies/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/report-frequencies/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
  

    sortReportFrequencieslList(type:string, text:string) {
      if (!ReportFrequencyMasterStore.orderBy) {
        ReportFrequencyMasterStore.orderBy = 'asc';
        ReportFrequencyMasterStore.orderItem = type;
      }
      else{
        if (ReportFrequencyMasterStore.orderItem == type) {
          if(ReportFrequencyMasterStore.orderBy == 'asc') ReportFrequencyMasterStore.orderBy = 'desc';
          else ReportFrequencyMasterStore.orderBy = 'asc'
        }
        else{
          ReportFrequencyMasterStore.orderBy = 'asc';
          ReportFrequencyMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems(false,null,true).subscribe();
    else
    this.getItems(false,`&q=${text}`,true).subscribe();
    }
    

}


