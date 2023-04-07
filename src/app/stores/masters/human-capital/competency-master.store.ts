import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Competency, CompetencyPaginationResponse } from 'src/app/core/models/masters/human-capital/competency';

class Store {
    @observable
    private _competencies: Competency[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'competencies.created_by';

    @observable
    from: number = null;

    @observable
    loaded: boolean = false;

    searchText: string;
  
    @observable
    lastInsertedId: number = null;

    @action
    setCompetencies(response: CompetencyPaginationResponse) {
        this._competencies = response.data;
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
    updateCompetency(competency: Competency) {
        const competencies: Competency[] = this._competencies.slice();
        const index: number = competencies.findIndex(e => e.id == competency.id);
        if (index != -1) {
            competencies[index] = competency;
            this._competencies = competencies;
        }
    }

    @computed
    get competencies(): Competency[] {

        return this._competencies.slice();
    }

    @action
    getCompetencyById(id: number): Competency {
        return this._competencies.slice().find(e => e.id == id);
    }

    
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}

export const CompetencyMasterStore = new Store();