import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { AmCSA, AmCSAPaginationResponse } from "src/app/core/models/audit-management/am-csa/am-csa";
class Store {
    @observable
    private _csaList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'am_csa.reference_code';

    @observable
    private _individualCSADetails: AmCSA;

    @observable
    individual_csa_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    searchText: string;

    @observable
    csaId:number = null;

    @observable
    lastInsertedId:number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    currentAssessment = null;


    @action
    setCSADetails(response: AmCSAPaginationResponse) {
        this._csaList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }



    @computed
    get csa(){

        return this._csaList.slice();
    }

    getCSAById(id: number): AmCSA {
        let auditList;

        auditList = this._csaList.slice().find(e => e.id == id);
        this.setIndividualCSADetails(auditList);
        return auditList;
    }

    @action
    setIndividualCSADetails(details:AmCSA) {
        this.individual_csa_loaded = true;
        this._individualCSADetails = details;
    }

    unsetIndiviudalCSADetails() {
        this._individualCSADetails = null;
        this.individual_csa_loaded = false;
    }



    @computed
    get individualCSADetails(): AmCSA {
        return this._individualCSADetails;
    }


    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;

    }

    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    setCSAId(id){
        this.csaId = id;
    }

    unsetCSAId(){
        this.csaId = null;
    }


}

export const AmCSAStore = new Store();