import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { PhysicalConditionRankingsMasterStore } from 'src/app/stores/masters/asset-management/physical-condition-rankings-store';
import { PhysicalConditionRankings, PhysicalConditionRankingsPaginationResponse } from 'src/app/core/models/masters/asset-management/physical-condition-rankings';

@Injectable({
  providedIn: 'root'
})
export class PhysicalConditionRankingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }


  /**
  * @description
  * This method is used for getting physical Condition Rankings List
  *
  * @param {*} [param]
  * @returns this api will return a observalble
  * @memberof PhysicalConditionRankings
  */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<PhysicalConditionRankingsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${PhysicalConditionRankingsMasterStore.currentPage}`;
      if (PhysicalConditionRankingsMasterStore.orderBy) params += `&order=${PhysicalConditionRankingsMasterStore.orderBy}`;
      if (PhysicalConditionRankingsMasterStore.orderItem) params += `&order_by=${PhysicalConditionRankingsMasterStore.orderItem}`;
      if (PhysicalConditionRankingsMasterStore.searchText) params += `&q=${PhysicalConditionRankingsMasterStore.searchText}`;
    }
    if (PhysicalConditionRankingsMasterStore.searchText) params += (params ? '&q=' : '?q=') + PhysicalConditionRankingsMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<PhysicalConditionRankingsPaginationResponse>('/physical-condition-rankings' + (params ? params : '')).pipe(
      map((res: PhysicalConditionRankingsPaginationResponse) => {
        PhysicalConditionRankingsMasterStore.setPhysicalConditionRankings(res);
        return res;
      })
    );
  }

  /**
  * @description
  * This method is used for getting physical Condition Rankings List.
  *
  * @param {*} [param]
  * @returns this api will return a observalble
  * @memberof PhysicalConditionRankings
  */
  getAllItems(): Observable<PhysicalConditionRankings[]> {
    return this._http.get<PhysicalConditionRankings[]>('/physical-condition-rankings').pipe((
      map((res: PhysicalConditionRankings[]) => {
        PhysicalConditionRankingsMasterStore.setAllPhysicalConditionRankings(res);
        return res;
      })
    ))
  }

  getItem(id: number): Observable<PhysicalConditionRankings> {
		return this._http.get<PhysicalConditionRankings>('/physical-condition-rankings/' + id).pipe(
			map((res: PhysicalConditionRankings) => {
				PhysicalConditionRankingsMasterStore.updatePhysicalConditionRankings(res)
				return res;
			})
		);
	}

  updateItem(id, item: PhysicalConditionRankings): Observable<any> {
    return this._http.put('/physical-condition-rankings/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_ranking_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: PhysicalConditionRankings) {
    return this._http.post('/physical-condition-rankings', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_ranking_added');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/physical-condition-rankings/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('physical_condition_rankings_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/physical-condition-rankings/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('physical_condition_rankings') + ".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/physical-condition-rankings/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/physical-condition-rankings/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_rankings_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/physical-condition-rankings/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_ranking_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/physical-condition-rankings/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_ranking_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/physical-condition-rankings/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'physical_condition_ranking_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            PhysicalConditionRankingsMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchPhysicalConditionRankingsList(params) {
    return this.getItems(params ? params : '').pipe(
      map((res: PhysicalConditionRankingsPaginationResponse) => {
        PhysicalConditionRankingsMasterStore.setPhysicalConditionRankings(res);
        return res;
      })
    );
  }

  sortPhysicalConditionRankingsList(type: string, text: string) {
    if (!PhysicalConditionRankingsMasterStore.orderBy) {
      PhysicalConditionRankingsMasterStore.orderBy = 'asc';
      PhysicalConditionRankingsMasterStore.orderItem = type;
    }
    else {
      if (PhysicalConditionRankingsMasterStore.orderItem == type) {
        if (PhysicalConditionRankingsMasterStore.orderBy == 'asc') PhysicalConditionRankingsMasterStore.orderBy = 'desc';
        else PhysicalConditionRankingsMasterStore.orderBy = 'asc'
      }
      else {
        PhysicalConditionRankingsMasterStore.orderBy = 'asc';
        PhysicalConditionRankingsMasterStore.orderItem = type;
      }
    }
  }
}
