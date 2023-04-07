import { Injectable } from '@angular/core';
import { AppFeedbackSmiley,AppFeedbackSmileyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-smiley';
import {AppFeedbackSmileyMasterStore} from 'src/app/stores/masters/general/app-feedback-smiley-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppFeedbackSmileyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AppFeedbackSmileyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AppFeedbackSmileyMasterStore.currentPage}`;
        if (AppFeedbackSmileyMasterStore.orderBy) params += `&order_by=app_feedback_smily_language.title&order=${AppFeedbackSmileyMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(AppFeedbackSmileyMasterStore.searchText) params += (params ? '&q=' : '?q=')+AppFeedbackSmileyMasterStore.searchText;
      return this._http.get<AppFeedbackSmileyPaginationResponse>('/app-feedback-smilies' + (params ? params : '')).pipe(
        map((res: AppFeedbackSmileyPaginationResponse) => {
          AppFeedbackSmileyMasterStore.setAppFeedbackSmiley(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AppFeedbackSmiley[]>{
      return this._http.get<AppFeedbackSmiley[]>('/app-feedback-smilies?is_all=true').pipe(
        map((res: AppFeedbackSmiley[]) => {
          
          AppFeedbackSmileyMasterStore.setAllAppFeedbackSmilies(res);
          return res;
        })
      );
    }


    sortAppFeedbackKeyList(type:string, text:string) {
      if (!AppFeedbackSmileyMasterStore.orderBy) {
        AppFeedbackSmileyMasterStore.orderBy = 'asc';
        AppFeedbackSmileyMasterStore.orderItem = type;
      }
      else{
        if (AppFeedbackSmileyMasterStore.orderItem == type) {
          if(AppFeedbackSmileyMasterStore.orderBy == 'asc') AppFeedbackSmileyMasterStore.orderBy = 'desc';
          else AppFeedbackSmileyMasterStore.orderBy = 'asc'
        }
        else{
          AppFeedbackSmileyMasterStore.orderBy = 'asc';
          AppFeedbackSmileyMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }
}
