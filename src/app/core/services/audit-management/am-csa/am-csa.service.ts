import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AmCSA, AmCSAPaginationResponse } from 'src/app/core/models/audit-management/am-csa/am-csa';

@Injectable({
  providedIn: 'root'
})
export class AmCsaService {
  
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmCSAPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmCSAStore.currentPage}`;
      if (AmCSAStore.orderBy) params += `&order=${AmCSAStore.orderBy}`;
      if (AmCSAStore.orderItem) params += `&order_by=${AmCSAStore.orderItem}`;
      if (AmCSAStore.searchText) params += `&q=${AmCSAStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_csa' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmCSAPaginationResponse>('/am-audit-control-self-assessments' + (params ? params : '')).pipe(
      map((res: AmCSAPaginationResponse) => {
        AmCSAStore.setCSADetails(res);
        return res;
      })
    );


  }

  getItem(id: number): Observable<AmCSA> {
    return this._http.get<AmCSA>('/am-audit-control-self-assessments/' + id).pipe(
      map((res: AmCSA) => {
        AmCSAStore.setIndividualCSADetails(res);
        return res;
      })
    );
  }


  updateItem(id: number, auditSettings): Observable<any> {
    return this._http.put('/am-audit-control-self-assessments/' + id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_csa_updated');
      
          this.getItems().subscribe();
        
        this.getItem(id).subscribe();

        return res;
      })
    );
  }


  saveItem(audit): Observable<any> {
    return this._http.post('/am-audit-control-self-assessments', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_csa_added');
    
          this.getItems().subscribe();
        
        this.getItem(res['id']).subscribe();

        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-control-self-assessments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_csa_deleted');
       
          this.getItems().subscribe();
        
        return res;
      })
    );
  }

  closeAuditFinding(id: number) {
    return this._http.put('/am-audit-control-self-assessments/' + id + '/close', null).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('success', 'am_csa_close_message');

        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  setDocumentDetails(imageDetails, url) {
    AmCSAStore.setDocumentDetails(imageDetails, url);
  }


  /**
* Sort Risk List
* @param type Sort By Variable
*/
  sortAuditFindingList(type, callList: boolean = true) {
    if (!AmCSAStore.orderBy) {
      AmCSAStore.orderBy = 'asc';
      AmCSAStore.orderItem = type;
    }
    else {
      if (AmCSAStore.orderItem == type) {
        if (AmCSAStore.orderBy == 'asc') AmCSAStore.orderBy = 'desc';
        else AmCSAStore.orderBy = 'asc'
      }
      else {
        AmCSAStore.orderBy = 'asc';
        AmCSAStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems().subscribe();
  }

  generateTemplate() {
    this._http.get('/am-audit-control-self-assessments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_csa_template') + ".xlsx");

      }
    )
  }

  exportToExcel() {
    let params = '';
    if (AmCSAStore.orderBy) params += `?order=${AmCSAStore.orderBy}`;
    if (AmCSAStore.orderItem) params += `&order_by=${AmCSAStore.orderItem}`;
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_csa' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/am-audit-control-self-assessments/export' + (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_csa') + ".xlsx");
        SubMenuItemStore.exportClicked = false;
      }
    )


  }


  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/am-audit-control-self-assessments/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'am_audit_csa_imported');
        this.getItems(false, null).subscribe();
        return res;
      })
    )
  }
}
