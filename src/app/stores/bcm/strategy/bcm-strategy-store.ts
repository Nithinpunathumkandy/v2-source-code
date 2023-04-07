import { observable, action, computed } from "mobx-angular";
import {Strategies , StrategiesPaginationResponse , StrategiesHistoryResponse} from 'src/app/core/models/bcm/bcm-strategy/strategy';
class Store {
    @observable
    private _strategies: Strategies[] = [];

    private _finances;

    private _solutions;

    @observable
    _singleStrategies;


    @observable 
    loaded:boolean=false;

    finance_loaded : boolean = false;

    solutions_loaded: boolean = false;
    single_loaded: boolean = false;


    @observable
    currentPage: number = 1;
    historyPage: number = 1;

    @observable
    new_strategy_id: number = null;

    showId: number = null;

    @observable
    itemsPerPage: number = null;
    historyPerPage: number = null;

    @observable
    orderItem: string = 'business_continuity_strategies.reference_code';

    @observable
    totalItems: number = null;
    historyTotalItems: number = null;

    @observable
    from: number = null;
    historyFrom: number = null;

    @observable
    last_page: number = null;
    history_last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    commentForm:boolean=false;

    @observable
    type: string;

    @observable
    selectedId:number = null;

    @observable
    workFlowHistory = []
    workflowHistoryLoaded: boolean = false;

    @observable
    lastInsertedId: number = null;

    searchText: string;
    Workflow: any;
    workflowLoaded: boolean = false;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setStrategies(response: StrategiesPaginationResponse) {
        

        this._strategies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    unsetBcs(){
        this._strategies = [];
        this.loaded = false;
    }

    @action
    setAllStrategies(strategies: Strategies[]) {
       
        this._strategies = strategies;
        this.loaded = true;
        
    }

    @action
    setStrategy(res){
        this._singleStrategies = res;
        this.single_loaded = true;
    }

    @computed
    get BcmDetails(){
        return this._singleStrategies;
    }

    @action
    unsetDetails(){
        this.single_loaded = false;
        this._singleStrategies = null;
    }

    @action
    setBcmFinance(res){
        this._finances = res;
        this.finance_loaded = true;
    }

    @action
    setWorkflow(workflow){
        this.Workflow = workflow;
        this.workflowLoaded = true;
    }

    @action
    setWorkflowHistory(history : StrategiesHistoryResponse){
        this.workFlowHistory = history.data;
        this.historyPage = history.current_page;
        this.historyPerPage = history.per_page;
        this.historyTotalItems = history.total;
        this.historyFrom = history.from;
        this.workflowHistoryLoaded = true;
    }

    @computed

    get BcmHistory(){
        return this.workFlowHistory;
    }
    


    @action
    setBcmSolutions(res){
        this._solutions = res;
        this.solutions_loaded = true;
    }

    @computed

    get BcmSolutions(){
        return this._solutions;
    }
    

    @computed

    get BcmFinances(){
        return this._finances;
    }
    
    @computed
    get allItems(): Strategies[] {
        
        return this._strategies.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getStrategiesById(id: number): Strategies {
        return this._strategies.slice().find(e => e.id == id);
    }
  
}

export const BcmStrategyStore = new Store();

