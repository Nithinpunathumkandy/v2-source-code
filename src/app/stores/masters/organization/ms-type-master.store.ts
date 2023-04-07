import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MsType,MsTypePaginationResponse, AvailableMsTypes } from 'src/app/core/models/masters/organization/ms-type';
import { retry } from 'rxjs/operators';

class Store {
    @observable
    private _msTypes: MsType[] = [];

    @observable
    private _availableMsTypes: AvailableMsTypes[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'ms_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    last_inserted_id: number = null;

    searchText: string;

    @action
    setMsTypes(response: MsTypePaginationResponse) {
       
        this._msTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
        
    }

    @action
    setAllMsTypes(type: MsType[]) {
       
        this._msTypes = type;
        this.loaded = true;
        
    }

    @action
    setAvailableMsTypes(types: AvailableMsTypes[]){
        this._availableMsTypes = types;
    }

    @action
    updateMsType(type: MsType) {
        const types: MsType[] = this._msTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._msTypes=types;
        }
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get msTypes(): MsType[] {
        
        return this._msTypes.slice();
    }

    @computed
    get availableMsTypes(): AvailableMsTypes[] {
        return this._availableMsTypes.slice();
    }

    @action
    getTypeById(id: number): MsType {
        return this._msTypes.slice().find(e => e.id == id);
    }

    @action setLastInsertedId(id: number){
        this.last_inserted_id = id;
    }

    @computed
    get lastInsertedId():number{
        return this.last_inserted_id;
    }
}

export const MsTypeMasterStore = new Store();