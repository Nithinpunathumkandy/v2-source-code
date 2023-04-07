import { Injectable } from '@angular/core';
import { Region,RegionPaginationResponse } from 'src/app/core/models/masters/general/region';
import {RegionMasterStore} from 'src/app/stores/masters/general/region-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<RegionPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RegionMasterStore.currentPage}`;
        if (RegionMasterStore.orderBy) params += `&order_by=regions.title&order=${RegionMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(RegionMasterStore.searchText) params += (params ? '&q=' : '?q=')+RegionMasterStore.searchText;
      return this._http.get<RegionPaginationResponse>('/regions' + (params ? params : '')).pipe(
        map((res: RegionPaginationResponse) => {
          RegionMasterStore.setRegion(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Region[]>{
      return this._http.get<Region[]>('/regions?is_all=true').pipe(
        map((res: Region[]) => {
          
          RegionMasterStore.setAllRegions(res);
          return res;
        })
      );
    }

    saveItem(item: Region) {
      return this._http.post('/regions', item).pipe(
        map((res:any )=> {
          RegionMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Region): Observable<any> {
      return this._http.put('/regions/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/regions/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RegionMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/regions/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/regions/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/regions/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('region_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/regions/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('regions')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/regions/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortRegionlList(type:string, text:string) {
      if (!RegionMasterStore.orderBy) {
        RegionMasterStore.orderBy = 'asc';
        RegionMasterStore.orderItem = type;
      }
      else{
        if (RegionMasterStore.orderItem == type) {
          if(RegionMasterStore.orderBy == 'asc') RegionMasterStore.orderBy = 'desc';
          else RegionMasterStore.orderBy = 'asc'
        }
        else{
          RegionMasterStore.orderBy = 'asc';
          RegionMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}

