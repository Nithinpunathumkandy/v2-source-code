import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExternalIssue,ExternalIssuesList } from "src/app/core/models/organization/context/external-issue";
import { IssueCategory, IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';


class Store {

    @observable
    private _externalIssueList: ExternalIssuesList[] = [];

    @observable
    loaded: boolean = false;

    @observable
    private _externalIssue: ExternalIssue;

    @observable
    private _issueCategories: IssueCategory[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @action // Add/ Replace Items in External Issue List
    setExternalIssueList(issueList:ExternalIssuesList){
        var pos = this._externalIssueList.findIndex(e => e.issue_category_id == issueList.issue_category_id);
        if(pos == -1){
            this._externalIssueList.push(issueList);
            this.loaded = true;
        }
        else
            this._externalIssueList[pos] = issueList;
    }
    
    // Returns External Issue List
    get externalIssueList():ExternalIssuesList[]{
        return this._externalIssueList;
    }

    // Initialize External Issue - View More
    initializeExternalIssue(){
        this._externalIssue = {
            data: [],
            current_page: 1,
            per_page: null,
            total: null
        }
    }

    @action // Set External Issue
    setExternalIssue(issueDetails: ExternalIssue){
        this._externalIssue = issueDetails;
    }

    // Return External Issue 
    get externalIssue():ExternalIssue{
        return this._externalIssue;
    }

    @action // Set Current Page for External Issue - view More
    setCurrentPage(page: number){
        this._externalIssue.current_page = page;
    }

    @action // Clear All Data
    unsetExternalIssueList(){
        this._externalIssue = null;
        this._externalIssueList = [];
        this.loaded = false;
    }

    @action // Sets Issue Categories
    setIssueCategories(response: IssueCategoryPaginationResponse){
        this._issueCategories = response.data;
        this.currentPage = response.current_page;
        this.totalItems = response.total;
        this.itemsPerPage = response.per_page;
        //this.loaded = true;
    }

    @action // Set Current Page for Issue Category
    setIssueCategoryCurrentPage(page: number){
        this.currentPage = page;
    }
    
}

export const ExternalIssueStore = new Store();