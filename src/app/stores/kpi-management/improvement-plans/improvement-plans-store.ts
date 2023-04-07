import { observable, action, computed } from "mobx-angular";
import { ImprovementPlansPaginationResponse, IndividualImprovementPlans } from "src/app/core/models/kpi-management/improvement-plans/improvement-plans";
class Store{

    @observable
    private _improvement: IndividualImprovementPlans[] = [];

    @observable
    private _individualImprovementDetails: IndividualImprovementPlans;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    ImprovementPlansId: number = null;

    @observable
    path: string = '../';

    // form modal
    @observable
    ImprovementPlansformModal:boolean=false;

    @observable
    update_modal_form: boolean = false;
    
    @observable
    history_modal_form: boolean = false;
    
    @observable
    activity_log_form_modal: boolean = false;
    // **form modal

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setPath( url: string) {
        this.path = url;
    }

    @action
    setImprovementPlans(response: ImprovementPlansPaginationResponse) {

        this._improvement = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetImprovementPlans(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._improvement = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): IndividualImprovementPlans[] {
        return this._improvement.slice();
    }

    @action
    setImprovementPlansId(id: number) {
        this.ImprovementPlansId = id;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setIndividualImprovementPlansDetails(details: IndividualImprovementPlans) {
        this.individualLoaded = true;
        this._individualImprovementDetails = details;
    }

    @action
    unsetIndividualImprovementPlansDetails() {
        this.individualLoaded = false;
        this._individualImprovementDetails = null;
    }
    
    @computed
    get individualImprovementPlansDetails(): IndividualImprovementPlans {
        return this._individualImprovementDetails;
    }

    //**Detials


}
export const ImprovementPlansStore = new Store();