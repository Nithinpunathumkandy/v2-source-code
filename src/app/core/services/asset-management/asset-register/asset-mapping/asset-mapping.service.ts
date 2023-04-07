import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AssetMappingStore } from 'src/app/stores/asset-management/asset-register/asset-mapping-store';

@Injectable({
  providedIn: 'root'
})
export class AssetMappingService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string) {
    let params = '';

    if (additionalParams) {
      if (params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if (AssetRegisterStore.searchText) params += (params ? '&q=' : '?q=') + AssetMappingStore.searchText;
    return this._http.get('/assets/' + AssetRegisterStore.assetId + '/mapping').pipe(
      map((res) => {
        AssetMappingStore.setAssetMappingDetails(res);
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/issue-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveBusinessApplicationForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/business-application-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveServiceForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/service-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProcessForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/process-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveProjectForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/project-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveProductForMapping(saveData): Observable<any> {
    return this._http.post('/assets/' + AssetRegisterStore.assetId + '/product-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/process-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_process_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteBusinessApplicationMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/business-application-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_business_application_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteServiceMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/service-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_service_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }


  deleteIssueMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/issue-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_issue_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/project-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_project_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteProductMapping(id) {
    return this._http.put('/assets/' + AssetRegisterStore.assetId + '/product-mapping', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'asset_product_remove_success_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

}
