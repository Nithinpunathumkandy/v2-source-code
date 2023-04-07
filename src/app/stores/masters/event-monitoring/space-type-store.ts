import { observable, action, computed } from "mobx-angular";
import {SpaceType,SpaceTypePaginationResponse,SpaceTypeSingle} from '../../../core/models/masters/event-monitoring/space-type';

class Store{
    @observable 
    private _spaceType:SpaceType[]=[];

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
    individualSpaceType: SpaceTypeSingle;

    @observable
    orderItem: string = 'event_space_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedSpaceType: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setSpaceType(response:SpaceTypePaginationResponse){
        this._spaceType=response.data;
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
    updateSpaceType(SpaceType: SpaceType) {
        const spaceType: SpaceType[] = this._spaceType.slice();
        const index: number = spaceType.findIndex(e => e.id == SpaceType.id);
        if (index != -1) {
            SpaceType[index] = SpaceType;
            this._spaceType = spaceType;
        }
    }
    @action
    setIndividualSpaceType(spaceType: SpaceTypeSingle) {
       
        this.individualSpaceType = spaceType;
        this.individualLoaded = true;
        
    }

    @computed
    get spaceType(): SpaceType[] {
        
        return this._spaceType.slice();
    }

    @action
    getSpaceTypeById(id: number): SpaceType {
        return this._spaceType.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedspaceType(spaceTypeId: number){
        this.lastInsertedSpaceType = spaceTypeId;
    }

    get lastInsertedspaceType():number{
        if(this.lastInsertedSpaceType) 
            return this.lastInsertedSpaceType;
        else 
            return null;
    }
    get individualSpaceTypeId(){
        return this.individualSpaceType;
    } 

}

export const SpaceTypeMasterStore = new Store();