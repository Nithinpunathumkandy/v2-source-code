import { action, computed, observable } from "mobx";
import { BCMCounts, BCPCountByStatuses, BIAByYear, BIAPerformedCounts, ChangeRequestCountByYears, CriticalProcessCounts, RiskCounts, SolutionCountByScores, StrategyCountByStatuses, StrategyCountByTypes, TestAndExercisePerformedCounts } from "src/app/core/models/bcm/bcm-dashboard/bcm-dashboard";


class Store{

    @observable
    private _BCMCounts: BCMCounts;

    @observable
    private _BIAPerformedCounts: BIAPerformedCounts;

    @observable
    private _SolutionCountByScores: SolutionCountByScores[]=[];

    @observable
    private _CriticalProcessCounts: CriticalProcessCounts[]=[];

    @observable
    private _RiskCounts: RiskCounts[]=[];

    @observable
    private _BCPCountByStatuses: BCPCountByStatuses[]=[];

    @observable
    private _StrategyCountByStatuses: StrategyCountByStatuses[]=[];

    @observable
    private _StrategyCountByTypes: StrategyCountByTypes[]=[];

    @observable
    private _ChangeRequestCountByYears: ChangeRequestCountByYears[]=[];

    @observable
    private _TestAndExercisePerformedCounts: TestAndExercisePerformedCounts[]=[];

    @observable
    private _BIAByYear: BIAByYear[]=[];

    @observable
    dashboardParam: string = null;

    @observable
    dashboardLoaded: boolean = false;

    @action
    setBIAByYear(res: BIAByYear[]) {
        this.dashboardLoaded = true
        this._BIAByYear = res;
    }

    @action
    unsetBIAByYear() {
        this._BIAByYear = null;
    }

    @computed
    get BIAByYear():BIAByYear[]{
        return this._BIAByYear.slice()
    }

    @action
    setTestAndExercisePerformedCounts(res: TestAndExercisePerformedCounts[]) {
        this.dashboardLoaded = true
        this._TestAndExercisePerformedCounts = res;
    }

    @action
    unsetTestAndExercisePerformedCounts() {
        this._TestAndExercisePerformedCounts = null;
    }

    @computed
    get TestAndExercisePerformedCounts():TestAndExercisePerformedCounts[]{
        return this._TestAndExercisePerformedCounts.slice()
    }

    @action
    setChangeRequestCountByYears(res: ChangeRequestCountByYears[]) {
        this.dashboardLoaded = true
        this._ChangeRequestCountByYears = res;
    }

    @action
    unsetChangeRequestCountByYears() {
        this._ChangeRequestCountByYears = null;
    }

    @computed
    get ChangeRequestCountByYears():ChangeRequestCountByYears[]{
        return this._ChangeRequestCountByYears.slice()
    }

    @action
    setStrategyCountByTypes(res: StrategyCountByTypes[]) {
        this.dashboardLoaded = true
        this._StrategyCountByTypes = res;
    }

    @action
    unsetStrategyCountByTypes() {
        this._StrategyCountByTypes = null;
    }

    @computed
    get StrategyCountByTypes():StrategyCountByTypes[]{
        return this._StrategyCountByTypes.slice()
    }

    @action
    setStrategyCountByStatuses(res: StrategyCountByStatuses[]) {
        this.dashboardLoaded = true
        this._StrategyCountByStatuses = res;
    }

    @action
    unsetStrategyCountByStatuses() {
        this._StrategyCountByStatuses = null;
    }

    @computed
    get StrategyCountByStatuses():StrategyCountByStatuses[]{
        return this._StrategyCountByStatuses.slice()
    }

    @action
    setBCPCountByStatuses(res: BCPCountByStatuses[]) {
        this.dashboardLoaded = true
        this._BCPCountByStatuses = res;
    }

    @action
    unsetBCPCountByStatuses() {
        this._BCPCountByStatuses = null;
    }

    @computed
    get BCPCountByStatuses():BCPCountByStatuses[]{
        return this._BCPCountByStatuses.slice()
    }

    @action
    setRiskCounts(res: RiskCounts[]) {
        this.dashboardLoaded = true
        this._RiskCounts = res;
    }

    @action
    unsetRiskCounts() {
        this._RiskCounts = null;
    }

    @computed
    get RiskCounts():RiskCounts[]{
        return this._RiskCounts.slice()
    }

    @action
    setCriticalProcessCounts(res: CriticalProcessCounts[]) {
        this.dashboardLoaded = true
        this._CriticalProcessCounts = res;
    }

    @action
    unsetCriticalProcessCounts() {
        this._CriticalProcessCounts = null;
    }

    @computed
    get CriticalProcessCounts():CriticalProcessCounts[]{
        return this._CriticalProcessCounts.slice()
    }

    @action
    setSolutionCountByScores(res: SolutionCountByScores[]) {
        this.dashboardLoaded = true
        this._SolutionCountByScores = res;
    }

    @action
    unsetSolutionCountByScores() {
        this._SolutionCountByScores = null;
    }

    @computed
    get SolutionCountByScores():SolutionCountByScores[]{
        return this._SolutionCountByScores.slice()
    }

    @action
    setBIAPerformedCounts(res: BIAPerformedCounts) {
        this.dashboardLoaded = true
        this._BIAPerformedCounts = res;
    }

    @action
    unsetBIAPerformedCounts() {
        this._BIAPerformedCounts = null;
    }

    @computed
    get BIAPerformedCounts():BIAPerformedCounts{
        return this._BIAPerformedCounts
    }

    @action
    setBCMCounts(res: BCMCounts) {
        this.dashboardLoaded = true
        this._BCMCounts = res;
    }

    @action
    unsetBCMCounts() {
        this._BCMCounts = null;
    }

    @computed
    get BCMCounts():BCMCounts{
        return this._BCMCounts
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

export const BCMDashboardStore = new Store();