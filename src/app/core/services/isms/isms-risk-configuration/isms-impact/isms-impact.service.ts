import { Injectable } from '@angular/core';
import { IsmsImpactStore } from 'src/app/stores/isms/isms-risk-configuration/isms-impact.store';
import { Impact, ImpactPaginationResponse, IndividualImpact } from 'src/app/core/models/risk-management/risk-configuration/impact';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsImpactService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ImpactPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsImpactStore.currentPage}`;
      if (IsmsImpactStore.orderBy) params += `&order=${IsmsImpactStore.orderBy}`;
      if (IsmsImpactStore.orderItem) params += `&order_by=${IsmsImpactStore.orderItem}`;
      if (IsmsImpactStore.searchText) params += `&q=${IsmsImpactStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(IsmsImpactStore.searchText) params += (params ? '&q=' : '?q=')+IsmsImpactStore.searchText;
    return this._http.get<ImpactPaginationResponse>('/isms-risk-matrix-impacts' + (params ? params : '')).pipe(
      map((res: ImpactPaginationResponse) => {
        IsmsImpactStore.setImpactDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualImpact> {
    return this._http.get<IndividualImpact>('/isms-risk-matrix-impacts/' + id).pipe(
      map((res: IndividualImpact) => {
        IsmsImpactStore.setIndividualImpactDetails(res);
        // IsmsImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(impact_id:number, impact): Observable<any> {
    return this._http.put('/isms-risk-matrix-impacts/'+ impact_id, impact).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveItem(impact): Observable<any> {
    return this._http.post('/isms-risk-matrix-impacts', impact).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risk-matrix-impacts/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'impact_has_been_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/isms-risk-matrix-impacts/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_impact_templates')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    this._http.get('/isms-risk-matrix-impacts/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_impacts')+".xlsx");     
      }
    )
  }

  
       /**
   * Sort Impact List
   * @param type Sort By Variable
   */
  sortImpactList(type, callList: boolean = true) {
    if (!IsmsImpactStore.orderBy) {
      IsmsImpactStore.orderBy = 'asc';
      IsmsImpactStore.orderItem = type;
    }
    else {
      if (IsmsImpactStore.orderItem == type) {
        if (IsmsImpactStore.orderBy == 'asc') IsmsImpactStore.orderBy = 'desc';
        else IsmsImpactStore.orderBy = 'asc'
      }
      else {
        IsmsImpactStore.orderBy = 'asc';
        IsmsImpactStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }

}
