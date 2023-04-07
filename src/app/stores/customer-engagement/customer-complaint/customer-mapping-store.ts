import { observable, action, computed } from "mobx-angular";
import { CustomerComplaintMapping } from "src/app/core/models/customer-satisfaction/customer-complaint/customer-complaint";

class Store {
   

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'customer_title';


    @observable
    individual_customer_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    projects=[];
    
    @observable
    locations=[];

    @observable
    products=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

    @observable
    mappingList: CustomerComplaintMapping ;


    @action
    setCustomerComplaintMapping(items){
        this.mappingList = items
        this.loaded = true;
       
    }

    @action
    unsetCustomerComplaintMapping(){
        this.mappingList = null;
        this.loaded = false;
    }

    @computed
    get mappingItemList() : CustomerComplaintMapping{
        return this.mappingList;
    }

   


}

export const CustomerMappingStore = new Store();