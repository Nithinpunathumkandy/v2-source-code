import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { CompetencyGroup,CompetencyGroupPaginationResponse } from 'src/app/core/models/masters/human-capital/competency-group';

class Store {
    @observable
    private _competencyGroups: CompetencyGroup[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'competency_groups.created_at';

    @observable
    from: number = null;

    @observable
    loaded: boolean = false;

    searchText: string;

    @action
    setCompetencyGroups(response: CompetencyGroupPaginationResponse) {
        
        this._competencyGroups = response.data;
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
    updateCompetencyGroup(group: CompetencyGroup) {
        const groups: CompetencyGroup[] = this._competencyGroups.slice();
        const index: number = groups.findIndex(e => e.id == group.id);
        if (index != -1) {
            groups[index] = group;
            this._competencyGroups = groups;
        }
    }

    @computed
    get competencyGroups(): CompetencyGroup[] {
        
        return this._competencyGroups.slice();
    }

    @action
    getCompetencyById(id: number): CompetencyGroup {
        return this._competencyGroups.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}

export const CompetencyGroupMasterStore = new Store();