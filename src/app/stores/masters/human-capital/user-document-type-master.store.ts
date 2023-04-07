import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserDocumentType,UserDocumentTypePaginationResponse } from 'src/app/core/models/masters/human-capital/user-document-type';

class Store {
    @observable
    private _userDocumentTypes: UserDocumentType[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'user_document_types.created_at';

    @observable
    from: number = null;

    @observable
    user_document_modal: boolean=false;

    searchText: string;

    @observable
    lastInserted: number = null;


    @action
    setUserDocumentTypes(response: UserDocumentTypePaginationResponse) {
        
        this._userDocumentTypes = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllUserDocumentTypes(type: UserDocumentType[]) {
       
        this._userDocumentTypes = type;
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
    updateUserDocumentType(type: UserDocumentType) {
        const types: UserDocumentType[] = this._userDocumentTypes.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._userDocumentTypes=types;
        }
    }

    @computed
    get userDocumentTypes(): UserDocumentType[] {
        
        return this._userDocumentTypes.slice();
    }

    @action
    getDocumentTypeById(id: number): UserDocumentType {
        return this._userDocumentTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInserted(id: number){
        this.lastInserted = id;
    }

    
}

export const UserDocumentTypeMasterStore = new Store();