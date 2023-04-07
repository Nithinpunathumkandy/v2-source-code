import { observable, action, computed } from "mobx-angular";
import { KPITypes, KPITypesPaginationResponse } from "src/app/core/models/masters/strategy/kpi-types.model";
class Store {
    @observable
    private _kpiTypes: KPITypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'kpi_types_title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setKPITypes(response: KPITypesPaginationResponse) {
        

        this._kpiTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllKPITypes(KPITypes: KPITypes[]) {
       
        this._kpiTypes = KPITypes;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): KPITypes[] {
        
        return this._kpiTypes.slice();
    }

}
export const KPITypesMasterStore = new Store();