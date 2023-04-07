import { observable, action, computed } from "mobx-angular";
import { CorrectiveActionStatus, CorrectiveActionStatusPaginationResponse, CorrectiveActionStatusSingle } from "src/app/core/models/masters/audit-management/Corrective-action-status";


class Store {
    @observable
    private _correctiveActionStatus: CorrectiveActionStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    //add tab;e name here
    @observable
    orderItem: string = 'created_at';

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

    @observable
    individualLoaded: boolean = false;

    @observable
    individualCorrectiveActionStatus: CorrectiveActionStatusSingle;


    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setCorrectiveActionStatus(response: CorrectiveActionStatusPaginationResponse) {
        this._correctiveActionStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }

    @action
    updateCorrectiveActionStatus(type: CorrectiveActionStatus) {
        const types: CorrectiveActionStatus[] = this._correctiveActionStatus.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._correctiveActionStatus = types;
        }
    }

    @action
    setAllCorrectiveActionStatus(type: CorrectiveActionStatus[]) {
        this._correctiveActionStatus = type;
        this.loaded = true;
    }

    @computed
    get allItems(): CorrectiveActionStatus[] {        
        return this._correctiveActionStatus.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    setIndividualCorrectiveActionStatus(auditMode: CorrectiveActionStatusSingle) {
       
        this.individualCorrectiveActionStatus = auditMode;
        this.individualLoaded = true;
        
    }
    get individualMsAuditModeId(){
        return this.individualCorrectiveActionStatus;
    } 

    @action
    getCorrectiveActionStatusById(id: number): CorrectiveActionStatus {
        return this._correctiveActionStatus.slice().find(e => e.id == id);
    }
  
}

export const CorrectiveActionStatusMasterStore = new Store();

