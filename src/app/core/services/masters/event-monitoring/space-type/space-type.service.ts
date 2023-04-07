import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {SpaceTypePaginationResponse,SpaceTypeSingle} from 'src/app/core/models/masters/event-monitoring/space-type';
import {SpaceTypeMasterStore} from 'src/app/stores/masters/event-monitoring/space-type-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class SpaceTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<SpaceTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${SpaceTypeMasterStore.currentPage}`;
      if (SpaceTypeMasterStore.orderBy)
        params += `&order_by=${SpaceTypeMasterStore.orderItem}&order=${SpaceTypeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(SpaceTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+SpaceTypeMasterStore.searchText;

    
    return this._http
      .get<SpaceTypePaginationResponse>('/event-space-types'+(params ? params : ''))
      .pipe(
        map((res: SpaceTypePaginationResponse) => {
          SpaceTypeMasterStore.setSpaceType(res);
          return res;
        })
      );
  }

  getItem(id): Observable<SpaceTypeSingle> {
		return this._http.get<SpaceTypeSingle>('/event-space-types/' + id).pipe(
			map((res: SpaceTypeSingle) => {
				SpaceTypeMasterStore.setIndividualSpaceType(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-space-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','space_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-space-types', item).pipe(
      map(res => {
        SpaceTypeMasterStore.setLastInsertedspaceType(res['id']);
        this._utilityService.showSuccessMessage('success','space_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-space-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('space_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-space-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_space_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-space-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-space-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','space_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-space-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','space_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-space-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','space_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-space-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','space_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            SpaceTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortSpaceTypeList(type:string, text:string) {
    if (!SpaceTypeMasterStore.orderBy) {
      SpaceTypeMasterStore.orderBy = 'asc';
      SpaceTypeMasterStore.orderItem = type;
    }
    else{
      if (SpaceTypeMasterStore.orderItem == type) {
        if(SpaceTypeMasterStore.orderBy == 'asc') SpaceTypeMasterStore.orderBy = 'desc';
        else SpaceTypeMasterStore.orderBy = 'asc'
      }
      else{
        SpaceTypeMasterStore.orderBy = 'asc';
        SpaceTypeMasterStore.orderItem = type;
      }
    }
  }
}
