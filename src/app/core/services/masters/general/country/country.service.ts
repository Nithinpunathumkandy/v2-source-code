import { Injectable } from '@angular/core';
import { Country,CountryPaginationResponse } from 'src/app/core/models/masters/general/country';
import {CountryMasterStore} from 'src/app/stores/masters/general/country-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<CountryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${CountryMasterStore.currentPage}`;
        if (CountryMasterStore.orderBy) params += `&order_by=countries.title&order=${CountryMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(CountryMasterStore.searchText) params += (params ? '&q=' : '?q=')+CountryMasterStore.searchText;
      return this._http.get<CountryPaginationResponse>('/countries' + (params ? params : '')).pipe(
        map((res: CountryPaginationResponse) => {
          CountryMasterStore.setCountry(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Country[]>{
      return this._http.get<Country[]>('/countries?is_all=true').pipe(
        map((res: Country[]) => {
          
          CountryMasterStore.setAllCountries(res);
          return res;
        })
      );
    }

    saveItem(item: Country) {
      return this._http.post('/countries', item).pipe(
        map((res:any )=> {
          CountryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Country): Observable<any> {
      return this._http.put('/countries/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/countries/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              CountryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/countries/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/countries/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/countries/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('country_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/countries/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('country')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/countries/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortCountrylList(type:string, text:string) {
      if (!CountryMasterStore.orderBy) {
        CountryMasterStore.orderBy = 'asc';
        CountryMasterStore.orderItem = type;
      }
      else{
        if (CountryMasterStore.orderItem == type) {
          if(CountryMasterStore.orderBy == 'asc') CountryMasterStore.orderBy = 'desc';
          else CountryMasterStore.orderBy = 'asc'
        }
        else{
          CountryMasterStore.orderBy = 'asc';
          CountryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}


