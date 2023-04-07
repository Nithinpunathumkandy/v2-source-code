import { ProjectRoles, ProjectRolesRespones } from 'src/app/core/models/masters/project-management/project-roles';
import { action, computed, observable } from 'mobx-angular';

class Store {
    
    @observable
    private _projectRoles:ProjectRoles[]=[];
    
    @observable
    currentPage:number=1;

    @observable
    itemsPerPage:number=null;

    @observable
    totalItems:number=null;

    @observable
    loaded:boolean=false;
    
    @observable
    from:number=null;

    @observable
    lastInsertedId: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualProjectRoles: ProjectRoles;

    searchText: string;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'project_roles.created_at';

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProjectRoles(response: ProjectRolesRespones) {
        
        this._projectRoles = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;  
    }

    @computed
    get allItems(): ProjectRoles[] {
        return this._projectRoles.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    setIndividualProjectRoles(projectRoles: ProjectRoles) {
        this.individualProjectRoles = projectRoles;
        this.individualLoaded = true; 
    }

    @action
    getProjectRolesById(id: number): ProjectRoles {
        return this._projectRoles.slice().find(e => e.id == id);
    }

}
export const ProjectRolesMasterStore = new Store;