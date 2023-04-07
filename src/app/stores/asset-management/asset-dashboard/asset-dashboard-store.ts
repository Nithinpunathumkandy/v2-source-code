
import { observable, action, computed } from "mobx-angular";
import { AssetBarCategory, AssetBarCustodian, AssetBarDepartment, AssetBarPurchaseYear, AssetCount, AssetCriticalityRating, AssetMaintanancePieStatus, AssetPieStatus, AssetPieTypes, MaintenanceBarAsset, MaintenanceBarCategory, MaintenanceBarFrequency, MaintenanceBarType } from "src/app/core/models/asset-management/asset-dashboard/asset-dashboard";
class Store {

    @observable
    private _assetCount: AssetCount;

    @observable
    private _assetCriticalityRating: AssetCriticalityRating[] = [];

    @observable
    private _assetPieStatus: AssetPieStatus[] = [];

    @observable
    private _assetPieTypes: AssetPieTypes[] = [];

    @observable
    private _assetMaintanancePieStatus: AssetMaintanancePieStatus[] = [];

    @observable
    private _assetBarCategory: AssetBarCategory[] = [];

    @observable
    private _assetBarCustodian: AssetBarCustodian[] = [];

    @observable
    private _assetBarPurchaseYear: AssetBarPurchaseYear[] = [];

    @observable
    private _assetBarDepartment: AssetBarDepartment[] = [];

    @observable
    private _maintenanceBarAsset: MaintenanceBarAsset[] = [];

    @observable
    private _maintenanceBarCategory: MaintenanceBarCategory[] = [];

    @observable
    private _maintenanceBarType: MaintenanceBarType[] = [];

    @observable
    private _maintenanceBarFrequency: MaintenanceBarFrequency[] = [];

    @observable
    dashboardLoaded: boolean = false;

    @observable
    dashboardByDepartmentLoaded: boolean = false;

    @observable
    dashboardByPurchaseYearLoaded: boolean = false;

    @observable
    dashboardByCustodianLoaded: boolean = false;

    @observable
    dashboardByCategoryLoaded: boolean = false;

    @observable
    maintenanceBarFrequencyLoaded: boolean = false;

    @observable
    maintenanceBarCategoryLoaded: boolean = false;

    @observable
    maintenanceBarTypeLoaded: boolean = false;

    @observable
    maintenanceBarAssetLoaded: boolean = false;

    @observable
    assetDashboardParam: string = null;

    @action
    setAssetCount(response: AssetCount) {
        this._assetCount = response; 
    }

    @action
    setAssetCriticalityRating(response: AssetCriticalityRating[]) {
        this._assetCriticalityRating = response; 
    }

    @action
    setAssetPieStatus(response: AssetPieStatus[]) {
        this._assetPieStatus = response; 
    }

    @action
    setAssetPieTypes(response: AssetPieTypes[]) {
        this._assetPieTypes = response; 
    }

    @action
    setAssetMaintanancePieStatus(response: AssetMaintanancePieStatus[]) {
        this._assetMaintanancePieStatus = response; 
    }

    @action
    setAssetBarCategory(response: AssetBarCategory[]) {
        this._assetBarCategory = response; 
        this.dashboardByCategoryLoaded = true;
    }

    @action
    setAssetBarCustodian(response: AssetBarCustodian[]) {
        this._assetBarCustodian = response; 
        this.dashboardByCustodianLoaded = true;
    }

    @action
    setAssetBarPurchaseYear(response: AssetBarPurchaseYear[]) {
        this._assetBarPurchaseYear = response; 
        this.dashboardByPurchaseYearLoaded = true;
    }

    @action
    setAssetBarDepartment(response: AssetBarDepartment[]) {
        this._assetBarDepartment = response; 
        this.dashboardByDepartmentLoaded = true;
    }

    @action
    setMaintenanceBarAsset(response: MaintenanceBarAsset[]) {
        this._maintenanceBarAsset = response; 
        this.maintenanceBarAssetLoaded = true;
    }

    @action
    setMaintenanceBarCategory(response: MaintenanceBarCategory[]) {
        this._maintenanceBarCategory = response; 
        this.maintenanceBarCategoryLoaded = true;
    }

    @action
    setMaintenanceBarType(response: MaintenanceBarType[]) {
        this._maintenanceBarType = response; 
        this.maintenanceBarTypeLoaded = true;
    }

    @action
    setMaintenanceBarFrequency(response: MaintenanceBarFrequency[]) {
        this._maintenanceBarFrequency = response; 
        this.maintenanceBarFrequencyLoaded = true;
    }

    @action
    setDashboardParam(param:string){
        this.assetDashboardParam = param
    }

    @action
    unsetDashboardParam() {
        this.assetDashboardParam = null;
    }


    @computed
    get AssetCriticalityRating():AssetCriticalityRating[]{
        return this._assetCriticalityRating;
    }

    @computed
    get AssetCount():AssetCount{
        return this._assetCount;
    }

    @computed
    get AssetPieStatus():AssetPieStatus[]{
        return this._assetPieStatus;
    }

    @computed
    get AssetPieTypes(): AssetPieTypes[]{
        return this._assetPieTypes
    }

    @computed
    get AssetMaintanancePieStatus(): AssetMaintanancePieStatus[]{
        return this._assetMaintanancePieStatus
    }

    @computed
    get AssetBarCategory():AssetBarCategory[]{
        return this._assetBarCategory;
    }

    @computed
    get AssetBarCustodian():AssetBarCustodian[]{
        return this._assetBarCustodian;
    }

    @computed
    get AssetBarPurchaseYear():AssetBarPurchaseYear[]{
        return this._assetBarPurchaseYear;
    }

    @computed
    get AssetBarDepartment():AssetBarDepartment[]{
        return this._assetBarDepartment;
    }

    @computed
    get MaintenanceBarAsset():MaintenanceBarAsset[]{
        return this._maintenanceBarAsset;
    }

    @computed
    get MaintenanceBarCategory():MaintenanceBarCategory[]{
        return this._maintenanceBarCategory;
    }

    @computed
    get MaintenanceBarType():MaintenanceBarType[]{
        return this._maintenanceBarType;
    }

    @computed
    get MaintenanceBarFrequency():MaintenanceBarFrequency[]{
        return this._maintenanceBarFrequency;
    }

    @computed
    get dashboardParam(){
        return this.assetDashboardParam;
    }

}

export const AssetDashboardStore = new Store();