import { observable, action, computed } from "mobx-angular";
import {ProjectPriority,ProjectPriorityPaginationResponse,ProjectPrioritySingle} from '../../../core/models/masters/project-monitoring/project-priority'

class Store{
    @observable 
    private _projectPriority:ProjectPriority[]=[];

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
    individualLoaded: boolean = false;

    @observable
    individualProjectPriority: ProjectPrioritySingle;

    @observable
    orderItem: string = 'project_priority_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedProjectPriority: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setProjectPriority(response:ProjectPriorityPaginationResponse){
        this._projectPriority=response.data;
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

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateProjectPriority(ProjectPriority: ProjectPriority) {
        const projectPriority: ProjectPriority[] = this._projectPriority.slice();
        const index: number = projectPriority.findIndex(e => e.id == ProjectPriority.id);
        if (index != -1) {
            ProjectPriority[index] = ProjectPriority;
            this._projectPriority = projectPriority;
        }
    }
    @action
    setIndividualProjectPriority(projectPriority: ProjectPrioritySingle) {
       
        this.individualProjectPriority = projectPriority;
        this.individualLoaded = true;
        
    }

    @computed
    get projectPriority(): ProjectPriority[] {
        
        return this._projectPriority.slice();
    }

    @action
    getProjectPriorityById(id: number): ProjectPriority {
        return this._projectPriority.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprojectPriority(projectPriorityId: number){
        this.lastInsertedProjectPriority = projectPriorityId;
    }

    get lastInsertedprojectPriority():number{
        if(this.lastInsertedProjectPriority) 
            return this.lastInsertedProjectPriority;
        else 
            return null;
    }
    get individualProjectPriorityId(){
        return this.individualProjectPriority;
    } 

}

export const ProjectPriorityMasterStore = new Store();