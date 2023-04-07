import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskRegisterTypesByLanguage, RiskRegisterTypesPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-register-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskRegisterTypesMasterStore } from 'src/app/stores/masters/risk-management/risk-register-type.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RiskRegisterTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskRegisterTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskRegisterTypesMasterStore.currentPage}`;
        if (RiskRegisterTypesMasterStore.orderBy) params += `&order_by=${RiskRegisterTypesMasterStore.orderItem}&order=${RiskRegisterTypesMasterStore.orderBy}`;
      }
      if(RiskRegisterTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskRegisterTypesMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskRegisterTypesPaginationResponse>('/risk-register-types' + (params ? params : '')).pipe(
        map((res: RiskRegisterTypesPaginationResponse) => {
          if(res['data'].length>0){
            for(let i of res['data']){
              if(i['risk_rating_values']){
                i['risk_rating_values']=i['risk_rating_values'].split(',');
              }
            }           
          }
          RiskRegisterTypesMasterStore.setRiskRegisterTypes(res);
          return res;
        })
      );
    }

    getRatingsByLanguage(getAll: boolean = false,additionalParams?:string,status:boolean = false){
      let params = '';
     
        if (RiskRegisterTypesMasterStore.orderBy) params += `&order_by=rist_register_types.id&order=desc`;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskRegisterTypesByLanguage[]>('/risk-register-types?all_languages=true' + (params ? params : '')).pipe(
        map((res: RiskRegisterTypesByLanguage[]) => {
          RiskRegisterTypesMasterStore.setAllRiskRegisterTypes(res);
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-register-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_register_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-register-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_register_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-register-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_register_type')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-register-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskRegisterTypesList(type:string, text:string) {
      if (!RiskRegisterTypesMasterStore.orderBy) {
        RiskRegisterTypesMasterStore.orderBy = 'asc';
        RiskRegisterTypesMasterStore.orderItem = type;
      }
      else{
        if (RiskRegisterTypesMasterStore.orderItem == type) {
          if(RiskRegisterTypesMasterStore.orderBy == 'asc') RiskRegisterTypesMasterStore.orderBy = 'desc';
          else RiskRegisterTypesMasterStore.orderBy = 'asc'
        }
        else{
          RiskRegisterTypesMasterStore.orderBy = 'asc';
          RiskRegisterTypesMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
