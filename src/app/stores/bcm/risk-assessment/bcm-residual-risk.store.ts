import { observable, action, computed } from "mobx-angular";
import { BcmRiskResidualAnalysis } from "src/app/core/models/bcm/risk-assessment/risk-assessment";
import {Chart, ResidualRisk,RiskProcess} from 'src/app/core/models/risk-management/risks/residual-risk';

class Store {

    @observable
    private _residualRiskDetails: BcmRiskResidualAnalysis = null;

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
    setResidualDetails(response: BcmRiskResidualAnalysis) {
        this._residualRiskDetails = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }


    @computed
    get residualRiskDetails(): BcmRiskResidualAnalysis {

        return this._residualRiskDetails;
    }


    @action
    setResidualByProcess(response: RiskProcess[]) {
        this._riskProcessDetails = response;
        this.processLoaded = true;
        //this.updateUserJob(response.data);
    }

    @computed
    get riskProcessDetails(): RiskProcess[] {

        return this._riskProcessDetails;
    }

    @action
    setChartDetails(response: Chart) {
        this._chartDetails = response;
        this.chartLoaded = true;
        //this.updateUserJob(response.data);
    }

    @computed
    get chartDetails():Chart{
        return this._chartDetails;
    }

  

}

export const BcmResidualRiskStore = new Store();