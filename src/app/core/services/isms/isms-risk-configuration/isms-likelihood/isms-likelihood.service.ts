import { Injectable } from '@angular/core';
import { Likelihood, LikelihoodPaginationResponse, IndividualLikelihood } from 'src/app/core/models/risk-management/risk-configuration/likelihood';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsLikelihoodStore } from 'src/app/stores/isms/isms-risk-configuration/isms-likelihood.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsLikelihoodService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<LikelihoodPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsLikelihoodStore.currentPage}`;
      if (IsmsLikelihoodStore.orderBy) params += `&order=${IsmsLikelihoodStore.orderBy}`;
      if (IsmsLikelihoodStore.orderItem) params += `&order_by=${IsmsLikelihoodStore.orderItem}`;
      if (IsmsLikelihoodStore.searchText) params += `&q=${IsmsLikelihoodStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(IsmsLikelihoodStore.searchText) params += (params ? '&q=' : '?q=')+IsmsLikelihoodStore.searchText;
    return this._http.get<LikelihoodPaginationResponse>('/isms-risk-matrix-likelihoods' + (params ? params : '')).pipe(
      map((res: LikelihoodPaginationResponse) => {
        IsmsLikelihoodStore.setLikelihoodDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualLikelihood> {
    return this._http.get<IndividualLikelihood>('/isms-risk-matrix-likelihoods/' + id).pipe(
      map((res: IndividualLikelihood) => {
        IsmsLikelihoodStore.setIndividualLikelihoodDetails(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateItem(likelihood_id:number, likelihood): Observable<any> {
    return this._http.put('/isms-risk-matrix-likelihoods/'+ likelihood_id, likelihood).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveItem(likelihood): Observable<any> {
    return this._http.post('/isms-risk-matrix-likelihoods', likelihood).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risk-matrix-likelihoods/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/isms-risk-matrix-likelihoods/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_likelihoods_template')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    this._http.get('/isms-risk-matrix-likelihoods/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_likelihoods')+".xlsx");     
      }
    )
  }

       /**
   * Sort Likelihood List
   * @param type Sort By Variable
   */
  sortLikelihoodList(type, callList: boolean = true) {
    if (!IsmsLikelihoodStore.orderBy) {
      IsmsLikelihoodStore.orderBy = 'asc';
      IsmsLikelihoodStore.orderItem = type;
    }
    else {
      if (IsmsLikelihoodStore.orderItem == type) {
        if (IsmsLikelihoodStore.orderBy == 'asc') IsmsLikelihoodStore.orderBy = 'desc';
        else IsmsLikelihoodStore.orderBy = 'asc'
      }
      else {
        IsmsLikelihoodStore.orderBy = 'asc';
        IsmsLikelihoodStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }

}
