import { observable, action, computed } from 'mobx-angular';
import { Milestone, EventDetails, Events, EventsResponse, ScopeOfWork, ExpectedOutcome, Deliverable, StrategicAlignment, ThemeObjective, ScopeOfWorkResponse } from 'src/app/core/models/event-monitoring/events/event-monitoring-modal';
class Store {

    @observable
    private _events : Events [] = []

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'events.id';

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
    _individualEventDetails = null;

    @observable
    _selectedId : number = 1;

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

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }
    @action
    setEvents(response: EventsResponse) {
        this._events = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @computed
    get selectedEventId(){
        return this._selectedId
    }

    @action 
    setIndividualEventDetails(res:EventDetails){
      this._individualEventDetails = res
      this.individualLoaded = true
    }

    @action
    setSelectedEventId(id:number){
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
        this.currentPage = scopeOfWorks.current_page;
        this.itemsPerPage = scopeOfWorks.per_page;
        this.totalItems = scopeOfWorks.total;
        this.scopeOfWorkLoaded = true
        this.from = scopeOfWorks.from;
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
    get individualDetails(): EventDetails {
        return this._individualEventDetails;
    }

    // get milesstones(){
    //     return this._milestones
    // }


    @computed
    get allItems(): Events[] {
        return this._events.slice();
    }
  
}
export const EventMonitoringStore = new Store();