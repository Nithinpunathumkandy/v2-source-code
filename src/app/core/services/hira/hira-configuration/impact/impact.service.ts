import { Injectable } from '@angular/core';
import { ImpactStore } from 'src/app/stores/hira/hira-configuration/impact.store';
import { Impact, ImpactPaginationResponse, IndividualImpact } from 'src/app/core/models/hira/hira-configuration/impact';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ImpactService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ImpactPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImpactStore.currentPage}`;
      if (ImpactStore.orderBy) params += `&order=${ImpactStore.orderBy}`;
      if (ImpactStore.orderItem) params += `&order_by=${ImpactStore.orderItem}`;
      if (ImpactStore.searchText) params += `&q=${ImpactStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(ImpactStore.searchText) params += (params ? '&q=' : '?q=')+ImpactStore.searchText;
    return this._http.get<ImpactPaginationResponse>('/risk-matrix-impacts' + (params ? params : '')).pipe(
      map((res: ImpactPaginationResponse) => {
        ImpactStore.setImpactDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualImpact> {
    return this._http.get<IndividualImpact>('/risk-matrix-impacts/' + id).pipe(
      map((res: IndividualImpact) => {
        ImpactStore.setIndividualImpactDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(impact_id:number, impact): Observable<any> {
    return this._http.put('/risk-matrix-impacts/'+ impact_id, impact).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveItem(impact): Observable<any> {
    return this._http.post('/risk-matrix-impacts', impact).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/risk-matrix-impacts/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/risk-matrix-impacts/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "impacts.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/risk-matrix-impacts/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "impacts.xlsx");
      }
    )
  }

  
        /**
   * Sort Impact List
   * @param type Sort By Variable
   */
  sortImpactList(type, callList: boolean = true) {
    if (!ImpactStore.orderBy) {
      ImpactStore.orderBy = 'asc';
      ImpactStore.orderItem = type;
    }
    else {
      if (ImpactStore.orderItem == type) {
        if (ImpactStore.orderBy == 'asc') ImpactStore.orderBy = 'desc';
        else ImpactStore.orderBy = 'asc'
      }
      else {
        ImpactStore.orderBy = 'asc';
        ImpactStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }
}
