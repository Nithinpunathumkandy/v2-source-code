
import { number } from '@amcharts/amcharts4/core';
import { observable, action, computed } from 'mobx-angular';
import { Initiatives, Milestone, StrategyInitiativeResponse, InduvalInitiative } from 'src/app/core/models/strategy-management/initiative.model';
import { historyData, historyPaginationData } from 'src/app/core/models/strategy-management/strategy.model';

class Store {
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'strategy.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    loaded: boolean = false;

    @observable
    _stratergyInitiatives:Initiatives[] = []

    @observable
    _selectedInitiativeId :number

    @observable
    _selectedMilestoneId :number;

    @observable
    _actionPlans = []

    @observable
    _milestones : Milestone[] = []

    @observable
    _induvalInitiative : InduvalInitiative = null;

    @observable
    induvalInitiativeLoaded = false;

    @observable
    mileStonesLoaded = false;

    @observable
    selectedStrartDate = null;

    @observable
    selectedEndDate = null;

    @observable
    is_mileStoneReq:number = 1;

    @observable
    is_actionPlan : boolean = false;

    @observable
    mileStoneStartDate = null;

    @observable
    mileStoneEndDate = null;

    @observable
    profilemileStoneStartDate = null;

    @observable
    profilemileStoneEndDate = null;

    @observable
    historyItem: historyData[] = [];
  
    @observable
    historyLoaded: boolean = false;
  
    @observable
    historyCurrentPage: number = 1;
  
    @observable
    historyItemsPerPage: number = null;
  
    @observable
    historyTotalItems: number = null;
    
    @observable
    modalFrom: string;
    
  @action
  setCurrentPage(current_page: number) {
      this.currentPage = current_page;
  }
  @action
  setOrderBy(order_by: 'asc' | 'desc') {
      this.orderBy = order_by;
  }

    @action
    setProfiles(response: StrategyInitiativeResponse) { 
        this._stratergyInitiatives = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @computed
    get allItems(): Initiatives[] {
        return this._stratergyInitiatives.slice();
    }

    @action
    unsetInitiatives(){
        this.loaded = false;
    this._stratergyInitiatives= [];
    }

    @action
    setInitiativeId(id:number){
        this._selectedInitiativeId = id 
    }

    get selectedInitiativeId(){
        return this._selectedInitiativeId
    }

    @action
    setActionPlan(item){
    this._actionPlans= item.data;
    }

    get actionPlans(){
        return this._actionPlans
    }

    @action
    unsetActionPlan(){
    this._actionPlans= [];
    }

    @action
    setMilestones(mileSStones:Milestone[]){
        this._milestones = mileSStones
        this.mileStonesLoaded = true
    }

    get milesstones(){
        return this._milestones
    }

    @action
    unsetMilestones(){
        this._milestones = []
        this.mileStonesLoaded = false
    }

    @action
    setInduvalInitiative(res:InduvalInitiative){
     this._induvalInitiative = res
     this.induvalInitiativeLoaded = true
    }
    
    @action
    unsetInduvalInitiative(){
     this._induvalInitiative = null
     this.induvalInitiativeLoaded = false
    }

    get induvalInitiative() {
        return this._induvalInitiative
    }

    @action
    setHistory(response: historyPaginationData) {
        this.historyItem = response.data;
        this.historyCurrentPage = response.current_page;
        this.historyItemsPerPage = response.per_page;
        this.historyTotalItems = response.total;
        this.historyLoaded = true;
    }

    @computed
    get historyData():historyData[]{
        return this.historyItem;
    }

    @action
    unsetHistory() {
        this.historyItem = null;
        this.historyLoaded = false;
    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.historyCurrentPage = current_page;
    }

}
export const StrategyInitiativeStore = new Store();