import { action, computed, observable } from "mobx-angular";
import { BcmRiskAnalysis, BcmRiskAssessment, BcmRiskAssessmentDetails, BcmRiskAssessmentPaginationResponse, BcmRiskAssessmentWorkFlowDetails } from "src/app/core/models/bcm/risk-assessment/risk-assessment";
import { ContextChart } from "src/app/core/models/risk-management/risks/risks";
import { AuthStore } from "../../auth.store";

class Store{
    @observable
    private _bcmRiskList: BcmRiskAssessment[] = [];

    @observable
    private _bcmRiskDetails:BcmRiskAssessmentDetails;

    @observable
    private _bcmRiskAnalysis:BcmRiskAnalysis;

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
    bcmRiskWorkflow: BcmRiskAssessmentWorkFlowDetails[] = [];

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
    setBcmRiskResponse(response: BcmRiskAssessmentPaginationResponse) {
        this._bcmRiskList = response.data;
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
    unsetBcmRiskList() {
        this._bcmRiskList = [];
        this.loaded = false;  
    }

    @action
    setContextChartDetails(details:ContextChart){
        this._contextChartDetails = details;
        this.contextChartLoaded = true;
    }

    @action
    setBcmRiskDetails(bcmRiskDetails: BcmRiskAssessmentDetails){
        this._bcmRiskDetails = bcmRiskDetails;
        this.selectedId = bcmRiskDetails.id
        this.detailsLoaded = true;
    }

    @action
    unsetBcmRiskDetails(){
        this._bcmRiskDetails = null;
        this.detailsLoaded = false;
        this._bcmRiskContents = [];
        this.workflowLoaded = false;
        this.bcmRiskWorkflow = [];
    }

    @action
    setBcmRiskAnalysis(bcmRiskDetails: BcmRiskAnalysis){
        this._bcmRiskAnalysis = bcmRiskDetails;
        this.assessmentLoaded = true
    }

    @action
    unsetBcmRiskAnalysis(){
        this._bcmRiskAnalysis = null;
        this.assessmentLoaded = false;
    }

    @action
    setBcmRiskContents(contents: any){
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
    get BcmRiskList(): BcmRiskAssessment[] {
        return this._bcmRiskList.slice();
    }

    @computed
    get bcmRiskDetails(): BcmRiskAssessmentDetails{
        return this._bcmRiskDetails;
    }

    @computed
    get bcmRiskAnalysis(): BcmRiskAnalysis{
        return this._bcmRiskAnalysis;
    }

    @computed
    get bcmRiskContents(){
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
          if(BcmRiskAssessmentStore.bcmRiskDetails?.risk_status?.type=='identified'){
            if(this.isProperUser)
              return true;
            else
              return false
          }
          else if(BcmRiskAssessmentStore.bcmRiskDetails?.risk_status?.type!='identified' && BcmRiskAssessmentStore.bcmRiskDetails?.risk_status.type!='approved'){
             if(this.isProperUser())
               return true;
             else
             return false;
            
          }
          else
            return false;
      }

      isProperUser() {
    
        if (AuthStore.user.id == BcmRiskAssessmentStore.bcmRiskDetails?.created_by.id) {
          return true;
        }
        else {
          return false;
        }
  
}
 
}

export const BcmRiskAssessmentStore = new Store()