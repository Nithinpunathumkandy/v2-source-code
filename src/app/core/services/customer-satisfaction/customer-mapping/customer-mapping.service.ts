import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerComplaintMapping } from 'src/app/core/models/customer-satisfaction/customer-complaint/customer-complaint';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerMappingStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-mapping-store';

@Injectable({
  providedIn: 'root'
})
export class CustomerMappingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,

  ) { }

  getCustomerMapping(getAll: boolean = false, additionalParams?: string): Observable<CustomerComplaintMapping> {
    let params = '';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(CustomerComplaintStore.searchText) params += (params ? '&q=' : '?q=')+CustomerMappingStore.searchText;
    return this._http.get<CustomerComplaintMapping>('/customer-complaints/'+CustomerComplaintStore.selectedCustomerComplaintId+'/mapping').pipe(
      map((res: CustomerComplaintMapping) => {
        CustomerMappingStore.setCustomerComplaintMapping(res);
        return res;
      })
    );
  }


  saveControlForMapping(saveData): Observable<any>{
   
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/control-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'control_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );  
  }

  saveProcessForMapping(saveData): Observable<any>{
   
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'process_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );  
  }
  saveLocationForMapping(saveData): Observable<any>{
   
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/location-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'location_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );  
  }

  saveProjectForMapping(saveData): Observable<any>{
   
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/project-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'project_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  
  }
  
  saveProductForMapping(saveData): Observable<any>{
     
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/product-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'product_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  
  }
  

  saveCustomerForMapping(saveData): Observable<any>{
     
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/customer-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'customer_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  
  }
  
  saveObjectiveForMapping(saveData): Observable<any>{
     
    return this._http.post('/customer-complaints/'+CustomerComplaintStore.selectedId+'/strategic-objective-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'objective_mapped_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  
  }

  deleteControlMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/control-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'control_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/process-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteLocationMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/location-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'location_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/project-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'project_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/product-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'product_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteCustomerMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/customer-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'customer_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }

  deleteObjectiveMapping(id) {
    return this._http.put('/customer-complaints/' +CustomerComplaintStore.selectedId+'/strategic-objective-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'objective_mapping_delete_msg');
        this.getCustomerMapping().subscribe();
        return res;
      })
    );
  }
}
