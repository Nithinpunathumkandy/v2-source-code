import { action, computed, observable } from "mobx-angular";
import { MsAuditDoc } from "src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/ms-document";


class Store{

    @observable
    private _msAuditDoc: MsAuditDoc[] = [];

    @observable
    docUrlList=[];

    @observable
    urlList = [];

    @observable
    documentList = [];

    @observable
    docLoaded: boolean = false;


    @action
    setMsAuditDoc(response: MsAuditDoc[]) {
        this._msAuditDoc = response;      
        this.docLoaded = true;
        this.resetData();
        this.processedData();
    }

    @action
    unSetMsAuditDoc(){
        this.docLoaded = false;
        this._msAuditDoc = [];
        this.resetData();
    }

    @computed
    get allItems(): MsAuditDoc[] {
        return this._msAuditDoc
    }

    @action  
    processedData(){
        this.urlList = this._msAuditDoc.filter(x => x.external_link != null);
        this.documentList = this._msAuditDoc.filter(x => x.external_link == null);
    }

    @action
    resetData(){
        this.urlList = [];
        this.documentList = [];
    }

}
export const MsAuditDocStore = new Store();