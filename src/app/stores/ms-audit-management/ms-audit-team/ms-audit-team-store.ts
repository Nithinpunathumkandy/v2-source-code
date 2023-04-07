import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { IndividualTeam, MsAuditTeam, MsAuditTeamPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-team/ms-audit-team";
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _MsAuditTeam: MsAuditTeam[] = [];

    @observable
    individualTeamItem: IndividualTeam;

    @observable
    individualLoaded: boolean = false;

    @observable
    document_preview_available = false;

    @observable
    preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    selected_preview_url: string;

    @observable
    msAuditTeamsId: number = null;

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
    orderItem: string = 'teams.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

    @action
    setMsAuditTeam(response: MsAuditTeamPaginationResponse) {
        this._MsAuditTeam = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMsAuditTeam() {
        this._MsAuditTeam = [];
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this.itemsPerPage = null;
        this.orderItem='';
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
    setIndividualMsAuditTeam(CorrectiveAction: IndividualTeam) {
        this.individualTeamItem = CorrectiveAction;
        this.individualLoaded = true;
    }

    @action
    unsetIndividualMsAuditTeam() {
        this.individualTeamItem = null;
        this.individualLoaded = false;
    }

    @computed
    get msAuditTeamDetails() : IndividualTeam{
        return this.individualTeamItem;
    }

    @computed
    get allItems(): MsAuditTeam[] {
        return this._MsAuditTeam.slice();
    }

    @action
    setSelectedImageDetails(imageDetails) {
        this.selected_preview_url = imageDetails;
    }


    @action // Set File Details
    setFileDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
        }
    }

    @action
    clearFileDetails() {
        this._imageDetails = null;
        this.preview_url = null;
    }

    @action // Unset File Details
    unsetFileDetails(type: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                // this._imageDetails['is_deleted'] = true;
                this._imageDetails = null;
                this.preview_url = null;
            }
        }
    }

    @computed
    get getImageDetails(): Image {
        return this._imageDetails
    }

    getFileDetailsByType(type: string): Image {
        if (type == 'logo')
            return this._imageDetails;
    }

    @action
    getMsAuditTeamById(id: number): MsAuditTeam {
        return this._MsAuditTeam.slice().find(e => e.id == id);
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

    @action
    setMsAuditTeamsId(id: number) {
        this.msAuditTeamsId = id;
    }


}

export const MsAuditTeamStore = new Store();