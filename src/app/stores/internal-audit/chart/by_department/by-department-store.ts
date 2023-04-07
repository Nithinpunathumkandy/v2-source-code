
import { observable, action, computed } from "mobx-angular";

import { ByDepartment} from 'src/app/core/models/internal-audit/chart/by_department/by_department';


class Store {
    @observable
    private _by_departments: ByDepartment[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'auditors_title';

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

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    // @action
    // setAvailableAuditor(response: AvailableAuditorsPaginationResponse) {
        

    //     this._availableAuditors = response.data;
    //     this.currentPage = response.current_page;
    //     this.itemsPerPage = response.per_page;
    //     this.totalItems = response.total;
    //     this.from = response.from;
    //     this.loaded = true;
       
    // }

    @action
    setAllDepartmentChartData(auditors: ByDepartment[]) {
       
        this._by_departments = auditors;
        this.loaded = true;
        
    }
    
    @computed
    get allItems(): ByDepartment[] {
        
        return this._by_departments.slice();
    }
   

    
  
}

export const ByDepartmentChartStore = new Store();

