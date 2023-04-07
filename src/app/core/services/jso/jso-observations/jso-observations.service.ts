import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { Observable } from 'rxjs';
import { IndividualJsoObservation, jsoObservationsPaginationResponse } from 'src/app/core/models/jso/jso-observations/jso-observations.model';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class JsoObservationsService {
  // getitems: any;

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    // private _cdr:ChangeDetectorRef,
    private _utilityService: UtilityService) { }


  getItems(getAll: boolean = false, additionalParams?: string): Observable<jsoObservationsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoObservationStore.currentPage}`;
      if (JsoObservationStore.orderBy) params += `&order=${JsoObservationStore.orderBy}`;
      if (JsoObservationStore.orderItem) params += `&order_by=${JsoObservationStore.orderItem}`;
    }
    if(additionalParams) params += additionalParams;
    if (JsoObservationStore.searchText) params += (params ? '&q=' : '?q=') + JsoObservationStore.searchText;
    if (RightSidebarLayoutStore.filterPageTag == 'jso_observation' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<jsoObservationsPaginationResponse>('/jso-observations' + (params ? params : '')).pipe(
      map((res: jsoObservationsPaginationResponse) => {
        JsoObservationStore.setJsoObservations(res);
        return res;
      })
    );
  }

  getItem(id): Observable<IndividualJsoObservation> {
    return this._http.get<IndividualJsoObservation>('/jso-observations/' + id).pipe(
      map((res: IndividualJsoObservation) => {
        JsoObservationStore.setIndividualJsoObservations(res)
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jso-observations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_observation_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (JsoObservationStore.orderBy) params += `?order=${JsoObservationStore.orderBy}`;
    if (JsoObservationStore.orderItem) params += `&order_by=${JsoObservationStore.orderItem}`;
    // if (JsoObservationStore.searchText) params += `&q=${JsoObservationStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'jso_observation' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/jso-observations/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('jso_observations')+".xlsx");
      }
    )
  }

  sortJsoObservationsList(type, callList: boolean = true) {
    if (!JsoObservationStore.orderBy) {
      JsoObservationStore.orderBy = 'asc';
      JsoObservationStore.orderItem = type;
    }
    else {
      if (JsoObservationStore.orderItem == type) {
        if (JsoObservationStore.orderBy == 'asc') JsoObservationStore.orderBy = 'desc';
        else JsoObservationStore.orderBy = 'asc'
      }
      else {
        JsoObservationStore.orderBy = 'asc';
        JsoObservationStore.orderItem = type;
      }
    }
  }

  saveItem(value) {
    return this._http.post('/jso-observations', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'jso_observation_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/jso-observations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_observation_deleted');
        this.getItems(false, null).subscribe(resp=>{
          if (resp.from==null){
            JsoObservationStore.setCurrentPage(resp.current_page-1);
            this.getItems(false).subscribe();
          }
        });
        // setTimeout(() => {    
        //   if (JsoObservationStore.currentPage > 1) {
        //     JsoObservationStore.currentPage = Math.ceil(JsoObservationStore.totalItems / 15);
        //     // this._utilityService.detectChanges(this._cdr);
        //   }
        // }, 500);
        // this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  updateItem(id, saveData): Observable<any> {
    return this._http.put('/jso-observations/' + id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_observation_updated');

        this.getItems(false, null).subscribe();

        return res;
      })
    );
  }
}
