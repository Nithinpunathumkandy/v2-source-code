import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetBarCategory, AssetBarCustodian, AssetBarDepartment, AssetBarPurchaseYear, AssetCount, AssetCriticalityRating, AssetMaintanancePieStatus, AssetPieStatus, AssetPieTypes, MaintenanceBarAsset, MaintenanceBarCategory, MaintenanceBarFrequency, MaintenanceBarType } from 'src/app/core/models/asset-management/asset-dashboard/asset-dashboard';
import { AssetDashboardStore } from 'src/app/stores/asset-management/asset-dashboard/asset-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class AssetDashboardService {

  constructor(
    private _http: HttpClient,

  ) { }

  getAssetCount(): Observable<AssetCount> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetCount>('/dashboard/asset-counts'+ (params ? params : '')).pipe((
      map((res:AssetCount)=>{
        AssetDashboardStore.setAssetCount(res);
        return res;
      })
    ))
  }
  getAssetPieStatus(): Observable<AssetPieStatus[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetPieStatus[]>('/dashboard/asset-count-by-statuses'+ (params ? params : '')).pipe((
      map((res:AssetPieStatus[])=>{
        AssetDashboardStore.setAssetPieStatus(res);
        return res;
      })
    ))
  }

  getAssetPieTypes(): Observable<AssetPieTypes[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetPieTypes[]>('/dashboard/asset-count-by-types'+ (params ? params : '')).pipe((
      map((res:AssetPieTypes[])=>{
        AssetDashboardStore.setAssetPieTypes(res);
        return res;
      })
    ))
  }

  getAssetCriticalityRating(): Observable<AssetCriticalityRating[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetCriticalityRating[]>('/dashboard/asset-count-by-criticality-ratings'+ (params ? params : '')).pipe((
      map((res:AssetCriticalityRating[])=>{
        AssetDashboardStore.setAssetCriticalityRating(res);
        return res;
      })
    ))
  }

  getAssetMaintanancePieStatus(): Observable<AssetMaintanancePieStatus[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetMaintanancePieStatus[]>('/dashboard/asset-maintenance-count-by-statuses'+ (params ? params : '')).pipe((
      map((res:AssetMaintanancePieStatus[])=>{
        AssetDashboardStore.setAssetMaintanancePieStatus(res);
        return res;
      })
    ))
  }

  getAssetBarCategory(): Observable<AssetBarCategory[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetBarCategory[]>('/dashboard/asset-count-by-categories'+ (params ? params : '')).pipe((
      map((res:AssetBarCategory[])=>{
        AssetDashboardStore.setAssetBarCategory(res);
        return res;
      })
    ))
  }

  getAssetBarCustodian(): Observable<AssetBarCustodian[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetBarCustodian[]>('/dashboard/asset-count-by-custodians'+ (params ? params : '')).pipe((
      map((res:AssetBarCustodian[])=>{
        AssetDashboardStore.setAssetBarCustodian(res);
        return res;
      })
    ))
  }

  getAssetBarPurchaseYear(): Observable<AssetBarPurchaseYear[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetBarPurchaseYear[]>('/dashboard/asset-count-by-purchased-year'+ (params ? params : '')).pipe((
      map((res:AssetBarPurchaseYear[])=>{
        AssetDashboardStore.setAssetBarPurchaseYear(res);
        return res;
      })
    ))
  }

  getAssetBarDepartment(): Observable<AssetBarDepartment[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AssetBarDepartment[]>('/dashboard/asset-count-by-departments'+ (params ? params : '')).pipe((
      map((res:AssetBarDepartment[])=>{
        AssetDashboardStore.setAssetBarDepartment(res);
        return res;
      })
    ))
  }

  getMaintenanceBarAsset(): Observable<MaintenanceBarAsset[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MaintenanceBarAsset[]>('/dashboard/asset-maintenance-count-by-assets'+ (params ? params : '')).pipe((
      map((res:MaintenanceBarAsset[])=>{
        AssetDashboardStore.setMaintenanceBarAsset(res);
        return res;
      })
    ))
  }

  getMaintenanceBarCategory(): Observable<MaintenanceBarCategory[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MaintenanceBarCategory[]>('/dashboard/asset-maintenance-count-by-categories'+ (params ? params : '')).pipe((
      map((res:MaintenanceBarCategory[])=>{
        AssetDashboardStore.setMaintenanceBarCategory(res);
        return res;
      })
    ))
  }

  getMaintenanceBarType(): Observable<MaintenanceBarType[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MaintenanceBarType[]>('/dashboard/asset-maintenance-count-by-types'+ (params ? params : '')).pipe((
      map((res:MaintenanceBarType[])=>{
        AssetDashboardStore.setMaintenanceBarType(res);
        return res;
      })
    ))
  }

  getMaintenanceBarFrequency(): Observable<MaintenanceBarFrequency[]> {
    let params = '';
    if (RightSidebarLayoutStore.filterPageTag == 'asset_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MaintenanceBarFrequency[]>('/dashboard/asset-maintenance-count-by-frequencies'+ (params ? params : '')).pipe((
      map((res:MaintenanceBarFrequency[])=>{
        AssetDashboardStore.setMaintenanceBarFrequency(res);
        return res;
      })
    ))
  }
}
