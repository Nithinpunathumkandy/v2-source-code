import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { MasterMenuItemsStore } from 'src/app/stores/masters/general/master-menu-store';

@Injectable({
  providedIn: 'root'
})
export class MasterMenuService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(status: boolean = false): Observable<any> {
      let params = '';
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<any>('/master-menu' + (params ? params : '')).pipe(
        map((res: any) => {
          // console.log(res);
          MasterMenuItemsStore.setMasterMenu(res);
          return res;
        })
      );
   
    }
}
