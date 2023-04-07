
import { observable, action, computed } from "mobx-angular";
import { Sites,SitesPaginationResponse } from 'src/app/core/models/masters/general/sites';


class Store {
    @observable
    private _sites: Sites[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'sites_title';

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
    saveSelected: boolean = false;

    selectedSites: Sites[] = [];

    siteMappingModal: boolean = false;

    addSelectedSites(sites){
        this.selectedSites = sites;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSites(response: SitesPaginationResponse) {
        this._sites = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllSites(sites: Sites[]) {
        this._sites = sites;
        this.loaded = true;
    }
    
    @computed
    get allItems(): Sites[] {
        return this._sites.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getSiteById(id: number): Sites {
        return this._sites.slice().find(e => e.id == id);
    }
  
}

export const SitesMasterStore = new Store();

