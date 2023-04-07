import { observable, action, computed } from "mobx-angular";
import {TargetAudience,TargetAudiencePaginationResponse,TargetAudienceSingle} from '../../../core/models/masters/event-monitoring/target-audience'

class Store{
    @observable 
    private _targetAudience:TargetAudience[]=[];

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
    individualTargetAudience: TargetAudienceSingle;

    @observable
    orderItem: string = 'event_target_audiences.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedTargetAudience: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setTargetAudience(response:TargetAudiencePaginationResponse){
        this._targetAudience=response.data;
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
    updateTargetAudience(TargetAudience: TargetAudience) {
        const targetAudience: TargetAudience[] = this._targetAudience.slice();
        const index: number = targetAudience.findIndex(e => e.id == TargetAudience.id);
        if (index != -1) {
            TargetAudience[index] = TargetAudience;
            this._targetAudience = targetAudience;
        }
    }
    @action
    setIndividualTargetAudience(targetAudience: TargetAudienceSingle) {
       
        this.individualTargetAudience = targetAudience;
        this.individualLoaded = true;
        
    }

    @computed
    get targetAudience(): TargetAudience[] {
        
        return this._targetAudience.slice();
    }

    @action
    getTargetAudienceById(id: number): TargetAudience {
        return this._targetAudience.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedtargetAudience(targetAudienceId: number){
        this.lastInsertedTargetAudience = targetAudienceId;
    }

    get lastInsertedtargetAudience():number{
        if(this.lastInsertedTargetAudience) 
            return this.lastInsertedTargetAudience;
        else 
            return null;
    }
    get individualTargetAudienceId(){
        return this.individualTargetAudience;
    } 

}

export const TargetAudienceMasterStore = new Store();