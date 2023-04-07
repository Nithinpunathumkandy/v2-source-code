import { observable, action, computed } from "mobx-angular";
import { MsAuditPlanObjective, MsAuditPlanObjectivePaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-plan-objective";

class Store {
    @observable
    private _msAuditPlanObjective: MsAuditPlanObjective[] = [];


    @observable
    _selectedMsAuditPlanObjectiveAll: MsAuditPlanObjective[] = [];


    @observable
    loaded: boolean = false;

    @observable
    individualMsAuditPlanObjective: MsAuditPlanObjective;

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
    orderItem: string = 'ms_audit_plan_objectives.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    addMsAuditPlanObjectiveModal: boolean = false

    @action
    setMsAuditPlanObjective(response: MsAuditPlanObjectivePaginationResponse) {

        this._msAuditPlanObjective = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMsAuditPlanObjective(msAuditPlanObjective: MsAuditPlanObjective[]) {
        this._msAuditPlanObjective = msAuditPlanObjective;
        this.loaded = true;
    }

    @action
    setIndividualMsAuditPlanObjective(msAuditPlanObjective: MsAuditPlanObjective) {
        this.individualMsAuditPlanObjective = msAuditPlanObjective;
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
    get allItems(): MsAuditPlanObjective[] {
        return this._msAuditPlanObjective.slice();
    }



    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getMsAuditPlanObjectiveById(id: number): MsAuditPlanObjective {
        return this._msAuditPlanObjective.slice().find(e => e.id == id);
    }

    @action
    deleteMsAuditPlanObjectiveById(id: number) {

        const index = this._selectedMsAuditPlanObjectiveAll.findIndex(e => e.id === id);
        return this._selectedMsAuditPlanObjectiveAll.splice(index, 1);

    }

    @computed
    get selectedAllItems(): MsAuditPlanObjective[] {
        return this._selectedMsAuditPlanObjectiveAll.slice();
    }

    get individualMsAuditPlanObjectiveId() {
        return this.individualMsAuditPlanObjective;
    }

    get lastInsertedMsAuditPlanObjective(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }
    @action
    addSelectedObjective(issues) {
        this._selectedMsAuditPlanObjectiveAll = issues;
    }

    @action
    clearObjective() {
        this._selectedMsAuditPlanObjectiveAll = [];
    }
}

export const MsAuditPlanObjectiveMasterStore = new Store();