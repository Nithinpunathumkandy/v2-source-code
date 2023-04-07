
import { observable, action, computed } from "mobx-angular";
import { IsmsInherentRating, IsmsResidualRiskRating, IsmsRisk, IsmsRiskAgeningStatusCount, IsmsRiskAssetCriticality, IsmsRiskCategories, IsmsRiskCount, IsmsRiskDepartments, IsmsRiskHeatMap, IsmsRiskOwners, IsmsRiskSections, IsmsRiskSource, IsmsRiskStatuses, IsmsRiskTreatmentProgressCount, Risks } from "src/app/core/models/isms/dashboard/isms-dashboard";
class Store {


    @observable
    currentPage: number = 1;

    @observable
    currentSecondPage: number = 2;

    @observable
    private _ismsRisk: Risks[]=[];

    @observable
    private _ismsRiskCount: IsmsRiskCount;

    @observable
    private _ismsInherentRating: IsmsInherentRating[] = [];

    @observable
    private _ismsResidualRiskRating: IsmsResidualRiskRating[] = [];

    @observable
    private _ismsRiskSource: IsmsRiskSource[] = [];

    @observable
    private _ismsRiskDepartments: IsmsRiskDepartments[] = [];

    @observable
    private _ismsRiskSections: IsmsRiskSections[] = [];

    @observable
    private _ismsRiskStatuses: IsmsRiskStatuses[] = [];

    @observable
    private _ismsRiskCategories: IsmsRiskCategories[] = [];  

    @observable
    private _ismsRiskOwners: IsmsRiskOwners[] = [];

    @observable
    private _ismsRiskHeatmap: IsmsRiskHeatMap[] = [];

    @observable
    private  _ismsRiskAssetCriticality: IsmsRiskAssetCriticality[] = [];

    @observable
    private _ismsRiskTreatmentProgressCount: IsmsRiskTreatmentProgressCount[] = [];

    @observable
    private _ismsRiskAgeningStatusCount: IsmsRiskAgeningStatusCount[] = [];

    @observable
    risk_score: number = null;

    @observable
    activeRow: number = null;

    @observable
    activeColumn: number = null;


    @observable
    dashboardLoaded: boolean = false;

    @observable
    topTenLoaded: boolean = false;

    @action
    setIsmsRisk(response: IsmsRisk) {
        this._ismsRisk = response.data; 
    }

    @observable
    dashboardParam: string = null;

    @action
    setIsmsRiskCount(response: IsmsRiskCount) {
        this._ismsRiskCount = response;
    }

    @action
    setIsmsInherentRating(response: IsmsInherentRating[]) {
        this._ismsInherentRating = response;
    }

    @action
    setIsmsResidualRiskRating(response: IsmsResidualRiskRating[]) {
        this._ismsResidualRiskRating = response;
    }

    @action
    setIsmsRiskSource(response: IsmsRiskSource[]) {
        this._ismsRiskSource = response;
    }

    @action
    setIsmsRiskDepartments(response: IsmsRiskDepartments[]) {
        this._ismsRiskDepartments = response;
    }

    @action
    setIsmsRiskSections(response: IsmsRiskSections[]) {
        this._ismsRiskSections = response;
    }

    @action
    setIsmsRiskStatuses(response: IsmsRiskStatuses[]) {
        this._ismsRiskStatuses = response;
    }

    @action
    setIsmsRiskCategories(response: IsmsRiskCategories[]) {
        this._ismsRiskCategories = response;
    }

    @action
    setIsmsRiskOwners(response: IsmsRiskOwners[]) {
        this._ismsRiskOwners = response;
    }

    @action
    setIsmsRiskHeatMap(response: IsmsRiskHeatMap[]) {
        this._ismsRiskHeatmap = response;
    }

    @action
    setIsmsRiskAssetCriticality(response: IsmsRiskAssetCriticality[]) {
        this._ismsRiskAssetCriticality = response;
    }

    @action
    setIsmsRiskTreatmentProgressCount(response: IsmsRiskTreatmentProgressCount[]) {
        this._ismsRiskTreatmentProgressCount = response;
    }

    @action
    setIsmsRiskAgeningStatusCount(response: IsmsRiskAgeningStatusCount[]) {
        this._ismsRiskAgeningStatusCount = response;
    }
    

    @computed
    get ismsRisk():Risks[]{
        return this._ismsRisk.slice();
    }

    @computed
    get ismsRiskCount():IsmsRiskCount{
        return this._ismsRiskCount;
    }

    @computed
    get ismsInherentRating():IsmsInherentRating[]{
        return this._ismsInherentRating.slice();
    }

    @computed
    get ismsResidualRiskRating():IsmsResidualRiskRating[]{
        return this._ismsResidualRiskRating.slice();
    }

    @computed
    get ismsRiskSource():IsmsRiskSource[]{
        return this._ismsRiskSource.slice();
    }

    @computed
    get ismsRiskDepartments():IsmsRiskDepartments[]{
        return this._ismsRiskDepartments.slice();
    }

    @computed
    get ismsRiskSections():IsmsRiskSections[]{
        return this._ismsRiskSections.slice();
    }

    @computed
    get IsmsRiskStatuses():IsmsRiskStatuses[]{
        return this._ismsRiskStatuses.slice();
    }

    @computed
    get ismsRiskCategories():IsmsRiskCategories[]{
        return this._ismsRiskCategories.slice(); 
    }

    @computed
    get ismsRiskOwners():IsmsRiskOwners[]{
        return this._ismsRiskOwners.slice(); 
    }
    
    @computed
    get ismsRiskHeatMap():IsmsRiskHeatMap[]{
        return this._ismsRiskHeatmap.slice();
    }

    @computed 
    get ismsRiskAssetCriticality():IsmsRiskAssetCriticality[]{
        return this._ismsRiskAssetCriticality.slice();
    }

    @computed 
    get ismsRiskTreatmentProgressCount():IsmsRiskTreatmentProgressCount[]{
        return this._ismsRiskTreatmentProgressCount.slice();
    }

    @computed 
    get ismsRiskAgeningStatusCount():IsmsRiskAgeningStatusCount[]{
        return this._ismsRiskAgeningStatusCount.slice();
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
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

}

export const ISMSDashboardStore = new Store();