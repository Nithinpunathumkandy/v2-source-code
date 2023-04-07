import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';

import { Image } from "src/app/core/models/image.model";
import { AuditChecklistGroup,AuditChecklistGroupPaginationResponse, AuditChecklistGroupSingle } from "src/app/core/models/masters/ms-audit-management/ms-audit-checklist-group";

class Store {
    @observable
    private _auditChecklistGroup: AuditChecklistGroup[] = [];

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
    orderItem: string = 'created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'desc' | 'asc' = 'desc';

    @observable
    logo_preview_available = false;

    @observable
    private _imageDetails: Image = null;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable
    add_supplier_modal: boolean = false;

    @observable
    lastInsertedProcessCategory: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualAuditChecklistGroup: AuditChecklistGroupSingle;
    

    // @observable // Boolean flag to decide form opened for add / edit
    // addOrEditFlag = false;

    searchText: string;

    @action
    setAuditChecklistGroup(response: AuditChecklistGroupPaginationResponse) {
        this._auditChecklistGroup = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setAllAuditChecklistGroupPaginationResponse(res:AuditChecklistGroup[]){
        this._auditChecklistGroup = res
    }

    @action
    setIndividualAuditChecklistGroup(auditMode: AuditChecklistGroupSingle) {
        this.individualAuditChecklistGroup = auditMode;
        this.individualLoaded = true;  
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'desc' | 'asc') {
        this.orderBy = order_by;
    }


    // @action
    // updateAuditChecklistGroup(type: AuditChecklistGroupSingle) {
    //     const types: AuditChecklistGroupSingle[] = this._auditChecklistGroup.slice();
    //     const index: number = types.findIndex(e => e.id == type.id);
    //     if (index != -1) {
    //         types[index] = type;
    //         this._auditChecklistGroup = types;
    //     }
    // }

    @computed
    get auditChecklistGroup(): AuditChecklistGroup[] {

        return this._auditChecklistGroup.slice();
    }
    @computed
    get allItems(): AuditChecklistGroup[] {

        return this._auditChecklistGroup.slice();
    }

    @action
    getAuditChecklistGroupById(id: number): AuditChecklistGroup {
        return this._auditChecklistGroup.slice().find(e => e.id == id);
    }
    @action
    unsetFile(){
        this._imageDetails=null;
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action // Set File Details
    setFileDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            // this.preview_url = url;
        }
    }

    @action // Unset File Details
    unsetFileDetails(type: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
    }

    // Return File Details By Type
    getFileDetailsByType(type: string): Image {
        if (type == 'logo')
            return this._imageDetails;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

}

export const AuditChecklistGroupMasterStore = new Store();