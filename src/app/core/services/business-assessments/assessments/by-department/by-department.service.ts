import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentByDepartment,GoodByDepartment,AverageByDepartment,BelowAverageByDepartment,ByDepartmentSummary } from 'src/app/core/models/business-assessments/assessments/by-department';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ByDepartmentStore } from 'src/app/stores/business-assessments/assessments/by-department.store';

@Injectable({
  providedIn: 'root'
})
export class ByDepartmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  getByDepartmentSummary(): Observable<ByDepartmentSummary> {
    
    return this._http.get<ByDepartmentSummary>('/business-assessments/department-summary').pipe(
      map((res: ByDepartmentSummary) => {

        ByDepartmentStore.setByDepartmentSummary(res);
        return res;
      })
    );
  }

  getExcellentByDepartments(): Observable<ExcellentByDepartment[]> {
    return this._http.get<ExcellentByDepartment[]>('/business-assessments/departments?performance=excellent').pipe(
      map((res: ExcellentByDepartment[]) => {

        ByDepartmentStore.setExcellentByDepartments(res);
        return res;
      })
    );
  }

  getGoodByDepartments(): Observable<GoodByDepartment[]> {
    

    return this._http.get<GoodByDepartment[]>('/business-assessments/departments?performance=good').pipe(
      map((res: GoodByDepartment[]) => {

        ByDepartmentStore.setGoodByDepartments(res);
        return res;
      })
    );
  }

  getAverageByDepartments(): Observable<AverageByDepartment[]> {
    
    return this._http.get<AverageByDepartment[]>('/business-assessments/departments?performance=average').pipe(
      map((res: AverageByDepartment[]) => {

        ByDepartmentStore.setAverageByDepartments(res);
        return res;
      })
    );
  }

  getBelowAverageByDepartments(): Observable<BelowAverageByDepartment[]> {

    return this._http.get<BelowAverageByDepartment[]>('/business-assessments/departments?performance=below_average').pipe(
      map((res: BelowAverageByDepartment[]) => {

        ByDepartmentStore.setBelowAverageByDepartments(res);
        return res;
      })
    );
  }
}
