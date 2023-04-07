import { observable, action, computed } from "mobx-angular";
import {ProcessRisks,ProcessRiskPaginationResponse} from '../../../core/models/bpm/process/process_risk'

class Store{

    @observable
    private _processRisks: ProcessRisks[] = [];
    @observable
    process_risk_loaded: boolean = false;
    @observable
    currentPage: number = 1;

    searchText: string;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: string = 'asc';

    @observable
    orderItem: string = 'ref_no';

    @action
    setProcessesRisks(response: ProcessRiskPaginationResponse) {
        this.process_risk_loaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._processRisks = response.data;
    }
    @action
    unsetProcessRisks() {
        this.process_risk_loaded = false;
        this._processRisks = [];
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @computed
    get getProcessRisks(): ProcessRisks[] {
        return this._processRisks;
    }

}
export const ProcessRiskStore = new Store();