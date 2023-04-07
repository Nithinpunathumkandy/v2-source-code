import { observable, action, computed } from 'mobx-angular';
import { ActionPlan, ActionPlnsResponse, OtherActionPlnsResponse } from 'src/app/core/models/strategy-management/action-plans.model';
import { KpiResponse, Kpis } from 'src/app/core/models/strategy-management/kpi.model';
class Store { 
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'stratergy.title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    _actionPlans:ActionPlan[] = [];

    @observable
    loaded: boolean = false;

    @observable
    _induavalActionPlan = null;

    @observable
    induvalActionPlanLoaded = false;

    @observable
    _otherActionPlans = []

    @observable
    selectedActionPlanId


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setActionPlans(response : ActionPlnsResponse){
        this._actionPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }



    @action
    setInduvalActionPlan(data) {
        this._induavalActionPlan = data;
        this.induvalActionPlanLoaded = true
    }

    @action
    setOtherActionPlans
    (response : OtherActionPlnsResponse){
        this._otherActionPlans = response.data;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        // this.from = response.from;
        // this.loaded = true;
    }

    get allItems(){
        return this._actionPlans
    }

  @computed
  get induvalActionPlan() {
      return this._induavalActionPlan
  }

  @computed
  get otherActionPlan(){
    return this._otherActionPlans
  }
}
export const ActionPlansStore = new Store();