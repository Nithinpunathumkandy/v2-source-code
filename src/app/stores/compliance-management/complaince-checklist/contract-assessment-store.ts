import { observable, action, computed } from "mobx-angular";
import { Contract, ContractPaginationResponse, IndividualContract
      } from "src/app/core/models/compliance-management/contract-assessment/contract-assessment-model";
class Store {

    @observable
    private _contract: Contract[] = [];


    @observable
    loaded: boolean = false;


    @observable
    individualLoaded: boolean = false;

    @observable
    _individualContract: IndividualContract;

    @observable
    currentPage: number = 1;

    @observable
    contractId: number;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    lastInsertedId:number=null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;


    @observable
    type=''

    @observable
    orderItem: string = 'contract.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setAllContract(response: ContractPaginationResponse) {
        this._contract = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @computed
    get allItems(): Contract[] {
        return this._contract;
    }

    @action
    unsetContract() {
        this._contract = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setContractDetails(details: IndividualContract) {
        this._individualContract = details;
        this.individualLoaded = true;
    }
    
    @computed
    get contractDetails():IndividualContract {
        return this._individualContract;
    }

    @action
    unsetSelectedItemDetails() {
        this.individualLoaded = false;
        this._individualContract = null;
    }

    @action
    setContractId(id: number) {
        this.contractId = id;
    }

   

   

}



export const ComplainceContractStore = new Store();
