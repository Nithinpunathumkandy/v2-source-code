import { observable, action, computed } from "mobx-angular";
import { IndividualRiskRegister, RiskRegisterPaginationResponse } from "src/app/core/models/event-monitoring/risk-register/risk-register";
import { ContextChart } from "src/app/core/models/risk-management/risks/risks";
import { AuthStore } from "../../auth.store";

class Store{

    @observable
    private _riskRegister: IndividualRiskRegister[] = [];

    @observable
    private _individualRiskRegisterDetails: IndividualRiskRegister;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    _contextChartDetails:ContextChart=null;

    @observable
    contextChartLoaded:boolean=false;

    @action
    setContextChartDetails(details:ContextChart){
        this._contextChartDetails = details;
        this.contextChartLoaded = true;
    }

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    RiskRegisterId: number = null;

    @observable
    path: string = '../';

    // form modal
    @observable
    ImprovementPlansformModal:boolean=false;

    @observable
    update_modal_form: boolean = false;
    
    @observable
    history_modal_form: boolean = false;
    
    @observable
    activity_log_form_modal: boolean = false;
    // **form modal

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setPath( url: string) {
        this.path = url;
    }

    @computed
    get contextChartDetails():ContextChart{
        return this._contextChartDetails;
    }

    @action
    setRiskRegisters(response: RiskRegisterPaginationResponse) {

        this._riskRegister = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unRiskRegisters(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._riskRegister = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): IndividualRiskRegister[] {
        return this._riskRegister.slice();
    }

    @action
    setRiskRegisterId(id: number) {
        this.RiskRegisterId = id;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setIndividualRiskRegisterDetails(details: IndividualRiskRegister) {
        this.individualLoaded = true;
        this._individualRiskRegisterDetails = details;
    }

    @action
    unsetIndividualRiskRegisterDetails() {
        this.individualLoaded = false;
        this._individualRiskRegisterDetails = null;
    }
    
    @computed
    get individualRiskRegisterDetails(): IndividualRiskRegister {
        return this._individualRiskRegisterDetails;
    }

    isProperEditUser() {
   
    
        // if(RiskJourneyStore._individualRiskJourneyLoaded){
          if(RiskRegisterStore.individualRiskRegisterDetails?.risk_status?.type=='identified'){
            if(this.isProperUser)
              return true;
            else
              return false
          }
          else if(RiskRegisterStore.individualRiskRegisterDetails?.risk_status?.type!='identified' && RiskRegisterStore.individualRiskRegisterDetails?.risk_status.type!='approved'){
             if(this.isProperUser())
               return true;
             else
             return false;
            
          }
          else
            return false;
      }

      isProperUser() {
    
        if (AuthStore.user.id == RiskRegisterStore.individualRiskRegisterDetails?.created_by.id) {
          return true;
        }
        else {
          return false;
        }
  
}

    //**Detials


}
export const RiskRegisterStore = new Store();