import { action, computed, observable } from "mobx-angular";
import { RiskImpactArea, RiskImpactAreaPaginationResponse, RiskImpactAreaSingle } from "src/app/core/models/masters/event-monitoring/event-risk-impact-areas";

class Store {
    @observable
    private _riskImpactArea: RiskImpactArea[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'risk_impact_area_title.created_at';

    @observable
    individualRiskImpactArea: RiskImpactAreaSingle;

    @observable
    lastInsertedRiskImpactArea: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskImpactArea(response: RiskImpactAreaPaginationResponse) {
        
        this._riskImpactArea = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskImpactArea(status: RiskImpactArea[]) {
       
        this._riskImpactArea = status;
        this.loaded = true;
    }

    @action
    setIndividualRiskImpactArea(RiskImpactAreaSingle: RiskImpactAreaSingle) {
       
        this.individualRiskImpactArea = RiskImpactAreaSingle;
        this.individualLoaded = true;
    }

    @action
    setLastInsertedRiskImpactArea(RiskImpactArea: number){
        this.lastInsertedRiskImpactArea = RiskImpactArea;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }

    getRiskImpactAreaById(id: number): RiskImpactArea {
        return this._riskImpactArea.slice().find(e => e.id == id);
    }

    get lastInsertedeventType():number{
        if(this.lastInsertedRiskImpactArea) 
            return this.lastInsertedRiskImpactArea;
        else 
            return null;
    }
    get individualEventTypeId(){
        return this.individualRiskImpactArea;
    } 


    @computed
    get allItems(): RiskImpactArea[] {
        return this._riskImpactArea.slice();
    }

}

export const RiskImpactAreaMasterStore = new Store();