import { action, computed, observable } from "mobx-angular";
import { EventRiskAnalysis, EventRiskAssessment, EventRiskAssessmentDetails, EventRiskAssessmentPaginationResponse, EventRiskAssessmentWorkFlowDetails } from "src/app/core/models/event-monitoring/risk-assessment/risk-assessment";
import { ContextChart } from "src/app/core/models/risk-management/risks/risks";
import { AuthStore } from "../../auth.store";

class Store{
    @observable
    private _eventRiskList: EventRiskAssessment[] = [];

    @observable
    private _eventRiskDetails:EventRiskAssessmentDetails;

    @observable
    private _eventRiskAnalysis:EventRiskAnalysis;

    @observable
    private _bcmRiskContents: any[] = [];

    @observable
    contextChartLoaded:boolean=false;

    @observable
    _contextChartDetails:ContextChart=null;

    @observable
    lastInsertedId: number = null;

    @observable
    corporate:boolean=false;

    @observable
    loaded: boolean = false;

    @observable
    assessmentLoaded: boolean = false;

    @observable
    detailsLoaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_continuity_plans.reference_code';

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    currentVersionId:number = null;

    @observable
    eventRiskWorkflow: EventRiskAssessmentWorkFlowDetails[] = [];

    @observable
    selectedId: number = null;

    @observable
    selectedProcessId: number = null;

    @observable
    is_from_info: boolean = false;

    @observable
    is_edit: boolean=false;

    @observable
    calculationMethod = null;

    @action
    setEventRiskResponse(response: EventRiskAssessmentPaginationResponse) {
        this._eventRiskList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    setAssessmentId(id: number) {

        this.selectedId = id;
    }

    @action
    setProcessId(id){
        this.selectedProcessId = id
    }

    @action
    unsetEventRiskList() {
        this._eventRiskList = [];
        this.loaded = false;  
    }

    @action
    setContextChartDetails(details:ContextChart){
        this._contextChartDetails = details;
        this.contextChartLoaded = true;
    }

    @action
    setEventRiskDetails(eventRiskDetails: EventRiskAssessmentDetails){
        this._eventRiskDetails = eventRiskDetails;
        this.selectedId = eventRiskDetails.id
        this.detailsLoaded = true;
    }

    @action
    unsetEventRiskDetails(){
        this._eventRiskDetails = null;
        this.detailsLoaded = false;
        this._bcmRiskContents = [];
        this.workflowLoaded = false;
        this.eventRiskWorkflow = [];
    }

    @action
    setEventRiskAnalysis(eventRiskDetails: EventRiskAnalysis){
        this._eventRiskAnalysis = eventRiskDetails;
        this.assessmentLoaded = true
    }

    @action
    unsetEventRiskAnalysis(){
        this._eventRiskAnalysis = null;
        this.assessmentLoaded = false;
    }

    @action
    setEventRiskContents(contents: any){
        this._bcmRiskContents = contents;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get contextChartDetails():ContextChart{
        return this._contextChartDetails;
    }

    @computed
    get eventRiskList(): EventRiskAssessment[] {
        return this._eventRiskList.slice();
    }

    @computed
    get eventRiskDetails(): EventRiskAssessmentDetails{
        return this._eventRiskDetails;
    }

    @computed
    get eventRiskAnalysis(): EventRiskAnalysis{
        return this._eventRiskAnalysis;
    }

    @computed
    get eventRiskContents(){
        return this._bcmRiskContents;
    }

    @observable
    workflowLoaded: boolean = false;

    @observable
    workflowType: string;

    @observable
    workflowItemsPerPage: number = null;

    @observable
    workflowTotalItems: number = null;

    isProperEditUser() {
   
    
        // if(RiskJourneyStore._individualRiskJourneyLoaded){
          if(EventRiskAssessmentStore.eventRiskDetails?.risk_status?.type=='identified'){
            if(this.isProperUser)
              return true;
            else
              return false
          }
          else if(EventRiskAssessmentStore.eventRiskDetails?.risk_status?.type!='identified' && EventRiskAssessmentStore.eventRiskDetails?.risk_status.type!='approved'){
             if(this.isProperUser())
               return true;
             else
             return false;
            
          }
          else
            return false;
      }

      isProperUser() {
    
        if (AuthStore.user.id == EventRiskAssessmentStore.eventRiskDetails?.created_by.id) {
          return true;
        }
        else {
          return false;
        }
  
}
 
}

export const EventRiskAssessmentStore = new Store()