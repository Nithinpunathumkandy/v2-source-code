import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentByDocumentType,GoodByDocumentType,AverageByDocumentType,BelowAverageByDocumentType,ByDocumentTypeSummary } from 'src/app/core/models/business-assessments/assessments/by-document-type';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ByDocumentTypeStore } from 'src/app/stores/business-assessments/assessments/by-document-type.store';

@Injectable({
  providedIn: 'root'
})
export class ByDocumentTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  getByDocumentTypeSummary(): Observable<ByDocumentTypeSummary> {
    
    return this._http.get<ByDocumentTypeSummary>('/business-assessments/document-type-summary').pipe(
      map((res: ByDocumentTypeSummary) => {

        ByDocumentTypeStore.setByDocumentTypeSummary(res);
        return res;
      })
    );
  }

  getExcellentByDocumentTypes(): Observable<ExcellentByDocumentType[]> {
    return this._http.get<ExcellentByDocumentType[]>('/business-assessments/document-types?performance=excellent').pipe(
      map((res: ExcellentByDocumentType[]) => {

        ByDocumentTypeStore.setExcellentByDocumentTypes(res);
        return res;
      })
    );
  }

  getGoodByDocumentTypes(): Observable<GoodByDocumentType[]> {
    

    return this._http.get<GoodByDocumentType[]>('/business-assessments/document-types?performance=good').pipe(
      map((res: GoodByDocumentType[]) => {

        ByDocumentTypeStore.setGoodByDocumentTypes(res);
        return res;
      })
    );
  }

  getAverageByDocumentTypes(): Observable<AverageByDocumentType[]> {
    
    return this._http.get<AverageByDocumentType[]>('/business-assessments/document-types?performance=average').pipe(
      map((res: AverageByDocumentType[]) => {

        ByDocumentTypeStore.setAverageByDocumentTypes(res);
        return res;
      })
    );
  }

  getBelowAverageByDocumentTypes(): Observable<BelowAverageByDocumentType[]> {

    return this._http.get<BelowAverageByDocumentType[]>('/business-assessments/document-types?performance=below_average').pipe(
      map((res: BelowAverageByDocumentType[]) => {

        ByDocumentTypeStore.setBelowAverageByDocumentTypes(res);
        return res;
      })
    );
  }
}
