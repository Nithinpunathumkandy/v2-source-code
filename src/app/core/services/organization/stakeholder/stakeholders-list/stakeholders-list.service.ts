import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';

import { Stakeholder, StakeholderPaginationResponse, StakeholderDetails } from "src/app/core/models/organization/stakeholder/stakeholder";

import { UtilityService } from 'src/app/shared/services/utility.service';
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class StakeholdersListService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _router: Router) { }

  getItems(param?:string){
    var params = `?page=${StakeholdersStore.currentPage}`;
    if (StakeholdersStore.orderBy) params += `&order_by=${StakeholdersStore.orderItem}&order=${StakeholdersStore.orderBy}`;
    if(param) params += param;
    if(StakeholdersStore.searchText) params += (params ? '&q=' : '?q=')+StakeholdersStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'stakeholder' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StakeholderPaginationResponse>('/stakeholders' + (params ? params : '')).pipe(
      map((res: StakeholderPaginationResponse) => {
        StakeholdersStore.setStakeholders(res);
        return res;
      })
    );
  }

  getItem(id: number){
    return this._http.get<StakeholderDetails>('/stakeholders/' + id).pipe(
      map((res: StakeholderDetails) => {
        StakeholdersStore.setSelectedStakeholderDetails(res);
        return res;
      })
    );
  }

  saveItem(item,setLastInserted:boolean = false){
    return this._http.post('/stakeholders', item).pipe(
      map(res => {
        if(setLastInserted) StakeholdersStore.lastInsertedId = res['id'];
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this.checkCurrentUrl()) this.getItems('&status=all').subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number,item){
    return this._http.put('/stakeholders/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems('&status=all').subscribe();
        return res;
      })
    );
  }

  deleteItem(id: number){
    return this._http.delete('/stakeholders/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems('&status=all').subscribe();
        return res;
      })
    );
  }

  activateItem(id: number){
    return this._http.put('/stakeholders/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems('&status=all').subscribe();
        return res;
      })
    );
  }

  deactivateItem(id: number){
    return this._http.put('/stakeholders/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems('&status=all').subscribe();
        return res;
      })
    );
  }

  getStakeHolderDetailsById(id){
    return StakeholdersStore.getStakeholderById(id);
  }

  generateTemplate() {
    this._http.get('/stakeholders/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('stakeholder_template')+'.xlsx');
      }
    )
  }

  exportToExcel() {
    let params = '';
    // if (StakeholdersStore.orderBy) params += `?order=${StakeholdersStore.orderBy}`;
    // if (StakeholdersStore.orderItem) params += `&order_by=${StakeholdersStore.orderItem}`;
    if(params) params += `&order_by=${StakeholdersStore.orderItem}&order=${StakeholdersStore.orderBy}`;
    else params = `?order_by=${StakeholdersStore.orderItem}&order=${StakeholdersStore.orderBy}`
    if(RightSidebarLayoutStore.filterPageTag == 'stakeholder' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/stakeholders/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('stakeholder')+'.xlsx');
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/stakeholders/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(null).subscribe();
        return res;
      })
    )
  }


  sortStakeholderList(type:string, text:string) {
    if (!StakeholdersStore.orderBy) {
      StakeholdersStore.orderBy = 'asc';
      StakeholdersStore.orderItem = type;
    }
    else{
      if (StakeholdersStore.orderItem == type) {
        if(StakeholdersStore.orderBy == 'asc') StakeholdersStore.orderBy = 'desc';
        else StakeholdersStore.orderBy = 'asc'
      }
      else{
        StakeholdersStore.orderBy = 'asc';
        StakeholdersStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems().subscribe();
    // else
    //   this.getItems(`&q=${text}`).subscribe();
  }

  checkCurrentUrl(){
    if(this._router.url.indexOf('stakeholders') != -1)
      return true;
    else
      return false;
  }
}
