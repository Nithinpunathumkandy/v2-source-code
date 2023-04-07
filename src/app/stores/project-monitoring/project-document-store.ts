import { observable, action, computed } from "mobx-angular";
import { IndividualProjectDocument, ProjectDocument, ProjectDocumentPaginationResponse } from "src/app/core/models/project-management/project-details/project-document/project-document";


class Store {
    @observable
    private _projectDocument: ProjectDocument[] = [];

    @observable
    private _individualProjectDocument: IndividualProjectDocument;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_document_title.created_at';

    @observable
    individualLoaded: boolean = false;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setProjectDocument(response: ProjectDocumentPaginationResponse) {
        this._projectDocument = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setIndividualProjectDocument(indivitual: IndividualProjectDocument) {       
    this._individualProjectDocument = indivitual;
    this.individualLoaded = true;
    
    }

    @computed
    get allItems(): ProjectDocument[] {
        return this._projectDocument.slice();
    }

    @computed
    get indivitualProjectDocument(){
        return this._individualProjectDocument
    }

    @action
    unsetIndivitualProjectDocument() {       
        this._individualProjectDocument = null;
        this.individualLoaded = false;   
    }
  
}


export const ProjectDocumentStore = new Store();

