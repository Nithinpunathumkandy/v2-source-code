import { Injectable } from '@angular/core';
import { ByYear,ByYearPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-year/by-year';
import {ByYearsStore} from 'src/app/stores/internal-audit/annual-plan/by-year/by-year-store';

import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ByYearService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ByYearPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ByYearsStore.currentPage}`;
        if (ByYearsStore.orderBy) params += `&order_by=by-year.title&order=${ByYearsStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(ByYearsStore.searchText) params += (params ? '&q=' : '?q=')+ByYearsStore.searchText;
      return this._http.get<ByYearPaginationResponse>('/anual-plan/by-year' + (params ? params : '')).pipe(
        map((res: ByYearPaginationResponse) => {
          ByYearsStore.settByYear(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<ByYear[]>{
      return this._http.get<ByYear[]>('/anual-plan/by-year').pipe(
        map((res: ByYear[]) => {
          
          ByYearsStore.setAlltByYears(res);
          return res;
        })
      );
    }
    
    setSelected(id){
      ByYearsStore.setSelected(id);
    }
}
