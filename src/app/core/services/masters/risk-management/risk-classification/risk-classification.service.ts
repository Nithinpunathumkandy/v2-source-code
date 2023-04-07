import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskClassificationPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-classification';
import{RiskClassificationMasterStore} from 'src/app/stores/masters/risk-management/risk-classification-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskClassificationService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskClassificationPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskClassificationMasterStore.currentPage}`;
        if (RiskClassificationMasterStore.orderBy) params += `&order_by=${RiskClassificationMasterStore.orderItem}&order=${RiskClassificationMasterStore.orderBy}`;
      }
      if(RiskClassificationMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskClassificationMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskClassificationPaginationResponse>('/risk-classifications' + (params ? params : '')).pipe(
        map((res: RiskClassificationPaginationResponse) => {
          RiskClassificationMasterStore.setRiskClassification(res);
          return res;
        })
      );
    }
    activate(id: number) {
      return this._http.put('/risk-classifications/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_classification_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-classifications/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_classification_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-classifications/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_classification')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-classifications/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskClassificationList(type:string, text:string) {
      if (!RiskClassificationMasterStore.orderBy) {
        RiskClassificationMasterStore.orderBy = 'asc';
        RiskClassificationMasterStore.orderItem = type;
      }
      else{
        if (RiskClassificationMasterStore.orderItem == type) {
          if(RiskClassificationMasterStore.orderBy == 'asc') RiskClassificationMasterStore.orderBy = 'desc';
          else RiskClassificationMasterStore.orderBy = 'asc'
        }
        else{
          RiskClassificationMasterStore.orderBy = 'asc';
          RiskClassificationMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
