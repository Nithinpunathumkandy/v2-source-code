import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { InternalIssue, InternalIssuesList } from "src/app/core/models/organization/context/internal-issue";
import { IssueCategory, IssueCategoryPaginationResponse } from 'src/app/core/models/masters/organization/issue-category';

class Store {

    @observable
    private _internalIssueList: InternalIssuesList[] = [];

    @observable
    loaded: boolean = false;

    @observable
    private _internalIssue: InternalIssue;

    @observable
    private _issueCategories: IssueCategory[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;


    @action // Add/Replace Items in Internal Issue List
    setInternalIssueList(issueList:InternalIssuesList){
        var pos = this._internalIssueList.findIndex(e => e.issue_category_id == issueList.issue_category_id);
        if(pos == -1){
            this._internalIssueList.push(issueList); 
            this.loaded = true
        }
        else
            this._internalIssueList[pos] = issueList;
    }
    
    // Returns Internal Issue List
    get internalIssueList():InternalIssuesList[]{
        return this._internalIssueList;
    }

    // Initialize Internal issue - Issues of specific category
    initializeInternalIssue(){
        this._internalIssue = {
            data: [],
            current_page: 1,
            per_page: null,
            total: null
        }
    }

    @action // Sets Specific Category Internal Issue
    setInternalIssue(issueDetails: InternalIssue){
        this._internalIssue = issueDetails;
    }

    // Returns Internal Issue
    get internalIssue():InternalIssue{
        return this._internalIssue;
    }

    @action // Ster Current Page for Specific Category Internal Issue
    setCurrentPage(page: number){
        this._internalIssue.current_page = page;
    }

    @action // Clear Data
    unsetInternalIssueList(){
        this._internalIssue = null;
        this._internalIssueList = [];
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

    @action // Sets Issue Categories Current Page
    setIssueCategoryCurrentPage(page: number){
        this.currentPage = page;
    }
}

export const InternalIssueStore = new Store();