import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { DesignationZone,DesignationZonePaginationResponse } from 'src/app/core/models/masters/human-capital/designation-zone';

class Store {
    @observable
    private _designationZones: DesignationZone[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'designation_zones.created_at';

    @observable
    from: number = null;

    searchText: string;

    @action
    setDesignationZones(response: DesignationZonePaginationResponse) {
        
        this._designationZones = response.data;
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
    updateDesignationZone(zone: DesignationZone) {
        const zones: DesignationZone[] = this._designationZones.slice();
        const index: number = zones.findIndex(e => e.id == zone.id);
        if (index != -1) {
            zones[index] = zone;
            this._designationZones = zones;
        }
    }

    @computed
    get designationZones(): DesignationZone[] {
        
        return this._designationZones.slice();
    }

    @action
    getZoneById(id: number): DesignationZone {
        return this._designationZones.slice().find(e => e.id == id);
    }

}

export const DesignationZoneMasterStore = new Store();