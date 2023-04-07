import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SoaImplementationStatuses, SoaImplementationStatusesPaginationResponse } from 'src/app/core/models/masters/isms/soa-implementation-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SoaImplementationStatusesMasterStore } from 'src/app/stores/masters/isms/soa-implementation-statuses-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class SoaImplementationStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<SoaImplementationStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${SoaImplementationStatusesMasterStore.currentPage}`;
        if (SoaImplementationStatusesMasterStore.orderBy) params += `&order_by=${SoaImplementationStatusesMasterStore.orderItem}&order=${SoaImplementationStatusesMasterStore.orderBy}`;
      }
      if(SoaImplementationStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=')+SoaImplementationStatusesMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<SoaImplementationStatusesPaginationResponse>('/soa-implementation-statuses' + (params ? params : '')).pipe(
        map((res: SoaImplementationStatusesPaginationResponse) => {
          SoaImplementationStatusesMasterStore.setSoaImplementationStatuses(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<SoaImplementationStatuses[]> {
      return this._http.get<SoaImplementationStatuses[]>('/soa-implementation-statuses').pipe((
        map((res:SoaImplementationStatuses[])=>{
          SoaImplementationStatusesMasterStore.setAllSoaImplementationStatuses(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<SoaImplementationStatuses> {
      return this._http.get<SoaImplementationStatuses>('/soa-implementation-statuses/'+id).pipe((
        map((res:SoaImplementationStatuses)=>{
          SoaImplementationStatusesMasterStore.setIndividualSoaImplementationStatuses(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/soa-implementation-statuses', item).pipe(
        map((res:any )=> {
          SoaImplementationStatusesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('soa-implementation-statuses', 'soa_implementation_statuses_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/soa-implementation-statuses/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_implementation_statuses_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/soa-implementation-statuses/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_implementation_statuses_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              SoaImplementationStatusesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/soa-implementation-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_implementation_statuses_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/soa-implementation-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_implementation_statuses_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/soa-implementation-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('soa_implementation_statuses')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/soa-implementation-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('soa_implementation_statuses_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/soa-implementation-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/soa-implementation-statuses/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','soa_implementation_statuses_imported');
          this.getItems(false, null, true).subscribe();
          return res;
        })
      )
    }

    sortSoaImplementationStatusesList(type:string, text:string) {
      if (!SoaImplementationStatusesMasterStore.orderBy) {
        SoaImplementationStatusesMasterStore.orderBy = 'asc';
        SoaImplementationStatusesMasterStore.orderItem = type;
      }
      else{
        if (SoaImplementationStatusesMasterStore.orderItem == type) {
          if(SoaImplementationStatusesMasterStore.orderBy == 'asc') SoaImplementationStatusesMasterStore.orderBy = 'desc';
          else SoaImplementationStatusesMasterStore.orderBy = 'asc'
        }
        else{
          SoaImplementationStatusesMasterStore.orderBy = 'asc';
          SoaImplementationStatusesMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
