import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unit} from 'src/app/core/models/general/unit';
import { map } from 'rxjs/operators';
import { UnitStore } from 'src/app/stores/general/unit.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';


@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getUnits(params?:string): Observable<Unit> {
    return this._http.get<Unit>('/units'+ (params ? params : '')).pipe(
      map((res: Unit) => {
        UnitStore.setUnits(res['data']);
        return res;
      })
    );
  }

  searchUnit(params){
    return this.getUnits(params ? params : '').pipe(
      map((res: Unit) => {
        UnitStore.setUnits(res['data']);
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/units', item).pipe(
      map(res => {
        UnitStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('Success!', 'Unit has been created!');
        this.getUnits().subscribe();
        return res;
      })
    );
  }

}
