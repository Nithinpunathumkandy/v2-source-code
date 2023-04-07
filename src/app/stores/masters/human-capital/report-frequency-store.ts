
import { observable, action, computed } from "mobx-angular";

import { ReportFrequency,ReportFrequencyPaginationResponse } from 'src/app/core/models/masters/human-capital/report-frequency';


class Store {
    @observable
    private _reportFrequencies: ReportFrequency[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'report_frequencies.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setReportFrequency(response: ReportFrequencyPaginationResponse) {
        

        this._reportFrequencies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllReportFrequencies(reportFrequency: ReportFrequency[]) {
       
        this._reportFrequencies = reportFrequency;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ReportFrequency[] {
        
        return this._reportFrequencies.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getReportFrequencyById(id: number): ReportFrequency {
        return this._reportFrequencies.slice().find(e => e.id == id);
    }
  
}

export const ReportFrequencyMasterStore = new Store();

