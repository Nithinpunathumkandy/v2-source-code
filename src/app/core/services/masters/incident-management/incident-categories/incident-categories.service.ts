import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {IncidentCategories, IncidentCategoriesPaginationResponse, IncidentCategoriesSaveResponse} from 'src/app/core/models/masters/incident-management/incident-categories';
import {IncidentCategoriesMasterStore} from 'src/app/stores/masters/incident-management/incident-categories-master-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IncidentCategoriesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentCategoriesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentCategoriesMasterStore.currentPage}`;
      if (IncidentCategoriesMasterStore.orderBy) params += `&order_by=${IncidentCategoriesMasterStore.orderItem}&order=${IncidentCategoriesMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(IncidentCategoriesMasterStore.searchText) params += (params ? '&q=' : '?q=')+IncidentCategoriesMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<IncidentCategoriesPaginationResponse>('/incident-categories' + (params ? params : '')).pipe(
      map((res: IncidentCategoriesPaginationResponse) => {
        IncidentCategoriesMasterStore.setIncidentCategories(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<IncidentCategories[]>{
    return this._http.get<IncidentCategories[]>('/incident-categories?is_all=true').pipe(
      map((res: IncidentCategories[]) => {
        
        IncidentCategoriesMasterStore.setAllIncidentCategories(res);
        return res;
      })
    );
  }


  saveItem(item: IncidentCategories,setlastInserted = false) {
    return this._http.post('/incident-categories', item).pipe(
      map((res: IncidentCategoriesSaveResponse) => {
        if(setlastInserted) IncidentCategoriesMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','incident_categories_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: IncidentCategories): Observable<any> {
    return this._http.put('/incident-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_categories_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/incident-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_categories_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            IncidentCategoriesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/incident-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_categories_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_categories_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incident-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_categories_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/incident-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_categories')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/incident-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/incident-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incident_categories_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortIncidentCategorieslList(type:string, text:string) {
    if (!IncidentCategoriesMasterStore.orderBy) {
      IncidentCategoriesMasterStore.orderBy = 'asc';
      IncidentCategoriesMasterStore.orderItem = type;
    }
    else{
      if (IncidentCategoriesMasterStore.orderItem == type) {
        if(IncidentCategoriesMasterStore.orderBy == 'asc') IncidentCategoriesMasterStore.orderBy = 'desc';
        else IncidentCategoriesMasterStore.orderBy = 'asc'
      }
      else{
        IncidentCategoriesMasterStore.orderBy = 'asc';
        IncidentCategoriesMasterStore.orderItem = type;
      }
    }
  }
}