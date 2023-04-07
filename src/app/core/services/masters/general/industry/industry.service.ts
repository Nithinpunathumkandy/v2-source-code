import { Injectable } from '@angular/core';
import { Industry ,IndustryPaginationResponse } from 'src/app/core/models/masters/general/industry';
import {IndustryMasterStore} from 'src/app/stores/masters/general/industry-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IndustryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${IndustryMasterStore.currentPage}`;
        if (IndustryMasterStore.orderBy) params += `&order_by=industries.title&order=${IndustryMasterStore.orderBy}`;
      }
      if(additionalParams) {
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(IndustryMasterStore.searchText) params += (params ? '&q=' : '?q=')+IndustryMasterStore.searchText;
      return this._http.get<IndustryPaginationResponse>('/industries' + (params ? params : '')).pipe(
        map((res: IndustryPaginationResponse) => {
          IndustryMasterStore.setIndustry(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Industry[]>{
      return this._http.get<Industry[]>('/industries?is_all=true').pipe(
        map((res: Industry[]) => {
          
          IndustryMasterStore.setAllIndustries(res);
          return res;
        })
      );
    }

    saveItem(item: Industry) {
      return this._http.post('/industries', item).pipe(
        map((res:any )=> {
          IndustryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Industry): Observable<any> {
      return this._http.put('/industries/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/industries/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              IndustryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/industries/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/industries/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/industries/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('industry_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/industries/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('industry')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/industries/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortIndustrylList(type:string, text:string) {
      if (!IndustryMasterStore.orderBy) {
        IndustryMasterStore.orderBy = 'asc';
        IndustryMasterStore.orderItem = type;
      }
      else{
        if (IndustryMasterStore.orderItem == type) {
          if(IndustryMasterStore.orderBy == 'asc') IndustryMasterStore.orderBy = 'desc';
          else IndustryMasterStore.orderBy = 'asc'
        }
        else{
          IndustryMasterStore.orderBy = 'asc';
          IndustryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}



