import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Designation,DesignationPaginationResponse,DesignationCompetency } from 'src/app/core/models/masters/human-capital/designation';

class Store {
    @observable
    private _designations: Designation[] = [];

    @observable
    private _competencies: DesignationCompetency[] = [];

    @observable
    private _individualDesignation: Designation;

    @observable
    loaded: boolean = false;

    @observable
    _designationLoaded: boolean = false;

    @observable
    _competencyLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'designations.order';

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @observable
    designationFilterList: Designation[];

    @observable
    lastInsertedId: number = null;

    @action
    setDesignations(response: DesignationPaginationResponse) {
       
        this._designations = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setDesignation(response: Designation) {
       
        this._individualDesignation = response;
        this._designationLoaded = true;
    }

    @action
    unsetDesignations() {
       
        this._designations = [];
        this.loaded = false;
    }

    @action
    unsetCompetencies() {
       
        this._competencies = [];
        this._competencyLoaded = false;
    }
    
    @action
    setCompetencies(response: DesignationCompetency[]) {
       
        this._competencies = response;
        this._competencyLoaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    updateDesignation(designation: Designation) {
        const designations: Designation[] = this._designations.slice();
        const index: number = designations.findIndex(e => e.id == designation.id);
        if (index != -1) {
            designations[index] = designation;
            this._designations = designations;
        }
    }

    @computed
    get designations(): Designation[] {
        
        return this._designations.slice();
    }
    
    @computed
    get competencies(): DesignationCompetency[] {
        
        return this._competencies.slice();
    }

    @action
    getDesignationById(id: number): Designation {
        return this._designations.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }
}

export const DesignationMasterStore = new Store();