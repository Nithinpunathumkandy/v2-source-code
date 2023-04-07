
import { observable, action, computed } from "mobx-angular";

import { ByLeader} from 'src/app/core/models/internal-audit/chart/by_leader/by_leader';


class Store {
    @observable
    private _by_leaders: ByLeader[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'auditors_title';

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
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    // @action
    // setAvailableAuditor(response: AvailableAuditorsPaginationResponse) {
        

    //     this._availableAuditors = response.data;
    //     this.currentPage = response.current_page;
    //     this.itemsPerPage = response.per_page;
    //     this.totalItems = response.total;
    //     this.from = response.from;
    //     this.loaded = true;
       
    // }

    @action
    setAllByLeaderChart(leader: ByLeader[]) {
       
        this._by_leaders = leader;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ByLeader[] {
        
        return this._by_leaders.slice();
    }
   

    
  
}

export const ByLeaderChartStore = new Store();

