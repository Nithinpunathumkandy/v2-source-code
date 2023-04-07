import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {EventEquipmentPaginationResponse,EventEquipmentSingle} from 'src/app/core/models/masters/event-monitoring/event-equipment'
import {EventEquipmentMasterStore} from 'src/app/stores/masters/event-monitoring/event-equipment-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class EventEquipmentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<EventEquipmentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventEquipmentMasterStore.currentPage}`;
      if (EventEquipmentMasterStore.orderBy)
        params += `&order_by=${EventEquipmentMasterStore.orderItem}&order=${EventEquipmentMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(EventEquipmentMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventEquipmentMasterStore.searchText;

    
    return this._http
      .get<EventEquipmentPaginationResponse>('/event-equipments'+(params ? params : ''))
      .pipe(
        map((res: EventEquipmentPaginationResponse) => {
          EventEquipmentMasterStore.setEventEquipment(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventEquipmentSingle> {
		return this._http.get<EventEquipmentSingle>('/event-equipments/' + id).pipe(
			map((res: EventEquipmentSingle) => {
				EventEquipmentMasterStore.setIndividualEventEquipment(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/event-equipments/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_equipment_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/event-equipments', item).pipe(
      map(res => {
        EventEquipmentMasterStore.setLastInsertedeventEquipment(res['id']);
        this._utilityService.showSuccessMessage('success','event_equipment_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/event-equipments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_equipment_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/event-equipments/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_equipment')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/event-equipments/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-equipments/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','event_equipment_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/event-equipments/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_equipment_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-equipments/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_equipment_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/event-equipments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_equipment_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            EventEquipmentMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortEventEquipmentList(type:string, text:string) {
    if (!EventEquipmentMasterStore.orderBy) {
      EventEquipmentMasterStore.orderBy = 'asc';
      EventEquipmentMasterStore.orderItem = type;
    }
    else{
      if (EventEquipmentMasterStore.orderItem == type) {
        if(EventEquipmentMasterStore.orderBy == 'asc') EventEquipmentMasterStore.orderBy = 'desc';
        else EventEquipmentMasterStore.orderBy = 'asc'
      }
      else{
        EventEquipmentMasterStore.orderBy = 'asc';
        EventEquipmentMasterStore.orderItem = type;
      }
    }
  }
}
