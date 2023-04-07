import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { BusinessApplications, BusinessApplicationsPaginationResponse } from "src/app/core/models/masters/bcm/business-applications";

class Store {
    @observable
    private _businessApplications: BusinessApplications[] = [];

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
    orderItem: string = 'business_applications.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    businessApplicationDetails: any;

    searchText: string;

    @observable
    selectedBusinessApplicationsList: BusinessApplications[] = [];

    @observable
    saveSelected: boolean = false;

    @observable
    business_application_select_form_modal: boolean = false;

    @action
    setBusinessApplications(response: BusinessApplicationsPaginationResponse) {

        this._businessApplications = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetBusinessApplications() {
        this._businessApplications = [];
        this.loaded = false;
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
    updateBusinessApplications(type: BusinessApplications) {
        // const types: BusinessApplications[] = this._businessApplications.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._businessApplications = types;
        // }
        this.businessApplicationDetails=type
    }

    @computed
    get businessApplications(): BusinessApplications[] {

        return this._businessApplications.slice();
    }
    @computed
    get allItems(): BusinessApplications[] {

        return this._businessApplications.slice();
    }

    @action
    getBusinessApplicationsById(id: number): BusinessApplications {
        return this._businessApplications.slice().find(e => e.id == id);
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

    @action
    addSelectedBusinessApplications(issues){
        this.selectedBusinessApplicationsList = issues;
    }

    unsetSelectedBusinessApplications(){
        this.selectedBusinessApplicationsList = [];
    }
}

export const BusinessApplicationsMasterStore = new Store();