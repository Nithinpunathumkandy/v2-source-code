import { action, computed, observable } from "mobx-angular";
import { CallTreePaginationResponse, CallTreeUsers } from "src/app/core/models/bcm/bcp/bcp-calltree";

class Store{
    @observable
    private _bcpCallTreeList: CallTreeUsers[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @action
    setBcpCallTreeResponse(response: CallTreePaginationResponse) {
        this._bcpCallTreeList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetBcpCallTreeList() {
        this._bcpCallTreeList = [];
        this.loaded = false;  
    }

    @action
    setBcpCallTree(tree: CallTreeUsers[]){
        this._bcpCallTreeList = tree;
        this.loaded = true;
    }

    @computed
    get BcpCallTree(): CallTreeUsers[] {
        return this._bcpCallTreeList.slice();
    }
 
}

export const BcpCallTreeStore = new Store()