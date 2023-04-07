import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImpactAreaPaginationResponse, IndividualImpactArea } from 'src/app/core/models/bcm/impact-area/impact-area';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImpactAreaStore } from 'src/app/stores/bcm/configuration/impact-area/impact-area-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImpactAreaService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ImpactAreaPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImpactAreaStore.currentPage}`;
      if (ImpactAreaStore.orderBy) params += `&order=${ImpactAreaStore.orderBy}`;
      if (ImpactAreaStore.orderItem) params += `&order_by=${ImpactAreaStore.orderItem}`;
      if (ImpactAreaStore.searchText) params += `&q=${ImpactAreaStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
     params += (params ? '&' : '?')+'status=all';
    if(ImpactAreaStore.searchText) params += (params ? '&q=' : '?q=')+ImpactAreaStore.searchText;
    return this._http.get<ImpactAreaPaginationResponse>('/impact-areas' + (params ? params : '')).pipe(
      map((res: ImpactAreaPaginationResponse) => {
        ImpactAreaStore.setImpactAreaDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualImpactArea> {
    return this._http.get<IndividualImpactArea>('/impact-areas/' + id).pipe(
      map((res: IndividualImpactArea) => {
        ImpactAreaStore.setIndividualImpactArea(res);
       
        return res;
      })
    );
  }

  updateItem(area_id:number, area): Observable<any> {
    return this._http.put('/impact-areas/'+ area_id, area).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_area_updated');
        
        this.getItems(false,null,true).subscribe();

        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/impact-areas', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_area_added');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/impact-areas/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_area_deleted');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/impact-areas/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_area_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/impact-areas/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_area_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/impact-areas/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_area_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/impact-areas/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_area') + ".xlsx");
      }
    )
  }


  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/impact-areas/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','impact_area_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  shareData(data){
    return this._http.post('/impact-areas/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'impact_area_shared');
        return res;
      })
    )
  }

  sortImpactAreaList(type:string, text:string) {
    if (!ImpactAreaStore.orderBy) {
      ImpactAreaStore.orderBy = 'asc';
      ImpactAreaStore.orderItem = type;
    }
    else{
      if (ImpactAreaStore.orderItem == type) {
        if(ImpactAreaStore.orderBy == 'asc') ImpactAreaStore.orderBy = 'desc';
        else ImpactAreaStore.orderBy = 'asc'
      }
      else{
        ImpactAreaStore.orderBy = 'asc';
        ImpactAreaStore.orderItem = type;
      }
    }
  }
}
