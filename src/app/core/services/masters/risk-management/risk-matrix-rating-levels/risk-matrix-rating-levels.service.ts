import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskMatrixRatingLevels,RiskMatrixRatingLevelsPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-matrix-rating-levels';
import{RiskMatrixRatingLevelsMasterStore} from 'src/app/stores/masters/risk-management/risk-matrix-rating-levels-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskMatrixRatingLevelsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
   
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskMatrixRatingLevelsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskMatrixRatingLevelsMasterStore.currentPage}`;
        if (RiskMatrixRatingLevelsMasterStore.orderBy) params += `&order_by=${RiskMatrixRatingLevelsMasterStore.orderItem}&order=${RiskMatrixRatingLevelsMasterStore.orderBy}`;
      }
      if(RiskMatrixRatingLevelsMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskMatrixRatingLevelsMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskMatrixRatingLevelsPaginationResponse>('/risk-matrix-rating-levels' + (params ? params : '')).pipe(
        map((res: RiskMatrixRatingLevelsPaginationResponse) => {
          RiskMatrixRatingLevelsMasterStore.setRiskMatrixRatingLevels(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<RiskMatrixRatingLevels[]> {
      return this._http.get<RiskMatrixRatingLevels[]>('/risk-matrix-rating-levels').pipe((
        map((res:RiskMatrixRatingLevels[])=>{
          RiskMatrixRatingLevelsMasterStore.setAllRiskMatrixRatingLevels(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/risk-matrix-rating-levels/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_matrix_rating_level_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-matrix-rating-levels/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_matrix_rating_level_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-matrix-rating-levels/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_matrix_rating_levels')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-matrix-rating-levels/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    sortRiskMatrixRatingLevelsList(type:string, text:string) {
      if (!RiskMatrixRatingLevelsMasterStore.orderBy) {
        RiskMatrixRatingLevelsMasterStore.orderBy = 'asc';
        RiskMatrixRatingLevelsMasterStore.orderItem = type;
      }
      else{
        if (RiskMatrixRatingLevelsMasterStore.orderItem == type) {
          if(RiskMatrixRatingLevelsMasterStore.orderBy == 'asc') RiskMatrixRatingLevelsMasterStore.orderBy = 'desc';
          else RiskMatrixRatingLevelsMasterStore.orderBy = 'asc'
        }
        else{
          RiskMatrixRatingLevelsMasterStore.orderBy = 'asc';
          RiskMatrixRatingLevelsMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
