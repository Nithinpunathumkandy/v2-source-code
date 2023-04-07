import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Kpi,KpiPaginationResponse } from '../../../../models/masters/human-capital/user-kpi';
import { KpiCategory } from '../../../../models/masters/human-capital/kpi-category';
import { map } from 'rxjs/operators';
import { UserDocumentTypeMasterStore } from 'src/app/stores/masters/human-capital/user-document-type-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getKpis(getAll: boolean = false,additionalParams?: string,status:boolean=false): Observable<KpiPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KpiMasterStore.currentPage}`;
      if (KpiMasterStore.orderBy) params += `&order_by=${KpiMasterStore.orderItem}&order=${KpiMasterStore.orderBy}`;
    }
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(KpiMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';

    return this._http.get<KpiPaginationResponse>('/kpis' + (params ? params : '')).pipe(
      map((res: KpiPaginationResponse) => {
        KpiMasterStore.setKpis(res);
        return res;
      })
    );
  }


  generateTemplate() {
    this._http.get('/kpis/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_kpi_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/kpis/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_kpi')+".xlsx");
      }
    )
  }

  setDocumentDetails(imageDetails,url){
    KpiMasterStore.setDocumentDetails(imageDetails,url);
  }

 

  updateItem(id, item): Observable<any> {
    return this._http.put('/kpis/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getKpis(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/kpis', item).pipe(
      map(res => {
        KpiMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getKpis(false,null,true).subscribe();
        else this.getKpis().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/kpis/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getKpis(false,null,true).subscribe(resp=>{
          if(resp.from == null){
            KpiMasterStore.setCurrentPage(resp.current_page-1);
            this.getKpis(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/kpis/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getKpis(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/kpis/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getKpis(false,null,true).subscribe();
        return res;
      })
    );
  }

  getIndividualKpi(id: number): Observable<Kpi> {
    return this._http.get<Kpi>('/kpis/' + id).pipe(
      map((res: Kpi) => {
        KpiMasterStore.setIndividualKpiDetails(res);
        return res;
      })
    );
  }

  searchKpi(params){
    return this.getKpis(false,params ? params : '').pipe(
      map((res: KpiPaginationResponse) => {
        KpiMasterStore.setKpis(res);
        return res;
      })
    );
  }

  shareData(data){
    return this._http.post('/kpis/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/kpis/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getKpis(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortUserKpiList(type:string, text:string) {
    if (!KpiMasterStore.orderBy) {
      KpiMasterStore.orderBy = 'asc';
      KpiMasterStore.orderItem = type;
    }
    else{
      if (KpiMasterStore.orderItem == type) {
        if(KpiMasterStore.orderBy == 'asc') KpiMasterStore.orderBy = 'desc';
        else KpiMasterStore.orderBy = 'asc'
      }
      else{
        KpiMasterStore.orderBy = 'asc';
        KpiMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getKpis(false,null,true).subscribe();
  else
  this.getKpis(false,`&q=${text}`,true).subscribe();
  }

  getSearchItems(additionalParams:string){
    let params='';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    return this._http.get<KpiPaginationResponse>('/kpis' + (params ? params : '')).pipe(
      map((res: KpiPaginationResponse) => {
        KpiMasterStore.setKpis(res);

        return res;
      })
    );
  }

  
}
