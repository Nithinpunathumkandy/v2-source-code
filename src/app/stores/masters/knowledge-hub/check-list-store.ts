import { observable, action, computed } from "mobx-angular";
import { KhCheckList,KhCheckListPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/check-list';


class Store {

    @observable
    private _auditCheckLists: KhCheckList[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'checklists.created_at';

    @observable
    from: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    lastInsertedId: number = null;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKnowledgeHub(response: KhCheckListPaginationResponse) {
        
        this._auditCheckLists = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllKnowledgeHub(audit: KhCheckList[]) {
       
        this._auditCheckLists = audit;
        this.loaded = true;
        
    }
    @computed
    get allItems(): KhCheckList[] {
        
        return this._auditCheckLists.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getKnowledgeHubById(id: number): KhCheckList {
        return this._auditCheckLists.slice().find(e => e.id == id);
    }


}

export const KhCheckListMasterStore = new Store();