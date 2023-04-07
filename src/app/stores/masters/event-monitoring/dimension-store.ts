import { observable, action, computed } from "mobx-angular";
import {Dimension,DimensionPaginationResponse,DimensionSingle} from '../../../core/models/masters/event-monitoring/dimension';

class Store{
    @observable 
    private _dimension:Dimension[]=[];

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
    individualLoaded: boolean = false;

    @observable
    individualDimension: DimensionSingle;

    @observable
    orderItem: string = 'event_dimensions.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedDimension: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setDimension(response:DimensionPaginationResponse){
        this._dimension=response.data;
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
    updateDimension(Dimension: Dimension) {
        const dimension: Dimension[] = this._dimension.slice();
        const index: number = dimension.findIndex(e => e.id == Dimension.id);
        if (index != -1) {
            Dimension[index] = Dimension;
            this._dimension = dimension;
        }
    }
    @action
    setIndividualDimension(dimension: DimensionSingle) {
       
        this.individualDimension = dimension;
        this.individualLoaded = true;
        
    }

    @computed
    get dimension(): Dimension[] {
        
        return this._dimension.slice();
    }

    @action
    getDimensionById(id: number): Dimension {
        return this._dimension.slice().find(e => e.id == id);
    }

    @action
    setLastInserteddimension(dimensionId: number){
        this.lastInsertedDimension = dimensionId;
    }

    get lastInserteddimension():number{
        if(this.lastInsertedDimension) 
            return this.lastInsertedDimension;
        else 
            return null;
    }
    get individualDimensionId(){
        return this.individualDimension;
    } 

}

export const DimensionMasterStore = new Store();