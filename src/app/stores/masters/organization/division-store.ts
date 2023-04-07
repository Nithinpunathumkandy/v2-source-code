import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Departments, Division,DivisionPaginationResponse } from 'src/app/core/models/masters/organization/division';

class Store {
    @observable
    private _divisions: Division[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    individualDivision: Division;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'division.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setDivision(response: DivisionPaginationResponse) {
        
        this._divisions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllDivision(division: Division[]) {
        
        this._divisions = division;
        this.loaded = true;
        
    }

    @action
    setIndividualDivision(division: Division) {
        this.individualDivision = division;
        this.individualLoaded = true;
        this.setDepartmentList(division.departments);
    }

    @action
    unsetIndividualDivision() {
        this.individualDivision = null;
        this.individualLoaded = false;
    }

    @computed
    get individualDivisionDetials(): Division {
        return this.individualDivision;
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
    updateDivision(type: Division) {
        const types: Division[] = this._divisions.slice();
        const index: number = types.findIndex(e => e.id == type.id);
        if (index != -1) {
            types[index] = type;
            this._divisions=types;
        }
    }

    @computed
    get allItems(): Division[] {
        return this._divisions.slice();
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getDivisionById(id: number): Division {
        return this._divisions.slice().find(e => e.id == id);
    }

    get individualDivisionId(){
        return this.individualDivision;
    } 

    @observable
    currentDepartmentPage: number = 1;

    @observable
    _departmentList: Departments[] = [];

    @observable
    itemsPerPageDepartment: number = null;

    @observable
    totalDepartmentItems: number = null;

    @action
    setCurrentDepartmentPage(current_page: number) {
        this.currentDepartmentPage = current_page;
    }

    @action
    setDepartmentList(response) {
        this._departmentList = response;
        this.itemsPerPageDepartment = 15;
        this.totalDepartmentItems = response.length;
        this.currentDepartmentPage = 1;
    }   

    get departmentList(){
        return this._departmentList;
    }

}

export const DivisionMasterStore = new Store();