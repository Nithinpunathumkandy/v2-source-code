import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaCategory, BiaCategoryPaginationResponse, IndividualBiaCategory } from 'src/app/core/models/bcm/bia-category/bia-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaCategoryStore } from 'src/app/stores/bcm/configuration/bia-category/bia-category-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BiaCategoryStore.currentPage}`;
      if (BiaCategoryStore.orderBy) params += `&order=${BiaCategoryStore.orderBy}`;
      if (BiaCategoryStore.orderItem) params += `&order_by=${BiaCategoryStore.orderItem}`;
      if (BiaCategoryStore.searchText) params += `&q=${BiaCategoryStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (status) params += (params ? '&' : '?') + 'status=all';
    if (BiaCategoryStore.searchText) params += (params ? '&q=' : '?q=') + BiaCategoryStore.searchText;
    return this._http.get<BiaCategoryPaginationResponse>('/bia-impact-categories' + (params ? params : '')).pipe(
      map((res: BiaCategoryPaginationResponse) => {
        BiaCategoryStore.setBiaCategoryDetails(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<BiaCategory[]> {
    return this._http.get<BiaCategory[]>('/bia-impact-categories?is_all=true').pipe(
      map((res: BiaCategory[]) => {
        BiaCategoryStore.setAllBiaCategoryStore(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualBiaCategory> {
    return this._http.get<IndividualBiaCategory>('/bia-impact-categories/' + id).pipe(
      map((res: IndividualBiaCategory) => {
        BiaCategoryStore.setIndividualBiaCategory(res);

        return res;
      })
    );
  }

  updateItem(category_id: number, category): Observable<any> {
    return this._http.put('/bia-impact-categories/' + category_id, category).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_category_updated');

        this.getItems(false, null, true).subscribe();

        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/bia-impact-categories', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_category_added');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/bia-impact-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_category_deleted');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/bia-impact-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_category_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bia-impact-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_category_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/bia-impact-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_category_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (BiaCategoryStore.orderBy) params += `?order=${BiaCategoryStore.orderBy}`;
    if (BiaCategoryStore.orderItem) params += `&order_by=${BiaCategoryStore.orderItem}`;
    // if (BiaCategoryStore.searchText) params += `&q=${BiaCategoryStore.searchText}`;
    // if(RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
    //   params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/bia-impact-categories/export' + params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_category') + ".xlsx");
      }
    )
  }


  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/bia-impact-categories/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bia_category_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  shareData(data) {
    return this._http.post('/bia-impact-categories/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bia_impact_category_shared');
        return res;
      })
    )
  }

  sortBiaCategoryList(type: string, text: string) {
    if (!BiaCategoryStore.orderBy) {
      BiaCategoryStore.orderBy = 'asc';
      BiaCategoryStore.orderItem = type;
    }
    else {
      if (BiaCategoryStore.orderItem == type) {
        if (BiaCategoryStore.orderBy == 'asc') BiaCategoryStore.orderBy = 'desc';
        else BiaCategoryStore.orderBy = 'asc'
      }
      else {
        BiaCategoryStore.orderBy = 'asc';
        BiaCategoryStore.orderItem = type;
      }
    }
  }

}
