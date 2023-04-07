import { action, computed, observable } from "mobx-angular";

import { ImpactArea, ImpactAreaPaginationResponse, IndividualImpactArea } from "src/app/core/models/bcm/impact-area/impact-area";


class Store{
    @observable
    private _impactAreaList: ImpactArea[] = [];

    @observable
    private _impactAreaDetails:IndividualImpactArea;

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'bia_impact_areas.created_at';


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

    @action
    setImpactAreaDetails(response: ImpactAreaPaginationResponse) {
        this._impactAreaList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        
    }

    @action
    unsetImpactAreaDetails() {
        this._impactAreaList = [];
        this.loaded = false;    
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get ImpactAreaDetails(): ImpactArea[] {

        return this._impactAreaList.slice();
    }

    @action
    setIndividualImpactArea(details:IndividualImpactArea) {
     
        this._impactAreaDetails=details;
    }

    unsetIndividualImpactArea(){
  
        this._impactAreaDetails = null;
    }

    @computed
    get IndivitualImpactAreaDetails(): IndividualImpactArea {
    return this._impactAreaDetails;
    }
 
}

export const ImpactAreaStore = new Store()