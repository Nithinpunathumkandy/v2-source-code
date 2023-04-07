import { action, computed, observable } from "mobx-angular";
import { BiaScale, BiaScalePaginationResponse, IndividualBiaScale } from "src/app/core/models/bcm/bia-scale/bia-scale";



class Store{
    @observable
    private _biaScaleList: BiaScale[] = [];

    @observable
    private _biaScaleDetails:IndividualBiaScale;

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'bia_scales.created_at';


    // @observable
    // individual_impact_area_loaded: boolean = false;

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

    @observable
    isRangeValue: any

    @action
    setBiaScaleDetails(response: BiaScalePaginationResponse) {
        this._biaScaleList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        
    }

    @action
    unsetBiaScaleDetails() {
        this._biaScaleList = [];
        this.loaded = false;
    }
    @action
    setAllBiaScaleStore(res: BiaScale[]) {
        this._biaScaleList = res;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get BiaScaleDetails(): BiaScale[] {
        return this._biaScaleList.slice();
    }
    @computed
    get allItems(): BiaScale[] {

        return this._biaScaleList.slice();
    }

    @action
    setIndividualBiaScale(details:IndividualBiaScale) {
     
        this._biaScaleDetails=details;
    }

    unsetIndividualBiaScale(){
  
        this._biaScaleDetails = null;
    }

    @computed
    get IndivitualBiaScaleDetails(): IndividualBiaScale {
    return this._biaScaleDetails;
    }
 
}

export const BiaScaleStore = new Store()