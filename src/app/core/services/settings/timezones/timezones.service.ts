import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import {TimezonesStore} from 'src/app/stores/settings/timezones.store';
import { Timezones } from 'src/app/core/models/settings/timezones';

@Injectable({
  providedIn: 'root'
})
export class TimezonesService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }
  getAllItems(): Observable<Timezones[]> {
    return this.getItems('?is_all=true&status=all').pipe(
      map((res: Timezones[]) => {
        TimezonesStore.setTimezones(res);
        return res;
      })
    );
  }
  getItems(params?: string): Observable<Timezones[]> {
    return this._http.get<Timezones[]>('/timezones' + (params ? params : ''));
  }

}
