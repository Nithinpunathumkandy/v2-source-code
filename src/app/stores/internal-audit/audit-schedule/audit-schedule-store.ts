
import { observable, action, computed } from "mobx-angular";

import { AuditSchedules,AuditSchedulesPaginationResponse } from 'src/app/core/models/internal-audit/audit-schedule/audit-schedule';


class Store {
    @observable
    private _auditSchedules: AuditSchedules[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    answered_one: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    individualSchedule: AuditSchedules;

    @observable
    orderItem: string = 'audit_schedules.title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable

    auditSchedule_id: number = null;
    active_schedule_id:number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setAuditScheduleId(id:number){
        this.auditSchedule_id = id;
    }

    @action
    setIndividualAuditSchedule(auditSchedule: AuditSchedules) {
       
        this.individualSchedule = auditSchedule;
        this.individualLoaded = true;
        
    }




    @action
    setAuditSChedules(response: AuditSchedulesPaginationResponse) {
        

        this._auditSchedules = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllAuditSChedules(auditSchedule: AuditSchedules[]) {
       
        this._auditSchedules = auditSchedule;
        this.loaded = true;
        
    }
    
    @action
    unsetAllAuditSChedules() {   
        this._auditSchedules = [];
        this.loaded = false;    
    }

    @computed
    get allItems(): AuditSchedules[] {
        
        return this._auditSchedules.slice();
    }

    

    @action
    getAuditSCheduleById(id: number): AuditSchedules {
        return this._auditSchedules.slice().find(e => e.id == id);
    }


    get auditScheduleDetails() : AuditSchedules{
        return this.individualSchedule;
    } 
  
}

export const AuditSchedulesStore = new Store();

