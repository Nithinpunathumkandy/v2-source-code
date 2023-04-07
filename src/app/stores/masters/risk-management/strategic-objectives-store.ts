import { observable, action, computed } from "mobx-angular";
import { Strategic , StrategicObjectivesPaginationResponse } from 'src/app/core/models/masters/risk-management/strategic-objectives';

class Store{

    @observable
    private _strategicObjectives: Strategic[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualStrategic: Strategic;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'strategic_objectives.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    selectedStrategic:Strategic[]=[]

    @observable
  saveSelected: boolean = false;

  @observable
  objective_select_form_modal:boolean=false;

  addSelectedLocation(issues){
    this.selectedStrategic = issues;
}

    searchText: string;

    @action
    setStrategicObjectives(response: StrategicObjectivesPaginationResponse) {
        
        this._strategicObjectives = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetStrategicObjectives() {   
        this._strategicObjectives = [];
        this.loaded = true;
    }

    @action
    setAllStrategic(strategy: Strategic[]) {
       
        this._strategicObjectives = strategy;
        this.loaded = true;
        
    }

    @action
    setIndividualStrategic(strategy: Strategic) {
       
        this.individualStrategic = strategy;
        this.individualLoaded = true;
        
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    @computed
    get allItems(): Strategic[] {
        return this._strategicObjectives.slice();
    }

    @action
    updateStrategic(type: Strategic) {
        const types: Strategic[] = this._strategicObjectives.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._strategicObjectives=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getStrategicById(id: number): Strategic {
        return this._strategicObjectives.slice().find(e => e.id == id);
    }

    get individualKeyRiskId(){
        return this.individualStrategic;
    } 
}
export const StrategicObjectivesMasterStore = new Store();