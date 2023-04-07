import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLogPaginationResponse } from 'src/app/core/models/acl/activity-log';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivityLogStore } from 'src/app/stores/acl/activity-log.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getDetails(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ActivityLogPaginationResponse>{
      let params = ''; 
          if (!getAll) {
            params = `?page=${ActivityLogStore.currentPage}`;
            if (ActivityLogStore.orderBy) params += `&order=${ActivityLogStore.orderBy}`;
          }
          if(ActivityLogStore.searchText) params += (params ? '&q=' : '?q=')+ActivityLogStore.searchText;
      return this._http.get<ActivityLogPaginationResponse>('/activity-logs'+ (params ? params : '')).pipe(
        map((res:ActivityLogPaginationResponse) => {
          ActivityLogStore.setActivityLog(res);
          return res;
        })
      );
    }

    sortActivityLogList(type:string) {
      if (!ActivityLogStore.orderBy) {
        ActivityLogStore.orderBy = 'desc';
        ActivityLogStore.orderItem = type;
      }
      else{
        if (ActivityLogStore.orderItem == type) {
          if(ActivityLogStore.orderBy == 'desc') ActivityLogStore.orderBy = 'asc';
          else ActivityLogStore.orderBy = 'desc'
        }
        else{
          ActivityLogStore.orderBy = 'desc';
          ActivityLogStore.orderItem = type;
        }
      }
    }

    getActivityLogDetails(id){
      return this._http.get('/activity-logs/'+id).pipe(
        map((res) => {
          ActivityLogStore.setLogDetails(res);
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/activity-logs/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('acl_activity')+".xlsx");     

        }
      )
    }
}
