import { observable, action, computed } from "mobx-angular";
import { BusinessAssessmentFrequency, BusinessAssessmentFrequencyPaginationResponse } from "src/app/core/models/masters/business-assessment/business-assessment-frequencies";

class Store {
    @observable
    private _businessAssessmentFrequency: BusinessAssessmentFrequency[] = [];

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
    orderItem: string = 'businness_assessment_frequencies.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    businessAssessmentFrequencyDetails: any;

    searchText: string;

    @action
    setBusinessAssessmentFrequency(response: BusinessAssessmentFrequencyPaginationResponse) {

        this._businessAssessmentFrequency = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
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
    updateBusinessAssessmentFrequency(type: BusinessAssessmentFrequency) {
        // const Location: BusinessAssessmentFrequency[] = this._businessAssessmentFrequency.slice();
        // const index: number = Location.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     Location[index] = type;
        //     this._businessAssessmentFrequency = Location;
        // }
        this.businessAssessmentFrequencyDetails=type
    }

    @computed
    get BusinessAssessmentFrequency(): BusinessAssessmentFrequency[] {

        return this._businessAssessmentFrequency.slice();
    }
    @computed
    get allItems(): BusinessAssessmentFrequency[] {

        return this._businessAssessmentFrequency.slice();
    }

    @action
    getBusinessAssessmentFrequencyById(id: number): BusinessAssessmentFrequency {
        return this._businessAssessmentFrequency.slice().find(e => e.id == id);
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

export const BusinessAssessmentFrequencyMasterStore = new Store();