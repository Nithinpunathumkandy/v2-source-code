import { observable, action, computed } from "mobx-angular";
import { AmInformationRequest, AmInformationRequestPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-information-request";
import { Image } from "src/app/core/models/image.model";
class Store {
    @observable
    private _auditList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'am_information_requests.reference_code';

    @observable
    private _individualRequestDetails: AmInformationRequest;

    @observable
    individual_request_loaded: boolean = false;

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
    auditId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @action
    setAuditDetails(response: AmInformationRequestPaginationResponse) {
        this._auditList = response.data;
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
    get requests(){

        return this._auditList.slice();
    }

    getAuditById(id: number): AmInformationRequest {
        let auditList;

        auditList = this._auditList.slice().find(e => e.id == id);
        this.setIndividualAuditDetails(auditList);
        return auditList;
    }

    @action
    setIndividualAuditDetails(details:AmInformationRequest) {
        this.individual_request_loaded = true;
        this._individualRequestDetails = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalAuditDetails() {
        this._individualRequestDetails = null;
        this.individual_request_loaded = false;
    }
   
    @computed
    get requestDetails(): AmInformationRequest {
        return this._individualRequestDetails;
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


}

export const AmAuditInformationRequestStore = new Store();