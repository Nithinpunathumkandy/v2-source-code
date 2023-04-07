import { observable, action, computed } from "mobx-angular";
import {Checklist,ChecklistPaginationResponse,ChecklistSingle} from '../../../core/models/masters/event-monitoring/checklist';

class Store{
    @observable 
    private _checklist:Checklist[]=[];

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
    individualChecklist: ChecklistSingle;

    @observable
    orderItem: string = 'event_checklists.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedChecklist: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setChecklist(response:ChecklistPaginationResponse){
        this._checklist=response.data;
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
    updateChecklist(Checklist: Checklist) {
        const checklist: Checklist[] = this._checklist.slice();
        const index: number = checklist.findIndex(e => e.id == Checklist.id);
        if (index != -1) {
            Checklist[index] = Checklist;
            this._checklist = checklist;
        }
    }
    @action
    setIndividualChecklist(checklist: ChecklistSingle) {
       
        this.individualChecklist = checklist;
        this.individualLoaded = true;
        
    }

    @computed
    get checklist(): Checklist[] {
        
        return this._checklist.slice();
    }

    @action
    getChecklistById(id: number): Checklist {
        return this._checklist.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedchecklist(checklistId: number){
        this.lastInsertedChecklist = checklistId;
    }

    get lastInsertedchecklist():number{
        if(this.lastInsertedChecklist) 
            return this.lastInsertedChecklist;
        else 
            return null;
    }
    get individualChecklistId(){
        return this.individualChecklist;
    } 

}

export const ChecklistMasterStore = new Store();