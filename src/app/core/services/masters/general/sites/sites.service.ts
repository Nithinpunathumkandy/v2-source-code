import { Injectable } from '@angular/core';
import { Sites, SitesPaginationResponse } from 'src/app/core/models/masters/general/sites';
import { SitesMasterStore } from 'src/app/stores/masters/general/sites-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<SitesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${SitesMasterStore.currentPage}`;
      if (SitesMasterStore.orderBy) params += `&order_by=sites.title&order=${SitesMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    if(SitesMasterStore.searchText) params += (params ? '&q=' : '?q=')+SitesMasterStore.searchText;
    return this._http.get<SitesPaginationResponse>('/sites' + (params ? params : '')).pipe(
      map((res: SitesPaginationResponse) => {
        SitesMasterStore.setSites(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<Sites[]>{
    return this._http.get<Sites[]>('/sites?is_all=true').pipe(
      map((res: Sites[]) => {
        SitesMasterStore.setAllSites(res);
        return res;
      })
    );
  }

  saveItem(item: Sites) {
    return this._http.post('/sites', item).pipe(
      map((res:any )=> {
        SitesMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'sites_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: Sites): Observable<any> {
    return this._http.put('/sites/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sites_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/sites/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sites_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            SitesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/sites/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sites_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/sites/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sites_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/sites/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sites_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/sites/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sites')+".xlsx");
      }
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/sites/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','sites_imported');
        return res;
      })
    )
  }

  sortSitesList(type:string) {
    if (!SitesMasterStore.orderBy) {
      SitesMasterStore.orderBy = 'asc';
      SitesMasterStore.orderItem = type;
    }
    else{
      if (SitesMasterStore.orderItem == type) {
        if(SitesMasterStore.orderBy == 'asc') SitesMasterStore.orderBy = 'desc';
        else SitesMasterStore.orderBy = 'asc'
      }
      else{
        SitesMasterStore.orderBy = 'asc';
        SitesMasterStore.orderItem = type;
      }
    }
  }

  selectRequiredSites(sites){
		SitesMasterStore.addSelectedSites(sites);
  }

}
