
import { observable, action, computed } from "mobx-angular";
import { FindingCount, FindingLineDepartment, FindingLineYear, FindingPieChartActionPlan, FindingPieChartCategory, RiskRating } from "src/app/core/models/non-conformity/non-conformity-dashboard";
class Store {


    @observable
    private _findingCount: FindingCount;
    
    @observable
    nonConformityDashboardParam: string = null;

    @observable
    private _riskRating: RiskRating[] = [];

    @observable
    private _findingPieChartCategory: FindingPieChartCategory[] = [];

    @observable
    private _findingPieChartActionPlan: FindingPieChartActionPlan[] = [];

    @observable
    private _findingLineDepartment: FindingLineDepartment[] = [];

    @observable
    private _findingLineYear: FindingLineYear[] = [];


    @observable
    dashboardLoaded: boolean = false;

    @action
    setFindingCount(response: FindingCount) {
        this._findingCount = response; 
    }

    @action
    setRiskRating(response: RiskRating[]) {
        this._riskRating = response;
    }

    @action
    setFindingPieChartCategory(response: FindingPieChartCategory[]) {
        this._findingPieChartCategory = response;
    }

    @action
    setFindingPieChartActionPlan(response: FindingPieChartActionPlan[]) {
        this._findingPieChartActionPlan = response;
    }

    @action
    setFindingLineDepartment(response: FindingLineDepartment[]) {
        this._findingLineDepartment = response;
    }

    @action
    setFindingLineYear(response: FindingLineYear[]) {
        this._findingLineYear = response;
    }

    @action
    setDashboardParam(param:string){
        this.nonConformityDashboardParam = param
    }

    @action
    unsetDashboardParam() {
        this.nonConformityDashboardParam = null;
    }

    @computed
    get FindingCount():FindingCount{
        return this._findingCount;
    }

    @computed
    get riskRating():RiskRating[]{
        return this._riskRating.slice();
    }

    @computed
    get findingPieChartCategory():FindingPieChartCategory[]{
        return this._findingPieChartCategory.slice();
    }

    @computed
    get findingPieChartActionPlan():FindingPieChartActionPlan[]{
        return this._findingPieChartActionPlan.slice();
    }

    @computed
    get findingLineDepartment():FindingLineDepartment[]{
        return this._findingLineDepartment.slice();
    }

    @computed
    get findingLineYear():FindingLineYear[]{
        return this._findingLineYear.slice();
    }

    @computed
    get dashboardParam(){
        return this.nonConformityDashboardParam;
    }

}

export const NonConformityDashboardStore = new Store();