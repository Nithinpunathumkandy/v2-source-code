import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-types-store';
import { KpiTypes, KpiTypesPaginationResponse } from 'src/app/core/models/masters/strategy/kpi-types';

@Injectable({
  providedIn: 'root'
})
export class KpiTypesService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<KpiTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiTypesMasterStore.currentPage}`;
        if (KpiTypesMasterStore.orderBy) params += `&order_by=${KpiTypesMasterStore.orderItem}&order=${KpiTypesMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(KpiTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiTypesMasterStore.searchText;
      return this._http.get<KpiTypesPaginationResponse>('/kpi-types' + (params ? params : '')).pipe(
        map((res: KpiTypesPaginationResponse) => {
          KpiTypesMasterStore.setKpiType(res);
          return res;
        })
      );
   
    }

    

    getAllItems(): Observable<KpiTypes[]>{
      return this._http.get<KpiTypes[]>('/kpi-types?is_all=true').pipe(
        map((res: KpiTypes[]) => {
          
          KpiTypesMasterStore.setAllKpiTypes(res);
          return res;
        })
      );
    }

    saveItem(item: KpiTypes) {
      return this._http.post('/kpi-types', item).pipe(
        map((res:any )=> {
          KpiTypesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'kpi_type_add_added');
          // if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
          // else this.getItems().subscribe();
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: KpiTypes): Observable<any> {
      return this._http.put('/kpi-types/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_type_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/kpi-types/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_type_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              KpiTypesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/kpi-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_type_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/kpi-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_type_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/kpi-types/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_type_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/kpi-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/kpi-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'common_share_toast');
          return res;
        })
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/kpi-types/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','kpi_types_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortKpiTypeslList(type:string, text:string) {
      if (!KpiTypesMasterStore.orderBy) {
        KpiTypesMasterStore.orderBy = 'asc';
        KpiTypesMasterStore.orderItem = type;
      }
      else{
        if (KpiTypesMasterStore.orderItem == type) {
          if(KpiTypesMasterStore.orderBy == 'asc') KpiTypesMasterStore.orderBy = 'desc';
          else KpiTypesMasterStore.orderBy = 'asc'
        }
        else{
          KpiTypesMasterStore.orderBy = 'asc';
          KpiTypesMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}