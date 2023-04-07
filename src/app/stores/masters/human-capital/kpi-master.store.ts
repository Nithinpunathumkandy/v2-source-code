import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Kpi,KpiPaginationResponse } from 'src/app/core/models/masters/human-capital/user-kpi';
import { KpiCategory } from 'src/app/core/models/masters/human-capital/kpi-category';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _kpiCategories: KpiCategory[]=[];

    @observable
    private _kpis: Kpi[]=[];;

    @observable
    loaded: boolean = false;

    @observable
    frequency_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    document_preview_available: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'kpis.created_at';

    searchText: string;

    @observable
    from: number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _individualKpiDetails: Kpi;

    @observable
    individual_kpi_loaded: boolean = false;

    @observable
    lastInsertedId: number = null;
   


    @action
    setKpiCategories(response: KpiCategory[]) {
        this._kpiCategories = response;
        
        this.frequency_loaded = true;
    }

    
    @computed
    get kpiCategories(): KpiCategory[] {

        return this._kpiCategories.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }


    @action
    setKpis(response: KpiPaginationResponse) {
        this._kpis = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    
    @computed
    get kpis(): Kpi[] {

        return this._kpis.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        
            this._documentDetails.push(details);
            this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
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
    setIndividualKpiDetails(details) {
        this.individual_kpi_loaded = true;
        this._individualKpiDetails = details;

    }

    unsetIndiviudalJobDetails() {
        this._individualKpiDetails = null;
        this.individual_kpi_loaded = false;
    }

    @computed
    get individualKpiDetails(): Kpi {
        return this._individualKpiDetails;
    }

    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    getKpiItemById(id: number):Kpi{
        return this._kpis.find(e=>e.id == id);
    }
    
}

export const KpiMasterStore = new Store();