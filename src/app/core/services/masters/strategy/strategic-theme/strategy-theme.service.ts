import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategicThemesMasterStore } from 'src/app/stores/masters/strategy/strategy-theme.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StrategyThemesPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-theme';
@Injectable({
  providedIn: 'root'
})
export class StrategyThemeService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<StrategyThemesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StrategicThemesMasterStore.currentPage}`;
        if (StrategicThemesMasterStore.orderBy) params += `&order_by=strategic_themes.title&order=${StrategicThemesMasterStore.orderBy}`;
  
      }
     
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(StrategicThemesMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategicThemesMasterStore.searchText;
      return this._http.get<StrategyThemesPaginationResponse>('/strategy-themes' + (params ? params : '')).pipe(
        map((res: StrategyThemesPaginationResponse) => {
          StrategicThemesMasterStore.setStrategicThemes(res);
          return res;
        })
      );
    }

    induvalStrategyThemes(id){
      return this._http.get('/strategy-themes/'+ id).pipe(
        map(res => {
          return res;
        })
      );
    }

    saveItem(item) {
      return this._http.post('/strategy-themes', item).pipe(
        map((res:any )=> {
          StrategicThemesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success','added_strategic_theme_created');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item): Observable<any> {
      return this._http.put('/strategy-themes/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','strategic_theme_updated_success_message');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    delete(id: number) {
      return this._http.delete('/strategy-themes/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','strategic_theme_deleted_success_message	');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              StrategicThemesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
  
          return res;
        })
      );
    }

    setDocumentDetails(imageDetails,url){
      StrategicThemesMasterStore.setDocumentDetails(imageDetails,url);
    }

    activate(id: number) {
      return this._http.put('/strategy-themes/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','strategic_theme_activated_success_message');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/strategy-themes/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','strategic_theme_deactivated_success_message');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    generateTemplate() {
      this._http.get('/strategy-themes/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategic_theme_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/strategy-themes/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_theme')+".xlsx");
        }
      )
    }
    // shareData(data){
    //   return this._http.post('/strategy-themes/share',data).pipe(
    //     map((res:any )=> {
    //       this._utilityService.showSuccessMessage('success', 'common_share_toast');
    //       return res;
    //     })
    //   )
    // }
    // importData(data){
    //   const formData = new FormData();
    //   formData.append('file',data);
    //   return this._http.post('/strategy-themes/import',data).pipe(
    //     map((res:any )=> {
    //       this._utilityService.showSuccessMessage('success','focus_area_imported');
    //       this.getItems(false,null,true).subscribe();
    //       return res;
    //     })
    //   )
    // }

    getThumbnailPreview(type,token,h?:number,w?:number){
      // +(h && w)?'&h='+h+'&w='+w:''
      switch(type){
        case 'strategy_theme': return environment.apiBasePath+ '/master/files/focus-areas/thumbnail?token='+token;
          break;
      }
          
            
      }
    sortStrategicThemeList(type:string, text:string) {
      if (!StrategicThemesMasterStore.orderBy) {
        StrategicThemesMasterStore.orderBy = 'asc';
        StrategicThemesMasterStore.orderItem = type;
      }
      else{
        if (StrategicThemesMasterStore.orderItem == type) {
          if(StrategicThemesMasterStore.orderBy == 'asc') StrategicThemesMasterStore.orderBy = 'desc';
          else StrategicThemesMasterStore.orderBy = 'asc'
        }
        else{
          StrategicThemesMasterStore.orderBy = 'asc';
          StrategicThemesMasterStore.orderItem = type;
        }
      }
    }

    // selectRequiredLocation(issues){
   
    //   StrategicThemesMasterStore.addSelectedLocation(issues);
    // }
}
