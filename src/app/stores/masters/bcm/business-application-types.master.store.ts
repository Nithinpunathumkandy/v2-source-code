import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { BusinessApplicationTypes, BusinessApplicationTypesPaginationResponse } from "src/app/core/models/masters/bcm/business-application-type";

class Store {
    @observable
    private _businessApplicationTypes: BusinessApplicationTypes[] = [];

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
    orderItem: string = 'business_application_type_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setBusinessApplicationTypes(response: BusinessApplicationTypesPaginationResponse) {

        this._businessApplicationTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllBusinessAppType(res: BusinessApplicationTypes[]) {
        this._businessApplicationTypes = res;
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
    updateBusinessApplicationTypes(type: BusinessApplicationTypes) {
        const types: BusinessApplicationTypes[] = this._businessApplicationTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._businessApplicationTypes = types;
        }
    }

    @computed
    get businessApplicationTypes(): BusinessApplicationTypes[] {

        return this._businessApplicationTypes.slice();
    }
    @computed
    get allItems(): BusinessApplicationTypes[] {

        return this._businessApplicationTypes.slice();
    }

    @action
    getBusinessApplicationTypesById(id: number): BusinessApplicationTypes {
        return this._businessApplicationTypes.slice().find(e => e.id == id);
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

export const BusinessApplicationTypesMasterStore = new Store();