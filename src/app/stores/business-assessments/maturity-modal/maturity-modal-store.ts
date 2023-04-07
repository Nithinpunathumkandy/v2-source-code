import { observable, action, computed } from "mobx-angular";
import { MaturityModal, MaturityModalPaginationResponse, IndividualMaturityModal } from 'src/app/core/models/business-assessments/maturity-modal/maturity-modal';
class Store {
    @observable
    private _maturityModalList: MaturityModal[] = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'maturity_modal.reference_code';

    @observable
    private _individualMaturityModalDetails: IndividualMaturityModal;

    @observable
    individualMaturityModalLoaded: boolean = false;

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

    @observable
    maturityModalId:number = null;

    @observable
    viewMore: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setMaturityModalDetails(response: MaturityModalPaginationResponse) {
        this._maturityModalList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateMaturityModal(framework: MaturityModal) {
        const frameworks: MaturityModal[] = this._maturityModalList.slice();
        const index: number = frameworks.findIndex(e => e.id == framework.id);
    }


    @computed
    get maturityModalDetails(): MaturityModal[] {

        return this._maturityModalList?.slice();
    }

    getMaturityModalById(id: number): IndividualMaturityModal {
        let maturityModalList;

        maturityModalList = this._maturityModalList.slice().find(e => e.id == id);
        this.setIndividualMaturityModalDetails(maturityModalList);
        return maturityModalList;
    }

    @action
    setIndividualMaturityModalDetails(details:IndividualMaturityModal) {
        this.individualMaturityModalLoaded = true;
        this._individualMaturityModalDetails = details;
        // this.updateFramework(details);
    }

    unsetMaturityModalDetails() {
        this._maturityModalList = null;
        this.loaded = false;
    }

    unsetIndiviudalMaturityModalDetails() {
        this._individualMaturityModalDetails = null;
        this.individualMaturityModalLoaded = false;
    }

    setMaturityModalId(id){
        this.maturityModalId = id;
    }

    unsetmaturityModalId(){
        this.maturityModalId = null;
    }

   
    @computed
    get individualMaturityModalDetails(): IndividualMaturityModal {
        return this._individualMaturityModalDetails;
    }




}

export const MaturityModalStore = new Store();