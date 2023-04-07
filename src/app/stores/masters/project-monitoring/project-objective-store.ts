import { observable, action, computed } from "mobx-angular";
import {ProjectObjective,ProjectObjectivePaginationResponse,ProjectObjectiveSingle} from '../../../core/models/masters/project-monitoring/project-objective'

class Store{
    @observable 
    private _projectObjective:ProjectObjective[]=[];

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
    individualProjectObjective: ProjectObjectiveSingle;

    @observable
    orderItem: string = 'project_objective_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedProjectObjective: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setProjectObjective(response:ProjectObjectivePaginationResponse){
        this._projectObjective=response.data;
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
    updateProjectObjective(ProjectObjective: ProjectObjective) {
        const projectObjective: ProjectObjective[] = this._projectObjective.slice();
        const index: number = projectObjective.findIndex(e => e.id == ProjectObjective.id);
        if (index != -1) {
            ProjectObjective[index] = ProjectObjective;
            this._projectObjective = projectObjective;
        }
    }
    @action
    setIndividualProjectObjective(projectObjective: ProjectObjectiveSingle) {
       
        this.individualProjectObjective = projectObjective;
        this.individualLoaded = true;
        
    }

    @computed
    get projectObjective(): ProjectObjective[] {
        
        return this._projectObjective.slice();
    }

    @action
    getProjectObjectiveById(id: number): ProjectObjective {
        return this._projectObjective.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprojectObjective(projectObjectiveId: number){
        this.lastInsertedProjectObjective = projectObjectiveId;
    }

    get lastInsertedprojectObjective():number{
        if(this.lastInsertedProjectObjective) 
            return this.lastInsertedProjectObjective;
        else 
            return null;
    }
    get individualProjectObjectiveId(){
        return this.individualProjectObjective;
    } 

}

export const ProjectObjectiveMasterStore = new Store();