import { observable, action, computed } from "mobx-angular";

import { SubSection,SubSectionPaginationResponse } from 'src/app/core/models/masters/organization/sub-section';


class Store {
    @observable
    private _subSectiontList: SubSection[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'sub_sections.created_at';


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSubSection(response: SubSectionPaginationResponse) {
        
        this._subSectiontList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;

        this.loaded = true;
       
    }

    @action
    setAllSubSection(subSection: SubSection[]) {
       
        this._subSectiontList = subSection;
        this.loaded = true;
        
    }
    @computed
    get allItems(): SubSection[] {
        
        return this._subSectiontList.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get LastInsertedId():number{
        if(this.lastInsertedId) 
            return this.lastInsertedId;
        else 
            return null;
    }

    @action
    getSubSectionById(id: number): SubSection {
        return this._subSectiontList.slice().find(e => e.id == id);
    }
   
}

export const SubSectionMasterStore = new Store();



