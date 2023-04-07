import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { BcmTemplate, BcmTemplatePaginationResponse, IndividualBcmTemplate } from "src/app/core/models/bcm/bcm-template/bcm-template";
import { Image } from "@amcharts/amcharts4/core";

class Store {
    @observable
    private _bcmTemplate: BcmTemplate[] = [];

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
    document_preview_available = false;

    @observable
    selected_preview_url: string;

    @observable
    preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    orderItem: string = 'bcm_template.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    // @observable
    // bcmTemplateDetails: any;

    @observable
    bcmTemplateId: number;

    @observable
    individualBcmTemplate: IndividualBcmTemplate;

    @observable
    individualLoaded: boolean = false;

    @observable
    searchText: string;

    @observable
    selectedBcmTemplateList: BcmTemplate[] = [];

    @observable
    saveSelected: boolean = false;

    @observable
    bcm_template_select_form_modal: boolean = false;

    @action
    setBcmTemplate(response: BcmTemplatePaginationResponse) {

        this._bcmTemplate = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetBcmTemplate() {
        this._bcmTemplate = [];
        this.loaded = false;
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
    setIndividualBcmTemplate(Template: IndividualBcmTemplate) {
        this.individualBcmTemplate = Template;
        this.individualLoaded = true;
    }

    @action
    unsetIndividualBcmTemplate() {
        this.individualBcmTemplate = null;
        this.individualLoaded = false;
    }

    get bcmTemplateDetails() {
        return this.individualBcmTemplate;
    }


    @computed
    get allItems(): BcmTemplate[] {

        return this._bcmTemplate.slice();
    }

    @action
    getBcmTemplateById(id: number): BcmTemplate {
        return this._bcmTemplate.slice().find(e => e.id == id);
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
    setSelectedImageDetails(imageDetails) {

        this.selected_preview_url = imageDetails;
    }

    getFileDetailsByType(type: string): Image {
        if (type == 'logo')
            return this._imageDetails;
    }

    @action // Unset File Details
    unsetFileDetails(type: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
    }

    @action // Set File Details
    setFileDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            // this.preview_url = url;
        }
    }

    @computed
    get getImageDetails(): Image {
        return this._imageDetails
    }

    @action
    clearFileDetails() {
        this._imageDetails = null;
        this.preview_url = null;
    }

    @action
    addSelectedBcmTemplate(issues) {
        this.selectedBcmTemplateList = issues;
    }

    unsetSelectedBcmTemplate() {
        this.selectedBcmTemplateList = [];
    }
}

export const BcmTemplateStore = new Store();