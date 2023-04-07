import { Injectable } from '@angular/core';
import { Location ,LocationPaginationResponse } from 'src/app/core/models/masters/general/location';
import {LocationMasterStore} from 'src/app/stores/masters/general/location-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<LocationPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${LocationMasterStore.currentPage}`;
        if (LocationMasterStore.orderBy) params += `&order_by=locations.title&order=${LocationMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(LocationMasterStore.searchText) params += (params ? '&q=' : '?q=')+LocationMasterStore.searchText;
      return this._http.get<LocationPaginationResponse>('/locations' + (params ? params : '')).pipe(
        map((res: LocationPaginationResponse) => {
          LocationMasterStore.setLocation(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Location[]>{
      return this._http.get<Location[]>('/locations?is_all=true').pipe(
        map((res: Location[]) => {
          
          LocationMasterStore.setAllLocations(res);
          return res;
        })
      );
    }

    saveItem(item: Location) {
      return this._http.post('/locations', item).pipe(
        map((res:any )=> {
          LocationMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Location): Observable<any> {
      return this._http.put('/locations/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/locations/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              LocationMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/locations/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/locations/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/locations/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('location_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/locations/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('location')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/locations/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortLocationlList(type:string, text:string) {
      if (!LocationMasterStore.orderBy) {
        LocationMasterStore.orderBy = 'asc';
        LocationMasterStore.orderItem = type;
      }
      else{
        if (LocationMasterStore.orderItem == type) {
          if(LocationMasterStore.orderBy == 'asc') LocationMasterStore.orderBy = 'desc';
          else LocationMasterStore.orderBy = 'asc'
        }
        else{
          LocationMasterStore.orderBy = 'asc';
          LocationMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    
    selectRequiredLocation(issues){
   
      LocationMasterStore.addSelectedLocation(issues);
    }

}

