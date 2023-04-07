import {observable,action,computed } from "mobx-angular";

class Store  {
     @observable
     _planByStatus = null;

     @observable
     dashboardLoaded: boolean = false;

     @observable
     _programByCategories = null;

     @observable
     _filterParams = null

     @observable
     _correctiveActionByStatus = null;

     @observable
     schdueleByStatus = null;

     @observable
     findingCategory=null;

     @observable
     caDelayCount=null;

     @observable
     _findingsByDepartment = null;

     @observable
     _findingsByMsType = null;

     @observable
     _findingsByStatus = null;

     @observable
     _auditCounts = null;

     @observable
     _auditFindingCounts = null;

    @action 
    setPlanByStatus(data){
        this._planByStatus = data
    }

    @action 
    setProgramByCategories(data){
        this._programByCategories = data
    }

    @action 
    setCorrectiveActionByStatus(data){
        this._correctiveActionByStatus = data
    }

    @action 
    setScheduleByStatus(data){
        this.schdueleByStatus = data
    }

    @action 
    setFindingsByDepartment(data){
        this._findingsByDepartment = data
    }

    @action 
    setFindingsByMsType(data){
        this._findingsByMsType = data
    }

    @action 
    setFindingsByStatus(data){
        this._findingsByStatus = data
    }

    @action 
    setFindingsByCategory(data){
        this.findingCategory = data
    }

    @action
    setCaDelayCount(data)
    {
        this.caDelayCount = data
    }
    
    @action 
    setFilterParams(data){
        this._filterParams = data
    }

    @action 
    setAuditCounts(data){
        this._auditCounts = data
    }

    @action 
    setAuditFindingCounts(data){
        this._auditFindingCounts = data
        this.dashboardLoaded = true;
    }


    @computed
    get planByStatus(){
        return this._planByStatus
    }

    @computed
    get filterParams(){
        return this._filterParams
    }

    @computed
    get programByCategories(){
        return this._programByCategories
    }

    @computed
    get correctiveActionByStatus(){
        return this._correctiveActionByStatus
    }
    @computed
    get findingsByDepartment(){
        return this._findingsByDepartment
    }

    @computed
    get findingsByMsType(){
        return this._findingsByMsType
    }

    @computed
    get findingsByStatus(){
        return this._findingsByStatus
    }
    @computed
    get auditCount(){
        return this._auditCounts
    }

    @computed
    get auditFindingCount(){
        return this._auditFindingCounts
    }

    // @action 
    // setLoader(){
    //     if( this._planByStatus!=null && 
    //         this._programByCategories != null &&
    //         this._correctiveActionByStatus != null &&
    //         this._findingsByDepartment != null &&
    //         this._findingsByMsType != null &&
    //         this._findingsByStatus != null &&
    //         this._auditCounts != null && 
    //         this._auditFindingCounts != null )
    //         {
    //             this.dashboardLoaded = true
    //         }
    // }

    @action 
    unsetDashboard(){
        this._planByStatus = null
        this._programByCategories = null
        this._correctiveActionByStatus = null
        this._findingsByDepartment = null
        this._findingsByMsType = null
        this._findingsByStatus = null
        this._auditCounts = null
        this._auditFindingCounts = null

        this.dashboardLoaded = false
    }

    
}
export const AuditDashboardStore =  new Store()