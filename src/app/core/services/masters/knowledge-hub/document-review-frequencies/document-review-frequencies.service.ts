import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentReviewFrequenciesPagination } from 'src/app/core/models/masters/knowledge-hub/document-review-frequencies';
import { DocumentReviewFrequenciesMasterStore } from 'src/app/stores/masters/knowledge-hub/document-review-frequencies-store';

@Injectable({
  providedIn: 'root'
})
export class DocumentReviewFrequenciesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<DocumentReviewFrequenciesPagination> {
    let params = '';
    if (!getAll) {
      params = `?page=${DocumentReviewFrequenciesMasterStore.currentPage}`;
    }
    if (DocumentReviewFrequenciesMasterStore.orderBy) params += `&order_by=${DocumentReviewFrequenciesMasterStore.orderItem}&order=${DocumentReviewFrequenciesMasterStore.orderBy}`;
    if (DocumentReviewFrequenciesMasterStore.searchText) params += (params ? '&q=' : '?q=') + DocumentReviewFrequenciesMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<DocumentReviewFrequenciesPagination>('/document-review-frequencies' + (params ? params : '')).pipe(
      map((res: DocumentReviewFrequenciesPagination) => {
        DocumentReviewFrequenciesMasterStore.setDocumentReviewFrequencies(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/document-review-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_review_frequencies')+".xlsx");
      }
    )
  }

  sortRiskMatrixLikelihood(type: string, text: string) {
    if (!DocumentReviewFrequenciesMasterStore.orderBy) {
      DocumentReviewFrequenciesMasterStore.orderBy = 'asc';
      DocumentReviewFrequenciesMasterStore.orderItem = type;
    }
    else {
      if (DocumentReviewFrequenciesMasterStore.orderItem == type) {
        if (DocumentReviewFrequenciesMasterStore.orderBy == 'asc') DocumentReviewFrequenciesMasterStore.orderBy = 'desc';
        else DocumentReviewFrequenciesMasterStore.orderBy = 'asc'
      }
      else {
        DocumentReviewFrequenciesMasterStore.orderBy = 'asc';
        DocumentReviewFrequenciesMasterStore.orderItem = type;
      }
    }
  }

}
