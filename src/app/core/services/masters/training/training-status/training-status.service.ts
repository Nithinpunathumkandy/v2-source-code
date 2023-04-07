import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingStatus, TrainingStatusPaginationResponse, TrainingStatusSaveResponse } from 'src/app/core/models/masters/training/training-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TrainingStatusMasterStore } from 'src/app/stores/masters/training/training-status-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<TrainingStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TrainingStatusMasterStore.currentPage}`;
      if (TrainingStatusMasterStore.orderBy) params += `&order_by=${TrainingStatusMasterStore.orderItem}&order=${TrainingStatusMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (TrainingStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + TrainingStatusMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<TrainingStatusPaginationResponse>('/training-statuses' + (params ? params : '')).pipe(
      map((res: TrainingStatusPaginationResponse) => {
        TrainingStatusMasterStore.setTrainingStatus(res);
        return res;
      })
    );
  }

  saveItem(item: TrainingStatus, setlastInserted = false) {
    return this._http.post('/training-statuses', item).pipe(
      map((res: TrainingStatusSaveResponse) => {
        if (setlastInserted) TrainingStatusMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'training_status_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id: number, item: TrainingStatus): Observable<any> {
    return this._http.put('/training-statuses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_Status_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete('/training-statuses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_status_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            TrainingStatusMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/training-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_status_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/training-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_status_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/training-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('training_status_template') + ".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/training-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('training_status') + ".xlsx");
      }
    )
  }
  shareData(data) {
    return this._http.post('/training-statuses/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/training-statuses/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'training_status_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }


  sortTrainingStatus(type: string, text: string) {
    if (!TrainingStatusMasterStore.orderBy) {
      TrainingStatusMasterStore.orderBy = 'asc';
      TrainingStatusMasterStore.orderItem = type;
    }
    else {
      if (TrainingStatusMasterStore.orderItem == type) {
        if (TrainingStatusMasterStore.orderBy == 'asc') TrainingStatusMasterStore.orderBy = 'desc';
        else TrainingStatusMasterStore.orderBy = 'asc'
      }
      else {
        TrainingStatusMasterStore.orderBy = 'asc';
        TrainingStatusMasterStore.orderItem = type;
      }
    }
  }
}
