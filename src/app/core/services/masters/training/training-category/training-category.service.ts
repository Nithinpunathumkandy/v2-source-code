import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TrainingCategoryMasterStore } from 'src/app/stores/masters/training/training-category-master-store';
import { TrainingCategory, TrainingCategoryPaginationResponse, TrainingCategorySaveResponse } from 'src/app/core/models/masters/training/training-category';
@Injectable({
  providedIn: 'root'
})
export class TrainingCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<TrainingCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TrainingCategoryMasterStore.currentPage}`;
      if (TrainingCategoryMasterStore.orderBy) params += `&order_by=${TrainingCategoryMasterStore.orderItem}&order=${TrainingCategoryMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (TrainingCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + TrainingCategoryMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<TrainingCategoryPaginationResponse>('/training-categories' + (params ? params : '')).pipe(
      map((res: TrainingCategoryPaginationResponse) => {
        TrainingCategoryMasterStore.setTrainingCategory(res);
        return res;
      })
    );
  }

  saveItem(item: TrainingCategory, setlastInserted = false) {
    return this._http.post('/training-categories', item).pipe(
      map((res: TrainingCategorySaveResponse) => {
        if (setlastInserted) TrainingCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'training_category_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id: number, item: TrainingCategory): Observable<any> {
    return this._http.put('/training-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_category_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete('/training-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_category_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            TrainingCategoryMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/training-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_category_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/training-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'training_category_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/training-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('training_category_template') + ".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/training-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('training_category') + ".xlsx");
      }
    )
  }
  shareData(data) {
    return this._http.post('/training-categories/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/training-categories/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'training_category_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }


  sortTrainingCategoryt(type: string, text: string) {
    if (!TrainingCategoryMasterStore.orderBy) {
      TrainingCategoryMasterStore.orderBy = 'asc';
      TrainingCategoryMasterStore.orderItem = type;
    }
    else {
      if (TrainingCategoryMasterStore.orderItem == type) {
        if (TrainingCategoryMasterStore.orderBy == 'asc') TrainingCategoryMasterStore.orderBy = 'desc';
        else TrainingCategoryMasterStore.orderBy = 'asc'
      }
      else {
        TrainingCategoryMasterStore.orderBy = 'asc';
        TrainingCategoryMasterStore.orderItem = type;
      }
    }
  }
}
