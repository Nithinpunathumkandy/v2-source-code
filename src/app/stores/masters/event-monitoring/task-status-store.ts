import { observable, action, computed } from "mobx-angular";
import {Taskstatus,TaskstatusPaginationResponse,TaskstatusSingle} from '../../../core/models/masters/event-monitoring/task-status';

class Store{
    @observable 
     _taskstatus:Taskstatus[]=[];

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
    individualTaskstatus: TaskstatusSingle;

    @observable
    orderItem: string = 'event_task_statuses.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedTaskstatus: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setTaskstatus(response:TaskstatusPaginationResponse){
        this._taskstatus=response.data;
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
    updateTaskstatus(Taskstatus: Taskstatus) {
        const taskstatus: Taskstatus[] = this._taskstatus.slice();
        const index: number = taskstatus.findIndex(e => e.id == Taskstatus.id);
        if (index != -1) {
            Taskstatus[index] = Taskstatus;
            this._taskstatus = taskstatus;
        }
    }
    @action
    setIndividualTaskstatus(taskstatus: TaskstatusSingle) {
       
        this.individualTaskstatus = taskstatus;
        this.individualLoaded = true;
        
    }

    @computed
    get taskstatus(): Taskstatus[] {
        
        return this._taskstatus.slice();
    }

    @action
    getTaskstatusById(id: number): Taskstatus {
        return this._taskstatus.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedtaskstatus(taskstatusId: number){
        this.lastInsertedTaskstatus = taskstatusId;
    }

    get lastInsertedtaskstatus():number{
        if(this.lastInsertedTaskstatus) 
            return this.lastInsertedTaskstatus;
        else 
            return null;
    }
    get individualTaskstatusId(){
        return this.individualTaskstatus;
    } 

}

export const TaskstatusMasterStore = new Store();