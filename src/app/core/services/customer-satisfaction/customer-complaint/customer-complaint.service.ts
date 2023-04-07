import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerComplaintPaginationResponse, IndividualCustomerComplaint } from 'src/app/core/models/customer-satisfaction/customer-complaint/customer-complaint';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<CustomerComplaintPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerComplaintStore.currentPage}`;
      if (CustomerComplaintStore.orderBy) params += `&order_by=${CustomerComplaintStore.orderItem}&order=${CustomerComplaintStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (CustomerComplaintStore.searchText) params += (params ? '&q=' : '?q=') + CustomerComplaintStore.searchText;
    if (is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'customers' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CustomerComplaintPaginationResponse>('/customer-complaints' + (params ? params : '')).pipe(
      map((res: CustomerComplaintPaginationResponse) => {
        CustomerComplaintStore.setCustomerComplaint(res);
        return res;
      })
    );

  }

  getItem(id): Observable<IndividualCustomerComplaint> {
    return this._http.get<IndividualCustomerComplaint>('/customer-complaints/' + id).pipe(
      map((res: IndividualCustomerComplaint) => {
        CustomerComplaintStore.setIndivitualCustomerComplaint(res)
        return res;
      })
    );
  }

  updateCustomerComplaint(id, item) {
    return this._http.put('/customer-complaints/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_updated');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }


  saveCustomerComplaint(item) {
    return this._http.post('/customer-complaints', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/customer-complaints/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (CustomerComplaintStore.orderBy) params += `?order=${CustomerComplaintStore.orderBy}`;
    if (CustomerComplaintStore.orderItem) params += `&order_by=${CustomerComplaintStore.orderItem}`;
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/customer-complaints/export' + params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint') + ".xlsx");
      }
    )
  }

  delete(id: number) {
    return this._http.delete('/customer-complaints/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  saveCustomerComplaintId(id: number) {
    CustomerComplaintStore.setSelectedCustomerComplaintId(id);
  }

  sortCustomerComplaintList(type: string, text: string) {
    if (!CustomerComplaintStore.orderBy) {
      CustomerComplaintStore.orderBy = 'asc';
      CustomerComplaintStore.orderItem = type;
    }
    else {
      if (CustomerComplaintStore.orderItem == type) {
        if (CustomerComplaintStore.orderBy == 'asc') CustomerComplaintStore.orderBy = 'desc';
        else CustomerComplaintStore.orderBy = 'asc'
      }
      else {
        CustomerComplaintStore.orderBy = 'asc';
        CustomerComplaintStore.orderItem = type;
      }
    }
  }
  setDocumentDetails(imageDetails, url) {
    CustomerComplaintStore.setDocumentDetails(imageDetails, url);
  }



}
