import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetLocation, AssetLocationPaginationResponse, IndividualAssetLocation } from 'src/app/core/models/masters/asset-management/asset-location';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetLocationStore } from 'src/app/stores/masters/asset-management/asset-location-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetLocationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetLocationPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetLocationStore.currentPage}`;
      if (AssetLocationStore.orderBy) params += `&order_by=${AssetLocationStore.orderItem}&order=${AssetLocationStore.orderBy}`;
    }
    if(AssetLocationStore.searchText) params += (params ? '&q=' : '?q=')+AssetLocationStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetLocationPaginationResponse>('/asset-locations' + (params ? params : '')).pipe(
      map((res: AssetLocationPaginationResponse) => {
        AssetLocationStore.setAssetLocation(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualAssetLocation> {
    return this._http.get<IndividualAssetLocation>('/asset-locations/' + id).pipe(
      map((res: IndividualAssetLocation) => {
        AssetLocationStore.setIndividualAssetLocation(res);
       
        return res;
      })
    );
  }


updateItem(id, item: AssetLocation): Observable<any> {
  return this._http.put('/asset-locations/' + id, item).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_location_updated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

saveItem(item: AssetLocation) {
  return this._http.post('/asset-locations', item).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_location_added');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    })
  );
}
generateTemplate() {
  this._http.get('/asset-locations/template', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_location_template')+".xlsx");
    }
  )
}

exportToExcel() {
  this._http.get('/asset-locations/export', { responseType: 'blob' as 'json' }).subscribe(
    (response: any) => {
      this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_location')+".xlsx");
    }
  )
}

shareData(data){
  return this._http.post('/asset-locations/share',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success', 'item_shared');
      return res;
    })
  )
}

importData(data){
  const formData = new FormData();
  formData.append('file',data);
  return this._http.post('/asset-locations/import',data).pipe(
    map((res:any )=> {
      this._utilityService.showSuccessMessage('success','asset_location_imported');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  )
}

activate(id: number) {
  return this._http.put('/asset-locations/' + id + '/activate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_location_activated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

deactivate(id: number) {
  return this._http.put('/asset-locations/' + id + '/deactivate', null).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_location_deactivated');
      this.getItems(false,null,true).subscribe();
      return res;
    })
  );
}

delete(id: number) {
  return this._http.delete('/asset-locations/' + id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('success', 'asset_location_deleted');
      this.getItems(false,null,true).subscribe(resp=>{
        if(resp.from==null){
          AssetLocationStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      });
      return res;
    })
  );
}


sortAssetLocationList(type:string, text:string) {
  if (!AssetLocationStore.orderBy) {
    AssetLocationStore.orderBy = 'asc';
    AssetLocationStore.orderItem = type;
  }
  else{
    if (AssetLocationStore.orderItem == type) {
      if(AssetLocationStore.orderBy == 'asc') AssetLocationStore.orderBy = 'desc';
      else AssetLocationStore.orderBy = 'asc'
    }
    else{
      AssetLocationStore.orderBy = 'asc';
      AssetLocationStore.orderItem = type;
    }
  }
}
}
