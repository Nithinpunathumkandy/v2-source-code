import { Injectable } from '@angular/core';
import { AppUserFeedback,AppUserFeedbackPaginationResponse } from 'src/app/core/models/masters/general/app-user-feedback';
import {AppUserFeedbackMasterStore} from 'src/app/stores/masters/general/app-user-feedback-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AppUserFeedbackService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status: boolean = false): Observable<AppUserFeedbackPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AppUserFeedbackMasterStore.currentPage}`;
        if (AppUserFeedbackMasterStore.orderBy) params += `&order_by=app_user_feedbacks.title&order=${AppUserFeedbackMasterStore.orderBy}`;

      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(AppUserFeedbackMasterStore.searchText) params += (params ? '&q=' : '?q=')+AppUserFeedbackMasterStore.searchText;
      return this._http.get<AppUserFeedbackPaginationResponse>('/app-user-feedbacks' + (params ? params : '')).pipe(
        map((res: AppUserFeedbackPaginationResponse) => {
          AppUserFeedbackMasterStore.setAppUserFeedback(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AppUserFeedback[]>{
      return this._http.get<AppUserFeedback[]>('/app-user-feedbacks?is_all=true').pipe(
        map((res: AppUserFeedback[]) => {
          
          AppUserFeedbackMasterStore.setAllAppUserFeedbacks(res);
          return res;
        })
      );
    }


    sortAppUserFeedbackList(type:string, text:string) {
      if (!AppUserFeedbackMasterStore.orderBy) {
        AppUserFeedbackMasterStore.orderBy = 'asc';
        AppUserFeedbackMasterStore.orderItem = type;
      }
      else{
        if (AppUserFeedbackMasterStore.orderItem == type) {
          if(AppUserFeedbackMasterStore.orderBy == 'asc') AppUserFeedbackMasterStore.orderBy = 'desc';
          else AppUserFeedbackMasterStore.orderBy = 'asc'
        }
        else{
          AppUserFeedbackMasterStore.orderBy = 'asc';
          AppUserFeedbackMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems().subscribe();
      // else
      //   this.getItems(false,`&q=${text}`).subscribe();
    }
}

