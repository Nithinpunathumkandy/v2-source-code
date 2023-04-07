import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentByMsType,GoodByMsType,AverageByMsType,BelowAverageByMsType,ByMsTypeSummary } from 'src/app/core/models/business-assessments/assessments/by-ms-type';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ByMsTypeStore } from 'src/app/stores/business-assessments/assessments/by-ms-type.store';

@Injectable({
  providedIn: 'root'
})
export class ByMsTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  getByMsTypeSummary(): Observable<ByMsTypeSummary> {
    
    return this._http.get<ByMsTypeSummary>('/business-assessments/ms-type-summary').pipe(
      map((res: ByMsTypeSummary) => {

        ByMsTypeStore.setByMsTypeSummary(res);
        return res;
      })
    );
  }

  getExcellentByMsTypes(): Observable<ExcellentByMsType[]> {
    return this._http.get<ExcellentByMsType[]>('/business-assessments/ms-types?performance=excellent').pipe(
      map((res: ExcellentByMsType[]) => {

        ByMsTypeStore.setExcellentByMsTypes(res);
        return res;
      })
    );
  }

  getGoodByMsTypes(): Observable<GoodByMsType[]> {
    

    return this._http.get<GoodByMsType[]>('/business-assessments/ms-types?performance=good').pipe(
      map((res: GoodByMsType[]) => {

        ByMsTypeStore.setGoodByMsTypes(res);
        return res;
      })
    );
  }

  getAverageByMsTypes(): Observable<AverageByMsType[]> {
    
    return this._http.get<AverageByMsType[]>('/business-assessments/ms-types?performance=average').pipe(
      map((res: AverageByMsType[]) => {

        ByMsTypeStore.setAverageByMsTypes(res);
        return res;
      })
    );
  }

  getBelowAverageByMsTypes(): Observable<BelowAverageByMsType[]> {

    return this._http.get<BelowAverageByMsType[]>('/business-assessments/ms-types?performance=below_average').pipe(
      map((res: BelowAverageByMsType[]) => {

        ByMsTypeStore.setBelowAverageByMsTypes(res);
        return res;
      })
    );
  }
}
