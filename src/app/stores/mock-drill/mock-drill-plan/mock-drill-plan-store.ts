import { action, computed, observable } from 'mobx';
import { IndividualMockDrillPlan, MockDrillPlan, MockDrillPlanPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill-plan/mock-drill-plan';

class Store {
    @observable
    private _mockDrillPlan: MockDrillPlan[] = [];

    @observable
    private _mockDrillPlanDetails: IndividualMockDrillPlan;


    @observable
    loaded: boolean = false;

    @observable
    individual_mockdrillplan_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'mock_drill_plan.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    mock_drill_plan_id: number = null;

    @observable
    lastCreatedMockDrillPlanId: number = null;

    @observable
    individualLoaded: boolean = false;
    @observable
    selectedPlan: IndividualMockDrillPlan;
    @computed
    get allItems(): MockDrillPlan[] {
        return this._mockDrillPlan.slice();
    }
    @computed
    get mockDrillPlanList(): MockDrillPlan[] {
        return this._mockDrillPlan;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setMockDrillPlan(response: MockDrillPlanPaginationResponse) {
        this._mockDrillPlan = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetMockDrillPlan() {
        this._mockDrillPlan = [];
        this.loaded = false;
    }


    @action
    setMockDrillPlanId(id: number) {
        this.mock_drill_plan_id = id;
    }
    @action
    unsetMockDrillPlanId() {
        this.mock_drill_plan_id = 0;
    }
    @action
    setIndividualMockDrillPlan(details: IndividualMockDrillPlan) {
        this.individual_mockdrillplan_loaded = true;
        this._mockDrillPlanDetails = details;
        this.selectedPlan = details;
    }

    @computed
    get selectedPlanData(): IndividualMockDrillPlan {
        return this.selectedPlan;
    }
    @action
    unsetIndividualMockDrillPlan() {
        this.individual_mockdrillplan_loaded = false;
        this._mockDrillPlanDetails = null;
    }

    @action
    getPlanById(id: number): MockDrillPlan {
        return this._mockDrillPlan.slice().find(e => e.id == id);
    }
    @computed
    get individualMockDrillPlanDetails(): IndividualMockDrillPlan {
        return this._mockDrillPlanDetails;
    }


}

export const MockDrillPlanStore = new Store();