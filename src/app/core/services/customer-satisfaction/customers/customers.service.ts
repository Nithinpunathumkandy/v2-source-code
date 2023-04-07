import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customers, CustomersPaginationResponse, IndivitualCustomers, CustomerComplaints, CustomerFeedbacks, CustomerComplaintsResponse, CustomerFeedbacksResponse } from 'src/app/core/models/customer-satisfaction/customers/customers';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomersStore } from 'src/app/stores/customer-engagement/customers/customers-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,

  ) { }

  // getItems(getAll: boolean = false): Observable<CustomersPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${CustomersStore.currentPage}&status=all`;
  //     if (CustomersStore.orderBy) params += `&order_by=designation_zones.title&order=${CustomersStore.orderBy}`;
  //   }


  //   return this._http.get<CustomersPaginationResponse>('/customers' + (params ? params : '')).pipe(
  //     map((res: CustomersPaginationResponse) => {
  //       CustomersStore.setCustomers(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<CustomersPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomersStore.currentPage}`;
      if (CustomersStore.orderBy)
        params += `&order_by=${CustomersStore.orderItem}&order=${CustomersStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (CustomersStore.searchText) params += (params ? '&q=' : '?q=') + CustomersStore.searchText;

    if(RightSidebarLayoutStore.filterPageTag == 'process' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);

    return this._http
      .get<CustomersPaginationResponse>('/customers' + (params ? params : ''))
      .pipe(
        map((res: CustomersPaginationResponse) => {
          CustomersStore.setCustomers(res);
          return res;
        })
      );
  }

  getCustomerComplaints(id): Observable<CustomerComplaintsResponse> {
    //let params = '';
    // if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    // params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CustomerComplaintsResponse>('/customer-complaints/count-by-complaints/' + id).pipe((
      map((res: CustomerComplaintsResponse) => {
        CustomersStore.setCustomerComplaints(res);
        return res;
      })
    ))
  }

  getCustomerFeedbacks(id): Observable<CustomerFeedbacksResponse> {
    //let params = '';
    // if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    // params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CustomerFeedbacksResponse>('/customer-complaints/count-by-feedbacks/' + id).pipe((
      map((res: CustomerFeedbacksResponse) => {
        CustomersStore.setCustomerFeedbacks(res);
        return res;
      })
    ))
  }

  /**
   * @description
   * This method is used for getting individual Customer details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof CustomersService
   */
  getItem(id): Observable<IndivitualCustomers> {
    return this._http.get<IndivitualCustomers>('/customers/' + id).pipe(
      map((res: IndivitualCustomers) => {
        CustomersStore.setIndivitualCustomers(res)
        return res;
      })
    );
  }

  saveCustomerId(id: number) {
    CustomersStore.setSelectedCustomerId(id);
  }

  updateItem(id, item: Customers): Observable<any> {
    return this._http.put('/customers/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: Customers) {
    return this._http.post('/customers', item).pipe(
      map(res => {
        CustomersStore.setLastInsertedcustomers(res['id']);
        this._utilityService.showSuccessMessage('success', 'customer_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/customers/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customers_template') + ".xlsx");
      }
    )
  }

  importData(data){  
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/customers/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('successfully','customer_imported');
        return res;
      })
    )
  }

  exportToExcel() {
    let params = '';
    if (CustomersStore.orderBy) params += `?order=${CustomersStore.orderBy}`;
    if (CustomersStore.orderItem) params += `&order_by=${CustomersStore.orderItem}`;
    this._http.get('/customers/export' + params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customers') + ".xlsx");
      }
    )
  }
  activate(id: number) {
    return this._http.put('/customers/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/customers/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/customers/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            CustomersStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }


  sortCustomersList(type: string, text: string) {
    if (!CustomersStore.orderBy) {
      CustomersStore.orderBy = 'asc';
      CustomersStore.orderItem = type;
    }
    else {
      if (CustomersStore.orderItem == type) {
        if (CustomersStore.orderBy == 'asc') CustomersStore.orderBy = 'desc';
        else CustomersStore.orderBy = 'asc'
      }
      else {
        CustomersStore.orderBy = 'asc';
        CustomersStore.orderItem = type;
      }
    }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
  }
  /**
  * Sets File Details
  * @param imageDetails File Details Returned by Upload API
  * @param url preview url
  * @param type type of file - logo or brochure
  */
  setFileDetails(imageDetails, url, type) {
    CustomersStore.setFileDetails(imageDetails, url, type);
  }
  // Returns File Details
  getFileDetails(type) {
    return CustomersStore.getFileDetailsByType(type);
  }
}
