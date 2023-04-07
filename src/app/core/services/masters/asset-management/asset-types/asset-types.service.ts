import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {AssetTypes,AssetTypesPaginationResponse} from '../../../../models/masters/asset-management/asset-types'
import {AssetTypesMasterStore} from '../../../../../stores/masters/asset-management/asset-types-master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";


@Injectable({
  providedIn: 'root'
})
export class AssetTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<AssetTypesPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${AssetTypesMasterStore.currentPage}&status=all`;
  //     if (AssetTypesMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${AssetTypesMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<AssetTypesPaginationResponse>('/asset-types' + (params ? params : '')).pipe(
  //     map((res: AssetTypesPaginationResponse) => {
  //       AssetTypesMasterStore.setAssetTypes(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<AssetTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetTypesMasterStore.currentPage}`;
      if (AssetTypesMasterStore.orderBy)
        params += `&order_by=${AssetTypesMasterStore.orderItem}&order=${AssetTypesMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(AssetTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+AssetTypesMasterStore.searchText;

    
    return this._http
      .get<AssetTypesPaginationResponse>('/asset-types'+(params ? params : ''))
      .pipe(
        map((res: AssetTypesPaginationResponse) => {
          AssetTypesMasterStore.setAssetTypes(res);
          return res;
        })
      );
  }


  updateItem(id, item: AssetTypes): Observable<any> {
    return this._http.put('/asset-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','asset_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: AssetTypes) {
    return this._http.post('/asset-types', item).pipe(
      map(res => {
        AssetTypesMasterStore.setLastInsertedassetTypes(res['id']);
        this._utilityService.showSuccessMessage('success','asset_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/asset-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/asset-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/asset-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/asset-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','asset_type_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/asset-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','asset_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/asset-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','asset_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/asset-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','asset_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            AssetTypesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortAssetTypeList(type:string, text:string) {
    if (!AssetTypesMasterStore.orderBy) {
      AssetTypesMasterStore.orderBy = 'asc';
      AssetTypesMasterStore.orderItem = type;
    }
    else{
      if (AssetTypesMasterStore.orderItem == type) {
        if(AssetTypesMasterStore.orderBy == 'asc') AssetTypesMasterStore.orderBy = 'desc';
        else AssetTypesMasterStore.orderBy = 'asc'
      }
      else{
        AssetTypesMasterStore.orderBy = 'asc';
        AssetTypesMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
