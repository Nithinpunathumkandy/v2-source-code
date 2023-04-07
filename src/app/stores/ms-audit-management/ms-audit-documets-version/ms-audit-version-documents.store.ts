import { observable, action, computed } from "mobx-angular";
import { MsDocumentDetails, MsDocumentsPaginationResponse, MsDocumentsVersions } from "src/app/core/models/ms-audit-management/ms-audit-check-list/ms-audit-check-list";

class Store {

    

    @observable
    private _msDocumentsLists: MsDocumentsVersions[] = [];

    @observable
    private _msDocumentVersionContent: MsDocumentDetails[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    selectedDocuments = []

    @action
    setMsAuditDocumentVersionLists(response : MsDocumentsPaginationResponse){
        this._msDocumentsLists = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action setMsAuditDocumentVersionListsAll(response:any)
    {
      this._msDocumentsLists = response;
    }
    
    @action
    setMsDocumentVersionContents(details:MsDocumentDetails[]){
      this._msDocumentVersionContent = details
      this.individualLoaded = true;
    }
    @action
    setSelectedDocuments(data){
        if(this.selectedDocuments.length > 0){
            let pos = this.selectedDocuments.findIndex(e=>e == data.id)
               if(pos != -1){
                 this.selectedDocuments.splice(pos,1)
               }else{
                 this.selectedDocuments.push(data.id)
               }
             
           }else {
             this.selectedDocuments.push(data.id)
           }   
    }

    checkSelectedStatus(data) {
        var pos = null;
        pos = this.selectedDocuments.findIndex(e => e == data.id);
        if (pos != -1) 
         return true;
         else return false;
      }
    

    @computed
    get msAuditDocumentLists() {
    return this._msDocumentsLists
}

@computed
get msDocumentVersionContents():MsDocumentDetails[] {
    return this._msDocumentVersionContent
}
}
export const MsAuditDocumetsVersionStore = new Store()