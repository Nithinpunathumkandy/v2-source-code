import { observable, action, computed } from "mobx-angular";
import {ProjectTheme,ProjectThemePaginationResponse,ProjectThemeSingle} from '../../../core/models/masters/project-monitoring/project-theme'

class Store{
    @observable 
    private _projectTheme:ProjectTheme[]=[];

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
    individualProjectTheme: ProjectThemeSingle;

    @observable
    orderItem: string = 'project_theme_language.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedProjectTheme: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setProjectTheme(response:ProjectThemePaginationResponse){
        this._projectTheme=response.data;
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
    updateProjectTheme(ProjectTheme: ProjectTheme) {
        const projectTheme: ProjectTheme[] = this._projectTheme.slice();
        const index: number = projectTheme.findIndex(e => e.id == ProjectTheme.id);
        if (index != -1) {
            ProjectTheme[index] = ProjectTheme;
            this._projectTheme = projectTheme;
        }
    }
    @action
    setIndividualProjectTheme(projectTheme: ProjectThemeSingle) {
       
        this.individualProjectTheme = projectTheme;
        this.individualLoaded = true;
        
    }

    @computed
    get projectTheme(): ProjectTheme[] {
        
        return this._projectTheme.slice();
    }

    @action
    getProjectThemeById(id: number): ProjectTheme {
        return this._projectTheme.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprojectTheme(projectThemeId: number){
        this.lastInsertedProjectTheme = projectThemeId;
    }

    get lastInsertedprojectTheme():number{
        if(this.lastInsertedProjectTheme) 
            return this.lastInsertedProjectTheme;
        else 
            return null;
    }
    get individualProjectThemeId(){
        return this.individualProjectTheme;
    } 

}

export const ProjectThemeMasterStore = new Store();