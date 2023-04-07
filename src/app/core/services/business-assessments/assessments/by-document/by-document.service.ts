import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {performanceSummary,ByDocumentSummary } from 'src/app/core/models/business-assessments/assessments/by-document';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ByDocumentStore } from 'src/app/stores/business-assessments/assessments/by-document.store';

@Injectable({
  providedIn: 'root'
})
export class ByDocumentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  getByDocumentSummary(): Observable<ByDocumentSummary> {
    
    return this._http.get<ByDocumentSummary>('/business-assessments/document-summary').pipe(
      map((res: ByDocumentSummary) => {

        ByDocumentStore.setByDocumentSummary(res);
        return res;
      })
    );
  }

  getExcellentByDocuments(): Observable<performanceSummary[]> {
    return this._http.get<performanceSummary[]>('/business-assessments/documents?performance=excellent').pipe(
      map((res: performanceSummary[]) => {

        ByDocumentStore.setExcellentByDocuments(res);
        return res;
      })
    );
  }

  getGoodByDocuments(): Observable<performanceSummary[]> {
    

    return this._http.get<performanceSummary[]>('/business-assessments/documents?performance=good').pipe(
      map((res: performanceSummary[]) => {

        ByDocumentStore.setGoodByDocuments(res);
        return res;
      })
    );
  }

  getAverageByDocuments(): Observable<performanceSummary[]> {
    
    return this._http.get<performanceSummary[]>('/business-assessments/documents?performance=average').pipe(
      map((res: performanceSummary[]) => {

        ByDocumentStore.setAverageByDocuments(res);
        return res;
      })
    );
  }

  getBelowAverageByDocuments(): Observable<performanceSummary[]> {

    return this._http.get<performanceSummary[]>('/business-assessments/documents?performance=below_average').pipe(
      map((res: performanceSummary[]) => {

        ByDocumentStore.setBelowAverageByDocuments(res);
        return res;
      })
    );
  }
}
