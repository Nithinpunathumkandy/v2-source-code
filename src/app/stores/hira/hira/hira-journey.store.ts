import { observable, action, computed } from "mobx-angular";

import { RiskJourney , RootCauseAnalysis , RiskSummary , RiskTreatment } from 'src/app/core/models/hira/hira-register/hira-journey';
import {RiskAssessment} from 'src/app/core/models/hira/hira-register/hira-assessment';


class Store {
    @observable
    private _riskJourney: RiskJourney[] = [];

    @observable
    public _individualRiskJourneyLoaded: boolean = false;

    @observable
    private _individualRiskJourney: RiskJourney;

    @observable
    private _rca: RootCauseAnalysis[] = [];

    @observable
    private _riskAssessmentDetails: RiskAssessment = null;

    @observable
    private _summaryDetails:RiskSummary = null;

    @observable
    private _riskTreatmentList: RiskTreatment[] = [];

    @computed
    get allItems(): RootCauseAnalysis[] {
        
        return this._rca.slice();
    }

    @computed
    get riskAssessmentDetails(): RiskAssessment {

        return this._riskAssessmentDetails;
    }

    @computed
    get summaryDetails(){
        return this._summaryDetails;
    }

    @computed
    get riskTreatmentList(): RiskTreatment[] {

        return this._riskTreatmentList.slice();
    }

    @action
    setIndividualRiskJourney(risk: RiskJourney) {
        this._individualRiskJourney = risk;
        this._individualRiskJourneyLoaded = true;
    }

    unsetIndividualRiskJourney() {
        this._individualRiskJourney = null;
        this._individualRiskJourneyLoaded = false;
    }

    @computed
    get individualRiskJourney(): RiskJourney {
        return this._individualRiskJourney;
    }
}

export const RiskJourneyStore = new Store();