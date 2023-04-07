import { observable, action, computed } from "mobx-angular";
import { ObjectiveType,ObjectiveTypePaginationResponse,ObjectiveTypeSingle } from "src/app/core/models/masters/event-monitoring/objective-type";


class Store{
    @observable 
    private _objectiveType:ObjectiveType[]=[];

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
    individualObjectiveType: ObjectiveTypeSingle;

    @observable
    orderItem: string = 'objective_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedObjectiveType: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setObjectiveType(response:ObjectiveTypePaginationResponse){
        this._objectiveType=response.data;
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
    updateObjectiveType(ObjectiveType: ObjectiveType) {
        const objectiveType: ObjectiveType[] = this._objectiveType.slice();
        const index: number = objectiveType.findIndex(e => e.id == ObjectiveType.id);
        if (index != -1) {
            ObjectiveType[index] = ObjectiveType;
            this._objectiveType = objectiveType;
        }
    }
    @action
    setIndividualObjectiveType(objectiveType: ObjectiveTypeSingle) {
       
        this.individualObjectiveType = objectiveType;
        this.individualLoaded = true;
        
    }

    @computed
    get objectiveType(): ObjectiveType[] {
        
        return this._objectiveType.slice();
    }

    @action
    getObjectiveTypeById(id: number): ObjectiveType {
        return this._objectiveType.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedobjectiveType(objectiveTypeId: number){
        this.lastInsertedObjectiveType = objectiveTypeId;
    }

    get lastInsertedobjectiveType():number{
        if(this.lastInsertedObjectiveType) 
            return this.lastInsertedObjectiveType;
        else 
            return null;
    }
    get individualObjectiveTypeId(){
        return this.individualObjectiveType;
    } 

}

export const ObjectiveTypeMasterStore = new Store();