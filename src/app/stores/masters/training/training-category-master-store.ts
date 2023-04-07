
import { observable, action, computed } from "mobx-angular";
import { TrainingCategory, TrainingCategoryPaginationResponse } from "src/app/core/models/masters/training/training-category";


class Store {
    @observable
    private _trainingCategory: TrainingCategory[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'training_categories.created_at';

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
    setTrainingCategory(response: TrainingCategoryPaginationResponse) {
        

        this._trainingCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllTrainingCategory(TrainingCategory: TrainingCategory[]) {
       
        this._trainingCategory = TrainingCategory;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): TrainingCategory[] {
        
        return this._trainingCategory.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getTrainingCategoryById(id: number): TrainingCategory {
        return this._trainingCategory.slice().find(e => e.id == id);
    }
  
}

export const TrainingCategoryMasterStore = new Store();

