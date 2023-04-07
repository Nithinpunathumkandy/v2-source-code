import { observable, action, computed } from "mobx-angular";
import { MsAuditPlanCriteria, MsAuditPlanCriteriaPaginationResponse } from "src/app/core/models/masters/ms-audit-management/ms-audit-plan-criteria";

class Store {
    @observable
    private _msAuditPlanCriteria: MsAuditPlanCriteria[] = [];


    @observable
    _selectedMsAuditPlanCriteriaAll: MsAuditPlanCriteria[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualMsAuditPlanCriteria: MsAuditPlanCriteria;

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
    orderItem: string = 'ms_audit_plan_criteria.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @observable
    addMsAuditPlanCriteriaModal: boolean = false

    @action
    setMsAuditPlanCriteria(response: MsAuditPlanCriteriaPaginationResponse) {

        this._msAuditPlanCriteria = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllMsAuditPlanCriteria(msAuditPlanCriteria: MsAuditPlanCriteria[]) {

        this._msAuditPlanCriteria = msAuditPlanCriteria;
        this.loaded = true;

    }

    @action
    setIndividualMsAuditPlanCriteria(msAuditPlanCriteria: MsAuditPlanCriteria) {

        this.individualMsAuditPlanCriteria = msAuditPlanCriteria;
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
    get allItems(): MsAuditPlanCriteria[] {
        return this._msAuditPlanCriteria.slice();
    }



    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getMsAuditPlanCriteriaById(id: number): MsAuditPlanCriteria {
        return this._msAuditPlanCriteria.slice().find(e => e.id == id);
    }

    @action
    deleteMsAuditPlanCriteriaById(id: number) {

        const index = this._selectedMsAuditPlanCriteriaAll.findIndex(e => e.id === id);
        return this._selectedMsAuditPlanCriteriaAll.splice(index, 1);

    }

    @computed
    get selectedAllItems(): MsAuditPlanCriteria[] {
        return this._selectedMsAuditPlanCriteriaAll.slice();
    }


    get individualMsAuditPlanCriteriaId() {
        return this.individualMsAuditPlanCriteria;
    }

    get lastInsertedMsAuditPlanCriteria(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    addSelectedCriteria(issues) {
        this._selectedMsAuditPlanCriteriaAll = issues;
    }
    @action
    clearCriteria()
    {
        this._selectedMsAuditPlanCriteriaAll = [];
    }



}

export const MsAuditPlanCriteriaMasterStore = new Store();