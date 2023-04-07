import { observable, action, computed } from "mobx-angular";
import { RiskHeatMap } from "src/app/core/models/risk-management/risk-heat-map/risk-heat-map";

class Store {

    @observable
    private _riskHeatMapDetails: RiskHeatMap[] = [];

    @observable
    private _heatMapByCategoryDetails: RiskHeatMap[] = [];
    
    @observable
    private _heatMapByDepartmentDetails: RiskHeatMap[] = [];

    @observable
    private _heatMapByDivisionDetails: RiskHeatMap[] = [];

    @observable
    private _heatMapBySectionDetails: RiskHeatMap[] = [];

    @observable
    private _heatMapBySourceDetails: RiskHeatMap[] = [];
    
    

    @observable
    loaded: boolean = false;

    
    @observable
    categoryLoaded: boolean = false;

    @observable
    departmentLoaded: boolean = false;

    @observable
    divisionLoaded: boolean = false;

    @observable
    sectionLoaded: boolean = false;

    @observable
    sourceLoaded: boolean = false;

    @action
    setRiskHeatMapDetails(response: RiskHeatMap[]) {
        this._riskHeatMapDetails = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetRiskHeatMapDetails() {
        this._riskHeatMapDetails = [];
        this.loaded = false;
    }

    @computed
    get riskHeatMapDetails(): RiskHeatMap[] {

        return this._riskHeatMapDetails;
    }


   
    @action
    setHeatMapByCategoryDetails(response: RiskHeatMap[]) {
        this._heatMapByCategoryDetails = response;
        this.categoryLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHeatMapByCategoryDetails() {
        this._heatMapByCategoryDetails = [];
        this.categoryLoaded = false;
    }

    @computed
    get heatMapByCategoryDetails(): RiskHeatMap[] {

        return this._heatMapByCategoryDetails;
    }

    
    @action
    setHeatMapByDepartmentDetails(response: RiskHeatMap[]) {
        this._heatMapByDepartmentDetails = response;
        this.departmentLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHeatMapByDepartmentDetails() {
        this._heatMapByDepartmentDetails = [];
        this.departmentLoaded = false;
    }

    @computed
    get heatMapByDepartmentDetails(): RiskHeatMap[] {

        return this._heatMapByDepartmentDetails;
    }

    @action
    setHeatMapByDivisionDetails(response: RiskHeatMap[]) {
        this._heatMapByDivisionDetails = response;
        this.divisionLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHeatMapByDivisionDetails() {
        this._heatMapByDivisionDetails = [];
        this.divisionLoaded = false;
    }

    @computed
    get heatMapByDivisionDetails(): RiskHeatMap[] {

        return this._heatMapByDivisionDetails;
    }

    @action
    setHeatMapBySectionDetails(response: RiskHeatMap[]) {
        this._heatMapBySectionDetails = response;
        this.sectionLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHeatMapBySectionDetails() {
        this._heatMapBySectionDetails = [];
        this.sectionLoaded = false;
    }

    @computed
    get heatMapBySectionDetails(): RiskHeatMap[] {

        return this._heatMapBySectionDetails;
    }

    @action
    setHeatMapBySourceDetails(response: RiskHeatMap[]) {
        this._heatMapBySourceDetails = response;
        this.sourceLoaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHeatMapBySourceDetails() {
        this._heatMapBySourceDetails = [];
        this.sourceLoaded = false;
    }

    @computed
    get heatMapBySourceDetails(): RiskHeatMap[] {

        return this._heatMapBySourceDetails;
    }
  

}

export const RiskHeatMapStore = new Store();