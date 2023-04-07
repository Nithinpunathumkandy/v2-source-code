
import { observable, action, computed } from "mobx-angular";

import { ByDepartment,ByDepartmentPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-department/by-department';


class Store {
    @observable
    private _byDepartments: ByDepartment[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    $observable
    selected: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

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
    setSelected(value:number){
        this.selected = value;
    }

    @action
    setByDepartments(response: ByDepartmentPaginationResponse) {
        

        this._byDepartments = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }



    @action
    setAllByDepartments(byDepartments: ByDepartment[]) {
       
        this._byDepartments = byDepartments;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ByDepartment[] {
        
        return this._byDepartments.slice();
    }
    @action
    getByDepartmentsById(id: number): ByDepartment {
        return this._byDepartments.slice().find(e => e.id == id);
    }
    get selectedItem():number{
        return this.selected;
    }

  
}

export const ByDepartmentsStore = new Store();

