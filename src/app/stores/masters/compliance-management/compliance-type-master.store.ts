import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ComplianceType,ComplianceTypePaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-type';

class Store {
    @observable
    private _complianceTypes: ComplianceType[] = [];

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
    orderItem: string = 'complaince_types.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setComplianceTypes(response: ComplianceTypePaginationResponse) {
        
        this._complianceTypes = response.data;
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
    updateComplianceType(type: ComplianceType) {
        const types: ComplianceType[] = this._complianceTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._complianceTypes=types;
        }
    }

    @computed
    get complianceTypes(): ComplianceType[] {
        
        return this._complianceTypes.slice();
    }
    @computed
    get allItems(): ComplianceType[] {
        
        return this._complianceTypes.slice();
    }

    @action
    getComplianceById(id: number): ComplianceType {
        return this._complianceTypes.slice().find(e => e.id == id);
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get LastInsertedId():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

}

export const ComplianceTypeMasterStore = new Store();