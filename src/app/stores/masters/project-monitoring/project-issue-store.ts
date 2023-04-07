import { observable, action, computed } from "mobx-angular";
import { ProjectIssueStatus,ProjectIssueStatusPaginationResponse} from "src/app/core/models/masters/project-monitoring/project-issue-status";
// import {ProjectIssueStatus,ProjectIssueStatusPaginationResponse,ProjectIssueStatusSingle} from '../../../core/models/masters/project-monitoring/project-issue-status'

class Store{
    @observable 
    private _projectIssueStatus:ProjectIssueStatus[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;


    @observable
    orderItem: string = 'project_issue_status_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;
    
    @action
    setProjectIssueStatus(response:ProjectIssueStatusPaginationResponse){
        this._projectIssueStatus=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }


    @computed
    get ProjectIssueStatus(): ProjectIssueStatus[] {
        
        return this._projectIssueStatus.slice();
    }

}

export const ProjectIssueStatusMasterStore = new Store();