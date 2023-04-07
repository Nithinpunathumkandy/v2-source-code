import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { KpiCalculationTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-calculation-type.store';
import { KpiCalculationTypes, KpiCalculationTypesPaginationResponse } from 'src/app/core/models/masters/strategy/kpi-calculation-types';

@Injectable({
  providedIn: 'root'
})
export class KpiCalculationTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<KpiCalculationTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${KpiCalculationTypesMasterStore.currentPage}`;
      if (KpiCalculationTypesMasterStore.orderBy) params += `&order=${KpiCalculationTypesMasterStore.orderBy}`;
      if (KpiCalculationTypesMasterStore.orderItem) params += `&order_by=${KpiCalculationTypesMasterStore.orderItem}`;
      if (KpiCalculationTypesMasterStore.searchText) params += `&q=${KpiCalculationTypesMasterStore.searchText}`;
      }
      if (KpiCalculationTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + KpiCalculationTypesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<KpiCalculationTypesPaginationResponse>('/kpi-calculation-types' + (params ? params : '')).pipe(
        map((res: KpiCalculationTypesPaginationResponse) => {
          KpiCalculationTypesMasterStore.setKpiCalculationTypes(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<KpiCalculationTypes[]> {
      return this._http.get<KpiCalculationTypes[]>('/kpi-calculation-types').pipe((
        map((res:KpiCalculationTypes[])=>{
          KpiCalculationTypesMasterStore.setAllKpiTypes(res);
          return res;
        })
      ))
    }

    exportToExcel() {
      this._http.get('/kpi-calculation-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('	kpi_calculation_types')+".xlsx");
        }
      )
    }

    sortKpiCalculationTypesList(type:string, text:string) {
      if (!KpiCalculationTypesMasterStore.orderBy) {
        KpiCalculationTypesMasterStore.orderBy = 'asc';
        KpiCalculationTypesMasterStore.orderItem = type;
      }
      else{
        if (KpiCalculationTypesMasterStore.orderItem == type) {
          if(KpiCalculationTypesMasterStore.orderBy == 'asc') KpiCalculationTypesMasterStore.orderBy = 'desc';
          else KpiCalculationTypesMasterStore.orderBy = 'asc'
        }
        else{
          KpiCalculationTypesMasterStore.orderBy = 'asc';
          KpiCalculationTypesMasterStore.orderItem = type;
        }
      }
    }

    searchKpiCalculationType(params){
      return this.getItems(params ? params : '').pipe(
        map((res: KpiCalculationTypesPaginationResponse) => {
          KpiCalculationTypesMasterStore.setKpiCalculationTypes(res);
          return res;
        })
      );
    }
    
}
