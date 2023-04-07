import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ChangeRequestItems, ChangeRequestItemsPaginationResponse} from 'src/app/core/models/masters/event-monitoring/event-change-request-items';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventChangeRequestItemsStore } from 'src/app/stores/masters/event-monitoring/event-change-request-items.store';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestItemsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(additionalParams?:string,is_all:boolean = false): Observable<ChangeRequestItemsPaginationResponse> {
      let params = '';
      params = `?page=${EventChangeRequestItemsStore.currentPage}`;
      if (EventChangeRequestItemsStore.orderBy)
        params += `&order_by=${EventChangeRequestItemsStore.orderItem}&order=${EventChangeRequestItemsStore.orderBy}`;
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all'
      if(EventChangeRequestItemsStore.searchText) params += (params ? '&q=' : '?q=')+EventChangeRequestItemsStore.searchText;

      return this._http
        .get<ChangeRequestItemsPaginationResponse>('/event-change-request-items'+(params ? params : ''))
        .pipe(
          map((res: ChangeRequestItemsPaginationResponse) => {
            EventChangeRequestItemsStore.setChangeRequestItems(res);
            return res;
          })
        );
    }

    exportToExcel() {
      this._http.get('/event-change-request-items/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_change_request_items')+".xlsx");
        }
      )
    }

    sortChangeRequestItemList(type:string, text:string) {
      if (!EventChangeRequestItemsStore.orderBy) {
        EventChangeRequestItemsStore.orderBy = 'asc';
        EventChangeRequestItemsStore.orderItem = type;
      }
      else{
        if (EventChangeRequestItemsStore.orderItem == type) {
          if(EventChangeRequestItemsStore.orderBy == 'asc') EventChangeRequestItemsStore.orderBy = 'desc';
          else EventChangeRequestItemsStore.orderBy = 'asc'
        }
        else{
          EventChangeRequestItemsStore.orderBy = 'asc';
          EventChangeRequestItemsStore.orderItem = type;
        }
      }
    }

    
}
