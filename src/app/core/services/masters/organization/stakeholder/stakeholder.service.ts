import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stakeholder, StakeholderPaginationResponse } from '../../../../models/organization/stakeholder/stakeholder';
import { StakeholdersStore } from 'src/app/stores/organization/stakeholders/stakeholders.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StakeholderService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?: string,status: boolean = false): Observable<StakeholderPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StakeholdersStore.currentPage}`;
        if (StakeholdersStore.orderBy) params += `&order_by=${StakeholdersStore.orderItem}&order=${StakeholdersStore.orderBy}`;
        if(additionalParams) params += additionalParams;
      }
      else{
        this.getAllItems();
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(StakeholdersStore.searchText) params += (params ? '&q=' : '?q=')+StakeholdersStore.searchText;
      return this._http.get<StakeholderPaginationResponse>('/stakeholders' + (params ? params : '')).pipe(
        map((res: StakeholderPaginationResponse) => {
          StakeholdersStore.setStakeholders(res);
          return res;
        })
      );
    }

  getAllItems(params?: string): Observable<Stakeholder[]> {
    return this._http.get<Stakeholder[]>('/stakeholders?is_all=true').pipe(
      map((res: Stakeholder[]) => {
        
        StakeholdersStore.setAllStakeholders(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<Stakeholder> {
    return this._http.get<Stakeholder>('/stakeholders/' + id).pipe(
      map((res: Stakeholder) => {
        StakeholdersStore.updateStakeholder(res)
        return res;
      })
    );
  }

  updateItem(id, item: Stakeholder): Observable<any> {
    return this._http.put('/stakeholders/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: Stakeholder,setLastInserted: boolean = false) {
    return this._http.post('/stakeholders', item).pipe(
      map((res: any) => {
         StakeholdersStore.setLastInsertedId(res.id) 
        this._utilityService.showSuccessMessage('success', 'update_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/stakeholders/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('stakeholder_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/stakeholders/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('stakeholder')+".xlsx");
      }
    )
  }

  activate(id: number) {
    return this._http.put('/stakeholders/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/stakeholders/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/stakeholders/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            StakeholdersStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  getStakeHolderDetailsById(id){
    return StakeholdersStore.getStakeholderById(id);
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
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }



}
