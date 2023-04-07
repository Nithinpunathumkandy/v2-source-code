import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Customers, CustomerResponse, CustomerDetails } from 'src/app/core/models/organization/business_profile/business-customers';
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    private _customerList: Customers[] = [];

    @observable
    private _selectedCustomerDetails: CustomerDetails;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private _imageDetails: Image = null;

    // @observable
    // preview_url: string;

    @observable
    private _brocureDetails: Image = null;

    // @observable
    // brochure_preview_url: string;

    @observable
    logo_preview_available = false;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable // String to perform Search on
    searchText: string = ''; 

    @observable
    saveSelected: boolean = false;

    @observable
    selectedCustomerList=[]

    @observable
    customer_select_form_modal: boolean=false;

    @action // Set Customer Details - Paginated Response
    setCustomerDetails(response: CustomerResponse) {
        this._customerList = response.data;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        this.loaded = true;
    }

    @computed // Returns Customer List
    get customerDetails(): Customers[] {
        return this._customerList.slice();
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    getCustomerById(id: number): Customers {
        return this._customerList.slice().find(e => e.id == id);
    }

    @action // Set File Details
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else{
            this._brocureDetails = details;
            // this.brochure_preview_url = url;
        }
    }

    addSelectedCustomer(customers){
        this.selectedCustomerList = customers;
    }

    @action // Unset File Details
    unsetFileDetails(type: string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
        else{
            this._brocureDetails = null;
            // this.brochure_preview_url = null;
        }
    }

    // Return File Details By Type
    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
        else
            return this._brocureDetails;
    }

    @action // Set Selected Customer Details
    setSelectedCustomerDetails(custDetails: CustomerDetails){
        this._selectedCustomerDetails = custDetails;
    }

    // Return Selected Customer Details
    get getSelectedCustomerDetails(): CustomerDetails{
        return this._selectedCustomerDetails;
    }

    unsetAllData(){
        this._customerList = [];
        this.itemsPerPage = null;
        this.totalItems = null;
        this.currentPage = 1;
        this.loaded = false;
    }
    
}

export const BusinessCustomersStore = new Store();