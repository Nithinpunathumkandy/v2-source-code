import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { listStyleType, ProjectListDatum, ProjectListResponse, SubProject } from 'src/app/core/models/project-management/projects/projects';
class Store {
    @observable
    _projectList: ProjectListDatum[] = [];

    @observable
    private _individualActivityDetails : ProjectListDatum;

    @observable
    editFlag: boolean = false;

    @observable
    pinnedProjects:ProjectListResponse;

    @observable
    SubProjects: SubProject[] = [];

    @observable
    loaded: boolean = false;

    @observable
    is_loading:boolean = false;

    @observable
    is_subproject_loading: boolean = false;

    @observable
    from: number;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    project_id: number;

    @observable
    individual_project_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    listStyle: listStyleType = 'table';
    preview_url: string;

    @observable
    _selectedId : number = null;
    
    @observable
    currentSubProjectIndex = null;

    @observable
    selectedProjectID;
    

    @observable
    private _documentDetails: Image = null;
    _imageDetails: Image;
    selected_preview_url: any;

    @observable
    logo_preview_available = false;

    @observable
    project_preview_available = false;

    @observable
    saveSelected: boolean = false;

    @observable
    project_management_select_form_modal:boolean=false;

    @observable
    selectedProjectManagmentForMapping:ProjectListDatum[]=[]

    addSelectedProjectManagement(issues) {
        this.selectedProjectManagmentForMapping = issues;
    }

    @action
    setProjectDetails(response: ProjectListResponse) {
        this._projectList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateProject(project: ProjectListDatum) {
        const projects: ProjectListDatum[] = this._projectList.slice();
        const index: number = projects.findIndex(e => e.id == project.id);
    }


    @computed
    get projectList(): ProjectListDatum[] {

        return this._projectList.slice();
    }

    @action
    clearDocument() {
        this._documentDetails = null;
    }

    @action
    setDocumentImageDetails(details, url: string) {
       
            this._documentDetails = details;
            this.preview_url = url;
        
    }
    
    @action
    unsetDocumentImageDetails() {
            if (this._documentDetails.hasOwnProperty('is_new')) {
                this._documentDetails = null;
                this.preview_url = null;
            }
            else {
                this._documentDetails['is_deleted'] = true;             
            }        
    }

  

    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }


    clearPreviewDetails(){
        this.preview_url = null;
    }


    @action
    setSubProjects(res){
        this.SubProjects = res;
    }
    @action
    unsetProjectList()
    {
        this._projectList=[];
        this.loaded=false;
    }

    @computed
    get selectedProjectId(){
        return this._selectedId
    }

    @computed
    get getSubProjects(){
        return this.SubProjects;
    }

    @action
    setSelectedProjectId(id:number){
        this._selectedId = id
    }

    get documentImage() {
        return this._documentDetails;
    }

    @action
    setPinnedProjects(res){
        this.pinnedProjects = res;
    }

    @computed
    get getPinnedProjects(){
        return this.pinnedProjects;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setProjectActivityDetails(details: ProjectListDatum) {
        this.loaded = true;
        this._individualActivityDetails = details;
    }

    @action
    unsetsetProjectActivityDetails() {
        this.loaded = false;
        this._individualActivityDetails = null;
    }
    
    @computed
    get individualProjectActivityDetails(): ProjectListDatum {
        return this._individualActivityDetails;
    }

    //**Detials


}

export const ProjectsStore = new Store();