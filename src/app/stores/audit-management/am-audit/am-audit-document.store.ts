import { observable, action, computed } from "mobx-angular";
import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
import { AmAuditDocument, AmAuditDocumentPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit-document";
// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
// import { AmAuditDocument, AmAuditDocumentPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-commencement-document';
import { Image } from "src/app/core/models/image.model";
class Store {
    @observable
    private _auditDocuments = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    private _individualAuditDocument: AmAuditDocument;

    @observable
    individual_document_loaded: boolean = false;

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
    documentId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @action
    setAuditDocuments(response: AmAuditDocumentPaginationResponse) {
        this._auditDocuments = response.data;
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
    get auditDocuments(){

        return this._auditDocuments.slice();
    }

    getAuditById(id: number): AmAudit {
        let auditDocument;

        auditDocument = this._auditDocuments.slice().find(e => e.id == id);
        this.setIndividualDocumentDetails(auditDocument);
        return auditDocument;
    }

    @action
    setIndividualDocumentDetails(details:AmAuditDocument) {
        this.individual_document_loaded = true;
        this._individualAuditDocument = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalAuditDocument() {
        this._individualAuditDocument = null;
        this.individual_document_loaded = false;
    }

    setAuditDocumentId(id){
        this.documentId = id;
    }

    unseAuditDocumentId(){
        this.documentId = null;
    }

   
    @computed
    get individualAuditDocument(): AmAuditDocument {
        return this._individualAuditDocument;
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

export const AmAuditDocumentStore = new Store();