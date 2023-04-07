import { action, observable, computed } from "mobx-angular";
import { CeoDivisions, CeoRiskCount, CeoRiskCountByCategories, CeoRiskDetailsByDepartment, CeoRiskCountByDivisions, CeoRiskCountByInherentRiskRatings, CeoRiskCountByOwners, CeoRiskCountByResidualRiskRatings, CeoRiskCountBySection, CeoRiskCountBySource, CeoRiskCountByStatus, CeoRiskHeatMap, CeoRiskList, CeoSecondRiskList, RiskHeatMap, CeoCountByDepartment } from "src/app/core/models/risk-management/risk-ceo-dashboard/risk-ceo-dashboard";



class Store {

    @observable
    heatMapLoaded: boolean = false;

    @observable
    private _riskCountDetails: CeoRiskCount;

    @observable
    private _riskListData: CeoRiskList[] = [];

    @observable
    private _secondRiskListData: CeoSecondRiskList[] = []

    @observable
    private _riskCountBySources: CeoRiskCountBySource[] = [];

    @observable
    private _riskCountByDivisions: CeoRiskCountByDivisions[] = [];

    @observable
    private _riskDetailsByDepartments: CeoRiskDetailsByDepartment[] = [];

    @observable
    private _riskCountByDepartments: CeoCountByDepartment[] = [];


    @observable
    private _riskCountBySections: CeoRiskCountBySection[] = [];


    @observable
    private _riskCountByStatuses: CeoRiskCountByStatus[] = [];

    @observable
    private _riskCountByCategories: CeoRiskCountByCategories[] = [];

    @observable
    private _riskCountByOwners: CeoRiskCountByOwners[] = [];

    @observable
    private _riskHeatMapDetails: CeoRiskHeatMap[] = [];

    @observable
    private _riskCountByInherentRiskRatings: CeoRiskCountByInherentRiskRatings[] = [];

    @observable
    private _riskCountByResidualRiskRatings: CeoRiskCountByResidualRiskRatings[] = [];

    @observable
    private _ceoDivisions: CeoDivisions[] = []

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
    selected_division_id: number = null;

    @observable
    selected_division_title: string = null;

    @observable
    selectedHeatMapParam: string = null;

    @observable
    private _heatMapByCategoryDetails: RiskHeatMap[] = [];

    @observable
    categoryLoaded: boolean = false;

    @observable
    sourceLoaded: boolean = false;

    @observable
    statusLoaded: boolean = false;

    @observable
    divisionLoaded: boolean = false;

    @action
    setHeatMapByCategoryDetails(response: RiskHeatMap[]) {
        this._heatMapByCategoryDetails = response;
    }

    @action
    unsetHeatMapByCategoryDetails() {
        this._heatMapByCategoryDetails = [];
    }

    @computed
    get heatMapByCategoryDetails(): RiskHeatMap[] {

        return this._heatMapByCategoryDetails;
    }

    @action
    setSelectedHeatMapParam(title: string) {
        this.selectedHeatMapParam = title;
    }

    @action
    unsetSelectedHeatMapParam() {
        this.selectedHeatMapParam = null;
    }

    @action
    setSelectedDivisionTitle(title: string) {
        this.selected_division_title = title;
    }

    @action
    unsetSelectedDivisionTitle() {
        this.selected_division_title = null;
    }

    @action
    setSelectedDivisionId(id: number) {
        this.selected_division_id = id;
    }

    @action
    unsetSelectedDivisionId() {
        this.selected_division_id = null;
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
    setRiskCountByInherentRiskRatings(response: CeoRiskCountByInherentRiskRatings[]) {
        this._riskCountByInherentRiskRatings = response;
    }

    @action
    setRiskCountByResidualRiskRatings(response: CeoRiskCountByResidualRiskRatings[]) {
        this._riskCountByResidualRiskRatings = response;
    }

    @action
    setRiskHeatMapDetails(response: CeoRiskHeatMap[]) {
        this._riskHeatMapDetails = response;
        this.heatMapLoaded = true;
    }

    @action
    setRiskCountByOwners(response: CeoRiskCountByOwners[]) {
        this._riskCountByOwners = response; 
    }

    @action
    setRiskCountByCategories(response: CeoRiskCountByCategories[]) {
        this._riskCountByCategories = response; 
    }
    
    @action
    setRiskCountByStatuses(response: CeoRiskCountByStatus[]) {
        this._riskCountByStatuses = response; 
    }

    @action
    setRiskCountBySections(response: CeoRiskCountBySection[]) {
        this._riskCountBySections = response; 
    }

    @action
    setRiskCountByDepartments(response: CeoCountByDepartment[]) {
        this._riskCountByDepartments = response; 
    }

    @action
    setRiskDetailsByDepartments(response: CeoRiskDetailsByDepartment[]) {
        this._riskDetailsByDepartments = response; 
    }

    @action
    setRiskCountBySources(response: CeoRiskCountBySource[]) {
        this._riskCountBySources = response; 
    }

    @action
    setRiskCountByDivisions(response: CeoRiskCountByDivisions[]) {
        this._riskCountByDivisions = response; 
    }

    @action
    setRiskCountDetails(response: CeoRiskCount) {
        this._riskCountDetails = response; 
    }

    @action
    setRiskDetails(response: CeoRiskList[]) {
        this._riskListData = response; 
    }

    @action
    setSecondRiskDetails(response: CeoSecondRiskList[]) {
        this._secondRiskListData = response; 
    }

    @action
    setCeoDivisions(response: CeoDivisions[]) {
        this._ceoDivisions = response; 
    }

    @computed
    get ceoDivisions():CeoDivisions[]{
        return this._ceoDivisions.slice();
    }

    @computed
    get riskCountByInherentRiskRatings():CeoRiskCountByInherentRiskRatings[]{
        return this._riskCountByInherentRiskRatings.slice();
    }

    @computed
    get riskCountByResidualRiskRatings():CeoRiskCountByResidualRiskRatings[]{
        return this._riskCountByResidualRiskRatings.slice();
    }

    @computed
    get riskHeatMap():CeoRiskHeatMap[]{
        return this._riskHeatMapDetails.slice();
    }

    @computed
    get riskCountByStatus():CeoRiskCountByStatus[]{
        return this._riskCountByStatuses.slice();
    }

    @computed
    get riskCountByCategories():CeoRiskCountByCategories[]{
        return this._riskCountByCategories.slice();
    }

    @computed
    get riskCountByOwners():CeoRiskCountByOwners[]{
        return this._riskCountByOwners.slice();
    }

    @computed
    get riskCountBySections():CeoRiskCountBySection[]{
        return this._riskCountBySections.slice();
    }

    @computed
    get riskDetailsByDepartments():CeoRiskDetailsByDepartment[]{
        return this._riskDetailsByDepartments.slice();
    }

    @computed
    get riskCountByDepartments():CeoCountByDepartment[]{
        return this._riskCountByDepartments.slice();
    }

    @computed
    get riskCountBySources():CeoRiskCountBySource[]{
        return this._riskCountBySources.slice();
    }

    @computed
    get riskCountByDivisions():CeoRiskCountByDivisions[]{
        return this._riskCountByDivisions.slice();
    }

    @computed
    get riskCount():CeoRiskCount{
        return this._riskCountDetails;
    }

    @computed
    get riskList():CeoRiskList[]{
        return this._riskListData;
    }

    @computed
    get secondRiskList():CeoSecondRiskList[]{
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

export const CeoRiskDashboardStore = new Store();