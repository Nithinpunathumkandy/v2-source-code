import { observable, action, computed } from "mobx-angular";
import {ControlTypes,ControlTypesPaginationResponse} from '../../../core/models/masters/bpm/contol-types'

class Store{
    @observable 
    private _ControlTypes:ControlTypes[]=[];

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
    orderItem: string = 'control_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedControlTypes: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setControlTypes(response:ControlTypesPaginationResponse){
        this._ControlTypes=response.data;
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
    updateControlTypes(ControlTypes: ControlTypes) {
        const controlTypes: ControlTypes[] = this._ControlTypes.slice();
        const index: number = controlTypes.findIndex(e => e.id == ControlTypes.id);
        if (index != -1) {
            ControlTypes[index] = ControlTypes;
            this._ControlTypes = controlTypes;
        }
    }

    @computed
    get controlTypes(): ControlTypes[] {
        
        return this._ControlTypes.slice();
    }

    @action
    getControlTypesById(id: number): ControlTypes {
        return this._ControlTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedcontrolTypes(controlTypesId: number){
        this.lastInsertedControlTypes = controlTypesId;
    }

    get lastInsertedcontrolTypes():number{
        if(this.lastInsertedControlTypes) 
            return this.lastInsertedControlTypes;
        else 
            return null;
    }

}

export const ControlTypesMasterStore = new Store();