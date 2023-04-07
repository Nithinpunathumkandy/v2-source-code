import { observable, action, computed } from "mobx-angular";
import {Range,RangePaginationResponse,RangeSingle} from '../../../core/models/masters/event-monitoring/range';

class Store{
    @observable 
    private _range:Range[]=[];

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
    individualRange: RangeSingle;

    @observable
    orderItem: string = 'event_ranges.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedRange: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setRange(response:RangePaginationResponse){
        this._range=response.data;
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
    updateRange(Range: Range) {
        const range: Range[] = this._range.slice();
        const index: number = range.findIndex(e => e.id == Range.id);
        if (index != -1) {
            Range[index] = Range;
            this._range = range;
        }
    }
    @action
    setIndividualRange(range: RangeSingle) {
       
        this.individualRange = range;
        this.individualLoaded = true;
        
    }

    @computed
    get range(): Range[] {
        
        return this._range.slice();
    }

    @action
    getRangeById(id: number): Range {
        return this._range.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedrange(rangeId: number){
        this.lastInsertedRange = rangeId;
    }

    get lastInsertedrange():number{
        if(this.lastInsertedRange) 
            return this.lastInsertedRange;
        else 
            return null;
    }
    get individualRangeId(){
        return this.individualRange;
    } 

}

export const RangeMasterStore = new Store();