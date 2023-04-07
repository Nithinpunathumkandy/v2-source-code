
import { Image } from '@amcharts/amcharts4/core';
import { action, computed, observable} from 'mobx';
import { Findings, FindingsPaginationResponse, QuickCorrection } from 'src/app/core/models/non-conformity/findings';

class Store {
    @observable
    private _findings: Findings[] = [];

    @observable
    individualFindings: Findings;

    @observable
    individualCorrections: QuickCorrection;

    @observable
    selectedFindingsDetails: Findings;

    @observable
    individualLoaded: boolean = false;

    @observable
    _selectedNonConformityItemAll: Findings[] = [];

    @observable
    saveSelected:boolean=false;

    @observable
    no_Conformity_finding_select_form_modal:boolean=false;
    
    @observable
    FindingsId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'findings.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    findingsDetails: any;

    @observable
    private _documentDetails: Image = null;

    @observable
    preview_url: string;

    searchText: string;

    @action
    setFindings(response: FindingsPaginationResponse) {

        this._findings = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetFindings() {
        this._findings = [];
        this.loaded = false;
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = null;
        this.preview_url = null;
    }

    @action
    setDocumentDetails(details: Image,url: string) {
            this._documentDetails = details;
            this.preview_url = url;
    }
    @action
    unsetDocumentDetails(token?:string){
            if (this._documentDetails.hasOwnProperty('is_new')) {
                this._documentDetails = null;
                this.preview_url = null;
            }
            else {
                this._documentDetails['is_deleted'] = true;             
            }   
    }

    @action
    unsetIndividualFindingsItem() {     
        this.individualFindings = null;
        this.individualLoaded = false;       
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
    setFindingsId(id: number) {
        this.FindingsId = id;

    }
    @computed
    get selectedItem():number{
        return this.FindingsId;
    }


    @action
    updateFindings(type: Findings) {
        // const types: Findings[] = this._findings.slice();
        // const index: number = types.findIndex(e => e.id == type.id);
        // if (index != -1) {
        //     types[index] = type;
        //     this._findings = types;
        // }
        this.individualFindings=type;
        this.individualLoaded=true;
    }
    @action
    updateQuickCorrection(type: QuickCorrection) {
        this.individualCorrections=type;
    }

    @computed
    get findings(): Findings[] {

        return this._findings.slice();
    }
    @computed
    get allItems(): Findings[] {

        return this._findings.slice();
    }

    @action
    getFindingsById(id: number): Findings {
        return this._findings.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    get findingDetails(){
        return this.individualFindings;
    }

    get QuickCorrectionDetails(){
        return this.individualCorrections;
    }  
    
    @action
    addSelectedFinding(items){
        this._selectedNonConformityItemAll = items;
    }
}

export const FindingsStore = new Store();