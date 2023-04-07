import { observable, action, computed } from 'mobx-angular';
import { Milestone, ProjectDetails, Projects, ProjectsResponse, ScopeOfWork, ExpectedOutcome, Deliverable, StrategicAlignment, ThemeObjective, ScopeOfWorkResponse } from 'src/app/core/models/project-monitoring/project-monitoring.modal';
class Store {

    @observable
    private _projects : Projects [] = []

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'projects.id';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    orderBy: 'desc' | 'asc' = 'desc';

    @observable
    searchText: string;

    @observable
    _individualProjectDetails = null;

    @observable
    _selectedId : number = null;

    // @observable
    //  _milestones : Milestone[] = []

    @observable
    _scopeOfWorks : ScopeOfWork[] = []

    @observable
    _expectedOutcomes : ExpectedOutcome[] = []

    @observable
    _deliverables : Deliverable[] = []

    @observable
    _strategicAlignment  = []

    @observable
    _themeObjective : ThemeObjective[] = []

    @observable
     mileStonesLoaded = false;

    @observable
    scopeOfWorkLoaded = false;

    @observable
    expectedOutcomeLoaded = false;

    @observable
    deliverableLoaded = false;

    @observable
    isBudgeted : boolean

    @observable
    strategicAlignmentLoaded = false;

    @observable
    project_monitoring_select_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedProjectMonitoringForMapping:Projects[]=[]

    addSelectedProjectMonitoring(issues) {
        this.selectedProjectMonitoringForMapping = issues;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }
    @action
    setProjects(response: ProjectsResponse) {
        this._projects = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @computed
    get selectedProjectId(){
        return this._selectedId
    }

    @action 
    setIndividualProjectDetails(res:ProjectDetails){
      this._individualProjectDetails = res
      this.individualLoaded = true
    }

    @action
    setSelectedProjectId(id:number){
        this._selectedId = id
    }

    // @action
    // setMilestones(mileSStones:Milestone[]){
    //     this._milestones = mileSStones
    //     this.mileStonesLoaded = true
    // }


    @action
    setScopeOfWorks(scopeOfWorks:ScopeOfWorkResponse){
        this._scopeOfWorks = scopeOfWorks.data
        this.scopeOfWorkLoaded = true
    }

    @action
    setExpectedOutcomes(expectedOutcomes:ExpectedOutcome[]){
        this._expectedOutcomes = expectedOutcomes
        this.expectedOutcomeLoaded = true
    }

    @action
    setDeliverables(deliverables:Deliverable[]){
        this._deliverables = deliverables
        this.deliverableLoaded = true
    }
    
    @action
    setStrategicAlignments(data){
        this._strategicAlignment = data
        this.strategicAlignmentLoaded = true
    }

      
    @action
    setThemeObjectives(data:ThemeObjective[]){
        this._themeObjective = data
        // this.strategicAlignmentLoaded = true
    }


    @computed
    get themeObjective(): ThemeObjective[] {
        return this._themeObjective;
    }

    @computed
    get strategicAlignment() {
        return this._strategicAlignment;
    }

    @computed
    get scopeOfWorks(): ScopeOfWork[] {
        return this._scopeOfWorks;
    }

    @computed
    get expectedOutcomes(): ExpectedOutcome[] {
        return this._expectedOutcomes;
    }

    @computed
    get deliverables(): Deliverable[] {
        return this._deliverables;
    }
    
    @computed
    get individualDetails(): ProjectDetails {
        return this._individualProjectDetails;
    }

    // get milesstones(){
    //     return this._milestones
    // }


    @computed
    get allItems(): Projects[] {
        return this._projects.slice();
    }
  
}
export const ProjectMonitoringStore = new Store();