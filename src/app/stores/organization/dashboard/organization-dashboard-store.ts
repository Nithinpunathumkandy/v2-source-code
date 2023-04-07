
import { observable, action, computed } from "mobx-angular";
import { OrganizationCount, OrganizationIssueCategories, OrganizationIssueDepartments, OrganizationIssueDomain, OrganizationIssuePestel, OrganizationIssueSwot, OrganizationIssueType, OrganizationIssueYear, OrganizationTopTenSwotIssues, topTenList } from "src/app/core/models/organization/dashboard/organization-dashboard";
class Store {


    @observable
    currentPage: number = 1;

    @observable
    currentSecondPage: number = 2;

    @observable
    private _organizationCount: OrganizationCount;

    @observable
    private _organizationIssueSwot: OrganizationIssueSwot[] = [];

    @observable
    private _organizationIssuePestel: OrganizationIssuePestel[] = [];

    @observable
    private _organizationIssueDepartments: OrganizationIssueDepartments[] = [];

    @observable
    private _organizationIssueTypes: OrganizationIssueType[] = [];

    @observable
    private _organizationIssueYear: OrganizationIssueYear[] = [];

    @observable
    private _organizationIssueDomains: OrganizationIssueDomain[] = [];

    @observable
    private _organizationIssueCategories: OrganizationIssueCategories[] = [];

    @observable
    private _organizationTopTenSwotIssues: topTenList[] = [];

    @observable
    private _organizationTopTenSecondSwotIssues: topTenList[] = [];


    @observable
    dashboardLoaded: boolean = false;

    @observable
    topTenLoaded: boolean = false;

    @observable
    organisationDashboardParam: string = null;

    @action
    setOrganizationCount(response: OrganizationCount) {
        this._organizationCount = response; 
    }

    @action
    setOrganizationIssueSwot(response: OrganizationIssueSwot[]) {
        this._organizationIssueSwot = response;
    }

    @action
    setOrganizationIssuePestel(response: OrganizationIssuePestel[]) {
        this._organizationIssuePestel = response;
    }

    @action
    setOrganizationIssueDepartments(response: OrganizationIssueDepartments[]) {
        this._organizationIssueDepartments = response;
    }

    @action
    setOrganizationIssueType(response: OrganizationIssueType[]) {
        this._organizationIssueTypes = response;
    }

    @action
    setOrganizationIssueYear(response: OrganizationIssueYear[]) {
        this._organizationIssueYear = response;
    }

    @action
    setOrganizationIssueDomains(response: OrganizationIssueDomain[]) {
        this._organizationIssueDomains = response;
    }

    @action
    setOrganizationIssueCategories(response: OrganizationIssueCategories[]) {
        this._organizationIssueCategories = response;
    }

    @action
    setOrganizationTopTenSwotIssues(response: OrganizationTopTenSwotIssues) {
        this._organizationTopTenSwotIssues = response.data;
        this.topTenLoaded = true;
    }

    @action
    setOrganizationTopTenSwotSecondIssues(response: OrganizationTopTenSwotIssues) {
        this._organizationTopTenSecondSwotIssues = response.data;
    }
    

    @computed
    get OrganizationCount():OrganizationCount{
        return this._organizationCount;
    }

    @computed
    get organizationIssueSwot():OrganizationIssueSwot[]{
        return this._organizationIssueSwot.slice();
    }

    @computed
    get organizationIssuePestel():OrganizationIssuePestel[]{
        return this._organizationIssuePestel.slice();
    }

    @computed
    get organizationIssueDepartments():OrganizationIssueDepartments[]{
        return this._organizationIssueDepartments.slice();
    }

    @computed
    get organizationIssueType():OrganizationIssueType[]{
        return this._organizationIssueTypes.slice();
    }

    @computed
    get organizationIssueYear():OrganizationIssueYear[]{
        return this._organizationIssueYear.slice();
    }

    @computed
    get organizationIssueDomain():OrganizationIssueDomain[]{
        return this._organizationIssueDomains.slice();
    }

    @computed
    get organizationIssueCategories():OrganizationIssueCategories[]{
        return this._organizationIssueCategories.slice();
    }

    @computed
    get organizationTopTenSwotIssues():topTenList[]{
        return this._organizationTopTenSwotIssues.slice();
    }

    @computed
    get organizationTopTenSecondSwotIssues():topTenList[]{
        return this._organizationTopTenSecondSwotIssues.slice();
    }

    @computed
    get dashboardParam(){
        return this.organisationDashboardParam;
    }

    @action
    setorganisationDashboardParam(param:string){
        this.organisationDashboardParam = param
    }

    @action
    unsetorganisationDashboardParam() {
        this.organisationDashboardParam = null;
    }

}

export const OrganizationDashboardStore = new Store();