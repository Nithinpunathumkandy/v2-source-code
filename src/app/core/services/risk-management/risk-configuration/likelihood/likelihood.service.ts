import { Injectable } from '@angular/core';
import { Likelihood, LikelihoodPaginationResponse, IndividualLikelihood } from 'src/app/core/models/risk-management/risk-configuration/likelihood';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { LikelihoodStore } from 'src/app/stores/risk-management/risk-configuration/likelihood.store';

@Injectable({
  providedIn: 'root'
})
export class LikelihoodService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<LikelihoodPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${LikelihoodStore.currentPage}`;
      if (LikelihoodStore.orderBy) params += `&order=${LikelihoodStore.orderBy}`;
      if (LikelihoodStore.orderItem) params += `&order_by=${LikelihoodStore.orderItem}`;
      if (LikelihoodStore.searchText) params += `&q=${LikelihoodStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(LikelihoodStore.searchText) params += (params ? '&q=' : '?q=')+LikelihoodStore.searchText;
    return this._http.get<LikelihoodPaginationResponse>('/risk-matrix-likelihoods' + (params ? params : '')).pipe(
      map((res: LikelihoodPaginationResponse) => {
        LikelihoodStore.setLikelihoodDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualLikelihood> {
    return this._http.get<IndividualLikelihood>('/risk-matrix-likelihoods/' + id).pipe(
      map((res: IndividualLikelihood) => {
        LikelihoodStore.setIndividualLikelihoodDetails(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateItem(likelihood_id:number, likelihood): Observable<any> {
    return this._http.put('/risk-matrix-likelihoods/'+ likelihood_id, likelihood).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveItem(likelihood): Observable<any> {
    return this._http.post('/risk-matrix-likelihoods', likelihood).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/risk-matrix-likelihoods/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'likelihood_has_been_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/risk-matrix-likelihoods/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "likelihoods.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/risk-matrix-likelihoods/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "likelihoods.xlsx");
      }
    )
  }

       /**
   * Sort Likelihood List
   * @param type Sort By Variable
   */
  sortLikelihoodList(type, callList: boolean = true) {
    if (!LikelihoodStore.orderBy) {
      LikelihoodStore.orderBy = 'asc';
      LikelihoodStore.orderItem = type;
    }
    else {
      if (LikelihoodStore.orderItem == type) {
        if (LikelihoodStore.orderBy == 'asc') LikelihoodStore.orderBy = 'desc';
        else LikelihoodStore.orderBy = 'asc'
      }
      else {
        LikelihoodStore.orderBy = 'asc';
        LikelihoodStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }


}

