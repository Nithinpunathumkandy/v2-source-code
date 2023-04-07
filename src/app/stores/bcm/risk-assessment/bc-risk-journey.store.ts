import { observable, action, computed } from "mobx-angular";
import { BcmRiskJourney, RootCauseAnalysis } from "src/app/core/models/bcm/bcm-risk-journey/bcm-risk-journey";
import { Image } from "src/app/core/models/image.model";
import {RiskTreatment,RiskTreatmentPaginationResponse,IndividualRiskTreatment, RiskSummary, HistoryData, History} from 'src/app/core/models/risk-management/risks/risk-treatment';

class Store {

    @observable
    public _individualRiskJourneyLoaded: boolean = false;

    
    @observable
    private _individualRiskJourney: BcmRiskJourney;

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
    setIndividualRiskJourney(risk: BcmRiskJourney) {
        this._individualRiskJourney = risk;
        this._individualRiskJourneyLoaded = true;
    }

    unsetIndividualRiskJourney() {
        this._individualRiskJourney = null;
        this._individualRiskJourneyLoaded = false;
    }

    @computed
    get individualRiskJourney(): BcmRiskJourney {
        return this._individualRiskJourney;
    }

}

export const BcmRiskJourneyStore = new Store();