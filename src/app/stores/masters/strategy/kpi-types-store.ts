import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { KpiTypes, KpiTypesPaginationResponse } from "src/app/core/models/masters/strategy/kpi-types";

class Store {
    
    @observable
    private _kpiTypes: KpiTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'kpi_types.title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

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
    setKpiType(response: KpiTypesPaginationResponse) {
        
        this._kpiTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllKpiTypes(externalAuditTypes: KpiTypes[]) {
        this._kpiTypes = externalAuditTypes;
        this.loaded = true; 
    }
    
    @computed
    get allItems(): KpiTypes[] {
        
        return this._kpiTypes.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getKpiTypeById(id: number): KpiTypes {
        return this._kpiTypes.slice().find(e => e.id == id);
    }
    
    @action
    unsetAllKpiTypes() {
        this._kpiTypes = [];
        this.loaded = false;
    }
}

export const KpiTypesMasterStore = new Store();