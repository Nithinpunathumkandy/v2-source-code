
import { observable, action, computed } from "mobx-angular";

import { ExternalAuditTypes,ExternalAuditTypesPaginationResponse } from 'src/app/core/models/masters/external-audit/external-audit-types';


class Store {
    @observable
    private _externalAuditTypes: ExternalAuditTypes[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'external_audit_types.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

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
    setExternalAuditType(response: ExternalAuditTypesPaginationResponse) {
        

        this._externalAuditTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllExternalAuditTypes(externalAuditTypes: ExternalAuditTypes[]) {
       
        this._externalAuditTypes = externalAuditTypes;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ExternalAuditTypes[] {
        
        return this._externalAuditTypes.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getExternalAuditTypeById(id: number): ExternalAuditTypes {
        return this._externalAuditTypes.slice().find(e => e.id == id);
    }
  
}

export const ExternalAuditTypesMasterStore = new Store();

