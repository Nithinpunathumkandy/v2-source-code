import { action, computed, observable } from "mobx";
import { ActionPlans, CorrectiveActionOpenCloseCount, DepartmentFindings, CorrectiveActionDepartment, CorrectiveActionResponsibleUser,  OverdueActionPlans, StatusWiseAnalysisFindings, Top10Findings, Top10List, Top10PaginationResponse, CorrectiveActionsByDepartment, CorrectiveActionsByResponsibleUser, } from "src/app/core/models/internal-audit/dashboard/dashboard";

class Store{

    @observable
    totalItems: number = null;

    @observable
    totalItemsForOverdue: number = null;

    @observable
    totalItemsCorrectiveActionDepartment: number = null;

    @observable
    totalItemsCorrectiveActionResponsibleUser: number = null;

    @observable
    from: number = null;

    @observable
    CorrectiveActionDepartmentfrom: number = null;

    @observable
    CorrectiveActionResponsibleUserfrom: number = null;

    @observable
    last_page: number = null;

    @observable
    currentPage: number = 1;

    @observable
    currentSecondPage: number = 2;

    @observable
    currentPageForOverdue: number = 1;

    @observable
    currentPageCorrectiveActionDepartment: number = 1;

    @observable
    currentPageCorrectiveActionResponsibleUser: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    itemsPerPageForOverdue: number = null;

    @observable
    itemsPerPageCorrectiveActionDepartment: number = null;

    @observable
    itemsPerPageCorrectiveActionResponsibleUser: number = null;

    @observable
    dashboardLoaded: boolean = false;

    @observable
    CorrectiveActionDepartmentLoaded: boolean = false;

    @observable
    CorrectiveActionResponsibleUserLoaded: boolean = false;

    @observable
    private _StatusWiseAnalysisFindings: StatusWiseAnalysisFindings[]=[];

    @observable
    private _RiskRatingFindings: StatusWiseAnalysisFindings[]=[];

    @observable
    private _DivisionFindings: StatusWiseAnalysisFindings[]=[];

    @observable
    private _DepartmentFindings: DepartmentFindings[]=[];

    @observable
    private _CorrectiveActionDepartment: CorrectiveActionsByDepartment[] = [];

    @observable
    private _CorrectiveActionResponsibleUser: CorrectiveActionsByResponsibleUser[] = [];

    @observable
    private _Top10Findings: Top10Findings[]=[];

    @observable
    private _CorrectiveActionOpenCloseCount: CorrectiveActionOpenCloseCount

    @observable
    private _firstTop10: Top10List[] = [];

    @observable
    private _secondTop10: Top10List[] = [];

    @observable
    private ActionPlans: ActionPlans[] = [];

    @observable
    private _CategoryFindings: StatusWiseAnalysisFindings[] = [];

    @observable
    dashboardParam: string = null;

    @action
    setCategoryFindings(res: StatusWiseAnalysisFindings[]) {
        this._CategoryFindings = res;
    }

    @action
    unsetCategoryFindings() {
        this._CategoryFindings = null;
    }

    @computed
    get CategoryFindings():StatusWiseAnalysisFindings[]{
        return this._CategoryFindings.slice()
    }

    @action
    setOverdueActionPlan(response: OverdueActionPlans) {
        this.ActionPlans = response.data; 
        this.currentPageForOverdue = response.current_page;
        this.itemsPerPageForOverdue = response.per_page;
        this.totalItemsForOverdue = response.total;
        // this.from = response.from;
    }

    @action
    setFirstTop10(response: Top10PaginationResponse) {
        this._firstTop10 = response.data; 
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        // this.from = response.from;
    }

    @action
    setSecondTop10(response: Top10PaginationResponse) {
        this._secondTop10 = response.data; 
        this.currentSecondPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        // this.from = response.from;
    }

    @computed
    get Top10First():Top10List[]{
        return this._firstTop10;
    }

    @computed
    get OverdueActionPlans():ActionPlans[]{
        return this.ActionPlans;
    }

    @computed
    get Top10Second():Top10List[]{
        return this._secondTop10;
    }

    @action // Sets current page for pagination
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action // Sets current page for pagination
    setCurrentSecondPage(current_page: number) {
        this.currentSecondPage = current_page;
    }

    @action // Sets current page for pagination
    setCurrentPageOverdue(current_page: number) {
        this.currentPageForOverdue = current_page;
    }

