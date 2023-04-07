import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Policies, PolicyDetails, PolicyPaginationResponse } from "src/app/core/models/organization/business_profile/policies/policies";
import { PolicyStore } from 'src/app/stores/organization/business_profile/policies/policies.store';

import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient, private _utilityService: UtilityService) {
  }

  // Get Request - Policy List
  getAllItems(initialise = false): Observable<Policies[]> {
    let params = '?is_all=true';
    return this.getItems(params).pipe(
      map((res: Policies[]) => {
        PolicyStore.setPolicyList(res);
        if(initialise  && res.length > 0)
          this.setSelected();
        return res;
      })
    );
  }
  
  getItems(params?: string): Observable<Policies[]> {
    return this._http.get<Policies[]>('/organization-policies' + (params ? params : ''));
  }

  // POST Request - Save Policy Details
  saveItem(item: Policies, position?:number) {
    return this._http.post('/organization-policies', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getAllItems(false).subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // Delete Request - Delete Policy
  delete(id: number, position?:number) {
    return this._http.delete('/organization-policies/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems(false).subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  //Put Request - Update Policy
  updateItem(id, item: Policies): Observable<any> {
    return this._http.put('/organization-policies/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getAllItems().subscribe(resp=>{
          this.setSelected(id,false,true);
          return res;
        });
      })
    );
  }

  // Get Request - Get Details of Particular Policy
  getItem(id):Observable<PolicyDetails>{
    return this._http.get('/organization-policies/' + id).pipe(
      map((res:PolicyDetails) => {
        PolicyStore.setSelectedPolicyDetails(res);
        return res;
      })
    );
  }

  /**
   * To automatically select item upon initial loading/ after save, update or delete
   * @param position - position of policy or id of policy -> in case of update
   * @param process - boolean value to check whether we need to check in policy list
   * @param reload - boolean value to check whether the list is reloaded -> Specially
   * for save, update and delete
   */
  setSelected(position?:number,process:boolean = false,reload = false){
    if(process){
      var items:Policies[] = PolicyStore.policyDetails;
      if(position >= 0){
        if(items.length > 0){
          if(position == 0){
            if(reload)
              this.itemChange.emit(items[0].id); 
            PolicyStore.setSelected(items[0].id)
          }
          else{
            if(items.length >= 1)
              if(reload)
                this.itemChange.emit(items[position - 1].id); 
              PolicyStore.setSelected(items[position - 1].id)
          }
        }
      }
      else{
        if(items.length > 0)
          if(reload)
            this.itemChange.emit(items[0].id); 
          PolicyStore.setSelected(items[0].id);
      }
    }
    else{
      if(position){
        if(reload)
          this.itemChange.emit(position); 
        PolicyStore.setSelected(position)
      }
      else{
        if(reload)
            this.itemChange.emit(PolicyStore.initialPolicyId); 
        PolicyStore.setSelected(PolicyStore.initialPolicyId);
      }
    }
  }

  // Returns id of selected policy
  getSelected(){
    return PolicyStore.selected;
  }

  // Sets PolicyStore.selected to null
  makeSelectedEmpty(){
    PolicyStore.setSelected(null);
    PolicyStore.setSelectedPolicyDetails(null);
  }

  // Clear Policy List
  clearPolicyList(){
    PolicyStore.clearPolicyList()
  }

  setBrochureDetailsInSelectedPolicy(imageDetails){
    PolicyStore.setBrochureDetails(imageDetails);
  }

  setFileDetails(imageDetails,url,type){
    PolicyStore.setFileDetails(imageDetails,url,type);
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/organization-policies/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_policy_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    this._http.get('/organization-policies/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('organization_policies')+'.xlsx');
      }
    )
  }

}
