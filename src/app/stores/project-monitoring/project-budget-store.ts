import { observable, action, computed } from "mobx-angular";
import { BudgetPaginationResponse, Budgets,PaymentResponse,Payments } from "src/app/core/models/project-monitoring/project-budget";

class Store {
    @observable
    private _budget: Budgets[] = [];

    @observable
    _paymentData : Payments[]= []

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
    orderItem: string = 'project_budget.title';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setBudget(response: BudgetPaginationResponse) {

        this._budget = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setPayments(data:PaymentResponse){
        this._paymentData = data.data
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
    updateBudget(type: Budgets) {
        const types: Budgets[] = this._budget.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._budget = types;
        }
    }

    @computed
    get Budget(): Budgets[] {

        return this._budget.slice();
    }

    @computed
    get payment(): Payments[] {

        return this._paymentData.slice();
    }
    @computed
    get allItems(): Budgets[] {

        return this._budget.slice();
    }

    @action
    getBudgetById(id: number): Budgets {
        return this._budget.slice().find(e => e.id == id);
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

export const BudgetStore = new Store();