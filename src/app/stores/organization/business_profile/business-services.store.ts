import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { BusinessServices, BusinessServiceCategories, ServicesPaginatedResponse, BusinessServiceDetails } from 'src/app/core/models/organization/business_profile/business-services';

class Store {
    @observable
    private _servicesList: BusinessServices[] = [];

    @observable
    private _serviceDetails: BusinessServiceDetails = null;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private _serviceCategoryList: BusinessServiceCategories[] = [];

    @observable
    loaded: boolean = false;

    @observable
    add_service_category_modal: boolean = false

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable
    lastInsertedServiceCategory: number = null;

    @observable
    selectedBusinessServicesList: BusinessServices[] = [];

    @observable
    saveSelected: boolean = false;

    @observable
    service_select_form_modal: boolean = false;

    @action // Set services list
    setServicesDetails(services: ServicesPaginatedResponse) {
        this.loaded = true; 
        this._servicesList = services.data;
        this.currentPage = services.current_page;
        this.itemsPerPage = services.per_page;
        this.totalItems = services.total;
    }

    @computed // Return services list
    get servicesDetails(): BusinessServices[] {
        return this._servicesList.slice();
    }

    @action
    setServiceItem(service){
        this._serviceDetails = service;
    }

    @computed
    get serviceDetails():BusinessServiceDetails{
        return this._serviceDetails;
    }

    @action // Set services categories
    setServiceCategoryDetails(servCatg: BusinessServiceCategories[]) {
        this._serviceCategoryList = servCatg;
    }

    @computed // Return service categories
    get serviceCategoryDetails(): BusinessServiceCategories[] {
        return this._serviceCategoryList.slice();
    }

    @action // Sets current page for pagination
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    // Get Service details by id
    getServiceDetails(id: number): BusinessServices {
        return this._servicesList.slice().find(e => e.id == id);
    }

    @action // Clear Services List
    clearServicesList(){
        this._servicesList = [];
        this.loaded = false;
        this.currentPage = 1;
        this.itemsPerPage = null;
        this.totalItems = null;
    }

    @action
    setLastInsertedServiceCategory(serviceCategoryId: number){
        this.lastInsertedServiceCategory = serviceCategoryId;
    }

    get lastInsertedServiceCategoryId():number{
        if(this.lastInsertedServiceCategory) 
            return this.lastInsertedServiceCategory;
        else 
            return null;
    }
    
    @action
    addSelectedServices(services){
        this.selectedBusinessServicesList = services;
    }

    unsetSelectedServices(){
        this.selectedBusinessServicesList = [];
    }
}

export const BusinessServiceStore = new Store();