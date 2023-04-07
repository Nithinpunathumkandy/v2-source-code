import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetMatrix, AssetMatrixPaginationResponse, IndividualAssetMatrix } from 'src/app/core/models/asset-management/asset-matrix/asset-matrix';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class AssetMatrixService {

  constructor(	private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService:HelperServiceService) { }

    
	getItems(getAll: boolean = false, additionalParams?: string): Observable<AssetMatrixPaginationResponse> {
		let params = '';
		if (!getAll) {
		  params = `?page=${AssetMatrixStore.currentPage}`;
		  if (AssetMatrixStore.orderBy) params += `&order=${AssetMatrixStore.orderBy}`;
		  if (AssetMatrixStore.orderItem) params += `&order_by=${AssetMatrixStore.orderItem}`;
		  if (AssetMatrixStore.searchText) params += `&q=${AssetMatrixStore.searchText}`;
		  // if (AssetRegisterStore.orderBy) params += `&order_by=risks.title&order=${AssetRegisterStore.orderBy}`;
		}
		if(additionalParams){
			params = params+additionalParams;
		}
		if(RightSidebarLayoutStore.filterPageTag == 'asset_matrix' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
		  return this._http.get<AssetMatrixPaginationResponse>('/asset-matrices' + (params ? params : '')).pipe(
			map((res: AssetMatrixPaginationResponse) => {
			  AssetMatrixStore.setAssetMatrix(res);
			  return res;
			})
		  );
	  
	  }

	  getItem(id: number): Observable<IndividualAssetMatrix> {
		return this._http.get<IndividualAssetMatrix>('/asset-matrices/' + id).pipe(
		  map((res: IndividualAssetMatrix) => {
        AssetMatrixStore.setIndividualAssetMatrixDetails(res);
			return res;
		  })
		);
	  }

	  updateItem(asset_id:number, asset: AssetMatrix): Observable<any> {
		return this._http.put('/asset-matrices/'+ asset_id, asset).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'asset_matrix_updated');
			
			this.getItems().subscribe();
			AssetMatrixStore.setAssetId(res['id'])
	
			return res;
		  })
		);
	  }

	  saveItem(asset): Observable<any> {
		return this._http.post('/asset-matrices', asset).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'asset_matrix_added');
			this.getItems().subscribe();
			return res;
		  })
		);
	  }

	  updateCategory(asset_id:number, asset): Observable<any> {
		return this._http.put('/asset-matrices/'+ asset_id+'/asset-categories', asset).pipe(
		  map(res => {
			this._utilityService.showSuccessMessage('success', 'asset_matrix_category_updated');
			
			this.getItem(asset_id).subscribe();
	
			return res;
		  })
		);
	  }



	  generateTemplate() {
		this._http.get('/asset-matrices/template', { responseType: 'blob' as 'json' }).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_matrix_template')+".xlsx");
		  }
		)
	  }
	
	  exportToExcel() {
		this._http.get('/asset-matrices/export', { responseType: 'blob' as 'json' }).subscribe(
		  (response: any) => {
			this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('asset-matrices')+".xlsx");
		  }
		)
	  }

	  
  delete(id: number) {
    return this._http.delete('/asset-matrices/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_matrix_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/asset-matrices/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','asset_matrix_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }


	  sortAssetMatrixList(type, callList: boolean = true) {
		if (!AssetMatrixStore.orderBy) {
		  AssetMatrixStore.orderBy = 'asc';
		  AssetMatrixStore.orderItem = type;
		}
		else {
		  if (AssetMatrixStore.orderItem == type) {
			if (AssetMatrixStore.orderBy == 'asc') AssetMatrixStore.orderBy = 'desc';
			else AssetMatrixStore.orderBy = 'asc'
		  }
		  else {
        AssetMatrixStore.orderBy = 'asc';
        AssetMatrixStore.orderItem = type;
		  }
		}
	  }
}
