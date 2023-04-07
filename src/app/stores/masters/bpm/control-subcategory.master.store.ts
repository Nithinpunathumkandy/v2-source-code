import {observable,action,computed} from 'mobx-angular'

import { ControlSubcategory,ControlSubcategoryPaginationResponse } from 'src/app/core/models/masters/bpm/control-subcategory';

class Store{

    @observable
    private _controlSubcategory:ControlSubcategory[]=[];

    @observable
    loaded:boolean=false
    
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedControlSubCategory: number = null;

    searchText: string;


    @observable
    selectedCategoryId: number = null;

    @observable
    orderItem: string = 'control_sub_categories.created_at';

    @observable
    from: number = null;

    @observable
    choose_control_sub_category: boolean = false;    

    @observable
    add_conrol_sub_category_modal: boolean = false

    @action
    setControlSubCategories(response: ControlSubcategoryPaginationResponse) {
        
        this._controlSubcategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllControlSubCategories(type: ControlSubcategory[]) {

        // Without Pagination
       
        this._controlSubcategory = type;
        this.loaded = true;

    }

    @action
    updateControlSubcategory(controlSubcategory: ControlSubcategory) {
        const controlSubCategories: ControlSubcategory[] = this._controlSubcategory.slice();
        const index: number = controlSubCategories.findIndex(e => e.id == controlSubcategory.id);
        if (index != -1) {
            controlSubCategories[index] = controlSubcategory;
            this._controlSubcategory=controlSubCategories;
        }
    }
    @action unsetSubCategory() {
        this._controlSubcategory=[]
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    getControlSubcategoryById(id: number): ControlSubcategory {
        return this._controlSubcategory.slice().find(e => e.id == id);
    }
 

    @computed
    get controlSubCategories(): ControlSubcategory[] {
        
        return this._controlSubcategory.slice();
    }

    @action
    setLastInsertedcontrolSubCategory(controlSubCategoryId: number){
        this.lastInsertedControlSubCategory = controlSubCategoryId;
    }

    get lastInsertedcontrolSubCategory():number{
        if(this.lastInsertedControlSubCategory) 
            return this.lastInsertedControlSubCategory;
        else 
            return null;
    }


   

   

}

export const ControlSubcategoryMasterStore = new Store();