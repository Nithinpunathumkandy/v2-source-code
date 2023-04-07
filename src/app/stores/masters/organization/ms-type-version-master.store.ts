import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MsTypeVersion,MsTypeVersionPaginationResponse } from 'src/app/core/models/masters/organization/ms-type-version';

class Store {
    @observable
    private _msTypeVersions: MsTypeVersion[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'ms_type_versions.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';


    @observable
    last_inserted_id = null;

    searchText: string;


    @action
    setMsTypeVersions(response: MsTypeVersionPaginationResponse) {
        
        this._msTypeVersions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllMsTypeVersions(type: MsTypeVersion[]) {
       
        this._msTypeVersions = type;
        this.loaded = true;
        
    }

    @action
    updateMsTypeVersion(msTypeVersion: MsTypeVersion) {
        const msTypeVersions: MsTypeVersion[] = this._msTypeVersions.slice();
        const index: number = msTypeVersions.findIndex(e => e.id == msTypeVersion.id);
        if (index != -1) {
            msTypeVersions[index] = msTypeVersion;
            this._msTypeVersions=msTypeVersions;
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
    get msTypeVersions(): MsTypeVersion[] {
        
        return this._msTypeVersions.slice();
    }

    @action
    getMsTypeVersionById(id: number): MsTypeVersion {
        return this._msTypeVersions.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.last_inserted_id = id;
    }

    @computed
    get lastInsertedId():number{
        return this.last_inserted_id;
    }
}

export const MsTypeVersionMasterStore = new Store();
