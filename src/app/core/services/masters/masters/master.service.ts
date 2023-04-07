import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MasterMenuStore } from 'src/app/stores/masters/masters.store';
import { MasterModules, SubModulesSearchResult } from "src/app/core/models/masters/masters-menu";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    getItems(){
      return this._http.get<MasterModules[]>('/master-menu').pipe(
        map((res: MasterModules[]) => {
          // console.log(res);
          MasterMenuStore.setMenuItems(res);
          return res;
        })
      );
    }

    searchItems(params:string){
      return this._http.get<SubModulesSearchResult[]>('/master-menu'+(params ? params : '')).pipe(
        map((res: SubModulesSearchResult[]) => {
          MasterMenuStore.setSearchResults(res);
          return res;
        })
      );
    }

    getItemByPath(path){
      let ind = MasterMenuStore.masterMenu.findIndex(e=>'/masters'+e.client_side_url == path);
      if(ind != -1)
        return MasterMenuStore.masterMenu[ind].id;
    }

}
