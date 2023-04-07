import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentByPdca,GoodByPdca,AverageByPdca,BelowAverageByPdca,ByPdcaSummary } from 'src/app/core/models/business-assessments/assessments/by-pdca';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ByPdcaStore } from 'src/app/stores/business-assessments/assessments/by-pdca.store';

@Injectable({
  providedIn: 'root'
})
export class ByPdcaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  getByPdcaSummary(): Observable<ByPdcaSummary> {
    
    return this._http.get<ByPdcaSummary>('/business-assessments/pdca-summary').pipe(
      map((res: ByPdcaSummary) => {

        ByPdcaStore.setByPdcaSummary(res);
        return res;
      })
    );
  }

  getExcellentByPdcas(): Observable<ExcellentByPdca[]> {
    return this._http.get<ExcellentByPdca[]>('/business-assessments/pdca?performance=excellent').pipe(
      map((res: ExcellentByPdca[]) => {

        ByPdcaStore.setExcellentByPdcas(res);
        return res;
      })
    );
  }

  getGoodByPdcas(): Observable<GoodByPdca[]> {
    

    return this._http.get<GoodByPdca[]>('/business-assessments/pdca?performance=good').pipe(
      map((res: GoodByPdca[]) => {

        ByPdcaStore.setGoodByPdcas(res);
        return res;
      })
    );
  }

  getAverageByPdcas(): Observable<AverageByPdca[]> {
    
    return this._http.get<AverageByPdca[]>('/business-assessments/pdca?performance=average').pipe(
      map((res: AverageByPdca[]) => {

        ByPdcaStore.setAverageByPdcas(res);
        return res;
      })
    );
  }

  getBelowAverageByPdcas(): Observable<BelowAverageByPdca[]> {

    return this._http.get<BelowAverageByPdca[]>('/business-assessments/pdca?performance=below_average').pipe(
      map((res: BelowAverageByPdca[]) => {

        ByPdcaStore.setBelowAverageByPdcas(res);
        return res;
      })
    );
  }
}
