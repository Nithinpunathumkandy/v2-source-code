

import { observable, action, computed } from "mobx-angular";

import { AuditPlan,AuditPlanPaginationResponse , Schedules} from 'src/app/core/models/internal-audit/audit-plan/audit-plan';
import { Image } from "src/app/core/models/image.model";
import { AuditCriterion } from 'src/app/core/models/masters/internal-audit/audit-criterion';
import { AuditObjective } from 'src/app/core/models/masters/internal-audit/audit-objective';


class Store {
    @observable
    private _auditPlans: AuditPlan[] = [];

    @observable
    private _auditSchedule: Schedules[] = [];

    @observable 
    loaded:boolean=false;


    @observable
    individualLoaded: boolean = false;


    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    individualAuditPlan: AuditPlan;

    @observable
    individualAuditSchedule: Schedules;

    @observable
    orderItem: string = 'audit_plans.id';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];


    @observable
    last_page: number = null;

    $observable
    selected: number = null;

    @observable

    auditPlan_id: number = null;

    @observable

    auditSchedules: any;

    @observable
    selectedCriteriaList: AuditCriterion[] = [];

    @observable
    selectedObjectivelist: AuditObjective[]=[];

    @observable
    objectiveToDisplay: any = [];

    @observable

    criteriaToDisplay: any = [];

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    _auditorLeader=[];

    @observable
    _auditeeLeader=[];

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
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    @action
    setIndividualAuditPlan(audit: AuditPlan) {
       
        this.individualAuditPlan = audit;
        this.individualLoaded = true;
        
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }





    @action
    addSelectedCriteria(criteria, criteriaToDisplay) {
        this.selectedCriteriaList = criteria;
        this.criteriaToDisplay = criteriaToDisplay;
    }



    @action
    unSelectCriteria(){
        this.selectedCriteriaList = [];
        this.criteriaToDisplay = [];
    }



    @action
    addSelectedObjective(objective, objectiveToDisplay) {
        this.selectedObjectivelist = objective;
        this.objectiveToDisplay = objectiveToDisplay;
    }

    @action
    unSelectObjective(){
        this.selectedObjectivelist = [];
        this.objectiveToDisplay = [];
    }

    @action
    setAuditPlanId(id:number){
        this.auditPlan_id = id;
    }

    @action

    setauditPlanSchedule(res: Schedules[]){

        this._auditSchedule = res;
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    setAuditPlan(response: AuditPlanPaginationResponse) {
        

        this._auditPlans = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    unsetAuditPlan() {  
        this._auditPlans = [];
        this.loaded = false;  
    }

    @action
    setAllAuditPlan(audit: AuditPlan[]) {
       
        this._auditPlans = audit;
        this.loaded = true;
        
    }

    
    @computed
    get allItems(): AuditPlan[] {
        
        return this._auditPlans.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getAuditPlanById(id: number): AuditPlan {
        return this._auditPlans.slice().find(e => e.id == id);
    }


    @action
    getAuditPlanScheduleById(id: number): Schedules {
        this.auditSchedules = this._auditSchedule.slice().find(e => e.id == id);
        return this.auditSchedules;
    }
    get auditPlanScheduleDetails() : Schedules{
        return this.auditSchedules;
    } 

    get auditPlanDetails() : AuditPlan{
        return this.individualAuditPlan;
    } 

    get selectedItem():number{
        return this.selected;
    }
    

  
}

export const AuditPlanStore = new Store();

