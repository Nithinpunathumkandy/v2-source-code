import { observable, action, computed } from "mobx-angular";

import { AuditableItemType,AuditableItemTypePaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item-type';

class Store {
    @observable
    private _auditItemTypes: AuditableItemType[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'auditable_item_types.created_at';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditItemTypes(response: AuditableItemTypePaginationResponse) {
        
        this._auditItemTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
       
    }

    @action
    setAllAuditItemTypes(audit: AuditableItemType[]) {
       
        this._auditItemTypes = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): AuditableItemType[] {
        
        return this._auditItemTypes.slice();
    }


}
export const AuditItemTypeMasterStore = new Store();