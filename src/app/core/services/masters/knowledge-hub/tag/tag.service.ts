import { Injectable } from '@angular/core';
import { Tag,TagPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/tag';
import {TagMasterStore} from 'src/app/stores/masters/knowledge-hub/tag-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<TagPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${TagMasterStore.currentPage}`;
        if (TagMasterStore.orderBy) params += `&order_by=${TagMasterStore.orderItem}&order=${TagMasterStore.orderBy}`;

      }
      else{
        this.getAllItems();
      }
     
     
      if(additionalParams) {
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(TagMasterStore.searchText) params += (params ? '&q=' : '?q=')+TagMasterStore.searchText;
      if(status) params += (params ? '&' : '?')+'status=all'
      return this._http.get<TagPaginationResponse>('/tags' + (params ? params : '')).pipe(
        map((res: TagPaginationResponse) => {
          TagMasterStore.setTag(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Tag[]>{
      return this._http.get<Tag[]>('/tags?is_all=true').pipe(
        map((res: Tag[]) => {
          
          TagMasterStore.setAllTags(res);
          return res;
        })
      );
    }

    saveItem(item: Tag) {
      return this._http.post('/tags', item).pipe(
        map((res:any )=> {
          TagMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'tag_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: Tag): Observable<any> {
      return this._http.put('/tags/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'tag_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/tags/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'tag_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              TagMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/tags/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'tag_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/tags/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'tag_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/tags/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('tag_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/tags/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('tag')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/tags/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/tags/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','tag_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }


    sortTaglList(type:string, text:string) {
      if (!TagMasterStore.orderBy) {
        TagMasterStore.orderBy = 'asc';
        TagMasterStore.orderItem = type;
      }
      else{
        if (TagMasterStore.orderItem == type) {
          if(TagMasterStore.orderBy == 'asc') TagMasterStore.orderBy = 'desc';
          else TagMasterStore.orderBy = 'asc'
        }
        else{
          TagMasterStore.orderBy = 'asc';
          TagMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}


