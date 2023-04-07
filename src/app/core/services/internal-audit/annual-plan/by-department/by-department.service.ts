import { Injectable } from '@angular/core';
import { ByDepartment,ByDepartmentPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-department/by-department';
import {ByDepartmentsStore} from 'src/app/stores/internal-audit/annual-plan/by-department/by-department-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ByDepartmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ByDepartmentPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ByDepartmentsStore.currentPage}`;
        if (ByDepartmentsStore.orderBy) params += `&order_by=by-auditor.title&order=${ByDepartmentsStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(ByDepartmentsStore.searchText) params += (params ? '&q=' : '?q=')+ByDepartmentsStore.searchText;
      return this._http.get<ByDepartmentPaginationResponse>('/anual-plan/by-department' + (params ? params : '')).pipe(
        map((res: ByDepartmentPaginationResponse) => {
          ByDepartmentsStore.setByDepartments(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<ByDepartment[]>{
      return this._http.get<ByDepartment[]>('/anual-plan/by-department').pipe(
        map((res: ByDepartment[]) => {
          
          ByDepartmentsStore.setAllByDepartments(res);
          return res;
        })
      );
    }
    
    setSelected(id){
      ByDepartmentsStore.setSelected(id);
    }
}
