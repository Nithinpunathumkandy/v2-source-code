import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ModuleGroupsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
  
  getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<any> {
    let params = '';
    // if (!getAll) {
    //   params = `?page=${LocationMasterStore.currentPage}`;
    //   if (LocationMasterStore.orderBy) params += `&order_by=locations.title&order=${LocationMasterStore.orderBy}`;
    // }
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    // if(LocationMasterStore.searchText) params += (params ? '&q=' : '?q=')+LocationMasterStore.searchText;
    return this._http.get<any>('/module-groups' + (params ? params : '')).pipe(
      map((res: any) => {
        console.log(res);
        // LocationMasterStore.setLocation(res);
        // return res;
      })
    );
  
  }

}
