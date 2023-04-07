
import { observable, action, computed } from "mobx-angular";

import { ByYear,ByYearPaginationResponse } from 'src/app/core/models/internal-audit/annual-plan/by-year/by-year';


class Store {
    @observable
    private _byYears: ByYear[] = [];

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
    settByYear(response: ByYearPaginationResponse) {
        

        this._byYears = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }



    @action
    setAlltByYears(byYears: ByYear[]) {
       
        this._byYears = byYears;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ByYear[] {
        
        return this._byYears.slice();
    }
    @action
    getByYearById(id: number): ByYear {
        return this._byYears.slice().find(e => e.id == id);
    }
    get selectedItem():number{
        return this.selected;
    }

  
}

export const ByYearsStore = new Store();

