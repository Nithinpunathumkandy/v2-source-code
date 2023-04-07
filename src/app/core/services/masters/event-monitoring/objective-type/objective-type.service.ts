import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ObjectiveTypeMasterStore } from 'src/app/stores/masters/event-monitoring/objective-type-store';
import { ObjectiveTypeSingle,ObjectiveTypePaginationResponse } from 'src/app/core/models/masters/event-monitoring/objective-type';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ObjectiveTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ObjectiveTypeMasterStore.currentPage}`;
      if (ObjectiveTypeMasterStore.orderBy)
        params += `&order_by=${ObjectiveTypeMasterStore.orderItem}&order=${ObjectiveTypeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ObjectiveTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ObjectiveTypeMasterStore.searchText;

    
    return this._http
      .get<ObjectiveTypePaginationResponse>('/event-objective-types'+(params ? params : ''))
      .pipe(
        map((res: ObjectiveTypePaginationResponse) => {
          ObjectiveTypeMasterStore.setObjectiveType(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ObjectiveTypeSingle> {
		return this._http.get<ObjectiveTypeSingle>('/event-objective-types/' + id).pipe(
			map((res: ObjectiveTypeSingle) => {
				ObjectiveTypeMasterStore.setIndividualObjectiveType(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-objective-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','objective_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-objective-types', item).pipe(
      map(res => {
        ObjectiveTypeMasterStore.setLastInsertedobjectiveType(res['id']);
        this._utilityService.showSuccessMessage('success','objective_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-objective-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('objective_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-objective-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('objective_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-objective-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-objective-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','objective_type_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-objective-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','objective_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-objective-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','objective_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-objective-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','objective_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ObjectiveTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortObjectiveTypeList(type:string, text:string) {
    if (!ObjectiveTypeMasterStore.orderBy) {
      ObjectiveTypeMasterStore.orderBy = 'asc';
      ObjectiveTypeMasterStore.orderItem = type;
    }
    else{
      if (ObjectiveTypeMasterStore.orderItem == type) {
        if(ObjectiveTypeMasterStore.orderBy == 'asc') ObjectiveTypeMasterStore.orderBy = 'desc';
        else ObjectiveTypeMasterStore.orderBy = 'asc'
      }
      else{
        ObjectiveTypeMasterStore.orderBy = 'asc';
        ObjectiveTypeMasterStore.orderItem = type;
      }
    }
  }
}
