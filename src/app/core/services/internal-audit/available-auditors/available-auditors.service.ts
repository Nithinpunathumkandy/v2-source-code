import { Injectable } from '@angular/core';
import { AvailableAuditorsStore } from 'src/app/stores/internal-audit/available-auditors/available-auditors-store';
import { AvailableAuditors,AvailableAuditorsPaginationResponse } from 'src/app/core/models/internal-audit/available-auditors/available-auditors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AvailableAuditorsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(id:number , params?: string ): Observable<AvailableAuditors[]>{
      return this._http.get<AvailableAuditors[]>('/audit-programs/'+id+'/available-auditors?status=Active'+ (params ? params : '')).pipe(
        map((res: AvailableAuditors[]) => {
          
          AvailableAuditorsStore.setAllAvailableAuditor(res);
          return res;
        })
      );
    }
}

