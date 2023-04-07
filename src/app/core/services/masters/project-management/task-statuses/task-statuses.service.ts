import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TaskStatusesMasterStore } from 'src/app/stores/masters/project-management/task-statuses.store';
import { TaskStatusesPaginationResponse } from 'src/app/core/models/masters/project-management/task-statuses';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Task Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof TaskStatusesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TaskStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${TaskStatusesMasterStore.currentPage}`;
      if (TaskStatusesMasterStore.orderBy) params += `&order=${TaskStatusesMasterStore.orderBy}`;
      if (TaskStatusesMasterStore.orderItem) params += `&order_by=${TaskStatusesMasterStore.orderItem}`;
      if (TaskStatusesMasterStore.searchText) params += `&q=${TaskStatusesMasterStore.searchText}`;
      }
      if (TaskStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + TaskStatusesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<TaskStatusesPaginationResponse>('/task-statuses' + (params ? params : '')).pipe(
        map((res: TaskStatusesPaginationResponse) => {
          TaskStatusesMasterStore.setTaskStatuses(res);
          return res;
        })
      );
    }







    sortTaskStatusesList(type:string, text:string) {
      if (!TaskStatusesMasterStore.orderBy) {
        TaskStatusesMasterStore.orderBy = 'asc';
        TaskStatusesMasterStore.orderItem = type;
      }
      else{
        if (TaskStatusesMasterStore.orderItem == type) {
          if(TaskStatusesMasterStore.orderBy == 'asc') TaskStatusesMasterStore.orderBy = 'desc';
          else TaskStatusesMasterStore.orderBy = 'asc'
        }
        else{
          TaskStatusesMasterStore.orderBy = 'asc';
          TaskStatusesMasterStore.orderItem = type;
        }
      }
    }
}
