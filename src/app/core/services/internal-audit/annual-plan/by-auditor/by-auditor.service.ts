import { Injectable } from '@angular/core';
import { ByAuditor,ByAuditorPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-auditor/by-auditor';
import {ByAuditorsStore} from 'src/app/stores/internal-audit/annual-plan/by-auditor/by-auditor-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ByAuditorService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ByAuditorPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ByAuditorsStore.currentPage}`;
        if (ByAuditorsStore.orderBy) params += `&order_by=by-auditor.title&order=${ByAuditorsStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(ByAuditorsStore.searchText) params += (params ? '&q=' : '?q=')+ByAuditorsStore.searchText;
      return this._http.get<ByAuditorPaginationResponse>('/anual-plan/by-auditor' + (params ? params : '')).pipe(
        map((res: ByAuditorPaginationResponse) => {
          ByAuditorsStore.setByAuditors(res);
          return res;
        })
      );
   
    }

    getItem(id): Observable<ByAuditor> {
      return this._http.get<ByAuditor>('/anual-plan/by-auditor/'+id).pipe((
        map((res:ByAuditor)=>{
          ByAuditorsStore.setIndividualByAuditors(res);
          return res;
        })
      ))
    }

    

    getAllItems(): Observable<ByAuditor[]>{
      return this._http.get<ByAuditor[]>('/anual-plan/by-auditor').pipe(
        map((res: ByAuditor[]) => {
          
          ByAuditorsStore.setAllByAuditors(res);
          return res;
        })
      );
    }
}

