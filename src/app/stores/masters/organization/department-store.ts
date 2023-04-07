import { observable, action, computed } from "mobx-angular";

import { Department,DepartmentDetails,DepartmentPaginationResponse } from 'src/app/core/models/masters/organization/department';


class Store {
    @observable
    private _departmentList: Department[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 30;

    @observable
    individualDepartment: DepartmentDetails;

    @observable
    orderItem: string = 'departments.created_at';
    


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

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
    setIndividualDepartment(department: DepartmentDetails) {
       
        this.individualDepartment = department;
        this.individualLoaded = true;
        this.setUserList(department.department_users)
    }

    @action
    unsetDepartmentDetails(){
        this.individualDepartment=null
        this.individualLoaded=false
    }

    @action
    setDepartment(response: DepartmentPaginationResponse) {
        
        this._departmentList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;

        this.loaded = true;
       
    }


    @action
    setAllDepartment(audit: Department[]) {
       
        this._departmentList = audit;
        this.loaded = true;
        
    }


    @computed
    get allItems(): Department[] {
        
        return this._departmentList.slice();
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
    getDepartmentById(id: number): Department {
        return this._departmentList.slice().find(e => e.id == id);
    }


    get individualDepartmentId(){
        return this.individualDepartment;
    } 

    @action
    setCurrentUserPage(current_page: number) {
        this.currentUserPage = current_page;
    }

    @action
    setUserList(response) {
        this._usersList = response;
        this.itemsPerPageUser = 15;
        this.totalUserItems = response.length;
        this.currentUserPage = 1;
        this.loaded = true;
    }

    get userList(){
        return this._usersList
    }
  
}

export const DepartmentMasterStore = new Store();


