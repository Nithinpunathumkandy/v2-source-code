import { observable, action, computed } from "mobx-angular";
import { Risk, RiskPaginationResponse, IndividualRisk, ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { AuthStore } from "../../auth.store";
import { IsmsRiskJourneyStore } from "./isms-risk-journey.store";
class Store {
    @observable
    private _riskList: Risk[] = [];

    @observable
    private _assetCategoryList = [];

    @observable
    private _assetList = [];

    @observable
    loaded: boolean = false;

    @observable
    categoryLoaded: boolean = false;

    
    @observable
    assetLoaded: boolean = false;

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
    calculationMethod: any;

    @observable
    dashboardParam: string = null;

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
    updateRisk(risk
        ) {
        const ismsRisks: Risk[] = this._riskList.slice();
        const index: number = ismsRisks.findIndex(e => e.id == risk.id);
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
        IsmsRisksStore.setIndividualRiskDetails(riskList);
        return riskList;
    }

    @action
    setIndividualRiskDetails(details:IndividualRisk) {
        this.individual_risk_loaded = true;
        this._individualRiskDetails = details;
        this.updateRisk(details);
    }
    @action
    setAssetCategories(details:any) {
        this.categoryLoaded = true;
        this._assetCategoryList = details;
    }

    @action
    setAssets(details:any) {
        this.assetLoaded = true;
        this._assetList = details.data;
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

    @computed
    get assetCategories(): any {
        return this._assetCategoryList.slice();
    }

    @computed
    get assets(): any {
        return this._assetList?.slice();
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParam = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParam;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParam = null;
    }

       
  isProperEditUser() {
   
    
    // if(RiskJourneyStore._individualRiskJourneyLoaded){
      if(IsmsRisksStore.individualRiskDetails?.risk_status?.type=='identified' && IsmsRisksStore.individualRiskDetails?.submitted_by==null){
        if(this.isProperUser)
          return true;
        else
          return false
      }
      else if(IsmsRisksStore.individualRiskDetails?.risk_status?.type!='identified' && (IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by==null || (IsmsRiskJourneyStore.individualRiskJourney?.journey_submitted_by!=null &&IsmsRisksStore.individualRiskDetails?.risk_status.type!='approved'))){
         if(this.isProperUser())
           return true;
         else
         return false;
        
      }
      else
        return false;
    

   
  }


  


  isProperUser() {
    
          if (AuthStore.user.id == IsmsRisksStore.individualRiskDetails?.created_by.id) {
            return true;
          }
          else {
            return false;
          }
    
  }


}

export const IsmsRisksStore = new Store();