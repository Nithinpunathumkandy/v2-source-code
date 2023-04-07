import { observable, action, computed } from "mobx-angular";

import { Section,SectionDetails,SectionPaginationResponse } from 'src/app/core/models/masters/organization/section';


class Store {
    @observable
    private _sectiontList: Section[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'sections.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    individualSection: SectionDetails;

    searchText: string;

    @observable
    _usersList= [];

    @observable
    itemsPerPageUser:number

    @observable
    totalUserItems:number

    @observable
    currentUserPage:number

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setSection(response: SectionPaginationResponse) {
        
        this._sectiontList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;

        this.loaded = true;
       
    }

    @action
    setAllSection(section: Section[]) {
       
        this._sectiontList = section;
        this.loaded = true;
        
    }
    @computed
    get allItems(): Section[] {
        
        return this._sectiontList.slice();
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
    getSectionById(id: number): Section {
        return this._sectiontList.slice().find(e => e.id == id);
    }

    @action
    setIndividualSection(section: SectionDetails) {
       
        this.individualSection =section;
        this.individualLoaded = true;
        // this.setUserList(section.section_users)
    }

    @action
    unsetSectionDetails(){
        this.individualSection=null
        this.individualLoaded=false
    }
  
    get individualSectionId(){
        return this.individualSection;
    } 

    @action
    setUserList(response) {
        this._usersList = response;
        this.itemsPerPageUser = 15;
        this.totalUserItems = response.length;
        this.currentUserPage = 1;
        this.loaded = true;
    }
}

export const SectionMasterStore = new Store();



