import { observable, action, computed } from "mobx-angular";
import {ControlCategory,ControlCategoryPaginationResponse} from '../../../core/models/masters/bpm/conrol-category'

class Store{
    @observable 
    private _ControlCategory:ControlCategory[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    addOrEditFlag = false;

    @observable
    orderItem:string = 'control_categories.created_at';

    @observable
    from: number = null;
    
    @observable
    lastInsertedControlCategory: number = null;

    searchText: string;

    @observable
    add_conrol_category_modal: boolean = false

    @action
    setControlCategories(response:ControlCategoryPaginationResponse){
        this._ControlCategory=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    
    @action
    setAllControlCategories(type: ControlCategory[]) {
       
        this._ControlCategory = type;
        this.loaded = true;
        
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
    updateControlbCategory(ControlCategory: ControlCategory) {
        const controlCategories: ControlCategory[] = this._ControlCategory.slice();
        const index: number = controlCategories.findIndex(e => e.id == ControlCategory.id);
        if (index != -1) {
            ControlCategory[index] = ControlCategory;
            this._ControlCategory = controlCategories;
        }
    }

    @computed
    get controlCategories(): ControlCategory[] {
        
        return this._ControlCategory.slice();
    }

    @action
    getControlCategoryById(id: number): ControlCategory {
        return this._ControlCategory.slice().find(e => e.id == id);
    }
    @action
    setLastInsertedcontrolCategory(controlCategoryId: number){
        this.lastInsertedControlCategory = controlCategoryId;
    }

    get lastInsertedcontrolCategory():number{
        if(this.lastInsertedControlCategory) 
            return this.lastInsertedControlCategory;
        else 
            return null;
    }

}

export const ControlCategoryMasterStore = new Store();