import { observable, action, computed } from "mobx-angular";
import {RiskAssessment} from 'src/app/core/models/risk-management/risks/risk-assessment';

class Store {

    @observable
    private _riskAssessmentDetails: RiskAssessment = null;

    @observable
    private _riskProcessDetails: RiskAssessment = null;

    @observable
    loaded: boolean = false;
    
    @observable
    processLoaded: boolean = false;


    @action
    setAssessmentDetails(response: RiskAssessment) {
        this._riskAssessmentDetails = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetAssessmentDetails() {
        this._riskAssessmentDetails = {risk_analysis:null,risk_processes:[],risk_controls:[]}
        this.loaded = false;
        //this.updateUserJob(response.data);
    }

    @action
    setAssessmentByProcess(response: RiskAssessment) {
        this._riskProcessDetails = response;
        this.processLoaded = true;
        //this.updateUserJob(response.data);
    }

    


    @computed
    get riskAssessmentDetails(): RiskAssessment {

        return this._riskAssessmentDetails;
    }


    @computed
    get riskProcessDetails(): RiskAssessment {

        return this._riskProcessDetails;
    }


}

export const IsmsRiskAssessmentStore = new Store();