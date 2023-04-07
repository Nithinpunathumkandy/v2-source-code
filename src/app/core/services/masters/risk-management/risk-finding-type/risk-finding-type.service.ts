import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskFindingTypesByLanguage, RiskFindingTypesPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-finding-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskFindingTypesMasterStore } from 'src/app/stores/masters/risk-management/risk-finding-type.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskFindingTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskFindingTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskFindingTypesMasterStore.currentPage}`;
        if (RiskFindingTypesMasterStore.orderBy) params += `&order_by=${RiskFindingTypesMasterStore.orderItem}&order=${RiskFindingTypesMasterStore.orderBy}`;
      }
      if(RiskFindingTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskFindingTypesMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskFindingTypesPaginationResponse>('/risk-finding-types' + (params ? params : '')).pipe(
        map((res: RiskFindingTypesPaginationResponse) => {
          if(res['data'].length>0){
            for(let i of res['data']){
              if(i['risk_rating_values']){
                i['risk_rating_values']=i['risk_rating_values'].split(',');
              }
            }           
          }
          RiskFindingTypesMasterStore.setRiskFindingTypes(res);
          return res;
        })
      );
    }

    getRatingsByLanguage(getAll: boolean = false,additionalParams?:string,status:boolean = false){
      let params = '';
     
        if (RiskFindingTypesMasterStore.orderBy) params += `&order_by=rist_finding_types.id&order=desc`;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskFindingTypesByLanguage[]>('/risk-finding-types?all_languages=true' + (params ? params : '')).pipe(
        map((res: RiskFindingTypesByLanguage[]) => {
          RiskFindingTypesMasterStore.setAllRiskFindingTypes(res);
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-finding-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_finding_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-finding-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_finding_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-finding-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_finding_type')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-finding-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskFindingTypesList(type:string, text:string) {
      if (!RiskFindingTypesMasterStore.orderBy) {
        RiskFindingTypesMasterStore.orderBy = 'asc';
        RiskFindingTypesMasterStore.orderItem = type;
      }
      else{
        if (RiskFindingTypesMasterStore.orderItem == type) {
          if(RiskFindingTypesMasterStore.orderBy == 'asc') RiskFindingTypesMasterStore.orderBy = 'desc';
          else RiskFindingTypesMasterStore.orderBy = 'asc'
        }
        else{
          RiskFindingTypesMasterStore.orderBy = 'asc';
          RiskFindingTypesMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
