import { observable, action, computed } from "mobx-angular";
import {CompetencyTypes,CompetencyTypesPaginationResponse} from '../../../core/models/masters/human-capital/competency-types'

class Store{
    @observable 
    private _competencyTypes:CompetencyTypes[]=[];

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
    orderItem: string = 'competency_types.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedCompetencyTypes: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setCompetencyTypes(response:CompetencyTypesPaginationResponse){
        this._competencyTypes=response.data;
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
    updateCompetencyTypes(CompetencyTypes: CompetencyTypes) {
        const competencyTypes: CompetencyTypes[] = this._competencyTypes.slice();
        const index: number = competencyTypes.findIndex(e => e.id == CompetencyTypes.id);
        if (index != -1) {
            CompetencyTypes[index] = CompetencyTypes;
            this._competencyTypes = competencyTypes;
        }
    }

    @computed
    get competencyTypes(): CompetencyTypes[] {
        
        return this._competencyTypes.slice();
    }

    @action
    getCompetencyTypesById(id: number): CompetencyTypes {
        return this._competencyTypes.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedcompetencyTypes(competencyTypesId: number){
        this.lastInsertedCompetencyTypes = competencyTypesId;
    }

    get lastInsertedcompetencyTypes():number{
        if(this.lastInsertedCompetencyTypes) 
            return this.lastInsertedCompetencyTypes;
        else 
            return null;
    }

}

export const CompetencyTypesMasterStore = new Store();