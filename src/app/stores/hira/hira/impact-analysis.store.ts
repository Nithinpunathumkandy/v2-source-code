
import { observable, action, computed } from "mobx-angular";

import { ImpactAnalysis, ImpactAnalysisPaginationResponse,ImpactData } from 'src/app/core/models/risk-management/risks/impact-analysis';



class Store {
    @observable
    private _impactAnalysis: ImpactAnalysis;

    @observable
    private _individualImpactAnalysis: ImpactAnalysis;

    @observable
    private _individualImpactAnalysisLoaded: boolean = false;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    @observable
    searchText: string;

    @observable
    orderItem = 'risk_imapct_analysis.id';

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setImpactAnalysis(response: ImpactAnalysisPaginationResponse) {


        // this._impactAnalysis = response.data;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        // this.from = response.from;
        // this.loaded = true;

    }

    @action
    setAllImpactAnalysis(impactAnalysis: ImpactAnalysis) {

        this._impactAnalysis = impactAnalysis;
        this.loaded = true;

    }

    @action
    setIndividualImpactAnalysis(impactAnalysis: ImpactAnalysis) {
        this._individualImpactAnalysis = impactAnalysis;
        this._individualImpactAnalysisLoaded = true;
    }

    @computed
    get allItems(): ImpactAnalysis {

        return this._impactAnalysis;
    }
    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    unsetImpactAnalysis(){
        this._impactAnalysis=null;
        this.loaded=false;

    }

    // @action
    // getImpactAnalysisById(id: number): ImpactAnalysis {
    //     return this._impactAnalysis.data.slice().find(e => e.id == id);
    // }

}

export const ImpactAnalysisStore = new Store();

