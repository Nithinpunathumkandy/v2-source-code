import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { PhysicalConditionRankings, PhysicalConditionRankingsPaginationResponse } from "src/app/core/models/masters/asset-management/physical-condition-rankings";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";

class Store {
    @observable
    private _physicalConditionRankings: PhysicalConditionRankings[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;
   
    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'physical_condition_rankings.created_at';

    @observable
    from: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    PhysicalConditionRankingsDetails :any;

    searchText: string;

    @action
    setPhysicalConditionRankings(response: PhysicalConditionRankingsPaginationResponse) {
        
        this._physicalConditionRankings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllPhysicalConditionRankings(PhysicalConditionRankings: PhysicalConditionRankings[]) {
       
        this._physicalConditionRankings = PhysicalConditionRankings;
        this.loaded = true;
        
    }

    @action
    updatePhysicalConditionRankings(type: PhysicalConditionRankings) {
        // const types: BusinessApplications[] = this._businessApplications.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._businessApplications = types;
        // }
        this.PhysicalConditionRankingsDetails=type
    }


    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }


    @computed
    get allItems(): PhysicalConditionRankings[] {
        return this._physicalConditionRankings.slice();
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

export const PhysicalConditionRankingsMasterStore = new Store();