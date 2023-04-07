import { observable, action, computed } from "mobx-angular";
import {ProjectKpi,ProjectKpiPaginationResponse,ProjectKpiSingle} from 'src/app/core/models/masters/project-monitoring/project-kpi';

class Store{
    @observable 
    private _projectKpi:ProjectKpi[]=[];

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
    individualProjectKpi: ProjectKpiSingle;

    @observable
    orderItem: string = 'project_kpi_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedProjectKpi: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setProjectKpi(response:ProjectKpiPaginationResponse){
        this._projectKpi=response.data;
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
    updateProjectKpi(ProjectKpi: ProjectKpi) {
        const projectKpi: ProjectKpi[] = this._projectKpi.slice();
        const index: number = projectKpi.findIndex(e => e.id == ProjectKpi.id);
        if (index != -1) {
            ProjectKpi[index] = ProjectKpi;
            this._projectKpi = projectKpi;
        }
    }
    @action
    setIndividualProjectKpi(projectKpi: ProjectKpiSingle) {
       
        this.individualProjectKpi = projectKpi;
        this.individualLoaded = true;
        
    }

    @computed
    get projectKpi(): ProjectKpi[] {
        
        return this._projectKpi.slice();
    }

    @action
    getProjectKpiById(id: number): ProjectKpi {
        return this._projectKpi.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprojectKpi(projectKpiId: number){
        this.lastInsertedProjectKpi = projectKpiId;
    }

    get lastInsertedprojectKpi():number{
        if(this.lastInsertedProjectKpi) 
            return this.lastInsertedProjectKpi;
        else 
            return null;
    }
    get individualProjectKpiId(){
        return this.individualProjectKpi;
    } 

}

export const ProjectKpiMasterStore = new Store();