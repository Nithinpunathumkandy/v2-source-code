import { observable, action, computed } from "mobx-angular";
import { ProjectAssistantManagers, ProjectManagers, ProjectMembers } from "src/app/core/models/project-management/project-details/project-team/project-team";


class Store {

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_team_title.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    _projectManahers: ProjectManagers;

    @observable
    _projectAssistantManagers: ProjectAssistantManagers;

    @observable
    _ProjectMembers: ProjectMembers;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    selectedIncidentId: number

    @observable
    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setProjectManagers(indivitual: ProjectManagers) {       
    this._projectManahers = indivitual;
    this.individualLoaded = true;
    
    }

    @action
    setProjectAssistantManagers(indivitual: ProjectAssistantManagers) {       
    this._projectAssistantManagers = indivitual;
    this.individualLoaded = true;
    }

    @action
    setProjectMembers(indivitual: ProjectMembers) {       
    this._ProjectMembers = indivitual;
    this.individualLoaded = true;
    }


    @computed
    get projectManagers(){
        return this._projectManahers
    }

    @computed
    get projectAssistantManagers(){
        return this._projectAssistantManagers
    }

    @computed
    get projectMembers(){
        return this._ProjectMembers
    }

    @action
    unsetProjectManagers() {       
        this._projectManahers = null;
        this.individualLoaded = false;   
    }

    @action
    unsetProjectAssistantManagers() {       
        this._projectAssistantManagers = null;
        this.individualLoaded = false;   
    }

    @action
    unsetProjectMembers() {       
        this._ProjectMembers = null;
        this.individualLoaded = false;   
    }
  
}


export const ProjectTeamStore = new Store();

