import { action, computed, observable } from "mobx-angular";
import { BudgetByDepartments, BudgetByYears, ChangeRequestByDepartments, ChangeRequestByStatus, MilestoneByDepartments, MilestoneByMonths, ProjectByContractTypes, ProjectByDepartment, ProjectByPriority, ProjectByTypes, ProjectByYears, ProjectClosureByDepartments, ProjectClosureByStatus, ProjectCounts, ProjectIssuesByDepartment, ProjectIssuesByStatuses } from "src/app/core/models/project-monitoring/project-dasboard";


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
    private _projectCounts: ProjectCounts[] = []; 

    @observable
    private _projectByDepartment: ProjectByDepartment[] = []; 

    @observable
    private _projectByContractTypes: ProjectByContractTypes[] = []; 

    @observable
    private _projectByPriority: ProjectByPriority[] = []; 

    @observable
    private _projectByYears: ProjectByYears[] = []; 

    @observable
    private _projectIssuesByStatuses: ProjectIssuesByStatuses[] = []; 

    @observable
    private _budgetByYears: BudgetByYears[] = []; 

    @observable
    private _budgetByDepartments: BudgetByDepartments[] = []; 

    @observable
    private _milestoneByMonths: MilestoneByMonths[] = []; 

    @observable
    private _milestoneByDepartments: MilestoneByDepartments[] = []; 

    @observable
    private _projectByTypes: ProjectByTypes[] = []; 

    @observable
    private _projectIssuesByDepartment: ProjectIssuesByDepartment[] = []; 

    @observable
    private _projectClosureByStatus: ProjectClosureByStatus[] = []; 

    @observable
    private _projectClosureByDepartments: ProjectClosureByDepartments[] = []; 

    @observable
    private _changeRequestByDepartments: ChangeRequestByDepartments[] = []; 

    @observable
    private _changeRequestByStatus: ChangeRequestByStatus[] = []; 


    @observable
    dashboardLoaded: boolean = false;

    @observable
    closureLoaded: boolean = false;

    @observable
    changeRequestLoaded: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    dashboardParam: string = null;

    @action
    setProjectCounts(res: ProjectCounts[]) {
        this.dashboardLoaded = true
        this._projectCounts = res;
    }

    @action
    setProjectByDepartment(res: ProjectByDepartment[]) {
        this.dashboardLoaded = true
        this._projectByDepartment = res;
    }

    @action
    setProjectByContractTypes(res: ProjectByContractTypes[]){
        this.dashboardLoaded = true
        this._projectByContractTypes = res;
    }

    @action
    setProjectByPriority(res: ProjectByPriority[]){
        this.dashboardLoaded = true
        this._projectByPriority = res;
    }

    @action
    setProjectByYears(res: ProjectByYears[]){
        this.dashboardLoaded = true
        this._projectByYears = res;
    }

    @action
    setProjectIssuesByStatuses(res: ProjectIssuesByStatuses[]){
        this.dashboardLoaded = true
        this._projectIssuesByStatuses = res;
    }

    @action
    setBudgetByYears(res: BudgetByYears[]){
        this.dashboardLoaded = true
        this._budgetByYears = res;
    }

    @action
    setBudgetByDepartments(res: BudgetByDepartments[]){
        this.dashboardLoaded = true
        this._budgetByDepartments = res;
    }

    @action
    setMilestoneByMonths(res: MilestoneByMonths[]){
        this.dashboardLoaded = true
        this._milestoneByMonths = res;
    }

    @action
    setMilestoneByDepartments(res: MilestoneByDepartments[]){
        this.dashboardLoaded = true
        this._milestoneByDepartments = res;
    }

    @action
    setProjectByTypes(res: ProjectByTypes[]){
        this.dashboardLoaded = true
        this._projectByTypes = res;
    }

    @action
    setProjectIssuesByDepartment(res: ProjectIssuesByDepartment[]){
        this.dashboardLoaded = true
        this._projectIssuesByDepartment = res;
    }

    @action
    setProjectClosureByStatus(res: ProjectClosureByStatus[]){
        this.closureLoaded = true
        this._projectClosureByStatus = res;
    }

    @action
    setProjectClosureByDepartments(res: ProjectClosureByDepartments[]){
        this.closureLoaded = true
        this._projectClosureByDepartments = res;
    }

    @action
    setChangeRequestByDepartments(res: ChangeRequestByDepartments[]){
        this.changeRequestLoaded = true
        this._changeRequestByDepartments = res;
    }

    @action
    setChangeRequestByStatus(res: ChangeRequestByStatus[]){
        this.changeRequestLoaded = true
        this._changeRequestByStatus = res;
    }

   
    @action
    unsetProjectCounts() {
        this._projectCounts = null;
    }

    @action
    unsetProjectByDepartment() {
        this._projectByDepartment = null;
    }

    @action
    unsetProjectByContractTypes() {
        this._projectByContractTypes = null;
    }

    @action
    unsetProjectByPriority() {
        this._projectByContractTypes = null;
    }

    @action
    unsetProjectByYears() {
        this._projectByYears = null;
    }

    @action
    unsetProjectIssuesByStatuses() {
        this._projectIssuesByStatuses = null;
    }

    @action
    unsetBudgetByYears() {
        this._budgetByYears = null;
    }

    @action
    unsetBudgetByDepartments() {
        this._budgetByDepartments = null;
    }

    @action
    unsetMilestoneByMonths() {
        this._milestoneByMonths = null;
    }

    @action
    unsetMilestoneByDepartments() {
        this._milestoneByDepartments = null;
    }

    @action
    unsetProjectByTypes() {
        this._projectByTypes = null;
    }

    @action
    unsetProjectClosureByStatus() {
        this._projectClosureByStatus = null;
    }

    @action
    unsetProjectIssuesByDepartment() {
        this._projectIssuesByDepartment = null;
    }

    @action
    unsetProjectClosureByDepartments() {
        this._projectClosureByDepartments = null;
    }

    @action
    unsetChangeRequestByDepartments() {
        this._changeRequestByDepartments = null;
    }

    @action
    unsetChangeRequestByStatus() {
        this._changeRequestByStatus = null;
    }


    @computed
    get ProjectCounts():ProjectCounts[]{
        return this._projectCounts
    }

    @computed
    get ProjectByDepartment():ProjectByDepartment[]{
        return this._projectByDepartment
    }

    @computed
    get ProjectByContractTypes():ProjectByContractTypes[]{
        return this._projectByContractTypes
    }

    @computed
    get ProjectByPriority():ProjectByPriority[]{
        return this._projectByPriority
    }

    @computed
    get ProjectByYears():ProjectByYears[]{
        return this._projectByYears
    }

    @computed
    get ProjectIssuesByStatuses():ProjectIssuesByStatuses[]{
        return this._projectIssuesByStatuses
    }

    @computed
    get BudgetByYears():BudgetByYears[]{
        return this._budgetByYears
    }

    @computed
    get BudgetByDepartments():BudgetByDepartments[]{
        return this._budgetByDepartments
    }

    @computed
    get MilestoneByMonths():MilestoneByMonths[]{
        return this._milestoneByMonths
    }

    @computed
    get MilestoneByDepartments():MilestoneByDepartments[]{
        return this._milestoneByDepartments
    }

    @computed
    get ProjectByTypes():ProjectByTypes[]{
        return this._projectByTypes
    }

    @computed
    get ProjectIssuesByDepartment():ProjectIssuesByDepartment[]{
        return this._projectIssuesByDepartment
    }

    @computed
    get ProjectClosureByStatus():ProjectClosureByStatus[]{
        return this._projectClosureByStatus
    }

    @computed
    get ProjectClosureByDepartments():ProjectClosureByDepartments[]{
        return this._projectClosureByDepartments
    }

    @computed
    get ChangeRequestByDepartments():ChangeRequestByDepartments[]{
        return this._changeRequestByDepartments
    }

    @computed
    get ChangeRequestByStatus():ChangeRequestByStatus[]{
        return this._changeRequestByStatus
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

export const ProjectDashboardStore = new Store();