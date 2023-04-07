import { observable, action, computed } from "mobx-angular";
import { EventRiskResidualAnalysis } from "src/app/core/models/event-monitoring/risk-assessment/risk-residual";
import { Chart,RiskProcess } from 'src/app/core/models/risk-management/risks/residual-risk';

class Store {

    @observable
    private _residualRiskDetails: EventRiskResidualAnalysis = null;

    @observable
    private _riskProcessDetails: RiskProcess[] = [];

    
    @observable
    private _chartDetails: Chart = null;

    @observable
    loaded: boolean = false;

    
    @observable
    processLoaded: boolean = false;

    @observable
    chartLoaded:boolean = false;

    @action
    setResidualDetails(response: EventRiskResidualAnalysis) {
        this._residualRiskDetails = response;
        this.loaded = true;
    }

    @action
    unsetResidualDetails() {
        this._residualRiskDetails = null;
        this.loaded = false;
    }


    @computed
    get residualRiskDetails(): EventRiskResidualAnalysis {
        return this._residualRiskDetails;
    }


    @action
    setResidualByProcess(response: RiskProcess[]) {
        this._riskProcessDetails = response;
        this.processLoaded = true;
    }

    @computed
    get riskProcessDetails(): RiskProcess[] {
        return this._riskProcessDetails;
    }

    @action
    setChartDetails(response: Chart) {
        this._chartDetails = response;
        this.chartLoaded = true;
    }

    @computed
    get chartDetails():Chart{
        return this._chartDetails;
    }
}

export const EventResidualRiskStore = new Store();