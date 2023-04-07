import { observable, action, computed } from "mobx-angular";
import { Stakeholder, StakeholderPaginationResponse } from "src/app/core/models/project-monitoring/project-monitoring.modal";

class Store {
    @observable
    private _stakeholder: Stakeholder[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'stakeholder.title';

    @observable
    from: number = null;

    @observable
    _selectedId : number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @computed
    get selectedProjectId(){
        return this._selectedId
    }

    @action
    setSelectedProjectId(id:number){
        this._selectedId = id
    }

    @action
    setStakeholder(response: StakeholderPaginationResponse) {

        this._stakeholder = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    updateStakeholder(type: Stakeholder) {
        const types: Stakeholder[] = this._stakeholder.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._stakeholder = types;
        }
    }

    @computed
    get Stakeholder(): Stakeholder[] {

        return this._stakeholder.slice();
    }
    @computed
    get allItems(): Stakeholder[] {

        return this._stakeholder.slice();
    }

    @action
    getStakeholderById(id: number): Stakeholder {
        return this._stakeholder.slice().find(e => e.id == id);
    }

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

}

export const StakeholderStore = new Store();