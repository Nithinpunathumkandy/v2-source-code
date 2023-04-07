import { Injectable } from '@angular/core';
import { ByLeader} from 'src/app/core/models/internal-audit/chart/by_leader/by_leader';
import {ByLeaderChartStore} from 'src/app/stores/internal-audit/chart/by_leader/by-leader-store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class ByLeaderChartService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(id:number): Observable<ByLeader[]>{
      return this._http.get<ByLeader[]>('/audit-programs/'+id+'/chart-by-leader').pipe(
        map((res: ByLeader[]) => {
          
          ByLeaderChartStore.setAllByLeaderChart(res);
          return res;
        })
      );
    }
}

