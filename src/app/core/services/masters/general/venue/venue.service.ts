import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Venue,VenuePaginationResponse} from 'src/app/core/models/masters/general/venue';
import{VenueMasterStore} from 'src/app/stores/masters/general/venue-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class VenueService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<VenuePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${VenueMasterStore.currentPage}`;
        if (VenueMasterStore.orderBy) params += `&order_by=venues.title&order=${VenueMasterStore.orderBy}`;
      }
      if(VenueMasterStore.searchText) params += (params ? '&q=' : '?q=')+VenueMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<VenuePaginationResponse>('/venues' + (params ? params : '')).pipe(
        map((res: VenuePaginationResponse) => {
          VenueMasterStore.setVenue(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<Venue[]> {
      return this._http.get<Venue[]>('/venues').pipe((
        map((res:Venue[])=>{
          VenueMasterStore.setAllVenue(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<Venue> {
      return this._http.get<Venue>('/venues/'+id).pipe((
        map((res:Venue)=>{
          VenueMasterStore.setIndividualVenue(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/venues', item).pipe(
        map((res:any )=> {
          VenueMasterStore.setLastInsertedId(res.id, item.title);
          this._utilityService.showSuccessMessage('success', 'create_success');

          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/venues/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/venues/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              VenueMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/venues/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/venues/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/venues/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('venue')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/venues/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('venue_template')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/venues/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortVenueList(type:string, text:string) {
      if (!VenueMasterStore.orderBy) {
        VenueMasterStore.orderBy = 'desc';
        VenueMasterStore.orderItem = type;
      }
      else{
        if (VenueMasterStore.orderItem == type) {
          if(VenueMasterStore.orderBy == 'desc') VenueMasterStore.orderBy = 'asc';
          else VenueMasterStore.orderBy = 'desc'
        }
        else{
          VenueMasterStore.orderBy = 'desc';
          VenueMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }

    getSearchItems(additionalParams:string){
      let params='';

      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      return this._http.get<VenuePaginationResponse>('/venues' + (params ? params : '')).pipe(
        map((res: VenuePaginationResponse) => {
          VenueMasterStore.setVenue(res);
          return res;
        })
      );
    }
}
