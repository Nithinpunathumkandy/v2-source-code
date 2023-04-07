import { observable, action, computed } from "mobx-angular";
import { EventRiskJourney, RootCauseAnalysis } from "src/app/core/models/event-monitoring/risk-assessment/event-risk-journey";
import {RiskTreatment,RiskSummary} from 'src/app/core/models/risk-management/risks/risk-treatment';

class Store {

    @observable
    public _individualRiskJourneyLoaded: boolean = false;
    
    @observable
    private _individualRiskJourney: EventRiskJourney;

    @observable
    private _rca: RootCauseAnalysis[] = [];

    @observable
    private _summaryDetails:RiskSummary = null;

    @observable
    private _riskTreatmentList: RiskTreatment[] = [];

    @computed
    get allItems(): RootCauseAnalysis[] {
        return this._rca.slice();
    }

    @action
    setIndividualRiskJourney(risk: EventRiskJourney) {
        this._individualRiskJourney = risk;
        this._individualRiskJourneyLoaded = true;
    }

    unsetIndividualRiskJourney() {
        this._individualRiskJourney = null;
        this._individualRiskJourneyLoaded = false;
    }

    @computed
    get individualRiskJourney(): EventRiskJourney {
        return this._individualRiskJourney;
    }

}

export const EventRiskJourneyStore = new Store();