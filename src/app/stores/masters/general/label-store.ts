
import { observable, action, computed } from "mobx-angular";

import { Label, LabelPaginationResponse } from 'src/app/core/models/masters/general/label';


class Store {
    @observable
    private _labels: Label[] = [];

    @observable
    labelsToTranslate:any;

    @observable 
    loaded:boolean=false;

    @observable
    translateLabelsLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string ='label_title' ;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchTerm: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setLabel(response: LabelPaginationResponse) {
        

        this._labels = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    setAllLabels(label: Label[]) {
       
        this._labels = label;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): Label[] {
        
        return this._labels.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getLabelById(id: number): Label {
        return this._labels.slice().find(e => e.id == id);
    }

    setLabelsToTranslate(labels: any){
        this.labelsToTranslate = labels;
        this.translateLabelsLoaded = true;
    }

    get getLabelsToTranslate(){
        return this.labelsToTranslate;
    }
  
}

export const LabelMasterStore = new Store();

