import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Branch, BranchDetails } from "src/app/core/models/organization/business_profile/branches/branches";
import { BranchesStore } from 'src/app/stores/organization/business_profile/branches/branches.store';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})

export class BranchService {

  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  // Get Branches List
  getAllItems(initialise = false,params?:string): Observable<Branch[]> {
    // let urlParams = 'is_all=true';
    // params += (!params || params == '') ? '?' : '&' + 'is_all=true'
    params = params?params+'&is_all=true':'?is_all=true';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this.getItems(params?params:'').pipe(
      map((res: Branch[]) => {
        res.forEach(branch => {
          branch['view_more'] = false;
        });
        BranchesStore.setBranchList(res);
        if(initialise  && res.length > 0)
          this.setSelected(null,false,true);
        return res;
      })
    );
  }
  
  // Get Request
  getItems(params?: string): Observable<Branch[]> {
    return this._http.get<Branch[]>('/branches' + (params ? params : ''));
  }

  // Post Request - save branch details
  saveItem(item: Branch,position?:number) {
    return this._http.post('/branches', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getAllItems(false,'?access_all=true&status=all').subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // Delete Request - delete branch
  deleteItem(id: number, position?:number) {
    return this._http.delete('/branches/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getAllItems(false,'?access_all=true&status=all').subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // Put Request - Update Branch Details
  updateItem(id, item: Branch): Observable<any> {
    return this._http.put('/branches/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getAllItems(false,'?access_all=true&status=all').subscribe(resp=>{
          this.setSelected(id,false,true);
          return res;
        });
      })
    );
  }

  // Get Request - Get Branch Details by Id
  getItem(id):Observable<BranchDetails>{
    return this._http.get('/branches/' + id).pipe(
      map((res:BranchDetails) => {
        res.view_more = false;
        BranchesStore.setSelectedBranchDetails(res);
        return res;
      })
    );
  }

  deactivateItem(id: number, position?:number){
    return this._http.put('/branches/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getAllItems(false,'?access_all=true&status=all').subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  activateItem(id: number, position?: number){
    return this._http.put('/branches/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getAllItems(false,'?access_all=true&status=all').subscribe(resp=>{
          this.setSelected(position,true,true);
          return res;
        });
      })
    );
  }

  // getPreviewUrl(preview,id,type){
  //   if(type == 'logo')
  //     return this._http.get('/branches/'+ id +'/logo-preview',{ responseType: 'blob' });
  //   else
  //     return this._http.get('/branches/'+ id +'/brouchure-thumbnail',{ responseType: 'blob' });
  // }

  setSelected(position?:number,process:boolean = false,reload = false){
    if(process){
      var items:Branch[] = BranchesStore.branchDetails;
      if(position >= 0){
        if(items.length > 0){
          if(position == 0){
            if(reload)
              this.itemChange.emit(items[0].id); 
            BranchesStore.setSelected(items[0].id)
          }
          else{
            if(items.length >= 1){
              if(reload)
                this.itemChange.emit(items[position - 1].id);
              BranchesStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else{
        if(items.length > 0){
          if(reload)
            this.itemChange.emit(items[0].id);
          BranchesStore.setSelected(items[0].id);
        }
      }
    }
    else{
      if(position){
        if(reload) 
          this.itemChange.emit(position);
        BranchesStore.setSelected(position)
      }
      else{
        if(reload) 
          this.itemChange.emit(BranchesStore.initialBranchId);
        BranchesStore.setSelected(BranchesStore.initialBranchId);
      }
    }
  }

  makeSelectedEmpty(){
    BranchesStore.setSelected(null);
  }

  setImageDetails(imageDetails,url,type){
    BranchesStore.setFileDetails(imageDetails,url,type);
  }

  getImageDetails(type){
    return BranchesStore.getFileDetailsByType(type);
  }

  // setSelectedImageDetails(imageDetails,type){
  //   BranchesStore.setSelectedFileDetails(imageDetails,type);
  // }

  // getSelectedImageDetails(type){
  //   return BranchesStore.getSelectedFileDetails(type);
  // }

  unsetSelectedBranchDetails(){
    BranchesStore.unsetSelectedBranchDetails();
  }

  clearBranchList(){
    BranchesStore.clearBranchList();
  }

  searchBranch(params){
    return this.getItems(params ? params : '').pipe(
      map((res: Branch[]) => {
        BranchesStore.setBranchList(res['data']);
        return res;
      })
    );
  }

  // Generate and Download Template
  generateTemplate() {
    this._http.get('/branches/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('branch_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    let params = '';
    if(RightSidebarLayoutStore.filtersAsQueryString)
      params = (!params || params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/branches/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage('branches')+'.xlsx');
      }
    )
  }

}
