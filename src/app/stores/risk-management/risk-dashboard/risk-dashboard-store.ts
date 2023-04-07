import { action, observable, computed } from "mobx-angular";
import { RiskCount, RiskCountByCategories, RiskCountByDepartment, RiskCountByInherentRiskRatings, RiskCountByOwners, RiskCountByResidualRiskRatings, RiskCountBySection, RiskCountBySource, RiskCountByStatus, RiskHeatMap, RiskList, SecondRiskList } from "src/app/core/models/risk-management/risk-dashboard/risk-dashboard";


class Store {

    @observable
    heatMapLoaded: boolean = false;

    @observable
    private _riskCountDetails: RiskCount;

    @observable
    private _riskListData: RiskList[] = [];

    @observable
    private _secondRiskListData: SecondRiskList[] = []

    @observable
    private _riskCountBySources: RiskCountBySource[] = [];

    @observable
    private _riskCountByDepartments: RiskCountByDepartment[] = [];

    @observable
    private _riskCountBySections: RiskCountBySection[] = [];


    @observable
    private _riskCountByStatuses: RiskCountByStatus[] = [];

    @observable
    private _riskCountByCategories: RiskCountByCategories[] = [];

    @observable
    private _riskCountByOwners: RiskCountByOwners[] = [];

    @observable
    private _riskHeatMapDetails: RiskHeatMap[] = [];

    @observable
    private _riskCountByInherentRiskRatings: RiskCountByInherentRiskRatings[] = [];

    @observable
    private _riskCountByResidualRiskRatings: RiskCountByResidualRiskRatings[] = [];

    @observable
    risk_status_id: number = null;

    @observable
    riskDashboardParam: string = null;

    @observable
    risk_score: number = null;

    @observable
    activeRow: number = null;

    @observable
    activeColumn: number = null;

    @observable
    dashboardLoaded: boolean = false;

    @observable
    enableDivisionFilter: boolean = true;

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

    @action
    setRiskDashboardParam(param:string){
        this.riskDashboardParam = param
    }

    @action
    setRiskStatus(id: number) {
        this.risk_status_id = id;
    }

    @action
    unsetRiskDashboardParam() {
        this.riskDashboardParam = null;
    }

    @action
    unsetRiskStatus() {
        this.risk_status_id = null;
    }

    @action
    setRiskCountByInherentRiskRatings(response: RiskCountByInherentRiskRatings[]) {
        this.dashboardLoaded = true
        this._riskCountByInherentRiskRatings = response;
    }

    @action
    setRiskCountByResidualRiskRatings(response: RiskCountByResidualRiskRatings[]) {
        this.dashboardLoaded = true
        this._riskCountByResidualRiskRatings = response;
    }

    @action
    setRiskHeatMapDetails(response: RiskHeatMap[]) {
        this._riskHeatMapDetails = response;
        this.heatMapLoaded = true;
    }

    @action
    setRiskCountByOwners(response: RiskCountByOwners[]) {
        this._riskCountByOwners = response; 
    }

    @action
    setRiskCountByCategories(response: RiskCountByCategories[]) {
        this._riskCountByCategories = response; 
    }
    
    @action
    setRiskCountByStatuses(response: RiskCountByStatus[]) {
        this._riskCountByStatuses = response; 
    }

    @action
    setRiskCountBySections(response: RiskCountBySection[]) {
        this._riskCountBySections = response; 
    }

    @action
    setRiskCountByDepartments(response: RiskCountByDepartment[]) {
        this._riskCountByDepartments = response; 
    }

    @action
    setRiskCountBySources(response: RiskCountBySource[]) {
        this.dashboardLoaded = true
        this._riskCountBySources = response; 
    }

    @action
    setRiskCountDetails(response: RiskCount) {
        this.dashboardLoaded = true
        this._riskCountDetails = response; 
    }

    @action
    setRiskDetails(response: RiskList[]) {
        this._riskListData = response; 
    }

    @action
    setSecondRiskDetails(response: SecondRiskList[]) {
        this._secondRiskListData = response; 
    }

    @computed
    get riskCountByInherentRiskRatings():RiskCountByInherentRiskRatings[]{
        return this._riskCountByInherentRiskRatings.slice();
    }

    @computed
    get riskCountByResidualRiskRatings():RiskCountByResidualRiskRatings[]{
        return this._riskCountByResidualRiskRatings.slice();
    }

    @computed
    get riskHeatMap():RiskHeatMap[]{
        return this._riskHeatMapDetails.slice();
    }

    @computed
    get riskCountByStatus():RiskCountByStatus[]{
        return this._riskCountByStatuses.slice();
    }

    @computed
    get riskCountByCategories():RiskCountByCategories[]{
        return this._riskCountByCategories.slice();
    }

    @computed
    get riskCountByOwners():RiskCountByOwners[]{
        return this._riskCountByOwners.slice();
    }

    @computed
    get riskCountBySections():RiskCountBySection[]{
        return this._riskCountBySections.slice();
    }

    @computed
    get riskCountByDepartments():RiskCountByDepartment[]{
        return this._riskCountByDepartments.slice();
    }

    @computed
    get riskCountBySources():RiskCountBySource[]{
        return this._riskCountBySources.slice();
    }

    @computed
    get riskCount():RiskCount{
        return this._riskCountDetails;
    }

    @computed
    get riskList():RiskList[]{
        return this._riskListData;
    }

    @computed
    get secondRiskList():SecondRiskList[]{
        return this._secondRiskListData;
    }

    @computed
    get riskStatusId(){
        return this.risk_status_id;
    }

    @computed
    get dashboardParam(){
        return this.riskDashboardParam;
    }

    @computed
    get riskScore(){
        return this.risk_score;
    }

    @computed
    get activeRowRiskHeat(){
        return this.activeRow;
    }

    @computed
    get activeColumnRiskHeat(){
        return this.activeColumn;
    }

}

export const RiskDashboardStore = new Store();