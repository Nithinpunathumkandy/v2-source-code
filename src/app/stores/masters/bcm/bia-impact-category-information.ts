import { observable, action, computed } from "mobx-angular";
import { BiaImpactCategoryInformation, BiaImpactCategoryInformationPaginationResponse } from "src/app/core/models/masters/bcm/bia-impact-category-information";

class Store {
    @observable
    private _biaImpactCategoryInformation: BiaImpactCategoryInformation[] = [];

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
    orderItem: string = 'bia_impact_category_information.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    BiaImpactCategoryInformationDetails:BiaImpactCategoryInformation;

    searchText: string;

    @action
    setBiaImpactCategoryInformation(response: BiaImpactCategoryInformationPaginationResponse) {

        this._biaImpactCategoryInformation = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllBiaImpactCategoryInformation(res: BiaImpactCategoryInformation[]) {
        this._biaImpactCategoryInformation = res;
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
    updateBiaImpactCategoryInformation(type: BiaImpactCategoryInformation) {
     this.BiaImpactCategoryInformationDetails=type    
    }  

    @computed
    get biaList(){
        return this.BiaImpactCategoryInformationDetails
    }

    @computed
    get BiaImpactCategoryInformation(): BiaImpactCategoryInformation[] {

        return this._biaImpactCategoryInformation.slice();
    }
    @computed
    get allItems(): BiaImpactCategoryInformation[] {

        return this._biaImpactCategoryInformation.slice();
    }

    @action
    getBiaImpactCategoryInformationById(id: number): BiaImpactCategoryInformation {
        return this._biaImpactCategoryInformation.slice().find(e => e.id == id);
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

}

export const BiaImpactCategoryInformationMasterStore = new Store();