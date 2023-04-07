
import { observable, action, computed } from "mobx-angular";
import { TrainingStatus, TrainingStatusPaginationResponse } from "src/app/core/models/masters/training/training-status";


class Store {
    @observable
    private _trainingStatus: TrainingStatus[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'training_status_language.created_at';

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
    setTrainingStatus(response: TrainingStatusPaginationResponse) {
        

        this._trainingStatus = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllTrainingStatus(TrainingStatus: TrainingStatus[]) {
       
        this._trainingStatus = TrainingStatus;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): TrainingStatus[] {
        
        return this._trainingStatus.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getTrainingStatusById(id: number): TrainingStatus {
        return this._trainingStatus.slice().find(e => e.id == id);
    }
  
}

export const TrainingStatusMasterStore = new Store();

