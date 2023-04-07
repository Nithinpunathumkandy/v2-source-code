import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CustomerResponse, Customers, CustomerDetails } from "src/app/core/models/organization/business_profile/business-customers";
import { BusinessCustomersStore } from 'src/app/stores/organization/business_profile/business-customers.store';

import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationCustomersService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // Get Request - Get Customers
  getItems(getAll: boolean = false,additionalParams: string = '',is_all:boolean = false): Observable<CustomerResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BusinessCustomersStore.currentPage}`;
    }
    if(additionalParams){
      if (params) 
        params += '&'+additionalParams; 
      else
        params += '?'+additionalParams;
    }
    if (BusinessCustomersStore.searchText) params += `&q=${BusinessCustomersStore.searchText}`;
    if(is_all) params += `&status=all`;
    return this._http.get<CustomerResponse>('/customers'+(params ? params : '')).pipe(
      map((res: CustomerResponse) => {
        BusinessCustomersStore.setCustomerDetails(res);
        return res;
      })
    );
  }

  // Put Request - update customer
  updateItem(id, item: Customers): Observable<any> {
    return this._http.put('/customers/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'organization_customer_updated');
        this.getItems(false,'access_all=true',true).subscribe();
        return res;
      })
    );
  }

  // Post Request - Save Customer
  saveItem(item: Customers) {
    return this._http.post('/customers', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'organization_customer_created');
        this.getItems(false,'access_all=true',true).subscribe();
        return res;
      })
    );
  }

  // Delete Request - Delete Customer
  deleteItem(id: number) {
    return this._http.delete('/customers/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'organization_customer_deleted');
        this.getItems(false,'access_all=true',true).subscribe(resp=>{
          if(resp.from == null && resp.current_page > 1){
            BusinessCustomersStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false,'access_all=true',true).subscribe();
          }
        });
        return res;
      })
    );
  }

  deactivateItem(id: number){
    return this._http.put('/customers/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'organization_customer_deactivated');
        this.getItems(false,'access_all=true',true).subscribe();
        return res;
      })
    );
  }

  activateItem(id: number){
    return this._http.put('/customers/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'organization_customer_activated');
        this.getItems(false,'access_all=true',true).subscribe();
        return res;
      })
    );
  }

  // Get Particular customer details by Id
  getItem(id):Observable<CustomerDetails>{
    return this._http.get('/customers/' + id).pipe(
      map((res:CustomerDetails) => {
        BusinessCustomersStore.setSelectedCustomerDetails(res);
        return res;
      })
    );
  }

  /**
   * Sets File Details
   * @param imageDetails File Details Returned by Upload API
   * @param url preview url
   * @param type type of file - logo or brochure
   */
  setFileDetails(imageDetails,url,type){
    BusinessCustomersStore.setFileDetails(imageDetails,url,type);
  }

  // Returns File Details
  getFileDetails(type){
    return BusinessCustomersStore.getFileDetailsByType(type);
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/customers/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('customers_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    this._http.get('/customers/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('customers')+'.xlsx');
      }
    )
  }

  selectRequiredCustomer(customer){
    BusinessCustomersStore.addSelectedCustomer(customer);
  }

}
