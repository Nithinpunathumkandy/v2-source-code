import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ControlEfficiencyMeasures,ControlEfficiencyMeasuresPaginationResponse,ControlEfficiencyMeasuresSingle } from 'src/app/core/models/masters/risk-management/control-efficiency-measures';

class Store {
    @observable
    private _controlEfficiencyMeasures: ControlEfficiencyMeasures[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualControlEfficiencyMeasures: ControlEfficiencyMeasuresSingle;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'control_efficiency_measures_language.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setControlEfficiencyMeasures(response: ControlEfficiencyMeasuresPaginationResponse) {
        
        this._controlEfficiencyMeasures = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setAllControlEfficiencyMeasures(controlEfficiencyMeasures: ControlEfficiencyMeasures[]) {
       
        this._controlEfficiencyMeasures = controlEfficiencyMeasures;
        this.loaded = true;
        
    }

    @action
    setIndividualControlEfficiencyMeasures(controlEfficiencyMeasures: ControlEfficiencyMeasuresSingle) {
       
        this.individualControlEfficiencyMeasures = controlEfficiencyMeasures;
        this.individualLoaded = true;
        
    }


    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }



    @computed
    get allItems(): ControlEfficiencyMeasures[] {
        return this._controlEfficiencyMeasures.slice();
    }

   
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getControlEfficiencyMeasuresById(id: number): ControlEfficiencyMeasures {
        return this._controlEfficiencyMeasures.slice().find(e => e.id == id);
    }

    get individualControlEfficiencyMeasuresId(){
        return this.individualControlEfficiencyMeasures;
    } 

}

export const ControlEfficiencyMeasuresMasterStore = new Store();