    @action // Sets current page for pagination
    setCurrentPageCorrectiveActionDepartment(current_page: number) {
        this.currentPageCorrectiveActionDepartment = current_page;
    }

    @action // Sets current page for pagination
    setCurrentPageCorrectiveActionResponsibleUser(current_page: number) {
        this.currentPageCorrectiveActionResponsibleUser = current_page;
    }

    @action
    setCorrectiveActionOpenCloseCount(res: CorrectiveActionOpenCloseCount) {
        this._CorrectiveActionOpenCloseCount = res;
    }

    @action
    unsetCorrectiveActionOpenCloseCount() {
        this._CorrectiveActionOpenCloseCount = null;
    }

    @computed
    get CorrectiveActionOpenCloseCount():CorrectiveActionOpenCloseCount{
        return this._CorrectiveActionOpenCloseCount
    }

    @action
    setStatusWiseAnalysisFindings(res: StatusWiseAnalysisFindings[]) {
        this._StatusWiseAnalysisFindings = res;
    }

    @action
    unsetStatusWiseAnalysisFindings() {
        this._StatusWiseAnalysisFindings = null;
    }

    @computed
    get StatusWiseAnalysisFindings():StatusWiseAnalysisFindings[]{
        return this._StatusWiseAnalysisFindings.slice()
    }

    @action
    setRiskRatingFindings(res: StatusWiseAnalysisFindings[]) {
        this._RiskRatingFindings = res;
    }

    @action
    unsetRiskRatingFindings() {
        this._RiskRatingFindings = null;
    }

    @computed
    get RiskRatingFindings():StatusWiseAnalysisFindings[]{
        return this._RiskRatingFindings.slice()
    }

    @action
    setDivisionFindings(res: StatusWiseAnalysisFindings[]) {
        this._DivisionFindings = res;
    }

    @action
    unsetDivisionFindings() {
        this._DivisionFindings = null;
    }

    @computed
    get DivisionFindings():StatusWiseAnalysisFindings[]{
        return this._DivisionFindings.slice()
    }

    @action
    setDepartmentFindings(res: DepartmentFindings[]) {
        this._DepartmentFindings = res;
    }

    @action
    setCorrectiveActionDepartment(res: CorrectiveActionDepartment) {
        this._CorrectiveActionDepartment = res.data; 
        this.currentPageCorrectiveActionDepartment = res.current_page;
        this.itemsPerPageCorrectiveActionDepartment = res.per_page;
        this.totalItemsCorrectiveActionDepartment = res.total;
        this.CorrectiveActionDepartmentLoaded = true;
        this.CorrectiveActionDepartmentfrom = res.from;
    }

    @action
    setCorrectiveActionResponsibleUser(res: CorrectiveActionResponsibleUser) {
        this._CorrectiveActionResponsibleUser = res.data;
        this.currentPageCorrectiveActionResponsibleUser = res.current_page;
        this.itemsPerPageCorrectiveActionResponsibleUser = res.per_page;
        this.totalItemsCorrectiveActionResponsibleUser = res.total;
        this.CorrectiveActionResponsibleUserLoaded = true;
        this.CorrectiveActionResponsibleUserfrom = res.from;
    }

    @action
    unsetCorrectiveActionDepartment() {
        this._CorrectiveActionDepartment = null;
    }

    @action
    unsetCorrectiveActionResponsibleUser() {
        this._CorrectiveActionResponsibleUser = null;
    }

    @action
    unsetDepartmentFindings() {
        this._DepartmentFindings = null;
    }

    @computed
    get DepartmentFindings():DepartmentFindings[]{
        return this._DepartmentFindings?.slice()
    }

    @computed
    get CorrectiveActionDepartment():CorrectiveActionsByDepartment[]{
        return this._CorrectiveActionDepartment.slice();
    }

    @computed
    get CorrectiveActionResponsibleUser():CorrectiveActionsByResponsibleUser[]{
        return this._CorrectiveActionResponsibleUser.slice();
    }

    @action
    setTop10Findings(res: Top10Findings[]) {
        this._Top10Findings = res;
    }

    @action
    unsetTop10Findings() {
        this._Top10Findings = null;
    }

    @computed
    get Top10Findings():Top10Findings[]{
        return this._Top10Findings.slice()
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

export const IADashboardStore = new Store();