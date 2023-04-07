import { action, computed, observable } from "mobx-angular";
import { BiaCategory, BiaCategoryPaginationResponse, IndividualBiaCategory } from "src/app/core/models/bcm/bia-category/bia-category";


class Store{
    @observable
    private _biaCategoryList: BiaCategory[] = [];

    @observable
    private _biaCategoryDetails:IndividualBiaCategory;

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'bia_impact_categories.created_at';


    // @observable
    // individual_impact_category_loaded: boolean = false;

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
    setBiaCategoryDetails(response: BiaCategoryPaginationResponse) {
        this._biaCategoryList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        
    }

    @action
    unsetBiaCategoryDetails() {
        this._biaCategoryList = [];
        this.loaded = false;  
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setAllBiaCategoryStore(res: BiaCategory[]) {
        this._biaCategoryList = res;
    }

    @computed
    get BiaCategoryDetails(): BiaCategory[] {

        return this._biaCategoryList.slice();
    }

    @action
    setIndividualBiaCategory(details:IndividualBiaCategory) {
     
        this._biaCategoryDetails=details;
    }

    unsetIndividualBiaCategory(){
  
        this._biaCategoryDetails = null;
    }

    @computed
    get biaCategoryDetails(): IndividualBiaCategory {
    return this._biaCategoryDetails;
    }
 
}

export const BiaCategoryStore = new Store()