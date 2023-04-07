import { AnyARecord } from "dns";
import { observable, action, computed } from "mobx-angular";
import { TimeTracker, TimeTrackerPaginationResponse, TimeTrackerActivity, TimeTrackerActivityPaginationResponse,
    IndividualTimeTrackerDetails,Activities,Users,ProjectTime, ProjectTimeTrackerPaginationResponse,ProjectTimeTracker } from "src/app/core/models/project-management/time-tracker/time-tracker"


class Store {
   
    @observable
    private _timeTrackers: TimeTracker[] = [];

    @observable
    projectTimeTrackers: ProjectTimeTracker[] = [];

    @observable
    timeTrackersActivity: TimeTrackerActivity[] = [];

    @observable  
    loaded:boolean=false;

    @observable 
    projectTitle:string='';

    @observable
    projectTimeTrackerLoaded:Boolean=false

    @observable
    currentPage: number = 1;

    @observable
    projectTimeTrackerCurrentPage:number=1;

    @observable
    activities: Activities[] = [];

    @observable
    users: Users[] = [];

    @observable
    projectTime: ProjectTime[]=[];
    
    // @observable 
    // _individualTimeTrackerDetails: TimeTrackerDetails = null;

    @observable
    itemsPerPage: number = null;

    @observable
    projectTimeTrackerItemsPerPage:number=null;

    @observable
    projectTimeTrackerFrom:number=null;

    @observable
    orderItem: string = 'project_time_tracker.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    totalItems: number = null;

    @observable
    projectTimeTrackerTotalItems:number=null;

    @observable
    from: number = null;
    
    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    selectedTimeTrackerId: number =null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProjectTimeTrackerCurrentPage(current_page: number) {
        this.projectTimeTrackerCurrentPage = current_page;
    }

    @action
    setTimeTrackerList(response: TimeTrackerPaginationResponse) {
        this._timeTrackers = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setProjectTimeTrackerDetails(response: ProjectTimeTrackerPaginationResponse) {
        this.projectTimeTrackers = response.data;
        this.projectTimeTrackerCurrentPage = response.current_page;
        this.projectTimeTrackerItemsPerPage = response.per_page;
        this.projectTimeTrackerTotalItems = response.total;
        this.projectTimeTrackerFrom = response.from;
        this.projectTimeTrackerLoaded = true;
    }

    @action
    setTimeTrackerActivity(response: TimeTrackerActivityPaginationResponse) {
        this.timeTrackersActivity = response.data;
    }

    @action
    setProjectTitle(title) {
        this.projectTitle = title;
    }
    @action
    setIndiviualTimeTrackerDetails(response: IndividualTimeTrackerDetails)
    {
        this.activities=response.by_activities;
        this.users=response.by_users;
        this.projectTime=response.project_time;
        this.individualLoaded=true;
    }


    @computed
    get timeTrackerList():TimeTracker[]{
        return this._timeTrackers.slice();
    }

    @action
    unsettimeTrackerList(){
        this._timeTrackers = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    unsetProjectTimeTrackerList(){
        this.projectTimeTrackers = [];
        this.projectTimeTrackerCurrentPage = 1;
        this.projectTimeTrackerLoaded = false;
    }

    @action
    unsetTimeTrackerIndiviualDetails(){
        this.activities = [];
        this.users=[];
        this.projectTime=[];
        this.individualLoaded = false;
        this.projectTitle=''
    }



}

export const TimeTrackerStore = new Store();