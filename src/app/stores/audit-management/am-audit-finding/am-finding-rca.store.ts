
import { observable, action, computed } from "mobx-angular";

import { RootCauseAnalysis,RootCauseAnalysisPaginationResponse } from 'src/app/core/models/risk-management/risks/root-cause-analyses';



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
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @observable
    rcaDataLength: number = null;
    
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

export const AmFindingRCAStore = new Store();
