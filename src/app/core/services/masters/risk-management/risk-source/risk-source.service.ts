import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskSource,RiskSourcePaginationResponse} from 'src/app/core/models/masters/risk-management/risk-source';
import{RiskSourceMasterStore} from 'src/app/stores/masters/risk-management/risk-source-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';



@Injectable({
  providedIn: 'root'
})
export class RiskSourceService {

  
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskSourcePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskSourceMasterStore.currentPage}`;
        if (RiskSourceMasterStore.orderBy) params += `&order_by=${RiskSourceMasterStore.orderItem}&order=${RiskSourceMasterStore.orderBy}`;
      }
      if(RiskSourceMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskSourceMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskSourcePaginationResponse>('/risk-sources' + (params ? params : '')).pipe(
        map((res: RiskSourcePaginationResponse) => {
          RiskSourceMasterStore.setRiskSource(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<RiskSource[]> {
      return this._http.get<RiskSource[]>('/risk-sources').pipe((
        map((res:RiskSource[])=>{
          RiskSourceMasterStore.setAllRiskSource(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<RiskSource> {
      return this._http.get<RiskSource>('/risk-sources/'+id).pipe((
        map((res:RiskSource)=>{
          RiskSourceMasterStore.setIndividualRiskSource(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-sources', item).pipe(
        map((res:any )=> {
          RiskSourceMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'risk_source_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-sources/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_source_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-sources/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_source_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskSourceMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-sources/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_source_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-sources/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_source_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-sources/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_source')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/risk-sources/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_source_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-sources/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-sources/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','risk_source_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortRiskSourceList(type:string, text:string) {
      if (!RiskSourceMasterStore.orderBy) {
        RiskSourceMasterStore.orderBy = 'asc';
        RiskSourceMasterStore.orderItem = type;
      }
      else{
        if (RiskSourceMasterStore.orderItem == type) {
          if(RiskSourceMasterStore.orderBy == 'asc') RiskSourceMasterStore.orderBy = 'desc';
          else RiskSourceMasterStore.orderBy = 'asc'
        }
        else{
          RiskSourceMasterStore.orderBy = 'asc';
          RiskSourceMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
