import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Subsidiary, SubsidiaryDetails } from "src/app/core/models/organization/business_profile/subsidiary/subsidiary";
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";

import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class SubsidiaryService {

  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // Get Subsidiary List
  getAllItems(initialise = false,params?:string,is_full:boolean = true): Observable<Subsidiary[]> {
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      var urlParams = '?is_all=true';
      if(is_full) urlParams += '&is_full_list=true';
      else urlParams += '&access_all=true';
      return this.getItems(urlParams+(params ? params : '')).pipe(
        map((res: Subsidiary[]) => {
          res.forEach(subsidiary => {
            subsidiary['view_more'] = false;
          });
          SubsidiaryStore.setSubsidiaryList(res);
          if(initialise && res.length > 0)
            this.setSelected();
          return res;
        })
      );
    }
    else{
        return this._http.get('/business-profiles').pipe(
          map((res:any[])=>{
            res['data'].forEach(subsidiary => {
              subsidiary['view_more'] = false;
            });
            SubsidiaryStore.setSubsidiaryList(res['data']);
            if(initialise && res['data'].length > 0)
              this.setSelected();
            return res;
          })
        )
    }
  }
  
  // Get Request
  getItems(params?: string): Observable<Subsidiary[]> {
    return this._http.get<Subsidiary[]>('/subsidiaries' + (params ? params : ''));
  }

  // getAllSubsidiarys(params?:string): Observable<Subsidiary[]> {
  //   return this.getItems('?access_all=true'+(params ? params : '')).pipe(
  //     map((res: Subsidiary[]) => {
  //       SubsidiaryStore.setSubsidiaryList(res['data']);
  //       return res;
  //     })
  //   );
  // }

  // Post Request - save new item
  saveItem(item: Subsidiary,position?:number) {
    return this._http.post('/subsidiaries', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getAllItems(false,'&status=all',false).subscribe(resp=>{
          this.setSelected(position,true,true);
        });
        return res;
      })
    );
  }

  // Delete Request
  deleteItem(id: number, position?:number) {
    return this._http.delete('/subsidiaries/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems(false,'&status=all',false).subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // Put Request
  updateItem(id, item: Subsidiary): Observable<any> {
    return this._http.put('/subsidiaries/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getAllItems(false,'&status=all',false).subscribe(resp=>{
          this.setSelected(id,false,true);
          return res;
        });
      })
    );
  }

  // Get Request - Get details of particular subsidiary
  getItem(id,set = false):Observable<SubsidiaryDetails>{
    let url = '/subsidiaries/';
    if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
      url = '/business-profiles/'
    return this._http.get(url + id).pipe(
      map((res:SubsidiaryDetails) => {
        if(set)
          SubsidiaryStore.setSelectedSubsidiaryDetails(res);
        return res;
      })
    );
  }

  deactivateItem(id: number, position?:number){
    return this._http.put('/subsidiaries/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getAllItems(false,'&status=all',false).subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  activateItem(id: number, position?:number){
    return this._http.put('/subsidiaries/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getAllItems(false,'&status=all',false).subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // getPreviewUrl(preview,id,type){
  //   if(type == 'logo')
  //     return this._http.get('/subsidiaries/'+ id +'/logo-preview?h=160',{ responseType: 'blob' });
  //   else
  //     return this._http.get('/subsidiaries/'+ id +'/brouchure-thumbnail',{ responseType: 'blob' });
  // }

   /**
   * To automatically select item upon initial loading/ after save, update or delete
   * @param position - position of policy or id of policy -> in case of update
   * @param process - boolean value to check whether we need to check in policy list
   * @param reload - boolean value to check whether the list is reloaded -> Specially
   * for save, update and delete
   */
  setSelected(position?:number,process:boolean = false,reload = false){
    if(process){
      var items:Subsidiary[] = SubsidiaryStore.subsidiaryList;
      if(position >= 0){
        if(items.length > 0){
          if(position == 0){
            if(reload)
              this.itemChange.emit(items[0].id); 
            SubsidiaryStore.setSelected(items[0].id)
          }
          else{
            if(items.length >= 1)
              if(reload)
                this.itemChange.emit(items[position - 1].id); 
              SubsidiaryStore.setSelected(items[position - 1].id)
          }
        }
      }
      else{
        if(items.length > 0)
          if(reload)
              this.itemChange.emit(items[0].id); 
          SubsidiaryStore.setSelected(items[0].id);
      }
    }
    else{
      if(position){
        if(reload)
          this.itemChange.emit(position); 
        SubsidiaryStore.setSelected(position)
      }
      else{
        if(SubsidiaryStore.initialSubsidiaryId){
          this.itemChange.emit(SubsidiaryStore.initialSubsidiaryId); 
          SubsidiaryStore.setSelected(SubsidiaryStore.initialSubsidiaryId);
        }
      }
    }
  }

  makeSelectedEmpty(){
    SubsidiaryStore.setSelected(null);
  }

  getAllSubsidiarysList(){
    return SubsidiaryStore.subsidiaryList;
  }

  setFileDetails(imageDetails,url,type){
    SubsidiaryStore.setFileDetails(imageDetails,url,type);
  }

  setBrochureDetailsInSelectedSubsidiary(imageDetails){
    SubsidiaryStore.setBrochureDetails(imageDetails);
  }

  getFileDetails(type){
    return SubsidiaryStore.getFileDetailsByType(type);
  }

  // setSelectedFileDetails(imageDetails,type){
  //   SubsidiaryStore.setSelectedFileDetails(imageDetails,type);
  // }

  // getSelectedFileDetails(type){
  //   return SubsidiaryStore.getSelectedFileDetails(type);
  // }

  getBrochures(){
    return SubsidiaryStore.getBrochureDetails;
  }

  getSelectedSubsidiaryDetails():SubsidiaryDetails{
    return SubsidiaryStore.getSelectedSubsidiaryDetails;
  }

  // Clear Subsidiary List
  clearSubsidiaryList(){
    SubsidiaryStore.clearSubsidiaryList();
  }

  searchSubsidiary(params){
    return this.getItems(params ? params : '').pipe(
      map((res: Subsidiary[]) => {
        SubsidiaryStore.setSubsidiaryList(res['data']);
        return res;
      })
    );
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/subsidiaries/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('subsidiary_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    this._http.get('/subsidiaries/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('subsidiaries')+'.xlsx');
      }
    )
  }


}
