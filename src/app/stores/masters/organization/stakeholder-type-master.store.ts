import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { StakeholderType,StakeholderTypePaginationResponse} from 'src/app/core/models/masters/organization/stakeholder-type';

class Store {
    @observable
    private _stakeholderTypes: StakeholderType[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'stakeholder_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setStakeholderTypes(response: StakeholderTypePaginationResponse) {
        this._stakeholderTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    setAllStakeholderTypes(types: StakeholderType[]) {
        this.loaded = true;
        this._stakeholderTypes = types;
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
    updateStakeholderType(type: StakeholderType) {
        const types: StakeholderType[] = this._stakeholderTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._stakeholderTypes=types;
        }
    }

    @computed
    get stakeholderTypes(): StakeholderType[] {
        
        return this._stakeholderTypes.slice();
    }

    @action
    getTypeById(id: number): StakeholderType {
        return this._stakeholderTypes.slice().find(e => e.id == id);
    }

   
}

export const StakeholderTypeMasterStore = new Store();