import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentDepartment } from 'src/app/core/models/human-capital/assessment/department';
import {GoodDepartment } from 'src/app/core/models/human-capital/assessment/department';
import {AverageDepartment } from 'src/app/core/models/human-capital/assessment/department';
import {BelowAverageDepartment } from 'src/app/core/models/human-capital/assessment/department';
import { DepartmentSummary } from 'src/app/core/models/human-capital/assessment/department';

import { map } from 'rxjs/operators';
import { DepartmentStore } from 'src/app/stores/human-capital/assessment/department.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getDepartmentSummary(): Observable<DepartmentSummary> {
    
      return this._http.get<DepartmentSummary>('/assessments/department-summary').pipe(
        map((res: DepartmentSummary) => {
  
          DepartmentStore.setDepartmentSummary(res);
          return res;
        })
      );
    }
  
    getExcellentDepartments(): Observable<ExcellentDepartment[]> {
      return this._http.get<ExcellentDepartment[]>('/assessments/departments?performance=excellent').pipe(
        map((res: ExcellentDepartment[]) => {
  
          DepartmentStore.setExcellentDepartments(res);
          return res;
        })
      );
    }
  
    getGoodDepartments(): Observable<GoodDepartment[]> {
      
  
      return this._http.get<GoodDepartment[]>('/assessments/departments?performance=good').pipe(
        map((res: GoodDepartment[]) => {
  
          DepartmentStore.setGoodDepartments(res);
          return res;
        })
      );
    }
  
    getAverageDepartments(): Observable<AverageDepartment[]> {
      
      return this._http.get<AverageDepartment[]>('/assessments/departments?performance=average').pipe(
        map((res: AverageDepartment[]) => {
  
          DepartmentStore.setAverageDepartments(res);
          return res;
        })
      );
    }
  
    getBelowAverageDepartments(): Observable<BelowAverageDepartment[]> {
  
      return this._http.get<BelowAverageDepartment[]>('/assessments/departments?performance=below_average').pipe(
        map((res: BelowAverageDepartment[]) => {
  
          DepartmentStore.setBelowAverageDepartments(res);
          return res;
        })
      );
    }
}
