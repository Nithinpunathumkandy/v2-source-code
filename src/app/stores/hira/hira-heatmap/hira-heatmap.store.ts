import { observable, action, computed } from "mobx-angular";
import { HiraHeatMap } from "src/app/core/models/hira/hira-heatmap/hira-heatmap";

class Store {

    @observable
    private _hiraHeatMapDetails: HiraHeatMap[] = [];

    @observable
    private _heatMapByCategoryDetails: HiraHeatMap[] = [];
    
    @observable
    private _heatMapByDepartmentDetails: HiraHeatMap[] = [];

    @observable
    private _heatMapByDivisionDetails: HiraHeatMap[] = [];

    @observable
    private _heatMapBySectionDetails: HiraHeatMap[] = [];

    @observable
    private _heatMapBySourceDetails: HiraHeatMap[] = [];
    
    

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
    setHiraHeatMapDetails(response: HiraHeatMap[]) {
        this._hiraHeatMapDetails = response;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    unsetHiraHeatMapDetails() {
        this._hiraHeatMapDetails = [];
        this.loaded = false;
    }

    @computed
    get HiraHeatMapDetails(): HiraHeatMap[] {

        return this._hiraHeatMapDetails;
    }


   
    @action
    setHeatMapByCategoryDetails(response: HiraHeatMap[]) {
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
    get heatMapByCategoryDetails(): HiraHeatMap[] {

        return this._heatMapByCategoryDetails;
    }

    
    @action
    setHeatMapByDepartmentDetails(response: HiraHeatMap[]) {
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
    get heatMapByDepartmentDetails(): HiraHeatMap[] {

        return this._heatMapByDepartmentDetails;
    }

    @action
    setHeatMapByDivisionDetails(response: HiraHeatMap[]) {
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
    get heatMapByDivisionDetails(): HiraHeatMap[] {

        return this._heatMapByDivisionDetails;
    }

    @action
    setHeatMapBySectionDetails(response: HiraHeatMap[]) {
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
    get heatMapBySectionDetails(): HiraHeatMap[] {

        return this._heatMapBySectionDetails;
    }

    @action
    setHeatMapBySourceDetails(response: HiraHeatMap[]) {
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
    get heatMapBySourceDetails(): HiraHeatMap[] {

        return this._heatMapBySourceDetails;
    }
  

}

export const HiraHeatMapStore = new Store();