import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaScale, BiaScalePaginationResponse, IndividualBiaScale } from 'src/app/core/models/bcm/bia-scale/bia-scale';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaScaleStore } from 'src/app/stores/bcm/configuration/bia-scale/bia-scale-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaScaleService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService) { }


  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaScalePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BiaScaleStore.currentPage}`;
      if (BiaScaleStore.orderBy) params += `&order=${BiaScaleStore.orderBy}`;
      if (BiaScaleStore.orderItem) params += `&order_by=${BiaScaleStore.orderItem}`;
    }
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
     params += (params ? '&' : '?')+'status=all';
    if(BiaScaleStore.searchText) params += (params ? '&q=' : '?q=')+BiaScaleStore.searchText;
    return this._http.get<BiaScalePaginationResponse>('/bia-scales' + (params ? params : '')).pipe(
      map((res: BiaScalePaginationResponse) => {
        BiaScaleStore.setBiaScaleDetails(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<BiaScale[]> {
		return this._http.get<BiaScale[]>('/bia-scales?is_all=true').pipe(
			map((res: BiaScale[]) => {
				BiaScaleStore.setAllBiaScaleStore(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<IndividualBiaScale> {
    return this._http.get<IndividualBiaScale>('/bia-scales/' + id).pipe(
      map((res: IndividualBiaScale) => {
        BiaScaleStore.setIndividualBiaScale(res);
       
        return res;
      })
    );
  }

  updateItem(scale_id:number, scale): Observable<any> {
    return this._http.put('/bia-scales/'+ scale_id, scale).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_updated');
        
        this.getItems(false,null,true).subscribe();

        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/bia-scales', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_added');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/bia-scales/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_deleted');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/bia-scales/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bia-scales/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/bia-scales/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_scale_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (BiaScaleStore.orderBy) params += `?order=${BiaScaleStore.orderBy}`;
    if (BiaScaleStore.orderItem) params += `&order_by=${BiaScaleStore.orderItem}`;
    // if (BiaScaleStore.searchText) params += `&q=${BiaScaleStore.searchText}`;
    // if(RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
    //   params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/bia-scales/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_scale') + ".xlsx");
      }
    )
  }


  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/bia-scales/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','bia_scale_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  shareData(data) {
    return this._http.post('/bia-scales/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bia_scale_shared');
        return res;
      })
    )
  }

  
  sortBiaScaleList(type:string, text:string) {
    if (!BiaScaleStore.orderBy) {
      BiaScaleStore.orderBy = 'asc';
      BiaScaleStore.orderItem = type;
    }
    else{
      if (BiaScaleStore.orderItem == type) {
        if(BiaScaleStore.orderBy == 'asc') BiaScaleStore.orderBy = 'desc';
        else BiaScaleStore.orderBy = 'asc'
      }
      else{
        BiaScaleStore.orderBy = 'asc';
        BiaScaleStore.orderItem = type;
      }
    }
  }
}
