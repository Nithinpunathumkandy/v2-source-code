import { observable, action, computed } from "mobx-angular";
import { ControlMode, ControlModePaginationResponse } from "src/app/core/models/masters/bpm/control-mode";

class Store{
    @observable 
    private _ControlMode:ControlMode[]=[];

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
    orderItem:string = 'control_modes.created_at';

    @observable
    from: number = null;
    
    @observable
    lastInsertedControlMode: number = null;

    searchText: string;

    @action
    setControlModes(response:ControlModePaginationResponse){
        this._ControlMode=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
        //console.log("mode",response)
    }

    
    @action
    setAllControlModes(type: ControlMode[]) {
       
        this._ControlMode = type;
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
    updateControlbyModes(ControlCategory: ControlMode) {
        const controlCategories: ControlMode[] = this._ControlMode.slice();
        const index: number = controlCategories.findIndex(e => e.id == ControlCategory.id);
        if (index != -1) {
            ControlCategory[index] = ControlCategory;
            this._ControlMode = controlCategories;
        }
    }

    @computed
    get controlModes(): ControlMode[] {
        
        return this._ControlMode.slice();
    }

    @action
    setLastInsertedcontrolModes(controlCategoryId: number){
        this.lastInsertedControlMode= controlCategoryId;
    }

    get lastInsertedcontrolModes():number{
        if(this.lastInsertedControlMode) 
            return this.lastInsertedControlMode;
        else 
            return null;
    }

    @action
    getControlModeById(id: number): ControlMode {
        return this._ControlMode.slice().find(e => e.id == id);
    }
}

export const ControlModeMasterStore = new Store();