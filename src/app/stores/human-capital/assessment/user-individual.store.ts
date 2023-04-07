import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentUser, ExcellentUserPaginationResponse, SummaryData } from 'src/app/core/models/human-capital/assessment/user-individual';
import { GoodUser, GoodUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import { AverageUser, AverageUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';
import { BelowAverageUser, BelowAverageUserPaginationResponse } from 'src/app/core/models/human-capital/assessment/user-individual';



class Store {

    @observable
    private _summary_data: SummaryData;
    
    @observable
    private _excellent_user: ExcellentUser[]=[];

    @observable
    private _good_user: GoodUser[]=[];

    @observable
    private _average_user: AverageUser[]=[];

    @observable
    private _below_average_user: BelowAverageUser[]=[];

    @observable
    excellent_currentPage: number = 1;

    @observable
    excellent_itemsPerPage: number = null;

    @observable
    excellent_totalItems: number = null;

    
    @observable
    good_currentPage: number = 1;

    @observable
    good_itemsPerPage: number = null;

    @observable
    good_totalItems: number = null;

   


    @observable
    average_currentPage: number = 1;

    @observable
    average_itemsPerPage: number = null;

    @observable
    average_totalItems: number = null;
    
    
    @observable
    below_currentPage: number = 1;

    @observable
    below_itemsPerPage: number = null;

    @observable
    below_totalItems: number = null;


    @observable
    orderBy: 'asc' | 'desc' = null;

   
    @observable
    excellent_loaded:boolean = false;

    @observable
    good_loaded:boolean = false;

    @observable
    average_loaded:boolean = false;

    @observable
    below_loaded:boolean = false;

    @observable
    excellent_status: string='Inactive';

    @observable
    good_status: string='Inactive';

    @observable
    average_status: string='Inactive';

    @observable
    below_status: string='Inactive';

    @observable
    total_count:number = null;

    @observable
    excellent_count:number = null;

    @observable
    good_count:number = null;

    @observable
    average_count:number = null;

    @observable
    below_average_count:number = null;
    
    @observable
    summary_loaded:boolean = false;

    @action
    setSummaryData(response: SummaryData) {
        
        this._summary_data = response;
        this.total_count = response.total_count;
        this.excellent_count = response.excellent_count;
        this.good_count = response.good_count;
        this.average_count = response.average_count;
        this.below_average_count = response.below_average_count;
        this.summary_loaded = true;
        UserIndividualStore.excellent_status = 'Active';
    }
    
    @action
    setExcellentUsers(response: ExcellentUserPaginationResponse) {
        
        this._excellent_user = response.data;
        this.excellent_currentPage = response.current_page;
        this.excellent_itemsPerPage = response.per_page;
        this.excellent_totalItems = response.total;
        this.excellent_loaded = true;
        
    }

    @action
    setGoodUsers(response: GoodUserPaginationResponse) {
        
        this._good_user = response.data;
        this.good_currentPage = response.current_page;
        this.good_itemsPerPage = response.per_page;
        this.good_totalItems = response.total;
        this.good_loaded = true;
    }


    @action
    setAverageUsers(response: AverageUserPaginationResponse) {
        
        this._average_user = response.data;
        this.average_currentPage = response.current_page;
        this.average_itemsPerPage = response.per_page;
        this.average_totalItems = response.total;
        this.average_loaded = true;
    }


    @action
    setBelowAverageUsers(response: BelowAverageUserPaginationResponse) {
        
        this._below_average_user = response.data;
        this.below_currentPage = response.current_page;
        this.below_itemsPerPage = response.per_page;
        this.below_totalItems = response.total;
        this.below_loaded = true;
    }


    @action
    setExcellentCurrentPage(current_page: number) {
        this.excellent_currentPage = current_page;
    }

    @action
    setGoodCurrentPage(current_page: number) {
        this.excellent_currentPage = current_page;
    }

    @action
    setAverageCurrentPage(current_page: number) {
        this.excellent_currentPage = current_page;
    }

    @action
    setBelowAverageCurrentPage(current_page: number) {
        this.excellent_currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get summaryData(): SummaryData {
        
        return this._summary_data;
    }

    @computed
    get excellentUser(): ExcellentUser[] {
        
        return this._excellent_user;
    }

    @computed
    get goodUser(): GoodUser[] {
        
        return this._good_user;
    }

    @computed
    get averageUser(): AverageUser[] {
        
        return this._average_user;
    }

    @computed
    get belowAverageUser(): BelowAverageUser[] {
        
        return this._below_average_user;
    }
  
}

export const UserIndividualStore = new Store();