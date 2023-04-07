import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { OrganizationChartStore } from "src/app/stores/organization/business_profile/organization-chart.store";
import { UtilityService } from "src/app/shared/services/utility.service";
import { OrganizationChartImageResponse } from 'src/app/core/models/organization/business_profile/organization-chart-image.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getUserWiseOrganizationChart(){
    return this._http.get('/organization-charts/user-wise').pipe(
      map((res: any[]) => {
        // console.log(res);
        OrganizationChartStore.setUserWiseChart(res);
        return res;
      })
    );
  }

  getDepartmentWiseOrganizationChart(){
    return this._http.get('/organization-charts/department-wise').pipe(
      map((res: any) => {
        OrganizationChartStore.setDepartmentWiseChart(res['primary']);
        return res;
      })
    );
  }

  uploadUserChartImage(item:any){
    return this._http.post('/organization-charts', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        return res;
      })
    );
  }

  getUserChartImage():Observable<OrganizationChartImageResponse>{
    return this._http.get<OrganizationChartImageResponse>('/organization-charts').pipe(
      map((res: OrganizationChartImageResponse) => {
        OrganizationChartStore.setOrganizationChartImageResponse(res['data']);
        return res;
      })
    );
  }

  deleteOrganizationChartImage(id){
    return this._http.delete('/organization-charts/'+id).pipe(
      map(res=>{
        this._utilityService.showSuccessMessage('success','delete_success');
        return res;
      })
    )
  }

}
