import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FocusArea, FocusAreaPaginationResponse } from 'src/app/core/models/masters/strategy/focus-area.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FocusAreaService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<FocusAreaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${FocusAreaMasterStore.currentPage}`;
        if (FocusAreaMasterStore.orderBy) params += `&order_by=${FocusAreaMasterStore.orderItem}&order=${FocusAreaMasterStore.orderBy}`;
  
      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(FocusAreaMasterStore.searchText) params += (params ? '&q=' : '?q=')+FocusAreaMasterStore.searchText;
      return this._http.get<FocusAreaPaginationResponse>('/focus-areas' + (params ? params : '')).pipe(
        map((res: FocusAreaPaginationResponse) => {
          FocusAreaMasterStore.setFocusAreas(res);
          return res;
        })
      );
    }

    induvalFocusArea(id){
      return this._http.get('/focus-areas/'+ id).pipe(
        map(res => {
          return res;
        })
      );
    }

    saveItem(item) {
      return this._http.post('/focus-areas', item).pipe(
        map((res:any )=> {
          FocusAreaMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success','added_focus_area_created');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item): Observable<any> {
      return this._http.put('/focus-areas/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','updated_focus_area_created');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    delete(id: number) {
      return this._http.delete('/focus-areas/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','focus_area_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              FocusAreaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
  
          return res;
        })
      );
    }

    setDocumentDetails(imageDetails,url){
      FocusAreaMasterStore.setDocumentDetails(imageDetails,url);
    }

    activate(id: number) {
      return this._http.put('/focus-areas/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','focus_area_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/focus-areas/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','focus_area_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    generateTemplate() {
      this._http.get('/focus-areas/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('focus_area_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/focus-areas/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('focus_area')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/focus-areas/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'common_share_toast');
          return res;
        })
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/focus-areas/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','focus_area_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    getThumbnailPreview(type,token,h?:number,w?:number){
      // +(h && w)?'&h='+h+'&w='+w:''
      switch(type){
        case 'focus_area': return environment.apiBasePath+ '/master/files/focus-areas/thumbnail?token='+token;
          break;
      }
          
            
      }
    sortFocusAreaList(type:string, text:string) {
      if (!FocusAreaMasterStore.orderBy) {
        FocusAreaMasterStore.orderBy = 'asc';
        FocusAreaMasterStore.orderItem = type;
      }
      else{
        if (FocusAreaMasterStore.orderItem == type) {
          if(FocusAreaMasterStore.orderBy == 'asc') FocusAreaMasterStore.orderBy = 'desc';
          else FocusAreaMasterStore.orderBy = 'asc'
        }
        else{
          FocusAreaMasterStore.orderBy = 'asc';
          FocusAreaMasterStore.orderItem = type;
        }
      }
    }

    selectRequiredLocation(issues){
   
      FocusAreaMasterStore.addSelectedLocation(issues);
    }
}
