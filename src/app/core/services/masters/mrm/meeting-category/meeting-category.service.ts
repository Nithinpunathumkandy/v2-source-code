import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingCategory,MeetingCategoryPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-category';
import{MeetingCategoryMasterStore} from 'src/app/stores/masters/mrm/meeting-category-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<MeetingCategoryPaginationResponse> {
      let params = '';
      if (!getAll) 
      {
        params = `?page=${MeetingCategoryMasterStore.currentPage}`;
        if (MeetingCategoryMasterStore.orderBy) params += `&order_by=${MeetingCategoryMasterStore.orderItem}&order=${MeetingCategoryMasterStore.orderBy}`;
      }
      if(MeetingCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+MeetingCategoryMasterStore.searchText;
      if(additionalParams)
        params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<MeetingCategoryPaginationResponse>('/meeting-categories' + (params ? params : '')).pipe(
        map((res: MeetingCategoryPaginationResponse) => {
          MeetingCategoryMasterStore.setMeetingCategory(res); 
        
          return res;
        })
      );
    }

    getAllItems(): Observable<MeetingCategory[]> {
      return this._http.get<MeetingCategory[]>('/meeting-categories').pipe((
        map((res:MeetingCategory[])=>{
          MeetingCategoryMasterStore.setAllMeetingCategory(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<MeetingCategory> {
      return this._http.get<MeetingCategory>('/meeting-categories/'+id).pipe((
        map((res:MeetingCategory)=>{
          MeetingCategoryMasterStore.setIndividualMeetingCategory(res);
          return res;
        })
      ))
    }
    saveItem(item: any) {
      return this._http.post('/meeting-categories', item).pipe(
        map((res:any )=> {
        
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          if(res.id){
            MeetingCategoryMasterStore.setLastInsertedId(res.id);
            
          }
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/meeting-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/meeting-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              MeetingCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/meeting-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/meeting-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/meeting-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('meeting_category')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/meeting-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortMeetingCategoryList(type:string, text:string) {
      if (!MeetingCategoryMasterStore.orderBy) {
        MeetingCategoryMasterStore.orderBy = 'asc';
        MeetingCategoryMasterStore.orderItem = type;
      }
      else{
        if (MeetingCategoryMasterStore.orderItem == type) {
          if(MeetingCategoryMasterStore.orderBy == 'asc') MeetingCategoryMasterStore.orderBy = 'desc';
          else MeetingCategoryMasterStore.orderBy = 'asc'
        }
        else{
          MeetingCategoryMasterStore.orderBy = 'asc';
          MeetingCategoryMasterStore.orderItem = type;
        }
      }
      //   if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      // this.getItems(false,`&q=${text}`,true).subscribe();
    }

    getSearchItems(additionalParams:string){
      let params='';

      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      return this._http.get<MeetingCategoryPaginationResponse>('/meeting-categories' + (params ? params : '')).pipe(
        map((res: MeetingCategoryPaginationResponse) => {
          MeetingCategoryMasterStore.setMeetingCategory(res); 

          return res;
        })
      );
    }

}
