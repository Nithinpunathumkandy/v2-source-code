import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { DocumentReviewFrequencies, DocumentReviewFrequenciesPagination } from 'src/app/core/models/masters/knowledge-hub/document-review-frequencies';

class Store {
    @observable
    private _documentReviewFrequencies: DocumentReviewFrequencies[] = [];

    @observable
    loaded: boolean = false;
    
    @observable
    allLoaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'document_review_frequencies.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @computed
    get allItems(): DocumentReviewFrequencies[] {
        return this._documentReviewFrequencies.slice();
    }

    @action
    setDocumentReviewFrequencies(response: DocumentReviewFrequenciesPagination) {
        this._documentReviewFrequencies = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
    }

}

export const DocumentReviewFrequenciesMasterStore = new Store();