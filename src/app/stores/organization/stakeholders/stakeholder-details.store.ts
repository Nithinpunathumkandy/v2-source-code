import { observable, action, computed } from "mobx-angular";
import { StakeholderNeedsAndExpectations, StakeholderNeedsAndExpectationsPaginationResponse } from "src/app/core/models/organization/stakeholder/stakeholder-needs-and-expectations";
import { IssueList, IssueListResponse } from "src/app/core/models/organization/context/issue-list";

class Store {
    @observable
    private _stakeholderNeedAndExpectation: StakeholderNeedsAndExpectations[] = [];

    @observable
    nLoaded: boolean = false;

    @observable
    nCurrentPage: number = 1;

    @observable
    nItemsPerPage: number = null;

    @observable
    nTotalItems: number = null;

    @observable
    private _stakeholderIssues: IssueList[] = [];

    @observable
    iLoaded: boolean = false;

    @observable
    iCurrentPage: number = 1;

    @observable
    iItemsPerPage: number = null;

    @observable
    iTotalItems: number = null;

    @action
    setStakeholderNeedsAndExpectations(needsAndExpectations: StakeholderNeedsAndExpectationsPaginationResponse){
        this._stakeholderNeedAndExpectation = needsAndExpectations.data;
        this.nCurrentPage = needsAndExpectations.current_page;
        this.nItemsPerPage = needsAndExpectations.per_page;
        this.nTotalItems = needsAndExpectations.total;
        this.nLoaded = true;
    }

    @action
    setStakeholderNeedsAndExpectationCurrentPage(page: number){
        this.nCurrentPage = page;
    }

    @computed
    get stakeholderNeedsAndExpectations(): StakeholderNeedsAndExpectations[]{
        return this._stakeholderNeedAndExpectation.slice();
    }

    @action
    setStakeholderIssues(issues: IssueListResponse){
        this._stakeholderIssues = issues.data;
        this.iCurrentPage = issues.current_page;
        this.iItemsPerPage = issues.per_page;
        this.iTotalItems = issues.total;
        this.iLoaded = true;
    }

    @action
    setStakeholderIssuesCurrentPage(page: number){
        this.iCurrentPage = page;
    }

    @computed
    get stakeholderIssues(): IssueList[]{
        return this._stakeholderIssues.slice();
    }

    unsetValues(){
        this._stakeholderNeedAndExpectation = [];
        this.nCurrentPage = 1;
        this.nItemsPerPage = null;
        this.nTotalItems = null;
        this.nLoaded = false;
        this._stakeholderIssues = [];
        this.iCurrentPage = 1;
        this.iItemsPerPage = null;
        this.iTotalItems = null;
        this.iLoaded = false;
    }

    getStakeholderNeedsAndExpectationsByType(type: string){
        var returnValue = [];
        switch(type){
            case 'general':
                for(let i of this._stakeholderNeedAndExpectation){
                    if(!i.process_id && !i.organization_issue_id)
                        returnValue.push(i);
                }
                break;
            case 'issues': 
                for(let i of this._stakeholderNeedAndExpectation){
                    if(i.organization_issue_id)
                        returnValue.push(i);
                }
                break;
            case 'processes': for(let i of this._stakeholderNeedAndExpectation){
                    if(i.process_id)
                        returnValue.push(i);
                }
                break;
        }
        return returnValue;
    }
}

export const StakeholderDetailsStore = new Store();