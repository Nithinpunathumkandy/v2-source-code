import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { RiskControlPlan,RiskControlPlanPaginationResponse,RiskControlPlanSingle } from 'src/app/core/models/masters/risk-management/risk-control-plan';

class Store {
    @observable
    private _riskControlPlan: RiskControlPlan[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualRiskControlPlan: RiskControlPlanSingle;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'risk_control_plan_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setRiskControlPlan(response: RiskControlPlanPaginationResponse) {
        
        this._riskControlPlan = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllRiskControlPlan(riskControlPlan: RiskControlPlan[]) {
       
        this._riskControlPlan = riskControlPlan;
        this.loaded = true;
        
    }

    @action
    setIndividualRiskControlPlan(riskControlPlan: RiskControlPlanSingle) {
       
        this.individualRiskControlPlan = riskControlPlan;
        this.individualLoaded = true;
        
    }


    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }



    @computed
    get allItems(): RiskControlPlan[] {
        return this._riskControlPlan.slice();
    }

    @action
    updateRiskControlPlan(type: RiskControlPlan) {
        const types: RiskControlPlan[] = this._riskControlPlan.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._riskControlPlan=types;
        }
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getRiskControlPlanById(id: number): RiskControlPlan {
        return this._riskControlPlan.slice().find(e => e.id == id);
    }

    get individualRiskControlPlanId(){
        return this.individualRiskControlPlan;
    } 

}

export const RiskControlPlanMasterStore = new Store();