import { Injectable } from '@angular/core';
import { AuditorsStore } from 'src/app/stores/internal-audit/auditors/auditors-store';
import { Auditors,AuditorsDetails } from 'src/app/core/models/internal-audit/auditors/auditors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class AuditorsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    getAllItems(id:number , params?: string ): Observable<AuditorsDetails>{
      return this._http.get<AuditorsDetails>('/audit-programs/'+id+'/auditors'+ (params ? params : '')).pipe(
        map((res: AuditorsDetails) => {
          
          AuditorsStore.setAllAuditors(res);
          return res;
        })
      );
    }

}
