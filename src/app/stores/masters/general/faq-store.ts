import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Faq,FaqPaginationResponse,FaqSingle } from 'src/app/core/models/masters/general/faq';

class Store {
    @observable
    private _faq: Faq[] = [];

    @observable
    private _searchFaq: Faq[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualFaq: FaqSingle;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    lastInsertedId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'faq_language';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    searchText: string;

    @action
    setFaq(response: FaqPaginationResponse) {
        
        this._faq = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setSearchFaq(response: Faq[]) {
        
        this._searchFaq = response;
        
    }

    @action
    setAllFaq(faq: Faq[]) {
       
        this._faq = faq;
        this.loaded = true;
        
    }
    

    @action
    setIndividualFaq(faq: FaqSingle) {
       
        this.individualFaq = faq;
        this.individualLoaded = true;
        
    }

    getFaqById(id: number):Faq{
        return this._faq.slice().find(e => e.id == id);
    }


    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

    @action
    setOrderBy(orderBy: 'asc' | 'desc') {
        this.orderBy = orderBy;
    }



    @computed
    get allItems(): Faq[] {
        //return this._faq;
        return this._faq.slice();
    }

    @computed
    get allItemsSearch(): Faq[] {
        //return this._faq;
        return this._searchFaq.slice();
    }

  

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    get individualFaqId(){
        return this.individualFaq;
    } 

}

export const FaqMasterStore = new Store();