import { action, computed, observable } from "mobx";
import { EACountByDepartmentAndRiskRating, EACountByMsType, EACountByRiskRating, EACounts, EACountsByCategory, EACountsByStatus, EACountsByType, FindingCACountByStatus, FindingCAList } from "src/app/core/models/external-audit/ea-dashboard/ea-dashboard";



class Store{


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    currentPage: number = 1;

    @observable
    currentSecondPage: number = 2;

    @observable
    itemsPerPage: number = null;

    @observable
     _filterParams = null

    @observable
    risk_score: number = null;

    @observable
    activeRow: number = null;

    @observable
    activeColumn: number = null;

    @observable
    private _eaCounts: EACounts; 

    @observable
    private _eaCountsByCategory: EACountsByCategory[] = []; 

    @observable
    private _eaCountsByStatus: EACountsByStatus[] = []; 

    @observable
    private _eaCountsByType: EACountsByType[] = []; 

    @observable
    private _findingCACountByStatus: FindingCACountByStatus[] = []; 

    @observable
    private _eACountByMsType: EACountByMsType[] = []; 

    @observable
    private _eACountByRiskRating: EACountByRiskRating[] = []; 

    @observable
    private _eACountByDepartmentAndRiskRating: EACountByDepartmentAndRiskRating[] = []; 

    @observable
    private _findingCAList: FindingCAList[] = []; 


    @observable
    dashboardLoaded: boolean = false;

    @observable
    findingDashboardLoaded: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    dashboardParam: string = null;

    // @observable
    // eaDashboardParam: string = null;

    // @action
    // setEaDashboardParam(param:string){
    //     this.eaDashboardParam = param
    // }


    @action
    setEACounts(res: EACounts) {
        this.dashboardLoaded = true
        this._eaCounts = res;
    }

    @action
    setEACountsByCategory(res: EACountsByCategory[]) {
        this.dashboardLoaded = true
        this._eaCountsByCategory = res;
    }

    @action
    setEACountsByStatus(res: EACountsByStatus[]) {
        this.dashboardLoaded = true
        this._eaCountsByStatus = res;
    }

    @action
    setEACountsByType(res: EACountsByType[]) {
        this.dashboardLoaded = true
        this._eaCountsByType = res;
    }

    @action
    setFindingCACountByStatus(res: FindingCACountByStatus[]) {
        this.findingDashboardLoaded = true
        this._findingCACountByStatus = res;
    }

    @action
    setEACountByMsType(res: EACountByMsType[]) {
        this.findingDashboardLoaded = true
        this._eACountByMsType = res;
    }

    @action
    setEACountByRiskRating(res: EACountByRiskRating[]) {
        this.findingDashboardLoaded = true
        this._eACountByRiskRating = res;
    }

    @action
    setEACountByDepartmentAndRiskRating(res: EACountByDepartmentAndRiskRating[]) {
        this.findingDashboardLoaded = true
        this._eACountByDepartmentAndRiskRating = res;
    }

    @action
    setFindingCAList(res: FindingCAList[]) {
        this.loaded = true
        this._findingCAList = res;
    }


    @action
    unsetEACounts() {
        this._eaCounts = null;
    }

    @action
    unsetEACountsByCategory() {
        this._eaCountsByCategory = null;
    }

    @action
    unsetEACountsByStatus() {
        this._eaCountsByStatus = null;
    }

    @action
    unsetEACountsByType() {
        this._eaCountsByType = null;
    }

    @action
    unsetFindingCACountByStatus() {
        this._findingCACountByStatus = null;
    }

    @action
    unsetEACountByMsType() {
        this._eACountByMsType = null;
    }

    @action
    unsetEACountByRiskRating() {
        this._eACountByRiskRating = null;
    }

    @action
    unsetEACountByDepartmentAndRiskRating() {
        this._eACountByDepartmentAndRiskRating = null;
    }

    @action
    unsetFindingCAList() {
        this._findingCAList = null;
    }

    // @action
    // unsetEaDashboardParam() {
    //     this.eaDashboardParam = null;
    // }

    @computed
    get EACounts():EACounts{
        return this._eaCounts
    }

    @computed
    get EACountsByStatus():EACountsByStatus[]{
        return this._eaCountsByStatus
    }

    @computed
    get EACountsByCategory():EACountsByCategory[]{
        return this._eaCountsByCategory
    }

    @computed
    get EACountsByType():EACountsByType[]{
        return this._eaCountsByType
    }

    @computed
    get FindingCACountByStatus():FindingCACountByStatus[]{
        return this._findingCACountByStatus
    }

    @computed
    get EACountByMsType():EACountByMsType[]{
        return this._eACountByMsType
    }

    @computed
    get EACountByDepartmentAndRiskRating():EACountByDepartmentAndRiskRating[]{
        return this._eACountByDepartmentAndRiskRating
    }

    @computed
    get EACountByRiskRating():EACountByRiskRating[]{
        return this._eACountByRiskRating
    }

    @computed
    get FindingCAList():FindingCAList[]{
        return this._findingCAList
    }

    // @computed
    // get dashboardParam(){
    //     return this.eaDashboardParam;
    // }

    @computed
    get activeRowRiskHeat(){
        return this.activeRow;
    }

    @computed
    get activeColumnRiskHeat(){
        return this.activeColumn;
    }
    @computed
    get filterParams(){
        return this._filterParams
    }
    @action 
    setFilterParams(data){
        this._filterParams = data
    }

    @action 
    unSetFilterParams(){
        this._filterParams = null
    }

    @action
    setActiveRow(id: number) {
        this.activeRow = id;
    }

    @action
    unsetActiveRow() {
        this.activeRow = null;
    }

    @action
    setActiveColumn(id: number) {
        this.activeColumn = id;
    }

    @action
    unsetActiveColumn() {
        this.activeColumn = null;
    }

    @action
    setRiskScore(id: number) {
        this.risk_score = id;
    }

    @action
    unsetRiskScore() {
        this.risk_score = null;
    }
}

export const EADashboardStore = new Store();