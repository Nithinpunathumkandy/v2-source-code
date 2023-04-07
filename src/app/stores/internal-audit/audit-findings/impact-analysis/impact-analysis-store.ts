
import { observable, action, computed } from "mobx-angular";

import { ImpactAnalysis ,ImpactAnalysisPaginationResponse } from 'src/app/core/models/internal-audit/audit-findings/impact-analysis/impact-analysis';



class Store {
    @observable
    private _impactAnalyses: ImpactAnalysis[] = [];

    @observable 
    loaded:boolean=false;

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
    totalTime: number = null;
    totalCount: number = null;
    totalMoney: number = null;
  
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
   
 
    @action
    setAllImpactAnalyses(response: ImpactAnalysisPaginationResponse) {
       
        this._impactAnalyses = response.data;
        this.totalTime = response.total_time;
        this.totalCount = response.total_count;
        this.totalMoney = response.money_total;
        this.from = response.from;
        this.loaded = true;
        
    }

    @action
    unsetAllImpactAnalyses() {    
        this._impactAnalyses = [];
        this.loaded = false;  
    }


    
    @computed
    get allItems(): ImpactAnalysis[] {
        
        return this._impactAnalyses.slice();
    }
   
}

export const ImpactAnalysesStore = new Store();

