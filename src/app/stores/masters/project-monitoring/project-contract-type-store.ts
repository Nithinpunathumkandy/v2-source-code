import { observable, action, computed } from "mobx-angular";
import {ProjectContractType,ProjectContractTypePaginationResponse,ProjectContractTypeSingle} from '../../../core/models/masters/project-monitoring/project-contract-type'

class Store{
    @observable 
    private _projectContractType:ProjectContractType[]=[];

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
    individualProjectContractType: ProjectContractTypeSingle;

    @observable
    orderItem: string = 'project_contract_type_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedProjectContractType: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setProjectContractType(response:ProjectContractTypePaginationResponse){
        this._projectContractType=response.data;
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
    updateProjectContractType(ProjectContractType: ProjectContractType) {
        const projectContractType: ProjectContractType[] = this._projectContractType.slice();
        const index: number = projectContractType.findIndex(e => e.id == ProjectContractType.id);
        if (index != -1) {
            ProjectContractType[index] = ProjectContractType;
            this._projectContractType = projectContractType;
        }
    }
    @action
    setIndividualProjectContractType(projectContractType: ProjectContractTypeSingle) {
       
        this.individualProjectContractType = projectContractType;
        this.individualLoaded = true;
        
    }

    @computed
    get projectContractType(): ProjectContractType[] {
        
        return this._projectContractType.slice();
    }

    @action
    getProjectContractTypeById(id: number): ProjectContractType {
        return this._projectContractType.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprojectContractType(projectContractTypeId: number){
        this.lastInsertedProjectContractType = projectContractTypeId;
    }

    get lastInsertedprojectContractType():number{
        if(this.lastInsertedProjectContractType) 
            return this.lastInsertedProjectContractType;
        else 
            return null;
    }
    get individualProjectContractTypeId(){
        return this.individualProjectContractType;
    } 

}

export const ProjectContractTypeMasterStore = new Store();