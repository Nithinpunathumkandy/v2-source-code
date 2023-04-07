import { computed } from "mobx";
import { action, observable } from "mobx-angular";
import { BiaRating, BiaRatingStorePaginationResponse, IndividualBiaRating } from "src/app/core/models/bcm/bia-rating/bia-rating";


class Store{
    @observable
    private _biaRatingList: BiaRating[] = [];

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'bia_impact_ratings.rating';

    @observable
    private _individualBiaRatingDetails: IndividualBiaRating;

    // @observable
    // individual_rating_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @action
    setBiaRatingStoreDetails(response: BiaRatingStorePaginationResponse) {
        this._biaRatingList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        
    }

    @action
    unsetBiaRatingStoreDetails() {
        this._biaRatingList = [];
        this.loaded = false;   
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get BiaRatingDetails(): BiaRating[] {

        return this._biaRatingList.slice();
    }

    @action
    setIndividualBiaRatingDetails(details:IndividualBiaRating) {
        
        this._individualBiaRatingDetails = details;
        
    }

    unsetIndiviudalBiaRatingDetails() {
        this._individualBiaRatingDetails = null;
      
    }

   
    @computed
    get individualBiaRatingDetails(): IndividualBiaRating {
        return this._individualBiaRatingDetails;
    }

    @action
    getBiaRatingById(id: number): BiaRating {
        return this._biaRatingList.slice().find(e => e.id == id);
    }
}

export const BiaRatingStore = new Store()