import { action, observable, computed } from "mobx-angular";
import { ActionPlan, MeetingVsActionPlan, MeetingYear, MRMCounts } from "src/app/core/models/mrm/dashboard/mrm-dashboard";
import { RiskCount, RiskCountByCategories, RiskCountByDepartment, RiskCountByInherentRiskRatings, RiskCountByOwners, RiskCountByResidualRiskRatings, RiskCountBySection, RiskCountBySource, RiskCountByStatus, RiskHeatMap, RiskList, SecondRiskList } from "src/app/core/models/risk-management/risk-dashboard/risk-dashboard";


class Store {

    @observable
    heatMapLoaded: boolean = false;

    @observable
    private _actionPlan: ActionPlan[]=[];

    @observable
    private _MeetingByStatus: ActionPlan[]=[];

    @observable
    private _MeetingByDepartments: ActionPlan[]=[];

    @observable
    private _MeetingByCategories: ActionPlan[]=[];

    @observable
    private _MeetingByYears: MeetingYear[]=[];

    @observable
    private _MeetingVsActionPlan: MeetingVsActionPlan[]=[];

    @observable
    private _MRMCounts: MRMCounts;

    @observable
    risk_status_id: number = null;

    @observable
    dashboardParam: string = null;

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
    setActionPlan(res: ActionPlan[]) {
        this._actionPlan = res;
    }

    @action
    unsetActionPlan() {
        this._actionPlan = [];
    }

    @computed
    get actionPlan():ActionPlan[]{
        return this._actionPlan.slice()
    }

    @action
    setMeetingByStatus(res: ActionPlan[]) {
        this._MeetingByStatus = res;
    }

    @action
    unsetMeetingByStatus() {
        this._MeetingByStatus = [];
    }

    @computed
    get MeetingByStatus():ActionPlan[]{
        return this._MeetingByStatus.slice()
    }

    @action
    setMeetingByDepartments(res: ActionPlan[]) {
        this._MeetingByDepartments = res;
    }

    @action
    unsetMeetingByDepartments() {
        this._MeetingByDepartments = [];
    }

    @computed
    get MeetingByDepartments():ActionPlan[]{
        return this._MeetingByDepartments.slice()
    }

    @action
    setMeetingByCategories(res: ActionPlan[]) {
        this._MeetingByCategories = res;
    }

    @action
    unsetMeetingByCategories() {
        this._MeetingByCategories = [];
    }

    @computed
    get MeetingByCategories():ActionPlan[]{
        return this._MeetingByCategories.slice()
    }

    @action
    setMeetingByYears(res: MeetingYear[]) {
        this._MeetingByYears = res;
    }

    @action
    unsetMeetingByYears() {
        this._MeetingByYears = [];
    }

    @computed
    get MeetingByYears():MeetingYear[]{
        return this._MeetingByYears.slice()
    }

    @action
    setMeetingVsActionPlan(res: MeetingVsActionPlan[]) {
        this._MeetingVsActionPlan = res;
    }

    @action
    unsetMeetingVsActionPlan() {
        this._MeetingVsActionPlan = [];
    }

    @computed
    get MeetingVsActionPlan():MeetingVsActionPlan[]{
        return this._MeetingVsActionPlan.slice()
    }

    @action
    setMRMCounts(res: MRMCounts) {
        this.dashboardLoaded = true;
        this._MRMCounts = res;
    }

    @action
    unsetMRMCounts() {
        this.dashboardLoaded = false;
        this._MRMCounts = null;
    }

    @computed
    get MRMCounts():MRMCounts{
        return this._MRMCounts
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @action
    unsetorganisationDashboardParam() {
        this.dashboardParam = null;
    }

}

export const MRMDashboardStore = new Store();