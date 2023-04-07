import { Injectable } from '@angular/core';
import { ByDepartment} from 'src/app/core/models/internal-audit/chart/by_department/by_department';
import {ByDepartmentChartStore} from 'src/app/stores/internal-audit/chart/by_department/by-department-store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class ByDepartmentChartService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(id:number): Observable<ByDepartment[]>{
      return this._http.get<ByDepartment[]>('/audit-programs/'+id+'/chart-by-department').pipe(
        map((res: ByDepartment[]) => {
          
          ByDepartmentChartStore.setAllDepartmentChartData(res);
          return res;
        })
      );
    }
}
