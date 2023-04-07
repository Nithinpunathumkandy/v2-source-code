import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BusinessServices, BusinessServiceCategories, ServicesPaginatedResponse } from "src/app/core/models/organization/business_profile/business-services";
import { BusinessServiceStore } from 'src/app/stores/organization/business_profile/business-services.store';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class BusinessServicesService {

  constructor(private _utilityService: UtilityService, private _http: HttpClient) { }

  // Get all services
  getAllItems(getAll: boolean = false,additionalParams?: string): Observable<ServicesPaginatedResponse> {
    let params: string = '';
    if(!getAll)
      params = `?page=${BusinessServiceStore.currentPage}&limit=3`;
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if (additionalParams) params += additionalParams;
    return this.getItems(params).pipe(
      map((res: ServicesPaginatedResponse) => {
        for(let i of res.data){
          // i['view_more'] = false; // for description
          // i['view_items_more'] = false; // for service items
          i['service_items'] = i.service_item_title ? i.service_item_title.split(',') : [];
          i['service_items_string'] = i.service_item_title ? JSON.stringify(i.service_item_title.split(',')) : JSON.stringify([]); // stringified service items
          // let temp: any = i['service_items'].slice(0,2); // initially show only two items
          // i['service_items'] = temp;
        }
        BusinessServiceStore.setServicesDetails(res);
        return res;
      })
    );
  }
  
  // Get Request
  getItems(params?: string): Observable<ServicesPaginatedResponse> {
    return this._http.get<ServicesPaginatedResponse>('/services' + (params ? params : ''));
  }

  //Get Request
  getItem(id): Observable<any> {
    return this._http.get('/services/' + id).pipe(
      map(res => {
        BusinessServiceStore.setServiceItem(res)
        return res;
      })
    );
  }

  // Post Request - Save Service
  saveItem(item: BusinessServices) {
    return this._http.post('/services', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  // Delete Request - Delete Service
  deleteItem(id: number) {
    return this._http.delete('/services/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems().subscribe(resp=>{
          if(resp.from == null && resp.current_page > 1){
            BusinessServiceStore.setCurrentPage(resp.current_page - 1);
            this.getAllItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  // Put Request - Update Service
  updateItem(id, item: BusinessServices): Observable<any> {
    return this._http.put('/services/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  /*-------------------------------- Service Categories --------------------------------------------------*/

  // Get Service Categories
  getServiceCategories(params?: string): Observable<BusinessServiceCategories[]> {
    return this.getCategoryItems(params).pipe(
      map((res: BusinessServiceCategories[]) => {
        BusinessServiceStore.setServiceCategoryDetails(res['data']);
        return res;
      })
    );
  }

  // Get Request
  getCategoryItems(params?: string): Observable<BusinessServiceCategories[]> {
    return this._http.get<BusinessServiceCategories[]>('/service-categories' + (params ? params : ''));
  }

  // Post Request - Save Service Category
  saveServiceCategory(item){
    return this._http.post('/service-categories', item).pipe(
      map(res => {
        BusinessServiceStore.setLastInsertedServiceCategory(res['id']);
        this._utilityService.showSuccessMessage('success', 'service_category_created');
        this.getServiceCategories().subscribe();
        return res;
      })
    );
  }

  /*--------------------------------------------------------------------------------------------------------*/

  clearServicesList(){
    BusinessServiceStore.clearServicesList();
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/services/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('service_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    let params ='';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/services/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('services')+'.xlsx');
      }
    )
  }

  selectRequiredServices(items) {
		BusinessServiceStore.addSelectedServices(items);
	}
}
