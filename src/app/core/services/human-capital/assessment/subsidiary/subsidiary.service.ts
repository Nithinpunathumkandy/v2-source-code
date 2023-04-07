import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import {GoodSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import {AverageSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import {BelowAverageSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import { SubsidiarySummary } from 'src/app/core/models/human-capital/assessment/subsidiary';

import { map } from 'rxjs/operators';
import { SubsidiaryStore } from 'src/app/stores/human-capital/assessment/subsidiary.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class SubsidiaryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getSubsidiarySummary(): Observable<SubsidiarySummary> {
    
    return this._http.get<SubsidiarySummary>('/assessments/subsidiary-summary').pipe(
      map((res: SubsidiarySummary) => {

        SubsidiaryStore.setSubsidiarySummary(res);
        return res;
      })
    );
  }

  getExcellentSubsidiaries(): Observable<ExcellentSubsidiary[]> {
    
    return this._http.get<ExcellentSubsidiary[]>('/assessments/subsidiaries?performance=excellent').pipe(
      map((res: ExcellentSubsidiary[]) => {

        SubsidiaryStore.setExcellentSubsidiaries(res);
        return res;
      })
    );
  }

  getGoodSubsidiaries(): Observable<GoodSubsidiary[]> {
    
    return this._http.get<GoodSubsidiary[]>('/assessments/subsidiaries?performance=good').pipe(
      map((res: GoodSubsidiary[]) => {

        SubsidiaryStore.setGoodSubsidiaries(res);
        return res;
      })
    );
  }

  getAverageSubsidiaries(): Observable<AverageSubsidiary[]> {
    
    return this._http.get<AverageSubsidiary[]>('/assessments/subsidiaries?performance=average').pipe(
      map((res: AverageSubsidiary[]) => {

        SubsidiaryStore.setAverageSubsidiaries(res);
        return res;
      })
    );
  }

  getBelowAverageSubsidiaries(): Observable<BelowAverageSubsidiary[]> {
    

    return this._http.get<BelowAverageSubsidiary[]>('/assessments/subsidiaries?performance=below_average').pipe(
      map((res: BelowAverageSubsidiary[]) => {

        SubsidiaryStore.setBelowAverageSubsidiaries(res);
        return res;
      })
    );
  }
}
