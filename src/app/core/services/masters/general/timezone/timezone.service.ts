import { Injectable } from '@angular/core';

import { Timezone ,TimezonePaginationResponse } from 'src/app/core/models/masters/general/timezone';

import {TimezoneMasterStore} from 'src/app/stores/masters/general/timezone-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<TimezonePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${TimezoneMasterStore.currentPage}`;
        if (TimezoneMasterStore.orderBy) params += `&order_by=timezones.title&order=${TimezoneMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(TimezoneMasterStore.searchText) params += (params ? '&q=' : '?q=')+TimezoneMasterStore.searchText;
      return this._http.get<TimezonePaginationResponse>('/timezones' + (params ? params : '')).pipe(
        map((res: TimezonePaginationResponse) => {
          TimezoneMasterStore.setTimeZone(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Timezone[]>{
      return this._http.get<Timezone[]>('/timezones?is_all=true').pipe(
        map((res: Timezone[]) => {
          
          TimezoneMasterStore.setAllTimeZones(res);
          return res;
        })
      );
    }

    saveItem(item: Timezone) {
      return this._http.post('/timezones', item).pipe(
        map((res:any )=> {
          TimezoneMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Timezone): Observable<any> {
      return this._http.put('/timezones/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/timezones/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              TimezoneMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/timezones/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/timezones/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/timezones/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('timezone_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/timezones/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('timezones')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/timezones/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortTimeZonelList(type:string, text:string) {
      if (!TimezoneMasterStore.orderBy) {
        TimezoneMasterStore.orderBy = 'asc';
        TimezoneMasterStore.orderItem = type;
      }
      else{
        if (TimezoneMasterStore.orderItem == type) {
          if(TimezoneMasterStore.orderBy == 'asc') TimezoneMasterStore.orderBy = 'desc';
          else TimezoneMasterStore.orderBy = 'asc'
        }
        else{
          TimezoneMasterStore.orderBy = 'asc';
          TimezoneMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}

