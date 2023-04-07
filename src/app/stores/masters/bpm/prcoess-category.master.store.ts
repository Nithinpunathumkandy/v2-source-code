import { observable, action, computed } from "mobx-angular";
import {ProcessCategory,ProcessCategoryPaginationResponse} from '../../../core/models/masters/bpm/process-category'

class Store{
    @observable 
    private _processCategory:ProcessCategory[]=[];

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
    orderItem: string = 'process_categories.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedProcessCategory: number = null;

    searchText: string;


    @observable
    add_process_category_modal: boolean = false

    @action
    setProcessCategory(response:ProcessCategoryPaginationResponse){
        this._processCategory=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateCategory(processCategory: ProcessCategory) {
        const processCategories: ProcessCategory[] = this._processCategory.slice();
        const index: number = processCategories.findIndex(e => e.id == processCategory.id);
        if (index != -1) {
            processCategory[index] = processCategory;
            this._processCategory = processCategories;
        }
    }

    @computed
    get processCategories(): ProcessCategory[] {
        
        return this._processCategory.slice();
    }

    @action
    getProcessCategoryById(id: number): ProcessCategory {
        return this._processCategory.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedprocessCategory(processCateogryId: number){
        this.lastInsertedProcessCategory = processCateogryId;
    }

    get lastInsertedprocessCategory():number{
        if(this.lastInsertedProcessCategory) 
            return this.lastInsertedProcessCategory;
        else 
            return null;
    }

}

export const ProcessCategoryMasterStore = new Store();