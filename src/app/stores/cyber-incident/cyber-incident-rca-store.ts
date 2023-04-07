
import { observable, action, computed } from "mobx-angular";

import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/external-audit/root-cause-analysis/root-cause-analysis';



class Store {
    @observable
    private _rca: RootCauseAnalysis[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    @observable
    totalItems: number = null;

    @observable
    rcaDataLength: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setRCA(response: RootCauseAnalysisPaginationResponse) {
        

        this._rca = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllRCA(rca: RootCauseAnalysis[]) {
       
        this._rca = rca;
        this.loaded = true;
        
    }
    
    @action
    unsetRCA() {   
        this._rca = [];
        this.loaded = false;   
    }

    @computed
    get allItems(): RootCauseAnalysis[] {
        
        return this._rca.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRCAById(id: number): RootCauseAnalysis {
        return this._rca.slice().find(e => e.id == id);
    }
  
}

export const CyberIncidentRCAStore = new Store();

