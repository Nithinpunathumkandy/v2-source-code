import { Injectable } from '@angular/core';
import { AppFeedbackKey,AppFeedbackKeyPaginationResponse } from 'src/app/core/models/masters/general/app-feedback-key';
import {AppFeedbackKeyMasterStore} from 'src/app/stores/masters/general/app-feedback-key-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AppFeedbackKeyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AppFeedbackKeyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AppFeedbackKeyMasterStore.currentPage}`;
        if (AppFeedbackKeyMasterStore.orderBy) params += `&order_by=app_feedback_key_language.title&order=${AppFeedbackKeyMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(AppFeedbackKeyMasterStore.searchText) params += (params ? '&q=' : '?q=')+AppFeedbackKeyMasterStore.searchText;
      return this._http.get<AppFeedbackKeyPaginationResponse>('/app-feedback-keys' + (params ? params : '')).pipe(
        map((res: AppFeedbackKeyPaginationResponse) => {
          AppFeedbackKeyMasterStore.setAppFeedbackKey(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AppFeedbackKey[]>{
      return this._http.get<AppFeedbackKey[]>('/app-feedback-keys?is_all=true').pipe(
        map((res: AppFeedbackKey[]) => {
          
          AppFeedbackKeyMasterStore.setAllAppFeedbackKeys(res);
          return res;
        })
      );
    }

    sortAppFeedbackSmileylList(type:string, text:string) {
      if (!AppFeedbackKeyMasterStore.orderBy) {
        AppFeedbackKeyMasterStore.orderBy = 'asc';
        AppFeedbackKeyMasterStore.orderItem = type;
      }
      else{
        if (AppFeedbackKeyMasterStore.orderItem == type) {
          if(AppFeedbackKeyMasterStore.orderBy == 'asc') AppFeedbackKeyMasterStore.orderBy = 'desc';
          else AppFeedbackKeyMasterStore.orderBy = 'asc'
        }
        else{
          AppFeedbackKeyMasterStore.orderBy = 'asc';
          AppFeedbackKeyMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }
}
