import { action, observable, computed } from "mobx-angular";
import { Milestone, MilestoneHistory, MilestonResponse, IndivitualMilestones } from 'src/app/core/models/event-monitoring/events/event-monitoring-modal';
class Store {
    @observable
    _milestones : Milestone[] = [];

    @observable
    _milestoneHistory : MilestoneHistory[] = []

    @observable
    mileStonesLoaded = false;

    @observable
    currentPage: number = 1;

    @observable 
    _indivitualMilestones = null;

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'event_milestone.title';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setMilestones(mileSStones:Milestone[]){
        this._milestones = mileSStones
        this.mileStonesLoaded = true
    }

    @action
    setmilestone(response: MilestonResponse) {

        this._milestones = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setIndivitualMilestones(indivitual: IndivitualMilestones) {       
    this._indivitualMilestones = indivitual;
    this.individualLoaded = true;
    }
    @action
    unsetIndivitualMilestones() {       
        this._indivitualMilestones = null;
        this.individualLoaded = false;   
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;}

    @computed
        get indivitualMilestones(){
        return this._indivitualMilestones
        }

    @action
        setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
        }
    
    @action
        setMileStoneHistory(data:MilestoneHistory[]){
            this._milestoneHistory = data;  
        }
    
    get milesstonesHistory(){
            return this._milestoneHistory
        }

    @action
        updateMilestone(type: Milestone) {
          const types: Milestone[] = this._milestones.slice();
          const index: number = types.findIndex(e => e.id == type.id);
            if (index != -1) {
                types[index] = type;
                this._milestones = types;
            }
        }


    get milesstones(){
        return this._milestones
    }

    @computed
    get Milestone(): Milestone[] {

        return this._milestones.slice();
    }

    @computed
    get allItems(): Milestone[] {

        return this._milestones.slice();
    }
    
    @action
    getMilestoneById(id: number): Milestone {
        return this._milestones.slice().find(e => e.id == id);
    }

    // @action
    // getMilestonesById(id: number): IndivitualMilestones {
    //     return this._indivitualMilestones.slice().find(e => e.id == id);
    // }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    unsetMilestones() {       
        this._milestones = null;
        this.mileStonesLoaded = false;   
    }

}
export const EventMilestoneStore = new Store();