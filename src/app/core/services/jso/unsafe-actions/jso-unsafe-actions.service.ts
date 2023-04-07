import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { IndividualJsoUnsafeAction, jsoUnsafeActionsPaginationResponse } from 'src/app/core/models/jso/jso-unsafe-actions/jso-unsafe-actions.model';
import { JsoUnsafeActionStore } from 'src/app/stores/jso/unsafe-actions/jso-unsafe-actions-store';
import { IndividualJsoObservation, jsoObservationsPaginationResponse } from 'src/app/core/models/jso/jso-observations/jso-observations.model';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class JsoUnsafeActionsService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    // private _cdr:ChangeDetectorRef,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<jsoUnsafeActionsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoUnsafeActionStore.currentPage}`;
      if (JsoUnsafeActionStore.orderBy) params += `&order=${JsoUnsafeActionStore.orderBy}`;
      if (JsoUnsafeActionStore.orderItem) params += `&order_by=${JsoUnsafeActionStore.orderItem}`;
    }
    if(additionalParams) params += additionalParams;
    if (JsoUnsafeActionStore.searchText) params += (params ? '&q=' : '?q=') + JsoUnsafeActionStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'jso_unsafe' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<jsoUnsafeActionsPaginationResponse>('/jso-observation-unsafe-actions' + (params ? params : '')).pipe(
      map((res: jsoUnsafeActionsPaginationResponse) => {
        JsoUnsafeActionStore.setJsoUnsafeActions(res);
        return res;
      })
    );
  }

  getItem(id) : Observable<IndividualJsoUnsafeAction>{
    return this._http.get<IndividualJsoUnsafeAction>('/jso-observation-unsafe-actions/' +id).pipe(
      map((res: IndividualJsoUnsafeAction) => {
        JsoUnsafeActionStore.setIndividualJsoUnsafeAction(res)
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jso-observation-unsafe-actions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (JsoUnsafeActionStore.orderBy) params += `?order=${JsoUnsafeActionStore.orderBy}`;
    if (JsoUnsafeActionStore.orderItem) params += `&order_by=${JsoUnsafeActionStore.orderItem}`;
    // if (JsoUnsafeActionStore.searchText) params += `&q=${JsoUnsafeActionStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'jso_unsafe' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/jso-observation-unsafe-actions/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_actions')+".xlsx");
      }
    )
  }

  sortUnsafeActionList(type) {
    if (!JsoUnsafeActionStore.orderBy) {
      JsoUnsafeActionStore.orderBy = 'asc';
      JsoUnsafeActionStore.orderItem = type;
    }
    else {
      if (JsoUnsafeActionStore.orderItem == type) {
        if (JsoUnsafeActionStore.orderBy == 'asc') JsoUnsafeActionStore.orderBy = 'desc';
        else JsoUnsafeActionStore.orderBy = 'asc'
      }
      else {
        JsoUnsafeActionStore.orderBy = 'asc';
        JsoUnsafeActionStore.orderItem = type;
      }
    }
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/jso-observation-unsafe-actions/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_unsafe_action_updated');

        this.getItems(false,null).subscribe();

        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/jso-observation-unsafe-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_unsafe_action_deleted');
        // setTimeout(() => { 
        //   if (JsoUnsafeActionStore.currentPage > 1) {
        //     JsoUnsafeActionStore.currentPage = Math.ceil(JsoUnsafeActionStore.totalItems / 15);
        //   }
        //   // this._utilityService.detectChanges(this._cdr);
        // }, 500);
        this.getItems(false,null).subscribe(resp=>{
          if (resp.from==null){
            JsoUnsafeActionStore.setCurrentPage(resp.current_page-1);
            this.getItems(false).subscribe();
          }
        });
        return res;
      })
    );
  }

  resolveUnsafeAction(id: number) {
    let params = '';
    return this._http.put('/jso-observation-unsafe-actions/'+id+ '/resolve', params).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_unsafe_action_resolved');
        this.getItems(false,null).subscribe();
        JsoUnsafeActionStore.setResolveUnsafeAction(res)
        return res;
      })
    );
  }

  closeUnsafeAction(id: number,item) {
    // let params = '';
    return this._http.put('/jso-observation-unsafe-actions/'+id+ '/close', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_unsafe_action_closed');
        // this.getItems(false,null).subscribe();
        JsoUnsafeActionStore.setCloseUnsafeAction(res)
        return res;
      })
    );
  }
}
