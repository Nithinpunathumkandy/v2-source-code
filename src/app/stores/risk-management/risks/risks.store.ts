import { observable, action, computed } from "mobx-angular";
import { Risk, RiskPaginationResponse, IndividualRisk, ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { AuthStore } from "../../auth.store";
import { RiskJourneyStore } from "./risk-journey.store";
class Store {
    @observable
    private _riskList: Risk[] = [];

    @observable
    loaded: boolean = false;

    @observable
    corporate:boolean=false;

    @observable
    addCorporate:boolean = false;

    
    @observable
    is_registered:boolean = true;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    private _individualRiskDetails: IndividualRisk;

    @observable
    individual_risk_loaded: boolean = false;

    @observable
    contextChartLoaded:boolean=false;

    @observable
    _contextChartDetails:ContextChart=null;


    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    riskId: number = null;


    @observable
    selected: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    searchText: string;

    @observable
    currentRiskPage=null;

    @observable
    riskReviewFrequency = null;

    @observable
    msTypes = [];

    @observable
    riskTypes = [];

    @observable
    users = [];

    @observable
    rcaDataLength: number = null;

    @observable
    risk_status_id: number = null;

    @observable
    impactList=[];

    @observable
    riskCauseList=[];

    @observable
    calculationMethod = null;

    @observable
    componentFrom = null;
    
    /*
        @despcrtion.. it is use Event Monitoring Module connection
        reson:- detials page are commen(but not need mapping event-monitoring/event-risks)  
        http://localhost:4200/event-monitoring/event-risks
    */
    @observable
    disable_Mapping_For_Event_Monitoring_Risk_Register:boolean=false;

    @action
    set_Disable_Mapping_For_Event_Monitoring_Risk_Register() {
        this.disable_Mapping_For_Event_Monitoring_Risk_Register = true;
    }

    @action
    unset_Disable_Mapping_For_Event_Monitoring_Risk_Register() {
        this.disable_Mapping_For_Event_Monitoring_Risk_Register = false;
    }

    @observable
    path: string = '../';

    @action
    setPath( url: string) {
        this.path = url;
    }
    // End**

    @action
    setRiskStatus(id: number) {
        this.risk_status_id = id;
    }

    @action
    setRiskDetails(response: RiskPaginationResponse) {
        this._riskList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;

    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateRisk(risk) {
        const risks: Risk[] = this._riskList.slice();
        const index: number = risks.findIndex(e => e.id == risk.id);
    }

    
    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }



    @computed
    get riskDetails(): Risk[] {

        return this._riskList.slice();
    }

    unsetRiskDetails(){
        this._riskList=[];
    }

    getRiskById(id: number): IndividualRisk {
        let riskList;

        riskList = this._riskList.slice().find(e => e.id == id);
        RisksStore.setIndividualRiskDetails(riskList);
        return riskList;
    }

    @action
    setIndividualRiskDetails(details:IndividualRisk) {
        this.individual_risk_loaded = true;
        this._individualRiskDetails = details;
        this.updateRisk(details);
    }

    @action
    setContextChartDetails(details:ContextChart){
        this._contextChartDetails = details;
        this.contextChartLoaded = true;
    }

    unsetIndiviudalRiskDetails() {
        this._individualRiskDetails = null;
        this.individual_risk_loaded = false;
    }

    @action
    setRiskId(id: number) {

        this.riskId = id;
    }



    // get userRiskById() {

    //     return this._individualRiskDetails;
    // }

    @computed
    get riskStatusId(){
        return this.risk_status_id;
    }

    @computed
    get contextChartDetails():ContextChart{
        return this._contextChartDetails;
    }

    @computed
    get individualRiskDetails(): IndividualRisk {
        return this._individualRiskDetails;
    }

       
  isProperEditUser() {
   
    
    // if(RiskJourneyStore._individualRiskJourneyLoaded){
      if(RisksStore.individualRiskDetails?.risk_status?.type=='identified' && RisksStore.individualRiskDetails?.submitted_by==null){
        if(this.isProperUser)
          return true;
        else
          return false
      }
      else if(RisksStore.individualRiskDetails?.risk_status?.type!='identified' && (RiskJourneyStore.individualRiskJourney?.journey_submitted_by==null || (RiskJourneyStore.individualRiskJourney?.journey_submitted_by!=null &&RisksStore.individualRiskDetails?.risk_status.type!='approved'))){
         if(this.isProperUser())
           return true;
         else
         return false;
        
      }
      else
        return false;
    

   
  }


  


  isProperUser() {
    
          if (AuthStore.user.id == RisksStore.individualRiskDetails?.created_by.id) {
            return true;
          }
          else {
            return false;
          }
    
  }


}

export const RisksStore = new Store();