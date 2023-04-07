import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import {GoodUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import {AverageUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import {BelowAverageUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import { SummaryData } from 'src/app/core/models/human-capital/assessment/user-individual';

import { map } from 'rxjs/operators';
import { UserIndividualStore } from 'src/app/stores/human-capital/assessment/user-individual.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class UserIndividualService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getSummaryData(): Observable<SummaryData> {
    
    return this._http.get<SummaryData>('/assessments/user-individual-summary').pipe(
      map((res: SummaryData) => {

        UserIndividualStore.setSummaryData(res);
        return res;
      })
    );
  }

  getExcellentUsers(getAll: boolean = false): Observable<ExcellentUserPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `&page=${UserIndividualStore.excellent_currentPage}`;
    }

    return this._http.get<ExcellentUserPaginationResponse>('/assessments/user-individuals?performance=excellent' + (params ? params : '')).pipe(
      map((res: ExcellentUserPaginationResponse) => {

        UserIndividualStore.setExcellentUsers(res);
        return res;
      })
    );
  }

  getGoodUsers(getAll: boolean = false): Observable<GoodUserPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `&page=${UserIndividualStore.good_currentPage}`;
    }

    return this._http.get<GoodUserPaginationResponse>('/assessments/user-individuals?performance=good' + (params ? params : '')).pipe(
      map((res: GoodUserPaginationResponse) => {

        UserIndividualStore.setGoodUsers(res);
        return res;
      })
    );
  }

  getAverageUsers(getAll: boolean = false): Observable<AverageUserPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `&page=${UserIndividualStore.average_currentPage}`;
    }

    return this._http.get<AverageUserPaginationResponse>('/assessments/user-individuals?performance=average' + (params ? params : '')).pipe(
      map((res: AverageUserPaginationResponse) => {

        UserIndividualStore.setAverageUsers(res);
        return res;
      })
    );
  }

  getBelowAverageUsers(getAll: boolean = false): Observable<BelowAverageUserPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `&page=${UserIndividualStore.below_currentPage}`;
    }

    return this._http.get<BelowAverageUserPaginationResponse>('/assessments/user-individuals?performance=below_average' + (params ? params : '')).pipe(
      map((res: BelowAverageUserPaginationResponse) => {

        UserIndividualStore.setBelowAverageUsers(res);
        return res;
      })
    );
  }
}
