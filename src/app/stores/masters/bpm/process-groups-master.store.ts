import { observable, action, computed } from "mobx-angular";
import {ProcessGroups,ProcessGroupsPaginationResponse} from '../../../core/models/masters/bpm/process-groups'

class Store{
    @observable 
    private _processGroups:ProcessGroups[]=[];

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
    orderItem: string = 'process_groups.created_at';

    @observable
    from: number = null;

    @observable
    lastInsertedProcessGroup: number = null;

    searchText: string;


    @observable
    add_process_group_modal: boolean = false

    @action
    setProcessGroups(response:ProcessGroupsPaginationResponse){
        this._processGroups=response.data;
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
    updateProcessGroups(processGroup: ProcessGroups) {
        const processGroups: ProcessGroups[] = this._processGroups.slice();
        const index: number = processGroups.findIndex(e => e.id == processGroup.id);
        if (index != -1) {
            processGroups[index] = processGroup;
            this._processGroups = processGroups;
        }
    }

    @computed
    get processGroups(): ProcessGroups[] {
        
        return this._processGroups.slice();
    }

    @action
    getProcessGroupsById(id: number): ProcessGroups {
        return this._processGroups.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedProcessGroup(processCateogryId: number){
        this.lastInsertedProcessGroup = processCateogryId;
    }

    get lastInsertedprocessProcess():number{
        if(this.lastInsertedProcessGroup) 
            return this.lastInsertedProcessGroup;
        else 
            return null;
    }

}

export const ProcessGroupsMasterStore = new Store();