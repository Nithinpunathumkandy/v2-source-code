import { action, computed, observable } from "mobx-angular";
import { ExternalUsers, IndividualExternalUsers } from "src/app/core/models/event-monitoring/events/event-external-users";


class Store {
    @observable
    _externalUsers: ExternalUsers;

    @observable
    private _individualExternalUsers: IndividualExternalUsers;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'external_users.created_at';

    @observable
    individualLoaded: boolean = false;


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

    @observable
    preview_url: string;

    @observable
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
    setExternalUsers(response: ExternalUsers) {
        this._externalUsers = response;
        this.loaded = true;
    }


    @action
    setIndividualExternalUsers(indivitual: IndividualExternalUsers) {       
    this._individualExternalUsers = indivitual;
    this.individualLoaded = true;
    }

    @computed
    get allItems() {
        return this._externalUsers;
    }

    @computed
    get indivitualProjectDocument(){
        return this._individualExternalUsers
    }

    @action
    unsetIndivitualExternalUsers() {       
        this._individualExternalUsers = null;
        this.individualLoaded = false;   
    }
  
}


export const ExternalUsersStore = new Store();

