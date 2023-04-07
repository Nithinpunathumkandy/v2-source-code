
import { observable, action, computed } from "mobx-angular";
import { ControlAssessmentStatus, ControlAssessmentStatusPaginationResponse } from "src/app/core/models/masters/business-assessment/control-assesment-status";




class Store {
    @observable
    private _controlAssessmentStatus: ControlAssessmentStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'control_assessment_status_language.created_at';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';
    
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
    setBusinessAssessmentStatus(response: ControlAssessmentStatusPaginationResponse) {
        this._controlAssessmentStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true; 
    }


    @computed
    get allItems(): ControlAssessmentStatus[] {        
        return this._controlAssessmentStatus.slice();
    }

  
}

export const ControlAssessmentStatusMasterStore = new Store();

